const mongoose = require("mongoose");
const Disease = require("./models/Disease");
require("dotenv").config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");
};

// Mapping local images cho các bệnh
const localImages = {
  "Bệnh đạo ôn": [
    {
      path: "dao-on-1.jpg",
      caption: "Triệu chứng đạo ôn trên lá lúa",
      alt: "Lá lúa bị đạo ôn",
    },
    {
      path: "dao-on-2.jpg",
      caption: "Đốm bệnh hình thoi đặc trưng",
      alt: "Đốm đạo ôn hình thoi",
    },
  ],
  "Rầy nâu": [
    {
      path: "ray-nau-1.jpg",
      caption: "Rầy nâu tập trung ở gốc lúa",
      alt: "Rầy nâu trên cây lúa",
    },
    {
      path: "ray-nau-2.jpg",
      caption: "Hiện tượng cháy rầy",
      alt: "Ruộng lúa bị cháy rầy",
    },
  ],
  "Bệnh lem lép hạt": [
    {
      path: "lem-lep-1.jpg",
      caption: "Hạt lúa bị lem lép",
      alt: "Bệnh lem lép trên bông lúa",
    },
    {
      path: "lem-lep-2.jpg",
      caption: "Bông lúa nhiễm nấm",
      alt: "Bông lúa lem lép",
    },
  ],
  "Bệnh cháy bìa lá": [
    {
      path: "chay-bia-1.jpg",
      caption: "Triệu chứng cháy bìa lá",
      alt: "Lá lúa bị cháy bìa",
    },
    {
      path: "chay-bia-2.jpg",
      caption: "Lá khô dính nhau",
      alt: "Bệnh cháy bìa lá nặng",
    },
  ],
  "Sâu cuốn lá": [
    {
      path: "sau-cuon-1.jpg",
      caption: "Lá lúa bị cuốn",
      alt: "Sâu cuốn lá trên lúa",
    },
    {
      path: "sau-cuon-2.jpg",
      caption: "Thiệt hại do sâu cuốn lá",
      alt: "Lá lúa bị cuốn trắng",
    },
  ],
};

async function updateDiseaseImages() {
  try {
    await connectDB();

    const diseases = await Disease.find({});
    console.log(`\n🔄 Bắt đầu cập nhật ${diseases.length} bệnh lúa...\n`);

    let updated = 0;
    let skipped = 0;

    for (const disease of diseases) {
      const imagePaths = localImages[disease.name];

      if (!imagePaths || imagePaths.length === 0) {
        console.log(`   ⚠️  Bỏ qua: ${disease.name} (không có ảnh)`);
        skipped++;
        continue;
      }

      disease.images = imagePaths;
      await disease.save();

      console.log(`   ✅ ${disease.name} (${imagePaths.length} ảnh)`);
      updated++;
    }

    console.log(
      `\n🎉 HOÀN TẤT!\n   ✅ Đã cập nhật: ${updated} bệnh\n   ⚠️  Bỏ qua: ${skipped} bệnh\n`
    );
    process.exit(0);
  } catch (error) {
    console.error("\n❌ LỖI:", error.message);
    process.exit(1);
  }
}

updateDiseaseImages();
