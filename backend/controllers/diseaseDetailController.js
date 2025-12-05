const DiseaseStage = require("../models/new/DiseaseStage");
const DiseaseSeason = require("../models/new/DiseaseSeason");
const DiseaseCause = require("../models/new/DiseaseCause");
const DiseaseSymptom = require("../models/new/DiseaseSymptom");
const DiseaseTreatment = require("../models/new/DiseaseTreatment");
const DiseasePrevention = require("../models/new/DiseasePrevention");
const WeatherDiseaseCorrelation = require("../models/new/WeatherDiseaseCorrelation");

// ============================================
// DISEASE STAGES - GIAI ĐOẠN PHÁT TRIỂN
// ============================================

exports.getStages = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const stages = await DiseaseStage.findOne({ diseaseId });

    res.json({
      success: true,
      data: stages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi khi lấy giai đoạn",
    });
  }
};

exports.createOrUpdateStages = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const { stages, totalDuration, peakStage, incubationPeriod, notes } =
      req.body;

    let stageData = await DiseaseStage.findOne({ diseaseId });

    if (!stageData) {
      stageData = new DiseaseStage({
        diseaseId,
        stages,
        totalDuration,
        peakStage,
        incubationPeriod,
        notes,
      });
    } else {
      stageData.stages = stages;
      stageData.totalDuration = totalDuration;
      stageData.peakStage = peakStage;
      stageData.incubationPeriod = incubationPeriod;
      stageData.notes = notes;
    }

    await stageData.save();

    res.json({
      success: true,
      data: stageData,
      message: "Cập nhật giai đoạn thành công",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi lưu giai đoạn",
    });
  }
};

// ============================================
// DISEASE SEASONS - MÙA VỤ
// ============================================

exports.getSeasons = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const seasons = await DiseaseSeason.findOne({ diseaseId });

    res.json({
      success: true,
      data: seasons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi khi lấy mùa vụ",
    });
  }
};

exports.createOrUpdateSeasons = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const { seasons, criticalPeriods, regionalVariations, climateImpact } =
      req.body;

    let seasonData = await DiseaseSeason.findOne({ diseaseId });

    if (!seasonData) {
      seasonData = new DiseaseSeason({
        diseaseId,
        seasons,
        criticalPeriods,
        regionalVariations,
        climateImpact,
      });
    } else {
      seasonData.seasons = seasons;
      seasonData.criticalPeriods = criticalPeriods;
      seasonData.regionalVariations = regionalVariations;
      seasonData.climateImpact = climateImpact;
    }

    await seasonData.save();

    res.json({
      success: true,
      data: seasonData,
      message: "Cập nhật mùa vụ thành công",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi lưu mùa vụ",
    });
  }
};

// ============================================
// DISEASE CAUSES - NGUYÊN NHÂN
// ============================================

exports.getCauses = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const causes = await DiseaseCause.findOne({ diseaseId });

    res.json({
      success: true,
      data: causes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi khi lấy nguyên nhân",
    });
  }
};

exports.createOrUpdateCauses = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const {
      pathogen,
      environmentalFactors,
      cropFactors,
      soilFactors,
      managementFactors,
      predisposingFactors,
      resistanceFactors,
    } = req.body;

    let causeData = await DiseaseCause.findOne({ diseaseId });

    if (!causeData) {
      causeData = new DiseaseCause({
        diseaseId,
        pathogen,
        environmentalFactors,
        cropFactors,
        soilFactors,
        managementFactors,
        predisposingFactors,
        resistanceFactors,
      });
    } else {
      causeData.pathogen = pathogen;
      causeData.environmentalFactors = environmentalFactors;
      causeData.cropFactors = cropFactors;
      causeData.soilFactors = soilFactors;
      causeData.managementFactors = managementFactors;
      causeData.predisposingFactors = predisposingFactors;
      causeData.resistanceFactors = resistanceFactors;
    }

    await causeData.save();

    res.json({
      success: true,
      data: causeData,
      message: "Cập nhật nguyên nhân thành công",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi lưu nguyên nhân",
    });
  }
};

// ============================================
// DISEASE SYMPTOMS - TRIỆU CHỨNG
// ============================================

exports.getSymptoms = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const symptoms = await DiseaseSymptom.findOne({ diseaseId });

    res.json({
      success: true,
      data: symptoms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi khi lấy triệu chứng",
    });
  }
};

exports.createOrUpdateSymptoms = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const {
      symptoms,
      diagnosticChecklist,
      similarDiseases,
      laboratoryTests,
      notes,
    } = req.body;

    let symptomData = await DiseaseSymptom.findOne({ diseaseId });

    if (!symptomData) {
      symptomData = new DiseaseSymptom({
        diseaseId,
        symptoms,
        diagnosticChecklist,
        similarDiseases,
        laboratoryTests,
        notes,
      });
    } else {
      symptomData.symptoms = symptoms;
      symptomData.diagnosticChecklist = diagnosticChecklist;
      symptomData.similarDiseases = similarDiseases;
      symptomData.laboratoryTests = laboratoryTests;
      symptomData.notes = notes;
    }

    await symptomData.save();

    res.json({
      success: true,
      data: symptomData,
      message: "Cập nhật triệu chứng thành công",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi lưu triệu chứng",
    });
  }
};

// ============================================
// DISEASE TREATMENTS - PHƯƠNG PHÁP ĐIỀU TRỊ
// ============================================

exports.getTreatments = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const treatments = await DiseaseTreatment.findOne({ diseaseId });

    res.json({
      success: true,
      data: treatments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi khi lấy phương pháp điều trị",
    });
  }
};

