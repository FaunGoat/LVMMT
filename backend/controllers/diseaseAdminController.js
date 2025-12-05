const Disease = require("../models/new/Disease");
const DiseaseStage = require("../models/new/DiseaseStage");
const DiseaseSeason = require("../models/new/DiseaseSeason");
const DiseaseCause = require("../models/new/DiseaseCause");
const DiseaseSymptom = require("../models/new/DiseaseSymptom");
const DiseaseTreatment = require("../models/new/DiseaseTreatment");
const DiseasePrevention = require("../models/new/DiseasePrevention");
const WeatherDiseaseCorrelation = require("../models/new/WeatherDiseaseCorrelation");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ============================================
// GET: Lấy danh sách bệnh (có phân trang)
// ============================================
exports.getAllDiseases = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { commonName: { $regex: search, $options: "i" } },
          { scientificName: { $regex: search, $options: "i" } },
        ],
      };
    }

    const total = await Disease.countDocuments(query);
    const diseases = await Disease.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: diseases.length,
      total,
      pages: Math.ceil(total / limit),
      page: parseInt(page),
      data: diseases,
    });
  } catch (error) {
    console.error("Error fetching diseases:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi lấy danh sách bệnh",
    });
  }
};

// ============================================
// GET: Lấy chi tiết 1 bệnh
// ============================================
exports.getDiseaseById = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);

    if (!disease) {
      return res.status(404).json({
        success: false,
        error: "Bệnh lúa không tồn tại",
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
      error: "Lỗi khi lấy thông tin bệnh",
    });
  }
};

// ============================================
// POST: Tạo bệnh mới
// ============================================
exports.createDisease = async (req, res) => {
  try {
    const {
      name,
      scientificName,
      commonName,
      description,
      type,
      severityRisk,
      economicLoss,
    } = req.body;

    // Validate
    if (!name || !scientificName || !type || !severityRisk) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng nhập đầy đủ thông tin bắt buộc",
      });
    }

    // Check duplicate name
    const existingDisease = await Disease.findOne({ name });
    if (existingDisease) {
      return res.status(400).json({
        success: false,
        error: "Tên bệnh đã tồn tại",
      });
    }

    // Upload images to Cloudinary
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "lua-viet/diseases",
                resource_type: "auto",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
          });

          images.push({
            url: result.secure_url,
            caption: `Ảnh bệnh ${name}`,
            alt: name,
          });
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
        }
      }
    }

    // Create disease
    const newDisease = new Disease({
      name,
      scientificName,
      commonName: commonName || "",
      description: description || "",
      type,
      severityRisk,
      economicLoss: economicLoss || "",
      images,
    });

    await newDisease.save();

    res.status(201).json({
      success: true,
      data: newDisease,
      message: "Tạo bệnh thành công",
    });
  } catch (error) {
    console.error("Error creating disease:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi tạo bệnh",
    });
  }
};

// ============================================
// PUT: Cập nhật bệnh
// ============================================
exports.updateDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      scientificName,
      commonName,
      description,
      type,
      severityRisk,
      economicLoss,
    } = req.body;

    const disease = await Disease.findById(id);
    if (!disease) {
      return res.status(404).json({
        success: false,
        error: "Bệnh lúa không tồn tại",
      });
    }

    // Check duplicate name (nếu tên thay đổi)
    if (name && name !== disease.name) {
      const existingDisease = await Disease.findOne({ name });
      if (existingDisease) {
        return res.status(400).json({
          success: false,
          error: "Tên bệnh đã tồn tại",
        });
      }
    }

    // Update images
    let images = disease.images;
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "lua-viet/diseases",
                resource_type: "auto",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
          });

          images.push({
            url: result.secure_url,
            caption: `Ảnh bệnh ${name || disease.name}`,
            alt: name || disease.name,
          });
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
        }
      }
    }

    // Update fields
    if (name) disease.name = name;
    if (scientificName) disease.scientificName = scientificName;
    if (commonName) disease.commonName = commonName;
    if (description) disease.description = description;
    if (type) disease.type = type;
    if (severityRisk) disease.severityRisk = severityRisk;
    if (economicLoss) disease.economicLoss = economicLoss;
    disease.images = images;

    await disease.save();

    res.json({
      success: true,
      data: disease,
      message: "Cập nhật bệnh thành công",
    });
  } catch (error) {
    console.error("Error updating disease:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi cập nhật bệnh",
    });
  }
};

// ============================================
// DELETE: Xóa bệnh
// ============================================
exports.deleteDisease = async (req, res) => {
  try {
    const { id } = req.params;

    const disease = await Disease.findById(id);
    if (!disease) {
      return res.status(404).json({
        success: false,
        error: "Bệnh lúa không tồn tại",
      });
    }

    // Delete related data
    await Promise.all([
      DiseaseStage.deleteMany({ diseaseId: id }),
      DiseaseSeason.deleteMany({ diseaseId: id }),
      DiseaseCause.deleteMany({ diseaseId: id }),
      DiseaseSymptom.deleteMany({ diseaseId: id }),
      DiseaseTreatment.deleteMany({ diseaseId: id }),
      DiseasePrevention.deleteMany({ diseaseId: id }),
      WeatherDiseaseCorrelation.deleteMany({ diseaseId: id }),
    ]);

    // Delete images from Cloudinary
    if (disease.images && disease.images.length > 0) {
      for (const image of disease.images) {
        try {
          const publicId = image.url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`lua-viet/diseases/${publicId}`);
        } catch (deleteError) {
          console.error("Delete image error:", deleteError);
        }
      }
    }

    // Delete disease
    await Disease.deleteOne({ _id: id });

    res.json({
      success: true,
      message: "Xóa bệnh thành công",
    });
  } catch (error) {
    console.error("Error deleting disease:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi xóa bệnh",
    });
  }
};

// ============================================
// DELETE: Xóa ảnh bệnh
// ============================================
exports.deleteImage = async (req, res) => {
  try {
    const { id, imageUrl } = req.params;

    const disease = await Disease.findById(id);
    if (!disease) {
      return res.status(404).json({
        success: false,
        error: "Bệnh lúa không tồn tại",
      });
    }

    // Remove image from array
    disease.images = disease.images.filter((img) => img.url !== imageUrl);
    await disease.save();

    // Delete from Cloudinary
    try {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`lua-viet/diseases/${publicId}`);
    } catch (deleteError) {
      console.error("Delete image error:", deleteError);
    }

    res.json({
      success: true,
      message: "Xóa ảnh thành công",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi xóa ảnh",
    });
  }
};

// ============================================
// GET: Thống kê bệnh
// ============================================
exports.getDiseaseStats = async (req, res) => {
  try {
    const total = await Disease.countDocuments();
    const byType = await Disease.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);
    const bySeverity = await Disease.aggregate([
      {
        $group: {
          _id: "$severityRisk",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        total,
        byType,
        bySeverity,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi lấy thống kê",
    });
  }
};
