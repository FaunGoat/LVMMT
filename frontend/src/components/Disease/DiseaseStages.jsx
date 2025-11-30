import React from "react";

const DiseaseStages = ({ stages }) => {
  if (!stages || !stages.stages || stages.stages.length === 0) return null;

  const getSeverityColor = (severity) => {
    const colors = {
      Nhẹ: "bg-green-100 border-green-300 text-green-800",
      "Trung bình": "bg-yellow-100 border-yellow-300 text-yellow-800",
      Nặng: "bg-orange-100 border-orange-300 text-orange-800",
      "Rất nặng": "bg-red-100 border-red-300 text-red-800",
    };
    return colors[severity] || "bg-gray-100 border-gray-300 text-gray-800";
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-4">
        📊 Giai đoạn phát triển bệnh
      </h3>

      {/* Thông tin tổng quan */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center border">
          <p className="text-sm text-gray-600">Tổng thời gian</p>
          <p className="text-xl font-bold text-blue-700">
            {stages.totalDuration}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center border">
          <p className="text-sm text-gray-600">Số giai đoạn</p>
          <p className="text-xl font-bold text-purple-700">
            {stages.stages.length}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center border">
          <p className="text-sm text-gray-600">Giai đoạn nguy hiểm</p>
          <p className="text-xl font-bold text-red-700">
            Giai đoạn {stages.peakStage + 1}
          </p>
        </div>
      </div>

      {/* Danh sách giai đoạn */}
      <div className="space-y-4">
        {stages.stages.map((stage, index) => {
          const isPeak = index === stages.peakStage;

          return (
            <div
              key={index}
              className={`bg-white rounded-lg shadow p-5 border-2 ${
                isPeak ? "border-red-500" : "border-gray-200"
              }`}
            >
              {/* Tiêu đề */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {stage.order}
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {stage.name}
                      {isPeak && (
                        <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                          NGUY HIỂM NHẤT
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">{stage.duration}</p>
                  </div>
                </div>
                <span
                  className={`${getSeverityColor(
                    stage.severity
                  )} px-3 py-1 rounded border text-sm font-bold`}
                >
                  {stage.severity}
                </span>
              </div>

              {/* Mô tả */}
              <p className="text-gray-700 mb-3">{stage.description}</p>

              {/* Thông tin chi tiết */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {stage.cropDamage && (
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">Thiệt hại</p>
                    <p className="text-sm font-semibold text-red-600">
                      {stage.cropDamage}
                    </p>
                  </div>
                )}
                {stage.spreadRate && (
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">Tốc độ lây</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {stage.spreadRate}
                    </p>
                  </div>
                )}
              </div>

              {/* Triệu chứng */}
              {stage.symptoms && stage.symptoms.length > 0 && (
                <div className="bg-amber-50 rounded p-3 border border-amber-200">
                  <p className="text-sm font-semibold text-amber-800 mb-2">
                    Triệu chứng:
                  </p>
                  <ul className="text-sm text-amber-900 space-y-1">
                    {stage.symptoms.map((symptom, idx) => (
                      <li key={idx}>• {symptom}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ghi chú */}
      {stages.notes && (
        <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Lưu ý:</strong> {stages.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiseaseStages;
