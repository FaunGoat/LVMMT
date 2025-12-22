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

async function groupDiseasesByType() {
  try {
    const diseases = await Disease.find()
      .select("_id name commonName type")
      .lean();

    const grouped = {};

    // Nhóm bệnh theo type
    diseases.forEach((disease) => {
      const type = disease.type || "Khác";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(disease);
    });

    // Giới hạn mỗi loại 3-4 bệnh
    const result = {};
    let globalIndex = 1;
    const indexMap = {};

    Object.keys(grouped)
      .sort()
      .forEach((type) => {
        result[type] = grouped[type].slice(0, 4);

        // Tạo mapping: globalIndex -> { diseaseId, name, type }
        result[type].forEach((disease) => {
          indexMap[globalIndex] = {
            diseaseId: disease._id.toString(),
            name: disease.name,
            type: type,
          };
          globalIndex++;
        });
      });

    return { grouped: result, indexMap };
  } catch (error) {
    console.error("Error in groupDiseasesByType:", error);
    return { grouped: {}, indexMap: {} };
  }
}

// ========== HÀM HELPER EXTRACT CONTEXT ==========
function getContextParameter(outputContexts, contextName, paramName) {
  if (!outputContexts || outputContexts.length === 0) return null;

  const context = outputContexts.find(
    (c) => c.name && c.name.includes(contextName)
  );
  if (!context || !context.parameters) return null;

  const value =
    context.parameters.fields?.[paramName]?.stringValue ||
    context.parameters[paramName];

  return value;
}

