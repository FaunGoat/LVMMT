const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getAllDiseases,
  getDiseaseById,
  createDisease,
  updateDisease,
  deleteDisease,
  deleteImage,
  getDiseaseStats,
} = require("../controllers/diseaseAdminController");
const { verifyToken } = require("../middleware/authMiddleware");

// Middleware upload
const upload = multer({ storage: multer.memoryStorage() });

// Apply auth middleware to all routes
router.use(verifyToken);

// Routes
router.get("/", getAllDiseases);
router.get("/stats", getDiseaseStats);
router.get("/:id", getDiseaseById);
router.post("/", upload.array("images", 5), createDisease);
router.put("/:id", upload.array("images", 5), updateDisease);
router.delete("/:id", deleteDisease);
router.delete("/:id/images/:imageUrl", deleteImage);

module.exports = router;
