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
      {
        diseaseId: "692c6df62ef6ee9bd8d70ff2",
        diseaseName: "Rầy nâu",
        symptoms: [
          {
            part: "Gốc",
            description: "Rầy tụ tập dày đặc, xuất hiện mật ngọt (honeydew).",
            stage: "Đẻ nhánh",
            severity: "Nặng",
          },
          {
            part: "Toàn cây",
            description:
              "Lúa chuyển vàng úa, khô cháy từ ngọn xuống gốc ('cháy rầy').",
            stage: "Cuối vụ",
            severity: "Rất nặng",
          },
        ],
      },
      {
        diseaseId: "692c6df82ef6ee9bd8d71088",
        diseaseName: "Bệnh đạo ôn",
        symptoms: [
          {
            part: "Lá",
            description:
              "Vết bệnh hình thoi (mắt én), tâm xám trắng, viền nâu đậm.",
            stage: "Đẻ nhánh",
            severity: "Nặng",
          },
          {
            part: "Cổ bông",
            description:
              "Vết thối nâu xám làm gãy gục cổ bông, gây lép trắng (bạc bông).",
            stage: "Trổ",
            severity: "Rất nặng",
          },
        ],
      },
      {
        diseaseId: "692c6df72ef6ee9bd8d71024",
        diseaseName: "Bệnh lem lép hạt",
        symptoms: [
          {
            part: "Hạt",
            description:
              "Vỏ trấu biến màu thành nâu, đen hoặc tím, hạt bên trong lép hoặc lửng.",
            stage: "Trổ",
            severity: "Cao",
          },
          {
            part: "Bông",
            description:
              "Bông lúa không thoát ra khỏi bẹ được do nấm tấn công.",
            stage: "Trổ",
            severity: "Trung bình",
          },
        ],
      },
      {
        diseaseId: "692c6df72ef6ee9bd8d71056",
        diseaseName: "Bệnh cháy bìa lá",
        symptoms: [
          {
            part: "Lá",
            description:
              "Vết bệnh màu xanh tối ở mép lá, sau chuyển sang vàng xám, tạo hình lượn sóng.",
            stage: "Tất cả",
            severity: "Nặng",
          },
          {
            part: "Toàn cây",
            description: "Khi nặng, lá bị cháy lan rộng, gây rụng hạt sớm.",
            stage: "Trổ",
            severity: "Nặng",
          },
        ],
      },
      {
        diseaseId: "692c6df82ef6ee9bd8d710b6",
        diseaseName: "Sâu cuốn lá",
        symptoms: [
          {
            part: "Lá",
            description:
              "Sâu cuốn lá thành ống, ăn nhu mô, làm lá bị bạc trắng.",
            stage: "Đẻ nhánh",
            severity: "Cao",
          },
          {
            part: "Bụi lúa",
            description: "Giảm diện tích quang hợp, cây lúa còi cọc.",
            stage: "Đẻ nhánh",
            severity: "Trung bình",
          },
        ],
      },
      {
        diseaseId: "692d54daff3e886e39c6ddea",
        diseaseName: "Bệnh Khô vằn",
        symptoms: [
          {
            part: "Bẹ lá/Thân",
            description:
              "Vết bệnh loang lổ hình bầu dục, màu xám trắng viền nâu ('vằn da hổ').",
            stage: "Làm đòng",
            severity: "Cao",
          },
          {
            part: "Thân",
            description:
              "Nấm tấn công làm thối thân, gây đổ ngã khi bệnh nặng.",
            stage: "Trổ",
            severity: "Nặng",
          },
        ],
      },
      {
        diseaseId: "692d54dbff3e886e39c6de15",
        diseaseName: "Bệnh Vàng lùn",
        symptoms: [
          {
            part: "Toàn cây",
            description: "Cây lúa thấp lùn, lá ngắn, cứng, xòe ngang.",
            stage: "Đẻ nhánh",
            severity: "Rất nặng",
          },
          {
            part: "Lá",
            description: "Lá chuyển màu vàng cam, vàng khô từ chóp lá lan vào.",
            stage: "Đẻ nhánh",
            severity: "Rất nặng",
          },
        ],
      },
      {
        diseaseId: "692d54dcff3e886e39c6de31",
        diseaseName: "Bệnh Lùn xoắn lá",
        symptoms: [
          {
            part: "Lá",
            description:
              "Lá xanh đậm, xoắn lại, rìa lá rách và có bướu dọc gân lá.",
            stage: "Đẻ nhánh",
            severity: "Rất nặng",
          },
          {
            part: "Toàn cây",
            description:
              "Cây lùn, chồi non biến dạng, không có khả năng trổ bông.",
            stage: "Đẻ nhánh",
            severity: "Rất nặng",
          },
        ],
      },
      {
        diseaseId: "temp_id_9",
        diseaseName: "Bệnh Đốm nâu",
        symptoms: [
          {
            part: "Lá/Hạt",
            description:
              "Vết bệnh hình tròn hoặc bầu dục, màu nâu đậm, viền vàng (như hình mắt chim).",
            stage: "Tất cả",
            severity: "Trung bình",
          },
          {
            part: "Hạt",
            description:
              "Xuất hiện vết bệnh trên vỏ trấu, làm giảm chất lượng hạt.",
            stage: "Trổ",
            severity: "Trung bình",
          },
        ],
      },
      {
        diseaseId: "temp_id_10",
        diseaseName: "Bệnh Lúa von",
        symptoms: [
          {
            part: "Toàn cây",
            description:
              "Cây lúa non vươn cao bất thường (von), mảnh khảnh, lá vàng nhạt.",
            stage: "Mạ/Đẻ nhánh",
            severity: "Cao",
          },
          {
            part: "Gốc",
            description:
              "Gốc thân có rễ bất định, cây chết trước hoặc sau khi trổ.",
            stage: "Mạ/Đẻ nhánh",
            severity: "Cao",
          },
        ],
      },
      {
        diseaseId: "temp_id_11",
        diseaseName: "Bệnh Sọc trong",
        symptoms: [
          {
            part: "Lá",
            description: "Lá lúa có sọc vàng mờ hoặc trắng dọc theo gân lá.",
            stage: "Đẻ nhánh",
            severity: "Rất nặng",
          },
          {
            part: "Toàn cây",
            description: "Lá bị xoắn lại, mép lá rách, cây lùn.",
            stage: "Đẻ nhánh",
            severity: "Rất nặng",
          },
        ],
      },
      {
        diseaseId: "temp_id_12",
        diseaseName: "Bệnh Thối bẹ",
        symptoms: [
          {
            part: "Bẹ lá",
            description:
              "Vết bệnh màu nâu không đều trên bẹ lá non bao quanh đòng lúa.",
            stage: "Làm đòng",
            severity: "Cao",
          },
          {
            part: "Bông",
            description:
              "Bông lúa trổ không thoát, hoặc trổ ra bị lép, biến màu.",
            stage: "Trổ",
            severity: "Cao",
          },
        ],
      },
      {
        diseaseId: "temp_id_13",
        diseaseName: "Bệnh Vàng lá chín sớm",
        symptoms: [
          {
            part: "Lá",
            description:
              "Lá lúa vàng sớm từ lá dưới lên lá trên, sau đó khô và chết.",
            stage: "Làm đòng",
            severity: "Trung bình",
          },
          {
            part: "Toàn cây",
            description: "Lá vàng úa nhanh, khác với chín bình thường.",
            stage: "Làm đòng",
            severity: "Trung bình",
          },
        ],
      },
      {
        diseaseId: "temp_id_14",
        diseaseName: "Bệnh Thối thân",
        symptoms: [
          {
            part: "Thân",
            description:
              "Vết bệnh màu đen ở bẹ lá sát mặt nước, thân bị thối mềm.",
            stage: "Làm đòng",
            severity: "Nặng",
          },
          {
            part: "Gốc",
            description:
              "Xuất hiện hạch nấm màu đen trong thân, cây lúa đổ ngã.",
            stage: "Làm đòng",
            severity: "Nặng",
          },
        ],
      },
      {
        diseaseId: "temp_id_15",
        diseaseName: "Bệnh Đốm vòng",
        symptoms: [
          {
            part: "Lá",
            description:
              "Vết bệnh hình tròn hoặc hơi bầu dục, màu nâu đậm, thường có vòng đồng tâm mờ.",
            stage: "Lá già",
            severity: "Trung bình",
          },
          {
            part: "Toàn cây",
            description: "Lá bị vàng và khô nhanh do bệnh.",
            stage: "Lá già",
            severity: "Trung bình",
          },
        ],
      },
      {
        diseaseId: "692d54dfff3e886e39c6df02",
        diseaseName: "Sâu Đục thân 2 chấm",
        symptoms: [
          {
            part: "Dảnh",
            description:
              "Giai đoạn đẻ nhánh: dảnh héo (dảnh còn xanh nhưng dễ dàng rút ra).",
            stage: "Đẻ nhánh",
            severity: "Nặng",
          },
          {
            part: "Bông",
            description:
              "Giai đoạn trổ: bông lúa trắng, hạt lép hoàn toàn ('bông bạc').",
            stage: "Trổ",
            severity: "Rất nặng",
          },
        ],
      },
      {
        diseaseId: "temp_id_17",
        diseaseName: "Bọ trĩ",
        symptoms: [
          {
            part: "Lá non",
            description:
              "Lá non bị cuốn dọc, mép lá xoắn lại, có vệt trắng bạc do bọ trĩ cạo và hút nhựa.",
            stage: "Mạ/Đẻ nhánh",
            severity: "Cao",
          },
          {
            part: "Toàn cây",
            description: "Lúa còi cọc, chậm lớn.",
            stage: "Mạ/Đẻ nhánh",
            severity: "Cao",
          },
        ],
      },
      {
        diseaseId: "692d54e0ff3e886e39c6df37",
        diseaseName: "Nhện gié",
        symptoms: [
          {
            part: "Bẹ lá",
            description: "Vết thâm đen dọc bẹ lá, như bị 'cạo gió'.",
            stage: "Làm đòng",
            severity: "Cao",
          },
          {
            part: "Hạt",
            description:
              "Lúa trổ không thoát hoặc nghẹn, hạt bị lem lép, biến màu.",
            stage: "Trổ",
            severity: "Cao",
          },
        ],
      },
      {
        diseaseId: "692d54e0ff3e886e39c6df50",
        diseaseName: "Muỗi hành",
        symptoms: [
          {
            part: "Thân",
            description:
              "Đỉnh sinh trưởng bị biến dạng thành ống tròn dài màu trắng xanh ('cọng hành').",
            stage: "Đẻ nhánh",
            severity: "Cao",
          },
          {
            part: "Bụi lúa",
            description:
              "Bụi lúa bị nhiễm có nhiều chồi nhưng không trổ bông được.",
            stage: "Đẻ nhánh",
            severity: "Cao",
          },
        ],
      },
      {
        diseaseId: "temp_id_20",
        diseaseName: "Bọ xít hôi",
        symptoms: [
          {
            part: "Hạt",
            description:
              "Hút sữa hạt lúa, làm hạt lép lửng, trên vỏ trấu có chấm đen nhỏ (vết chích).",
            stage: "Trổ",
            severity: "Cao",
          },
          {
            part: "Bông",
            description: "Bông lúa có mùi hôi (mùi bọ xít).",
            stage: "Trổ",
            severity: "Cao",
          },
        ],
      },
    ];

    await connectDB();
    console.log("Starting database update...");

    for (const item of diseasesData) {
      // 1. Cập nhật hoặc Tạo mới Disease chính (Dựa theo name)
      // Sử dụng name làm key để tìm kiếm
      const disease = await upsertData(
        Disease,
        { name: item.diseaseName },
        item.diseaseName
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
      }

      if (item.cause) {
        await upsertData(
          DiseaseCause,
          { diseaseId: disease._id },
          { ...item.cause, diseaseId: disease._id }
        );
      }

      if (item.symptoms) {
        await upsertData(
          DiseaseSymptom,
          { diseaseId: disease._id },
          { ...item.symptoms, diseaseId: disease._id }
        );
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
      }

      if (item.weather) {
        await upsertData(
          WeatherDiseaseCorrelation,
          { diseaseId: disease._id },
          { ...item.weather, diseaseId: disease._id }
        );
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
