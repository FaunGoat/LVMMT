// backend/utils/entityMapper.js

/**
 * Map Dialogflow entity values sang tên bệnh trong Database
 */
const diseaseEntityMap = {
  dao_on: "Bệnh đạo ôn",
  ray_nau: "Rầy nâu",
  lem_lep_hat: "Bệnh lem lép hạt",
  chay_bia_la: "Bệnh cháy bìa lá",
  sau_cuon_la: "Sâu cuốn lá",
};

/**
 * Map treatment type entity sang Vietnamese
 */
const treatmentTypeMap = {
  hoa_hoc: "Hóa học",
  sinh_hoc: "Sinh học",
  canh_tac: "Canh tác",
};

/**
 * Map symptom keywords sang Vietnamese
 */
const symptomKeywordMap = {
  dom_la: ["đốm", "lá", "thoi"],
  la_vang: ["vàng", "úa", "héo"],
  la_kho: ["khô", "cháy"],
  hat_lep: ["lép", "hạt"],
  cay_coi: ["còi", "thấp"],
};

/**
 * Lấy tên bệnh từ entity
 * @param {string} entityValue - Giá trị từ Dialogflow (vd: "dao_on")
 * @returns {string} - Tên bệnh trong DB (vd: "Bệnh đạo ôn")
 */
function getDiseaseName(entityValue) {
  if (!entityValue) return null;

  // Nếu entity value là reference value (dao_on, ray_nau...)
  if (diseaseEntityMap[entityValue]) {
    return diseaseEntityMap[entityValue];
  }

  // Nếu entity value là synonym (đạo ôn, rầy nâu...)
  return entityValue;
}

/**
 * Lấy loại phương pháp điều trị
 * @param {string} entityValue - Giá trị từ Dialogflow (vd: "hoa_hoc")
 * @returns {string} - Loại điều trị (vd: "Hóa học")
 */
function getTreatmentType(entityValue) {
  if (!entityValue) return null;
  return treatmentTypeMap[entityValue] || entityValue;
}

/**
 * Lấy từ khóa triệu chứng để tìm kiếm
 * @param {string} entityValue - Giá trị từ Dialogflow (vd: "dom_la")
 * @returns {string[]} - Mảng từ khóa để search
 */
function getSymptomKeywords(entityValue) {
  if (!entityValue) return [];
  return symptomKeywordMap[entityValue] || [entityValue];
}

/**
 * Tạo regex pattern từ nhiều từ khóa
 * @param {string[]} keywords - Mảng từ khóa
 * @returns {RegExp} - Regex pattern
 */
function createSearchPattern(keywords) {
  if (!keywords || keywords.length === 0) return null;

  // Tạo pattern: (từ1|từ2|từ3)
  const pattern = keywords.join("|");
  return new RegExp(pattern, "i");
}

/**
 * Làm sạch text input
 * @param {string} text - Text cần làm sạch
 * @returns {string} - Text đã làm sạch
 */
function cleanText(text) {
  if (!text) return "";

  const noiseWords = [
    "bệnh",
    "sâu",
    "cây",
    "lúa",
    "trên",
    "là gì",
    "làm sao",
    "thế nào",
    "cách chữa",
    "chữa",
    "bị",
    "có",
    "không",
    "ở",
    "tại",
    "ruộng",
    "đồng",
    "miền",
    "tây",
    "của",
    "tôi",
    "cho",
    "biết",
    "mình",
    "em",
    "anh",
    "chị",
    "giúp",
  ];

  let cleaned = text.toLowerCase().trim();

  noiseWords.forEach((word) => {
    cleaned = cleaned.replace(new RegExp("\\b" + word + "\\b", "g"), " ");
  });

  return cleaned.replace(/\s+/g, " ").trim();
}

/**
 * Extract entity value từ Dialogflow parameters
 * @param {Object} parameters - Dialogflow parameters
 * @param {string} entityName - Tên entity cần lấy
 * @returns {string|null} - Entity value
 */
function extractEntity(parameters, entityName) {
  if (!parameters || !entityName) return null;

  // Dialogflow có thể trả về dạng object hoặc string
  const value = parameters[entityName];

  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    return value.value || value.name || null;
  }

  return null;
}

/**
 * Xây dựng search query cho MongoDB
 * @param {string} diseaseName - Tên bệnh
 * @param {string[]} symptoms - Mảng triệu chứng
 * @returns {Object} - MongoDB query object
 */
function buildSearchQuery(diseaseName = null, symptoms = []) {
  const conditions = [];

  if (diseaseName) {
    const cleanedName = cleanText(diseaseName);
    conditions.push(
      { name: { $regex: cleanedName, $options: "i" } },
      { commonName: { $regex: cleanedName, $options: "i" } },
      { scientificName: { $regex: cleanedName, $options: "i" } }
    );
  }

  if (symptoms && symptoms.length > 0) {
    symptoms.forEach((symptom) => {
      conditions.push({
        symptoms: { $elemMatch: { $regex: symptom, $options: "i" } },
      });
    });
  }

  return conditions.length > 0 ? { $or: conditions } : {};
}

/**
 * Format location name
 * @param {string} location - Location entity value
 * @returns {string} - Formatted location
 */
function formatLocation(location) {
  if (!location) return "Đồng bằng sông Cửu Long";

  const locationMap = {
    dong_bang_song_cuu_long: "Đồng bằng sông Cửu Long",
    dong_bang_song_hong: "Đồng bằng sông Hồng",
    mien_trung: "Miền Trung",
  };

  return locationMap[location] || location;
}

module.exports = {
  diseaseEntityMap,
  treatmentTypeMap,
  symptomKeywordMap,
  getDiseaseName,
  getTreatmentType,
  getSymptomKeywords,
  createSearchPattern,
  cleanText,
  extractEntity,
  buildSearchQuery,
  formatLocation,
};
