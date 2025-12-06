const Disease = require("../models/new/Disease");
const DiseaseStage = require("../models/new/DiseaseStage");
const DiseaseSeason = require("../models/new/DiseaseSeason");
const DiseaseCause = require("../models/new/DiseaseCause");
const DiseaseSymptom = require("../models/new/DiseaseSymptom");
const DiseaseTreatment = require("../models/new/DiseaseTreatment");
const DiseasePrevention = require("../models/new/DiseasePrevention");
const WeatherDiseaseCorrelation = require("../models/new/WeatherDiseaseCorrelation");

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Hàm tạo Regex tìm kiếm tiếng Việt bất chấp dấu
// Ví dụ: "dao on" -> tìm được "Đạo ôn", "đạo ôn", "ĐẠO ÔN"
function createVietnameseRegex(keyword) {
  if (!keyword) return "";

  const str = keyword.toLowerCase();
  let regexStr = str
    .replace(/a/g, "[aáàảãạăắằẳẵặâấầẩẫậ]")
    .replace(/d/g, "[dđ]")
    .replace(/e/g, "[eéèẻẽẹêếềểễệ]")
    .replace(/i/g, "[iíìỉĩị]")
    .replace(/o/g, "[oóòỏõọôốồổỗộơớờởỡợ]")
    .replace(/u/g, "[uúùủũụưứừửữự]")
    .replace(/y/g, "[yýỳỷỹỵ]");

  return new RegExp(regexStr, "i");
}

// ==========================================
// CONTROLLER FUNCTIONS
// ==========================================

// 1. Lấy tất cả bệnh (chỉ thông tin cơ bản)
exports.getAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find({}).sort({ name: 1 });
    res.json({
      success: true,
      count: diseases.length,
      data: diseases,
    });
  } catch (error) {
    console.error("Error fetching diseases:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy danh sách bệnh lúa",
    });
  }
};

// 2. Tìm kiếm và Lọc bệnh (Nâng cao)
// Hỗ trợ: Tên, Loại, Mức độ, Mùa vụ, Giai đoạn, Bộ phận
exports.searchDiseases = async (req, res) => {
  try {
    const {
      query, // Từ khóa tìm kiếm
      type, // Loại bệnh: Nấm, Vi khuẩn...
      severityRisk, // Mức độ: Rất cao, Cao...
      season, // Mùa vụ: Đông Xuân, Hè Thu...
      cropStage, // Giai đoạn: Đẻ nhánh, Trổ bông...
      symptomPart, // Bộ phận: Lá, Thân, Rễ...
    } = req.query;

    // Danh sách ID hợp lệ sau khi lọc qua các bảng phụ
    // null nghĩa là chưa có bộ lọc phụ nào được áp dụng
    let validIds = null;

    // --- BƯỚC 1: LỌC THEO MÙA VỤ HOẶC GIAI ĐOẠN (Bảng DiseaseSeason) ---
    if ((season && season !== "all") || (cropStage && cropStage !== "all")) {
      let seasonQuery = {};

      if (season && season !== "all") {
        seasonQuery["seasons.type"] = season;
      }

      if (cropStage && cropStage !== "all") {
        seasonQuery["criticalPeriods.cropStage"] = cropStage;
      }

      // Tìm các diseaseId thỏa mãn trong bảng Season
      const seasonResults = await DiseaseSeason.find(seasonQuery).distinct(
        "diseaseId"
      );
      validIds = seasonResults.map((id) => id.toString());
    }

    // --- BƯỚC 2: LỌC THEO BỘ PHẬN BỊ BỆNH (Bảng DiseaseSymptom) ---
    if (symptomPart && symptomPart !== "all") {
      const symptomQuery = {
        "symptoms.part": symptomPart,
      };

      const symptomResults = await DiseaseSymptom.find(symptomQuery).distinct(
        "diseaseId"
      );
      const stringSymptomIds = symptomResults.map((id) => id.toString());

      if (validIds === null) {
        // Nếu chưa lọc Season/Stage, lấy kết quả này làm gốc
        validIds = stringSymptomIds;
      } else {
        // Nếu đã có danh sách ID từ Bước 1, lấy GIAO (Intersection)
        validIds = validIds.filter((id) => stringSymptomIds.includes(id));
      }
    }

    // --- BƯỚC 3: TẠO QUERY CHO BẢNG CHÍNH (Disease) ---
    let dbQuery = {};

    // a. Áp dụng filter ID từ các bước trên
    if (validIds !== null) {
      if (validIds.length === 0) {
        // Nếu lọc chéo không ra kết quả -> Trả về rỗng ngay
        return res.json({ success: true, count: 0, data: [] });
      }
      dbQuery._id = { $in: validIds };
    }

    // b. Tìm kiếm từ khóa (Regex thông minh)
    if (query && query.trim()) {
      const searchRegex = createVietnameseRegex(query.trim());
      dbQuery.$or = [
        { name: { $regex: searchRegex } },
        { commonName: { $regex: searchRegex } },
        { scientificName: { $regex: query.trim(), $options: "i" } },
      ];
    }

    // c. Filter các thuộc tính cơ bản
    if (type && type !== "all") {
      if (type === "Bệnh") {
        // Lọc tất cả bệnh trừ Sâu hại
        dbQuery.type = {
          $in: ["Bệnh nấm", "Bệnh vi khuẩn", "Bệnh virus"],
        };
      } else {
        dbQuery.type = type;
      }
    }

    if (severityRisk && severityRisk !== "all") {
      dbQuery.severityRisk = severityRisk;
    }

    // --- BƯỚC 4: THỰC THI ---
    const diseases = await Disease.find(dbQuery).sort({ name: 1 });

    res.json({
      success: true,
      count: diseases.length,
      data: diseases,
    });
  } catch (error) {
    console.error("Error searching diseases:", error);
    res.status(500).json({
      success: false,
      error: "Không thể tìm kiếm bệnh lúa",
    });
  }
};

