const Disease = require("../models/Disease");
const Weather = require("../models/Weather");
// const SustainableMethod = require("../models/SustainableMethod"); // Đảm bảo import nếu dùng

exports.handleWebhook = async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters || {};
  const queryText = req.body.queryResult.queryText || ""; // Câu người dùng gõ
  let responseText =
    "Xin lỗi, tôi chưa hiểu. Hãy hỏi về bệnh lúa, thời tiết, hoặc biện pháp chữa trị.";

  try {
    // 1. HỎI VỀ BỆNH LÚA – TÌM KIẾM THÔNG MINH NHẤT
    if (
      intent === "Ask_Disease" ||
      intent === "Ask_Disease_Symptom" ||
      intent === "Ask_Disease_Treatment"
    ) {
      // Lấy từ khóa từ parameter hoặc dùng toàn bộ câu hỏi
      let rawInput = (parameters.disease || parameters.any || queryText || "")
        .toString()
        .toLowerCase()
        .trim();

      // Loại bỏ các từ thừa để tìm chính xác hơn
      const noiseWords = [
        "bệnh",
        "sâu",
        "cây",
        "lúa",
        "trên",
        "là gì",
        "làm sao",
        "thế nào",
        "cách chữa",
        "chữa",
        "bị",
        "có",
        "không",
        "ở",
        "tại",
        "ruộng",
        "đồng",
        "miền tây",
      ];
      let cleanInput = rawInput;
      noiseWords.forEach((word) => {
        cleanInput = cleanInput
          .replace(new RegExp("\\b" + word + "\\b", "g"), " ")
          .trim();
      });
      cleanInput = cleanInput.replace(/\s+/g, " ").trim();

      // Nếu vẫn rỗng thì dùng nguyên câu
      const searchText = cleanInput || rawInput;

      const disease = await Disease.findOne({
        $or: [
          { name: { $regex: searchText, $options: "i" } },
          { commonName: { $regex: searchText, $options: "i" } },
          { scientificName: { $regex: searchText, $options: "i" } },
          { symptoms: { $elemMatch: { $regex: searchText, $options: "i" } } },
          { "treatments.drugs": { $regex: searchText, $options: "i" } },
          {
            "treatments.methods": {
              $elemMatch: { $regex: searchText, $options: "i" },
            },
          },
        ],
      });

      if (!disease) {
        responseText = `Tôi chưa tìm thấy thông tin về "${rawInput}".\nHãy thử hỏi: đạo ôn, rầy nâu, lem lép hạt, cháy bìa lá, vàng lùn...`;
      } else {
        let reply = `**${disease.name}** (${
          disease.commonName || "Hại lúa"
        })\n\n`;

        reply += `**Triệu chứng**:\n`;
        disease.symptoms.slice(0, 3).forEach((s) => (reply += `• ${s}\n`));

        reply += `\n**Nguyên nhân**: ${disease.causes}\n`;

        // Hóa học
        const chem = disease.treatments.find((t) => t.type === "Hóa học");
        if (chem && chem.drugs?.length > 0) {
          reply += `\n**Thuốc hóa học khuyến cáo**:\n`;
          chem.drugs.slice(0, 2).forEach((d) => {
            reply += `• ${d}`;
            if (chem.dosage) reply += ` (${chem.dosage})`;
            reply += "\n";
          });
          if (chem.notes) reply += `_Lưu ý: ${chem.notes}_\n`;
        }

        // Sinh học
        const bio = disease.treatments.find((t) => t.type === "Sinh học");
        if (bio) {
          reply += `\n**Biện pháp sinh học**: ${
            bio.drugs?.[0] || "Trichoderma, nấm đối kháng"
          } – ${bio.notes || "An toàn, bền vững"}\n`;
        }

        // Canh tác
        const cultural = disease.treatments.find((t) => t.type === "Canh tác");
        if (cultural && cultural.methods?.length > 0) {
          reply += `\n**Canh tác phòng trừ**:\n`;
          cultural.methods.slice(0, 2).forEach((m) => (reply += `• ${m}\n`));
        }

        reply += `\n**Ảnh hưởng thời tiết**: ${disease.weatherTriggers.join(
          ", "
        )}\n`;
        reply += `**Phòng ngừa**: ${disease.weatherPrevention}\n`;
        reply += `\n**Mức độ nghiêm trọng**: ${disease.severityRisk} – Mất ${disease.economicLoss}`;

        responseText = reply;
      }
    }

    // 2. DỰ BÁO THỜI TIẾT
    else if (intent === "Ask_Weather" || intent === "Ask_Weather_Forecast") {
      const location = parameters.location || "Đồng bằng sông Cửu Long";
      const today = new Date().toISOString().split("T")[0];

      const weather = await Weather.findOne({
        location: { $regex: location, $options: "i" },
        date: { $gte: today },
      }).sort({ date: 1 });

      if (!weather) {
        responseText = `Hiện chưa có dự báo cho khu vực ${location}.`;
      } else {
        responseText =
          `**DỰ BÁO THỜI TIẾT – ${weather.date}**\n` +
          `${weather.location}\n\n` +
          `Nhiệt độ: ${weather.temperature}\n` +
          `Độ ẩm: ${weather.humidity}\n` +
          `Tình hình: ${weather.condition}\n\n` +
          `**CẢNH BÁO NGUY CƠ BỆNH**\n` +
          weather.diseaseAlerts.map((a) => `${a}`).join("\n");
      }
    }

    // 3. BIỆN PHÁP BỀN VỮNG
    else if (intent === "Ask_Sustainable_Method") {
      const methodTitle = parameters.method || parameters.any || queryText;
      const method = await SustainableMethod.findOne({
        title: { $regex: methodTitle, $options: "i" },
      });

      if (!method) {
        responseText =
          "Tôi chưa có thông tin về biện pháp này. Bạn thử hỏi: thiên địch, phân hữu cơ, AWD, 1 phải 5 giảm...";
      } else {
        responseText =
          `**${method.title}**\n\n` +
          `${method.description}\n\n` +
          `**Cách thực hiện**:\n${method.implementation
            .map((s) => `• ${s}`)
            .join("\n")}\n\n` +
          `**Lợi ích**: ${method.benefits}\n` +
          (method.tips ? `\n**Mẹo hay**: ${method.tips}` : "");
      }
    }

    // 4. CHÀO MỪNG
    else if (intent === "Welcome Intent") {
      responseText = `Xin chào! Tôi là ArgiBot. Tôi có thể giúp gì cho bạn?`;
      // `Tôi có thể giúp bạn:\n` +
      // `• Tư vấn bệnh lúa: đạo ôn, rầy nâu, lem lép hạt...\n` +
      // `• Dự báo thời tiết + cảnh báo dịch bệnh\n` +
      // `• Biện pháp sinh học & canh tác bền vững\n\n` +
      // `Bạn đang gặp vấn đề gì với ruộng lúa? Hỏi tôi ngay nhé!`;
    }

    // 5. KHÔNG HIỂU
    else {
      responseText =
        "Tôi chưa hiểu lắm. Bạn có thể hỏi:\n" +
        '• "Rầy nâu làm sao?"\n' +
        '• "Thời tiết hôm nay?"\n';
      // '• "Dùng thiên địch được không?"';
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    responseText = "Hệ thống đang bận. Bạn thử lại sau vài phút nhé!";
  }

  res.json({ fulfillmentText: responseText });
};
