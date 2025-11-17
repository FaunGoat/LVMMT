import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import pic from "./../assets/logo.png";
import { FaBars } from "@react-icons/all-files/fa/FaBars";
import { FaTimes as FaTimesIcon } from "@react-icons/all-files/fa/FaTimes";

function SustainableMethods() {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Lấy danh sách bệnh từ backend
  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/diseases");

      if (!response.ok) {
        throw new Error("Không thể tải danh sách bệnh lúa");
      }

      const data = await response.json();

      if (data.success) {
        setDiseases(data.data);
        // Chọn bệnh đầu tiên làm mặc định
        if (data.data.length > 0) {
          setSelectedDisease(data.data[0]);
        }
      } else {
        throw new Error(data.error || "Lỗi không xác định");
      }
    } catch (err) {
      console.error("Error fetching diseases:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm bệnh
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      fetchDiseases();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/diseases/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );

      if (!response.ok) {
        throw new Error("Không thể tìm kiếm");
      }

      const data = await response.json();

      if (data.success) {
        setDiseases(data.data);
        if (data.data.length > 0) {
          setSelectedDisease(data.data[0]);
        } else {
          setSelectedDisease(null);
        }
      }
    } catch (err) {
      console.error("Error searching diseases:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị phương pháp điều trị
  const renderTreatment = (treatment) => {
    return (
      <div key={treatment.type} className="mb-4 p-4 bg-sky-50 rounded-lg">
        <h4 className="font-semibold text-sky-700 mb-2">
          {treatment.type === "Hóa học" && "💊 Phương pháp Hóa học"}
          {treatment.type === "Sinh học" && "🌱 Phương pháp Sinh học"}
          {treatment.type === "Canh tác" && "🚜 Biện pháp Canh tác"}
        </h4>

        {treatment.drugs && treatment.drugs.length > 0 && (
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700">
              Thuốc/Biện pháp:
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              {treatment.drugs.map((drug, idx) => (
                <li key={idx} className="text-sm">
                  {drug}
                </li>
              ))}
            </ul>
          </div>
        )}

        {treatment.methods && treatment.methods.length > 0 && (
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700">
              Các bước thực hiện:
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              {treatment.methods.map((method, idx) => (
                <li key={idx} className="text-sm">
                  {method}
                </li>
              ))}
            </ul>
          </div>
        )}

        {treatment.dosage && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Liều lượng:</span> {treatment.dosage}
          </p>
        )}

        {treatment.notes && (
          <p className="text-sm text-amber-700 italic mt-2">
            ⚠️ Lưu ý: {treatment.notes}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sky-200">
      {/* Header with Toggle Button */}
      <div className="bg-sky-200 text-sky-800 p-4 text-center relative">
        <p className="text-lg font-bold">
          Thông tin bệnh lúa và phương pháp phòng trừ hiệu quả
        </p>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-4 top-8 text-black hover:text-gray-500 focus:outline-none"
        >
          {isSidebarOpen ? <FaTimesIcon size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex h-screen">
        {/* Left Sidebar - Menu */}
        <div
          className={`bg-sky-100 p-4 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? "w-1/5" : "w-0 p-0"
          }`}
        >
          {isSidebarOpen && (
            <>
              <h3 className="text-lg font-semibold text-sky-800 mb-4">
                Danh sách bệnh lúa
              </h3>

              {/* Search Box */}
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                  placeholder="Tìm kiếm bệnh..."
                  className="w-full p-2 border border-sky-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  onClick={handleSearch}
                  className="w-full mt-2 bg-sky-500 text-white py-1 px-3 rounded hover:bg-sky-600 transition"
                >
                  Tìm kiếm
                </button>
              </div>

              {loading ? (
                <p className="text-center text-gray-500">Đang tải...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : diseases.length === 0 ? (
                <p className="text-center text-gray-500">
                  Không tìm thấy bệnh nào
                </p>
              ) : (
                diseases.map((disease) => (
                  <button
                    key={disease._id}
                    onClick={() => setSelectedDisease(disease)}
                    className={`w-full text-left p-2 mb-2 rounded transition ${
                      selectedDisease?._id === disease._id
                        ? "bg-sky-500 text-white"
                        : "hover:bg-sky-200"
                    }`}
                  >
                    {disease.name}
                  </button>
                ))
              )}
            </>
          )}
        </div>

        {/* Right Content */}
        <div
          className={`bg-white p-6 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? "w-4/5" : "w-full"
          }`}
        >
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-500">Đang tải thông tin...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchDiseases}
                className="bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 transition"
              >
                Thử lại
              </button>
            </div>
          ) : selectedDisease ? (
            <>
              {/* Tiêu đề bệnh */}
              <div className="mb-6">
                <h2 className="text-4xl font-bold text-sky-700 mb-2 text-center">
                  {selectedDisease.name}
                </h2>
                <p className="text-gray-600">
                  <span className="font-medium">Tên khoa học:</span>{" "}
                  <em>{selectedDisease.scientificName}</em>
                </p>
                {selectedDisease.commonName && (
                  <p className="text-gray-600">
                    <span className="font-medium">Tên tiếng Anh:</span>{" "}
                    {selectedDisease.commonName}
                  </p>
                )}
              </div>

              {/* Mức độ nguy hiểm */}
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-gray-700">
                  <span className="font-medium">Mức độ nguy hiểm:</span>{" "}
                  <span
                    className={`font-bold ${
                      selectedDisease.severityRisk === "Rất cao"
                        ? "text-red-600"
                        : selectedDisease.severityRisk === "Cao"
                        ? "text-orange-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {selectedDisease.severityRisk}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Thiệt hại kinh tế:</span>{" "}
                  {selectedDisease.economicLoss}
                </p>
              </div>

              {/* Nguyên nhân */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-sky-700 mb-2">
                  🔍 Nguyên nhân
                </h3>
                <p className="text-gray-700">{selectedDisease.causes}</p>
              </div>

              {/* Triệu chứng */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-sky-700 mb-2">
                  🩺 Triệu chứng
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedDisease.symptoms.map((symptom, idx) => (
                    <li key={idx} className="text-gray-700">
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Điều kiện thời tiết */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-sky-700 mb-2">
                  🌦️ Điều kiện thời tiết thuận lợi cho bệnh
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedDisease.weatherTriggers.map((trigger, idx) => (
                    <li key={idx} className="text-gray-700">
                      {trigger}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phương pháp điều trị */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-sky-700 mb-3">
                  💊 Phương pháp điều trị
                </h3>
                {selectedDisease.treatments.map((treatment) =>
                  renderTreatment(treatment)
                )}
              </div>

              {/* Phòng ngừa theo thời tiết */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  🛡️ Phòng ngừa theo thời tiết
                </h3>
                <p className="text-gray-700">
                  {selectedDisease.weatherPrevention}
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-20">
              Vui lòng chọn một bệnh từ danh sách bên trái
            </p>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-4 text-center bg-sky-100">
        <p className="text-gray-600 mb-2">Khám phá thêm:</p>
        <div className="flex justify-center gap-4">
          <Link
            to="/chatbot"
            className="bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition"
          >
            Chatbot Tư vấn
          </Link>
          <Link
            to="/weather-forecast"
            className="bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition"
          >
            Dự báo Thời tiết
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SustainableMethods;
