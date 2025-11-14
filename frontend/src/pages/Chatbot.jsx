import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import argibot from "./../assets/argibot.png";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Load lịch sử từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Lưu lịch sử
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Cuộn xuống dưới
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // GỌI WEBHOOK THẬT (DIALOGFLOW → BACKEND → MONGODB)
  const callWebhook = async (userInput) => {
    try {
      const response = await fetch("http://localhost:5000/webhook", {
        // Nếu bạn dùng ngrok hoặc Render → đổi thành URL công khai
        // Ví dụ: "https://your-app.onrender.com/webhook"
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queryResult: {
            queryText: userInput,
            intent: { displayName: "Ask_Disease" }, // sẽ được Dialogflow xử lý thật
            parameters: {
              disease: userInput.includes("đạo ôn") ? "đạo ôn" : "",
            },
          },
        }),
      });

      const data = await response.json();
      return data.fulfillmentText || "Xin lỗi, tôi chưa hiểu câu hỏi của bạn.";
    } catch (error) {
      console.error("Lỗi gọi webhook:", error);
      return "Hệ thống đang bận. Vui lòng thử lại sau!";
    }
  };

  // XỬ LÝ GỬI TIN NHẮN
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("vi-VN"),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");

    // GỌI WEBHOOK THẬT → NHẬN TRẢ LỜI TỪ MONGODB
    const botReply = await callWebhook(input);

    const botMessage = {
      text: botReply,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString("vi-VN"),
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-fit bg-sky-200">
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="bg-sky-500 text-white p-4 rounded-lg mb-4 text-center">
          <h1 className="text-2xl font-bold">Chatbot Tư vấn</h1>
          <p className="text-base">Hỗ trợ nông dân 24/7</p>
        </div>

        {/* Chat Area */}
        <div
          ref={chatContainerRef}
          className="bg-white p-4 rounded-lg shadow-md min-h-[60vh] max-h-[60vh] overflow-y-auto mb-4"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>Chào mừng bạn đến với Chatbot AI bảo vệ cây lúa!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                {msg.sender === "bot" ? (
                  <div className="flex items-start gap-3">
                    <img
                      src={argibot}
                      alt="Bot"
                      className="w-15 h-15 rounded-full"
                    />
                    <div className="bg-gray-100 p-3 rounded-lg max-w-3xl whitespace-pre-wrap">
                      <p className="text-gray-800">{msg.text}</p>
                      <span className="text-xs text-gray-500">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="inline-block bg-sky-500 text-white p-3 rounded-lg max-w-xs">
                    <p>{msg.text}</p>
                    <span className="text-xs opacity-80">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="text-left">
              <div className="flex items-center gap-3">
                <img src={argibot} alt="Bot" className="w-15 h-15 rounded-full" />
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 p-3 bg-white rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition disabled:opacity-50"
          >
            {isLoading ? "Đang trả lời..." : "Gửi"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
