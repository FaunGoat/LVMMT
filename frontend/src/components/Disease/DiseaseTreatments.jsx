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
        <span>Phương pháp Điều trị</span>
      </h3>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
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
            {type}
          </button>
        ))}
        <button
          onClick={() => setSelectedType("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedType === "all"
              ? "bg-sky-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>
      </div>

      {/* Treatments List */}
      <div className="space-y-6">
        {filteredTreatments.length === 0 ? (
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Không có phương pháp điều trị nào</p>
          </div>
        ) : (
          filteredTreatments.map((treatment, idx) => {
            return (
              <div key={idx} className="bg-white border rounded-lg p-6">
                {/* Treatment Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {treatment.type}
                    </h4>
                  </div>
                </div>

                {/* Methods */}
                {treatment.methods && treatment.methods.length > 0 && (
                  <div className="space-y-3">
                    {treatment.methods.map((method, methodIdx) => (
                      <div
                        key={methodIdx}
                        className="bg-gray-50 border border-gray-400 rounded-lg p-4"
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
                            <h5 className="font-bold text-lg text-gray-800 mb-2">
                              {method.name}
                            </h5>
                          </div>
                          {/* <button className="text-gray-400 hover:text-gray-600 ml-4">
                            {expandedMethod === `${idx}-${methodIdx}`
                              ? "▼"
                              : "▶"}
                          </button> */}
                        </div>

                        {/* Expanded Details */}
                        {
                          <div className="mt-4 pt-4 border-t border-gray-300 space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {method.dosage && (
                                <div className="bg-white border border-gray-200 rounded p-2">
                                  <p className="text-xs text-gray-600">
                                    Liều lượng
                                  </p>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {method.dosage}
                                  </p>
                                </div>
                              )}
                              {method.frequency && (
                                <div className="bg-white border border-gray-200 rounded p-2">
                                  <p className="text-xs text-gray-600">
                                    Tần suất
                                  </p>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {method.frequency}
                                  </p>
                                </div>
                              )}
                              {method.applicationMethod && (
                                <div className="bg-white border border-gray-200 rounded p-2">
                                  <p className="text-xs text-gray-600">
                                    Cách dùng
                                  </p>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {method.applicationMethod}
                                  </p>
                                </div>
                              )}
                              {method.speedOfAction && (
                                <div className="bg-white border border-gray-200 rounded p-2">
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
                              <div className="bg-blue-50 border-l-3 border-blue-400 rounded p-3">
                                <p className="text-xs text-gray-600 mb-1">
                                  Hoạt chất
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {method.activeIngredient}
                                </p>
                              </div>
                            )}

                            {/* Side Effects */}
                            {method.sideEffects &&
                              method.sideEffects.length > 0 && (
                                <div className="bg-yellow-50 border-l-3 border-yellow-400 rounded p-3">
                                  <p className="text-sm font-semibold text-gray-800 mb-2">
                                    Tác dụng phụ:
                                  </p>
                                  <ul className="space-y-1.5">
                                    {method.sideEffects.map((effect, i) => (
                                      <li
                                        key={i}
                                        className="text-sm text-gray-700 pl-3"
                                      >
                                        • {effect}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                            {/* Equipment */}
                            {method.equipmentRequired &&
                              method.equipmentRequired.length > 0 && (
                                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                  <p className="text-sm font-semibold text-gray-700 mb-2">
                                    Thiết bị cần thiết:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {method.equipmentRequired.map((eq, i) => (
                                      <span
                                        key={i}
                                        className="bg-white px-3 py-1 rounded text-xs border border-gray-300"
                                      >
                                        {eq}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        }
                      </div>
                    ))}
                  </div>
                )}

                {/* Best Practices */}
                {treatment.bestPractices &&
                  treatment.bestPractices.length > 0 && (
                    <div className="mt-4 bg-green-50 border-l-3 border-green-400 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-800 mb-2">
                        Thực hành tốt nhất:
                      </p>
                      <ul className="space-y-1.5">
                        {treatment.bestPractices.map((practice, i) => (
                          <li key={i} className="text-sm text-gray-700 pl-3">
                            • {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Warnings */}
                {treatment.warnings && treatment.warnings.length > 0 && (
                  <div className="mt-4 bg-red-50 border-l-3 border-red-400 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      Cảnh báo:
                    </p>
                    <ul className="space-y-1.5">
                      {treatment.warnings.map((warning, i) => (
                        <li key={i} className="text-gray-700 pl-3">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety Period */}
                {treatment.safetyPeriod && (
                  <div className="mt-4 bg-orange-50 border-l-3 border-orange-400 rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-800">
                        Thời gian cách ly:
                      </span>{" "}
                      <span className="text-gray-700">
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
    </div>
  );
};

export default DiseaseTreatments;
