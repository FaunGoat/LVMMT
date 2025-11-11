const Disease = require("../models/Disease");
const Weather = require("../models/Weather");

exports.handleWebhook = async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters || {};
  let responseText =
    "Xin lỗi, tôi chưa hiểu. Hãy hỏi về bệnh lúa, thời tiết, hoặc biện pháp chữa trị.";

  try {
    // 1. HỎI VỀ BỆNH LÚA
    if (
      intent === "Ask_Disease" ||
      intent === "Ask_Disease_Symptom" ||
      intent === "Ask_Disease_Treatment"
    ) {
      const diseaseName = parameters.disease || parameters.any;
      if (!diseaseName) {
        responseText =
          "Bạn muốn hỏi về bệnh nào? Ví dụ: đạo ôn, rầy nâu, lem lép hạt...";
      } else {
        const disease = await Disease.findOne({
          $or: [
            { name: { $regex: diseaseName, $options: "i" } },
            { commonName: { $regex: diseaseName, $options: "i" } },
          ],
        });

        if (!disease) {
          responseText = `Không tìm thấy thông tin về "${diseaseName}". Hãy thử hỏi: đạo ôn, rầy nâu, lem lép hạt, cháy bìa lá, vàng lùn.`;
        } else {
          let reply = `**${disease.name}** (${disease.commonName})\n\n`;

          // Triệu chứng
          reply += `**Triệu chứng**: ${disease.symptoms[0]}\n`;
          if (disease.symptoms.length > 1) {
            reply += `   • ${disease.symptoms[1]}\n`;
          }

          // Nguyên nhân
          reply += `\n**Nguyên nhân**: ${disease.causes}\n`;

          // Biện pháp chữa (ưu tiên hóa học + sinh học)
          const chem = disease.treatments.find((t) => t.type === "Hóa học");
          const bio = disease.treatments.find((t) => t.type === "Sinh học");
          const cultural = disease.treatments.find(
            (t) => t.type === "Canh tác"
          );

          if (chem) {
            reply += `\n**Thuốc hóa học**: ${chem.drugs[0]} (${chem.dosage})\n`;
            if (chem.notes) reply += `   _${chem.notes}_\n`;
          }

          if (bio) {
            reply += `\n**Biện pháp sinh học**: ${bio.drugs[0]} – ${bio.notes}\n`;
          }

          if (cultural) {
            reply += `\n**Canh tác**: ${cultural.methods[0]}\n`;
          }

          // Ảnh hưởng thời tiết
          reply += `\n**Ảnh hưởng thời tiết**: ${disease.weatherTriggers[0]}\n`;
          reply += `**Phòng ngừa**: ${disease.weatherPrevention}\n`;

          // Mức độ nguy hiểm
          reply += `\n**Mức độ**: ${disease.severityRisk} – Mất ${disease.economicLoss}`;

          responseText = reply;
        }
      }
    }

    // 2. HỎI DỰ BÁO THỜI TIẾT & CẢNH BÁO BỆNH
    else if (intent === "Ask_Weather" || intent === "Ask_Weather_Forecast") {
      const location = parameters.location || "Đồng bằng sông Cửu Long";
      const today = new Date().toISOString().split("T")[0]; // 2025-11-11

      const weather = await Weather.findOne({
        location: { $regex: location, $options: "i" },
        date: { $gte: today },
      }).sort({ date: 1 });

      if (!weather) {
        responseText = `Không có dự báo cho ${location}. Hãy thử lại sau.`;
      } else {
        responseText =
          `**DỰ BÁO THỜI TIẾT – ${weather.date}**\n` +
          `${weather.location}\n\n` +
          `Nhiệt độ: ${weather.temperature}\n` +
          `Độ ẩm: ${weather.humidity}\n` +
          `Thời tiết: ${weather.condition}\n\n` +
          `**CẢNH BÁO BỆNH**\n` +
          weather.diseaseAlerts.map((alert) => `• ${alert}`).join("\n");
      }
    }

    // 3. HỎI VỀ BIỆN PHÁP BỀN VỮNG
    else if (intent === "Ask_Sustainable_Method") {
      const methodTitle = parameters.method || parameters.any;
      if (!methodTitle) {
        responseText =
          "Bạn muốn biết biện pháp nào? Ví dụ: thiên địch, phân hữu cơ, quản lý nước...";
      } else {
        const method = await SustainableMethod.findOne({
          title: { $regex: methodTitle, $options: "i" },
        });

        if (!method) {
          responseText = `Không tìm thấy "${methodTitle}". Hãy hỏi: thiên địch, phân hữu cơ, AWD, luân canh...`;
        } else {
          responseText =
            `**${method.title}**\n\n` +
            `${method.description}\n\n` +
            `**Cơ chế**: ${method.mechanism}\n\n` +
            `**Hướng dẫn**:\n${method.implementation
              .map((s) => `   • ${s}`)
              .join("\n")}\n\n` +
            `**Lợi ích**: ${method.benefits}\n\n` +
            `**Mẹo**: ${method.tips}`;
        }
      }
    }

    // 4. CHÀO HỎI / MẶC ĐỊNH
    else if (intent === "Default Welcome Intent") {
      responseText =
        `Chào bạn! Tôi là **Chatbot Tư vấn Bảo vệ Cây lúa**.\n\n` +
        `Tôi có thể giúp:\n` +
        `• Hỏi về **bệnh lúa**: đạo ôn, rầy nâu...\n` +
        `• **Dự báo thời tiết** và cảnh báo bệnh\n` +
        `• **Biện pháp sinh học** bền vững\n\n` +
        `Hỏi gì cũng được nhé!`;
    }

    // 5. KHÔNG NHẬN DIỆN ĐƯỢC
    else {
      responseText =
        "Tôi chưa hiểu. Bạn có thể hỏi:\n" +
        '• "Đạo ôn là gì?"\n' +
        '• "Thời tiết hôm nay?"\n' +
        '• "Cách dùng thiên địch?"';
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    responseText = "Hệ thống đang bận. Vui lòng thử lại sau!";
  }

  // Trả về cho Dialogflow
  res.json({
    fulfillmentText: responseText,
  });
};
