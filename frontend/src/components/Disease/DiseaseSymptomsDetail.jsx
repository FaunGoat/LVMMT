import React, { useState } from "react";

const DiseaseSymptomsDetail = ({ symptoms }) => {
  const [filterPart, setFilterPart] = useState("all");

  if (!symptoms || !symptoms.symptoms || symptoms.symptoms.length === 0) {
    return null;
  }

  const getSeverityColor = (severity) => {
    const colors = {
      Nhẹ: "bg-green-100 text-green-800",
      "Trung bình": "bg-yellow-100 text-yellow-800",
      Nặng: "bg-orange-100 text-orange-800",
      "Rất nặng": "bg-red-100 text-red-800",
    };
    return colors[severity] || "bg-gray-100 text-gray-800";
  };

  // Lọc triệu chứng
  const filteredSymptoms =
    filterPart === "all"
      ? symptoms.symptoms
      : symptoms.symptoms.filter((s) => s.part === filterPart);

  // Lấy danh sách bộ phận
  const parts = [...new Set(symptoms.symptoms.map((s) => s.part))];

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-4">
        🔍 Triệu chứng chi tiết
      </h3>

      {/* Bộ lọc đơn giản */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 border">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Lọc theo bộ phận:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterPart("all")}
            className={`px-3 py-1 rounded text-sm ${
              filterPart === "all"
                ? "bg-sky-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Tất cả
          </button>
          {parts.map((part) => (
            <button
              key={part}
              onClick={() => setFilterPart(part)}
              className={`px-3 py-1 rounded text-sm ${
                filterPart === part
                  ? "bg-sky-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {part}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách triệu chứng */}
      <div className="space-y-4">
        {filteredSymptoms.map((symptom, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-5 border">
            {/* Tiêu đề */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-lg font-bold text-gray-800">
                  {symptom.part}
                </h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Giai đoạn: {symptom.stage}
                  </span>
                  <span
                    className={`text-xs ${getSeverityColor(
                      symptom.severity
                    )} px-2 py-1 rounded`}
                  >
                    {symptom.severity}
                  </span>
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <p className="text-gray-700 mb-3">{symptom.description}</p>

            {/* Đặc điểm hình thái */}
            {symptom.visualCharacteristics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {symptom.visualCharacteristics.color && (
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">Màu sắc</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {symptom.visualCharacteristics.color.join(", ")}
                    </p>
                  </div>
                )}
                {symptom.visualCharacteristics.shape && (
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">Hình dạng</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {symptom.visualCharacteristics.shape}
                    </p>
                  </div>
                )}
                {symptom.visualCharacteristics.size && (
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">Kích thước</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {symptom.visualCharacteristics.size}
                    </p>
                  </div>
                )}
                {symptom.visualCharacteristics.pattern && (
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">Phân bố</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {symptom.visualCharacteristics.pattern}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Đặc điểm phân biệt */}
            {symptom.distinguishingFeatures &&
              symptom.distinguishingFeatures.length > 0 && (
                <div className="bg-amber-50 rounded p-3 border border-amber-200">
                  <p className="text-sm font-semibold text-amber-800 mb-1">
                    Đặc điểm phân biệt:
                  </p>
                  <ul className="text-sm text-amber-900 space-y-1">
                    {symptom.distinguishingFeatures.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseaseSymptomsDetail;
