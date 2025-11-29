import React, { useState } from "react";

const DiseaseSeasons = ({ seasons }) => {
  const [activeTab, setActiveTab] = useState("seasons");

  if (!seasons) return null;

  const getRiskLevelColor = (level) => {
    const colors = {
      "Rất cao": "bg-red-500 text-white",
      Cao: "bg-orange-500 text-white",
      "Trung bình": "bg-yellow-500 text-white",
      Thấp: "bg-green-500 text-white",
    };
    return colors[level] || "bg-gray-500 text-white";
  };

  const getMonthName = (month) => {
    const months = [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ];
    return months[month - 1];
  };

  const getSeasonIcon = (type) => {
    return type === "Đông Xuân" ? "❄️" : "☀️";
  };

  const getCropStageIcon = (stage) => {
    const icons = {
      "Gieo mạ": "🌱",
      "Cấy non": "🌾",
      "Đẻ nhánh": "🌿",
      "Làm đòng": "🌾",
      "Trổ bông": "🌸",
      "Chín sữa": "🌾",
      "Chín vàng": "🟡",
      "Thu hoạch": "🎯",
    };
    return icons[stage] || "🌾";
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-6 flex items-center gap-2">
        <span>📅</span>
        <span>Mùa vụ & Thời điểm Xuất hiện</span>
      </h3>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("seasons")}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === "seasons"
              ? "border-b-2 border-sky-500 text-sky-600"
              : "text-gray-600 hover:text-sky-600"
          }`}
        >
          Mùa vụ
        </button>
        <button
          onClick={() => setActiveTab("critical")}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === "critical"
              ? "border-b-2 border-sky-500 text-sky-600"
              : "text-gray-600 hover:text-sky-600"
          }`}
        >
          Giai đoạn Cây trồng
        </button>
        {seasons.regionalVariations &&
          seasons.regionalVariations.length > 0 && (
            <button
              onClick={() => setActiveTab("regional")}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === "regional"
                  ? "border-b-2 border-sky-500 text-sky-600"
                  : "text-gray-600 hover:text-sky-600"
              }`}
            >
              Khác biệt Vùng miền
            </button>
          )}
      </div>

      {/* Content */}
      <div>
        {/* SEASONS TAB */}
        {activeTab === "seasons" && seasons.seasons && (
          <div className="space-y-4">
            {seasons.seasons.map((season, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl shadow-md border-2 border-sky-200 p-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{getSeasonIcon(season.type)}</div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">
                        Vụ {season.type}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Tháng {season.startMonth} - Tháng {season.endMonth}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`${getRiskLevelColor(
                      season.riskLevel
                    )} px-4 py-2 rounded-full text-sm font-bold`}
                  >
                    Nguy cơ: {season.riskLevel}
                  </span>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-2 font-semibold">
                    Lịch trình trong năm:
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
                      const isInSeason =
                        season.startMonth <= season.endMonth
                          ? month >= season.startMonth &&
                            month <= season.endMonth
                          : month >= season.startMonth ||
                            month <= season.endMonth;
                      const isPeakMonth = season.peakMonths?.includes(month);

                      return (
                        <div
                          key={month}
                          className={`flex-1 h-12 rounded flex items-center justify-center text-xs font-semibold transition ${
                            isPeakMonth
                              ? "bg-red-500 text-white shadow-lg scale-110 z-10"
                              : isInSeason
                              ? "bg-sky-400 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                          title={
                            isPeakMonth
                              ? `Tháng ${month} - Bùng phát mạnh`
                              : isInSeason
                              ? `Tháng ${month} - Trong mùa vụ`
                              : `Tháng ${month}`
                          }
                        >
                          {getMonthName(month)}
                        </div>
                      );
                    })}
                  </div>
                  {season.peakMonths && season.peakMonths.length > 0 && (
                    <p className="text-xs text-red-600 mt-2 font-semibold">
                      🔥 Tháng bùng phát:{" "}
                      {season.peakMonths.map((m) => `Tháng ${m}`).join(", ")}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {season.description}
                  </p>
                </div>

                {/* Historical outbreaks */}
                {season.historicalOutbreaks &&
                  season.historicalOutbreaks.length > 0 && (
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <p className="text-sm font-semibold text-orange-800 mb-3">
                        📜 Lịch sử dịch bệnh:
                      </p>
                      <div className="space-y-2">
                        {season.historicalOutbreaks.map((outbreak, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded p-3 text-sm flex items-center justify-between"
                          >
                            <div>
                              <span className="font-semibold text-gray-800">
                                Tháng {outbreak.month}/{outbreak.year}
                              </span>
                              {" - "}
                              <span className="text-gray-600">
                                {outbreak.affectedArea}
                              </span>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                outbreak.severity === "Nặng"
                                  ? "bg-red-100 text-red-700"
                                  : outbreak.severity === "Trung bình"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {outbreak.severity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* CRITICAL PERIODS TAB */}
        {activeTab === "critical" && seasons.criticalPeriods && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasons.criticalPeriods.map((period, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-md border-2 p-6 ${
                  period.riskLevel === "Rất cao"
                    ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-300"
                    : period.riskLevel === "Cao"
                    ? "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-300"
                    : "bg-gradient-to-br from-yellow-50 to-green-50 border-yellow-300"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">
                      {getCropStageIcon(period.cropStage)}
                    </span>
                    <h4 className="text-lg font-bold text-gray-800">
                      {period.cropStage}
                    </h4>
                  </div>
                  <span
                    className={`${getRiskLevelColor(
                      period.riskLevel
                    )} px-3 py-1 rounded-full text-xs font-bold`}
                  >
                    {period.riskLevel}
                  </span>
                </div>

                {/* Days after planting */}
                {period.daysAfterPlanting && (
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-1">
                      Số ngày sau khi cấy
                    </p>
                    <p className="text-sm font-semibold text-sky-700">
                      📅 {period.daysAfterPlanting.min} -{" "}
                      {period.daysAfterPlanting.max} ngày
                    </p>
                  </div>
                )}

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4">
                  {period.description}
                </p>

                {/* Preventive measures */}
                {period.preventiveMeasures &&
                  period.preventiveMeasures.length > 0 && (
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-green-700 mb-2">
                        ✅ Biện pháp phòng ngừa:
                      </p>
                      <ul className="space-y-1">
                        {period.preventiveMeasures.map((measure, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-green-500 mt-0.5">▸</span>
                            <span>{measure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Early warning signs */}
                {period.earlyWarningSigns &&
                  period.earlyWarningSigns.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <p className="text-xs font-semibold text-red-700 mb-2">
                        ⚠️ Dấu hiệu cảnh báo sớm:
                      </p>
                      <ul className="space-y-1">
                        {period.earlyWarningSigns.map((sign, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-red-700 flex items-start gap-2"
                          >
                            <span className="mt-0.5">•</span>
                            <span>{sign}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* REGIONAL VARIATIONS TAB */}
        {activeTab === "regional" &&
          seasons.regionalVariations &&
          seasons.regionalVariations.length > 0 && (
            <div className="space-y-4">
              {seasons.regionalVariations.map((region, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md border-2 border-purple-200 p-6"
                >
                  <h4 className="text-lg font-bold text-purple-800 mb-3">
                    📍 {region.region}
                  </h4>
                  <div className="bg-white rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Mùa bùng phát:
                    </p>
                    <p className="text-sm text-gray-600">{region.peakSeason}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-gray-700">{region.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Climate Impact Note */}
      {seasons.climateImpact && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800 mb-2">
            🌍 Ảnh hưởng Biến đổi Khí hậu:
          </p>
          <p className="text-sm text-gray-700">{seasons.climateImpact}</p>
        </div>
      )}
    </div>
  );
};

export default DiseaseSeasons;
