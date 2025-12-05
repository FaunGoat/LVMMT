const express = require("express");
const router = express.Router();
const {
  getStages,
  createOrUpdateStages,
  getSeasons,
  createOrUpdateSeasons,
  getCauses,
  createOrUpdateCauses,
  getSymptoms,
  createOrUpdateSymptoms,
  getTreatments,
  createOrUpdateTreatments,
  getPrevention,
  createOrUpdatePrevention,
  getWeatherCorrelation,
  createOrUpdateWeatherCorrelation,
} = require("../controllers/diseaseDetailController");
const { verifyToken } = require("../middleware/authMiddleware");

router.use(verifyToken);

// Stages
router.get("/:diseaseId/stages", getStages);
router.post("/:diseaseId/stages", createOrUpdateStages);

// Seasons
router.get("/:diseaseId/seasons", getSeasons);
router.post("/:diseaseId/seasons", createOrUpdateSeasons);

// Causes
router.get("/:diseaseId/causes", getCauses);
router.post("/:diseaseId/causes", createOrUpdateCauses);

// Symptoms
router.get("/:diseaseId/symptoms", getSymptoms);
router.post("/:diseaseId/symptoms", createOrUpdateSymptoms);

// Treatments
router.get("/:diseaseId/treatments", getTreatments);
router.post("/:diseaseId/treatments", createOrUpdateTreatments);

// Prevention
router.get("/:diseaseId/prevention", getPrevention);
router.post("/:diseaseId/prevention", createOrUpdatePrevention);

// Weather Correlation
router.get("/:diseaseId/weather-correlation", getWeatherCorrelation);
router.post(
  "/:diseaseId/weather-correlation",
  createOrUpdateWeatherCorrelation
);

module.exports = router;
