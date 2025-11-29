const Disease = require("../models/Disease");

// Lấy tất cả bệnh (chỉ thông tin cơ bản)
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

// Lấy chi tiết 1 bệnh (với TẤT CẢ thông tin liên quan)
exports.getDiseaseById = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id)
      .populate("stages") // Giai đoạn phát triển
      .populate("seasons") // Mùa vụ
      .populate("causes") // Nguyên nhân
      .populate("symptoms") // Triệu chứng
      .populate("treatments") // Điều trị
      .populate("prevention") // Phòng ngừa
      .populate("weatherCorrelation"); // Thời tiết

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

// Lấy chi tiết bệnh theo SECTIONS (tối ưu hơn)
exports.getDiseaseSections = async (req, res) => {
  try {
    const { id } = req.params;
    const { sections } = req.query; // ?sections=stages,symptoms,treatments

    // Mặc định lấy tất cả
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

    // Lấy disease cơ bản
    const disease = await Disease.findById(id);

    if (!disease) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy bệnh lúa",
      });
    }

    // Populate chỉ những sections được yêu cầu
    const populatePromises = [];

    requestedSections.forEach((section) => {
      populatePromises.push(disease.populate(section));
    });

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

// Tìm kiếm bệnh theo tên
exports.searchDiseases = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng nhập từ khóa tìm kiếm",
      });
    }

    const diseases = await Disease.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { commonName: { $regex: query, $options: "i" } },
        { scientificName: { $regex: query, $options: "i" } },
      ],
    });

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

// Lấy bệnh theo mùa vụ hiện tại
exports.getDiseasesBySeason = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const { season } = req.query; // "Đông Xuân" hoặc "Hè Thu"

    // Import DiseaseSeason model
    const DiseaseSeason = require("../models/new/DiseaseSeason");

    // Tìm các bệnh có season phù hợp
    const diseaseSeasons = await DiseaseSeason.find({
      "seasons.type": season || {
        $in:
          currentMonth >= 11 || currentMonth <= 4 ? ["Đông Xuân"] : ["Hè Thu"],
      },
    }).populate("diseaseId");

    // Lấy thông tin disease
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

// Lấy bệnh theo giai đoạn cây trồng
exports.getDiseasesByCropStage = async (req, res) => {
  try {
    const { cropStage } = req.query; // "Đẻ nhánh", "Trổ bông", v.v.

    if (!cropStage) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng cung cấp giai đoạn cây trồng",
      });
    }

    const DiseaseSeason = require("../models/new/DiseaseSeason");

    // Tìm các bệnh có critical period ở giai đoạn này
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

// Lấy bệnh theo điều kiện thời tiết hiện tại
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

    const WeatherDiseaseCorrelation = require("../models/new/WeatherDiseaseCorrelation");

    // Tìm các bệnh có nguy cơ với điều kiện thời tiết này
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

    // Sắp xếp theo mức độ nguy cơ
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
