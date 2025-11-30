import React, { useState } from "react";

const DiseaseTreatments = ({ treatments }) => {
  const [selectedType, setSelectedType] = useState("all");
  const [expandedMethod, setExpandedMethod] = useState(null);

  if (
    !treatments ||
    !treatments.treatments ||
    treatments.treatments.length === 0
  ) {
    return null;
  }

  const getTypeIcon = (type) => {
    const icons = {
      "Hóa học": "🧪",
      "Sinh học": "🌿",
      "Canh tác": "🌾",
      "Tổng hợp": "🔄",
    };
    return icons[type] || "💊";
  };

  const getTypeColor = (type) => {
    const colors = {
      "Hóa học": "from-red-50 to-orange-50 border-red-200",
      "Sinh học": "from-green-50 to-emerald-50 border-green-200",
      "Canh tác": "from-amber-50 to-yellow-50 border-amber-200",
      "Tổng hợp": "from-purple-50 to-pink-50 border-purple-200",
    };
    return colors[type] || "from-gray-50 to-slate-50 border-gray-200";
  };

  const getEffectivenessStars = (effectiveness) => {
    if (!effectiveness) return "";
    return "⭐".repeat(effectiveness);
  };

  const getCostColor = (cost) => {
    const colors = {
      "Rất thấp": "text-green-600",
      Thấp: "text-green-600",
      "Trung bình": "text-yellow-600",
      Cao: "text-orange-600",
      "Rất cao": "text-red-600",
    };
    return colors[cost] || "text-gray-600";
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      1: { text: "Ưu tiên cao", color: "bg-red-500" },
      2: { text: "Ưu tiên", color: "bg-orange-500" },
      3: { text: "Khuyến nghị", color: "bg-blue-500" },
      4: { text: "Tham khảo", color: "bg-gray-500" },
    };
    return badges[priority] || badges[3];
  };

  // Filter treatments by type
  const filteredTreatments =
    selectedType === "all"
      ? treatments.treatments
      : treatments.treatments.filter((t) => t.type === selectedType);

  // Get unique types
  const uniqueTypes = [...new Set(treatments.treatments.map((t) => t.type))];

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-6 flex items-center gap-2">
        <span>💊</span>
        <span>Phương pháp Điều trị</span>
      </h3>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedType("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedType === "all"
              ? "bg-sky-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tất cả ({treatments.treatments.length})
        </button>
        {uniqueTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedType === type
                ? "bg-sky-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {getTypeIcon(type)} {type} (
            {treatments.treatments.filter((t) => t.type === type).length})
          </button>
        ))}
      </div>

      {/* Treatments List */}
      <div className="space-y-6">
        {filteredTreatments.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">Không có phương pháp điều trị nào</p>
          </div>
        ) : (
          filteredTreatments.map((treatment, idx) => {
            const badge = getPriorityBadge(treatment.priority);

            return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${getTypeColor(
                  treatment.type
                )} rounded-xl shadow-lg p-6 border-2`}
              >
                {/* Treatment Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">
                      {getTypeIcon(treatment.type)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">
                        {treatment.type}
                      </h4>
                      <span
                        className={`${badge.color} text-white text-xs px-3 py-1 rounded-full font-semibold`}
                      >
                        {badge.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Methods */}
                {treatment.methods && treatment.methods.length > 0 && (
                  <div className="space-y-4">
                    {treatment.methods.map((method, methodIdx) => (
                      <div
                        key={methodIdx}
                        className="bg-white rounded-lg p-4 shadow-sm"
                      >
                        <div
                          className="flex items-start justify-between cursor-pointer"
                          onClick={() =>
                            setExpandedMethod(
                              expandedMethod === `${idx}-${methodIdx}`
                                ? null
                                : `${idx}-${methodIdx}`
                            )
                          }
                        >
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-800 mb-2">
                              {method.name}
                            </h5>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {method.effectiveness && (
                                <span className="text-sm">
                                  {getEffectivenessStars(method.effectiveness)}
                                </span>
                              )}
                              {method.cost && (
                                <span
                                  className={`text-sm font-semibold ${getCostColor(
                                    method.cost
                                  )}`}
                                >
                                  💰 {method.cost}
                                </span>
                              )}
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            {expandedMethod === `${idx}-${methodIdx}`
                              ? "▼"
                              : "▶"}
                          </button>
                        </div>

                        {/* Expanded Details */}
                        {expandedMethod === `${idx}-${methodIdx}` && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {method.dosage && (
                                <div className="bg-sky-50 rounded p-2">
                                  <p className="text-xs text-gray-600">
                                    Liều lượng
                                  </p>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {method.dosage}
                                  </p>
                                </div>
                              )}
                              {method.frequency && (
                                <div className="bg-blue-50 rounded p-2">
                                  <p className="text-xs text-gray-600">
                                    Tần suất
                                  </p>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {method.frequency}
                                  </p>
                                </div>
                              )}
                              {method.applicationMethod && (
                                <div className="bg-purple-50 rounded p-2">
                                  <p className="text-xs text-gray-600">
                                    Cách dùng
                                  </p>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {method.applicationMethod}
                                  </p>
                                </div>
                              )}
                              {method.speedOfAction && (
                                <div className="bg-green-50 rounded p-2">
                                  <p className="text-xs text-gray-600">
                                    Tốc độ tác động
                                  </p>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {method.speedOfAction}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Active Ingredient */}
                            {method.activeIngredient && (
                              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-1">
                                  Hoạt chất
                                </p>
                                <p className="text-sm font-semibold text-cyan-800">
                                  {method.activeIngredient}
                                </p>
                              </div>
                            )}

                            {/* Side Effects */}
                            {method.sideEffects &&
                              method.sideEffects.length > 0 && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded p-3">
                                  <p className="text-sm font-semibold text-yellow-800 mb-1">
                                    ⚠️ Tác dụng phụ:
                                  </p>
                                  <ul className="space-y-1">
                                    {method.sideEffects.map((effect, i) => (
                                      <li
                                        key={i}
                                        className="text-sm text-gray-700 flex items-start gap-2"
                                      >
                                        <span className="text-yellow-500">
                                          •
                                        </span>
                                        <span>{effect}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                            {/* Equipment */}
                            {method.equipmentRequired &&
                              method.equipmentRequired.length > 0 && (
                                <div className="bg-gray-50 rounded p-3">
                                  <p className="text-sm font-semibold text-gray-700 mb-1">
                                    🔧 Thiết bị cần thiết:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {method.equipmentRequired.map((eq, i) => (
                                      <span
                                        key={i}
                                        className="bg-white px-2 py-1 rounded text-xs border border-gray-200"
                                      >
                                        {eq}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Best Practices */}
                {treatment.bestPractices &&
                  treatment.bestPractices.length > 0 && (
                    <div className="mt-4 bg-white rounded-lg p-4">
                      <p className="text-sm font-semibold text-green-700 mb-2">
                        ✅ Thực hành tốt nhất:
                      </p>
                      <ul className="space-y-1">
                        {treatment.bestPractices.map((practice, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-green-500">▸</span>
                            <span>{practice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Warnings */}
                {treatment.warnings && treatment.warnings.length > 0 && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                    <p className="text-sm font-semibold text-red-700 mb-2">
                      🚨 Cảnh báo:
                    </p>
                    <ul className="space-y-1">
                      {treatment.warnings.map((warning, i) => (
                        <li
                          key={i}
                          className="text-sm text-red-700 flex items-start gap-2"
                        >
                          <span className="text-red-500">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety Period */}
                {treatment.safetyPeriod && (
                  <div className="mt-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200">
                    <p className="text-sm">
                      <span className="font-semibold text-orange-800">
                        ⏱️ Thời gian cách ly:
                      </span>{" "}
                      <span className="text-orange-700">
                        {treatment.safetyPeriod}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* IPM Strategy */}
      {treatments.integratedPestManagement && (
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>Quản lý Dịch hại Tổng hợp (IPM)</span>
          </h4>
          <div className="space-y-3">
            {treatments.integratedPestManagement.strategy && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Chiến lược:
                </p>
                <p className="text-sm text-gray-700">
                  {treatments.integratedPestManagement.strategy}
                </p>
              </div>
            )}
            {treatments.integratedPestManagement.decisionThreshold && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Ngưỡng can thiệp:
                </p>
                <p className="text-sm text-gray-700">
                  {treatments.integratedPestManagement.decisionThreshold}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseTreatments;
