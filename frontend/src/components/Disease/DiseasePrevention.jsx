import React, { useState } from "react";

const DiseasePrevention = ({ prevention }) => {
  const [activeTab, setActiveTab] = useState("cultural");

  if (!prevention) return null;

  const getEffectivenessStars = (effectiveness) => {
    if (!effectiveness) return "";
    return "⭐".repeat(effectiveness);
  };

  const getCostColor = (cost) => {
    const colors = {
      Thấp: "text-green-600",
      "Trung bình": "text-yellow-600",
      Cao: "text-orange-600",
      "Rất cao": "text-red-600",
    };
    return colors[cost] || "text-gray-600";
  };

  const getResistanceColor = (level) => {
    const colors = {
      "Kháng cao": "bg-green-100 text-green-800",
      "Kháng trung bình": "bg-blue-100 text-blue-800",
      "Dung nạp": "bg-yellow-100 text-yellow-800",
      "Nhạy cảm": "bg-orange-100 text-orange-800",
      "Rất nhạy cảm": "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-6 flex items-center gap-2">
        <span>🛡️</span>
        <span>Phòng ngừa Bệnh</span>
      </h3>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("cultural")}
          className={`px-4 py-2 rounded-t-lg font-medium transition ${
            activeTab === "cultural"
              ? "bg-sky-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          🌾 Canh tác
        </button>
        <button
          onClick={() => setActiveTab("variety")}
          className={`px-4 py-2 rounded-t-lg font-medium transition ${
            activeTab === "variety"
              ? "bg-sky-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          🌱 Giống lúa
        </button>
        <button
          onClick={() => setActiveTab("monitoring")}
          className={`px-4 py-2 rounded-t-lg font-medium transition ${
            activeTab === "monitoring"
              ? "bg-sky-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          👁️ Giám sát
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-4 py-2 rounded-t-lg font-medium transition ${
            activeTab === "schedule"
              ? "bg-sky-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          📅 Lịch trình
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {/* Cultural Practices */}
        {activeTab === "cultural" &&
          prevention.culturalPractices &&
          prevention.culturalPractices.length > 0 && (
            <div className="space-y-4">
              {prevention.culturalPractices.map((practice, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-md border-2 border-green-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-bold text-green-800">
                      {practice.practice}
                    </h4>
                    {practice.effectiveness && (
                      <span className="text-xl">
                        {getEffectivenessStars(practice.effectiveness)}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-3">{practice.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    {practice.timing && (
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-600">Thời gian</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {practice.timing}
                        </p>
                      </div>
                    )}
                    {practice.frequency && (
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-600">Tần suất</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {practice.frequency}
                        </p>
                      </div>
                    )}
                    {practice.cost && (
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-600">Chi phí</p>
                        <p
                          className={`text-sm font-semibold ${getCostColor(
                            practice.cost
                          )}`}
                        >
                          {practice.cost}
                        </p>
                      </div>
                    )}
                    {practice.laborRequirement && (
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-600">Nhân công</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {practice.laborRequirement}
                        </p>
                      </div>
                    )}
                  </div>

                  {practice.procedure && practice.procedure.length > 0 && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Các bước thực hiện:
                      </p>
                      <ol className="space-y-1">
                        {practice.procedure.map((step, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="font-bold text-green-600">
                              {i + 1}.
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Variety Selection */}
        {activeTab === "variety" &&
          prevention.varietySelection &&
          prevention.varietySelection.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevention.varietySelection.map((variety, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 shadow-md border-2 border-blue-200"
                >
                  <h4 className="text-xl font-bold text-blue-800 mb-3">
                    {variety.varietyName}
                  </h4>

                  {variety.scientificName && (
                    <p className="text-sm text-gray-600 italic mb-3">
                      {variety.scientificName}
                    </p>
                  )}

                  <div className="mb-3">
                    <span
                      className={`${getResistanceColor(
                        variety.resistanceLevel
                      )} px-3 py-1 rounded-full text-sm font-bold`}
                    >
                      {variety.resistanceLevel}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {variety.yieldPotential && (
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Năng suất:</span>{" "}
                        {variety.yieldPotential}
                      </p>
                    )}
                    {variety.growthDuration && (
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">
                          Thời gian sinh trưởng:
                        </span>{" "}
                        {variety.growthDuration}
                      </p>
                    )}
                    {variety.notes && (
                      <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded border-l-2 border-yellow-400">
                        💡 {variety.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Monitoring Schedule */}
        {activeTab === "monitoring" &&
          prevention.monitoringSchedule &&
          prevention.monitoringSchedule.length > 0 && (
            <div className="space-y-4">
              {prevention.monitoringSchedule.map((schedule, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 shadow-md border-2 border-purple-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        {schedule.frequency}
                      </p>
                      {schedule.cropStage && (
                        <p className="text-sm text-gray-600">
                          Giai đoạn: {schedule.cropStage}
                        </p>
                      )}
                    </div>
                  </div>

                  {schedule.whatToCheck && schedule.whatToCheck.length > 0 && (
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Kiểm tra:
                      </p>
                      <ul className="space-y-1">
                        {schedule.whatToCheck.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-purple-500">▸</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {schedule.threshold && (
                    <div className="bg-red-50 border-l-4 border-red-400 rounded p-3">
                      <p className="text-sm">
                        <span className="font-semibold text-red-700">
                          Ngưỡng cảnh báo:
                        </span>{" "}
                        <span className="text-red-600">
                          {schedule.threshold}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Preventive Schedule */}
        {activeTab === "schedule" && prevention.preventiveSchedule && (
          <div className="space-y-4">
            {prevention.preventiveSchedule.preSeasonPreparation &&
              prevention.preventiveSchedule.preSeasonPreparation.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 shadow-md border-2 border-amber-200">
                  <h4 className="text-lg font-bold text-amber-800 mb-3">
                    🌾 Trước vụ
                  </h4>
                  <ul className="space-y-2">
                    {prevention.preventiveSchedule.preSeasonPreparation.map(
                      (item, i) => (
                        <li
                          key={i}
                          className="text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-amber-500 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {prevention.preventiveSchedule.earlySeasonActions &&
              prevention.preventiveSchedule.earlySeasonActions.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-md border-2 border-green-200">
                  <h4 className="text-lg font-bold text-green-800 mb-3">
                    🌱 Đầu vụ
                  </h4>
                  <ul className="space-y-2">
                    {prevention.preventiveSchedule.earlySeasonActions.map(
                      (item, i) => (
                        <li
                          key={i}
                          className="text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-green-500 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {prevention.preventiveSchedule.midSeasonActions &&
              prevention.preventiveSchedule.midSeasonActions.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 shadow-md border-2 border-blue-200">
                  <h4 className="text-lg font-bold text-blue-800 mb-3">
                    🌾 Giữa vụ
                  </h4>
                  <ul className="space-y-2">
                    {prevention.preventiveSchedule.midSeasonActions.map(
                      (item, i) => (
                        <li
                          key={i}
                          className="text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-blue-500 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {prevention.preventiveSchedule.postHarvestActions &&
              prevention.preventiveSchedule.postHarvestActions.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 shadow-md border-2 border-orange-200">
                  <h4 className="text-lg font-bold text-orange-800 mb-3">
                    🎯 Sau thu hoạch
                  </h4>
                  <ul className="space-y-2">
                    {prevention.preventiveSchedule.postHarvestActions.map(
                      (item, i) => (
                        <li
                          key={i}
                          className="text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-orange-500 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Cost-Effectiveness Summary */}
      {prevention.costEffectiveness && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-5">
          <h4 className="text-lg font-bold text-green-800 mb-3">
            💰 Hiệu quả Chi phí
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {prevention.costEffectiveness.totalPreventionCost && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600">Chi phí phòng ngừa</p>
                <p className="text-lg font-bold text-green-700">
                  {prevention.costEffectiveness.totalPreventionCost}
                </p>
              </div>
            )}
            {prevention.costEffectiveness.potentialLossPrevented && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600">
                  Thiệt hại ngăn ngừa được
                </p>
                <p className="text-lg font-bold text-blue-700">
                  {prevention.costEffectiveness.potentialLossPrevented}
                </p>
              </div>
            )}
            {prevention.costEffectiveness.returnOnInvestment && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600">Lợi nhuận đầu tư</p>
                <p className="text-lg font-bold text-purple-700">
                  {prevention.costEffectiveness.returnOnInvestment}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseasePrevention;
