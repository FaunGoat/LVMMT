// frontend/src/pages/AdminDisease.jsx
import React, { useState, useEffect } from "react";
import { useAdmin } from "./AdminLogin";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaImage,
  FaTimes,
  FaDownload,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AdminDisease() {
  const navigate = useNavigate();
  const { token } = useAdmin();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    scientificName: "",
    commonName: "",
    description: "",
    type: "Bệnh nấm",
    severityRisk: "Cao",
    economicLoss: "",
  });

  // Fetch diseases
  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/diseases?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setDiseases(data.data);
        setTotalPages(data.pages);
      } else {
        setError(data.error || "Lỗi khi tải dữ liệu");
      }
    } catch (err) {
      console.error("Error fetching diseases:", err);
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, [page, search]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  // ✅ TẠO CÁC DISEASE DETAIL MẶC ĐỊNH
  // ✅ TẠO CÁC DISEASE DETAIL MẶC ĐỊNH - CÓ VALIDATION
  const createDefaultDiseaseDetails = async (diseaseId) => {
    try {
      const defaultData = {
        stages: {
          stages: [],
          totalDuration: "Chưa cập nhật",
          peakStage: 1,
          incubationPeriod: "Chưa cập nhật",
          notes: "",
        },
        seasons: {
          seasons: [],
          criticalPeriods: [],
          regionalVariations: [],
          climateImpact: "Chưa cập nhật",
        },
        causes: {
          pathogen: {
            type: "Nấm", // ✅ KHÔNG ĐƯỢC RỖNG - BẮT BUỘC
            scientificName: "Chưa cập nhật",
            commonName: "",
            spreadMethod: [],
          },
          environmentalFactors: [],
          cropFactors: [],
          soilFactors: [],
          managementFactors: [],
          predisposingFactors: [],
          resistanceFactors: [],
        },
        symptoms: {
          symptoms: [],
          diagnosticChecklist: [],
          similarDiseases: [],
          laboratoryTests: [],
          notes: "",
        },
        treatments: {
          treatments: [],
          integratedPestManagement: {
            strategy: "Chưa cập nhật",
            decisionThreshold: "",
            monitoringSchedule: "",
            actionPlan: [],
          },
          organicAlternatives: [],
          emergencyProtocol: {
            immediateActions: [],
            supportContacts: [],
            reportingProcedure: "",
          },
          resistanceManagement: "Chưa cập nhật",
          postTreatmentCare: [],
          successIndicators: [],
          failureReasons: [],
          costBenefitAnalysis: {
            treatmentCost: "",
            expectedYieldLoss: "",
            netBenefit: "",
          },
        },
        prevention: {
          culturalPractices: [],
          varietySelection: [],
          seedTreatment: [],
          soilManagement: [],
          waterManagement: [],
          nutritionManagement: [],
          sanitationPractices: [],
          cropRotation: {
            recommendedCrops: [],
            rotationCycle: "Chưa cập nhật",
            benefits: [],
            considerations: [],
          },
          biologicalControl: [],
          monitoringSchedule: [],
          earlyWarningSystem: {
            indicators: [],
            monitoringTools: [],
            alertThresholds: "Chưa cập nhật",
            responseProtocol: [],
          },
          quarantineMeasures: [],
          farmHygiene: [],
          preventiveSchedule: {
            preSeasonPreparation: [],
            earlySeasonActions: [],
            midSeasonActions: [],
            lateSeasonActions: [],
            postHarvestActions: [],
          },
          costEffectiveness: {
            totalPreventionCost: "Chưa cập nhật",
            potentialLossPrevented: "Chưa cập nhật",
            returnOnInvestment: "Chưa cập nhật",
          },
        },
        weatherCorrelation: {
          weatherTriggers: [],
          forecastAlerts: [],
          weatherPatterns: [],
          microclimateFactors: [],
          climateChangeProjections: {
            shortTerm: "Chưa cập nhật",
            longTerm: "Chưa cập nhật",
            adaptationStrategies: [],
          },
          historicalOutbreaks: [],
          regionalWeatherImpact: [],
          realTimeMonitoring: {
            dataSource: [],
            updateFrequency: "Chưa cập nhật",
            alertSystem: "Chưa cập nhật",
            decisionSupport: "Chưa cập nhật",
          },
        },
      };

      const endpoints = [
        { key: "stages", url: `/stages` },
        { key: "seasons", url: `/seasons` },
        { key: "causes", url: `/causes` },
        { key: "symptoms", url: `/symptoms` },
        { key: "treatments", url: `/treatments` },
        { key: "prevention", url: `/prevention` },
        { key: "weatherCorrelation", url: `/weather-correlation` },
      ];

      // Gửi request tạo tất cả disease details song song
      const createPromises = endpoints.map((endpoint) =>
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}${endpoint.url}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(defaultData[endpoint.key]),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (!data.success) {
              console.warn(`Lỗi tạo ${endpoint.key}:`, data.error);
            }
            return data;
          })
          .catch((err) => {
            console.error(`Error creating ${endpoint.key}:`, err);
            return { success: false, error: err.message };
          })
      );

      const results = await Promise.all(createPromises);
      const allSuccess = results.every((r) => r.success === true);

      return allSuccess;
    } catch (err) {
      console.error("Error creating disease details:", err);
      return false;
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.scientificName) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      newImages.forEach((img) => {
        formDataToSend.append("images", img);
      });

      const isCreating = !editingId;
      const url = editingId
        ? `http://localhost:5000/api/admin/diseases/${editingId}`
        : "http://localhost:5000/api/admin/diseases";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        // ✅ NẾU TẠO MỚI -> TẠO DEFAULT DISEASE DETAILS
        if (isCreating) {
          const detailsCreated = await createDefaultDiseaseDetails(
            data.data._id
          );

          if (detailsCreated) {
            setSuccess(`Tạo bệnh thành công!`);
          } else {
            setSuccess(
              `Tạo bệnh thành công nhưng lỗi khi khởi tạo chi tiết.`
            );
          }
        } else {
          setSuccess("Cập nhật bệnh thành công");
        }

        // Tắt form sau 1.5 giây
        setTimeout(() => {
          closeForm();
          fetchDiseases();
        }, 1500);
      } else {
        setError(data.error || "Lỗi không xác định");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Lỗi khi lưu dữ liệu");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit disease
  const handleEdit = (disease) => {
    setFormData(disease);
    setImages(disease.images || []);
    setEditingId(disease._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete disease
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bệnh này?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/diseases/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Xóa bệnh thành công");
        fetchDiseases();
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Lỗi khi xóa bệnh");
    }
  };

  // Delete image
  const handleDeleteImage = async (diseaseId, imageUrl) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa ảnh này?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/diseases/${diseaseId}/images/${encodeURIComponent(
          imageUrl
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Xóa ảnh thành công");
        setImages(images.filter((img) => img.url !== imageUrl));
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Lỗi khi xóa ảnh");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      scientificName: "",
      commonName: "",
      description: "",
      type: "Bệnh nấm",
      severityRisk: "Cao",
      economicLoss: "",
    });
    setNewImages([]);
    setImages([]);
    setError("");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-green-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Danh sách bệnh lúa
            </h2>
            <p className="text-lg text-gray-600">
              Quản lý thông tin chi tiết về các bệnh hại lúa
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 transition font-bold hover:shadow-lg active:scale-95"
          >
            <FaPlus className="text-2xl" />
            <span>Thêm Bệnh Mới</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-xl">
          <p className="text-red-700 font-bold text-lg">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-5 bg-green-50 border-l-4 border-green-500 rounded-xl">
          <p className="text-green-700 font-bold text-lg">{success}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-md p-3">
        <div className="flex gap-4 items-center">
          <FaSearch className="text-gray-400 text-2xl" />
          <input
            type="text"
            placeholder="Tìm kiếm bệnh..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 outline-none py-2"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto"></div>
            <p className="text-gray-500 mt-4 text-xl font-semibold">
              Đang tải...
            </p>
          </div>
        ) : diseases.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-xl">Không tìm thấy bệnh nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-300">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-bold text-gray-800">
                    Tên Bệnh
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-bold text-gray-800">
                    Tên Khoa Học
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-bold text-gray-800">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-bold text-gray-800">
                    Độ Nguy Hiểm
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-bold text-gray-800">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {diseases.map((disease, idx) => (
                  <tr
                    key={disease._id}
                    className={`border-b-2 transition ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-6 py-5 text-base">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          {disease.name}
                        </p>
                        {disease.commonName && (
                          <p className="text-sm text-gray-600 mt-1">
                            {disease.commonName}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-base text-gray-700">
                      <span className="font-mono bg-gray-100 px-3 py-1 rounded text-base">
                        {disease.scientificName}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-base">
                      <span className="bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-base font-semibold">
                        {disease.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-base">
                      <span
                        className={`px-4 py-2 rounded-full text-base font-bold ${
                          disease.severityRisk === "Rất cao"
                            ? "bg-red-100 text-red-900"
                            : disease.severityRisk === "Cao"
                            ? "bg-orange-100 text-orange-900"
                            : "bg-yellow-100 text-yellow-900"
                        }`}
                      >
                        {disease.severityRisk}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-base flex gap-3">
                      <button
                        onClick={() => handleEdit(disease)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition font-bold text-base"
                      >
                        <FaEdit className="text-lg" />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDelete(disease._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition font-bold text-base"
                      >
                        <FaTrash className="text-lg" />
                        <span>Xóa</span>
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/diseases/${disease._id}`)
                        }
                        className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition font-bold text-base"
                      >
                        <FaArrowRight className="text-lg" />
                        <span>Chi Tiết</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-6 border-t-2 border-gray-200 flex gap-3 justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-5 py-2 rounded-lg font-bold text-lg transition ${
                  page === p
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 sticky top-0 z-10 flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                {editingId ? "Sửa Bệnh" : "Thêm Bệnh Mới"}
              </h2>
              <button
                onClick={closeForm}
                disabled={isSubmitting}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded transition text-3xl disabled:opacity-50"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-xl font-bold text-gray-800 mb-2">
                  Tên Bệnh
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="VD: Bệnh đạo ôn"
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 text-lg"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Scientific Name */}
              <div>
                <label className="block text-xl font-bold text-gray-800 mb-2">
                  Tên Khoa Học
                </label>
                <input
                  type="text"
                  name="scientificName"
                  value={formData.scientificName}
                  onChange={handleChange}
                  placeholder="VD: Pyricularia oryzae"
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 text-lg"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Common Name */}
              <div>
                <label className="block text-xl font-bold text-gray-800 mb-2">
                  Tên Gọi Khác
                </label>
                <input
                  type="text"
                  name="commonName"
                  value={formData.commonName}
                  onChange={handleChange}
                  placeholder="VD: Bệnh cháy lá"
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 text-lg"
                  disabled={isSubmitting}
                />
              </div>

              {/* Type & Severity */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xl font-bold text-gray-800 mb-2">
                    Loại Bệnh
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 text-lg"
                    required
                    disabled={isSubmitting}
                  >
                    <option>Bệnh nấm</option>
                    <option>Sâu hại</option>
                    <option>Bệnh vi khuẩn</option>
                    <option>Bệnh virus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xl font-bold text-gray-800 mb-2">
                    Độ Nguy Hiểm
                  </label>
                  <select
                    name="severityRisk"
                    value={formData.severityRisk}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 text-lg"
                    required
                    disabled={isSubmitting}
                  >
                    <option>Rất cao</option>
                    <option>Cao</option>
                    <option>Trung bình</option>
                    <option>Thấp</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xl font-bold text-gray-800 mb-2">
                  Mô Tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả về bệnh..."
                  rows="4"
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 text-lg"
                  disabled={isSubmitting}
                />
              </div>

              {/* Economic Loss */}
              <div>
                <label className="block text-xl font-bold text-gray-800 mb-2">
                  Thiệt Hại Kinh Tế
                </label>
                <input
                  type="text"
                  name="economicLoss"
                  value={formData.economicLoss}
                  onChange={handleChange}
                  placeholder="VD: 20-50% năng suất"
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 text-lg"
                  disabled={isSubmitting}
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-xl font-bold text-gray-800 mb-3">
                  <FaImage className="inline mr-2 text-2xl" />
                  Ảnh Bệnh
                </label>

                {images.length > 0 && (
                  <div className="mb-6">
                    <p className="text-lg text-gray-700 font-semibold mb-3">
                      Ảnh Hiện Tại:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img.url}
                            alt="Disease"
                            className="w-full h-32 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteImage(editingId, img.url)
                            }
                            disabled={isSubmitting}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition text-xl disabled:opacity-50"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageInput"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="imageInput"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <FaDownload className="text-5xl text-gray-400" />
                    <span className="text-xl text-gray-700 font-semibold">
                      Kéo thả hoặc click để chọn ảnh
                    </span>
                  </label>
                  {newImages.length > 0 && (
                    <div className="mt-4 text-lg text-green-600 font-bold">
                      Chọn {newImages.length} ảnh
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-xl transition hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : editingId ? (
                    "Cập Nhật"
                  ) : (
                    "Thêm Mới"
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-4 rounded-xl font-bold text-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDisease;
