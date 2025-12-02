// backend/controllers/webhookController.js
const Disease = require("../models/new/Disease");
const DiseaseStage = require("../models/new/DiseaseStage");
const DiseaseSeason = require("../models/new/DiseaseSeason");
const DiseaseCause = require("../models/new/DiseaseCause");
const DiseaseSymptom = require("../models/new/DiseaseSymptom");
const DiseaseTreatment = require("../models/new/DiseaseTreatment");
const DiseasePrevention = require("../models/new/DiseasePrevention");
const WeatherDiseaseCorrelation = require("../models/new/WeatherDiseaseCorrelation");
const Weather = require("../models/Weather");

const {
  extractEntity,
  getDiseaseName,
  getTreatmentType,
  getSymptomKeywords,
  buildSearchQuery,
  cleanText,
} = require("../utils/entityMapper");

exports.handleWebhook = async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters || {};
  const queryText = req.body.queryResult.queryText || "";

  // Extract entities
  const diseaseEntity = extractEntity(parameters, "disease");
  const treatmentEntity = extractEntity(parameters, "treatment_type");
  const symptomEntity = extractEntity(parameters, "symptom-keyword");
  const seasonEntity = extractEntity(parameters, "season");

  console.log("Entities extracted:");
  console.log("  - Disease:", diseaseEntity);
  console.log("  - Treatment:", treatmentEntity);
  console.log("  - Symptom:", symptomEntity);
  console.log("  - Season:", seasonEntity);

  let responseText =
    "Xin lỗi, tôi chưa có đủ thông tin để trả lời câu hỏi của bạn.";
  let responseData = null;

  try {
    // 1. HỎI VỀ BỆNH LÚA
    if (
      intent === "Ask_Disease" ||
      intent === "Ask_Disease_Symptom" ||
      intent === "Ask_Disease_Cause" ||
      intent === "Ask_Disease_Season"
    ) {
      const diseaseName = getDiseaseName(diseaseEntity) || cleanText(queryText);
      const searchQuery = buildSearchQuery(diseaseName);
      const disease = await Disease.findOne(searchQuery)
        .populate("causes")
        .populate("seasons");

      if (!disease) {
        responseText =
          `Tôi chưa tìm thấy thông tin về "${diseaseName || queryText}".\n\n` +
          `Bạn có thể hỏi về:\n` +
          `• Đạo ôn\n• Rầy nâu\n• Lem lép hạt\n• Cháy bìa lá\n• Sâu cuốn lá`;
      } else {
        let finalQuestionType = analyzeQuestion(queryText);

        // ▼▼▼ THÊM ĐOẠN NÀY ĐỂ SỬA LỖI ▼▼▼
        // Nếu Dialogflow đã bắt được Intent Mùa vụ, ép kiểu luôn
        if (intent === "Ask_Disease_Season") finalQuestionType = "seasons";
        if (intent === "Ask_Disease_Cause") finalQuestionType = "causes";

        responseText = await generateSmartResponse(
          disease,
          finalQuestionType,
          diseaseName
        );

        responseData = {
          type: "disease",
          disease: {
            _id: disease._id,
            name: disease.name,
            images: disease.images || [],
            link: `/sustainable-methods?id=${disease._id}`,
          },
        };
      }
    }

    // 2. HỎI VỀ TRIỆU CHỨNG
    // 2. HỎI VỀ TRIỆU CHỨNG - FIXED VERSION
    else if (intent === "Ask_Disease_By_Symptom") {
      if (!symptomEntity || symptomEntity.length === 0) {
        responseText =
          "Xin lỗi, tôi chưa nhận diện được triệu chứng nào. Bạn có thể mô tả rõ hơn không?";
      } else {
        // Lấy tất cả từ khóa từ entity
        const symptomKeywords = getSymptomKeywords(symptomEntity);

        // Tạo pattern RegEx cho truy vấn
        const searchPattern = symptomKeywords.map(cleanText).join("|");
        const regexQuery = new RegExp(searchPattern, "i");

        // BƯỚC 1: Tìm diseaseId từ model DiseaseSymptom
        const symptomDocs = await DiseaseSymptom.find({
          "symptoms.description": { $regex: regexQuery },
        }).select("diseaseId");

        if (symptomDocs.length === 0) {
          responseText = `Tôi không tìm thấy bệnh nào có triệu chứng liên quan đến "${symptomKeywords.join(
            ", "
          )}". Bạn có thể xem lại mô tả triệu chứng không?`;
        } else {
          // Lấy ra danh sách các ID bệnh
          const diseaseIds = symptomDocs.map((doc) => doc.diseaseId);

          // BƯỚC 2: Truy vấn Disease model bằng các ID tìm được
          const diseases = await Disease.find({ _id: { $in: diseaseIds } })
            .populate("symptoms")
            .limit(5)
            .select(
              "name commonName scientificName description severityRisk images _id"
            );

          if (diseases.length > 0) {
            // ✅ THAY ĐỔI CHÍNH Ở ĐÂY
            // Tạo response text
            responseText = generateDiseaseSummaryBySymptom(
              diseases,
              symptomKeywords,
              queryText
            );

            // ✅ FIX: Lấy bệnh đầu tiên từ mảng diseases
            const primaryDisease = diseases[0];

            // ✅ FIX: Set responseData với bệnh đầu tiên
            responseData = {
              type: "disease",
              disease: {
                _id: primaryDisease._id,
                name: primaryDisease.name,
                images: primaryDisease.images || [],
                link: `/sustainable-methods?id=${primaryDisease._id}`,
              },
            };
          } else {
            responseText = `Tôi không tìm thấy bệnh nào có triệu chứng liên quan đến "${symptomKeywords.join(
              ", "
            )}". Bạn có thể xem lại mô tả triệu chứng không?`;
          }
        }
      }
    }

    // 3. HỎI VỀ CÁCH CHỮA TRỊ
    else if (
      intent === "Ask_Disease_Treatment" ||
      intent === "Ask_Disease_Treatment_Specific"
    ) {
      const diseaseName = getDiseaseName(diseaseEntity) || cleanText(queryText);
      const treatmentType = getTreatmentType(treatmentEntity);
      const searchQuery = buildSearchQuery(diseaseName);
      const disease = await Disease.findOne(searchQuery);

      if (!disease) {
        responseText = `Vui lòng cho biết bạn muốn chữa bệnh gì?\n\nVí dụ: "Cách chữa đạo ôn"`;
      } else {
        // Lấy thông tin điều trị từ DiseaseTreatment
        const treatmentDoc = await DiseaseTreatment.findOne({
          diseaseId: disease._id,
        });

        if (!treatmentDoc) {
          responseText = `Hiện chưa có thông tin điều trị cho ${disease.name}.`;
        } else {
          if (treatmentType) {
            responseText = generateTreatmentByType(
              treatmentDoc,
              treatmentType,
              disease.name
            );
          } else {
            responseText = generateTreatmentResponse(
              treatmentDoc,
              disease.name
            );
          }
        }
      }
    }

    // 4. DỰ BÁO THỜI TIẾT
    else if (intent === "Ask_Weather" || intent === "Ask_Weather_Forecast") {
      const location = "Cần Thơ";
      const today = new Date().toISOString().split("T")[0];

      const weather = await Weather.findOne({
        location: { $regex: location, $options: "i" },
        date: { $gte: today },
      }).sort({ date: 1 });

      if (!weather) {
        responseText = `Hiện chưa có dự báo thời tiết cho khu vực ${location}.`;
      } else {
        responseText =
          `DỰ BÁO THỜI TIẾT - ${weather.date}\n` +
          `${weather.location}\n\n` +
          `Nhiệt độ: ${weather.temperature}\n` +
          `Độ ẩm: ${weather.humidity}\n` +
          `Tình hình: ${weather.condition}`;

        responseData = {
          type: "weather",
          link: "/weather-forecast",
        };
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
      responseText = `Rất vui được giúp bạn! \nNếu còn thắc mắc gì, cứ hỏi tôi nhé!`;
    }

    // 7. TẠM BIỆT
    else if (intent === "Goodbye" || queryText.match(/tạm biệt|bye|chào/i)) {
      responseText = `Chúc bạn một mùa màng bội thu! \nHẹn gặp lại!`;
    }

    // 8. HỎI VỀ GIAI ĐOẠN PHÁT TRIỂN BỆNH
    else if (
      queryText.match(/giai đoạn|phát triển|vòng đời|chu kỳ/i) &&
      (diseaseEntity ||
        queryText.match(/đạo ôn|rầy nâu|lem lép|cháy bìa|cuốn lá/i))
    ) {
      const diseaseName = getDiseaseName(diseaseEntity) || cleanText(queryText);
      const searchQuery = buildSearchQuery(diseaseName);
      const disease = await Disease.findOne(searchQuery);

      if (!disease) {
        responseText = `Tôi chưa tìm thấy thông tin về bệnh "${diseaseName}".`;
      } else {
        const stageDoc = await DiseaseStage.findOne({ diseaseId: disease._id });

        if (!stageDoc || !stageDoc.stages) {
          responseText = `Hiện chưa có thông tin về giai đoạn phát triển của ${disease.name}.`;
        } else {
          responseText = `Giai đoạn phát triển của ${disease.name}:\n\n`;
          responseText += `Thời gian: ${stageDoc.totalDuration}\n\n`;

          stageDoc.stages.slice(0, 5).forEach((stage, idx) => {
            responseText += `${stage.order}. ${stage.name} (${stage.duration})\n`;
            responseText += `   ${stage.description}\n`;
            if (idx === stageDoc.peakStage) {
              responseText += `   ⚠️ GIAI ĐOẠN NGUY HIỂM NHẤT\n`;
            }
            responseText += `\n`;
          });
        }
      }
    }

    // 10. HỎI VỀ PHÒNG NGỪA
    else if (
      queryText.match(
        /phòng ngừa|phòng trừ|phòng tránh|dự phòng|làm sao để tránh|cách phòng/i
      ) &&
      (diseaseEntity ||
        queryText.match(/đạo ôn|rầy nâu|lem lép|cháy bìa|cuốn lá/i))
    ) {
      const diseaseName = getDiseaseName(diseaseEntity) || cleanText(queryText);
      const searchQuery = buildSearchQuery(diseaseName);
      const disease = await Disease.findOne(searchQuery);

      if (!disease) {
        responseText = `Tôi chưa tìm thấy thông tin về bệnh "${diseaseName}".`;
      } else {
        const preventionDoc = await DiseasePrevention.findOne({
          diseaseId: disease._id,
        });

        if (!preventionDoc) {
          responseText = `Hiện chưa có thông tin phòng ngừa cho ${disease.name}.`;
        } else {
          responseText = `Cách phòng ngừa ${disease.name}:\n\n`;

          // Canh tác
          if (
            preventionDoc.culturalPractices &&
            preventionDoc.culturalPractices.length > 0
          ) {
            responseText += `Biện pháp canh tác:\n`;
            preventionDoc.culturalPractices.slice(0, 3).forEach((practice) => {
              responseText += `• ${practice.practice}\n`;
              responseText += `  ${practice.description}\n`;
            });
          }

          // Giống lúa kháng
          if (
            preventionDoc.varietySelection &&
            preventionDoc.varietySelection.length > 0
          ) {
            responseText += `Giống lúa kháng bệnh:\n`;
            preventionDoc.varietySelection.slice(0, 3).forEach((variety) => {
              responseText += `• ${variety.varietyName} - ${variety.resistanceLevel}\n`;
            });
          }

          // Kiểm soát sinh học
          if (
            preventionDoc.biologicalControl &&
            preventionDoc.biologicalControl.length > 0
          ) {
            responseText += `Kiểm soát sinh học:\n`;
            preventionDoc.biologicalControl.slice(0, 2).forEach((bio) => {
              responseText += `• ${bio.agent}\n`;
            });
          }

          if (
            preventionDoc.seedTreatment &&
            preventionDoc.seedTreatment.length > 0
          ) {
            responseText += `Xử lý hạt giống:\n`;
            preventionDoc.seedTreatment.slice(0, 2).forEach((treatment) => {
              responseText += `• ${treatment.materials}\n`;
            });
          }

          if (
            preventionDoc.nutritionManagement &&
            preventionDoc.nutritionManagement.length > 0
          ) {
            responseText += `Quản lý dinh dưỡng:\n`;
            preventionDoc.nutritionManagement
              .slice(0, 2)
              .forEach((management) => {
                responseText += `• ${management.recommendation}: ${management.nutrient}\n`;
              });
          }

          if (
            preventionDoc.waterManagement &&
            preventionDoc.waterManagement.length > 0
          ) {
            responseText += `Quản lý nước:\n`;
            preventionDoc.waterManagement.slice(0, 2).forEach((treatment) => {
              responseText += `• ${treatment.description}\n`;
            });
          }

          if (
            preventionDoc.monitoringSchedule &&
            preventionDoc.monitoringSchedule.length > 0
          ) {
            responseText += `Giám sát:\n`;
            preventionDoc.monitoringSchedule
              .slice(0, 2)
              .forEach((treatment) => {
                responseText += `• ${treatment.frequency}\n`;
                responseText += `- Kiểm tra: ${treatment.whatToCheck}\n`;
              });
          }

          if (
            preventionDoc.sanitationPractices &&
            preventionDoc.sanitationPractices.length > 0
          ) {
            responseText += `Vệ sinh đồng ruộng:\n`;
            preventionDoc.sanitationPractices
              .slice(0, 2)
              .forEach((treatment) => {
                responseText += `• ${treatment.practice}\n`;
              });
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    responseText = "Hệ thống đang bận. Bạn thử lại sau vài phút nhé!";
  }

  // TRẢ VỀ RESPONSE VỚI DATA
  res.json({
    fulfillmentText: responseText,
    payload: responseData
      ? {
          data: responseData,
        }
      : undefined,
  });
};

// HÀM PHÂN TÍCH LOẠI CÂU HỎI
function analyzeQuestion(question) {
  const q = question.toLowerCase();

  if (q.match(/là gì|định nghĩa|khái niệm|gì vậy/)) {
    return "definition";
  }
  if (q.match(/triệu chứng|dấu hiệu|biểu hiện|nhận biết|tác hại|gây hại/)) {
    return "symptoms";
  }
  if (q.match(/cách chữa|điều trị|phòng|trừ|thuốc|xử lý/)) {
    return "treatment";
  }
  if (q.match(/nguyên nhân|tại sao|do đâu|vì sao|gây/)) {
    return "causes";
  }
  if (q.match(/nguy hiểm|ảnh hưởng|thiệt hại|mất mát/)) {
    return "impact";
  }
  if (q.match(/khi nào|lúc nào|tháng mấy|mùa|vụ|thời điểm|giai đoạn|bao lâu/)) {
    return "seasons";
  }
  if (q.match(/điều kiện|thời tiết|mưa|nắng|nhiệt độ/)) {
    return "weather";
  }

  return "general";
}

// HÀM TẠO RESPONSE THÔNG MINH (CẬP NHẬT)
async function generateSmartResponse(disease, finalQuestionType, searchTerm) {
  let response = "";

  switch (finalQuestionType) {
    case "definition":
      response =
        `${disease.name} (${disease.commonName || "Hại lúa"})\n\n` +
        `${disease.description}\n\n` +
        `Loại: ${disease.type}`;
      break;

    case "symptoms":
      // Lấy triệu chứng từ DiseaseSymptom
      const symptomDoc = await DiseaseSymptom.findOne({
        diseaseId: disease._id,
      });
      if (symptomDoc && symptomDoc.symptoms) {
        response =
          `Triệu chứng của ${disease.name}:\n\n` +
          symptomDoc.symptoms
            .slice(0, 5)
            .map((s, i) => `${i + 1}. ${s.description} (${s.part})`)
            .join("\n") +
          `\n\nMức độ: ${disease.severityRisk}` +
          `\nThiệt hại: ${disease.economicLoss}`;
      } else {
        response = `Hiện chưa có thông tin chi tiết về triệu chứng của ${disease.name}.`;
      }
      break;

    case "treatment":
      const treatmentDoc = await DiseaseTreatment.findOne({
        diseaseId: disease._id,
      });
      response = generateTreatmentResponse(treatmentDoc, disease.name);
      break;

    case "causes":
      // Use populated causes (Logic matching your previous request)
      const causeDetailDoc = disease.causes;

      if (causeDetailDoc) {
        response = `Nguyên nhân gây ${disease.name}:\n\n`;

        response += `• Mầm bệnh: ${causeDetailDoc.pathogen?.type || "Chưa rõ"}`;
        if (causeDetailDoc.pathogen?.scientificName) {
          response += ` (${causeDetailDoc.pathogen.scientificName})`;
        }
        response += `\n`;

        if (
          causeDetailDoc.environmentalFactors &&
          causeDetailDoc.environmentalFactors.length > 0
        ) {
          response += `\nĐiều kiện môi trường:\n`;
          response += causeDetailDoc.environmentalFactors
            .slice(0, 3)
            .map(
              (f) => `• ${f.factor}: ${f.description || f.optimalRange || ""}`
            )
            .join("\n");
        }
      } else {
        response = `Hiện chưa có thông tin chi tiết về nguyên nhân của ${disease.name}.`;
      }
      break;

    case "seasons":
      // Lấy dữ liệu season từ populate
      const seasonDoc = disease.seasons;

      if (seasonDoc && seasonDoc.seasons && seasonDoc.seasons.length > 0) {
        response = `Thời điểm ${disease.name} phát triển mạnh:\n\n`;

        seasonDoc.seasons.forEach((s) => {
          response += `• Vụ ${s.type}: Tháng ${s.startMonth} - ${s.endMonth}\n`;
          response += `  - Mức độ: ${s.riskLevel}\n`;
          if (s.peakMonths && s.peakMonths.length > 0) {
            response += `  - Cao điểm: Tháng ${s.peakMonths.join(", ")}\n`;
          }
        });

        // Thêm giai đoạn lúa nhạy cảm (Critical Periods)
        if (seasonDoc.criticalPeriods && seasonDoc.criticalPeriods.length > 0) {
          response += `\nGiai đoạn lúa dễ bị tấn công:\n`;
          seasonDoc.criticalPeriods.slice(0, 3).forEach((p) => {
            response += `• ${p.cropStage}: ${p.riskLevel}\n`;
          });
        }
      } else {
        response = `Hiện chưa có thông tin chi tiết về thời điểm xuất hiện của ${disease.name}.`;
      }
      break;

    case "impact":
      response =
        `Mức độ nguy hiểm của ${disease.name}:\n\n` +
        `Độ nghiêm trọng: ${disease.severityRisk}\n` +
        `Thiệt hại kinh tế: ${disease.economicLoss}\n\n`;
      break;

    case "weather":
      const weatherCorr = await WeatherDiseaseCorrelation.findOne({
        diseaseId: disease._id,
      });
      if (weatherCorr && weatherCorr.weatherTriggers) {
        response =
          `${disease.name} và thời tiết:\n\n` +
          `Điều kiện phát bệnh:\n` +
          weatherCorr.weatherTriggers
            .slice(0, 3)
            .map((w) => `• ${w.condition}`)
            .join("\n");
      } else {
        response = `Hiện chưa có thông tin về mối liên hệ thời tiết với ${disease.name}.`;
      }
      break;

    default:
      response =
        `${disease.name} (${disease.commonName || "Hại lúa"})\n\n` +
        `${disease.description}\n\n` +
        `Mức độ: ${disease.severityRisk} - Thiệt hại ${disease.economicLoss}`;
  }

  return response;
}

// HÀM TẠO RESPONSE ĐIỀU TRỊ (CẬP NHẬT)
function generateTreatmentResponse(treatmentDoc, diseaseName) {
  if (!treatmentDoc || !treatmentDoc.treatments) {
    return `Hiện chưa có thông tin điều trị cho ${diseaseName}.`;
  }

  let response = `Cách chữa trị ${diseaseName}:\n\n`;

  // Tìm phương pháp Hóa học
  const chemical = treatmentDoc.treatments.find((t) => t.type === "Hóa học");
  if (chemical && chemical.methods && chemical.methods.length > 0) {
    response += `Thuốc hóa học:\n`;
    chemical.methods.slice(0, 3).forEach((method) => {
      response += `• ${method.name}`;
      if (method.dosage) response += ` - ${method.dosage}`;
      response += "\n";
    });
    if (chemical.notes) response += `${chemical.notes}\n`;
    response += "\n";
  }

  // Tìm phương pháp Sinh học
  const bio = treatmentDoc.treatments.find((t) => t.type === "Sinh học");
  if (bio && bio.methods && bio.methods.length > 0) {
    response += `Phương pháp sinh học:\n`;
    bio.methods.slice(0, 3).forEach((method) => {
      response += `• ${method.name}`;
      if (method.dosage) response += ` - ${method.dosage}`;
      response += "\n";
    });
    if (bio.notes) response += `${bio.notes}\n`;
  }

  return response;
}

// HÀM TẠO RESPONSE THEO LOẠI ĐIỀU TRỊ
function generateTreatmentByType(treatmentDoc, treatmentType, diseaseName) {
  if (!treatmentDoc || !treatmentDoc.treatments) {
    return `Hiện chưa có thông tin điều trị cho ${diseaseName}.`;
  }

  let response = `Cách chữa ${diseaseName} bằng phương pháp ${treatmentType}:\n\n`;

  const treatment = treatmentDoc.treatments.find(
    (t) => t.type === treatmentType
  );

  if (!treatment) {
    return `Hiện chưa có thông tin về phương pháp ${treatmentType} cho ${diseaseName}.\n\nBạn muốn xem các phương pháp khác?`;
  }

  if (treatment.methods && treatment.methods.length > 0) {
    response += `Thuốc/Biện pháp:\n`;
    treatment.methods.slice(0, 5).forEach((method) => {
      response += `• ${method.name}`;
      if (method.dosage) response += ` - ${method.dosage}`;
      response += "\n";
    });
  }

  if (treatment.bestPractices && treatment.bestPractices.length > 0) {
    response += `\nThực hành tốt nhất:\n`;
    treatment.bestPractices.slice(0, 3).forEach((practice) => {
      response += `• ${practice}\n`;
    });
  }

  if (treatment.warnings && treatment.warnings.length > 0) {
    response += `\nLưu ý: ${treatment.warnings[0]}`;
  }

  return response;
}

// HÀM TẠO TÓM TẮT BỆNH THEO TRIỆU CHỨNG
function generateDiseaseSummaryBySymptom(diseases, symptoms, queryText) {
  // Chuyển mảng symptoms thành chuỗi hiển thị
  const symptomText =
    queryText && queryText.trim() !== ""
      ? queryText // Sử dụng queryText nếu có (vd: "hạt lép")
      : symptoms.filter((s) => s && s.trim() !== "").join(", ");

  let response = `Dựa trên triệu chứng ${symptomText}, có thể cây lúa đang mắc phải các bệnh sau:\n\n`;

  // Hiển thị tối đa 3 bệnh
  diseases.slice(0, 3).forEach((disease, index) => {
    // Sử dụng commonName hoặc scientificName nếu name không có
    const secondaryName = disease.commonName || disease.scientificName || "";

    response += `${index + 1}. ${disease.name} (${secondaryName})\n`;

    const symptomsDoc = disease.symptoms; // Đây là document của DiseaseSymptom (đã được populate)

    if (
      symptomsDoc &&
      symptomsDoc.symptoms &&
      symptomsDoc.symptoms.length > 0
    ) {
      response += `Triệu chứng chính:\n`;
      // Chỉ lấy 3 triệu chứng đầu tiên để tóm tắt
      symptomsDoc.symptoms.slice(0, 3).forEach((s) => {
        // Ví dụ: - [Hạt] Hạt bị lem, có màu nâu đen...
        const desc = s.description.substring(0, 100);
        response += `- [${s.part || "Không rõ"}] ${desc}${
          s.description.length > 100 ? "..." : ""
        }\n`;
      });
      if (symptomsDoc.symptoms.length > 3) {
        response += `- ... và ${
          symptomsDoc.symptoms.length - 3
        } triệu chứng khác (xem chi tiết).\n`;
      }
    } else {
      // FALLBACK: Nếu không có data triệu chứng chi tiết, hiển thị mô tả chung
      const descriptionSnippet = disease.description.substring(0, 150);
      response += `Mô tả chung: ${descriptionSnippet}${
        disease.description.length > 150 ? "..." : ""
      }\n`;
    }

    response += `Nguy cơ: ${disease.severityRisk}\n\n`;
  });

  if (diseases.length > 3) {
    response += `Và ${
      diseases.length - 3
    } bệnh khác. Bạn muốn tôi cung cấp chi tiết về bệnh nào?`;
  } else {
    response += `Bạn muốn tôi cung cấp chi tiết về bệnh nào?`;
  }

  return response;
}
