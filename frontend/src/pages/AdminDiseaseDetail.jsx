// frontend/src/pages/AdminDiseaseDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "./AdminLogin";
import { FaArrowLeft, FaSave } from "react-icons/fa";

function AdminDiseaseDetail() {
  const { diseaseId } = useParams();
  const navigate = useNavigate();
  const { token } = useAdmin();

  const [activeTab, setActiveTab] = useState("stages");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // Data states
  const [stagesData, setStagesData] = useState(null);
  const [seasonsData, setSeasonsData] = useState(null);
  const [causesData, setCausesData] = useState(null);
  const [symptomsData, setSymptomsData] = useState(null);
  const [treatmentsData, setTreatmentsData] = useState(null);
  const [preventionData, setPreventionData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [
        stages,
        seasons,
        causes,
        symptoms,
        treatments,
        prevention,
        weather,
      ] = await Promise.all([
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/stages`,
          {
            headers,
          }
        ).then((r) => r.json()),
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/seasons`,
          {
            headers,
          }
        ).then((r) => r.json()),
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/causes`,
          {
            headers,
          }
        ).then((r) => r.json()),
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/symptoms`,
          {
            headers,
          }
        ).then((r) => r.json()),
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/treatments`,
          {
            headers,
          }
        ).then((r) => r.json()),
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/prevention`,
          {
            headers,
          }
        ).then((r) => r.json()),
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/weather-correlation`,
          { headers }
        ).then((r) => r.json()),
      ]);

      setStagesData(stages.data);
      setSeasonsData(seasons.data);
      setCausesData(causes.data);
      setSymptomsData(symptoms.data);
      setTreatmentsData(treatments.data);
      setPreventionData(prevention.data);
      setWeatherData(weather.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [diseaseId]);

  // Save handlers
  const handleSaveStages = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/disease-details/${diseaseId}/stages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(stagesData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess("Lưu giai đoạn thành công");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSeasons = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/disease-details/${diseaseId}/seasons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(seasonsData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess("Lưu mùa vụ thành công");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCauses = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/disease-details/${diseaseId}/causes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(causesData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess("Lưu nguyên nhân thành công");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSymptoms = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/disease-details/${diseaseId}/symptoms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(symptomsData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess("Lưu triệu chứng thành công");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTreatments = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/disease-details/${diseaseId}/treatments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(treatmentsData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess("Lưu phương pháp điều trị thành công");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrevention = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/disease-details/${diseaseId}/prevention`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(preventionData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess("Lưu biện pháp phòng ngừa thành công");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWeather = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/disease-details/${diseaseId}/weather-correlation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(weatherData),
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccess("Lưu thông tin thời tiết thành công");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/diseases")}
            className="hover:bg-gray-100 p-2 rounded transition"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Chi tiết Bệnh Lúa
          </h1>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 font-medium">❌ {error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-700 font-medium">✅ {success}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
          <div className="flex border-b">
            {[
              { id: "stages", label: "Giai Đoạn" },
              { id: "seasons", label: "Mùa Vụ" },
              { id: "causes", label: "Nguyên Nhân" },
              { id: "symptoms", label: "Triệu Chứng" },
              { id: "treatments", label: "Điều Trị" },
              { id: "prevention", label: "Phòng Ngừa" },
              { id: "weather", label: "Thời Tiết" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-green-500 text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        {/* STAGES TAB */}
        {activeTab === "stages" && stagesData && (
          <DiseaseStagesEditor
            data={stagesData}
            setData={setStagesData}
            onSave={handleSaveStages}
            saving={saving}
          />
        )}

        {/* SEASONS TAB */}
        {activeTab === "seasons" && seasonsData && (
          <DiseaseSeasonsEditor
            data={seasonsData}
            setData={setSeasonsData}
            onSave={handleSaveSeasons}
            saving={saving}
          />
        )}

        {/* CAUSES TAB */}
        {activeTab === "causes" && causesData && (
          <DiseaseCausesEditor
            data={causesData}
            setData={setCausesData}
            onSave={handleSaveCauses}
            saving={saving}
          />
        )}

        {/* SYMPTOMS TAB */}
        {activeTab === "symptoms" && symptomsData && (
          <DiseaseSymptomsEditor
            data={symptomsData}
            setData={setSymptomsData}
            onSave={handleSaveSymptoms}
            saving={saving}
          />
        )}

        {/* TREATMENTS TAB */}
        {activeTab === "treatments" && treatmentsData && (
          <DiseaseTreatmentsEditor
            data={treatmentsData}
            setData={setTreatmentsData}
            onSave={handleSaveTreatments}
            saving={saving}
          />
        )}

        {/* PREVENTION TAB */}
        {activeTab === "prevention" && preventionData && (
          <DiseasePreventionEditor
            data={preventionData}
            setData={setPreventionData}
            onSave={handleSavePrevention}
            saving={saving}
          />
        )}

        {/* WEATHER TAB */}
        {activeTab === "weather" && weatherData && (
          <DiseaseWeatherEditor
            data={weatherData}
            setData={setWeatherData}
            onSave={handleSaveWeather}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}

const DiseaseStagesEditor = ({ data, setData, onSave, saving }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">Giai Đoạn Phát Triển Bệnh</h2>

    <div className="space-y-4 mb-6">
      <div>
        <label className="block text-sm font-semibold mb-1">
          Tổng thời gian
        </label>
        <input
          type="text"
          value={data?.totalDuration || ""}
          onChange={(e) => setData({ ...data, totalDuration: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="VD: 25-30 ngày"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Giai đoạn nguy hiểm nhất
          </label>
          <input
            type="number"
            value={data?.peakStage || ""}
            onChange={(e) =>
              setData({ ...data, peakStage: parseInt(e.target.value) })
            }
            className="w-full p-2 border rounded"
            placeholder="Số thứ tự giai đoạn"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Thời gian ủ bệnh
          </label>
          <input
            type="text"
            value={data?.incubationPeriod || ""}
            onChange={(e) =>
              setData({ ...data, incubationPeriod: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="VD: 2-3 ngày"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Ghi chú</label>
        <textarea
          value={data?.notes || ""}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          rows="3"
          className="w-full p-2 border rounded"
          placeholder="Ghi chú thêm về giai đoạn phát triển"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Các giai đoạn
        </label>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data?.stages?.map((stage, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded border">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Số thứ tự"
                  value={stage.order}
                  onChange={(e) => {
                    const newStages = [...data.stages];
                    newStages[idx].order = parseInt(e.target.value);
                    setData({ ...data, stages: newStages });
                  }}
                  className="p-1 border rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Tên giai đoạn"
                  value={stage.name}
                  onChange={(e) => {
                    const newStages = [...data.stages];
                    newStages[idx].name = e.target.value;
                    setData({ ...data, stages: newStages });
                  }}
                  className="p-1 border rounded text-sm"
                />
              </div>
              <textarea
                placeholder="Mô tả giai đoạn"
                value={stage.description}
                onChange={(e) => {
                  const newStages = [...data.stages];
                  newStages[idx].description = e.target.value;
                  setData({ ...data, stages: newStages });
                }}
                rows="2"
                className="w-full p-1 border rounded text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>

    <button
      onClick={onSave}
      disabled={saving}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50 flex items-center gap-2"
    >
      <FaSave />
      {saving ? "Đang lưu..." : "Lưu dữ liệu"}
    </button>
  </div>
);

const DiseaseSeasonsEditor = ({ data, setData, onSave, saving }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Mùa Vụ & Giai Đoạn Cây Trồng</h2>

    {/* Seasons */}
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2">
        Mùa vụ
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {data?.seasons?.map((season, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded border">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mùa vụ
                </label>
                <select
                  value={season.type}
                  onChange={(e) => {
                    const newSeasons = [...data.seasons];
                    newSeasons[idx].type = e.target.value;
                    setData({ ...data, seasons: newSeasons });
                  }}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option>Đông Xuân</option>
                  <option>Hè Thu</option>
                  <option>Cả Năm</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mức độ rủi ro
                </label>
                <select
                  value={season.riskLevel}
                  onChange={(e) => {
                    const newSeasons = [...data.seasons];
                    newSeasons[idx].riskLevel = e.target.value;
                    setData({ ...data, seasons: newSeasons });
                  }}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option>Rất cao</option>
                  <option>Cao</option>
                  <option>Trung bình</option>
                  <option>Thấp</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tháng bắt đầu
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={season.startMonth}
                  onChange={(e) => {
                    const newSeasons = [...data.seasons];
                    newSeasons[idx].startMonth = parseInt(e.target.value);
                    setData({ ...data, seasons: newSeasons });
                  }}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tháng kết thúc
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={season.endMonth}
                  onChange={(e) => {
                    const newSeasons = [...data.seasons];
                    newSeasons[idx].endMonth = parseInt(e.target.value);
                    setData({ ...data, seasons: newSeasons });
                  }}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={season.description}
                onChange={(e) => {
                  const newSeasons = [...data.seasons];
                  newSeasons[idx].description = e.target.value;
                  setData({ ...data, seasons: newSeasons });
                }}
                rows="2"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Critical Periods */}
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2">
        Giai đoạn cây trồng nhạy cảm
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {data?.criticalPeriods?.map((period, idx) => (
          <div
            key={idx}
            className="p-4 bg-blue-50 rounded border border-blue-200"
          >
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Giai đoạn
                </label>
                <input
                  type="text"
                  value={period.cropStage}
                  onChange={(e) => {
                    const newPeriods = [...data.criticalPeriods];
                    newPeriods[idx].cropStage = e.target.value;
                    setData({ ...data, criticalPeriods: newPeriods });
                  }}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Đẻ nhánh, Trổ bông"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mức độ rủi ro
                </label>
                <select
                  value={period.riskLevel}
                  onChange={(e) => {
                    const newPeriods = [...data.criticalPeriods];
                    newPeriods[idx].riskLevel = e.target.value;
                    setData({ ...data, criticalPeriods: newPeriods });
                  }}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option>Rất cao</option>
                  <option>Cao</option>
                  <option>Trung bình</option>
                  <option>Thấp</option>
                </select>
              </div>
            </div>
            <textarea
              value={period.description}
              onChange={(e) => {
                const newPeriods = [...data.criticalPeriods];
                newPeriods[idx].description = e.target.value;
                setData({ ...data, criticalPeriods: newPeriods });
              }}
              rows="2"
              className="w-full p-2 border rounded text-sm"
              placeholder="Mô tả giai đoạn nhạy cảm"
            />
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={onSave}
      disabled={saving}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50 flex items-center gap-2"
    >
      <FaSave />
      {saving ? "Đang lưu..." : "Lưu dữ liệu"}
    </button>
  </div>
);

const DiseaseCausesEditor = ({ data, setData, onSave, saving }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Nguyên Nhân Gây Bệnh</h2>

    {/* Pathogen */}
    <div className="mb-6 p-4 bg-white rounded border">
      <h3 className="text-lg font-bold mb-3">Mầm bệnh</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Loại mầm bệnh/côn trùng
          </label>
          <input
            type="text"
            value={data?.pathogen?.type || ""}
            onChange={(e) =>
              setData({
                ...data,
                pathogen: { ...data.pathogen, type: e.target.value },
              })
            }
            className="w-full p-2 border rounded text-sm"
            placeholder="Nấm / Vi khuẩn / Virus"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Tên khoa học
          </label>
          <input
            type="text"
            value={data?.pathogen?.scientificName || ""}
            onChange={(e) =>
              setData({
                ...data,
                pathogen: { ...data.pathogen, scientificName: e.target.value },
              })
            }
            className="w-full p-2 border rounded text-sm"
          />
        </div>
      </div>
      <div className="mt-3">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Phương thức lây lan (cách nhau bằng dấu phẩy)
        </label>
        <input
          type="text"
          value={(data?.pathogen?.spreadMethod || []).join(", ")}
          onChange={(e) =>
            setData({
              ...data,
              pathogen: {
                ...data.pathogen,
                spreadMethod: e.target.value.split(",").map((s) => s.trim()),
              },
            })
          }
          className="w-full p-2 border rounded text-sm"
          placeholder="Gió, Nước, Côn trùng"
        />
      </div>
    </div>
    <button
      onClick={onSave}
      disabled={saving}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50 flex items-center gap-2"
    >
      <FaSave />
      {saving ? "Đang lưu..." : "Lưu dữ liệu"}
    </button>
  </div>
);

const DiseaseSymptomsEditor = ({ data, setData, onSave, saving }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Triệu Chứng</h2>

    <div className="mb-6 p-4 rounded border">
      <h3 className="text-lg font-bold mb-3">Danh sách triệu chứng</h3>
      <div className="space-y-4 max-h-128 overflow-y-auto">
        {data?.symptoms?.map((symptom, idx) => (
          <div key={idx} className="p-3 bg-white rounded border">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Bộ phận
                </label>
                <select
                  value={symptom.part}
                  onChange={(e) => {
                    const newSymptoms = [...data.symptoms];
                    newSymptoms[idx].part = e.target.value;
                    setData({ ...data, symptoms: newSymptoms });
                  }}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option>Lá</option>
                  <option>Thân</option>
                  <option>Bông</option>
                  <option>Hạt</option>
                  <option>Rễ</option>
                  <option>Toàn cây</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mức độ
                </label>
                <select
                  value={symptom.severity}
                  onChange={(e) => {
                    const newSymptoms = [...data.symptoms];
                    newSymptoms[idx].severity = e.target.value;
                    setData({ ...data, symptoms: newSymptoms });
                  }}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option>Nhẹ</option>
                  <option>Trung bình</option>
                  <option>Nặng</option>
                  <option>Rất nặng</option>
                </select>
              </div>
            </div>
            <textarea
              value={symptom.description}
              onChange={(e) => {
                const newSymptoms = [...data.symptoms];
                newSymptoms[idx].description = e.target.value;
                setData({ ...data, symptoms: newSymptoms });
              }}
              rows="2"
              className="w-full p-2 border rounded text-sm"
              placeholder="Mô tả triệu chứng"
            />
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={onSave}
      disabled={saving}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50 flex items-center gap-2"
    >
      <FaSave />
      {saving ? "Đang lưu..." : "Lưu dữ liệu"}
    </button>
  </div>
);

const DiseaseTreatmentsEditor = ({ data, setData, onSave, saving }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Phương Pháp Điều Trị</h2>

    <div className="space-y-4 mb-6">
      {data?.treatments?.map((treatment, idx) => (
        <div key={idx} className="p-4 rounded border">
          <label className="block font-semibold text-gray-700 mb-1">
            Phương pháp
          </label>
          <div className="flex justify-between items-center mb-3">
            {/* <h3 className="font-bold">{treatment.type}</h3> */}
            <select
              value={treatment.type}
              onChange={(e) => {
                const newTreatments = [...data.treatments];
                newTreatments[idx].type = parseInt(e.target.value);
                setData({ ...data, treatments: newTreatments });
              }}
              className="p-1 border rounded text-sm"
            >
              <option>Hóa học</option>
              <option>Sinh học</option>
              <option>Canh tác</option>
            </select>
            <select
              value={treatment.priority}
              onChange={(e) => {
                const newTreatments = [...data.treatments];
                newTreatments[idx].priority = parseInt(e.target.value);
                setData({ ...data, treatments: newTreatments });
              }}
              className="p-1 border rounded text-sm"
            >
              <option value="1">Ưu tiên 1</option>
              <option value="2">Ưu tiên 2</option>
              <option value="3">Ưu tiên 3</option>
              <option value="4">Ưu tiên 4</option>
              <option value="5">Ưu tiên 5</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tên thuốc/Phương pháp
            </label>
            <textarea
              value={
                treatment.methods
                  ?.map((m) => `${m.name} - ${m.dosage}`)
                  .join("\n") || ""
              }
              onChange={(e) => {
                const newTreatments = [...data.treatments];
                newTreatments[idx].methods = e.target.value
                  .split("\n")
                  .map((line) => {
                    const [name, dosage] = line.split(" - ");
                    return {
                      name: name?.trim() || "",
                      dosage: dosage?.trim() || "",
                    };
                  });
                setData({ ...data, treatments: newTreatments });
              }}
              rows="3"
              className="w-full p-2 border rounded text-sm"
              placeholder="Tên thuốc - Liều lượng"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Lưu ý
            </label>
            <textarea
              value={treatment.notes || ""}
              onChange={(e) => {
                const newTreatments = [...data.treatments];
                newTreatments[idx].notes = e.target.value;
                setData({ ...data, treatments: newTreatments });
              }}
              rows="2"
              className="w-full p-2 border rounded text-sm"
              placeholder="Ghi chú thêm về phương pháp"
            />
          </div>
        </div>
      ))}
    </div>
    <button
      onClick={onSave}
      disabled={saving}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50 flex items-center gap-2"
    >
      <FaSave />
      {saving ? "Đang lưu..." : "Lưu dữ liệu"}
    </button>
  </div>
);

const DiseasePreventionEditor = ({ data, setData, onSave, saving }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Biện Pháp Phòng Ngừa</h2>

    {/* Cultural Practices */}
    <div className="mb-6 p-4 bg-green-50 rounded border">
      <h3 className="font-bold text-green-800 mb-3">Canh tác</h3>
      <div className="space-y-3">
        {data?.culturalPractices?.map((practice, idx) => (
          <div key={idx} className="p-3 bg-white rounded border">
            <input
              type="text"
              value={practice.practice}
              onChange={(e) => {
                const newPractices = [...data.culturalPractices];
                newPractices[idx].practice = e.target.value;
                setData({ ...data, culturalPractices: newPractices });
              }}
              className="w-full p-2 border rounded text-sm mb-2"
              placeholder="Tên biện pháp"
            />
            <textarea
              value={practice.description}
              onChange={(e) => {
                const newPractices = [...data.culturalPractices];
                newPractices[idx].description = e.target.value;
                setData({ ...data, culturalPractices: newPractices });
              }}
              rows="2"
              className="w-full p-2 border rounded text-sm"
              placeholder="Mô tả biện pháp"
            />
          </div>
        ))}
      </div>
    </div>

    {/* Variety Selection */}
    <div className="mb-6 p-4 bg-blue-50 rounded border">
      <h3 className="font-bold text-blue-800 mb-3">Giống lúa kháng bệnh</h3>
      <div className="space-y-3">
        {data?.varietySelection?.map((variety, idx) => (
          <div key={idx} className="p-3 bg-white rounded border">
            <input
              type="text"
              value={variety.varietyName}
              onChange={(e) => {
                const newVarieties = [...data.varietySelection];
                newVarieties[idx].varietyName = e.target.value;
                setData({ ...data, varietySelection: newVarieties });
              }}
              className="w-full p-2 border rounded text-sm mb-2"
              placeholder="Tên giống lúa"
            />
            <select
              value={variety.resistanceLevel}
              onChange={(e) => {
                const newVarieties = [...data.varietySelection];
                newVarieties[idx].resistanceLevel = e.target.value;
                setData({ ...data, varietySelection: newVarieties });
              }}
              className="w-full p-2 border rounded text-sm"
            >
              <option>Kháng cao</option>
              <option>Kháng trung bình</option>
              <option>Dung nạp</option>
              <option>Nhạy cảm</option>
            </select>
          </div>
        ))}
      </div>
    </div>

    {/* Seed Treatment */}
    <div className="mb-6 p-4 bg-purple-50 rounded border">
      <h3 className="font-bold text-purple-800 mb-3">Xử lý hạt giống</h3>
      <textarea
        value={JSON.stringify(data?.seedTreatment || [], null, 2)}
        onChange={(e) => {
          try {
            setData({ ...data, seedTreatment: JSON.parse(e.target.value) });
          } catch (err) {
            console.error(err);
          }
        }}
        rows="4"
        className="w-full p-2 border rounded text-sm font-mono"
        placeholder="Nhập JSON format"
      />
    </div>
    <button
      onClick={onSave}
      disabled={saving}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50 flex items-center gap-2"
    >
      <FaSave />
      {saving ? "Đang lưu..." : "Lưu dữ liệu"}
    </button>
  </div>
);

const DiseaseWeatherEditor = ({ data, setData, onSave, saving }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Liên Hệ Thời Tiết & Bệnh</h2>

    {/* Weather Triggers */}
    <div className="mb-6 p-4 rounded border">
      <h3 className="font-bold mb-3">Điều kiện thời tiết gây bệnh</h3>
      <div className="space-y-4">
        {data?.weatherTriggers?.map((trigger, idx) => (
          <div key={idx} className="p-3 bg-white rounded border">
            <input
              type="text"
              value={trigger.condition}
              onChange={(e) => {
                const newTriggers = [...data.weatherTriggers];
                newTriggers[idx].condition = e.target.value;
                setData({ ...data, weatherTriggers: newTriggers });
              }}
              className="w-full p-2 border rounded text-sm mb-2"
              placeholder="Điều kiện thời tiết"
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                value={trigger.threshold?.temperature?.min || ""}
                onChange={(e) => {
                  const newTriggers = [...data.weatherTriggers];
                  if (!newTriggers[idx].threshold)
                    newTriggers[idx].threshold = {};
                  if (!newTriggers[idx].threshold.temperature)
                    newTriggers[idx].threshold.temperature = {};
                  newTriggers[idx].threshold.temperature.min = e.target.value;
                  setData({ ...data, weatherTriggers: newTriggers });
                }}
                className="w-full p-2 border rounded text-sm"
                placeholder="Min temp"
              />
              <input
                type="text"
                value={trigger.threshold?.temperature?.max || ""}
                onChange={(e) => {
                  const newTriggers = [...data.weatherTriggers];
                  if (!newTriggers[idx].threshold)
                    newTriggers[idx].threshold = {};
                  if (!newTriggers[idx].threshold.temperature)
                    newTriggers[idx].threshold.temperature = {};
                  newTriggers[idx].threshold.temperature.max = e.target.value;
                  setData({ ...data, weatherTriggers: newTriggers });
                }}
                className="w-full p-2 border rounded text-sm"
                placeholder="Max temp"
              />
            </div>
            <select
              value={trigger.riskLevel}
              onChange={(e) => {
                const newTriggers = [...data.weatherTriggers];
                newTriggers[idx].riskLevel = e.target.value;
                setData({ ...data, weatherTriggers: newTriggers });
              }}
              className="w-full p-2 border rounded text-sm"
            >
              <option>Rất cao</option>
              <option>Cao</option>
              <option>Trung bình</option>
              <option>Thấp</option>
            </select>
          </div>
        ))}
      </div>
    </div>
    <button
      onClick={onSave}
      disabled={saving}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50 flex items-center gap-2"
    >
      <FaSave />
      {saving ? "Đang lưu..." : "Lưu dữ liệu"}
    </button>
  </div>
);

export default AdminDiseaseDetail;