exports.createOrUpdateTreatments = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const {
      treatments,
      integratedPestManagement,
      organicAlternatives,
      emergencyProtocol,
      resistanceManagement,
      postTreatmentCare,
      successIndicators,
      failureReasons,
      costBenefitAnalysis,
    } = req.body;

    let treatmentData = await DiseaseTreatment.findOne({ diseaseId });

    if (!treatmentData) {
      treatmentData = new DiseaseTreatment({
        diseaseId,
        treatments,
        integratedPestManagement,
        organicAlternatives,
        emergencyProtocol,
        resistanceManagement,
        postTreatmentCare,
        successIndicators,
        failureReasons,
        costBenefitAnalysis,
      });
    } else {
      treatmentData.treatments = treatments;
      treatmentData.integratedPestManagement = integratedPestManagement;
      treatmentData.organicAlternatives = organicAlternatives;
      treatmentData.emergencyProtocol = emergencyProtocol;
      treatmentData.resistanceManagement = resistanceManagement;
      treatmentData.postTreatmentCare = postTreatmentCare;
      treatmentData.successIndicators = successIndicators;
      treatmentData.failureReasons = failureReasons;
      treatmentData.costBenefitAnalysis = costBenefitAnalysis;
    }

    await treatmentData.save();

    res.json({
      success: true,
      data: treatmentData,
      message: "Cập nhật phương pháp điều trị thành công",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi lưu phương pháp điều trị",
    });
  }
};

// ============================================
// DISEASE PREVENTION - PHÒNG NGỪA
// ============================================

exports.getPrevention = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const prevention = await DiseasePrevention.findOne({ diseaseId });

    res.json({
      success: true,
      data: prevention,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi khi lấy biện pháp phòng ngừa",
    });
  }
};

exports.createOrUpdatePrevention = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const {
      culturalPractices,
      varietySelection,
      seedTreatment,
      soilManagement,
      waterManagement,
      nutritionManagement,
      sanitationPractices,
      cropRotation,
      biologicalControl,
      monitoringSchedule,
      earlyWarningSystem,
      quarantineMeasures,
      farmHygiene,
      preventiveSchedule,
      costEffectiveness,
    } = req.body;

    let preventionData = await DiseasePrevention.findOne({ diseaseId });

    if (!preventionData) {
      preventionData = new DiseasePrevention({
        diseaseId,
        culturalPractices,
        varietySelection,
        seedTreatment,
        soilManagement,
        waterManagement,
        nutritionManagement,
        sanitationPractices,
        cropRotation,
        biologicalControl,
        monitoringSchedule,
        earlyWarningSystem,
        quarantineMeasures,
        farmHygiene,
        preventiveSchedule,
        costEffectiveness,
      });
    } else {
      preventionData.culturalPractices = culturalPractices;
      preventionData.varietySelection = varietySelection;
      preventionData.seedTreatment = seedTreatment;
      preventionData.soilManagement = soilManagement;
      preventionData.waterManagement = waterManagement;
      preventionData.nutritionManagement = nutritionManagement;
      preventionData.sanitationPractices = sanitationPractices;
      preventionData.cropRotation = cropRotation;
      preventionData.biologicalControl = biologicalControl;
      preventionData.monitoringSchedule = monitoringSchedule;
      preventionData.earlyWarningSystem = earlyWarningSystem;
      preventionData.quarantineMeasures = quarantineMeasures;
      preventionData.farmHygiene = farmHygiene;
      preventionData.preventiveSchedule = preventiveSchedule;
      preventionData.costEffectiveness = costEffectiveness;
    }

    await preventionData.save();

    res.json({
      success: true,
      data: preventionData,
      message: "Cập nhật biện pháp phòng ngừa thành công",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi lưu biện pháp phòng ngừa",
    });
  }
};

// ============================================
// WEATHER DISEASE CORRELATION - THỜI TIẾT & BỆNH
// ============================================

exports.getWeatherCorrelation = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const correlation = await WeatherDiseaseCorrelation.findOne({ diseaseId });

    res.json({
      success: true,
      data: correlation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi khi lấy liên hệ thời tiết",
    });
  }
};

exports.createOrUpdateWeatherCorrelation = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    const {
      weatherTriggers,
      forecastAlerts,
      weatherPatterns,
      microclimateFactors,
      climateChangeProjections,
      historicalOutbreaks,
      regionalWeatherImpact,
      realTimeMonitoring,
    } = req.body;

    let correlationData = await WeatherDiseaseCorrelation.findOne({
      diseaseId,
    });

    if (!correlationData) {
      correlationData = new WeatherDiseaseCorrelation({
        diseaseId,
        weatherTriggers,
        forecastAlerts,
        weatherPatterns,
        microclimateFactors,
        climateChangeProjections,
        historicalOutbreaks,
        regionalWeatherImpact,
        realTimeMonitoring,
      });
    } else {
      correlationData.weatherTriggers = weatherTriggers;
      correlationData.forecastAlerts = forecastAlerts;
      correlationData.weatherPatterns = weatherPatterns;
      correlationData.microclimateFactors = microclimateFactors;
      correlationData.climateChangeProjections = climateChangeProjections;
      correlationData.historicalOutbreaks = historicalOutbreaks;
      correlationData.regionalWeatherImpact = regionalWeatherImpact;
      correlationData.realTimeMonitoring = realTimeMonitoring;
    }

    await correlationData.save();

    res.json({
      success: true,
      data: correlationData,
      message: "Cập nhật liên hệ thời tiết thành công",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi khi lưu liên hệ thời tiết",
    });
  }
};
