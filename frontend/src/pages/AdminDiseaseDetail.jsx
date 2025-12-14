// frontend/src/pages/AdminDiseaseDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "./AdminLogin";
import { FaArrowLeft, FaSave } from "react-icons/fa";

function AdminDiseaseDetail() {
  const { diseaseId } = useParams();
  const navigate = useNavigate();
  const { token } = useAdmin();

  // ✅ FIX: Chỉ khai báo activeTab một lần
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
          { headers }
        ).then((r) => r.json()),
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/seasons`,
          { headers }
        ).then((r) => r.json()),
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/causes`,
          { headers }
        ).then((r) => r.json()),
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/symptoms`,
          { headers }
        ).then((r) => r.json()),
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/treatments`,
          { headers }
        ).then((r) => r.json()),
        fetch(
          `http://localhost:5000/api/admin/disease-details/${diseaseId}/prevention`,
          { headers }
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

  const addStage = () => {
    const newStages = stagesData?.stages || [];
    newStages.push({
      name: "",
      duration: "",
      description: "",
      order: newStages.length + 1,
      severity: "Trung bình",
    });
    setStagesData({ ...stagesData, stages: newStages });
  };

  const addSeason = () => {
    const newSeasons = seasonsData?.seasons || [];
    newSeasons.push({
      type: "Đông Xuân",
      startMonth: 1,
      endMonth: 12,
      riskLevel: "Cao",
      description: "",
      peakMonths: [],
    });
    setSeasonsData({ ...seasonsData, seasons: newSeasons });
  };

  const addCriticalPeriod = () => {
    const newPeriods = seasonsData?.criticalPeriods || [];
    newPeriods.push({
      cropStage: "",
      riskLevel: "Cao",
      description: "",
      preventiveMeasures: [],
      earlyWarningSigns: [],
    });
    setSeasonsData({ ...seasonsData, criticalPeriods: newPeriods });
  };

  const addSymptom = () => {
    const newSymptoms = symptomsData?.symptoms || [];
    newSymptoms.push({
      part: "Lá",
      description: "",
      stage: "Sớm",
      severity: "Trung bình",
      visualCharacteristics: {
        color: [],
        shape: "",
        size: "",
        texture: "",
        pattern: "",
        location: "",
      },
      distinguishingFeatures: [],
    });
    setSymptomsData({ ...symptomsData, symptoms: newSymptoms });
  };

  const addTreatment = () => {
    const newTreatments = treatmentsData?.treatments || [];
    newTreatments.push({
      type: "Hóa học",
      priority: 1,
      methods: [
        { name: "", dosage: "", frequency: "", applicationMethod: "Phun" },
      ],
      notes: "",
      warnings: [],
      bestPractices: [],
    });
    setTreatmentsData({ ...treatmentsData, treatments: newTreatments });
  };

  const addWeatherTrigger = () => {
    const newTriggers = weatherData?.weatherTriggers || [];
    newTriggers.push({
      condition: "",
      description: "",
      threshold: {
        temperature: { min: 0, max: 0, optimal: 0, critical: 0, unit: "°C" },
        humidity: { min: 0, max: 0, optimal: 0, critical: 0, unit: "%" },
      },
      riskLevel: "Cao",
      riskScore: 0,
      response: "",
    });
    setWeatherData({ ...weatherData, weatherTriggers: newTriggers });
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/diseases")}
            className="hover:bg-gray-100 p-2 rounded transition"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold">Chi tiết Bệnh Lúa</h1>
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
              { id: "weather", label: "Điều kiện thời tiết" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-green-500 text-white"
                    : "hover:bg-gray-50"
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
            addStage={addStage}
            saving={saving}
          />
        )}

        {/* SEASONS TAB */}
        {activeTab === "seasons" && seasonsData && (
          <DiseaseSeasonsEditor
            data={seasonsData}
            setData={setSeasonsData}
            onSave={handleSaveSeasons}
            addSeason={addSeason}
            addCriticalPeriod={addCriticalPeriod}
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
            addSymptom={addSymptom}
            saving={saving}
          />
        )}

        {/* TREATMENTS TAB */}
        {activeTab === "treatments" && treatmentsData && (
          <DiseaseTreatmentsEditor
            data={treatmentsData}
            setData={setTreatmentsData}
            onSave={handleSaveTreatments}
            addTreatment={addTreatment}
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
            addWeather={addWeatherTrigger}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}

const DiseaseStagesEditor = ({ data, setData, onSave, saving, addStage }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Giai Đoạn Phát Triển Bệnh</h2>
    <button
      onClick={addStage}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
    >
      Thêm giai đoạn
    </button>
    <div className="space-y-4 mb-6">
      <div>
        <label className="block text-lg font-semibold mb-1">
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
          <label className="block text-lg font-semibold mb-1">
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
          <label className="block text-lg font-semibold mb-1">
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
        <label className="block text-lg font-semibold mb-1">Ghi chú</label>
        <textarea
          value={data?.notes || ""}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          rows="3"
          className="w-full p-2 border rounded"
          placeholder="Ghi chú thêm về giai đoạn phát triển"
        />
      </div>

      <div>
        <label className="block text-lg font-semibold mb-2">
          Các giai đoạn
        </label>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data?.stages?.map((stage, idx) => (
            <div key={idx} className="p-4 rounded border relative group">
              {data.stages.length > 1 && (
                <button
                  onClick={() => {
                    const newStages = data.stages.filter((_, i) => i !== idx);
                    setData({ ...data, stages: newStages });
                  }}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded opacity-0 group-hover:opacity-100 transition"
                  title="Xóa giai đoạn"
                >
                  ✕
                </button>
              )}

              {data.stages.length === 1 && (
                <div
                  className="absolute top-2 right-2 text-gray-400 p-2 rounded"
                  title="Phải có ít nhất 1 giai đoạn"
                >
                  ✕
                </div>
              )}
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
                  className="p-1 border rounded"
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
                  className="p-1 border rounded"
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
                className="w-full p-1 border rounded"
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

const DiseaseSeasonsEditor = ({
  data,
  setData,
  onSave,
  saving,
  addSeason,
  addCriticalPeriod,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Mùa Vụ & Giai Đoạn Cây Trồng</h2>
    <div className="flex gap-2 mb-2">
      <button
        onClick={addSeason}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition"
      >
        Thêm mùa vụ
      </button>
      <button
        onClick={addCriticalPeriod}
        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded transition"
      >
        Thêm giai đoạn
      </button>
    </div>
    {/* Seasons */}
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b-2">Mùa vụ</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {data?.seasons?.map((season, idx) => (
          <div key={idx} className="p-4 rounded border relative group">
            {data.seasons.length > 1 && (
              <button
                onClick={() => {
                  const newSeasons = data.seasons.filter((_, i) => i !== idx);
                  setData({ ...data, seasons: newSeasons });
                }}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded opacity-0 group-hover:opacity-100 transition"
                title="Xóa mùa vụ"
              >
                ✕
              </button>
            )}

            {data.seasons.length === 1 && (
              <div
                className="absolute top-2 right-2 text-gray-400 p-2 rounded"
                title="Phải có ít nhất 1 mùa vụ"
              >
                ✕
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block font-semibold mb-1">Mùa vụ</label>
                <select
                  value={season.type}
                  onChange={(e) => {
                    const newSeasons = [...data.seasons];
                    newSeasons[idx].type = e.target.value;
                    setData({ ...data, seasons: newSeasons });
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option>Đông Xuân</option>
                  <option>Hè Thu</option>
                  <option>Cả Năm</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Mức độ rủi ro
                </label>
                <select
                  value={season.riskLevel}
                  onChange={(e) => {
                    const newSeasons = [...data.seasons];
                    newSeasons[idx].riskLevel = e.target.value;
                    setData({ ...data, seasons: newSeasons });
                  }}
                  className="w-full p-2 border rounded"
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
                <label className="block font-semibold mb-1">
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
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
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
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block font-semibold mb-1">Mô tả</label>
              <textarea
                value={season.description}
                onChange={(e) => {
                  const newSeasons = [...data.seasons];
                  newSeasons[idx].description = e.target.value;
                  setData({ ...data, seasons: newSeasons });
                }}
                rows="2"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Critical Periods */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b-2">
        Giai đoạn cây trồng nhạy cảm
      </h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {data?.criticalPeriods?.map((period, idx) => (
          <div key={idx} className="p-4 rounded border relative group">
            {/* ✅ NÚT XÓA GIAI ĐOẠN TỚI HẠN */}
            {data.criticalPeriods.length > 1 && (
              <button
                onClick={() => {
                  const newPeriods = data.criticalPeriods.filter(
                    (_, i) => i !== idx
                  );
                  setData({ ...data, criticalPeriods: newPeriods });
                }}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded opacity-0 group-hover:opacity-100 transition"
                title="Xóa giai đoạn"
              >
                ✕
              </button>
            )}

            {data.criticalPeriods.length === 1 && (
              <div
                className="absolute top-2 right-2 text-gray-400 p-2 rounded"
                title="Phải có ít nhất 1 giai đoạn"
              >
                ✕
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block font-semibold mb-1">Giai đoạn</label>
                <input
                  type="text"
                  value={period.cropStage}
                  onChange={(e) => {
                    const newPeriods = [...data.criticalPeriods];
                    newPeriods[idx].cropStage = e.target.value;
                    setData({ ...data, criticalPeriods: newPeriods });
                  }}
                  className="w-full p-2 border rounded"
                  placeholder="Đẻ nhánh, Trổ bông"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Mức độ rủi ro
                </label>
                <select
                  value={period.riskLevel}
                  onChange={(e) => {
                    const newPeriods = [...data.criticalPeriods];
                    newPeriods[idx].riskLevel = e.target.value;
                    setData({ ...data, criticalPeriods: newPeriods });
                  }}
                  className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
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
      <h3 className="text-lg font-semibold mb-3">Mầm bệnh</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold mb-1">
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
            className="w-full p-2 border rounded"
            placeholder="Nấm / Vi khuẩn / Virus"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Tên khoa học</label>
          <input
            type="text"
            value={data?.pathogen?.scientificName || ""}
            onChange={(e) =>
              setData({
                ...data,
                pathogen: { ...data.pathogen, scientificName: e.target.value },
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <div className="mt-3">
        <label className="block font-semibold mb-1">
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
          className="w-full p-2 border rounded"
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

const DiseaseSymptomsEditor = ({
  data,
  setData,
  onSave,
  saving,
  addSymptom,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Triệu Chứng</h2>
    <button
      onClick={addSymptom}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition mb-3"
    >
      Thêm triệu chứng
    </button>
    <div className="mb-6 p-4 rounded border">
      <h3 className="text-lg font-semibold mb-3">Danh sách triệu chứng</h3>
      <div className="space-y-4 max-h-160 overflow-y-auto">
        {data?.symptoms?.map((symptom, idx) => (
          <div key={idx} className="p-3 bg-white rounded border relative group">
            {/* ✅ NÚT XÓA TRIỆU CHỨNG */}
            {data.symptoms.length > 1 && (
              <button
                onClick={() => {
                  const newSymptoms = data.symptoms.filter((_, i) => i !== idx);
                  setData({ ...data, symptoms: newSymptoms });
                }}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded opacity-0 group-hover:opacity-100 transition"
                title="Xóa triệu chứng"
              >
                ✕
              </button>
            )}

            {data.symptoms.length === 1 && (
              <div
                className="absolute top-2 right-2 text-gray-400 p-2 rounded"
                title="Phải có ít nhất 1 triệu chứng"
              >
                ✕
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block font-semibold mb-1">Bộ phận</label>
                <select
                  value={symptom.part}
                  onChange={(e) => {
                    const newSymptoms = [...data.symptoms];
                    newSymptoms[idx].part = e.target.value;
                    setData({ ...data, symptoms: newSymptoms });
                  }}
                  className="w-full p-2 border rounded"
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
                <label className="block font-semibold mb-1">Mức độ</label>
                <select
                  value={symptom.severity}
                  onChange={(e) => {
                    const newSymptoms = [...data.symptoms];
                    newSymptoms[idx].severity = e.target.value;
                    setData({ ...data, symptoms: newSymptoms });
                  }}
                  className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
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

const DiseaseTreatmentsEditor = ({
  data,
  setData,
  onSave,
  saving,
  addTreatment,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold mb-4">Phương Pháp Điều Trị</h2>
    <button
      onClick={addTreatment}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition mb-3"
    >
      Thêm phương pháp
    </button>
    <div className="space-y-4 mb-6">
      {data?.treatments?.map((treatment, idx) => (
        <div key={idx} className="p-4 rounded border relative group">
          {/* ✅ NÚT XÓA PHƯƠNG PHÁP ĐIỀU TRỊ */}
          {data.treatments.length > 1 && (
            <button
              onClick={() => {
                const newTreatments = data.treatments.filter(
                  (_, i) => i !== idx
                );
                setData({ ...data, treatments: newTreatments });
              }}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded opacity-0 group-hover:opacity-100 transition"
              title="Xóa phương pháp"
            >
              ✕
            </button>
          )}

          {data.treatments.length === 1 && (
            <div
              className="absolute top-2 right-2 text-gray-400 p-2 rounded"
              title="Phải có ít nhất 1 phương pháp"
            >
              ✕
            </div>
          )}
          <label className="block text-lg font-semibold mb-1">
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
              className="p-1 border rounded"
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
              className="p-1 text-sm border rounded"
            >
              <option value="1">Ưu tiên 1</option>
              <option value="2">Ưu tiên 2</option>
              <option value="3">Ưu tiên 3</option>
              <option value="4">Ưu tiên 4</option>
              <option value="5">Ưu tiên 5</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block font-semibold mb-1">
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
              className="w-full p-2 border rounded"
              placeholder="Tên thuốc - Liều lượng"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Lưu ý</label>
            <textarea
              value={treatment.notes || ""}
              onChange={(e) => {
                const newTreatments = [...data.treatments];
                newTreatments[idx].notes = e.target.value;
                setData({ ...data, treatments: newTreatments });
              }}
              rows="2"
              className="w-full p-2 border rounded"
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

const DiseasePreventionEditor = ({ data, setData, onSave, saving }) => {
  // State lưu loại biện pháp đang chọn
  const [selectedType, setSelectedType] = useState("cultural");

  // Danh sách các loại biện pháp để hiển thị trong Dropdown
  const preventionOptions = [
    {
      id: "cultural",
      label: "Biện pháp Canh tác",
      key: "culturalPractices",
    },
    {
      id: "variety",
      label: "Giống lúa kháng bệnh",
      key: "varietySelection",
    },
    { id: "seed", label: "Xử lý hạt giống", key: "seedTreatment" },
    { id: "soil", label: "Quản lý đất", key: "soilManagement" },
    { id: "water", label: "Quản lý nước", key: "waterManagement" },
    {
      id: "nutrition",
      label: "Quản lý dinh dưỡng",
      key: "nutritionManagement",
    },
    {
      id: "sanitation",
      label: "Vệ sinh đồng ruộng",
      key: "sanitationPractices",
    },
    { id: "bio", label: "Kiểm soát sinh học", key: "biologicalControl" },
    { id: "monitoring", label: "Lịch giám sát", key: "monitoringSchedule" },
  ];

  // Hàm thêm dòng mới chung cho các bảng dạng danh sách (trừ lịch trình tổng quát)
  const addItem = (key, template) => {
    const currentList = data[key] ? [...data[key]] : [];
    currentList.push(template);
    setData({ ...data, [key]: currentList });
  };

  // Hàm xóa dòng
  const removeItem = (key, index) => {
    const currentList = [...data[key]];
    if (currentList.length <= 1) {
      alert("Phải có ít nhất 1 mục trong danh sách này");
      return;
    }

    currentList.splice(index, 1);
    setData({ ...data, [key]: currentList });
  };

  // Template dữ liệu mẫu cho từng loại (để khi bấm thêm mới không bị lỗi)
  const templates = {
    culturalPractices: {
      practice: "",
      timing: "",
      description: "",
      cost: "Trung bình",
    },
    varietySelection: {
      varietyName: "",
      resistanceLevel: "Kháng cao",
      growthDuration: "",
      resistanceGenes: [],
    },
    seedTreatment: { method: "", cost: "Thấp", materials: [] },
    soilManagement: { practice: "", description: "" },
    waterManagement: { practice: "", waterDepth: "", description: "" },
    nutritionManagement: { nutrient: "", recommendation: "", timing: "" },
    sanitationPractices: { practice: "", importance: "Quan trọng", timing: "" },
    biologicalControl: { agent: "", cost: "Trung bình", timing: "" },
    monitoringSchedule: {
      frequency: "",
      cropStage: "",
      whatToCheck: [],
      threshold: "",
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold">Biện pháp Phòng ngừa</h2>

        {/* DROPDOWN CHỌN LOẠI BIỆN PHÁP */}
        <div className="w-1/2">
          <label className="block text-sm font-bold mb-1 uppercase">
            Chọn loại biện pháp để nhập liệu:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 border-2 border-green-500 rounded font-medium focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            {preventionOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="min-h-[300px]">
        {/* 1. CANH TÁC */}
        {selectedType === "cultural" && (
          <PreventionListSection
            title="Chi tiết Biện pháp Canh tác"
            items={data?.culturalPractices || []}
            onAdd={() =>
              addItem("culturalPractices", templates.culturalPractices)
            }
            onRemove={(idx) => removeItem("culturalPractices", idx)}
            renderItem={(item, idx) => (
              <>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <input
                    placeholder="Tên biện pháp (VD: Sạ hàng)"
                    className="input-field"
                    value={item.practice}
                    onChange={(e) => {
                      const list = [...data.culturalPractices];
                      list[idx].practice = e.target.value;
                      setData({ ...data, culturalPractices: list });
                    }}
                  />
                  <input
                    placeholder="Thời gian (VD: Đầu vụ)"
                    className="input-field"
                    value={item.timing}
                    onChange={(e) => {
                      const list = [...data.culturalPractices];
                      list[idx].timing = e.target.value;
                      setData({ ...data, culturalPractices: list });
                    }}
                  />
                </div>
                <textarea
                  placeholder="Mô tả chi tiết"
                  className="input-field mb-2"
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const list = [...data.culturalPractices];
                    list[idx].description = e.target.value;
                    setData({ ...data, culturalPractices: list });
                  }}
                />
              </>
            )}
          />
        )}

        {/* 2. GIỐNG LÚA */}
        {selectedType === "variety" && (
          <PreventionListSection
            title="Chọn Giống Lúa Kháng Bệnh"
            items={data?.varietySelection || []}
            onAdd={() =>
              addItem("varietySelection", templates.varietySelection)
            }
            onRemove={(idx) => removeItem("varietySelection", idx)}
            renderItem={(item, idx) => (
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Tên giống (VD: OM18)"
                  className="input-field"
                  value={item.varietyName}
                  onChange={(e) => {
                    const list = [...data.varietySelection];
                    list[idx].varietyName = e.target.value;
                    setData({ ...data, varietySelection: list });
                  }}
                />
                <select
                  className="input-field"
                  value={item.resistanceLevel}
                  onChange={(e) => {
                    const list = [...data.varietySelection];
                    list[idx].resistanceLevel = e.target.value;
                    setData({ ...data, varietySelection: list });
                  }}
                >
                  <option>Kháng cao</option>
                  <option>Kháng trung bình</option>
                  <option>Nhiễm nhẹ</option>
                </select>
                <input
                  placeholder="Gen kháng (cách nhau dấu phẩy)"
                  className="input-field col-span-2"
                  value={(item.resistanceGenes || []).join(", ")}
                  onChange={(e) => {
                    const list = [...data.varietySelection];
                    list[idx].resistanceGenes = e.target.value.split(",");
                    setData({ ...data, varietySelection: list });
                  }}
                />
              </div>
            )}
          />
        )}

        {/* 3. XỬ LÝ HẠT */}
        {selectedType === "seed" && (
          <PreventionListSection
            title="Phương pháp Xử Lý Hạt Giống"
            items={data?.seedTreatment || []}
            onAdd={() => addItem("seedTreatment", templates.seedTreatment)}
            onRemove={(idx) => removeItem("seedTreatment", idx)}
            renderItem={(item, idx) => (
              <div className="space-y-2">
                <input
                  placeholder="Phương pháp (VD: Ngâm nước ấm)"
                  className="input-field"
                  value={item.method}
                  onChange={(e) => {
                    const list = [...data.seedTreatment];
                    list[idx].method = e.target.value;
                    setData({ ...data, seedTreatment: list });
                  }}
                />
                <input
                  placeholder="Vật liệu/Thuốc (cách nhau dấu phẩy)"
                  className="input-field"
                  value={(item.materials || []).join(", ")}
                  onChange={(e) => {
                    const list = [...data.seedTreatment];
                    list[idx].materials = e.target.value.split(",");
                    setData({ ...data, seedTreatment: list });
                  }}
                />
              </div>
            )}
          />
        )}

        {/* 4. QUẢN LÝ ĐẤT */}
        {selectedType === "soil" && (
          <PreventionListSection
            title="Biện pháp Quản Lý Đất"
            items={data?.soilManagement || []}
            onAdd={() => addItem("soilManagement", templates.soilManagement)}
            onRemove={(idx) => removeItem("soilManagement", idx)}
            renderItem={(item, idx) => (
              <>
                <input
                  placeholder="Biện pháp (VD: Bón vôi)"
                  className="input-field mb-2"
                  value={item.practice}
                  onChange={(e) => {
                    const list = [...data.soilManagement];
                    list[idx].practice = e.target.value;
                    setData({ ...data, soilManagement: list });
                  }}
                />
                <textarea
                  placeholder="Mô tả chi tiết"
                  className="input-field"
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const list = [...data.soilManagement];
                    list[idx].description = e.target.value;
                    setData({ ...data, soilManagement: list });
                  }}
                />
              </>
            )}
          />
        )}

        {/* 5. QUẢN LÝ NƯỚC */}
        {selectedType === "water" && (
          <PreventionListSection
            title="Biện pháp Quản Lý Nước"
            items={data?.waterManagement || []}
            onAdd={() => addItem("waterManagement", templates.waterManagement)}
            onRemove={(idx) => removeItem("waterManagement", idx)}
            renderItem={(item, idx) => (
              <div className="grid grid-cols-3 gap-2">
                <input
                  placeholder="Biện pháp"
                  className="input-field col-span-2"
                  value={item.practice}
                  onChange={(e) => {
                    const list = [...data.waterManagement];
                    list[idx].practice = e.target.value;
                    setData({ ...data, waterManagement: list });
                  }}
                />
                <input
                  placeholder="Mực nước (cm)"
                  className="input-field"
                  value={item.waterDepth}
                  onChange={(e) => {
                    const list = [...data.waterManagement];
                    list[idx].waterDepth = e.target.value;
                    setData({ ...data, waterManagement: list });
                  }}
                />
                <textarea
                  placeholder="Mô tả"
                  className="input-field col-span-3"
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const list = [...data.waterManagement];
                    list[idx].description = e.target.value;
                    setData({ ...data, waterManagement: list });
                  }}
                />
              </div>
            )}
          />
        )}

        {/* 6. DINH DƯỠNG */}
        {selectedType === "nutrition" && (
          <PreventionListSection
            title="Quản Lý Dinh Dưỡng & Phân Bón"
            items={data?.nutritionManagement || []}
            onAdd={() =>
              addItem("nutritionManagement", templates.nutritionManagement)
            }
            onRemove={(idx) => removeItem("nutritionManagement", idx)}
            renderItem={(item, idx) => (
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Chất dinh dưỡng (VD: Đạm)"
                  className="input-field"
                  value={item.nutrient}
                  onChange={(e) => {
                    const list = [...data.nutritionManagement];
                    list[idx].nutrient = e.target.value;
                    setData({ ...data, nutritionManagement: list });
                  }}
                />
                <input
                  placeholder="Thời gian bón"
                  className="input-field"
                  value={item.timing}
                  onChange={(e) => {
                    const list = [...data.nutritionManagement];
                    list[idx].timing = e.target.value;
                    setData({ ...data, nutritionManagement: list });
                  }}
                />
                <input
                  placeholder="Khuyến nghị (VD: Giảm 10%)"
                  className="input-field col-span-2"
                  value={item.recommendation}
                  onChange={(e) => {
                    const list = [...data.nutritionManagement];
                    list[idx].recommendation = e.target.value;
                    setData({ ...data, nutritionManagement: list });
                  }}
                />
              </div>
            )}
          />
        )}

        {/* 7. VỆ SINH */}
        {selectedType === "sanitation" && (
          <PreventionListSection
            title="Vệ Sinh Đồng Ruộng"
            items={data?.sanitationPractices || []}
            onAdd={() =>
              addItem("sanitationPractices", templates.sanitationPractices)
            }
            onRemove={(idx) => removeItem("sanitationPractices", idx)}
            renderItem={(item, idx) => (
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Hành động (VD: Dọn cỏ bờ)"
                  className="input-field"
                  value={item.practice}
                  onChange={(e) => {
                    const list = [...data.sanitationPractices];
                    list[idx].practice = e.target.value;
                    setData({ ...data, sanitationPractices: list });
                  }}
                />
                <input
                  placeholder="Thời điểm"
                  className="input-field"
                  value={item.timing}
                  onChange={(e) => {
                    const list = [...data.sanitationPractices];
                    list[idx].timing = e.target.value;
                    setData({ ...data, sanitationPractices: list });
                  }}
                />
              </div>
            )}
          />
        )}

        {/* 8. SINH HỌC */}
        {selectedType === "bio" && (
          <PreventionListSection
            title="Kiểm Soát Sinh Học (Thiên địch/Chế phẩm)"
            items={data?.biologicalControl || []}
            onAdd={() =>
              addItem("biologicalControl", templates.biologicalControl)
            }
            onRemove={(idx) => removeItem("biologicalControl", idx)}
            renderItem={(item, idx) => (
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Tác nhân (VD: Nấm Trichoderma)"
                  className="input-field"
                  value={item.agent}
                  onChange={(e) => {
                    const list = [...data.biologicalControl];
                    list[idx].agent = e.target.value;
                    setData({ ...data, biologicalControl: list });
                  }}
                />
                <input
                  placeholder="Thời gian áp dụng"
                  className="input-field"
                  value={item.timing}
                  onChange={(e) => {
                    const list = [...data.biologicalControl];
                    list[idx].timing = e.target.value;
                    setData({ ...data, biologicalControl: list });
                  }}
                />
              </div>
            )}
          />
        )}

        {/* 9. GIÁM SÁT */}
        {selectedType === "monitoring" && (
          <PreventionListSection
            title="Lịch Trình Giám Sát Đồng Ruộng"
            items={data?.monitoringSchedule || []}
            onAdd={() =>
              addItem("monitoringSchedule", templates.monitoringSchedule)
            }
            onRemove={(idx) => removeItem("monitoringSchedule", idx)}
            renderItem={(item, idx) => (
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Tần suất (VD: 7 ngày/lần)"
                  className="input-field"
                  value={item.frequency}
                  onChange={(e) => {
                    const list = [...data.monitoringSchedule];
                    list[idx].frequency = e.target.value;
                    setData({ ...data, monitoringSchedule: list });
                  }}
                />
                <input
                  placeholder="Giai đoạn lúa"
                  className="input-field"
                  value={item.cropStage}
                  onChange={(e) => {
                    const list = [...data.monitoringSchedule];
                    list[idx].cropStage = e.target.value;
                    setData({ ...data, monitoringSchedule: list });
                  }}
                />
                <input
                  placeholder="Kiểm tra gì? (cách nhau dấu phẩy)"
                  className="input-field col-span-2"
                  value={(item.whatToCheck || []).join(", ")}
                  onChange={(e) => {
                    const list = [...data.monitoringSchedule];
                    list[idx].whatToCheck = e.target.value.split(",");
                    setData({ ...data, monitoringSchedule: list });
                  }}
                />
                <input
                  placeholder="Ngưỡng cảnh báo"
                  className="input-field col-span-2"
                  value={item.threshold}
                  onChange={(e) => {
                    const list = [...data.monitoringSchedule];
                    list[idx].threshold = e.target.value;
                    setData({ ...data, monitoringSchedule: list });
                  }}
                />
              </div>
            )}
          />
        )}
      </div>

      <div className="mt-6 pt-4 border-t flex items-center">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium transition disabled:opacity-50 flex items-center gap-2"
        >
          <FaSave />
          {saving ? "Đang lưu..." : "Lưu dữ liệu"}
        </button>
      </div>

      {/* Styles inline nhỏ gọn cho input */}
      <style>{`
        .input-field {
            width: 100%;
            padding: 8px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 1rem;
        }
        .input-field:focus {
            outline: none;
            border-color: #22c55e;
            box-shadow: 0 0 0 1px #22c55e;
        }
      `}</style>
    </div>
  );
};

// Component con để hiển thị danh sách item (giúp code gọn hơn)
const PreventionListSection = ({
  title,
  items,
  onAdd,
  onRemove,
  renderItem,
}) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <button
        onClick={onAdd}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 transition"
      >
        + Thêm biện pháp
      </button>
    </div>

    {items.length === 0 ? (
      <div className="text-center p-8 rounded border border-dashed border-gray-300">
        Chưa có dữ liệu. Bấm "Thêm biện pháp" để thêm dữ liệu.
      </div>
    ) : (
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded border relative group hover:shadow-sm transition"
          >
            {items.length > 1 && (
              <button
                onClick={() => onRemove(idx)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded opacity-0 group-hover:opacity-100 transition"
                title="Xóa biện pháp"
              >
                ✕
              </button>
            )}

            {/* ✅ LOCK ICON NẾU CHỈ CÓ 1 ITEM */}
            {items.length === 1 && (
              <div
                className="absolute top-2 right-2 text-gray-400 p-2 rounded"
                title="Phải có ít nhất 1 biện pháp"
              >
                ✕
              </div>
            )}
            {renderItem(item, idx)}
          </div>
        ))}
      </div>
    )}
  </div>
);

const DiseaseWeatherEditor = ({
  data,
  setData,
  onSave,
  saving,
  addWeather,
}) => {
  const removeWeatherTrigger = (idx) => {
    // Kiểm tra nếu chỉ có 1 item, không cho phép xóa
    if (!data.weatherTriggers || data.weatherTriggers.length <= 1) {
      alert("Phải có ít nhất 1 điều kiện thời tiết");
      return;
    }
    const newTriggers = data.weatherTriggers.filter((_, i) => i !== idx);
    setData({ ...data, weatherTriggers: newTriggers });
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Điều kiện thời tiết gây bệnh</h2>
      <button
        onClick={addWeather}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition mb-3"
      >
        Thêm điều kiện thời tiết
      </button>
      {/* Weather Triggers */}
      <div className="mb-6 p-4 rounded border">
        <div className="space-y-4">
          {data?.weatherTriggers?.map((trigger, idx) => (
            <div
              key={idx}
              className="p-3 bg-white rounded border relative group"
            >
              {data.weatherTriggers.length > 1 && (
                <button
                  onClick={() => removeWeatherTrigger(idx)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded opacity-0 group-hover:opacity-100 transition"
                  title="Xóa điều kiện"
                >
                  ✕
                </button>
              )}
              {data.weatherTriggers.length === 1 && (
                <div
                  className="absolute top-2 right-2 text-gray-400 p-2 rounded"
                  title="Phải có ít nhất 1 điều kiện"
                >
                  ✕
                </div>
              )}
              <input
                type="text"
                value={trigger.condition}
                onChange={(e) => {
                  const newTriggers = [...data.weatherTriggers];
                  newTriggers[idx].condition = e.target.value;
                  setData({ ...data, weatherTriggers: newTriggers });
                }}
                className="w-full p-2 border rounded mb-2"
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
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
};

export default AdminDiseaseDetail;
