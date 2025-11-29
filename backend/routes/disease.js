const express = require("express");
const router = express.Router();
const {
  getAllDiseases,
  getDiseaseById,
  getDiseaseSections,
  searchDiseases,
  getDiseasesBySeason,
  getDiseasesByCropStage,
  getDiseasesByWeather,
} = require("../controllers/diseaseController");

// ============================================
// BASIC ROUTES
// ============================================

// GET /api/diseases - Lấy tất cả bệnh (thông tin cơ bản)
router.get("/", getAllDiseases);

// GET /api/diseases/search?query=đạo ôn - Tìm kiếm bệnh
router.get("/search", searchDiseases);

// GET /api/diseases/:id - Lấy chi tiết 1 bệnh (TẤT CẢ thông tin)
router.get("/:id", getDiseaseById);

// ============================================
// ADVANCED ROUTES
// ============================================

// GET /api/diseases/:id/sections?sections=stages,symptoms
// Lấy chi tiết bệnh theo sections (tối ưu performance)
// Example: /api/diseases/123/sections?sections=stages,treatments
router.get("/:id/sections", getDiseaseSections);

// ============================================
// FILTER ROUTES
// ============================================

// GET /api/diseases/filter/season?season=Đông Xuân
// Lấy bệnh theo mùa vụ
// Query params:
//   - season: "Đông Xuân" | "Hè Thu" (optional, mặc định theo tháng hiện tại)
router.get("/filter/season", getDiseasesBySeason);

// GET /api/diseases/filter/crop-stage?cropStage=Đẻ nhánh
// Lấy bệnh theo giai đoạn cây trồng
// Query params:
//   - cropStage: "Gieo mạ" | "Cấy non" | "Đẻ nhánh" | "Làm đòng" | "Trổ bông" | etc.
router.get("/filter/crop-stage", getDiseasesByCropStage);

// GET /api/diseases/filter/weather?temperature=28&humidity=85&rainfall=10
// Lấy bệnh theo điều kiện thời tiết hiện tại
// Query params:
//   - temperature: số (°C)
//   - humidity: số (%)
//   - rainfall: số (mm) - optional
router.get("/filter/weather", getDiseasesByWeather);

// ============================================
// SPECIFIC DATA ROUTES
// ============================================

// GET /api/diseases/:id/stages - Chỉ lấy giai đoạn phát triển
router.get("/:id/stages", async (req, res) => {
  try {
    const DiseaseStage = require("../models/new/DiseaseStage");
    const stages = await DiseaseStage.findOne({ diseaseId: req.params.id });

    if (!stages) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy thông tin giai đoạn phát triển",
      });
    }

    res.json({
      success: true,
      data: stages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Không thể lấy thông tin giai đoạn",
    });
  }
});

// GET /api/diseases/:id/seasons - Chỉ lấy thông tin mùa vụ
router.get("/:id/seasons", async (req, res) => {
  try {
    const DiseaseSeason = require("../models/new/DiseaseSeason");
    const seasons = await DiseaseSeason.findOne({ diseaseId: req.params.id });

    if (!seasons) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy thông tin mùa vụ",
      });
    }

    res.json({
      success: true,
      data: seasons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Không thể lấy thông tin mùa vụ",
    });
  }
});

// GET /api/diseases/:id/symptoms - Chỉ lấy triệu chứng
router.get("/:id/symptoms", async (req, res) => {
  try {
    const DiseaseSymptom = require("../models/new/DiseaseSymptom");
    const symptoms = await DiseaseSymptom.findOne({ diseaseId: req.params.id });

    if (!symptoms) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy thông tin triệu chứng",
      });
    }

    res.json({
      success: true,
      data: symptoms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Không thể lấy thông tin triệu chứng",
    });
  }
});

// GET /api/diseases/:id/treatments - Chỉ lấy phương pháp điều trị
router.get("/:id/treatments", async (req, res) => {
  try {
    const DiseaseTreatment = require("../models/new/DiseaseTreatment");
    const treatments = await DiseaseTreatment.findOne({
      diseaseId: req.params.id,
    });

    if (!treatments) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy phương pháp điều trị",
      });
    }

    res.json({
      success: true,
      data: treatments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Không thể lấy phương pháp điều trị",
    });
  }
});

// GET /api/diseases/:id/prevention - Chỉ lấy biện pháp phòng ngừa
router.get("/:id/prevention", async (req, res) => {
  try {
    const DiseasePrevention = require("../models/new/DiseasePrevention");
    const prevention = await DiseasePrevention.findOne({
      diseaseId: req.params.id,
    });

    if (!prevention) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy biện pháp phòng ngừa",
      });
    }

    res.json({
      success: true,
      data: prevention,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Không thể lấy biện pháp phòng ngừa",
    });
  }
});

// GET /api/diseases/:id/weather-correlation - Lấy liên kết thời tiết
router.get("/:id/weather-correlation", async (req, res) => {
  try {
    const WeatherDiseaseCorrelation = require("../models/new/WeatherDiseaseCorrelation");
    const correlation = await WeatherDiseaseCorrelation.findOne({
      diseaseId: req.params.id,
    });

    if (!correlation) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy thông tin liên kết thời tiết",
      });
    }

    res.json({
      success: true,
      data: correlation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Không thể lấy thông tin liên kết thời tiết",
    });
  }
});

// ============================================
// ANALYTICS ROUTES
// ============================================

// GET /api/diseases/analytics/by-severity
// Thống kê bệnh theo mức độ nguy hiểm
router.get("/analytics/by-severity", async (req, res) => {
  try {
    const Disease = require("../models/new/Disease");

    const stats = await Disease.aggregate([
      {
        $group: {
          _id: "$severityRisk",
          count: { $sum: 1 },
          diseases: { $push: { name: "$name", _id: "$_id" } },
        },
      },
      {
        $sort: {
          _id: -1, // Rất cao -> Cao -> Trung bình -> Thấp
        },
      },
    ]);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Không thể lấy thống kê",
    });
  }
});

// GET /api/diseases/analytics/by-type
// Thống kê bệnh theo loại (Nấm, Vi khuẩn, Sâu hại, v.v.)
router.get("/analytics/by-type", async (req, res) => {
  try {
    const Disease = require("../models/new/Disease");

    const stats = await Disease.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          diseases: { $push: { name: "$name", _id: "$_id" } },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Không thể lấy thống kê",
    });
  }
});

module.exports = router;
