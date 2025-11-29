import React, { useState } from "react";

const DiseaseSymptomsDetail = ({ symptoms }) => {
  const [selectedPart, setSelectedPart] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");

  if (!symptoms || !symptoms.symptoms || symptoms.symptoms.length === 0) {
    return null;
  }

  const getPartIcon = (part) => {
    const icons = {
      Lá: "🍃",
      Thân: "🌿",
      Bông: "🌸",
      Hạt: "🌾",
      Rễ: "🌱",
      Ngọn: "🌱",
      Gốc: "🪴",
      "Toàn cây": "🌾",
    };
    return icons[part] || "🌿";
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Nhẹ: "bg-green-100 text-green-800 border-green-300",
      "Trung bình": "bg-yellow-100 text-yellow-800 border-yellow-300",
      Nặng: "bg-orange-100 text-orange-800 border-orange-300",
      "Rất nặng": "bg-red-100 text-red-800 border-red-300",
    };
    return colors[severity] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStageColor = (stage) => {
    const colors = {
      Sớm: "bg-blue-100 text-blue-800",
      Giữa: "bg-purple-100 text-purple-800",
      Muộn: "bg-pink-100 text-pink-800",
      "Tất cả": "bg-gray-100 text-gray-800",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  // Filter symptoms
  const filteredSymptoms = symptoms.symptoms.filter((symptom) => {
    const matchPart = selectedPart === "all" || symptom.part === selectedPart;
    const matchStage =
      selectedStage === "all" || symptom.stage === selectedStage;
    return matchPart && matchStage;
  });

  // Get unique parts and stages
  const uniqueParts = ["all", ...new Set(symptoms.symptoms.map((s) => s.part))];
  const uniqueStages = [
    "all",
    ...new Set(symptoms.symptoms.map((s) => s.stage)),
  ];

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-6 flex items-center gap-2">
        <span>🔍</span>
        <span>Triệu chứng Chi tiết</span>
      </h3>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-2 border-sky-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Part filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bộ phận cây:
            </label>
            <div className="flex flex-wrap gap-2">
              {uniqueParts.map((part) => (
                <button
                  key={part}
                  onClick={() => setSelectedPart(part)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedPart === part
                      ? "bg-sky-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {part === "all" ? "Tất cả" : `${getPartIcon(part)} ${part}`}
                </button>
              ))}
            </div>
          </div>

          {/* Stage filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Giai đoạn:
            </label>
            <div className="flex flex-wrap gap-2">
              {uniqueStages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedStage === stage
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {stage === "all" ? "Tất cả" : stage}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Symptoms list */}
      <div className="space-y-4">
        {filteredSymptoms.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Không tìm thấy triệu chứng với bộ lọc này
            </p>
          </div>
        ) : (
          filteredSymptoms.map((symptom, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6 hover:shadow-xl transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{getPartIcon(symptom.part)}</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">
                      {symptom.part}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`${getStageColor(
                          symptom.stage
                        )} px-2 py-1 rounded text-xs font-semibold`}
                      >
                        Giai đoạn {symptom.stage}
                      </span>
                      <span
                        className={`${getSeverityColor(
                          symptom.severity
                        )} border px-2 py-1 rounded text-xs font-semibold`}
                      >
                        {symptom.severity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {symptom.description}
                </p>
              </div>

              {/* Visual Characteristics */}
              {symptom.visualCharacteristics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {symptom.visualCharacteristics.color && (
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-3 border border-red-200">
                      <p className="text-xs text-gray-600 mb-1">Màu sắc</p>
                      <div className="flex flex-wrap gap-1">
                        {symptom.visualCharacteristics.color.map((c, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white px-2 py-1 rounded text-red-700 font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {symptom.visualCharacteristics.shape && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Hình dạng</p>
                      <p className="text-sm font-semibold text-blue-700">
                        {symptom.visualCharacteristics.shape}
                      </p>
                    </div>
                  )}
                  {symptom.visualCharacteristics.size && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Kích thước</p>
                      <p className="text-sm font-semibold text-green-700">
                        {symptom.visualCharacteristics.size}
                      </p>
                    </div>
                  )}
                  {symptom.visualCharacteristics.pattern && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Phân bố</p>
                      <p className="text-sm font-semibold text-purple-700">
                        {symptom.visualCharacteristics.pattern}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Distinguishing Features */}
              {symptom.distinguishingFeatures &&
                symptom.distinguishingFeatures.length > 0 && (
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200 mb-4">
                    <p className="text-sm font-semibold text-amber-800 mb-2">
                      🎯 Đặc điểm phân biệt:
                    </p>
                    <ul className="space-y-1">
                      {symptom.distinguishingFeatures.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-amber-500 mt-0.5">▸</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Progression */}
              {symptom.progression && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800 mb-2">
                    📈 Diễn biến:
                  </p>
                  <p className="text-sm text-gray-700">{symptom.progression}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Diagnostic Checklist */}
      {symptoms.diagnosticChecklist &&
        symptoms.diagnosticChecklist.length > 0 && (
          <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md border-2 border-green-200 p-6">
            <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
              <span>✅</span>
              <span>Danh sách Kiểm tra Chẩn đoán</span>
            </h4>
            <div className="space-y-3">
              {symptoms.diagnosticChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border border-green-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {idx + 1}. {item.question}
                    </p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        item.importance === "Quan trọng"
                          ? "bg-red-100 text-red-700"
                          : item.importance === "Tham khảo"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.importance}
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    → {item.expectedAnswer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Similar Diseases */}
      {symptoms.similarDiseases && symptoms.similarDiseases.length > 0 && (
        <div className="mt-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-md border-2 border-orange-200 p-6">
          <h4 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
            <span>⚠️</span>
            <span>Bệnh Dễ Nhầm lẫn</span>
          </h4>
          <div className="space-y-3">
            {symptoms.similarDiseases.map((similar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-4 border border-orange-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-800">
                    So với: {similar.diseaseId?.name || "Bệnh khác"}
                  </p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      similar.confusionRisk === "Cao"
                        ? "bg-red-100 text-red-700"
                        : similar.confusionRisk === "Trung bình"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    Nguy cơ nhầm: {similar.confusionRisk}
                  </span>
                </div>

                {similar.similarities && similar.similarities.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Giống nhau:
                    </p>
                    <ul className="space-y-1">
                      {similar.similarities.map((sim, i) => (
                        <li
                          key={i}
                          className="text-xs text-gray-600 flex items-start gap-2"
                        >
                          <span className="text-gray-400">•</span>
                          <span>{sim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {similar.differences && similar.differences.length > 0 && (
                  <div className="bg-green-50 rounded p-3 border border-green-200">
                    <p className="text-xs font-semibold text-green-700 mb-1">
                      Khác biệt để phân biệt:
                    </p>
                    <ul className="space-y-1">
                      {similar.differences.map((diff, i) => (
                        <li
                          key={i}
                          className="text-xs text-green-700 flex items-start gap-2"
                        >
                          <span className="text-green-500">✓</span>
                          <span>{diff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseSymptomsDetail;
