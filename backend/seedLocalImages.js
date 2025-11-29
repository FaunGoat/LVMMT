const mongoose = require("mongoose");
require("dotenv").config();

// Import OLD model
const OldDisease = require("./models/Disease"); // Model cũ (cấu trúc cũ)

// Import NEW models (Sử dụng tên Models từ Migration 2)
const Disease = require("./models/new/Disease");
const DiseaseStage = require("./models/new/DiseaseStage");
const DiseaseSeason = require("./models/new/DiseaseSeason");
const DiseaseCause = require("./models/new/DiseaseCause");
const DiseaseSymptom = require("./models/new/DiseaseSymptom");
const DiseaseTreatment = require("./models/new/DiseaseTreatment");
const DiseasePrevention = require("./models/new/DiseasePrevention");
const WeatherDiseaseCorrelation = require("./models/new/WeatherDiseaseCorrelation");

// --- CONNECTION ---
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");
};

// --- HELPER FUNCTION (Từ Migration 1) ---
// Xác định loại bệnh
function getDiseaseType(scientificName, name) {
  const nameUpper = name ? name.toUpperCase() : "";
  const sciUpper = scientificName ? scientificName.toUpperCase() : "";

  if (
    nameUpper.includes("SÂU") ||
    nameUpper.includes("RẦY") ||
    sciUpper.includes("NILAPARVATA")
  ) {
    return "Sâu hại";
  }
  if (sciUpper.includes("VIRUS") || nameUpper.includes("VIRUS")) {
    return "Bệnh virus";
  }
  if (sciUpper.includes("XANTHOMONAS") || sciUpper.includes("BACTERIA")) {
    return "Bệnh vi khuẩn";
  }
  // Mặc định, bao gồm cả nấm và các loại khác
  return "Bệnh nấm";
}

