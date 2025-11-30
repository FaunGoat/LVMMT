import React from "react";

const DiseaseWeatherCorrelation = ({ weatherCorrelation }) => {
  if (!weatherCorrelation) return null;

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
        🌤️ Liên quan thời tiết
      </h3>

      {/* Điều kiện thời tiết gây bệnh */}
      {weatherCorrelation.weatherTriggers &&
        weatherCorrelation.weatherTriggers.length > 0 && (
          <div className="space-y-4">
            {weatherCorrelation.weatherTriggers.map((trigger, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-5 border">
                {/* Tiêu đề */}
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-gray-800">
                    {trigger.condition}
                  </h4>
                  <span
                    className={`${getRiskColor(
                      trigger.riskLevel
                    )} px-3 py-1 rounded text-sm font-bold`}
                  >
                    {trigger.riskLevel}
                  </span>
                </div>

                {/* Mô tả */}
                {trigger.description && (
                  <p className="text-gray-700 mb-3">{trigger.description}</p>
                )}

                {/* Ngưỡng thời tiết */}
                {trigger.threshold && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                    {trigger.threshold.temperature && (
                      <div className="bg-red-50 rounded p-3 border border-red-200">
                        <p className="text-xs text-gray-600 mb-1">
                          🌡️ Nhiệt độ
                        </p>
                        <p className="text-sm font-semibold text-red-700">
                          {trigger.threshold.temperature.min}°C -{" "}
                          {trigger.threshold.temperature.max}°C
                        </p>
                      </div>
                    )}
                    {trigger.threshold.humidity && (
                      <div className="bg-blue-50 rounded p-3 border border-blue-200">
                        <p className="text-xs text-gray-600 mb-1">💧 Độ ẩm</p>
                        <p className="text-sm font-semibold text-blue-700">
                          {trigger.threshold.humidity.min}% -{" "}
                          {trigger.threshold.humidity.max}%
                        </p>
                      </div>
                    )}
                    {trigger.threshold.rainfall && (
                      <div className="bg-cyan-50 rounded p-3 border border-cyan-200">
                        <p className="text-xs text-gray-600 mb-1">🌧️ Mưa</p>
                        <p className="text-sm font-semibold text-cyan-700">
                          {trigger.threshold.rainfall.amount}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Hành động cần làm */}
                {trigger.response && (
                  <div className="bg-green-50 rounded p-3 border border-green-200">
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      ✅ Hành động:
                    </p>
                    <p className="text-sm text-green-900">{trigger.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      {/* Cảnh báo dự báo */}
      {weatherCorrelation.forecastAlerts &&
        weatherCorrelation.forecastAlerts.length > 0 && (
          <div className="mt-4 bg-white rounded-lg shadow p-5 border">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              ⚠️ Cảnh báo dự báo
            </h4>
            <div className="space-y-3">
              {weatherCorrelation.forecastAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="bg-orange-50 rounded p-3 border border-orange-200"
                >
                  <p className="font-semibold text-orange-800 mb-1">
                    {alert.condition}
                  </p>
                  {alert.warningTime && (
                    <p className="text-sm text-orange-700 mb-2">
                      Thời gian cảnh báo: {alert.warningTime}
                    </p>
                  )}
                  {alert.recommendedActions &&
                    alert.recommendedActions.length > 0 && (
                      <ul className="text-sm text-orange-900 space-y-1">
                        {alert.recommendedActions.map((action, i) => (
                          <li key={i}>• {action}</li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default DiseaseWeatherCorrelation;
