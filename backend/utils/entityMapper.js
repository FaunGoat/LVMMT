// backend/utils/entityMapper.js

/**
 * Map Dialogflow entity values sang tên bệnh trong Database
 * Đã mở rộng cho 20 bệnh (sử dụng placeholder)
 */
const diseaseEntityMap = {
  dao_on: "Bệnh đạo ôn",
  ray_nau: "Rầy nâu",
  lem_lep_hat: "Bệnh lem lép hạt",
  chay_bia_la: "Bệnh cháy bìa lá",
  sau_cuon_la: "Sâu cuốn lá",
  sau_duc_than: "Sâu đục thân",
  bo_tri: "Bọ trĩ",
  muoi_hanh: "Muỗi hành",
  nhen_gie: "Nhện gié",
  bo_xit_hoi: "Bọ xít hôi",
  vang_lun: "Bệnh vàng lùn",
  lun_xoan_la: "Bệnh lùn xoắn lá",
  vang_la_chin_som: "Bệnh vàng lá chín sớm",
  thoi_be: "Bệnh thối bẹ",
  kho_van: "Bệnh khô vằn",
  lua_von: "Bệnh lúa von",
  soc_trong: "Bệnh sọc trong",
  dom_vong: "Bệnh đốm vòng",
  dom_nau: "Bệnh đốm nâu",
  thoi_than: "Bệnh thối thân",
};

/**
 * Map treatment type entity sang Vietnamese
 */
const treatmentTypeMap = {
  hoa_hoc: "Hóa học",
  sinh_hoc: "Sinh học",
  canh_tac: "Canh tác",
  tong_hop: "Tổng hợp", // Thêm Tổng hợp nếu có trong DB
};

/**
 * Map disease type entity sang Vietnamese
 */
const diseaseTypeMap = {
  benh_nam: "Bệnh nấm",
  sau_hai: "Sâu hại",
  benh_vi_khuan: "Bệnh vi khuẩn",
  benh_virus: "Bệnh virus",
};

/**
 * Map season entity sang Vietnamese (Mới: @season)
 */
const seasonMap = {
  dong_xuan: "Đông Xuân",
  he_thu: "Hè Thu",
  ca_nam: "Cả năm",
};

/**
 * Map symptom keywords sang Vietnamese
 * Cần mở rộng tương ứng với 20 bệnh
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
    keywords: ["lép hạt", "hạt đen", "hạt không chắc", "vỏ trấu"],
    disease: "Bệnh lem lép hạt",
  },
  // Sâu cuốn lá
  sau_cuon_la_symptoms: {
    keywords: ["lá cuốn", "lá cuộn", "mất diệp lục", "cuốn lá"],
    disease: "Sâu cuốn lá",
  },
  // Thêm các bệnh khác
  muoi_hanh_symptoms: {
    keywords: ["ống hành", "cọng hành", "sâu năng"],
    disease: "Muỗi hành",
  },
  kho_van_symptoms: {
    keywords: ["đốm vằn", "vết vằn", "vết loang lổ"],
    disease: "Bệnh khô vằn",
  },
  sau_duc_than_symptoms: {
    keywords: ["dảnh héo", "bông bạc", "lỗ đục", "bướm trắng"],
    disease: "Sâu đục thân",
  },
  bo_tri_symptoms: {
    keywords: ["lá xoăn", "lá cuộn tròn", "chóp lá bạc", "lá đầu lân"],
    disease: "Bọ trĩ",
  },
  nhen_gie_symptoms: {
    keywords: ["bẹ lá thâm", "lá vàng", "lá cứng giòn", "thâm đen", "thâm"],
    disease: "Nhện gié",
  },
  bo_xit_hoi_symptoms: {
    keywords: ["hạt bị đen", "hạt bị lép", "mùi hôi"],
    disease: "Bọ xít hôi",
  },
  vang_lun_symptoms: {
    keywords: ["lùn cây", "lá vàng cam", "cây thấp lùn"],
    disease: "Bệnh vàng lùn",
  },
  lun_xoan_la_symptoms: {
    keywords: [
      "lá xoắn lại",
      "lùn cây",
      "lá nhỏ hẹp",
      "đẻ nhánh vô hạn",
      "xoắn lại",
    ],
    disease: "Bệnh lùn xoắn lá",
  },
  vang_la_chin_som_symptoms: {
    keywords: ["vàng sớm", "lá chuyển vàng cam", "hạt bị lép"],
    disease: "Bệnh vàng lá chín sớm",
  },
  thoi_be_symptoms: {
    keywords: ["bẹ lá thối", "có mùi hôi", "vết bệnh sũng nước"],
    disease: "Bệnh thối bẹ",
  },
  lua_von_symptoms: {
    keywords: ["cây vống cao", "lá dài thon", "cây cao bất thường"],
    disease: "Bệnh lúa von",
  },
  soc_trong_symptoms: {
    keywords: ["sọc trong", "đốm vàng lợt trên lá", "sọc vàng mờ"],
    disease: "Bệnh sọc trong",
  },
  dom_vong_symptoms: {
    keywords: ["đốm vòng", "đốm tròn có viền", "hình tròn"],
    disease: "Bệnh đốm vòng",
  },
  dom_nau_symptoms: {
    keywords: ["đốm nâu", "đốm nhỏ tròn", "có viền nâu đỏ"],
    disease: "Bệnh đốm nâu",
  },
  thoi_than_symptoms: {
    keywords: ["thân thối rữa", "cây đổ ngã", "thối mềm"],
    disease: "Bệnh thối thân",
  },
};

/**
 * @param {Object} parameters - Dialogflow parameters object
 * @param {string} entityName - Tên entity (VD: 'disease', 'symptom-keyword')
 * @returns {string | string[]} - Giá trị entity được trích xuất
 */