exports.handleWebhook = async (req, res) => {
  const sessionPath = req.body.session || "unknown-session";
  const intent = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters || {};
  const queryText = req.body.queryResult.queryText || "";

  let outputContextsToSend = [];

  const outputContexts_all = req.body.queryResult.outputContexts || [];
  const selectedDiseaseContext = outputContexts_all.find((c) =>
    c.name.includes("selected-disease")
  );

  let contextDiseaseId = null;
  let contextDiseaseName = null;

  if (selectedDiseaseContext && selectedDiseaseContext.parameters) {
    contextDiseaseId = selectedDiseaseContext.parameters.diseaseId;
    contextDiseaseName = selectedDiseaseContext.parameters.diseaseName;
    console.log("✅ Found context disease:", contextDiseaseName);
  }

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
      // const searchQuery = buildSearchQuery(diseaseName);
      // const disease = await Disease.findOne(searchQuery)
      //   .populate("causes")
      //   .populate("seasons");

      let disease = null;

      // 1. ƯU TIÊN SỐ 1: Nếu người dùng nhắc tên bệnh mới trong câu hỏi (Entity)
      if (diseaseEntity) {
        const searchQuery = buildSearchQuery(diseaseName);
        disease = await Disease.findOne(searchQuery)
          .populate("causes")
          .populate("seasons");
        console.log("📌 Tìm thấy bệnh mới từ Entity:", disease?.name);
      }

      // 2. ƯU TIÊN SỐ 2: Nếu không nhắc tên bệnh, mới lấy từ Context (Hỏi nối tiếp)
      if (!disease && contextDiseaseId) {
        disease = await Disease.findById(contextDiseaseId)
          .populate("causes")
          .populate("seasons");
        console.log("📌 Sử dụng lại bệnh cũ từ Context:", disease?.name);
      }

      // 3. FALLBACK: Tìm theo text tự do
      if (!disease) {
        const diseaseName = cleanText(queryText);
        disease = await Disease.findOne({
          $or: [
            { name: { $regex: diseaseName, $options: "i" } },
            { commonName: { $regex: diseaseName, $options: "i" } },
          ],
        });
      }

      if (!disease) {
        responseText =
          `Tôi chưa tìm thấy thông tin về "${disease || queryText}".\n\n` +
          `Bạn có thể hỏi về:\n` +
          `• Đạo ôn\n• Rầy nâu\n• Lem lép hạt\n• Cháy bìa lá\n• Sâu cuốn lá`;
      } else {
        let finalQuestionType = analyzeQuestion(queryText);

        // Ép kiểu dựa trên Intent từ Dialogflow
        if (intent === "Ask_Disease_Season") finalQuestionType = "seasons";
        if (intent === "Ask_Disease_Cause") finalQuestionType = "causes";
        if (intent === "Ask_Disease_Symptom") finalQuestionType = "symptoms";

        responseText = await generateSmartResponse(
          disease,
          finalQuestionType,
          disease
        );

        outputContextsToSend.push({
          name: `${sessionPath}/contexts/selected-disease`,
          lifespanCount: 10,
          parameters: {
            diseaseId: disease._id.toString(),
            diseaseName: disease.name,
            lastQuestionType: finalQuestionType,
          },
        });

        // ✅ CHỈ HIỂN THỊ HÌNH ẢNH KHI HỎI VỀ ĐỊNH NGHĨA HOẶC TRIỆU CHỨNG
        const shouldShowImages = ["definition", "general", "symptoms"].includes(
          finalQuestionType
        );

        responseData = {
          type: "disease",
          disease: {
            _id: disease._id,
            name: disease.name,
            images: shouldShowImages ? disease.images || [] : [], // Chỉ gửi ảnh khi hỏi định nghĩa/triệu chứng
            link: `/sustainable-methods?id=${disease._id}`,
          },
          showImages: shouldShowImages, // Flag để frontend biết có hiển thị ảnh không
        };
      }
    }

    // 2. HỎI VỀ TRIỆU CHỨNG - LUÔN HIỂN THỊ ẢNH
    else if (intent === "Ask_Disease_By_Symptom") {
      if (!symptomEntity || symptomEntity.length === 0) {
        responseText =
          "Xin lỗi, tôi chưa nhận diện được triệu chứng nào. Bạn có thể mô tả rõ hơn không?";
      } else {
        const symptomKeywords = getSymptomKeywords(symptomEntity);
        const searchPattern = symptomKeywords.map(cleanText).join("|");
        const regexQuery = new RegExp(searchPattern, "i");

        const symptomDocs = await DiseaseSymptom.find({
          "symptoms.description": { $regex: regexQuery },
        }).select("diseaseId");

        if (symptomDocs.length === 0) {
          responseText = `Tôi không tìm thấy bệnh nào có triệu chứng liên quan đến "${symptomKeywords.join(
            ", "
          )}". Bạn có thể xem lại mô tả triệu chứng không?`;
        } else {
          const diseaseIds = symptomDocs.map((doc) => doc.diseaseId);
          const diseases = await Disease.find({ _id: { $in: diseaseIds } })
            .populate("symptoms")
            .limit(5)
            .select(
              "name commonName scientificName description severityRisk images _id"
            );

          if (diseases.length > 0) {
            const primaryDisease = diseases[0];

            responseText = generateDiseaseSummaryBySymptom(
              diseases,
              symptomKeywords,
              queryText
            );

            outputContextsToSend.push({
              name: `${sessionPath}/contexts/selected-disease`,
              lifespanCount: 10,
              parameters: {
                diseaseId: primaryDisease._id.toString(),
                diseaseName: primaryDisease.name,
              },
            });

            // ✅ LUÔN HIỂN THỊ ẢNH KHI TÌM BỆNH THEO TRIỆU CHỨNG
            responseData = {
              type: "disease",
              disease: {
                _id: primaryDisease._id,
                name: primaryDisease.name,
                images: primaryDisease.images || [],
                link: `/sustainable-methods?id=${primaryDisease._id}`,
              },
              showImages: true, // Luôn hiển thị ảnh cho triệu chứng
            };
          } else {
            responseText = `Tôi không tìm thấy bệnh nào có triệu chứng liên quan đến "${symptomKeywords.join(
              ", "
            )}". Bạn có thể xem lại mô tả triệu chứng không?`;
          }
        }
      }
    }

    // 3. HỎI VỀ CÁCH CHỮA TRỊ - KHÔNG HIỂN THỊ ẢNH
    else if (
      intent === "Ask_Disease_Treatment" ||
      intent === "Ask_Disease_Treatment_Specific"
    ) {
      console.log("→ Handling Ask_Disease_Treatment");

      const diseaseName = getDiseaseName(diseaseEntity) || cleanText(queryText);

      let disease = null;

      // 1. ƯU TIÊN SỐ 1: Nếu người dùng nhắc tên bệnh mới trong câu hỏi (Entity)
      if (diseaseEntity) {
        const searchQuery = buildSearchQuery(diseaseName);
        disease = await Disease.findOne(searchQuery)
          .populate("causes")
          .populate("seasons");
        console.log("📌 Tìm thấy bệnh mới từ Entity:", disease?.name);
      }

      // 2. ƯU TIÊN SỐ 2: Nếu không nhắc tên bệnh, mới lấy từ Context (Hỏi nối tiếp)
      if (!disease && contextDiseaseId) {
        disease = await Disease.findById(contextDiseaseId)
          .populate("causes")
          .populate("seasons");
        console.log("📌 Sử dụng lại bệnh cũ từ Context:", disease?.name);
      }

      // 3. FALLBACK: Tìm theo text tự do
      if (!disease) {
        const diseaseName = cleanText(queryText);
        disease = await Disease.findOne({
          $or: [
            { name: { $regex: diseaseName, $options: "i" } },
            { commonName: { $regex: diseaseName, $options: "i" } },
          ],
        });
      }

      const treatmentType = getTreatmentType(treatmentEntity);
      // const searchQuery = buildSearchQuery(diseaseName);
      // const disease = await Disease.findOne(searchQuery);

      if (!disease) {
        responseText = `Vui lòng cho biết bạn muốn chữa bệnh gì?\n\nVí dụ: "Cách chữa đạo ôn"`;
      } else {
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

        // ✅ KHÔNG GỬI ẢNH CHO CÂU HỎI VỀ ĐIỀU TRỊ
        responseData = {
          type: "disease",
          disease: {
            _id: disease._id,
            name: disease.name,
            images: [], // Không gửi ảnh
            link: `/sustainable-methods?id=${disease._id}`,
          },
          showImages: false,
        };
      }
    }

    // ========== INTENT: ASK_ALL_DISEASES ==========
    else if (intent === "Ask_All_Diseases") {
      console.log("→ Handling Ask_All_Diseases");

      const { grouped, indexMap } = await groupDiseasesByType();

      if (Object.keys(grouped).length === 0) {
        responseText = "Hiện chưa có dữ liệu bệnh trong hệ thống.";
      } else {
        responseText = "DANH SÁCH BỆNH LÚA (Theo loại)\n\n";

        Object.keys(grouped).forEach((type) => {
          responseText += `🔹 ${type.toUpperCase()}\n`;

          grouped[type].forEach((disease) => {
            const idx = Object.keys(indexMap).find(
              (k) => indexMap[k].diseaseId === disease._id.toString()
            );
            responseText += `  ${idx}. ${disease.name}`;
            if (disease.commonName) {
              responseText += ` (${disease.commonName})`;
            }
            responseText += `\n`;
          });

          responseText += `\n`;
        });

        responseText +=
          `Gợi ý:\n` +
          `• Nhập số (1, 2, 3...)\n` +
          `• Hoặc gõ tên bệnh\n` +
          `• Ví dụ: "1" hoặc "Đạo ôn"`;

        // Set Output Context: disease-list
        outputContextsToSend = [
          {
            name: `${sessionPath}/contexts/disease-list`,
            lifespanCount: 5,
            parameters: {
              indexMap: JSON.stringify(indexMap),
              diseasesByType: JSON.stringify(grouped),
            },
          },
        ];

        // Gửi danh sách cho frontend
        responseData = {
          type: "disease_list_grouped",
          diseasesByType: Object.keys(grouped).map((type) => ({
            type: type,
            diseases: grouped[type].map((d) => {
              const globalIdx = Object.keys(indexMap).find(
                (k) => indexMap[k].diseaseId === d._id.toString()
              );
              return {
                id: d._id,
                name: d.name,
                commonName: d.commonName,
                index: globalIdx ? parseInt(globalIdx) : 0,
              };
            }),
          })),
        };
      }
    }

    // ========== INTENT 2: SELECT_DISEASE - Chọn bệnh từ danh sách ==========
    else if (intent === "Select_Disease") {
      console.log("\n→ Handling Select_Disease");

      let selectedDisease = null;
      let indexMap = {};

      // ✅ LẤY indexMap TỪ OUTPUT CONTEXTS
      console.log(
        "📤 Available contexts:",
        outputContextsToSend.map((c) => c.name)
      );

      const indexMapStr = getContextParameter(
        outputContexts_all,
        "disease-list",
        "indexMap"
      );

      if (indexMapStr) {
        try {
          indexMap = JSON.parse(indexMapStr);
          console.log(
            "✅ IndexMap loaded:",
            Object.keys(indexMap).length,
            "entries"
          );
        } catch (e) {
          console.error("❌ Error parsing indexMap:", e.message);
        }
      } else {
        console.warn("⚠️ IndexMap not found in contexts");
      }

      // ========== CASE 1: INPUT LÀ SỐ ==========
      const numberMatch = queryText.match(/^\d+$/);
      if (numberMatch) {
        const selectedIndex = parseInt(numberMatch[0]);
        console.log(`🔢 Nhập số: ${selectedIndex}`);

        const diseaseInfo = indexMap[selectedIndex];

        if (diseaseInfo) {
          console.log(`✅ Tìm thấy bệnh từ số ${selectedIndex}:`, diseaseInfo);
          selectedDisease = await Disease.findById(diseaseInfo.diseaseId)
            .populate("causes")
            .populate("seasons");
        } else {
          console.warn(`⚠️ Số ${selectedIndex} không có trong indexMap`);

          // Fallback: tìm trong tất cả diseases
          const allDiseases = await Disease.find()
            .select("_id name commonName type")
            .lean();

          if (selectedIndex > 0 && selectedIndex <= allDiseases.length) {
            const disease = allDiseases[selectedIndex - 1];
            console.log(`✅ Fallback: Tìm thấy bệnh:`, disease.name);
            selectedDisease = await Disease.findById(disease._id)
              .populate("causes")
              .populate("seasons");
          }
        }
      }
      // ========== CASE 2: INPUT LÀ TÊN BỆNH ==========
      else {
        // ✅ MAP ENTITY SANG TÊN BỆNH TRONG DB
        let searchTerm = diseaseEntity
          ? getDiseaseName(diseaseEntity)
          : cleanText(queryText);
        console.log(
          `📝 Tìm bệnh theo tên: "${searchTerm}" (entity: ${diseaseEntity})`
        );

        selectedDisease = await Disease.findOne({
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { commonName: { $regex: searchTerm, $options: "i" } },
            { scientificName: { $regex: searchTerm, $options: "i" } },
          ],
        })
          .populate("causes")
          .populate("seasons");

        if (selectedDisease) {
          console.log(`✅ Tìm thấy bệnh:`, selectedDisease.name);
        } else {
          console.warn(`⚠️ Không tìm thấy bệnh: "${searchTerm}"`);

          // Fallback: Tìm trong indexMap
          const diseaseFromMap = Object.values(indexMap).find((d) =>
            d.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (diseaseFromMap) {
            console.log(`✅ Tìm thấy trong indexMap:`, diseaseFromMap.name);
            selectedDisease = await Disease.findById(diseaseFromMap.diseaseId)
              .populate("causes")
              .populate("seasons");
          }
        }
      }

      // ========== RESPONSE ==========
      if (!selectedDisease) {
        responseText =
          `Tôi chưa tìm thấy bệnh này.\n\n` +
          `Bạn có thể:\n` +
          `• Hỏi "Có bệnh nào?" để xem danh sách\n` +
          `• Nhập số từ danh sách (1, 2, 3...)\n` +
          `• Mô tả triệu chứng để tôi nhận biết`;
      } else {
        const questionType = analyzeQuestion(queryText);
        console.log(`📋 Question type: ${questionType}`);

        responseText = await generateSmartResponse(
          selectedDisease,
          questionType,
          selectedDisease.name
        );

        // ✅ SET OUTPUT CONTEXT: selected-disease
        outputContextsToSend = [
          {
            name: `${sessionPath}/contexts/selected-disease`,
            lifespanCount: 10,
            parameters: {
              diseaseId: selectedDisease._id.toString(),
              diseaseName: selectedDisease.name,
              lastQuestionType: questionType,
            },
          },
        ];

        const shouldShowImages = ["definition", "symptoms"].includes(
          questionType
        );

        responseData = {
          type: "disease",
          disease: {
            _id: selectedDisease._id,
            name: selectedDisease.name,
            images: shouldShowImages ? selectedDisease.images || [] : [],
            link: `/sustainable-methods?id=${selectedDisease._id}`,
          },
          showImages: shouldShowImages,
          questionType,
        };
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

    // 8. HỎI VỀ GIAI ĐOẠN PHÁT TRIỂN BỆNH - KHÔNG HIỂN THỊ ẢNH
    else if (queryText.match(/giai đoạn|phát triển|vòng đời|chu kỳ/i)) {
      console.log("→ Handling Ask_Disease_Prevention");

      const diseaseName = getDiseaseName(diseaseEntity) || cleanText(queryText);

      let disease = null;

      // 1. ƯU TIÊN SỐ 1: Nếu người dùng nhắc tên bệnh mới trong câu hỏi (Entity)
      if (diseaseEntity) {
        const searchQuery = buildSearchQuery(diseaseName);
        disease = await Disease.findOne(searchQuery)
          .populate("causes")
          .populate("seasons");
        console.log("📌 Tìm thấy bệnh mới từ Entity:", disease?.name);
      }

      // 2. ƯU TIÊN SỐ 2: Nếu không nhắc tên bệnh, mới lấy từ Context (Hỏi nối tiếp)
      if (!disease && contextDiseaseId) {
        disease = await Disease.findById(contextDiseaseId)
          .populate("causes")
          .populate("seasons");
        console.log("📌 Sử dụng lại bệnh cũ từ Context:", disease?.name);
      }

      // 3. FALLBACK: Tìm theo text tự do
      if (!disease) {
        const diseaseName = cleanText(queryText);
        disease = await Disease.findOne({
          $or: [
            { name: { $regex: diseaseName, $options: "i" } },
            { commonName: { $regex: diseaseName, $options: "i" } },
          ],
        });
      }

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
              responseText += `   GIAI ĐOẠN NGUY HIỂM NHẤT\n`;
            }
            responseText += `\n`;
          });
        }

        // Không hiển thị ảnh cho giai đoạn phát triển
        responseData = {
          type: "disease",
          disease: {
            _id: disease._id,
            name: disease.name,
            images: [],
            link: `/sustainable-methods?id=${disease._id}`,
          },
          showImages: false,
        };
      }
      if (disease) {
        outputContextsToSend.push({
          name: `${sessionPath}/contexts/selected-disease`,
          lifespanCount: 10, // Refresh lại 10 lượt mới
          parameters: {
            diseaseId: disease._id.toString(),
            diseaseName: disease.name,
          },
        });
      }
    }

    // 9. HỎI VỀ MỐI LIÊN HỆ THỜI TIẾT VÀ BỆNH - KHÔNG HIỂN THỊ ẢNH
    else if (
      queryText.match(
        /thời tiết|mưa|nắng|nóng|ẩm|nhiệt độ|điều kiện|khí hậu|gió|khô/i
      )
    ) {
      console.log("→ Handling Ask_Disease_Weather");

      const weatherType = analyzeWeatherQuestion(queryText);
      let disease = null;

      if (weatherType === "general_weather_impact") {
        responseText = await handleGeneralWeatherImpact(queryText);
      } else if (weatherType === "diseases_by_weather") {
        responseText = await handleDiseasesByWeatherCondition(queryText);
      } else {
        const diseaseName =
          getDiseaseName(diseaseEntity) || cleanText(queryText);

        // 1. ƯU TIÊN SỐ 1: Nếu người dùng nhắc tên bệnh mới trong câu hỏi (Entity)
        if (diseaseEntity) {
          const searchQuery = buildSearchQuery(diseaseName);
          disease = await Disease.findOne(searchQuery)
            .populate("causes")
            .populate("seasons");
          console.log("📌 Tìm thấy bệnh mới từ Entity:", disease?.name);
        }

        // 2. ƯU TIÊN SỐ 2: Nếu không nhắc tên bệnh, mới lấy từ Context (Hỏi nối tiếp)
        if (!disease && contextDiseaseId) {
          disease = await Disease.findById(contextDiseaseId)
            .populate("causes")
            .populate("seasons");
          console.log("📌 Sử dụng lại bệnh cũ từ Context:", disease?.name);
        }

        // 3. FALLBACK: Tìm theo text tự do
        if (!disease) {
          const diseaseName = cleanText(queryText);
          disease = await Disease.findOne({
            $or: [
              { name: { $regex: diseaseName, $options: "i" } },
              { commonName: { $regex: diseaseName, $options: "i" } },
            ],
          });
        }

        if (!disease) {
          responseText = `Tôi chưa tìm thấy thông tin về bệnh "${diseaseName}".`;
        } else {
          const weatherCorr = await WeatherDiseaseCorrelation.findOne({
            diseaseId: disease._id,
          });

          if (
            !weatherCorr ||
            !weatherCorr.weatherTriggers ||
            weatherCorr.weatherTriggers.length === 0
          ) {
            responseText =
              `Hiện chưa có thông tin chi tiết về mối liên hệ giữa ` +
              `thời tiết và ${disease.name}.`;
          } else {
            responseText = `Điều kiện thời tiết thuận lợi cho ${disease.name}:\n\n`;

            weatherCorr.weatherTriggers.slice(0, 4).forEach((trigger, idx) => {
              responseText += `${idx + 1}. ${trigger.condition}\n`;
              responseText += `   Mức độ nguy hiểm: ${trigger.riskLevel}\n`;

              if (trigger.threshold) {
                const temp = trigger.threshold.temperature;
                const humid = trigger.threshold.humidity;
                const rainfall = trigger.threshold.rainfall;

                if (temp && temp.min && temp.max) {
                  responseText += `   Nhiệt độ: ${temp.min}-${temp.max}°C\n`;
                }
                if (humid && humid.min && humid.max) {
                  responseText += `   Độ ẩm: ${humid.min}-${humid.max}%\n`;
                }
                if (rainfall && rainfall.amount) {
                  responseText += `   Lượng mưa: ${rainfall.amount}\n`;
                }
              }

              if (trigger.durationToOutbreak) {
                responseText += `   Xuất hiện sau: ${trigger.durationToOutbreak}\n`;
              }
              if (trigger.response) {
                responseText += `   Biện pháp: ${trigger.response}\n`;
              }

              responseText += `\n`;
            });
          }

          // Không hiển thị ảnh cho câu hỏi về thời tiết
          responseData = {
            type: "disease",
            disease: {
              _id: disease._id,
              name: disease.name,
              images: [],
              link: `/sustainable-methods?id=${disease._id}`,
            },
            showImages: false,
          };
        }
      }
      if (disease) {
        outputContextsToSend.push({
          name: `${sessionPath}/contexts/selected-disease`,
          lifespanCount: 10, // Refresh lại 10 lượt mới
          parameters: {
            diseaseId: disease._id.toString(),
            diseaseName: disease.name,
          },
        });
      }
    }

    // 10. HỎI VỀ PHÒNG NGỪA - KHÔNG HIỂN THỊ ẢNH
    else if (
      queryText.match(
        /phòng|phòng ngừa|phòng trừ|phòng tránh|dự phòng|làm sao để tránh|làm gì để tránh|cách phòng/i
      )
    ) {
      console.log("→ Handling Ask_Disease_Prevention");

      let disease = null;

      // 1. ƯU TIÊN SỐ 1: Nếu người dùng nhắc tên bệnh mới trong câu hỏi (Entity)
      if (diseaseEntity) {
        const searchQuery = buildSearchQuery(diseaseEntity);
        disease = await Disease.findOne(searchQuery)
          .populate("causes")
          .populate("seasons");
        console.log("📌 Tìm thấy bệnh mới từ Entity:", disease?.name);
      }

      // 2. ƯU TIÊN SỐ 2: Nếu không nhắc tên bệnh, mới lấy từ Context (Hỏi nối tiếp)
      if (!disease && contextDiseaseId) {
        disease = await Disease.findById(contextDiseaseId)
          .populate("causes")
          .populate("seasons");
        console.log("📌 Sử dụng lại bệnh cũ từ Context:", disease?.name);
      }

      // 3. FALLBACK: Tìm theo text tự do
      if (!disease) {
        const diseaseName = cleanText(queryText);
        disease = await Disease.findOne({
          $or: [
            { name: { $regex: diseaseName, $options: "i" } },
            { commonName: { $regex: diseaseName, $options: "i" } },
          ],
        });
      }

      if (!disease) {
        responseText =
          `Tôi chưa biết bạn đang hỏi về bệnh nào.\n\n` +
          `Bạn có thể:\n` +
          `• Chọn bệnh từ danh sách\n` +
          `• Hoặc hỏi "Có bệnh nào?" để xem danh sách`;
      } else {
        const preventionDoc = await DiseasePrevention.findOne({
          diseaseId: disease._id,
        });

        if (!preventionDoc) {
          responseText = `Hiện chưa có thông tin phòng ngừa cho ${disease.name}.`;
        } else {
          responseText = `Cách phòng ngừa ${disease.name}:\n\n`;

          if (
            preventionDoc.culturalPractices &&
            preventionDoc.culturalPractices.length > 0
          ) {
            responseText += ` Biện pháp canh tác:\n`;
            preventionDoc.culturalPractices.slice(0, 3).forEach((practice) => {
              responseText += `• ${practice.practice}\n`;
              responseText += `* ${practice.description}\n`;
            });
            responseText += `\n`;
          }

          if (
            preventionDoc.varietySelection &&
            preventionDoc.varietySelection.length > 0
          ) {
            responseText += ` Giống lúa kháng bệnh:\n`;
            preventionDoc.varietySelection.slice(0, 3).forEach((variety) => {
              responseText += `• ${variety.varietyName} - ${variety.resistanceLevel}\n`;
            });
            responseText += `\n`;
          }

          if (
            preventionDoc.biologicalControl &&
            preventionDoc.biologicalControl.length > 0
          ) {
            responseText += ` Kiểm soát sinh học:\n`;
            preventionDoc.biologicalControl.slice(0, 2).forEach((bio) => {
              responseText += `• ${bio.agent}\n`;
            });
            responseText += `\n`;
          }

          if (
            preventionDoc.seedTreatment &&
            preventionDoc.seedTreatment.length > 0
          ) {
            responseText += ` Xử lý hạt giống:\n`;
            preventionDoc.seedTreatment.slice(0, 2).forEach((treatment) => {
              responseText += `• ${treatment.materials}\n`;
            });
            responseText += `\n`;
          }

          if (
            preventionDoc.nutritionManagement &&
            preventionDoc.nutritionManagement.length > 0
          ) {
            responseText += ` Quản lý dinh dưỡng:\n`;
            preventionDoc.nutritionManagement
              .slice(0, 2)
              .forEach((management) => {
                responseText += `• ${management.recommendation}: ${management.nutrient}\n`;
              });
            responseText += `\n`;
          }

          if (
            preventionDoc.waterManagement &&
            preventionDoc.waterManagement.length > 0
          ) {
            responseText += ` Quản lý nước:\n`;
            preventionDoc.waterManagement.slice(0, 2).forEach((treatment) => {
              responseText += `• ${treatment.description}\n`;
            });
            responseText += `\n`;
          }

          if (
            preventionDoc.monitoringSchedule &&
            preventionDoc.monitoringSchedule.length > 0
          ) {
            responseText += ` Giám sát:\n`;
            preventionDoc.monitoringSchedule
              .slice(0, 2)
              .forEach((treatment) => {
                responseText += `• ${treatment.frequency}\n`;
                responseText += `  Kiểm tra: ${treatment.whatToCheck}\n`;
              });
            responseText += `\n`;
          }

          if (
            preventionDoc.sanitationPractices &&
            preventionDoc.sanitationPractices.length > 0
          ) {
            responseText += ` Vệ sinh đồng ruộng:\n`;
            preventionDoc.sanitationPractices
              .slice(0, 2)
              .forEach((treatment) => {
                responseText += `• ${treatment.practice}\n`;
              });
          }
        }

        // Không hiển thị ảnh cho phòng ngừa
        responseData = {
          type: "disease",
          disease: {
            _id: disease._id,
            name: disease.name,
            images: [],
            link: `/sustainable-methods?id=${disease._id}`,
          },
          showImages: false,
        };
      }
      if (disease) {
        outputContextsToSend.push({
          name: `${sessionPath}/contexts/selected-disease`,
          lifespanCount: 10, // Refresh lại 10 lượt mới
          parameters: {
            diseaseId: disease._id.toString(),
            diseaseName: disease.name,
          },
        });
      }
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    responseText = "Hệ thống đang bận. Bạn thử lại sau vài phút nhé!";
  }

  res.json({
    fulfillmentText: responseText,
    outputContexts: outputContextsToSend, // Gửi toàn bộ mảng context đã thu thập
    payload: responseData ? { data: responseData } : undefined,
  });
};

