const mongoose = require("mongoose");
require("dotenv").config();

// Import NEW models (Sử dụng tên Models từ Migration 2)
const Disease = require("./models/new/Disease");
const DiseaseStage = require("./models/new/DiseaseStage");
const DiseaseSeason = require("./models/new/DiseaseSeason");
const DiseaseCause = require("./models/new/DiseaseCause");
const DiseaseSymptom = require("./models/new/DiseaseSymptom");
const DiseaseTreatment = require("./models/new/DiseaseTreatment");
const DiseasePrevention = require("./models/new/DiseasePrevention");
const WeatherDiseaseCorrelation = require("./models/new/WeatherDiseaseCorrelation");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");
};

// Hàm tiện ích để Update hoặc Insert (Upsert)
const upsertData = async (Model, filter, updateData) => {
  return await Model.findOneAndUpdate(filter, updateData, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
};

const updateDiseaseData = async () => {
  try {
    const diseasesData = [
      // =========================================================================
      // 1. BỆNH ĐẠO ÔN
      // =========================================================================
      {
        info: {
          name: "Bệnh đạo ôn",
          economicLoss:
            "Có thể giảm năng suất tới 80% nếu không phòng trị kịp thời.",
        },
        related: {
          cause: {
            pathogen: {
              type: "Nấm",
              scientificName: "Pyricularia oryzae",
              commonName: "Nấm đạo ôn",
              spreadMethod: ["Gió", "Hạt giống", "Tàn dư cây trồng"],
              optimumConditions: "Nhiệt độ 20-28°C, độ ẩm >90%, trời âm u.",
            },
            cropFactors: [
              {
                factor: "Tình trạng dinh dưỡng",
                impact: "Rất cao",
                description:
                  "Bón thừa đạm (N) làm lá mềm yếu, bệnh phát triển mạnh.",
              },
            ],
          },
          symptom: {
            symptoms: [
              {
                part: "Lá",
                stage: "Sớm",
                severity: "Trung bình",
                description:
                  "Vết chấm kim, sau phát triển thành hình thoi, tâm màu xám trắng, viền nâu.",
                visualCharacteristics: {
                  shape: "Hình thoi",
                  color: ["Xám trắng", "Nâu"],
                  location: "Giữa lá",
                },
              },
              {
                part: "Bông",
                stage: "Muộn",
                severity: "Rất nặng",
                description:
                  "Vết bệnh màu nâu đen ở cổ bông, làm bông bạc trắng hoặc gãy cổ bông.",
                visualCharacteristics: {
                  color: ["Nâu đen"],
                  location: "Cổ bông",
                },
              },
            ],
          },
        },
      },
      // =========================================================================
      // 2. BỆNH CHÁY BÌA LÁ
      // =========================================================================
      {
        info: {
          name: "Bệnh cháy bìa lá",
          economicLoss: "Gây lép hạt, giảm năng suất 20-50%.",
        },
        related: {
          cause: {
            pathogen: {
              type: "Vi khuẩn",
              scientificName: "Xanthomonas oryzae",
              spreadMethod: ["Nước tưới", "Mưa gió"],
              optimumConditions: "Nhiệt độ 26-30°C, độ ẩm cao, mưa to gió lớn.",
            },
          },
          symptom: {
            symptoms: [
              {
                part: "Lá",
                stage: "Giữa",
                severity: "Nặng",
                description:
                  "Vết bệnh bắt đầu từ chóp hoặc mép lá, lan dần vào trong thành vệt dài màu vàng hoặc trắng xám.",
                visualCharacteristics: {
                  color: ["Vàng", "Trắng xám"],
                  pattern: "Lan tỏa từ mép",
                  texture: "Khô",
                },
              },
            ],
          },
        },
      },
      // =========================================================================
      // 3. BỆNH LEM LÉP HẠT
      // =========================================================================
      {
        info: {
          name: "Bệnh lem lép hạt",
          economicLoss: "Giảm chất lượng gạo, năng suất và giá tiền giảm 30%.",
        },
        related: {
          cause: {
            pathogen: {
              type: "Nấm",
              scientificName: "Đa tác nhân",
              description: "Do nhiều loại nấm và vi khuẩn cộng hưởng.",
              optimumConditions: "Độ ẩm không khí cao khi trổ.",
            },
          },
          symptom: {
            symptoms: [
              {
                part: "Hạt",
                stage: "Muộn",
                severity: "Trung bình",
                description:
                  "Vỏ trấu có đốm màu nâu, đen, tím hoặc biến màu toàn bộ. Hạt gạo bên trong bị teo hoặc lép hoàn toàn.",
                visualCharacteristics: {
                  part: "Hạt",
                  color: ["Đen", "Nâu"],
                  texture: "Lép",
                },
              },
            ],
          },
        },
      },
      // =========================================================================
      // 4. RẦY NÂU
      // =========================================================================
      {
        info: {
          name: "Rầy nâu",
          economicLoss: "Gây cháy rầy diện rộng, mất trắng năng suất.",
        },
        related: {
          cause: {
            pathogen: {
              type: "Côn trùng",
              scientificName: "Nilaparvata lugens",
              spreadMethod: ["Di cư theo gió", "Nhân mật số tại chỗ"],
              optimumConditions: "Lúa rậm rạp, ẩm độ gốc cao, bón thừa đạm.",
            },
          },
          symptom: {
            symptoms: [
              {
                part: "Gốc",
                stage: "Tất cả",
                severity: "Rất nặng",
                description:
                  "Rầy bám dày đặc ở gốc lúa sát mặt nước. Cây lúa vàng úa, khô héo.",
                visualCharacteristics: {
                  location: "Gốc lúa",
                  color: ["Nâu đất (rầy)", "Vàng khô (cây)"],
                },
              },
            ],
          },
          prevention: {
            culturalPractices: [
              {
                practice: "Né rầy",
                description: "Xuống giống tập trung, né đợt rầy di trú.",
                timing: "Đầu vụ",
              },
            ],
          },
        },
      },
      // =========================================================================
      // 5. SÂU CUỐN LÁ
      // =========================================================================
      {
        info: {
          name: "Sâu cuốn lá",
        },
        related: {
          cause: {
            pathogen: {
              type: "Côn trùng",
              scientificName: "Cnaphalocrocis medinalis",
              optimumConditions: "Ruộng bón thừa đạm, lá xanh tốt.",
            },
          },
          symptom: {
            symptoms: [
              {
                part: "Lá",
                stage: "Giữa",
                severity: "Trung bình",
                description:
                  "Lá lúa bị cuốn gập lại theo chiều dọc, bên trong có sâu non.",
                visualCharacteristics: {
                  shape: "Ống cuốn",
                  color: ["Xanh (ngoài)", "Trắng (trong)"],
                },
              },
            ],
          },
        },
      },
    ];

    await connectDB();
    console.log("Starting database update...");

    for (const item of diseasesData) {
      // 1. Cập nhật hoặc Tạo mới Disease chính (Dựa theo name)
      // Sử dụng name làm key để tìm kiếm
      const disease = await upsertData(
        Disease,
        { name: item.info.name },
        item.info
      );

      console.log(`Updated Disease: ${disease.name}`);

      // 2. Cập nhật các bảng vệ tinh (Dựa theo diseaseId)
      // Dùng disease._id vừa lấy được để update các bảng con

      if (item.related.season) {
        await upsertData(
          DiseaseSeason,
          { diseaseId: disease._id },
          { ...item.related.season, diseaseId: disease._id }
        );
      }

      if (item.related.cause) {
        await upsertData(
          DiseaseCause,
          { diseaseId: disease._id },
          { ...item.related.cause, diseaseId: disease._id }
        );
      }

      if (item.related.symptom) {
        await upsertData(
          DiseaseSymptom,
          { diseaseId: disease._id },
          { ...item.related.symptom, diseaseId: disease._id }
        );
      }

      if (item.related.prevention) {
        await upsertData(
          DiseasePrevention,
          { diseaseId: disease._id },
          { ...item.related.prevention, diseaseId: disease._id }
        );
      }

      if (item.related.treatment) {
        await upsertData(
          DiseaseTreatment,
          { diseaseId: disease._id },
          { ...item.related.treatment, diseaseId: disease._id }
        );
      }

      if (item.related.weather) {
        await upsertData(
          WeatherDiseaseCorrelation,
          { diseaseId: disease._id },
          { ...item.related.weather, diseaseId: disease._id }
        );
      }

      // Nếu có stage
      if (item.related.stage) {
        await upsertData(
          DiseaseStage,
          { diseaseId: disease._id },
          { ...item.related.stage, diseaseId: disease._id }
        );
      }
    }

    console.log("All data updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Update failed:", error);
    process.exit(1);
  }
};

// Chạy hàm update
updateDiseaseData();
