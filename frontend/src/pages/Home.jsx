import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GSTSVTX from "./../assets/GSTSVTX.jpeg";
import pic from "./../assets/logo.png";
import bgImage from "./../assets/bg-caylua12.jpg";
import WeatherPopup from "../components/Common/WeatherPopup";
import { getImageUrls } from "../utils/imageHelper";

function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [weatherAlert, setWeatherAlert] = useState(null);
  const [setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch featured items
      const featuredRes = await fetch(
        "http://localhost:5000/api/home/featured"
      );
      const featuredData = await featuredRes.json();
      if (featuredData.success) {
        // Convert image paths to URLs
        const itemsWithImages = featuredData.data.map((item) => ({
          ...item,
          images: getImageUrls(item.images),
        }));
        setFeaturedItems(itemsWithImages);
      }

      // Fetch weather alert
      const alertRes = await fetch(
        "http://localhost:5000/api/home/weather-alert"
      );
      const alertData = await alertRes.json();
      if (alertData.success) {
        setWeatherAlert(alertData.data);
      }

      // Fetch stats
      const statsRes = await fetch("http://localhost:5000/api/home/stats");
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-200">
      {/* Weather Popup */}
      <WeatherPopup />

      {/* Hero Section */}
      <div
        className="relative py-16 bg-cover bg-center min-h-[400px] text-white"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-6xl text-cyan-200 font-bold mt-16 mb-10">
            Chatbot Bảo Vệ Cây Lúa
          </h1>
          <Link
            to="/chatbot"
            className="bg-white text-sky-700 font-semibold text-xl py-2 px-4 rounded-lg hover:bg-sky-100 transition relative z-10"
          >
            Bắt đầu chat
          </Link>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div className="container mx-auto py-10 px-4">
        <h2 className="text-2xl font-semibold text-center mb-8 text-sky-800">
          Thông Tin Nổi Bật
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-red-700 font-semibold">{error}</p>
                <button
                  onClick={fetchHomeData}
                  className="text-red-600 underline text-sm mt-1 hover:text-red-800"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-md animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <h3 className="text-xl font-medium text-sky-700 mb-2">
                  {item.title}
                </h3>
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]?.url || pic}
                    alt={item.images[0]?.alt || item.title}
                    className="w-full h-[400px] object-cover rounded-lg mb-4 hover:opacity-90 transition"
                    onError={(e) => {
                      e.target.src = pic;
                    }}
                  />
                ) : (
                  <div className="w-full h-[400px] bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-6xl">🌾</div>
                  </div>
                )}
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Link
                  to={item.link}
                  className="text-sky-500 hover:text-sky-700 underline font-medium inline-flex items-center gap-2"
                >
                  Xem thêm
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">
              Chưa có thông tin nổi bật nào
            </p>
          </div>
        )}
      </div>

      {/* Professor Quote Section */}
      <div className="container mx-auto py-10 border-t border-b border-emerald-900 mb-8 px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-2/3 p-6 bg-sky-100 border border-sky-300 rounded-lg shadow-md">
            <p className="text-lg text-gray-700 italic leading-relaxed">
              "Cần làm sao cho bà con nông dân trở thành những người nông dân
              mới, những nhà khoa học, biết áp dụng kỹ thuật sinh học trong việc
              trồng trọt. Bên cạnh đó, phải làm sao để liên kết giữa nông dân và
              doanh nghiệp ngày càng chặt chẽ..."
            </p>
            <p className="mt-4 text-sky-800 font-semibold text-right">
              - GS. TS. Võ Tòng Xuân
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <img
              src={GSTSVTX}
              alt="GS. TS. Võ Tòng Xuân"
              className="w-full max-w-sm object-cover rounded-lg shadow-md hover:shadow-xl transition"
            />
          </div>
        </div>
      </div>

      {/* Recent Weather Alerts Section */}
      {weatherAlert && (
        <div className="container mx-auto mb-8 px-4">
          <h3 className="text-xl font-semibold text-sky-800 mb-4 text-center">
            Cảnh báo Thời tiết Gần đây
          </h3>
          <div
            className={`p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl ${
              weatherAlert.hasAlert
                ? "bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500"
                : "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl flex-shrink-0">
                {weatherAlert.hasAlert ? "⚠️" : "✅"}
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium mb-2">
                  {weatherAlert.message}
                </p>
                {weatherAlert.location && (
                  <p className="text-sm text-gray-600 mb-1">
                    📍 Khu vực: {weatherAlert.location}
                  </p>
                )}
                {weatherAlert.condition && (
                  <p className="text-sm text-gray-600 mb-1">
                    ☁️ Thời tiết: {weatherAlert.condition}
                  </p>
                )}
                <p className="text-sm text-gray-600 mb-3">
                  🕐 Cập nhật: {weatherAlert.date}
                </p>
                <Link
                  to="/weather-forecast"
                  className="inline-block bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition text-sm font-medium"
                >
                  Xem chi tiết dự báo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links Section */}
      <div className="container mx-auto text-center py-10 bg-white rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-semibold mb-6 text-sky-800">
          Khám Phá Thêm
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/sustainable-methods"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition font-medium transform hover:scale-105"
          >
            Biện pháp Bảo vệ
          </Link>
          <Link
            to="/weather-forecast"
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition font-medium transform hover:scale-105"
          >
            Dự báo Thời tiết
          </Link>
          <Link
            to="/chatbot"
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition font-medium transform hover:scale-105"
          >
            Chatbot Tư vấn
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
