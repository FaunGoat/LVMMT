import React from "react";

const DiseasePrevention = ({ prevention }) => {
  if (!prevention) return null;

  const getCostColor = (cost) => {
    const colors = {
      Thấp: "text-green-600",
      "Trung bình": "text-yellow-600",
      Cao: "text-orange-600",
      "Rất cao": "text-red-600",
    };
    return colors[cost] || "text-gray-600";
  };

  const getResistanceColor = (level) => {
    const colors = {
      "Kháng cao": "bg-green-100 text-green-800",
      "Kháng trung bình": "bg-blue-100 text-blue-800",
      "Dung nạp": "bg-yellow-100 text-yellow-800",
      "Nhạy cảm": "bg-orange-100 text-orange-800",
      "Rất nhạy cảm": "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const getImportanceColor = (importance) => {
    const colors = {
      "Rất quan trọng": "bg-red-100 text-red-800",
      "Quan trọng": "bg-orange-100 text-orange-800",
      "Nên làm": "bg-blue-100 text-blue-800",
    };
    return colors[importance] || "bg-gray-100 text-gray-800";
  };

  const renderArray = (items) => (
    <ul className="list-disc list-inside space-y-0.5 text-sm text-gray-700">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-sky-700 mb-6 flex items-center gap-2">
        <span>Phòng ngừa Bệnh</span>
      </h3>

      {/* Cultural Practices (Canh tác) - Existing */}
      {prevention.culturalPractices &&
        prevention.culturalPractices.length > 0 && (
          <div className="space-y-4 mb-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Canh tác
            </h4>
            {prevention.culturalPractices.map((practice, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-5">
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {practice.practice}
                </h5>

                <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                  {practice.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  {practice.timing && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Thời gian:</span>
                      <span className="font-semibold text-gray-800">
                        {practice.timing}
                      </span>
                    </div>
                  )}
                  {practice.cost && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Chi phí:</span>
                      <span
                        className={`font-semibold ${getCostColor(
                          practice.cost
                        )}`}
                      >
                        {practice.cost}
                      </span>
                    </div>
                  )}
                  {practice.laborRequirement && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Lao động:</span>
                      <span className="font-semibold text-gray-800">
                        {practice.laborRequirement}
                      </span>
                    </div>
                  )}
                </div>
                {practice.benefits && practice.benefits.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-700 text-sm mb-1">
                      Lợi ích:
                    </p>
                    {renderArray(practice.benefits)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      {/* Variety Selection (Giống lúa) - Existing */}
      {prevention.varietySelection &&
        prevention.varietySelection.length > 0 && (
          <div className="mb-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Giống lúa
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevention.varietySelection.map((variety, idx) => (
                <div key={idx} className="bg-white border rounded-lg p-5">
                  <h5 className="text-lg font-bold text-gray-800 mb-2">
                    {variety.varietyName}
                  </h5>

                  {variety.scientificName && (
                    <p className="text-sm text-gray-600 italic mb-3">
                      {variety.scientificName}
                    </p>
                  )}

                  <div className="mb-4">
                    <span
                      className={`${getResistanceColor(
                        variety.resistanceLevel
                      )} px-3 py-1.5 rounded border text-sm font-semibold inline-block`}
                    >
                      {variety.resistanceLevel}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {variety.yieldPotential && (
                      <div>
                        <span className="font-semibold text-gray-700">
                          Năng suất:
                        </span>{" "}
                        <span className="text-gray-600">
                          {variety.yieldPotential}
                        </span>
                      </div>
                    )}
                    {variety.growthDuration && (
                      <div>
                        <span className="font-semibold text-gray-700">
                          Thời gian sinh trưởng:
                        </span>{" "}
                        <span className="text-gray-600">
                          {variety.growthDuration}
                        </span>
                      </div>
                    )}
                    {variety.resistanceGenes &&
                      variety.resistanceGenes.length > 0 && (
                        <div>
                          <span className="font-semibold text-gray-700">
                            Gen kháng:
                          </span>{" "}
                          <span className="text-gray-600">
                            {variety.resistanceGenes.join(", ")}
                          </span>
                        </div>
                      )}
                    {variety.notes && (
                      <div className="bg-yellow-50 border-l-3 border-yellow-400 p-3 mt-3">
                        <p className="text-sm text-gray-700">{variety.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Seed Treatment (Xử lý hạt giống) - New */}
      {prevention.seedTreatment && prevention.seedTreatment.length > 0 && (
        <div className="space-y-4 mb-8">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            Xử lý Hạt giống
          </h4>
          {prevention.seedTreatment.map((treatment, idx) => (
            <div key={idx} className="bg-white border rounded-lg p-5">
              <h5 className="text-lg font-bold text-gray-800 mb-3">
                {treatment.method}
              </h5>

              <div className="flex flex-wrap gap-4 text-sm mb-3">
                {treatment.cost && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Chi phí:</span>
                    <span
                      className={`font-semibold ${getCostColor(
                        treatment.cost
                      )}`}
                    >
                      {treatment.cost}
                    </span>
                  </div>
                )}
                {treatment.effectiveness && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Hiệu quả (1-5):</span>
                    <span className="font-semibold text-blue-700">
                      {treatment.effectiveness}
                    </span>
                  </div>
                )}
              </div>
              {treatment.materials && treatment.materials.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-700 text-sm mb-1">
                    Vật liệu:
                  </p>
                  {renderArray(treatment.materials)}
                </div>
              )}
              {treatment.procedure && treatment.procedure.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-700 text-sm mb-1">
                    Quy trình:
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-sm text-gray-700">
                    {treatment.procedure.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Soil Management (Quản lý Đất) - New */}
      {prevention.soilManagement && prevention.soilManagement.length > 0 && (
        <div className="space-y-4 mb-8">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            Quản lý Đất
          </h4>
          {prevention.soilManagement.map((soil, idx) => (
            <div key={idx} className="bg-white border rounded-lg p-5">
              <h5 className="text-lg font-bold text-gray-800 mb-3">
                {soil.practice}
              </h5>
              {soil.description && (
                <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                  {soil.description}
                </p>
              )}
              {soil.timing && (
                <div className="text-sm">
                  <span className="font-semibold text-gray-700">
                    Thời gian:
                  </span>{" "}
                  <span className="text-gray-600">{soil.timing}</span>
                </div>
              )}
              {soil.benefits && soil.benefits.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-700 text-sm mb-1">
                    Lợi ích:
                  </p>
                  {renderArray(soil.benefits)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Water Management (Quản lý Nước) - New */}
      {prevention.waterManagement && prevention.waterManagement.length > 0 && (
        <div className="space-y-4 mb-8">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            Quản lý Nước
          </h4>
          {prevention.waterManagement.map((water, idx) => (
            <div key={idx} className="bg-white border rounded-lg p-5">
              <h5 className="text-lg font-bold text-gray-800 mb-3">
                {water.practice}
              </h5>
              {water.description && (
                <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                  {water.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                {water.timing && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-semibold text-gray-800">
                      {water.timing}
                    </span>
                  </div>
                )}
                {water.waterDepth && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Độ sâu:</span>
                    <span className="font-semibold text-gray-800">
                      {water.waterDepth}
                    </span>
                  </div>
                )}
              </div>
              {water.cropStage && water.cropStage.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold text-gray-700 text-sm mb-1">
                    Giai đoạn cây trồng:
                  </p>
                  <p className="text-sm text-gray-600">
                    {water.cropStage.join(", ")}
                  </p>
                </div>
              )}
              {water.precautions && water.precautions.length > 0 && (
                <div className="mt-4 bg-yellow-50 border-l-3 border-yellow-400 p-3">
                  <p className="font-semibold text-sm text-yellow-800 mb-1">
                    Lưu ý:
                  </p>
                  {renderArray(water.precautions)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Nutrition Management (Quản lý Dinh dưỡng) - New */}
      {prevention.nutritionManagement &&
        prevention.nutritionManagement.length > 0 && (
          <div className="space-y-4 mb-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Quản lý Dinh dưỡng
            </h4>
            {prevention.nutritionManagement.map((nutrition, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-5">
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {nutrition.nutrient}
                </h5>
                {nutrition.recommendation && (
                  <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                    {nutrition.recommendation}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  {nutrition.timing && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Thời gian:</span>
                      <span className="font-semibold text-gray-800">
                        {nutrition.timing}
                      </span>
                    </div>
                  )}
                  {nutrition.application && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Cách bón:</span>
                      <span className="font-semibold text-gray-800">
                        {nutrition.application}
                      </span>
                    </div>
                  )}
                </div>
                {nutrition.notes && (
                  <div className="mt-4 bg-blue-50 border-l-3 border-blue-400 p-3">
                    <p className="text-sm text-blue-800">{nutrition.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      {/* Sanitation Practices (Vệ sinh Đồng ruộng) - New */}
      {prevention.sanitationPractices &&
        prevention.sanitationPractices.length > 0 && (
          <div className="space-y-4 mb-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Vệ sinh Đồng ruộng
            </h4>
            {prevention.sanitationPractices.map((sanitation, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-5">
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {sanitation.practice}
                </h5>
                <div className="flex flex-wrap gap-4 text-sm mb-3">
                  {sanitation.timing && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Thời gian:</span>
                      <span className="font-semibold text-gray-800">
                        {sanitation.timing}
                      </span>
                    </div>
                  )}
                  {sanitation.importance && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Tầm quan trọng:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${getImportanceColor(
                          sanitation.importance
                        )}`}
                      >
                        {sanitation.importance}
                      </span>
                    </div>
                  )}
                </div>
                {sanitation.procedure && sanitation.procedure.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-700 text-sm mb-1">
                      Quy trình:
                    </p>
                    <ol className="list-decimal list-inside space-y-0.5 text-sm text-gray-700">
                      {sanitation.procedure.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      {/* Crop Rotation (Luân canh) - New */}
      {/* {prevention.cropRotation && (
        <div className="space-y-4 mb-8">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Luân canh</h4>
          <div className="bg-white border rounded-lg p-5">
            {prevention.cropRotation.recommendedCrops &&
              prevention.cropRotation.recommendedCrops.length > 0 && (
                <div className="mb-3">
                  <p className="font-semibold text-gray-700 text-sm mb-1">
                    Cây trồng khuyến nghị:
                  </p>
                  <p className="text-sm text-gray-600">
                    {prevention.cropRotation.recommendedCrops.join(", ")}
                  </p>
                </div>
              )}
            {prevention.cropRotation.rotationCycle && (
              <div className="mb-3">
                <p className="font-semibold text-gray-700 text-sm mb-1">
                  Chu kỳ luân canh:
                </p>
                <p className="text-sm text-gray-600">
                  {prevention.cropRotation.rotationCycle}
                </p>
              </div>
            )}
            {prevention.cropRotation.benefits &&
              prevention.cropRotation.benefits.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-700 text-sm mb-1">
                    Lợi ích:
                  </p>
                  {renderArray(prevention.cropRotation.benefits)}
                </div>
              )}
          </div>
        </div>
      )} */}

      {/* Biological Control (Kiểm soát Sinh học) - New */}
      {prevention.biologicalControl &&
        prevention.biologicalControl.length > 0 && (
          <div className="space-y-4 mb-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Kiểm soát Sinh học
            </h4>
            {prevention.biologicalControl.map((bio, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-5">
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {bio.agent}
                </h5>
                <div className="flex flex-wrap gap-4 text-sm mb-3">
                  {bio.timing && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Thời gian:</span>
                      <span className="font-semibold text-gray-800">
                        {bio.timing}
                      </span>
                    </div>
                  )}
                  {bio.cost && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Chi phí:</span>
                      <span
                        className={`font-semibold ${getCostColor(bio.cost)}`}
                      >
                        {bio.cost}
                      </span>
                    </div>
                  )}
                  {bio.effectiveness && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Hiệu quả (1-5):</span>
                      <span className="font-semibold text-blue-700">
                        {bio.effectiveness}
                      </span>
                    </div>
                  )}
                </div>
                {bio.application && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-700 text-sm mb-1">
                      Cách áp dụng:
                    </p>
                    <p className="text-sm text-gray-600">{bio.application}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      {/* Monitoring Schedule (Giám sát) - Existing */}
      {prevention.monitoringSchedule &&
        prevention.monitoringSchedule.length > 0 && (
          <div className="space-y-4 mb-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Giám sát
            </h4>
            {prevention.monitoringSchedule.map((schedule, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-800 text-white rounded w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      {schedule.frequency}
                    </p>
                    {schedule.cropStage && (
                      <p className="text-sm text-gray-600">
                        Giai đoạn: {schedule.cropStage}
                      </p>
                    )}
                  </div>
                </div>

                {schedule.whatToCheck && schedule.whatToCheck.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Kiểm tra:
                    </p>
                    <ul className="space-y-1.5">
                      {schedule.whatToCheck.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 pl-4 border-l-2 border-gray-300"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {schedule.threshold && (
                  <div className="bg-red-50 border-l-3 border-red-400 rounded p-3">
                    <p className="text-sm">
                      <span className="font-semibold text-red-700">
                        Ngưỡng cảnh báo:
                      </span>{" "}
                      <span className="text-red-600">{schedule.threshold}</span>
                    </p>
                  </div>
                )}
                {schedule.recordKeeping && (
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-semibold text-gray-700">
                      Ghi chép:
                    </span>{" "}
                    {schedule.recordKeeping}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      {/* Early Warning System (Hệ thống Cảnh báo Sớm) - New */}
      {/* {prevention.earlyWarningSystem && (
        <div className="space-y-4 mb-8">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            Hệ thống Cảnh báo Sớm
          </h4>
          <div className="bg-white border rounded-lg p-5">
            {prevention.earlyWarningSystem.indicators &&
              prevention.earlyWarningSystem.indicators.length > 0 && (
                <div className="mb-3">
                  <p className="font-semibold text-gray-700 text-sm mb-1">
                    Chỉ số cảnh báo:
                  </p>
                  <p className="text-sm text-gray-600">
                    {prevention.earlyWarningSystem.indicators.join(", ")}
                  </p>
                </div>
              )}
            {prevention.earlyWarningSystem.alertThresholds && (
              <div className="bg-red-50 border-l-3 border-red-400 rounded p-3 mb-3">
                <p className="text-sm">
                  <span className="font-semibold text-red-700">
                    Ngưỡng Kích hoạt:
                  </span>{" "}
                  <span className="text-red-600">
                    {prevention.earlyWarningSystem.alertThresholds}
                  </span>
                </p>
              </div>
            )}
            {prevention.earlyWarningSystem.responseProtocol &&
              prevention.earlyWarningSystem.responseProtocol.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-700 text-sm mb-1">
                    Quy trình phản hồi:
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-sm text-gray-700">
                    {prevention.earlyWarningSystem.responseProtocol.map(
                      (step, i) => (
                        <li key={i}>{step}</li>
                      )
                    )}
                  </ol>
                </div>
              )}
          </div>
        </div>
      )} */}

      {/* Quarantine Measures (Biện pháp Kiểm dịch) - New */}
      {prevention.quarantineMeasures &&
        prevention.quarantineMeasures.length > 0 && (
          <div className="space-y-4 mb-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Biện pháp Kiểm dịch
            </h4>
            {prevention.quarantineMeasures.map((q, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-5">
                <h5 className="text-lg font-bold text-gray-800 mb-3">
                  {q.measure}
                </h5>
                {q.description && (
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {q.description}
                  </p>
                )}
                {q.timing && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-700">
                      Thời gian áp dụng:
                    </span>{" "}
                    {q.timing}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      {/* Farm Hygiene (Vệ sinh Nông trại) - New */}
      {prevention.farmHygiene && prevention.farmHygiene.length > 0 && (
        <div className="space-y-4 mb-8">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            Vệ sinh Nông trại
          </h4>
          {prevention.farmHygiene.map((hygiene, idx) => (
            <div key={idx} className="bg-white border rounded-lg p-5">
              <h5 className="text-lg font-bold text-gray-800 mb-3">
                {hygiene.practice}
              </h5>
              {hygiene.frequency && (
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold text-gray-700">Tần suất:</span>{" "}
                  {hygiene.frequency}
                </p>
              )}
              {hygiene.procedure && hygiene.procedure.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-700 text-sm mb-1">
                    Quy trình:
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-sm text-gray-700">
                    {hygiene.procedure.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Preventive Schedule (Lịch trình Phòng ngừa) - Uncommented and Styled */}
      {prevention.preventiveSchedule &&
        (prevention.preventiveSchedule.preSeasonPreparation.length > 0 ||
          prevention.preventiveSchedule.earlySeasonActions.length > 0 ||
          prevention.preventiveSchedule.midSeasonActions.length > 0 ||
          prevention.preventiveSchedule.lateSeasonActions.length > 0 ||
          prevention.preventiveSchedule.postHarvestActions.length > 0) && (
          <div className="space-y-4 mb-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              Lịch trình Phòng ngừa
            </h4>

            {prevention.preventiveSchedule.preSeasonPreparation &&
              prevention.preventiveSchedule.preSeasonPreparation.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 shadow-md border-2 border-amber-200">
                  <h5 className="text-lg font-bold text-amber-800 mb-3">
                    Trước vụ
                  </h5>
                  {renderArray(
                    prevention.preventiveSchedule.preSeasonPreparation
                  )}
                </div>
              )}

            {prevention.preventiveSchedule.earlySeasonActions &&
              prevention.preventiveSchedule.earlySeasonActions.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-md border-2 border-green-200">
                  <h5 className="text-lg font-bold text-green-800 mb-3">
                    Đầu vụ
                  </h5>
                  {renderArray(
                    prevention.preventiveSchedule.earlySeasonActions
                  )}
                </div>
              )}

            {prevention.preventiveSchedule.midSeasonActions &&
              prevention.preventiveSchedule.midSeasonActions.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 shadow-md border-2 border-blue-200">
                  <h5 className="text-lg font-bold text-blue-800 mb-3">
                    Giữa vụ
                  </h5>
                  {renderArray(prevention.preventiveSchedule.midSeasonActions)}
                </div>
              )}

            {prevention.preventiveSchedule.lateSeasonActions &&
              prevention.preventiveSchedule.lateSeasonActions.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 shadow-md border-2 border-purple-200">
                  <h5 className="text-lg font-bold text-purple-800 mb-3">
                    Cuối vụ
                  </h5>
                  {renderArray(prevention.preventiveSchedule.lateSeasonActions)}
                </div>
              )}

            {prevention.preventiveSchedule.postHarvestActions &&
              prevention.preventiveSchedule.postHarvestActions.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 shadow-md border-2 border-orange-200">
                  <h5 className="text-lg font-bold text-orange-800 mb-3">
                    Sau thu hoạch
                  </h5>
                  {renderArray(
                    prevention.preventiveSchedule.postHarvestActions
                  )}
                </div>
              )}
          </div>
        )}

      {/* Cost-Effectiveness Summary (Hiệu quả Chi phí) - Existing */}
      {prevention.costEffectiveness && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-5">
          <h4 className="text-lg font-bold text-green-800 mb-3">
            Hiệu quả Chi phí
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {prevention.costEffectiveness.totalPreventionCost && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600">Chi phí phòng ngừa</p>
                <p className="text-lg font-bold text-green-700">
                  {prevention.costEffectiveness.totalPreventionCost}
                </p>
              </div>
            )}
            {prevention.costEffectiveness.potentialLossPrevented && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600">
                  Thiệt hại ngăn ngừa được
                </p>
                <p className="text-lg font-bold text-blue-700">
                  {prevention.costEffectiveness.potentialLossPrevented}
                </p>
              </div>
            )}
            {prevention.costEffectiveness.returnOnInvestment && (
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600">Lợi nhuận Đầu tư</p>
                <p className="text-lg font-bold text-purple-700">
                  {prevention.costEffectiveness.returnOnInvestment}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseasePrevention;
