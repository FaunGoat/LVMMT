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
  // Đạo ôn
  dao_on_symptoms: {
    keywords: ["đốm", "thoi", "viền nâu", "tâm xám"],
    disease: "Bệnh đạo ôn",
  },

  // Cháy bìa lá
  chay_bia_la_symptoms: {
    keywords: ["cháy bìa", "cháy mép", "mép lá", "bìa lá"],
    disease: "Bệnh cháy bìa lá",
  },

  // Rầy nâu
  ray_nau_symptoms: {
    keywords: ["vàng úa", "héo", "cháy rầy", "gốc vàng", "chết hàng loạt"],
    disease: "Rầy nâu",
  },

  // Lem lép hạt
  lem_lep_hat_symptoms: {
    keywords: ["hạt lép", "hạt trắng", "bông trắng", "trấu nứt"],
    disease: "Bệnh lem lép hạt",
  },

  // Sâu cuốn lá
  sau_cuon_la_symptoms: {
    keywords: ["lá cuốn", "cuốn lá", "lá cuộn", "cuốn thành ống"],
    disease: "Sâu cuốn lá",
  },
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

  if (symptomKeywordMap[entityValue]) {
    return symptomKeywordMap[entityValue].keywords;
  }

  return [entityValue];
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

  const value = parameters[entityName];

  // Debug log
  // console.log(`🔍 Extracting "${entityName}":`, typeof value, value);

  // Case 1: String trực tiếp
  if (typeof value === "string" && value.trim() !== "") {
    // console.log(`✅ String value: "${value}"`);
    return value.trim();
  }

  // Case 2: Object có nested value
  if (typeof value === "object" && value !== null) {
    // Thử các field phổ biến
    const extracted =
      value.value || value.name || value.stringValue || value[0];
    // console.log(`🔎 Object extraction:`, extracted);
    if (extracted && typeof extracted === "string") {
      return extracted.trim();
    }
  }

  // Case 3: Array (Dialogflow đôi khi trả về array)
  if (Array.isArray(value) && value.length > 0) {
    const firstItem = value[0];
    // console.log(`📦 Array extraction:`, firstItem);
    if (typeof firstItem === "string") {
      return firstItem.trim();
    }
    if (typeof firstItem === "object" && firstItem !== null) {
      return firstItem.value || firstItem.name || null;
    }
  }

  // console.log(`❌ Could not extract "${entityName}"`);
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
  if (!location) return "Cần Thơ";

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