// HÀM PHÂN TÍCH LOẠI CÂU HỎI
function analyzeQuestion(question) {
  const q = question.toLowerCase();

  if (q.match(/là gì|định nghĩa|khái niệm|gì vậy|giới thiệu/)) {
    return "definition";
  }
  if (
    q.match(/triệu chứng|dấu hiệu|biểu hiện|nhận biết|tác hại|gây hại|có vẻ|bị/)
  ) {
    return "symptoms";
  }
  if (q.match(/cách chữa|điều trị|phòng|trừ|thuốc|xử lý/)) {
    return "treatment";
  }
  if (q.match(/nguyên nhân|tại sao|do đâu|vì sao|gây ra/)) {
    return "causes";
  }
  if (q.match(/nguy hiểm|ảnh hưởng|thiệt hại|mất mát|tác động/)) {
    return "impact";
  }
  if (q.match(/khi nào|lúc nào|tháng mấy|mùa|vụ|thời điểm|giai đoạn|bao lâu/)) {
    return "seasons";
  }
  if (q.match(/thời tiết|mưa|nắng|nóng|ẩm|nhiệt độ|khí hậu|gió|điều kiện/)) {
    return "weather";
  }

  return "general";
}

// HÀM TẠO RESPONSE THÔNG MINH
async function generateSmartResponse(disease, finalQuestionType, searchTerm) {
  let response = "";

  switch (finalQuestionType) {
    case "definition":
      response =
        ` ${disease.name} (${disease.commonName || "Hại lúa"})\n\n` +
        `${disease.description}\n\n` +
        `Loại: ${disease.type}\n` +
        `Mức độ: ${disease.severityRisk}\n` +
        `Thiệt hại: ${disease.economicLoss}`;
      break;

    case "symptoms":
      const symptomDoc = await DiseaseSymptom.findOne({
        diseaseId: disease._id,
      });
      if (symptomDoc && symptomDoc.symptoms) {
        response =
          `Triệu chứng của ${disease.name}:\n\n` +
          symptomDoc.symptoms
            .slice(0, 5)
            .map((s, i) => `${i + 1}. [${s.part}] ${s.description}`)
            .join("\n\n") +
          `\n\nMức độ nguy hiểm: ${disease.severityRisk}` +
          `\nThiệt hại kinh tế: ${disease.economicLoss}`;
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
          response += `\n Điều kiện môi trường:\n`;
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
      const seasonDoc = disease.seasons;

      if (seasonDoc && seasonDoc.seasons && seasonDoc.seasons.length > 0) {
        response = ` Thời điểm ${disease.name} phát triển mạnh:\n\n`;

        seasonDoc.seasons.forEach((s) => {
          response += ` Vụ ${s.type}: Tháng ${s.startMonth} - ${s.endMonth}\n`;
          response += `   Mức độ: ${s.riskLevel}\n`;
          if (s.peakMonths && s.peakMonths.length > 0) {
            response += `   Cao điểm: Tháng ${s.peakMonths.join(", ")}\n`;
          }
          response += `\n`;
        });

        if (seasonDoc.criticalPeriods && seasonDoc.criticalPeriods.length > 0) {
          response += ` Giai đoạn lúa dễ bị tấn công:\n`;
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
        `Thiệt hại kinh tế: ${disease.economicLoss}\n\n` +
        `${disease.description}`;
      break;

    case "weather":
      const weatherCorr = await WeatherDiseaseCorrelation.findOne({
        diseaseId: disease._id,
      });
      if (weatherCorr && weatherCorr.weatherTriggers) {
        response =
          ` ${disease.name} và thời tiết:\n\n` +
          `Điều kiện phát bệnh:\n` +
          weatherCorr.weatherTriggers
            .slice(0, 3)
            .map((w, i) => `${i + 1}. ${w.condition} - ${w.riskLevel}`)
            .join("\n");
      } else {
        response = `Hiện chưa có thông tin về mối liên hệ thời tiết với ${disease.name}.`;
      }
      break;

    default:
      response =
        ` ${disease.name} (${disease.commonName || "Hại lúa"})\n\n` +
        `${disease.description}\n\n` +
        `Mức độ: ${disease.severityRisk} - Thiệt hại ${disease.economicLoss}`;
  }

  return response;
}

// HÀM TẠO RESPONSE ĐIỀU TRỊ
function generateTreatmentResponse(treatmentDoc, diseaseName) {
  if (!treatmentDoc || !treatmentDoc.treatments) {
    return `Hiện chưa có thông tin điều trị cho ${diseaseName}.`;
  }

  let response = `Cách chữa trị ${diseaseName}:\n\n`;

  const chemical = treatmentDoc.treatments.find((t) => t.type === "Hóa học");
  if (chemical && chemical.methods && chemical.methods.length > 0) {
    response += `Thuốc hóa học:\n`;
    chemical.methods.slice(0, 3).forEach((method) => {
      response += `• ${method.name}`;
      if (method.dosage) response += ` - ${method.dosage}`;
      response += "\n";
    });
    if (chemical.notes) response += `  Lưu ý: ${chemical.notes}\n`;
    response += "\n";
  }

  const bio = treatmentDoc.treatments.find((t) => t.type === "Sinh học");
  if (bio && bio.methods && bio.methods.length > 0) {
    response += `Phương pháp sinh học:\n`;
    bio.methods.slice(0, 3).forEach((method) => {
      response += `• ${method.name}`;
      if (method.dosage) response += ` - ${method.dosage}`;
      response += "\n";
    });
    if (bio.notes) response += `  Lưu ý: ${bio.notes}\n`;
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
    return `Hiện chưa có thông tin về phương pháp ${treatmentType} cho ${diseaseName}.\n\n❓ Bạn muốn xem các phương pháp khác?`;
  }

  if (treatment.methods && treatment.methods.length > 0) {
    response += `Thuốc/Biện pháp:\n`;
    treatment.methods.slice(0, 5).forEach((method, idx) => {
      response += `${idx + 1}. ${method.name}`;
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
  const symptomText =
    queryText && queryText.trim() !== ""
      ? queryText
      : symptoms.filter((s) => s && s.trim() !== "").join(", ");

  let response = `Dựa trên triệu chứng "${symptomText}", cây lúa có thể đang mắc:\n\n`;

  diseases.slice(0, 3).forEach((disease, index) => {
    const secondaryName = disease.commonName || disease.scientificName || "";

    response += `${index + 1}. ${disease.name}${
      secondaryName ? ` (${secondaryName})` : ""
    }\n`;

    const symptomsDoc = disease.symptoms;

    if (
      symptomsDoc &&
      symptomsDoc.symptoms &&
      symptomsDoc.symptoms.length > 0
    ) {
      response += `   Triệu chứng chính:\n`;
      symptomsDoc.symptoms.slice(0, 3).forEach((s) => {
        const desc = s.description.substring(0, 100);
        response += `   • [${s.part}] ${desc}${
          s.description.length > 100 ? "..." : ""
        }\n`;
      });
      if (symptomsDoc.symptoms.length > 3) {
        response += `   • ... và ${
          symptomsDoc.symptoms.length - 3
        } triệu chứng khác\n`;
      }
    } else {
      const descriptionSnippet = disease.description.substring(0, 150);
      response += `   ${descriptionSnippet}${
        disease.description.length > 150 ? "..." : ""
      }\n`;
    }

    response += `   Nguy cơ: ${disease.severityRisk}\n\n`;
  });

  if (diseases.length > 3) {
    response += `... và ${
      diseases.length - 3
    } bệnh khác.\n\n Bạn muốn biết thêm chi tiết về bệnh nào?`;
  } else {
    response += `\n Bạn muốn biết thêm chi tiết về bệnh nào?`;
  }

  return response;
}

// ========== CÁC HÀM HỖ TRỢ THỜI TIẾT ==========
function analyzeWeatherQuestion(queryText) {
  const q = queryText.toLowerCase();
  if (
    q.match(/(mưa|nắng|nóng|ẩm|khô|gió)/) &&
    q.match(/(có ảnh hưởng|gây gì|gây bệnh|gây ra|tác hại|ảnh hưởng thế nào)/)
  ) {
    return "general_weather_impact";
  }
  if (
    q.match(/(bệnh nào|gây bệnh gì|bệnh gì|gây ra bệnh gì)/) &&
    q.match(/(mưa|nắng|nóng|ẩm|khô|gió)/)
  ) {
    return "diseases_by_weather";
  }
  return "weather_for_disease";
}

async function handleGeneralWeatherImpact(queryText) {
  const q = queryText.toLowerCase();
  let impact = "";

  if (q.match(/mưa/)) {
    impact =
      `Ảnh hưởng của mưa nhiều đến lúa:\n\n` +
      `Tác hại trực tiếp:\n` +
      `• Tạo độ ẩm cao - thuận lợi cho bệnh nấm\n` +
      `• Giảm lưu thông không khí\n` +
      `• Làm cây yếu, dễ bị sâu bệnh\n` +
      `• Gây ngập úng, thối bẹ nếu kéo dài\n` +
      `• Rụng hạt, hạt lem lép\n\n` +
      `Bệnh nguy hiểm:\n` +
      `• Đạo ôn (RẤT CAO)\n` +
      `• Cháy bìa lá (Cao)\n` +
      `• Lem lép hạt (Cao)\n\n` +
      `Biện pháp:\n` +
      `• Phun thuốc phòng trước 1-2 ngày\n` +
      `• Cải thiện thoát nước\n` +
      `• Bón phân kali tăng đề kháng`;
  } else if (q.match(/nắng|nóng/)) {
    impact =
      `Ảnh hưởng của nắng nóng đến lúa:\n\n` +
      `Tác hại:\n` +
      `• Gây stress nhiệt - cây héo\n` +
      `• Tăng tốc phát triển sâu hại\n` +
      `• Rầy nâu, sâu cuốn lá tăng mạnh\n` +
      `• Giảm bệnh nấm nhưng sâu tăng\n\n` +
      `Sâu bệnh nguy hiểm:\n` +
      `• Rầy nâu (RẤT CAO)\n` +
      `• Sâu cuốn lá (Cao)\n` +
      `• Nhện gié (Trung bình)\n\n` +
      `Biện pháp:\n` +
      `• Tưới nước thường xuyên\n` +
      `• Phun sinh học (kiến, bọ ngươi)\n` +
      `• Tránh bón quá nhiều đạm`;
  } else if (q.match(/ẩm/)) {
    impact =
      `Ảnh hưởng của độ ẩm cao:\n\n` +
      `Tác hại:\n` +
      `• Điều kiện lý tưởng cho bệnh nấm\n` +
      `• Giảm lưu thông không khí\n` +
      `• Phát triển bệnh mạnh vào sáng\n\n` +
      `Bệnh nguy hiểm:\n` +
      `• Đạo ôn (RẤT CAO khi >85%)\n` +
      `• Cháy bìa lá\n` +
      `• Lem lép hạt\n\n` +
      `Biện pháp:\n` +
      `• Cải thiện thoát nước\n` +
      `• Phun thuốc sáng sớm (trước 7h)\n` +
      `• Thường xuyên giám sát`;
  }

  return impact || "Tôi chưa có thông tin cụ thể về điều kiện này.";
}

async function handleDiseasesByWeatherCondition(queryText) {
  const q = queryText.toLowerCase();
  let response = "";

  if (q.match(/mưa/)) {
    response =
      `Bệnh yêu thích thời tiết mưa:\n\n` +
      `Bệnh đạo ôn (NGUY HIỂM NHẤT)\n` +
      `   • Độ ẩm: 85-100%\n` +
      `   • Nhiệt độ: 25-30°C\n` +
      `   • Xuất hiện: 2-3 ngày sau mưa\n` +
      `   • Nguy hiểm nhất: Đẻ nhánh - Trổ bông\n\n` +
      `Bệnh cháy bìa lá\n` +
      `   • Độ ẩm: 80-95%\n` +
      `   • Nhiệt độ: 22-28°C\n\n` +
      `Bệnh lem lép hạt\n` +
      `   • Yêu thích ẩm ướt cao\n` +
      `   • Nguy hiểm: Trổ bông - Chín sữa\n\n` +
      `CÁCH PHÒNG:\n` +
      `• Theo dõi dự báo, phun trước 1-2 ngày\n` +
      `• Chọn giống kháng (VC14, VC19, VC20)\n` +
      `• Cải thiện thoát nước`;
  } else if (q.match(/nắng|nóng/)) {
    response =
      `Sâu bệnh yêu thích nắng nóng:\n\n` +
      `Rầy nâu (NGUY HIỂM NHẤT)\n` +
      `   • Nhiệt độ: 25-32°C\n` +
      `   • Tối ưu: 28-30°C\n` +
      `   • Vòng đời: 7-10 ngày\n` +
      `   • Tăng gấp 10 lần trong 2-3 tuần\n\n` +
      `Sâu cuốn lá\n` +
      `   • Thích nắng, nhiệt độ cao\n` +
      `   • Ẩm độ: 60-80%\n\n` +
      `Nhện gié\n` +
      `   • Phát triển mạnh khi nắng liên tiếp\n` +
      `   • Độ ẩm thấp: 40-60%\n\n` +
      `CÁCH PHÒNG:\n` +
      `• Phun sinh học (kiến, bọ ngươi)\n` +
      `• Tưới nước thường xuyên\n` +
      `• Tránh bón quá nhiều đạm`;
  }

  return response || "Tôi chưa có thông tin về điều kiện này.";
}

function extractDiseaseNameFromQuery(queryText) {
  const diseasePatterns = [
    { pattern: /đạo ôn|cháy lá|thối cổ bông/i, name: "Bệnh đạo ôn" },
    { pattern: /rầy nâu|rầy cám/i, name: "Rầy nâu" },
    { pattern: /lem lép hạt|lửng hạt|lép hạt/i, name: "Bệnh lem lép hạt" },
    { pattern: /cháy bìa lá|bạc lá lúa/i, name: "Bệnh cháy bìa lá" },
    { pattern: /sâu cuốn lá|sâu gấp lá/i, name: "Sâu cuốn lá" },
    { pattern: /sâu đục thân|bướm hai chấm/i, name: "Sâu đục thân" },
    { pattern: /bọ trĩ|bù lạch/i, name: "Bọ trĩ" },
    { pattern: /muỗi hành|sâu năng/i, name: "Muỗi hành" },
    { pattern: /nhện gié|nhện|cạo gió/i, name: "Nhện gié" },
    { pattern: /bọ xít hôi|bọ xít dài|bọ xít kim/i, name: "Bọ xít hôi" },
    { pattern: /khô vằn|đốm vằn|ung thư lúa/i, name: "Bệnh khô vằn" },
    { pattern: /lùn xoắn lá|lúa xoăn/i, name: "Bệnh lùn xoắn lá" },
    { pattern: /lúa von|mạ đực/i, name: "Bệnh lúa von" },
    { pattern: /sọc trong/i, name: "Bệnh sọc trong" },
    { pattern: /thối bẹ|thối bẹ cờ/i, name: "Bệnh thối bẹ" },
    { pattern: /thối thân|tiêm hạch nấm/i, name: "Bệnh thối thân" },
    { pattern: /vàng lá chín sớm|vàng lá nấm/i, name: "Bệnh vàng lá chín sớm" },
    { pattern: /vàng lùn|lúa cỏ/i, name: "Bệnh vàng lùn" },
    { pattern: /đốm nâu|tiêm lửa|tiêm hạch/i, name: "Bệnh đốm nâu" },
    { pattern: /đốm vòng|đốm mắt cua/i, name: "Bệnh đốm vòng" },
  ];

  for (let item of diseasePatterns) {
    if (item.pattern.test(queryText)) {
      return item.name;
    }
  }
  return null;
}
