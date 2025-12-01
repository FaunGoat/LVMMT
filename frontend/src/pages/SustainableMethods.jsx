import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "@react-icons/all-files/fa/FaBars";
import { FaTimes as FaTimesIcon } from "@react-icons/all-files/fa/FaTimes";
import WeatherPopup from "../components/Common/WeatherPopup";
import { useLocation } from "react-router-dom";
import placeholderImage from "../assets/images/placeholder.jpg";

import DiseaseStages from "../components/Disease/DiseaseStages";
import DiseaseSeasons from "../components/Disease/DiseaseSeasons";
import DiseaseCauses from "../components/Disease/DiseaseCauses";
import DiseaseSymptomsDetail from "../components/Disease/DiseaseSymptomsDetail";
import DiseaseTreatments from "../components/Disease/DiseaseTreatments";
import DiseasePrevention from "../components/Disease/DiseasePrevention";
import DiseaseWeatherCorrelation from "../components/Disease/DiseaseWeatherCorrelation";

function SustainableMethods() {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [diseaseDetails, setDiseaseDetails] = useState(null); // ✅ THÊM STATE MỚI
  const [loadingDetails, setLoadingDetails] = useState(false); // ✅ THÊM STATE MỚI
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeSection, setActiveSection] = useState("images");
  const location = useLocation();

  // Refs cho các section
  const imagesRef = useRef(null);
  const riskRef = useRef(null);
  const descriptionRef = useRef(null);
  const stagesRef = useRef(null); // ✅ THAY ĐỔI
  const seasonsRef = useRef(null); // ✅ THAY ĐỔI
  const causesRef = useRef(null);
  const symptomsRef = useRef(null);
  const weatherRef = useRef(null);
  const preventionRef = useRef(null);
  const treatmentsRef = useRef(null);

  useEffect(() => {
    fetchDiseases();
  }, []);

  // Theo dõi scroll để highlight section hiện tại
  useEffect(() => {
    if (selectedDisease?._id) {
      fetchDiseaseDetails(selectedDisease._id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedDisease]);

  useEffect(() => {
    // Parse query parameter từ URL
    const params = new URLSearchParams(location.search);
    const diseaseId = params.get("id");

    if (diseaseId && diseases.length > 0) {
      // Tìm bệnh theo ID
      const disease = diseases.find((d) => d._id === diseaseId);
      if (disease) {
        setSelectedDisease(disease);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [location.search, diseases]);

  const fetchDiseaseDetails = async (diseaseId) => {
    try {
      setLoadingDetails(true);
      const response = await fetch(
        `http://localhost:5000/api/diseases/${diseaseId}/full`
      );

      if (!response.ok) {
        throw new Error("Không thể tải chi tiết bệnh");
      }

      const data = await response.json();

      if (data.success) {
        setDiseaseDetails(data.data);
      }
    } catch (err) {
      console.error("Error fetching disease details:", err);
      // Không set error để không ảnh hưởng UX, chỉ log
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/diseases");

      if (!response.ok) {
        throw new Error("Không thể tải danh sách bệnh lúa");
      }

      const data = await response.json();

      if (data.success) {
        // ✅ KHÔNG CẦN getImageUrls - Lấy URL trực tiếp từ database
        // Database đã có sẵn URL từ Cloudinary
        const diseasesWithImages = data.data.map((disease) => ({
          ...disease,
          // Nếu images có path cũ (local), chuyển sang url
          // Nếu images đã có url (Cloudinary), giữ nguyên
          images:
            disease.images?.map((img) => ({
              url: img.url || img.path || placeholderImage,
              caption: img.caption || "",
              alt: img.alt || disease.name,
            })) || [],
        }));

        setDiseases(diseasesWithImages);
        if (diseasesWithImages.length > 0) {
          setSelectedDisease(diseasesWithImages[0]);
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
        // ✅ Lấy URL trực tiếp từ database
        const diseasesWithImages = data.data.map((disease) => ({
          ...disease,
          images:
            disease.images?.map((img) => ({
              url: img.url || img.path || placeholderImage,
              caption: img.caption || "",
              alt: img.alt || disease.name,
            })) || [],
        }));

        setDiseases(diseasesWithImages);
        if (diseasesWithImages.length > 0) {
          setSelectedDisease(diseasesWithImages[0]);
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

  // Scroll đến section
  const scrollToSection = (ref) => {
    if (ref.current) {
      const offsetTop = ref.current.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Table of Contents items
  const tocItems = [
    { id: "images", label: "Hình ảnh minh họa", ref: imagesRef },
    { id: "risk", label: "Mức độ nguy hiểm", ref: riskRef },
    { id: "description", label: "Mô tả", ref: descriptionRef },
    { id: "stages", label: "Giai đoạn phát triển", ref: stagesRef },
    { id: "seasons", label: "Mùa vụ", ref: seasonsRef },
    { id: "causes", label: "Nguyên nhân", ref: causesRef },
    { id: "symptoms", label: "Triệu chứng", ref: symptomsRef },
    { id: "weather", label: "Yếu tố môi trường", ref: weatherRef },
    { id: "prevention", label: "Phòng ngừa", ref: preventionRef },
    { id: "treatments", label: "Phương pháp điều trị", ref: treatmentsRef },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const tocItems = [
        { id: "images", label: "Hình ảnh minh họa", ref: imagesRef },
        { id: "risk", label: "Mức độ nguy hiểm", ref: riskRef },
        { id: "description", label: "Mô tả", ref: descriptionRef },
        { id: "stages", label: "Giai đoạn phát triển", ref: stagesRef },
        { id: "seasons", label: "Mùa vụ", ref: seasonsRef },
        { id: "causes", label: "Nguyên nhân", ref: causesRef },
        { id: "symptoms", label: "Triệu chứng", ref: symptomsRef },
        { id: "weather", label: "Yếu tố môi trường", ref: weatherRef },
        { id: "prevention", label: "Phòng ngừa", ref: preventionRef },
        { id: "treatments", label: "Phương pháp điều trị", ref: treatmentsRef },
      ];

      const scrollPosition = window.scrollY + 150;

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const section = tocItems[i];
        if (section.ref.current) {
          const top = section.ref.current.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedDisease]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-100">
      <WeatherPopup />

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 shadow-lg relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-6 top-8 text-white hover:text-gray-200 focus:outline-none transition z-50"
        >
          {isSidebarOpen ? <FaTimesIcon size={24} /> : <FaBars size={24} />}
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Thông tin Bệnh Lúa</h1>
          <p className="text-sky-100">
            Hướng dẫn nhận biết và phòng trừ bệnh hại
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex" style={{ minHeight: "calc(100vh - 160px)" }}>
        {/* Left Sidebar - Disease List */}
        <div
          className={`bg-white shadow-xl overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? "w-80" : "w-0"
          }`}
          style={{ height: "calc(100vh - 160px)", position: "sticky", top: 0 }}
        >
          {isSidebarOpen && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-sky-700 mb-4">
                Danh sách bệnh
              </h3>

              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                  placeholder="Tìm kiếm bệnh..."
                  className="w-full p-3 border-2 border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="w-full mt-2 bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition font-medium"
                >
                  Tìm kiếm
                </button>
              </div>

              {/* Disease List */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mx-auto"></div>
                  <p className="text-gray-500 mt-3">Đang tải...</p>
                </div>
              ) : error ? (
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-red-500 mb-2">{error}</p>
                  <button
                    onClick={fetchDiseases}
                    className="text-sm text-red-600 underline hover:text-red-800"
                  >
                    Thử lại
                  </button>
                </div>
              ) : diseases.length === 0 ? (
                <p className="text-center text-gray-500 p-4">
                  Không tìm thấy bệnh nào
                </p>
              ) : (
                <div className="space-y-2">
                  {diseases.map((disease) => (
                    <button
                      key={disease._id}
                      onClick={() => {
                        setSelectedDisease(disease);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                        selectedDisease?._id === disease._id
                          ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transform scale-105"
                          : "bg-sky-50 hover:bg-sky-100 text-gray-700"
                      }`}
                    >
                      <p className="font-semibold">{disease.name}</p>
                      <p
                        className={`text-xs mt-1 ${
                          selectedDisease?._id === disease._id
                            ? "text-sky-100"
                            : "text-gray-500"
                        }`}
                      >
                        {disease.scientificName}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-6">
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto"></div>
                  <p className="text-gray-500 mt-4 text-lg">
                    Đang tải thông tin...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-lg p-8">
                  <p className="text-red-500 text-xl mb-4">❌ {error}</p>
                  <button
                    onClick={fetchDiseases}
                    className="bg-sky-500 text-white py-3 px-6 rounded-lg hover:bg-sky-600 transition font-medium"
                  >
                    Thử lại
                  </button>
                </div>
              ) : selectedDisease ? (
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-8">
                    <h2 className="text-4xl font-bold mb-3">
                      {selectedDisease.name}
                    </h2>
                    <p className="text-sky-100 text-lg">
                      <span className="font-medium">Tên khoa học:</span>{" "}
                      <em>{selectedDisease.scientificName}</em>
                    </p>
                    {selectedDisease.commonName && (
                      <p className="text-sky-100">
                        <span className="font-medium">Tên gọi khác:</span>{" "}
                        {selectedDisease.commonName}
                      </p>
                    )}
                  </div>

                  <div className="p-8">
                    {/* Images Gallery */}
                    <div ref={imagesRef} className="mb-8 scroll-mt-24">
                      {selectedDisease.images &&
                        selectedDisease.images.length > 0 && (
                          <>
                            <h3 className="text-2xl font-bold text-sky-700 mb-4 flex items-center gap-2">
                              <span>Hình ảnh minh họa</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedDisease.images.map((image, idx) => (
                                <div
                                  key={idx}
                                  className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                                  onClick={() => setSelectedImage(image)}
                                >
                                  <img
                                    src={image.url}
                                    alt={image.alt || selectedDisease.name}
                                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                      e.target.src = placeholderImage;
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="absolute bottom-4 left-4 right-4 text-white font-medium">
                                      {image.caption}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                    </div>

                    {/* Risk Level */}
                    <div
                      ref={riskRef}
                      className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl shadow-md scroll-mt-24"
                    >
                      <h3 className="text-2xl font-bold text-red-700 mb-3 flex items-center gap-2">
                        <span>Mức độ nguy hiểm</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-700">
                            <span className="font-semibold">
                              Độ nghiêm trọng:
                            </span>{" "}
                            <span
                              className={`font-bold text-lg ${
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
                        </div>
                        <div>
                          <p className="text-gray-700">
                            <span className="font-semibold">
                              Thiệt hại kinh tế:
                            </span>{" "}
                            <span className="text-red-600 font-semibold">
                              {selectedDisease.economicLoss}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedDisease.description && (
                      <div
                        ref={descriptionRef}
                        className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border-l-4 border-sky-500 scroll-mt-24"
                      >
                        <h3 className="text-2xl font-bold text-sky-700 mb-3 flex items-center gap-2">
                          <span>Mô tả</span>
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedDisease.description}
                        </p>
                      </div>
                    )}

                    {loadingDetails ? (
                      <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
                        <p className="text-gray-500 mt-3">
                          Đang tải chi tiết...
                        </p>
                      </div>
                    ) : diseaseDetails ? (
                      <>
                        {/* Stages */}
                        <div ref={stagesRef} className="scroll-mt-24">
                          <DiseaseStages stages={diseaseDetails.stages} />
                        </div>

                        {/* Seasons */}
                        <div ref={seasonsRef} className="scroll-mt-24">
                          <DiseaseSeasons seasons={diseaseDetails.seasons} />
                        </div>

                        {/* Causes */}
                        <div ref={causesRef} className="scroll-mt-24">
                          <DiseaseCauses causes={diseaseDetails.causes} />
                        </div>

                        {/* Symptoms Detail */}
                        <div ref={symptomsRef} className="scroll-mt-24">
                          <DiseaseSymptomsDetail
                            symptoms={diseaseDetails.symptoms}
                          />
                        </div>

                        {/* Weather Correlation */}
                        <div ref={weatherRef} className="scroll-mt-24">
                          <DiseaseWeatherCorrelation
                            weatherCorrelation={
                              diseaseDetails.weatherCorrelation
                            }
                          />
                        </div>

                        {/* Prevention */}
                        <div ref={preventionRef} className="scroll-mt-24">
                          <DiseasePrevention
                            prevention={diseaseDetails.prevention}
                          />
                        </div>

                        {/* Treatments */}
                        <div ref={treatmentsRef} className="scroll-mt-24">
                          <DiseaseTreatments
                            treatments={diseaseDetails.treatments}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500">
                          Không có thông tin chi tiết cho bệnh này
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-500 text-xl">
                    Vui lòng chọn một bệnh từ danh sách
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Table of Contents */}
          {selectedDisease && !loading && !error && (
            <div
              className="w-72 bg-white shadow-xl p-6 overflow-y-auto hidden lg:block"
              style={{
                height: "calc(100vh - 160px)",
                position: "sticky",
                top: 0,
              }}
            >
              <h3 className="text-lg font-bold text-sky-700 mb-4 flex items-center gap-2">
                <span>Mục lục</span>
              </h3>
              <nav className="space-y-2">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.ref)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md transform scale-105"
                        : "hover:bg-sky-50 text-gray-700"
                    }`}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">
                  Thao tác nhanh
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="w-full bg-sky-100 text-sky-700 py-2 px-3 rounded-lg hover:bg-sky-200 transition text-sm font-medium"
                  >
                    ⬆️ Lên đầu trang
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="w-full h-auto"
            />
            <div className="p-4 bg-gray-50">
              <p className="text-gray-700 font-medium">
                {selectedImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="bg-white border-t border-gray-200 p-6 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 mb-4 font-medium">Khám phá thêm:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/chatbot"
              className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2"
            >
              <span>Chatbot Tư vấn</span>
            </Link>
            <Link
              to="/weather-forecast"
              className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2"
            >
              <span>Dự báo Thời tiết</span>
            </Link>
            <Link
              to="/"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2"
            >
              <span>Trang chủ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SustainableMethods;
