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
    // <-- updateData là đối tượng thuần
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
};

const updateDiseaseData = async () => {
  try {
    const diseasesData = [
      {
        diseaseName: "Rầy nâu",
        season: {
          seasons: [
            {
              type: "Cả năm",
              startMonth: 1,
              endMonth: 12,
              peakMonths: [3, 4, 10, 11],
              riskLevel: "Rất cao",
              description:
                "Rầy nâu phát triển liên tục, đặc biệt là các vụ trồng gối vụ. Mật độ cao và nguy cơ 'cháy rầy' thường xảy ra vào cuối các vụ chính (trước thu hoạch).",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Đạo ôn",
        season: {
          seasons: [
            {
              type: "Đông Xuân",
              startMonth: 11,
              endMonth: 4,
              peakMonths: [1, 2, 3],
              riskLevel: "Rất cao",
              description:
                "Bệnh bùng phát mạnh do nhiệt độ thấp (20-25°C), ẩm độ cao, mưa phùn và sương mù dày đặc. Nguy hiểm nhất là đạo ôn cổ bông ở giai đoạn trổ.",
            },
            {
              type: "Hè Thu",
              startMonth: 4,
              endMonth: 8,
              peakMonths: [5, 6],
              riskLevel: "Cao",
              description:
                "Vẫn xuất hiện trên lá khi có những đợt mưa dầm và bón thừa đạm.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Lem lép hạt",
        season: {
          seasons: [
            {
              type: "Hè Thu",
              startMonth: 4,
              endMonth: 8,
              peakMonths: [6, 7],
              riskLevel: "Rất cao",
              description:
                "Nguy cơ cao nhất khi lúa trổ gặp mưa kéo dài hoặc thời tiết âm u, tạo điều kiện ẩm ướt cho nhiều loại nấm và vi khuẩn tấn công hạt lúa.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Cháy bìa lá",
        season: {
          seasons: [
            {
              type: "Hè Thu",
              startMonth: 4,
              endMonth: 8,
              peakMonths: [7, 8],
              riskLevel: "Rất cao",
              description:
                "Lây lan mạnh mẽ sau các cơn mưa bão lớn kèm gió mạnh làm lá bị rách, kết hợp nhiệt độ cao giúp vi khuẩn phát triển nhanh chóng.",
            },
          ],
        },
      },
      {
        diseaseName: "Sâu cuốn lá",
        season: {
          seasons: [
            {
              type: "Hè Thu",
              startMonth: 4,
              endMonth: 8,
              peakMonths: [5, 6],
              riskLevel: "Cao",
              description:
                "Sâu cuốn lá lớn phát triển mạnh mẽ nhất, gây thiệt hại nặng nề ở giai đoạn lúa đẻ nhánh do nguồn thức ăn dồi dào và nhiệt độ cao.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Khô vằn",
        season: {
          seasons: [
            {
              type: "Hè Thu",
              startMonth: 4,
              endMonth: 8,
              peakMonths: [6, 7],
              riskLevel: "Rất cao",
              description:
                "Thời tiết nóng ẩm, mưa nhiều kết hợp với gieo sạ dày và bón thừa đạm là điều kiện lý tưởng để nấm lây lan từ gốc lên bẹ lá.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Vàng lùn",
        season: {
          seasons: [
            {
              type: "Cả năm",
              startMonth: 1,
              endMonth: 12,
              peakMonths: [3, 7, 11],
              riskLevel: "Rất cao",
              description:
                "Bệnh virus do Rầy nâu truyền, bùng phát thành dịch lớn khi rầy di trú mạnh và trồng lúa liên tục không có thời gian cách ly.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Lùn xoắn lá",
        season: {
          seasons: [
            {
              type: "Cả năm",
              startMonth: 1,
              endMonth: 12,
              peakMonths: [3, 7, 11],
              riskLevel: "Rất cao",
              description:
                "Bệnh virus thường đi kèm Vàng lùn, do Rầy nâu truyền, gây biến dạng cây và mất khả năng trổ bông.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Đốm nâu",
        season: {
          seasons: [
            {
              type: "Đông Xuân",
              startMonth: 11,
              endMonth: 4,
              peakMonths: [12, 1],
              riskLevel: "Cao",
              description:
                "Gây hại nặng trên các ruộng chua, phèn, thiếu dinh dưỡng (K, Mn), thường xuất hiện sớm ở giai đoạn mạ và đẻ nhánh khi thời tiết ẩm ướt.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Lúa von",
        season: {
          seasons: [
            {
              type: "Đông Xuân",
              startMonth: 11,
              endMonth: 1,
              peakMonths: [12],
              riskLevel: "Cao",
              description:
                "Bệnh nấm phát sinh ở các trà lúa gieo sạ dày vào mùa lạnh ẩm. Gây hiện tượng cây lúa von cao bất thường và chết yểu.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Sọc trong",
        season: {
          seasons: [
            {
              type: "Hè Thu",
              startMonth: 4,
              endMonth: 8,
              peakMonths: [5, 6],
              riskLevel: "Rất cao",
              description:
                "Bệnh virus do Rầy xanh đuôi đen truyền. Phổ biến trong điều kiện ấm áp và ẩm ướt, ruộng lúa gần nguồn cỏ dại.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Thối bẹ",
        season: {
          seasons: [
            {
              type: "Hè Thu",
              startMonth: 4,
              endMonth: 8,
              peakMonths: [7, 8],
              riskLevel: "Cao",
              description:
                "Phát triển mạnh vào giai đoạn lúa làm đòng và trổ, khi có mưa ẩm và nhiệt độ cao, làm bẹ lá thối, gây nghẹt đòng.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Vàng lá chín sớm",
        season: {
          seasons: [
            {
              type: "Tất cả các vụ",
              startMonth: 1,
              endMonth: 12,
              peakMonths: [8, 12],
              riskLevel: "Trung bình",
              description:
                "Đây chủ yếu là bệnh sinh lý do thiếu Kali hoặc Lân. Thường rõ rệt nhất ở giai đoạn lúa ôm đòng đến chín khi cây cần dinh dưỡng lớn.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Thối thân",
        season: {
          seasons: [
            {
              type: "Hè Thu",
              startMonth: 4,
              endMonth: 8,
              peakMonths: [7, 8],
              riskLevel: "Nặng",
              description:
                "Gây hại nghiêm trọng khi ruộng lúa luôn bị ngập nước (đặc biệt là gần mặt nước) và nhiệt độ cao, làm thân lúa bị thối mềm và đổ ngã.",
            },
          ],
        },
      },
      {
        diseaseName: "Bệnh Đốm vòng",
        season: {
          seasons: [
            {
              type: "Đông Xuân",
              startMonth: 11,
              endMonth: 4,
              peakMonths: [1, 2],
              riskLevel: "Trung bình",
              description:
                "Phát triển khi thời tiết ẩm ướt và mát mẻ, thường gây hại trên các lá già ở phần dưới của cây lúa.",
            },
          ],
        },
      },
      {
        diseaseName: "Sâu Đục thân",
        season: {
          seasons: [
            {
              type: "Đông Xuân",
              startMonth: 11,
              endMonth: 4,
              peakMonths: [3, 4],
              riskLevel: "Rất cao",
              description:
                "Các lứa sâu non phát triển mạnh ở giai đoạn đẻ nhánh (gây 'dảnh héo') và làm đòng - trổ (gây 'bông bạc'), ảnh hưởng lớn đến năng suất.",
            },
            {
              type: "Hè Thu",
              startMonth: 4,
              endMonth: 8,
              peakMonths: [6, 7],
              riskLevel: "Cao",
              description:
                "Thiệt hại tập trung vào giai đoạn lúa trổ, bướm nở rộ và đẻ trứng vào thời điểm lúa non.",
            },
          ],
        },
      },
      {
        diseaseName: "Bọ trĩ",
        season: {
          seasons: [
            {
              type: "Đầu vụ Hè Thu",
              startMonth: 3,
              endMonth: 5,
              peakMonths: [4],
              riskLevel: "Rất cao",
              description:
                "Gây hại khủng khiếp nhất trong điều kiện nắng nóng và khô hạn kéo dài, đặc biệt là ở giai đoạn mạ và lúa non.",
            },
          ],
        },
      },
      {
        diseaseName: "Nhện gié",
        season: {
          seasons: [
            {
              type: "Hè Thu",
              startMonth: 6,
              endMonth: 8,
              peakMonths: [7],
              riskLevel: "Cao",
              description:
                "Phát triển mạnh khi gặp thời tiết nóng ẩm và mưa nhẹ, gây hại tiềm ẩn ở giai đoạn làm đòng, làm lúa nghẹt và lem lép hạt khi trổ.",
            },
          ],
        },
      },
      {
        diseaseName: "Muỗi hành",
        season: {
          seasons: [
            {
              type: "Đầu vụ Hè Thu",
              startMonth: 4,
              endMonth: 6,
              peakMonths: [5],
              riskLevel: "Rất cao",
              description:
                "Thường phát sinh khi có mưa lớn vào đầu vụ, tạo điều kiện cho muỗi trưởng thành đẻ trứng, gây hại nặng ở giai đoạn lúa non ('ống hành').",
            },
          ],
        },
      },
      {
        diseaseName: "Bọ xít hôi",
        season: {
          seasons: [
            {
              type: "Giai đoạn trổ",
              startMonth: 6,
              endMonth: 9,
              peakMonths: [7, 8],
              riskLevel: "Rất cao",
              description:
                "Gây hại tập trung vào lúc lúa bắt đầu vào chắc, chúng hút sữa hạt làm hạt lép lửng, phổ biến ở tất cả các vụ nếu lúa trổ rộ.",
            },
          ],
        },
      },
    ];

    await connectDB();
    console.log("Starting database update...");

    for (const item of diseasesData) {
      // 1. Cập nhật hoặc Tạo mới Disease chính (Dựa theo name)
      // Sử dụng name làm key để tìm kiếm
      const disease = await Disease.findOneAndUpdate(
        { name: item.diseaseName } // Query (Tìm kiếm theo Tên)
      );

      console.log(`Updated Disease: ${disease.name}`);

      // 2. Cập nhật các bảng vệ tinh (Dựa theo diseaseId)
      // Dùng disease._id vừa lấy được để update các bảng con

      if (item.season) {
        await upsertData(
          DiseaseSeason,
          { diseaseId: disease._id },
          { ...item.season, diseaseId: disease._id }
        );
        console.log(`Updated DiseaseSeasons: ${disease.name}`);
      }

      if (item.cause) {
        await upsertData(
          DiseaseCause,
          { diseaseId: disease._id },
          { ...item.cause, diseaseId: disease._id }
        );
      }

      if (item.symptom) {
        await upsertData(
          DiseaseSymptom,
          { diseaseId: disease._id },
          { ...item.symptom, diseaseId: disease._id }
        );
        console.log(`Updated DiseaseSymptoms: ${disease.name}`);
      }

      if (item.prevention) {
        await upsertData(
          DiseasePrevention,
          { diseaseId: disease._id },
          { ...item.prevention, diseaseId: disease._id }
        );
      }

      if (item.treatment) {
        await upsertData(
          DiseaseTreatment,
          { diseaseId: disease._id },
          { ...item.treatment, diseaseId: disease._id }
        );
        console.log(`Updated DiseaseTreatments: ${disease.name}`);
      }

      if (item.weather) {
        await upsertData(
          WeatherDiseaseCorrelation,
          { diseaseId: disease._id },
          { ...item.weather, diseaseId: disease._id }
        );
        console.log(`Updated DiseaseWeathers: ${disease.name}`);
      }

      // Nếu có stage
      if (item.stage) {
        await upsertData(
          DiseaseStage,
          { diseaseId: disease._id },
          { ...item.stage, diseaseId: disease._id }
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
