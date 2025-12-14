import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWeather } from "../../contexts/WeatherContext";

const WeatherPopupV2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCheckedToday, setHasCheckedToday] = useState(false);
  const { weatherData, loading, fetchWeatherData } = useWeather();

  useEffect(() => {
    // Kiểm tra xem đã hiển thị popup hôm nay chưa
    const lastShown = localStorage.getItem("weatherPopupLastShown");
    const today = new Date().toDateString();

    if (lastShown !== today) {
      // Hiển thị popup sau 2 giây khi vào trang
      const timer = setTimeout(async () => {
        const data = await fetchWeatherData();
        if (data) {
          setIsOpen(true);
          localStorage.setItem("weatherPopupLastShown", today);
        }
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setHasCheckedToday(true);
    }
  }, [fetchWeatherData]);

  const closePopup = () => {
    setIsOpen(false);
  };

  const openPopup = async () => {
    const data = await fetchWeatherData(true); // Force refresh
    if (data) {
      setIsOpen(true);
    }
  };

  const getWeatherIcon = (condition) => {
    const cond = condition.toLowerCase();
    if (cond.includes("mưa") && cond.includes("lớn")) return "🌧️";
    if (cond.includes("mưa")) return "🌦️";
    if (cond.includes("nắng")) return "☀️";
    if (cond.includes("nhiều mây")) return "☁️";
    if (cond.includes("bão")) return "🌪️";
    return "🌤️";
  };

  const getAlertLevel = (alerts) => {
    // if (!alerts || alerts.length === 0) return "success";
    const hasSuccess = alerts.some((a) => a.level === "success");
    const hasDanger = alerts.some((a) => a.level === "danger");
    const hasWarning = alerts.some((a) => a.level === "warning");

    if (hasSuccess) return "success";
    if (hasDanger) return "danger";
    if (hasWarning) return "warning";
    return "info";
  };

  const getAlertBadge = (level) => {
    const badges = {
      danger: { text: "NGUY HIỂM", color: "bg-red-500", icon: "🚨" },
      warning: { text: "CẢNH BÁO", color: "bg-yellow-500", icon: "⚠️" },
      info: { text: "THÔNG TIN", color: "bg-blue-500", icon: "ℹ️" },
      success: { text: "AN TOÀN", color: "bg-green-500", icon: "✅" },
    };
    return badges[level] || badges.info;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayNames = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    return `${dayNames[date.getDay()]}, ${date.getDate()}/${
      date.getMonth() + 1
    }`;
  };

  // Floating button để mở lại popup
  const FloatingButton = () => (
    <button
      onClick={openPopup}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 z-40 group hover:scale-110"
      title="Xem dự báo thời tiết"
    >
      <div className="text-2xl">🌤️</div>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Dự báo thời tiết
      </span>
    </button>
  );

  if (!isOpen && (hasCheckedToday || !weatherData)) {
    return <FloatingButton />;
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeIn"
        onClick={closePopup}
      />

      {/* Popup */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-5xl">🌤️</div>
                <div>
                  <h2 className="text-3xl font-bold">Dự báo Thời tiết</h2>
                  <p className="text-sky-100">3 ngày tới</p>
                </div>
              </div>
              <button
                onClick={closePopup}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
                <p className="text-gray-500 mt-3">Đang tải dự báo...</p>
              </div>
            ) : weatherData && weatherData.length > 0 ? (
              <>
                {/* Weather Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {weatherData.map((day, index) => {
                    const alertLevel = getAlertLevel(day.diseaseAlerts);
                    const badge = getAlertBadge(alertLevel);

                    return (
                      <div
                        key={index}
                        className={`rounded-xl p-5 shadow-md border-2 transition-all duration-300 hover:shadow-xl ${
                          index === 0
                            ? "bg-gradient-to-br from-sky-50 to-blue-100 border-sky-300"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {/* Date & Icon */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              {index === 0 ? "Hôm nay" : formatDate(day.date)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {day.location}
                            </p>
                          </div>
                          <div className="text-5xl">
                            {getWeatherIcon(day.condition)}
                          </div>
                        </div>

                        {/* Weather Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">🌡️ Nhiệt độ:</span>
                            <span className="font-semibold text-sky-700">
                              {day.temperature}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">💧 Độ ẩm:</span>
                            <span className="font-semibold text-blue-700">
                              {day.humidity}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">☁️ Tình hình:</span>
                            <p className="font-medium text-gray-800 mt-1">
                              {day.condition}
                            </p>
                          </div>
                        </div>

                        {/* Alert Badge */}
                        {day.diseaseAlerts && day.diseaseAlerts.length > 0 && (
                          <div className="pt-3 border-t border-gray-200">
                            <div
                              className={`${badge.color} text-white px-3 py-2 rounded-lg text-center text-sm font-bold flex items-center justify-center gap-2`}
                            >
                              <span>{badge.icon}</span>
                              <span>{badge.text}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Key Alerts Summary */}
                {weatherData.some(
                  (d) => d.diseaseAlerts && d.diseaseAlerts.length > 0
                ) && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-5 mb-6">
                    <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2 text-lg">
                      <span>Cảnh báo chính</span>
                    </h3>
                    <ul className="space-y-2">
                      {weatherData
                        // Thay đổi logic flatMap để kèm theo ngày
                        .flatMap((d, dIndex) =>
                          (d.diseaseAlerts || []).map((alert) => ({
                            ...alert,
                            date: d.date,
                            isToday: dIndex === 0, // Đánh dấu nếu là hôm nay
                          }))
                        )
                        .filter(
                          (a) => a.level === "danger" || a.level === "warning"
                        )
                        .slice(0, 3)
                        .map((alert, idx) => (
                          <li
                            key={idx}
                            className="text-base text-gray-700 flex items-start gap-2"
                          >
                            <span className="text-orange-600 font-bold mt-0.5">
                              •
                            </span>
                            <div>
                              {/* Hiển thị ngày dạng badge nhỏ */}
                              <span className="inline-block text-sm font-semibold bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded mr-1.5 mb-1">
                                {alert.isToday
                                  ? "Hôm nay"
                                  : formatDate(alert.date)}
                              </span>
                              <span>
                                <strong>{alert.disease}:</strong>{" "}
                                {alert.message}
                              </span>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/weather-forecast"
                    onClick={closePopup}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition text-center font-medium"
                  >
                    Xem chi tiết đầy đủ
                  </Link>
                  {/* <Link
                    to="/chatbot"
                    onClick={closePopup}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition text-center font-medium"
                  >
                    💬 Tư vấn với Chatbot
                  </Link> */}
                  <button
                    onClick={closePopup}
                    className="sm:w-auto bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Đóng
                  </button>
                </div>

                {/* Footer Note */}
                {/* <p className="text-xs text-gray-500 text-center mt-4">
                  Popup này sẽ tự động hiển thị một lần mỗi ngày
                </p> */}
              </>
            ) : (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">😔</div>
                <p className="text-gray-500">Không thể tải dự báo thời tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
};

export default WeatherPopupV2;