// 3. Lấy chi tiết 1 bệnh (với TẤT CẢ thông tin liên quan qua populate)
exports.getDiseaseById = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id)
      .populate("stages")
      .populate("seasons")
      .populate("causes")
      .populate("symptoms")
      .populate("treatments")
      .populate("prevention")
      .populate("weatherCorrelation");

    if (!disease) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy bệnh lúa",
      });
    }

    res.json({
      success: true,
      data: disease,
    });
  } catch (error) {
    console.error("Error fetching disease:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy thông tin bệnh lúa",
    });
  }
};

// 4. Lấy TOÀN BỘ thông tin chi tiết (Query từng bảng riêng lẻ)
exports.getDiseaseFullDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm bệnh trong collection chính
    const disease = await Disease.findById(id);

    if (!disease) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy bệnh lúa",
      });
    }

    // Lấy chi tiết từ các collection phụ song song
    const [
      stages,
      seasons,
      causes,
      symptoms,
      treatments,
      prevention,
      weatherCorrelation,
    ] = await Promise.all([
      DiseaseStage.findOne({ diseaseId: id }),
      DiseaseSeason.findOne({ diseaseId: id }),
      DiseaseCause.findOne({ diseaseId: id }),
      DiseaseSymptom.findOne({ diseaseId: id }),
      DiseaseTreatment.findOne({ diseaseId: id }),
      DiseasePrevention.findOne({ diseaseId: id }),
      WeatherDiseaseCorrelation.findOne({ diseaseId: id }),
    ]);

    res.json({
      success: true,
      data: {
        basic: disease,
        stages,
        seasons,
        causes,
        symptoms,
        treatments,
        prevention,
        weatherCorrelation,
      },
    });
  } catch (error) {
    console.error("Error fetching full details:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi lấy chi tiết",
    });
  }
};

// 5. Lấy chi tiết bệnh theo SECTIONS (Tối ưu performance)
exports.getDiseaseSections = async (req, res) => {
  try {
    const { id } = req.params;
    const { sections } = req.query;

    const requestedSections = sections
      ? sections.split(",")
      : [
          "stages",
          "seasons",
          "causes",
          "symptoms",
          "treatments",
          "prevention",
          "weatherCorrelation",
        ];

    const disease = await Disease.findById(id);

    if (!disease) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy bệnh lúa",
      });
    }

    const populatePromises = requestedSections.map((section) =>
      disease.populate(section)
    );
    await Promise.all(populatePromises);

    res.json({
      success: true,
      data: disease,
    });
  } catch (error) {
    console.error("Error fetching disease sections:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy thông tin bệnh lúa",
    });
  }
};