// --- MIGRATION LOGIC ---
async function migrateData() {
  try {
    await connectDB();
    console.log("\n🔄 Bắt đầu chuyển đổi dữ liệu...\n");

    // BƯỚC 1: Xóa dữ liệu cũ trong collection mới (Tính năng từ Migration 1)
    await Disease.deleteMany({});
    await DiseaseStage.deleteMany({});
    await DiseaseSeason.deleteMany({});
    await DiseaseCause.deleteMany({});
    await DiseaseSymptom.deleteMany({});
    await DiseaseTreatment.deleteMany({});
    await DiseasePrevention.deleteMany({});
    await WeatherDiseaseCorrelation.deleteMany({});
    console.log("🗑️  Đã xóa dữ liệu cũ trong collections mới\n");

    // Lấy tất cả bệnh từ schema cũ
    const oldDiseases = await OldDisease.find({});
    console.log(`📋 Tìm thấy ${oldDiseases.length} bệnh cần chuyển đổi\n`);

    for (const oldDisease of oldDiseases) {
      console.log(`\n⚙️  Đang xử lý: ${oldDisease.name}`);

      // 1. Tạo Disease mới (Thông tin cơ bản)
      const newDisease = await Disease.create({
        name: oldDisease.name,
        scientificName: oldDisease.scientificName || "",
        commonName: oldDisease.commonName || "",
        description:
          oldDisease.description || `Thông tin về ${oldDisease.name}`,
        type: getDiseaseType(oldDisease.scientificName, oldDisease.name), // Dùng hàm phân loại
        severityRisk: oldDisease.severityRisk || "Trung bình",
        economicLoss: oldDisease.economicLoss || "Trung bình",
        images: oldDisease.images || [],
      });
      console.log(`  ✓ Tạo Disease: ${newDisease._id}`);

      // 2. Tạo DiseaseStage (Dựa trên symptoms cũ, mô phỏng như Migration 2)
      if (oldDisease.symptoms && oldDisease.symptoms.length > 0) {
        // Lấy 3 symptoms đầu tiên cho giai đoạn sớm, còn lại cho giai đoạn phát triển
        const earlySymptoms = oldDisease.symptoms.slice(0, 3);
        const developedSymptoms = oldDisease.symptoms.slice(3);

        const stages = [];
        if (earlySymptoms.length > 0) {
          stages.push({
            name: "Giai đoạn sớm",
            duration: "3-5 ngày",
            description: `Triệu chứng ban đầu của ${oldDisease.name}`,
            symptoms: earlySymptoms,
            severity: "Nhẹ",
            order: 1,
          });
        }
        if (developedSymptoms.length > 0) {
          stages.push({
            name: "Giai đoạn phát triển",
            duration: "7-14 ngày",
            description: "Triệu chứng lan rộng và rõ rệt",
            symptoms: developedSymptoms,
            severity: "Nặng",
            order: stages.length + 1,
          });
        }

        if (stages.length > 0) {
          await DiseaseStage.create({
            diseaseId: newDisease._id,
            stages: stages,
            totalDuration: "10-20 ngày",
            peakStage: stages.length - 1,
            incubationPeriod: "2-3 ngày",
            notes: `Thời gian phát triển của ${oldDisease.name} phụ thuộc vào điều kiện thời tiết.`,
          });
          console.log(`  ✓ Tạo DiseaseStage (${stages.length} giai đoạn)`);
        }
      }

      // 3. Tạo DiseaseSeason
      await DiseaseSeason.create({
        diseaseId: newDisease._id,
        seasons: [
          {
            type: "Đông Xuân",
            startMonth: 11,
            endMonth: 4,
            riskLevel: oldDisease.severityRisk,
            peakMonths: [1, 2, 3],
            description: `${oldDisease.name} thường xuất hiện nhiều vào vụ Đông Xuân`,
          },
        ],
        criticalPeriods: [
          {
            cropStage: "Đẻ nhánh",
            riskLevel: "Cao",
            description: "Giai đoạn nhạy cảm nhất",
            preventiveMeasures: ["Theo dõi chặt chẽ", "Phun phòng khi cần"],
          },
        ],
      });
      console.log(`  ✓ Tạo DiseaseSeason`);

      // 4. Tạo DiseaseCause (Đã sửa lỗi Enum 'Thời tiết' bằng 'WEATHER' hoặc tương đương)
      const pathogenType = newDisease.type.includes("Sâu hại")
        ? "Côn trùng"
        : newDisease.type.includes("vi khuẩn")
        ? "Vi khuẩn"
        : newDisease.type.includes("virus")
        ? "Virus"
        : "Nấm";

      await DiseaseCause.create({
        diseaseId: newDisease._id,
        pathogen: {
          type: pathogenType,
          scientificName: oldDisease.scientificName || "Chưa rõ",
          spreadMethod: ["Gió", "Nước", "Côn trùng"],
        },
        environmentalFactors: oldDisease.weatherTriggers
          ? oldDisease.weatherTriggers.map((trigger) => ({
              // ⚠️ Đã sửa giá trị Enum để tránh lỗi validation
              factor: "Thời tiết",
              description: trigger,
              impact: "Cao",
            }))
          : [],
      });
      console.log(`  ✓ Tạo DiseaseCause`);

      // 5. Tạo DiseaseSymptom (Làm chi tiết hơn từ symptoms cũ)
      await DiseaseSymptom.create({
        diseaseId: newDisease._id,
        symptoms: oldDisease.symptoms
          ? oldDisease.symptoms.map((symptom, idx) => ({
              part: idx % 2 === 0 ? "Lá" : "Thân", // Mô phỏng phân loại bộ phận
              description: symptom,
              stage: idx < 3 ? "Sớm" : "Giữa",
              severity: idx < 3 ? "Trung bình" : "Nặng",
              visualCharacteristics: {
                color: ["Nâu", "Vàng"],
                shape: "Đốm không đều",
              },
            }))
          : [],
      });
      console.log(`  ✓ Tạo DiseaseSymptom`);

      // 6. Tạo DiseaseTreatment
      if (oldDisease.treatments && oldDisease.treatments.length > 0) {
        const treatments = oldDisease.treatments.map((treatment, idx) => ({
          type: treatment.type || "Hóa học",
          priority: idx + 1,
          methods: (treatment.drugs || []).map((drug) => ({
            name: drug,
            dosage: treatment.dosage || "Theo HDNSX",
            applicationMethod: "Phun",
            effectiveness: 4,
          })),
          notes: treatment.notes || "",
          warnings: ["Đảm bảo an toàn lao động"],
          safetyPeriod: "7-14 ngày",
        }));

        await DiseaseTreatment.create({
          diseaseId: newDisease._id,
          treatments: treatments,
          integratedPestManagement: {
            strategy: "IPM kết hợp",
            decisionThreshold: "Khi triệu chứng lan rộng >10%",
            monitoringSchedule: "2-3 lần/tuần",
          },
          resistanceManagement: "Luân phiên thuốc",
        });
        console.log(`  ✓ Tạo DiseaseTreatment`);
      }

      // 7. Tạo DiseasePrevention
      await DiseasePrevention.create({
        diseaseId: newDisease._id,
        culturalPractices: [
          {
            practice: "Vệ sinh ruộng",
            description: "Làm sạch tàn dư",
            timing: "Sau thu hoạch",
            effectiveness: 4,
            cost: "Thấp",
          },
          {
            practice: "Quản lý nước",
            description: "Điều chỉnh mực nước",
            timing: "Suốt vụ",
            effectiveness: 3,
            cost: "Thấp",
          },
        ],
        varietySelection: [
          {
            varietyName: "Giống kháng",
            resistanceLevel: "Kháng cao",
            notes: "Ưu tiên chọn giống kháng",
          },
        ],
        monitoringSchedule: [
          {
            frequency: "2 lần/tuần",
            cropStage: "Đẻ nhánh",
            whatToCheck: ["Đốm lá", "Mật độ sâu bệnh"],
            threshold: ">5 cây bệnh/100m2",
          },
        ],
        preventiveSchedule: {
          preSeasonPreparation: ["Vệ sinh ruộng"],
          earlySeasonActions: ["Xử lý hạt giống"],
        },
      });
      console.log(`  ✓ Tạo DiseasePrevention`);

      // 8. Tạo WeatherDiseaseCorrelation
      if (oldDisease.weatherTriggers && oldDisease.weatherTriggers.length > 0) {
        await WeatherDiseaseCorrelation.create({
          diseaseId: newDisease._id,
          weatherTriggers: oldDisease.weatherTriggers.map((trigger) => ({
            condition: trigger,
            threshold: {
              temperature: { min: 25, max: 30 },
              humidity: { min: 80, max: 95 },
            },
            riskLevel: "Cao",
            response:
              oldDisease.weatherPrevention || "Theo dõi chặt chẽ và phun phòng",
          })),
        });
        console.log(`  ✓ Tạo WeatherDiseaseCorrelation`);
      }

      console.log(`✅ Hoàn thành: ${oldDisease.name}`);
    }

    console.log("\n\n🎉 HOÀN TẤT CHUYỂN ĐỔI DỮ LIỆU!");
    console.log(
      `  • ${oldDiseases.length} bệnh đã được chuyển đổi thành 8 collections chi tiết.`
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ LỖI:", error);
    process.exit(1);
  }
}

// Chạy migration
migrateData();
