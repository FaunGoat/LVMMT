const fs = require("fs");

// Đọc kết quả test
const results = JSON.parse(fs.readFileSync("./test-results.json", "utf8"));

// Phân loại theo loại câu hỏi
const categories = {};

results.details.forEach((item) => {
  const type = item.expected_type;
  if (!categories[type]) {
    categories[type] = { total: 0, correct: 0 };
  }
  categories[type].total++;
  if (item.correct) {
    categories[type].correct++;
  }
});

// Tạo bảng kết quả
console.log("\n" + "=".repeat(70));
console.log("BẢNG KẾT QUẢ ĐÁNH GIÁ CHATBOT");
console.log("=".repeat(70));
console.log(
  "Loại câu hỏi".padEnd(25) +
    "Tổng số".padEnd(12) +
    "Đúng".padEnd(12) +
    "Sai".padEnd(12) +
    "Độ chính xác"
);
console.log("-".repeat(70));

Object.entries(categories).forEach(([type, stats]) => {
  const accuracy = ((stats.correct / stats.total) * 100).toFixed(2);
  const incorrect = stats.total - stats.correct;

  const typeNames = {
    definition: "Hỏi định nghĩa",
    risk: "Hỏi mức độ",
    symptoms: "Hỏi triệu chứng",
    symptoms_search: "Tìm bệnh theo TC",
    causes: "Hỏi nguyên nhân",
    treatment: "Hỏi cách chữa",
    treatment_specific: "Hỏi cách chữa cụ thể",
    prevention: "Hỏi phòng ngừa",
    stages: "Hỏi giai đoạn phát triển",
    season: "Hỏi mùa vụ",
    weather_trigger: "Hỏi điều kiện thời tiết",
    weather: "Hỏi về thời tiết",
    thanks: "Cảm ơn",
    goodbye: "Chào tạm biệt",
    welcome: "Chào hỏi",
  };

  console.log(
    String(typeNames[type] || type).padEnd(25) +
      String(stats.total).padEnd(12) +
      String(stats.correct).padEnd(12) +
      String(incorrect).padEnd(12) +
      String(accuracy + "%")
  );
});

console.log("-".repeat(70));
console.log(
  "TỔNG".padEnd(25) +
    String(results.total).padEnd(12) +
    String(results.correct).padEnd(12) +
    String(results.incorrect).padEnd(12) +
    String(results.accuracy)
);
console.log("=".repeat(70));

// Lưu ra file để copy vào Word
let wordTable = "Loại câu hỏi\tTổng số\tĐúng\tSai\tĐộ chính xác\n";

Object.entries(categories).forEach(([type, stats]) => {
  const accuracy = ((stats.correct / stats.total) * 100).toFixed(2);
  const incorrect = stats.total - stats.correct;

  const typeNames = {
    definition: "Hỏi định nghĩa",
    risk: "Hỏi mức độ",
    symptoms: "Hỏi triệu chứng",
    symptoms_search: "Tìm bệnh theo TC",
    causes: "Hỏi nguyên nhân",
    treatment: "Hỏi cách chữa",
    treatment_specific: "Hỏi cách chữa cụ thể",
    prevention: "Hỏi phòng ngừa",
    stages: "Hỏi giai đoạn phát triển",
    season: "Hỏi mùa vụ",
    weather_trigger: "Hỏi điều kiện thời tiết",
    weather: "Hỏi về thời tiết",
    thanks: "Cảm ơn",
    goodbye: "Chào tạm biệt",
    welcome: "Chào hỏi",
  };

  wordTable += `${typeNames[type] || type}\t${stats.total}\t${
    stats.correct
  }\t${incorrect}\t${accuracy}%\n`;
});

wordTable += `TỔNG\t${results.total}\t${results.correct}\t${results.incorrect}\t${results.accuracy}`;

fs.writeFileSync("./table-for-word.txt", wordTable, "utf8");

console.log("\n✅ Đã tạo file table-for-word.txt");
console.log(
  "👉 Mở file này và copy vào Word, chọn Insert > Table > Convert Text to Table"
);
