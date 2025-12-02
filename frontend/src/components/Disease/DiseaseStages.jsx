import React, { useState } from "react";

const DiseaseStages = ({ stages }) => {
  const [selectedStage, setSelectedStage] = useState(0);

  if (!stages || !stages.stages || stages.stages.length === 0) return null;

  const getStageColor = (index) => {
    const isPeak = index === stages.peakStage;
    if (isPeak) return "bg-red-500";
    if (index === selectedStage) return "bg-blue-800";
    return "bg-blue-400";
  };

  const currentStage = stages.stages[selectedStage];
  const isPeak = selectedStage === stages.peakStage;

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-6 pb-3 border-b-2">
        Giai đoạn phát triển bệnh
      </h3>

      {/* Tổng thời gian */}
      <div className="absolute left-1/2 -translate-x-1/2 bg-blue-100 px-4 py-1 rounded-full border border-blue-300">
        <p className="text-base font-semibold text-blue-800 whitespace-nowrap">
          Thời gian: {stages.totalDuration}
        </p>
      </div>

      {/* Timeline thanh ngang */}
      <div className="bg-white rounded-lg p-8 mb-6">
        <div className="relative max-w-3xl mx-auto mt-2">
          {/* Đường nối - chỉ nối giữa điểm đầu và điểm cuối */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -translate-y-1/2"></div>

          {/* Các điểm giai đoạn */}
          <div className="relative flex justify-between items-center">
            {stages.stages.map((stage, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Điểm */}
                <button
                  onClick={() => setSelectedStage(index)}
                  className={`${getStageColor(
                    index
                  )} w-12 h-12 rounded-full border-4 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center justify-center font-bold text-white relative z-20`}
                >
                  {stage.order}
                </button>

                {/* Tên giai đoạn */}
                <div className="mt-6 text-center">
                  <p
                    className={`text-base font-semibold ${
                      index === selectedStage
                        ? "text-gray-800"
                        : "text-gray-600"
                    }`}
                  >
                    {stage.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stage.duration}</p>
                  {index === stages.peakStage && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded mt-1 inline-block">
                      Nguy hiểm
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chi tiết giai đoạn được chọn */}
      <div
        className={`bg-white rounded-lg p-6 border-2 ${
          isPeak ? "border-red-300" : "border-blue-300"
        }`}
      >
        {/* Tiêu đề */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`${getStageColor(
                selectedStage
              )} text-white rounded w-10 h-10 flex items-center justify-center font-bold`}
            >
              {currentStage.order}
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800">
                {currentStage.name}
                {isPeak && (
                  <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                    NGUY HIỂM NHẤT
                  </span>
                )}
              </h4>
              <p className="text-sm text-gray-600">{currentStage.duration}</p>
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <p className="text-gray-700 text-lg mb-4 leading-relaxed">
          {currentStage.description}
        </p>

        {/* Thông tin chi tiết */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {currentStage.cropDamage && (
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <p className="text-xs text-gray-600 mb-1">Thiệt hại</p>
              <p className="text-sm font-semibold text-red-700">
                {currentStage.cropDamage}
              </p>
            </div>
          )}
          {currentStage.spreadRate && (
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <p className="text-xs text-gray-600 mb-1">Tốc độ lây</p>
              <p className="text-sm font-semibold text-gray-800">
                {currentStage.spreadRate}
              </p>
            </div>
          )}
        </div>

        {/* Triệu chứng */}
        {currentStage.symptoms && currentStage.symptoms.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded p-3">
            <p className="text-base font-semibold text-gray-800 mb-2">
              Triệu chứng:
            </p>
            <ul className="space-y-1.5">
              {currentStage.symptoms.map((symptom, idx) => (
                <li key={idx} className="text-base text-gray-700 pl-3">
                  • {symptom}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Ghi chú */}
      {stages.notes && (
        <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
          <p className="text-base text-gray-800">
            <strong>Lưu ý:</strong> {stages.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiseaseStages;
