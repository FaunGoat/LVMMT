const express = require("express");
const router = express.Router();
const {
  getAllDiseases,
  getDiseaseById,
  searchDiseases,
} = require("../controllers/diseaseController");

// GET /api/diseases - Lấy tất cả bệnh
router.get("/", getAllDiseases);

// GET /api/diseases/search?query=đạo ôn - Tìm kiếm bệnh
router.get("/search", searchDiseases);

// GET /api/diseases/:id - Lấy chi tiết 1 bệnh
router.get("/:id", getDiseaseById);

module.exports = router;