// 6. Lấy bệnh theo mùa vụ hiện tại (API chuyên biệt cho Widget/Homepage)
exports.getDiseasesBySeason = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const { season } = req.query;

    const diseaseSeasons = await DiseaseSeason.find({
      "seasons.type": season || {
        $in:
          currentMonth >= 11 || currentMonth <= 4 ? ["Đông Xuân"] : ["Hè Thu"],
      },
    }).populate("diseaseId");

    const diseases = diseaseSeasons.map((ds) => ds.diseaseId).filter((d) => d); // Loại bỏ null

    // Sắp xếp theo mức độ nguy hiểm
    diseases.sort((a, b) => {
      const riskOrder = { "Rất cao": 4, Cao: 3, "Trung bình": 2, Thấp: 1 };
      return (
        (riskOrder[b.severityRisk] || 0) - (riskOrder[a.severityRisk] || 0)
      );
    });

    res.json({
      success: true,
      season:
        season ||
        (currentMonth >= 11 || currentMonth <= 4 ? "Đông Xuân" : "Hè Thu"),
      count: diseases.length,
      data: diseases,
    });
  } catch (error) {
    console.error("Error fetching diseases by season:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy danh sách bệnh theo mùa vụ",
    });
  }
};

// 7. Lấy bệnh theo giai đoạn cây trồng (API chuyên biệt)
exports.getDiseasesByCropStage = async (req, res) => {
  try {
    const { cropStage } = req.query;

    if (!cropStage) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng cung cấp giai đoạn cây trồng",
      });
    }

    const diseaseSeasons = await DiseaseSeason.find({
      "criticalPeriods.cropStage": cropStage,
    }).populate("diseaseId");

    const diseases = diseaseSeasons.map((ds) => ({
      ...ds.diseaseId.toObject(),
      criticalInfo: ds.criticalPeriods.find((cp) => cp.cropStage === cropStage),
    }));

    res.json({
      success: true,
      cropStage,
      count: diseases.length,
      data: diseases,
    });
  } catch (error) {
    console.error("Error fetching diseases by crop stage:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy danh sách bệnh theo giai đoạn cây trồng",
    });
  }
};

// 8. Lấy bệnh theo điều kiện thời tiết
exports.getDiseasesByWeather = async (req, res) => {
  try {
    const { temperature, humidity, rainfall } = req.query;

    if (!temperature || !humidity) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng cung cấp nhiệt độ và độ ẩm",
      });
    }

    const temp = parseFloat(temperature);
    const humid = parseFloat(humidity);

    const correlations = await WeatherDiseaseCorrelation.find({
      $and: [
        { "weatherTriggers.threshold.temperature.min": { $lte: temp } },
        { "weatherTriggers.threshold.temperature.max": { $gte: temp } },
        { "weatherTriggers.threshold.humidity.min": { $lte: humid } },
        { "weatherTriggers.threshold.humidity.max": { $gte: humid } },
      ],
    }).populate("diseaseId");

    const diseasesWithRisk = correlations.map((corr) => {
      const matchingTrigger = corr.weatherTriggers.find(
        (t) =>
          t.threshold.temperature.min <= temp &&
          t.threshold.temperature.max >= temp &&
          t.threshold.humidity.min <= humid &&
          t.threshold.humidity.max >= humid
      );

      return {
        ...corr.diseaseId.toObject(),
        weatherRisk: {
          level: matchingTrigger?.riskLevel || "Trung bình",
          condition: matchingTrigger?.condition || "",
          response: matchingTrigger?.response || "",
        },
      };
    });

    // Sắp xếp theo rủi ro
    diseasesWithRisk.sort((a, b) => {
      const riskOrder = { "Rất cao": 4, Cao: 3, "Trung bình": 2, Thấp: 1 };
      return (
        (riskOrder[b.weatherRisk.level] || 0) -
        (riskOrder[a.weatherRisk.level] || 0)
      );
    });

    res.json({
      success: true,
      conditions: { temperature: temp, humidity: humid, rainfall },
      count: diseasesWithRisk.length,
      data: diseasesWithRisk,
    });
  } catch (error) {
    console.error("Error fetching diseases by weather:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy danh sách bệnh theo thời tiết",
    });
  }
};

module.exports = exports;
