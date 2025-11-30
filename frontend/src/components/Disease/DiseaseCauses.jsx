import React from "react";

const DiseaseCauses = ({ causes }) => {
  if (!causes) return null;

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-4">
        🔬 Nguyên nhân gây bệnh
      </h3>

      {/* Thông tin mầm bệnh */}
      {causes.pathogen && (
        <div className="bg-white rounded-lg shadow p-5 border mb-4">
          <h4 className="text-lg font-bold text-gray-800 mb-3">
            Mầm bệnh chính
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-50 rounded p-3 border border-purple-200">
              <p className="text-sm text-gray-600">Loại mầm bệnh</p>
              <p className="text-lg font-bold text-purple-700">
                {causes.pathogen.type}
              </p>
            </div>
            {causes.pathogen.scientificName && (
              <div className="bg-blue-50 rounded p-3 border border-blue-200">
                <p className="text-sm text-gray-600">Tên khoa học</p>
                <p className="text-lg font-bold text-blue-700">
                  {causes.pathogen.scientificName}
                </p>
              </div>
            )}
          </div>

          {causes.pathogen.lifecycle && (
            <div className="bg-gray-50 rounded p-3 border mb-3">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Vòng đời:
              </p>
              <p className="text-sm text-gray-800">
                {causes.pathogen.lifecycle}
              </p>
            </div>
          )}

          {causes.pathogen.spreadMethod &&
            causes.pathogen.spreadMethod.length > 0 && (
              <div className="bg-red-50 rounded p-3 border border-red-200">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  Phương thức lây lan:
                </p>
                <div className="flex flex-wrap gap-2">
                  {causes.pathogen.spreadMethod.map((method, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-red-700 text-sm px-3 py-1 rounded border border-red-300"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Yếu tố môi trường */}
      {causes.environmentalFactors &&
        causes.environmentalFactors.length > 0 && (
          <div className="bg-white rounded-lg shadow p-5 border mb-4">
            <h4 className="text-lg font-bold text-gray-800 mb-3">
              Yếu tố môi trường
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {causes.environmentalFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="bg-cyan-50 rounded p-3 border border-cyan-200"
                >
                  <p className="font-semibold text-cyan-800 mb-1">
                    {factor.factor}
                  </p>
                  {factor.optimalRange && (
                    <p className="text-sm text-cyan-700">
                      Điều kiện thuận lợi: {factor.optimalRange}
                    </p>
                  )}
                  {factor.description && (
                    <p className="text-sm text-gray-700 mt-1">
                      {factor.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Yếu tố cây trồng */}
      {causes.cropFactors && causes.cropFactors.length > 0 && (
        <div className="bg-white rounded-lg shadow p-5 border">
          <h4 className="text-lg font-bold text-gray-800 mb-3">
            Yếu tố cây trồng
          </h4>
          <div className="space-y-3">
            {causes.cropFactors.map((factor, idx) => (
              <div
                key={idx}
                className="bg-green-50 rounded p-3 border border-green-200"
              >
                <p className="font-semibold text-green-800 mb-1">
                  {factor.factor}
                </p>
                {factor.description && (
                  <p className="text-sm text-gray-700 mb-2">
                    {factor.description}
                  </p>
                )}
                {factor.preventionTips && factor.preventionTips.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-green-700 mb-1">
                      Phòng ngừa:
                    </p>
                    <ul className="text-xs text-green-900 space-y-1">
                      {factor.preventionTips.map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseCauses;
