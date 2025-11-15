const Disease = require("../models/Disease");
const Weather = require("../models/Weather");
const {
  extractEntity,
  getDiseaseName,
  getTreatmentType,
  getSymptomKeywords,
  buildSearchQuery,
  formatLocation,
  cleanText,
} = require("../utils/entityMapper");

exports.handleWebhook = async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters || {};
  const queryText = req.body.queryResult.queryText || "";

  // Extract entities
  const diseaseEntity = extractEntity(parameters, "disease");
  const treatmentEntity = extractEntity(parameters, "treatment-type");
  const symptomEntity = extractEntity(parameters, "symptom");
  const locationEntity = extractEntity(parameters, "location");

  console.log("🎯 Entities extracted:");
  console.log("  - Disease:", diseaseEntity);
  console.log("  - Treatment:", treatmentEntity);
  console.log("  - Symptom:", symptomEntity);
  console.log("  - Location:", locationEntity);

  let responseText =
    "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về bệnh lúa, thời tiết, hoặc cách phòng trừ.";

  try {
    // 1. HỎI VỀ BỆNH LÚA
    if (
      intent === "Ask_Disease" ||
      intent === "Ask_Disease_Symptom" ||
      intent === "Ask_Disease_Treatment"
    ) {
      // Map entity sang tên bệnh trong DB
      const diseaseName = getDiseaseName(diseaseEntity) || cleanText(queryText);

      // Tìm bệnh trong database
      const searchQuery = buildSearchQuery(diseaseName);
      const disease = await Disease.findOne(searchQuery);

      if (!disease) {
        responseText =
          `Tôi chưa tìm thấy thông tin về "${diseaseName || queryText}".\n\n` +
          `Bạn có thể hỏi về:\n` +
          `• Đạo ôn\n• Rầy nâu\n• Lem lép hạt\n• Cháy bìa lá\n• Sâu cuốn lá`;
      } else {
        // Phân tích loại câu hỏi
        const questionType = analyzeQuestion(queryText);
        responseText = generateSmartResponse(
          disease,
          questionType,
          diseaseName
        );
      }
    }

    // 2. HỎI VỀ TRIỆU CHỨNG (Tìm bệnh từ triệu chứng)
    else if (intent === "Ask_Disease_By_Symptom") {
      const symptomKeywords = getSymptomKeywords(symptomEntity);
      const searchQuery = buildSearchQuery(null, symptomKeywords);

      const disease = await Disease.findOne(searchQuery);

      if (!disease) {
        responseText =
          `Tôi chưa tìm thấy bệnh nào có triệu chứng "${
            symptomEntity || queryText
          }".\n\n` + `Hãy mô tả chi tiết hơn hoặc hỏi về bệnh cụ thể nhé!`;
      } else {
        responseText =
          `Triệu chứng bạn mô tả có thể là **${disease.name}**.\n\n` +
          `**Các triệu chứng đặc trưng:**\n` +
          disease.symptoms
            .slice(0, 3)
            .map((s) => `• ${s}`)
            .join("\n") +
          `\n\n⚠️ Mức độ: **${disease.severityRisk}**` +
          `\n💡 Bạn muốn biết cách chữa trị không?`;
      }
    }

    // 3. HỎI VỀ CÁCH CHỮA TRỊ CỤ THỂ
    else if (intent === "Ask_Disease_Treatment") {
      const diseaseName = getDiseaseName(diseaseEntity) || cleanText(queryText);
      const treatmentType = getTreatmentType(treatmentEntity);

      const searchQuery = buildSearchQuery(diseaseName);
      const disease = await Disease.findOne(searchQuery);

      if (!disease) {
        responseText = `Vui lòng cho biết bạn muốn chữa bệnh gì?\n\nVí dụ: "Cách chữa đạo ôn"`;
      } else {
        // Nếu có chỉ định loại phương pháp
        if (treatmentType) {
          responseText = generateTreatmentByType(disease, treatmentType);
        } else {
          responseText = generateTreatmentResponse(disease);
        }
      }
    }

    // 4. DỰ BÁO THỜI TIẾT
    else if (intent === "Ask_Weather" || intent === "Ask_Weather_Forecast") {
      const location =
        formatLocation(locationEntity) || "Đồng bằng sông Cửu Long";
      const today = new Date().toISOString().split("T")[0];

      const weather = await Weather.findOne({
        location: { $regex: location, $options: "i" },
        date: { $gte: today },
      }).sort({ date: 1 });

      if (!weather) {
        responseText = `Hiện chưa có dự báo thời tiết cho khu vực ${location}.`;
      } else {
        responseText =
          `🌦️ **DỰ BÁO THỜI TIẾT - ${weather.date}**\n` +
          `📍 ${weather.location}\n\n` +
          `🌡️ Nhiệt độ: ${weather.temperature}\n` +
          `💧 Độ ẩm: ${weather.humidity}\n` +
          `☁️ Tình hình: ${weather.condition}\n\n` +
          `⚠️ **CẢNH BÁO BỆNH HẠI:**\n` +
          weather.diseaseAlerts.map((a) => `• ${a}`).join("\n");
      }
    }

    // 5. CHÀO MỪNG
    else if (
      intent === "Welcome Intent" ||
      intent === "Default Welcome Intent"
    ) {
      responseText =
        `Xin chào! Tôi là ArgiBot - trợ lý AI chăm sóc lúa của bạn 🌾\n\n` +
        `Tôi có thể giúp bạn:\n` +
        `• Nhận biết và chữa bệnh lúa\n` +
        `• Dự báo thời tiết & cảnh báo dịch\n` +
        `• Tư vấn phòng trừ sinh học\n\n` +
        `Bạn đang gặp vấn đề gì? Hỏi tôi ngay nhé! 😊`;
    }

    // 6. CẢM ƠN
    else if (intent === "Thanks" || queryText.match(/cảm ơn|cám ơn|thank/i)) {
      responseText = `Rất vui được giúp bạn! 🌾\n\nNếu còn thắc mắc gì, cứ hỏi tôi nhé!`;
    }

    // 7. TẠM BIỆT
    else if (intent === "Goodbye" || queryText.match(/tạm biệt|bye|chào/i)) {
      responseText = `Chúc bạn một mùa màng bội thu! 🌾✨\n\nHẹn gặp lại!`;
    }
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    responseText = "Hệ thống đang bận. Bạn thử lại sau vài phút nhé!";
  }

  res.json({ fulfillmentText: responseText });
};

