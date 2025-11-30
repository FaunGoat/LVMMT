import React, { useState } from "react";

const DiseaseSeasons = ({ seasons }) => {
  const [activeTab, setActiveTab] = useState("seasons");

  if (!seasons) return null;

  const getRiskColor = (level) => {
    const colors = {
      "Rất cao": "bg-red-500 text-white",
      Cao: "bg-orange-500 text-white",
      "Trung bình": "bg-yellow-500 text-white",
      Thấp: "bg-green-500 text-white",
    };
    return colors[level] || "bg-gray-500 text-white";
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-4">
        📅 Mùa vụ & Thời điểm xuất hiện
      </h3>

      {/* Tabs đơn giản */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("seasons")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "seasons"
              ? "bg-sky-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Mùa vụ
        </button>
        <button
          onClick={() => setActiveTab("stages")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "stages"
              ? "bg-sky-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Giai đoạn cây trồng
        </button>
      </div>

      {/* Nội dung */}
      {activeTab === "seasons" && seasons.seasons && (
        <div className="space-y-4">
          {seasons.seasons.map((season, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-5 border">
              {/* Tiêu đề */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    Vụ {season.type}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Tháng {season.startMonth} - {season.endMonth}
                  </p>
                </div>
                <span
                  className={`${getRiskColor(
                    season.riskLevel
                  )} px-3 py-1 rounded-full text-sm font-bold`}
                >
                  {season.riskLevel}
                </span>
              </div>

              {/* Mô tả */}
              <p className="text-gray-700 mb-3">{season.description}</p>

              {/* Tháng bùng phát */}
              {season.peakMonths && season.peakMonths.length > 0 && (
                <div className="bg-red-50 rounded p-3 border border-red-200">
                  <p className="text-sm text-red-700">
                    <strong>🔥 Tháng bùng phát:</strong>{" "}
                    {season.peakMonths.map((m) => `Tháng ${m}`).join(", ")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "stages" && seasons.criticalPeriods && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seasons.criticalPeriods.map((period, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-5 border">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-bold text-gray-800">
                  {period.cropStage}
                </h4>
                <span
                  className={`${getRiskColor(
                    period.riskLevel
                  )} px-2 py-1 rounded text-xs font-bold`}
                >
                  {period.riskLevel}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-3">{period.description}</p>

              {/* Biện pháp phòng ngừa */}
              {period.preventiveMeasures &&
                period.preventiveMeasures.length > 0 && (
                  <div className="bg-green-50 rounded p-3">
                    <p className="text-xs font-semibold text-green-800 mb-1">
                      Biện pháp:
                    </p>
                    <ul className="text-xs text-green-700 space-y-1">
                      {period.preventiveMeasures.map((measure, idx) => (
                        <li key={idx}>• {measure}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiseaseSeasons;
