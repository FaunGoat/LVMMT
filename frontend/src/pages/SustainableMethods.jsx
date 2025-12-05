import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FaTimes as FaTimesIcon } from "react-icons/fa";
import WeatherPopup from "../components/Common/WeatherPopup";
import { useLocation } from "react-router-dom";
import placeholderImage from "../assets/images/placeholder.jpg";

import DiseaseFilter from "../components/Disease/DiseaseFilter";
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
  const [filterType, setFilterType] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterSeason, setFilterSeason] = useState("all");
  const [filterStage, setFilterStage] = useState("all");
  const [filterPart, setFilterPart] = useState("all");
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
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

  // useEffect(() => {
  //   if (
  //     filterType !== "all" ||
  //     filterRisk !== "all" ||
  //     filterSeason !== "all" ||
  //     filterStage !== "all" ||
  //     filterPart !== "all"
  //   ) {
  //     handleSearch();
  //   }
  // }, [filterType, filterRisk, filterSeason, filterStage, filterPart]);

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
    if (e) e.preventDefault();

    // Reset logic: Nếu không có gì để lọc thì load all
    const isAllFiltersDefault =
      filterType === "all" &&
      filterRisk === "all" &&
      filterSeason === "all" &&
      filterStage === "all" &&
      filterPart === "all";

    if (!searchQuery.trim() && isAllFiltersDefault) {
      fetchDiseases();
      return;
    }

    setIsFilterPopupOpen(false);

    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Append params cơ bản
      if (searchQuery.trim()) params.append("query", searchQuery.trim());
      if (filterType !== "all") params.append("type", filterType);
      if (filterRisk !== "all") params.append("severityRisk", filterRisk);

      // ✅ Append params mới
      if (filterSeason !== "all") params.append("season", filterSeason);
      if (filterStage !== "all") params.append("cropStage", filterStage);
      if (filterPart !== "all") params.append("symptomPart", filterPart);

      const response = await fetch(
        `http://localhost:5000/api/diseases/search?${params.toString()}`
      );

      // ... (Phần xử lý response giữ nguyên như code trước)
      if (!response.ok) throw new Error("Không thể tìm kiếm");
      const data = await response.json();
      if (data.success) {
        // Map images logic...
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
        if (diseasesWithImages.length > 0)
          setSelectedDisease(diseasesWithImages[0]);
        else setSelectedDisease(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterType("all");
    setFilterRisk("all");
    setFilterSeason("all");
    setFilterStage("all");
    setFilterPart("all");
    setSearchQuery("");
    setIsFilterPopupOpen(false); // ✅ Đóng popup
    fetchDiseases();
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
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 shadow-lg relative">
        {/* <button
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
            setIsFilterPopupOpen(false);
          }}
          className="absolute left-6 top-16 text-white hover:text-gray-200 focus:outline-none transition z-50"
        >
          {isSidebarOpen ? <FaTimesIcon size={24} /> : <FaBars size={24} />}
        </button> */}
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
          style={{
            height: "calc(100vh - 160px)",
            position: "sticky",
            top: "110px",
            left: 0,
            zIndex: 30,
          }}
        >
          {!isSidebarOpen && (
            <button
              onClick={() => {
                setIsSidebarOpen(true); // Mở Sidebar
                // Không cần đóng popup vì nó đã ẩn cùng sidebar rồi
              }}
              // Đặt nó ở vị trí tương đương với vị trí cũ (hoặc vị trí dễ truy cập)
              className="fixed left-0 top-[115px] text-sky-600 bg-white p-3 rounded-r-full shadow-lg hover:bg-sky-50 transition z-40"
            >
              <FaBars size={24} />
            </button>
          )}
          {isSidebarOpen && (
            <div className="p-6 relative">
              <button
                onClick={() => {
                  setIsSidebarOpen(false); // Luôn đóng Sidebar
                  setIsFilterPopupOpen(false); // Luôn đóng Filter Popup
                }}
                // Đặt nút ở góc trên bên phải của sidebar
                className="absolute top-0 right-0 p-3 text-gray-500 hover:text-red-500 focus:outline-none transition z-50"
              >
                <FaTimesIcon size={24} />
              </button>
              <h3 className="text-2xl font-bold text-sky-700 mb-4">
                Danh sách Bệnh
              </h3>

              {/* KHU VỰC TÌM KIẾM & FILTER */}
              <div className="mb-6 space-y-3">
                {/* Input Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
                    placeholder="Tìm kiếm bệnh (vd: dao on)..."
                    className="w-full p-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                  />
                </div>

                {/* Nút Tìm kiếm chính và Nút mở Popup */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="flex-1 bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition font-medium text-sm flex justify-center items-center gap-2"
                  >
                    <span>Tìm kiếm</span>
                  </button>
                  <button
                    onClick={() => setIsFilterPopupOpen(true)} // Mở Popup
                    className="px-4 py-2 bg-blue-100 text-sky-700 rounded-lg hover:bg-blue-200 transition font-medium text-sm"
                  >
                    Bộ lọc
                  </button>
                </div>
              </div>
              {/* KẾT THÚC KHU VỰC TÌM KIẾM & FILTER */}

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
                <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p>Không tìm thấy bệnh phù hợp.</p>
                  <button
                    onClick={clearFilters}
                    className="text-sky-500 text-sm mt-2 underline"
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
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
                      <div className="flex justify-between items-start">
                        <p className="font-semibold">{disease.name}</p>
                      </div>
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
            <div className="max-w-7xl mx-auto p-4 pt-2">
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
                top: "110px",
                right: 0,
                zIndex: 20,
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
      {/* ✅ RENDER COMPONENT FILTER MODAL MỚI */}
      <DiseaseFilter
        isFilterPopupOpen={isFilterPopupOpen}
        setIsFilterPopupOpen={setIsFilterPopupOpen}
        filterType={filterType}
        setFilterType={setFilterType}
        filterRisk={filterRisk}
        setFilterRisk={setFilterRisk}
        filterSeason={filterSeason}
        setFilterSeason={setFilterSeason}
        filterStage={filterStage}
        setFilterStage={setFilterStage}
        filterPart={filterPart}
        setFilterPart={setFilterPart}
        handleSearch={handleSearch}
        clearFilters={clearFilters}
      />
    </div>
  );
}

export default SustainableMethods;
