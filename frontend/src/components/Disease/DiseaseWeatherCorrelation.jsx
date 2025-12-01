import React from "react";

const DiseaseWeatherCorrelation = ({ weatherCorrelation }) => {
  if (!weatherCorrelation) return null;

  const hasTriggers =
    weatherCorrelation.weatherTriggers &&
    weatherCorrelation.weatherTriggers.length > 0;

  const hasAlerts =
    weatherCorrelation.forecastAlerts &&
    weatherCorrelation.forecastAlerts.length > 0;

  if (!hasTriggers && !hasAlerts) return null;

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-4">
        Yếu tố môi trường & Thời tiết
      </h3>

      {/* KHUNG GOM CHUNG CÁC YẾU TỐ */}
      <div className="bg-white rounded-lg shadow-xl p-6 border space-y-6">
        {/* 1. Điều kiện thời tiết gây bệnh (ĐÃ GOM) */}
        {hasTriggers && (
          <div>
            <h4 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-sky-100 pb-2">
              Điều kiện môi trường gây bệnh
            </h4>
            <ul className="space-y-4">
              {weatherCorrelation.weatherTriggers.map((trigger, idx) => (
                <li
                  key={idx}
                  className="pb-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex justify-between items-start gap-4">
                    <p className="font-semibold text-lg text-gray-800">
                      {trigger.condition}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 2. Cảnh báo dự báo (Nằm trong khung chung, có viền nổi bật) */}
        {hasAlerts && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl text-red-500">⚠️</span> Cảnh báo Dự báo
            </h4>
            <div className="space-y-3">
              {weatherCorrelation.forecastAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="bg-red-50 rounded-lg p-4 border border-red-200 shadow-sm"
                >
                  <p className="font-bold text-red-800 mb-1">
                    {alert.condition}
                  </p>
                  {alert.warningTime && (
                    <p className="text-xs text-red-700 mb-2">
                      Thời gian cảnh báo:{" "}
                      <span className="font-medium">{alert.warningTime}</span>
                    </p>
                  )}
                  {alert.recommendedActions &&
                    alert.recommendedActions.length > 0 && (
                      <ul className="text-sm text-red-900 space-y-1 list-disc list-inside pl-4">
                        <p className="text-xs font-semibold text-red-700 mt-2">
                          Hành động đề xuất:
                        </p>
                        {alert.recommendedActions.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseWeatherCorrelation;
