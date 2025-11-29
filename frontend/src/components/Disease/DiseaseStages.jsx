import React from "react";

const DiseaseStages = ({ stages }) => {
  if (!stages || !stages.stages || stages.stages.length === 0) {
    return null;
  }

  const getSeverityColor = (severity) => {
    const colors = {
      Nhẹ: "bg-green-100 text-green-800 border-green-300",
      "Trung bình": "bg-yellow-100 text-yellow-800 border-yellow-300",
      Nặng: "bg-orange-100 text-orange-800 border-orange-300",
      "Rất nặng": "bg-red-100 text-red-800 border-red-300",
    };
    return colors[severity] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getSpreadRateIcon = (rate) => {
    const icons = {
      Chậm: "🐌",
      "Trung bình": "🚶",
      Nhanh: "🏃",
      "Rất nhanh": "🚀",
    };
    return icons[rate] || "📊";
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-6 flex items-center gap-2">
        <span>📊</span>
        <span>Giai đoạn Phát triển Bệnh</span>
      </h3>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Tổng thời gian</p>
          <p className="text-2xl font-bold text-blue-700">
            {stages.totalDuration}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600 mb-1">Số giai đoạn</p>
          <p className="text-2xl font-bold text-purple-700">
            {stages.stages.length} giai đoạn
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-gray-600 mb-1">Giai đoạn nguy hiểm nhất</p>
          <p className="text-2xl font-bold text-red-700">
            Giai đoạn {stages.peakStage + 1}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-300 via-yellow-300 via-orange-300 to-red-300"></div>

        {/* Stages */}
        <div className="space-y-6">
          {stages.stages.map((stage, index) => {
            const isPeakStage = index === stages.peakStage;

            return (
              <div key={index} className="relative pl-20">
                {/* Timeline dot */}
                <div
                  className={`absolute left-5 top-6 w-7 h-7 rounded-full flex items-center justify-center font-bold text-white z-10 ${
                    isPeakStage
                      ? "bg-red-500 ring-4 ring-red-200 shadow-lg"
                      : getSeverityColor(stage.severity).includes("green")
                      ? "bg-green-500"
                      : getSeverityColor(stage.severity).includes("yellow")
                      ? "bg-yellow-500"
                      : getSeverityColor(stage.severity).includes("orange")
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                >
                  {stage.order}
                </div>

                {/* Stage card */}
                <div
                  className={`bg-white rounded-xl shadow-md border-2 p-6 transition-all duration-300 hover:shadow-xl ${
                    isPeakStage
                      ? "border-red-500 ring-2 ring-red-200"
                      : "border-gray-200 hover:border-sky-300"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        {stage.name}
                        {isPeakStage && (
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                            NGUY HIỂM NHẤT
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Thời gian</p>
                      <p className="text-sm font-semibold text-gray-800">
                        ⏱️ {stage.duration}
                      </p>
                    </div>
                    <div
                      className={`rounded-lg p-3 border ${getSeverityColor(
                        stage.severity
                      )}`}
                    >
                      <p className="text-xs mb-1">Mức độ</p>
                      <p className="text-sm font-semibold">{stage.severity}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Thiệt hại</p>
                      <p className="text-sm font-semibold text-red-600">
                        📉 {stage.cropDamage}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">
                        Tốc độ lây lan
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {getSpreadRateIcon(stage.spreadRate)} {stage.spreadRate}
                      </p>
                    </div>
                  </div>

                  {/* Symptoms */}
                  {stage.symptoms && stage.symptoms.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                      <p className="text-sm font-semibold text-amber-800 mb-2">
                        🔍 Triệu chứng giai đoạn này:
                      </p>
                      <ul className="space-y-1">
                        {stage.symptoms.map((symptom, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-amber-500 mt-0.5">▸</span>
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Visual signs */}
                  {stage.visualSigns && stage.visualSigns.length > 0 && (
                    <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-800 mb-1">
                        👁️ Dấu hiệu nhìn thấy:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {stage.visualSigns.map((sign, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white text-blue-700 px-2 py-1 rounded border border-blue-300"
                          >
                            {sign}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      {stages.notes && (
        <div className="mt-6 bg-gradient-to-r from-sky-50 to-blue-50 border-l-4 border-sky-500 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-sky-700">💡 Lưu ý:</span>{" "}
            {stages.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiseaseStages;