// HÀM PHÂN TÍCH LOẠI CÂU HỎI
function analyzeQuestion(question) {
  const q = question.toLowerCase();

  if (q.match(/là gì|định nghĩa|khái niệm|gì vậy/)) {
    return "definition"; // Hỏi định nghĩa
  }
  if (q.match(/triệu chứng|dấu hiệu|biểu hiện|nhận biết/)) {
    return "symptoms"; // Hỏi triệu chứng
  }
  if (q.match(/cách chữa|điều trị|phòng|trừ|thuốc|xử lý/)) {
    return "treatment"; // Hỏi cách chữa
  }
  if (q.match(/nguyên nhân|tại sao|do đâu|vì sao/)) {
    return "causes"; // Hỏi nguyên nhân
  }
  if (q.match(/nguy hiểm|ảnh hưởng|thiệt hại|mất mát/)) {
    return "impact"; // Hỏi mức độ nguy hiểm
  }
  if (q.match(/thời tiết|mưa|nắng|nhiệt độ/)) {
    return "weather"; // Hỏi liên quan thời tiết
  }

  return "general"; // Câu hỏi chung
}

// HÀM TẠO CÂU TRẢ LỜI THÔNG MINH
function generateSmartResponse(disease, questionType, searchTerm) {
  let response = "";

  switch (questionType) {
    case "definition":
      response =
        `**${disease.name}** (${disease.commonName || "Hại lúa"})\n\n` +
        `${disease.causes}\n\n` +
        `💡 Bạn muốn biết thêm về triệu chứng hay cách chữa trị?`;
      break;

    case "symptoms":
      response =
        `**Triệu chứng của ${disease.name}:**\n\n` +
        disease.symptoms.map((s, i) => `${i + 1}. ${s}`).join("\n") +
        `\n\n⚠️ Mức độ: **${disease.severityRisk}**` +
        `\n📉 Thiệt hại: ${disease.economicLoss}`;
      break;

    case "treatment":
      response = generateTreatmentResponse(disease);
      break;

    case "causes":
      response =
        `**Nguyên nhân gây ${disease.name}:**\n\n` +
        `${disease.causes}\n\n` +
        `**Điều kiện thuận lợi cho bệnh:**\n` +
        disease.weatherTriggers.map((w) => `• ${w}`).join("\n") +
        `\n\n💡 Muốn biết cách phòng ngừa?`;
      break;

    case "impact":
      response =
        `**Mức độ nguy hiểm của ${disease.name}:**\n\n` +
        `⚠️ Độ nghiêm trọng: **${disease.severityRisk}**\n` +
        `📉 Thiệt hại kinh tế: ${disease.economicLoss}\n\n` +
        `**Triệu chứng nặng:**\n` +
        disease.symptoms
          .slice(-2)
          .map((s) => `• ${s}`)
          .join("\n") +
        `\n\n🛡️ Cần chữa trị ngay để tránh lây lan!`;
      break;

    case "weather":
      response =
        `**${disease.name} và thời tiết:**\n\n` +
        `**Điều kiện phát bệnh:**\n` +
        disease.weatherTriggers.map((w) => `• ${w}`).join("\n") +
        `\n\n**Cách phòng ngừa:**\n${disease.weatherPrevention}`;
      break;

    default: // general
      response =
        `**${disease.name}** (${disease.commonName || "Hại lúa"})\n\n` +
        `📋 **Nguyên nhân:** ${disease.causes}\n\n` +
        `🔍 **Triệu chứng phổ biến:**\n` +
        disease.symptoms
          .slice(0, 2)
          .map((s) => `• ${s}`)
          .join("\n") +
        `\n\n⚠️ **Mức độ:** ${disease.severityRisk} - Thiệt hại ${disease.economicLoss}\n\n` +
        `💡 Bạn muốn biết thêm về:\n` +
        `• Cách chữa trị?\n` +
        `• Phòng ngừa theo thời tiết?`;
  }

  return response;
}

