const axios = require("axios");
const fs = require("fs");

// Đọc file câu hỏi test
const testQuestions = require("./test-questions.json");

// Biến lưu kết quả
let correctAnswers = 0;
let totalQuestions = testQuestions.length;
let results = [];

// Hàm gọi chatbot
async function askChatbot(question) {
  try {
    const response = await axios.post("http://localhost:5000/api/chat", {
      message: question,
      sessionId: "test-session",
    });
    return response.data.reply;
  } catch (error) {
    console.error("Lỗi:", error.message);
    return null;
  }
}

// Hàm kiểm tra câu trả lời có đúng không
function checkAnswer(answer, expected_disease, expected_type) {
  if (!answer) return false;

  const answerLower = answer.toLowerCase();

  // Kiểm tra có chứa tên bệnh không
  let diseaseCorrect = true;
  if (expected_disease) {
    diseaseCorrect = answerLower.includes(expected_disease.toLowerCase());
  }

  // Kiểm tra loại câu trả lời
  let typeCorrect = true;
  const typeKeywords = {
    definition: ["là", "định nghĩa", "gì", "loại"],
    treatment: ["chữa", "điều trị", "thuốc"],
    symptoms: ["triệu chứng", "dấu hiệu", "biểu hiện"],
    prevention: ["phòng ngừa", "phòng", "tránh"],
    causes: ["nguyên nhân", "do", "gây"],
    stages: ["giai đoạn", "mức độ", "phát triển", "vòng đời", "chu kỳ"],
    season: ["mùa", "tháng", "thời điểm"],
    weather_trigger: ["nhiệt độ", "độ ẩm", "mưa", "gió", "nắng", "thời tiết"],
  };

  if (
    expected_type !== "symptoms_search" &&
    expected_type !== "risk" &&
    expected_type !== "treatment_specific" &&
    expected_type !== "weather" &&
    expected_type !== "thanks" &&
    expected_type !== "goodbye" &&
    expected_type !== "welcome"
  ) {
    const keywords = typeKeywords[expected_type] || [];
    typeCorrect = keywords.some((keyword) => answerLower.includes(keyword));
  }

  return diseaseCorrect && typeCorrect;
}

// Hàm chạy test chính
async function runTest() {
  console.log("=".repeat(60));
  console.log("🚀 BẮT ĐẦU TEST CHATBOT");
  console.log("=".repeat(60));
  console.log(`Tổng số câu hỏi: ${totalQuestions}\n`);

  for (let i = 0; i < testQuestions.length; i++) {
    const test = testQuestions[i];

    console.log(`[${i + 1}/${totalQuestions}] Hỏi: "${test.question}"`);

    // Gọi chatbot
    const answer = await askChatbot(test.question);

    if (!answer) {
      console.log("❌ Không nhận được câu trả lời\n");
      results.push({
        id: test.id,
        question: test.question,
        answer: null,
        correct: false,
      });
      continue;
    }

    // Kiểm tra đúng sai
    const isCorrect = checkAnswer(
      answer,
      test.expected_disease,
      test.expected_type
    );

    if (isCorrect) {
      correctAnswers++;
      console.log("✅ Đúng");
    } else {
      console.log("❌ Sai");
    }

    console.log(`Trả lời: "${answer.substring(0, 100)}..."\n`);

    // Lưu kết quả
    results.push({
      id: test.id,
      question: test.question,
      expected_disease: test.expected_disease,
      expected_type: test.expected_type,
      answer: answer,
      correct: isCorrect,
    });

    // Chờ 0.5 giây để không quá tải server
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Tính độ chính xác
  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  // In kết quả
  console.log("=".repeat(60));
  console.log("📊 KẾT QUẢ CUỐI CÙNG");
  console.log("=".repeat(60));
  console.log(`Tổng câu hỏi: ${totalQuestions}`);
  console.log(`Trả lời đúng: ${correctAnswers}`);
  console.log(`Trả lời sai: ${totalQuestions - correctAnswers}`);
  console.log(`\n🎯 ĐỘ CHÍNH XÁC: ${accuracy}%`);
  console.log("=".repeat(60));

  // Lưu kết quả ra file
  const finalResults = {
    total: totalQuestions,
    correct: correctAnswers,
    incorrect: totalQuestions - correctAnswers,
    accuracy: accuracy + "%",
    details: results,
  };

  fs.writeFileSync(
    "./test-results.json",
    JSON.stringify(finalResults, null, 2),
    "utf8"
  );

  console.log("\n✅ Kết quả đã lưu vào file: test-results.json");
}

// Chạy test
runTest().catch((error) => {
  console.error("Lỗi khi chạy test:", error);
});
