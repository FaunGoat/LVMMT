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

// ============================================
// COMPONENT EDITORS - CHỈ MINH HỌA CẤU TRÚC
// ============================================

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
    <h2 className="text-xl font-bold mb-4">Mùa Vụ & Thời Điểm</h2>
    <div className="space-y-4 mb-6">
      <textarea
        placeholder="Nhập dữ liệu mùa vụ (JSON format)"
        value={JSON.stringify(data, null, 2)}
        onChange={(e) => {
          try {
            setData(JSON.parse(e.target.value));
          } catch (err) {
            console.error(err);
          }
        }}
        rows="10"
        className="w-full p-2 border rounded font-mono text-sm"
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

const DiseaseCausesEditor = ({ data, setData, onSave, saving }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">Nguyên Nhân Gây Bệnh</h2>
    <textarea
      placeholder="Nhập dữ liệu nguyên nhân (JSON format)"
      value={JSON.stringify(data, null, 2)}
      onChange={(e) => {
        try {
          setData(JSON.parse(e.target.value));
        } catch (err) {
          console.error(err);
        }
      }}
      rows="10"
      className="w-full p-2 border rounded font-mono text-sm mb-6"
    />
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
    <h2 className="text-xl font-bold mb-4">Triệu Chứng</h2>
    <textarea
      placeholder="Nhập dữ liệu triệu chứng (JSON format)"
      value={JSON.stringify(data, null, 2)}
      onChange={(e) => {
        try {
          setData(JSON.parse(e.target.value));
        } catch (err) {
          console.error(err);
        }
      }}
      rows="10"
      className="w-full p-2 border rounded font-mono text-sm mb-6"
    />
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
    <h2 className="text-xl font-bold mb-4">Phương Pháp Điều Trị</h2>
    <textarea
      placeholder="Nhập dữ liệu điều trị (JSON format)"
      value={JSON.stringify(data, null, 2)}
      onChange={(e) => {
        try {
          setData(JSON.parse(e.target.value));
        } catch (err) {
          console.error(err);
        }
      }}
      rows="10"
      className="w-full p-2 border rounded font-mono text-sm mb-6"
    />
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
    <h2 className="text-xl font-bold mb-4">Biện Pháp Phòng Ngừa</h2>
    <textarea
      placeholder="Nhập dữ liệu phòng ngừa (JSON format)"
      value={JSON.stringify(data, null, 2)}
      onChange={(e) => {
        try {
          setData(JSON.parse(e.target.value));
        } catch (err) {
          console.error(err);
        }
      }}
      rows="10"
      className="w-full p-2 border rounded font-mono text-sm mb-6"
    />
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
    <h2 className="text-xl font-bold mb-4">Liên Hệ Thời Tiết</h2>
    <textarea
      placeholder="Nhập dữ liệu thời tiết (JSON format)"
      value={JSON.stringify(data, null, 2)}
      onChange={(e) => {
        try {
          setData(JSON.parse(e.target.value));
        } catch (err) {
          console.error(err);
        }
      }}
      rows="10"
      className="w-full p-2 border rounded font-mono text-sm mb-6"
    />
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
