import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function WeatherForecast() {
  const [weatherData, setWeatherData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("Cần Thơ");
  const [weatherStats, setWeatherStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(7);
  const [activeTab, setActiveTab] = useState("forecast");
  const [selectedDay, setSelectedDay] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchWeatherData();
    if (activeTab === "stats") {
      fetchWeatherStats();
    }
  }, [selectedLocation, days, activeTab]);

  const fetchLocations = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/weather/locations"
      );
      const data = await response.json();

      if (data.success) {
        const sorted = data.data.sort((a, b) => {
          if (a === "Cần Thơ") return -1;
          if (b === "Cần Thơ") return 1;
          return a.localeCompare(b);
        });
        setLocations(sorted);
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const url =
        activeTab === "alerts"
          ? `http://localhost:5000/api/weather/alerts?location=${encodeURIComponent(
              selectedLocation
            )}`
          : `http://localhost:5000/api/weather?location=${encodeURIComponent(
              selectedLocation
            )}&days=${days}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Không thể tải dự báo thời tiết");
      }

      const data = await response.json();

      if (data.success) {
        setWeatherData(data.data);
      } else {
        throw new Error(data.error || "Lỗi không xác định");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/weather/stats?location=${encodeURIComponent(
          selectedLocation
        )}`
      );
      const data = await response.json();

      if (data.success) {
        setWeatherStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  //   return `${dayNames[date.getDay()]}, ${date.getDate()}/${
  //     date.getMonth() + 1
  //   }`;
  // };

  const formatFullDate = (dateString) => {
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
    return `${dayNames[date.getDay()]}, ${date.getDate()} tháng ${
      date.getMonth() + 1
    }, ${date.getFullYear()}`;
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

  const getAlertStyle = (level) => {
    const styles = {
      danger: "bg-red-50 border-l-4 border-red-500",
      warning: "bg-yellow-50 border-l-4 border-yellow-500",
      info: "bg-blue-50 border-l-4 border-blue-500",
      success: "bg-green-50 border-l-4 border-green-500",
    };
    return styles[level] || styles.info;
  };

  const getAlertIcon = (level) => {
    const icons = {
      danger: "🚨",
      warning: "⚠️",
      info: "ℹ️",
      success: "✅",
    };
    return icons[level] || "ℹ️";
  };

  const getAlertBadge = (level) => {
    const badges = {
      danger: { text: "NGUY HIỂM", color: "bg-red-500" },
      warning: { text: "CẢNH BÁO", color: "bg-yellow-500" },
      info: { text: "THÔNG TIN", color: "bg-blue-500" },
      success: { text: "AN TOÀN", color: "bg-green-500" },
    };
    return badges[level] || badges.info;
  };

  const openPopup = (day) => {
    setSelectedDay(day);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDay(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-8 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
            <span>Dự báo Thời tiết</span>
          </h1>
          <p className="text-cyan-100 text-lg">
            Cập nhật thời tiết và cảnh báo bệnh hại
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Khu vực
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-3 border-2 border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc} {loc === "Cần Thơ" ? "" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số ngày dự báo
              </label>
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value={3}>3 ngày</option>
                <option value={5}>5 ngày</option>
                <option value={7}>7 ngày</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchWeatherData}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition font-medium"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-lg">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("forecast")}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === "forecast"
                  ? "bg-sky-500 text-white"
                  : "bg-white text-gray-600 hover:bg-sky-50"
              }`}
            >
              🌤️ Dự báo thời tiết
            </button>
            {/* <button
              onClick={() => setActiveTab("alerts")}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === "alerts"
                  ? "bg-sky-500 text-white"
                  : "bg-white text-gray-600 hover:bg-sky-50"
              }`}
            >
              ⚠️ Cảnh báo bệnh hại
            </button> */}
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === "stats"
                  ? "bg-sky-500 text-white"
                  : "bg-white text-gray-600 hover:bg-sky-50"
              }`}
            >
              📊 Thống kê
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-xl shadow-lg p-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto"></div>
              <p className="text-gray-500 mt-4 text-lg">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-xl mb-4">❌ {error}</p>
              <button
                onClick={fetchWeatherData}
                className="bg-sky-500 text-white py-3 px-6 rounded-lg hover:bg-sky-600 transition font-medium"
              >
                Thử lại
              </button>
            </div>
          ) : weatherData.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌤️</div>
              <p className="text-gray-500 text-xl">
                Chưa có dự báo cho khu vực này
              </p>
            </div>
          ) : (
            <>
              {/* Forecast Tab */}
              {activeTab === "forecast" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {weatherData.map((day, index) => {
                    // Kiểm tra xem có cảnh báo thực sự không (không phải success)
                    const hasRealAlerts =
                      day.diseaseAlerts &&
                      day.diseaseAlerts.length > 0 &&
                      day.diseaseAlerts.some(
                        (alert) =>
                          alert.level !== "success" && alert.level !== "info"
                      );

                    return (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-sky-200"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-600 font-medium">
                              {formatFullDate(day.date)}
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
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="text-gray-600 font-medium">
                              🌡️ Nhiệt độ
                            </span>
                            <span className="text-sky-700 font-bold text-lg">
                              {day.temperature}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="text-gray-600 font-medium">
                              💧 Độ ẩm
                            </span>
                            <span className="text-sky-700 font-bold text-lg">
                              {day.humidity}
                            </span>
                          </div>
                          <div className="p-3 bg-white rounded-lg">
                            <span className="text-gray-600 font-medium">
                              ☁️ Tình hình
                            </span>
                            <p className="text-sky-700 font-semibold mt-1">
                              {day.condition}
                            </p>
                          </div>
                        </div>

                        {/* Disease Alerts Preview - CHỈ HIỆN KHI CÓ CẢNH BÁO THỰC SỰ */}
                        {hasRealAlerts && (
                          <div className="mt-4 pt-4 border-t border-sky-200">
                            <p className="text-sm font-semibold text-red-600 mb-2">
                              ⚠️ Có{" "}
                              {
                                day.diseaseAlerts.filter(
                                  (a) => a.level !== "success"
                                ).length
                              }{" "}
                              cảnh báo
                            </p>
                            <button
                              onClick={() => openPopup(day)}
                              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition text-sm font-medium"
                            >
                              Xem chi tiết →
                            </button>
                          </div>
                        )}

                        {/* Success Status - Hiện khi không có cảnh báo nguy hiểm */}
                        {!hasRealAlerts &&
                          day.diseaseAlerts &&
                          day.diseaseAlerts.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-green-200">
                              <p className="text-sm font-semibold text-green-600 flex items-center gap-2">
                                <span>✅</span>
                                <span>Thời tiết thuận lợi</span>
                              </p>
                              <button
                                onClick={() => openPopup(day)}
                                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition text-sm font-medium"
                              >
                                Xem chi tiết →
                              </button>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Alerts Tab - DANH SÁCH CÁC NGÀY CÓ CẢNH BÁO */}
              {/* {activeTab === "alerts" && (
                <div className="space-y-4">
                  {weatherData.filter((day) => day.diseaseAlerts?.length > 0)
                    .length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4">✅</div>
                      <p className="text-gray-500 text-xl">
                        Không có cảnh báo bệnh hại nào
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Thời tiết thuận lợi cho cây trồng
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {weatherData
                        .filter((day) => day.diseaseAlerts?.length > 0)
                        .map((day, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 shadow-md border-l-4 border-red-500 hover:shadow-xl transition cursor-pointer"
                            onClick={() => openPopup(day)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                  {formatDate(day.date)}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {day.location}
                                </p>
                              </div>
                              <div className="text-4xl">
                                {getWeatherIcon(day.condition)}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-3 text-sm">
                              <span className="text-gray-600">
                                🌡️ {day.temperature}
                              </span>
                              <span className="text-gray-600">
                                💧 {day.humidity}
                              </span>
                              <span className="text-gray-600">
                                ☁️ {day.condition}
                              </span>
                            </div>

                            <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3">
                              <p className="text-sm font-semibold text-red-700 mb-2">
                                ⚠️ {day.diseaseAlerts.length} cảnh báo bệnh hại
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {day.diseaseAlerts
                                  .slice(0, 3)
                                  .map((alert, idx) => {
                                    const isOldFormat =
                                      typeof alert === "string";
                                    const level = isOldFormat
                                      ? "info"
                                      : alert.level;
                                    const disease = isOldFormat
                                      ? "Thông tin"
                                      : alert.disease;
                                    const badge = getAlertBadge(level);

                                    return (
                                      <span
                                        key={idx}
                                        className={`${badge.color} text-white text-xs px-2 py-1 rounded`}
                                      >
                                        {disease}
                                      </span>
                                    );
                                  })}
                                {day.diseaseAlerts.length > 3 && (
                                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                                    +{day.diseaseAlerts.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition text-sm font-medium">
                              Xem chi tiết →
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )} */}

              {/* Stats Tab */}
              {activeTab === "stats" && weatherStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 shadow-md text-center">
                    <div className="text-4xl mb-3">📅</div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      Tổng số ngày
                    </p>
                    <p className="text-3xl font-bold text-sky-700">
                      {weatherStats.totalDays}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 shadow-md text-center">
                    <div className="text-4xl mb-3">🌧️</div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      Ngày có mưa
                    </p>
                    <p className="text-3xl font-bold text-cyan-700">
                      {weatherStats.rainyDays}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 shadow-md text-center">
                    <div className="text-4xl mb-3">☀️</div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      Ngày nắng
                    </p>
                    <p className="text-3xl font-bold text-amber-700">
                      {weatherStats.sunnyDays}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 shadow-md text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      Ngày có cảnh báo
                    </p>
                    <p className="text-3xl font-bold text-red-700">
                      {weatherStats.highRiskDays}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md text-center md:col-span-2">
                    <div className="text-4xl mb-3">💧</div>
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      Độ ẩm trung bình
                    </p>
                    <p className="text-3xl font-bold text-green-700">
                      {weatherStats.avgHumidity}%
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-md md:col-span-2">
                    <h4 className="text-lg font-bold text-purple-700 mb-3">
                      Phân tích
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        • Tỷ lệ mưa:{" "}
                        <span className="font-semibold">
                          {Math.round(
                            (weatherStats.rainyDays / weatherStats.totalDays) *
                              100
                          )}
                          %
                        </span>
                      </p>
                      <p className="text-gray-700">
                        • Nguy cơ có mưa:{" "}
                        <span
                          className={`font-semibold ${
                            weatherStats.highRiskDays > 3
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {weatherStats.highRiskDays > 3 ? "Cao" : "Thấp"}
                        </span>
                      </p>
                      <p className="text-gray-700">
                        • Khuyến nghị:{" "}
                        {weatherStats.rainyDays > weatherStats.sunnyDays
                          ? "Tăng cường thoát nước, phun phòng bệnh"
                          : "Tưới nước đều, theo dõi sâu hại"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* POPUP CHI TIẾT CẢNH BÁO */}
      {showPopup && selectedDay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-6xl">
                    {getWeatherIcon(selectedDay.condition)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">
                      {formatFullDate(selectedDay.date)}
                    </h2>
                    <p className="text-cyan-100">{selectedDay.location}</p>
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

            {/* Popup Content */}
            <div className="p-6">
              {/* Weather Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-sky-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🌡️</div>
                  <div className="text-sm text-gray-600 mb-1">Nhiệt độ</div>
                  <div className="text-xl font-bold text-sky-700">
                    {selectedDay.temperature}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">💧</div>
                  <div className="text-sm text-gray-600 mb-1">Độ ẩm</div>
                  <div className="text-xl font-bold text-blue-700">
                    {selectedDay.humidity}
                  </div>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">💨</div>
                  <div className="text-sm text-gray-600 mb-1">Gió</div>
                  <div className="text-xl font-bold text-cyan-700">
                    {selectedDay.windSpeed || "N/A"}
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🌧️</div>
                  <div className="text-sm text-gray-600 mb-1">Mưa</div>
                  <div className="text-xl font-bold text-indigo-700">
                    {selectedDay.rainfall || "0"} mm
                  </div>
                </div>
              </div>

              {/* Disease Alerts */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  {/* <span>🩺</span> */}
                  <span>Cảnh báo bệnh hại chi tiết</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDay.diseaseAlerts.map((alert, idx) => {
                    const isOldFormat = typeof alert === "string";
                    const level = isOldFormat ? "info" : alert.level;
                    const disease = isOldFormat ? "Thông tin" : alert.disease;
                    const message = isOldFormat ? alert : alert.message;
                    const action = isOldFormat ? "" : alert.action;
                    const badge = getAlertBadge(level);

                    return (
                      <div
                        key={idx}
                        className={`${getAlertStyle(
                          level
                        )} rounded-xl p-5 hover:shadow-lg transition`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl flex-shrink-0 mt-1">
                            {getAlertIcon(level)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span
                                className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full`}
                              >
                                {badge.text}
                              </span>
                              <span className="font-bold text-lg text-gray-800">
                                {disease}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3 leading-relaxed">
                              {message}
                            </p>
                            {action && (
                              <div className="bg-white bg-opacity-70 rounded-lg p-3 border-l-4 border-gray-400">
                                <p className="text-sm text-gray-800">
                                  <span className="font-semibold">
                                    Hành động:
                                  </span>
                                  <br />
                                  {action}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={closePopup}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-8 rounded-lg hover:shadow-lg transition font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-6 shadow-lg mt-8">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 mb-4 font-medium">Khám phá thêm:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/sustainable-methods"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition font-medium"
            >
              Thông tin Bệnh Lúa
            </Link>
            <Link
              to="/chatbot"
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition font-medium"
            >
              Chatbot Tư vấn
            </Link>
            <Link
              to="/"
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition font-medium"
            >
              Trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherForecast;
