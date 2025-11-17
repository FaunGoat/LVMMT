const Disease = require("../models/Disease");

// Lấy tất cả bệnh lúa
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

// Lấy chi tiết 1 bệnh theo ID
exports.getDiseaseById = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);

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