function extractEntity(parameters, entityName) {
  if (!parameters || !entityName) return null;

  const value = parameters[entityName];

  // Trả về mảng cho symptom-keyword để có thể xử lý đa triệu chứng
  if (entityName === "symptom-keyword" && Array.isArray(value)) {
    return value
      .filter(
        (v) =>
          v &&
          (typeof v === "string" || (typeof v === "object" && v.stringValue))
      )
      .map((v) => (typeof v === "string" ? v.trim() : v.stringValue.trim()));
  }

  // Logic cũ cho các entity đơn (disease, treatment_type, location,...)
  // Case 1: String trực tiếp
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }

  // Case 2: Object có nested value (nếu Dialogflow trả về object)
  if (typeof value === "object" && value !== null) {
    const extracted =
      value.value || value.name || value.stringValue || value[0];
    if (extracted && typeof extracted === "string") {
      return extracted.trim();
    }
  }

  // Case 3: Array (chỉ lấy phần tử đầu tiên cho các entity không phải symptom)
  if (Array.isArray(value) && value.length > 0) {
    const firstItem = value[0];
    if (typeof firstItem === "string") {
      return firstItem.trim();
    }
    if (typeof firstItem === "object" && firstItem !== null) {
      return firstItem.value || firstItem.name || null;
    }
  }

  return null;
}

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

// --- HÀM MAPPING ---

function getDiseaseName(entityValue) {
  return diseaseEntityMap[entityValue] || entityValue;
}

function getTreatmentType(entityValue) {
  return treatmentTypeMap[entityValue] || entityValue;
}

function getSymptomKeywords(entityValue) {
  if (!entityValue) return [];

  // Đảm bảo entityValue là một mảng để dễ dàng xử lý
  const entities = Array.isArray(entityValue) ? entityValue : [entityValue];
  const keywords = new Set();

  entities.forEach((entity) => {
    // Nếu entity là một key trong map (vd: 'bo_xit_hoi_symptoms')
    const mapEntry = symptomKeywordMap[entity];
    if (mapEntry) {
      mapEntry.keywords.forEach((keyword) => keywords.add(keyword));
    } else {
      // Nếu entity là một chuỗi mô tả triệu chứng trực tiếp (vd: 'thối thân')
      keywords.add(entity);
    }
  });

  return Array.from(keywords);
}

/**
 * Hàm mới: Get Disease Type
 */
function getDiseaseType(entityValue) {
  return diseaseTypeMap[entityValue] || entityValue;
}

// Hàm mới: Get Season
function getSeason(entityValue) {
  return seasonMap[entityValue] || entityValue;
}

/**
 * Xây dựng search query cho MongoDB
 */
function buildSearchQuery(diseaseName = null) {
  // <<< Bỏ tham số symptoms
  const conditions = [];

  if (diseaseName) {
    const cleanedName = cleanText(diseaseName);
    conditions.push(
      { name: { $regex: cleanedName, $options: "i" } },
      { commonName: { $regex: cleanedName, $options: "i" } },
      { scientificName: { $regex: cleanedName, $options: "i" } }
    );
  }

  // >>> ĐÃ LOẠI BỎ logic tìm kiếm theo triệu chứng ở đây để xử lý trong controller

  return conditions.length > 0 ? { $or: conditions } : {};
}

// Hàm formatLocation được giả định tồn tại từ code cũ
function formatLocation(location) {
  if (!location) return "Cần Thơ";
  // Thêm logic mapping cho location nếu cần
  return location;
}

module.exports = {
  extractEntity,
  getDiseaseName,
  getTreatmentType,
  getSymptomKeywords,
  getSeason,
  getDiseaseType,
  buildSearchQuery,
  formatLocation,
  cleanText,
  diseaseEntityMap,
  symptomKeywordMap, // Export thêm để dùng trong webhookController
};
