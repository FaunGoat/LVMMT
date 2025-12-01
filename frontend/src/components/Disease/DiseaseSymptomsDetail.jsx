import React, { useState } from "react";

const DiseaseSymptomsDetail = ({ symptoms }) => {
  const [filterPart, setFilterPart] = useState("all");

  if (!symptoms || !symptoms.symptoms || symptoms.symptoms.length === 0) {
    return null;
  }

  // Logic Gom nhóm (Giữ nguyên)
  const groupedSymptoms = symptoms.symptoms.reduce((acc, symptom) => {
    const part = symptom.part || "Khác";
    if (!acc[part]) {
      acc[part] = [];
    }
    acc[part].push(symptom);
    return acc;
  }, {});

  const parts = Object.keys(groupedSymptoms);

  const partsToDisplay =
    filterPart === "all" ? parts : parts.filter((part) => part === filterPart);

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-4">
        Triệu chứng chi tiết
      </h3>

      {/* Bộ lọc đơn giản (Giữ nguyên) */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border">
        <p className="text-base font-semibold text-gray-700 mb-2">
          Lọc theo bộ phận:
        </p>
        <div className="flex flex-wrap gap-2">
          {parts.map((part) => (
            <button
              key={part}
              onClick={() => setFilterPart(part)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filterPart === part
                  ? "bg-sky-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {part}
            </button>
          ))}
          <button
            onClick={() => setFilterPart("all")}
            className={`px-3 py-1 rounded text-base transition-colors ${
              filterPart === "all"
                ? "bg-sky-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
        </div>
      </div>

      {/* DANH SÁCH TRIỆU CHỨNG ĐÃ GOM NHÓM VÀ TỐI GIẢN */}
      <div className="space-y-8">
        {partsToDisplay.map((partName) => (
          <div key={partName} className="pt-2">
            {/* TIÊU ĐỀ BỘ PHẬN */}
            <h4 className="text-xl font-bold mb-4 border-b-2 border-sky-100 pb-2">
              Bộ phận: {partName}
            </h4>

            {/* ✅ KHUNG GOM NHÓM MỚI */}
            <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
              <ol className="space-y-4 list-decimal list-inside pl-5">
                {groupedSymptoms[partName].map((symptom, index) => (
                  // LIÊN KẾT LIỆT KÊ MÔ TẢ VÀ THÔNG TIN CHI TIẾT
                  <div
                    key={index}
                    className="text-gray-700 pb-4 border-b border-gray-100 last:border-b-0"
                  >
                    {/* Mô tả chính */}
                    <p className="text-lg font-semibold text-gray-800">
                      {symptom.description}
                    </p>

                    {/* Đặc điểm phân biệt */}
                    {symptom.distinguishingFeatures &&
                      symptom.distinguishingFeatures.length > 0 && (
                        <div className="bg-amber-50 rounded p-3 border border-amber-200 mt-3">
                          <p className="text-sm font-semibold text-amber-800 mb-1">
                            ❗ Đặc điểm phân biệt:
                          </p>
                          <ul className="text-sm text-amber-900 space-y-1 list-disc list-inside pl-4">
                            {symptom.distinguishingFeatures.map(
                              (feature, idx) => (
                                <li key={idx}>{feature}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                ))}
              </ol>
            </div>
            {/* ✅ KẾT THÚC KHUNG GOM NHÓM */}
          </div>
        ))}

        {partsToDisplay.length === 0 && filterPart !== "all" && (
          <div className="p-6 bg-yellow-50 rounded-lg text-yellow-800 border border-yellow-200">
            Không tìm thấy triệu chứng nào thuộc bộ phận '{filterPart}'.
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseSymptomsDetail;