// HÀM TẠO CÂU TRẢ LỜI VỀ CÁCH CHỮA TRỊ
function generateTreatmentResponse(disease) {
  let response = `**Cách chữa trị ${disease.name}:**\n\n`;

  // Hóa học
  const chemical = disease.treatments.find((t) => t.type === "Hóa học");
  if (chemical && chemical.drugs?.length > 0) {
    response += `💊 **Thuốc hóa học:**\n`;
    chemical.drugs.slice(0, 3).forEach((drug) => {
      response += `• ${drug}`;
      if (chemical.dosage) response += ` - ${chemical.dosage}`;
      response += "\n";
    });
    if (chemical.notes) response += `⚠️ ${chemical.notes}\n`;
    response += "\n";
  }

  // Sinh học
  const bio = disease.treatments.find((t) => t.type === "Sinh học");
  if (bio) {
    response += `🌱 **Phương pháp sinh học:**\n`;
    if (bio.drugs && bio.drugs.length > 0) {
      bio.drugs.forEach((drug) => (response += `• ${drug}\n`));
    }
    if (bio.notes) response += `✅ ${bio.notes}\n`;
    response += "\n";
  }

  // Canh tác
  const cultural = disease.treatments.find((t) => t.type === "Canh tác");
  if (cultural && cultural.methods?.length > 0) {
    response += `🚜 **Biện pháp canh tác:**\n`;
    cultural.methods.slice(0, 3).forEach((method) => {
      response += `• ${method}\n`;
    });
    response += "\n";
  }

  // Phòng ngừa theo thời tiết
  response += `🌦️ **Phòng ngừa theo thời tiết:**\n${disease.weatherPrevention}`;

  return response;
}

// HÀM TẠO CÂU TRẢ LỜI CHO PHƯƠNG PHÁP ĐIỀU TRỊ CỤ THỂ
function generateTreatmentByType(disease, treatmentType) {
  let response = `**Cách chữa ${disease.name} bằng phương pháp ${treatmentType}:**\n\n`;

  const treatment = disease.treatments.find((t) => t.type === treatmentType);

  if (!treatment) {
    return `Hiện chưa có thông tin về phương pháp ${treatmentType} cho ${disease.name}.\n\n💡 Bạn muốn xem các phương pháp khác?`;
  }

  if (treatment.drugs && treatment.drugs.length > 0) {
    response += `**Thuốc/Biện pháp:**\n`;
    treatment.drugs.forEach((drug) => {
      response += `• ${drug}\n`;
    });
    if (treatment.dosage) {
      response += `\n**Liều lượng:** ${treatment.dosage}\n`;
    }
  }

  if (treatment.methods && treatment.methods.length > 0) {
    response += `\n**Cách thực hiện:**\n`;
    treatment.methods.forEach((method) => {
      response += `• ${method}\n`;
    });
  }

  if (treatment.notes) {
    response += `\n⚠️ **Lưu ý:** ${treatment.notes}`;
  }

  return response;
}
