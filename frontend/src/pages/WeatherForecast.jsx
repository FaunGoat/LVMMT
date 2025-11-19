import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function WeatherForecast() {
  const [weatherData, setWeatherData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [weatherStats, setWeatherStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(7);
  const [activeTab, setActiveTab] = useState("forecast"); // forecast, alerts, stats

  // Fetch danh sách locations
  useEffect(() => {
    fetchLocations();
  }, []);

  // Fetch weather data khi location hoặc days thay đổi
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
        setLocations(data.data);
        if (data.data.length > 0) {
          setSelectedLocation(data.data[0]);
        }
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

  // Format ngày
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
    }/${date.getFullYear()}`;
  };

  // Icon thời tiết
  const getWeatherIcon = (condition) => {
    const cond = condition.toLowerCase();
    if (cond.includes("mưa") && cond.includes("lớn")) return "🌧️";
    if (cond.includes("mưa")) return "🌦️";
    if (cond.includes("nắng")) return "☀️";
    if (cond.includes("nhiều mây")) return "☁️";
    if (cond.includes("bão")) return "🌪️";
    return "🌤️";
  };

  // Alert level color
  const getAlertColor = (alert) => {
    if (alert.includes("ĐỎ")) return "bg-red-100 border-red-500 text-red-800";
    if (alert.includes("VÀNG"))
      return "bg-yellow-100 border-yellow-500 text-yellow-800";
    if (alert.includes("CAM"))
      return "bg-orange-100 border-orange-500 text-orange-800";
    if (alert.includes("XANH"))
      return "bg-green-100 border-green-500 text-green-800";
    return "bg-blue-100 border-blue-500 text-blue-800";
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
            Cập nhật thời tiết và cảnh báo bệnh hại cho nông dân
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location Filter */}
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
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Days Filter */}
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

            {/* Refresh Button */}
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
              Dự báo thời tiết
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === "alerts"
                  ? "bg-sky-500 text-white"
                  : "bg-white text-gray-600 hover:bg-sky-50"
              }`}
            >
              Cảnh báo bệnh hại
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === "stats"
                  ? "bg-sky-500 text-white"
                  : "bg-white text-gray-600 hover:bg-sky-50"
              }`}
            >
              Thống kê
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
              <p className="text-red-500 text-xl mb-4">{error}</p>
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
                  {weatherData.map((day, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-sky-200"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            {formatDate(day.date)}
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
                            Nhiệt độ
                          </span>
                          <span className="text-sky-700 font-bold text-lg">
                            {day.temperature}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-gray-600 font-medium">
                            Độ ẩm
                          </span>
                          <span className="text-sky-700 font-bold text-lg">
                            {day.humidity}
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <span className="text-gray-600 font-medium">
                            Tình hình
                          </span>
                          <p className="text-sky-700 font-semibold mt-1">
                            {day.condition}
                          </p>
                        </div>
                      </div>

                      {/* Disease Alerts Preview */}
                      {day.diseaseAlerts && day.diseaseAlerts.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-sky-200">
                          <p className="text-sm font-semibold text-red-600 mb-2">
                            Có {day.diseaseAlerts.length} cảnh báo
                          </p>
                          <button
                            onClick={() => setActiveTab("alerts")}
                            className="text-xs text-sky-600 hover:text-sky-800 underline"
                          >
                            Xem chi tiết →
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Alerts Tab */}
              {activeTab === "alerts" && (
                <div className="space-y-6">
                  {weatherData.map(
                    (day, index) =>
                      day.diseaseAlerts &&
                      day.diseaseAlerts.length > 0 && (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 shadow-md border-l-4 border-red-500"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                {formatDate(day.date)}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {day.location} - {day.condition}
                              </p>
                            </div>
                            <div className="text-4xl">
                              {getWeatherIcon(day.condition)}
                            </div>
                          </div>

                          <div className="space-y-3">
                            {day.diseaseAlerts.map((alert, idx) => (
                              <div
                                key={idx}
                                className={`p-4 rounded-lg border-l-4 ${getAlertColor(
                                  alert
                                )}`}
                              >
                                <p className="font-medium">{alert}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              )}

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
                      Phân tích xu hướng
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        • Tỷ lệ ngày mưa:{" "}
                        <span className="font-semibold">
                          {Math.round(
                            (weatherStats.rainyDays / weatherStats.totalDays) *
                              100
                          )}
                          %
                        </span>
                      </p>
                      <p className="text-gray-700">
                        • Nguy cơ bệnh hại:{" "}
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

      {/* Footer Navigation */}
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
