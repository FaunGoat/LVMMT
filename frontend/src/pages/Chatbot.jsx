import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import pic from "./../assets/logo.png";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  // Load lịch sử từ localStorage khi component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Lưu lịch sử vào localStorage khi messages thay đổi
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Cuộn xuống tin nhắn mới nhất trong container chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Xử lý gửi tin nhắn
  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Thêm tin nhắn của người dùng
      const userMessage = {
        text: input,
        sender: "user",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Mô phỏng phản hồi từ chatbot
      setTimeout(() => {
        const botResponse = {
          text: getBotResponse(input),
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 500); // Delay 0.5s để mô phỏng

      setInput("");
    }
  };

  // Logic trả lời cơ bản từ chatbot
  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("đạo ôn")) {
      return "Bệnh đạo ôn thường xuất hiện với đốm xám trắng trên lá. Hãy kiểm tra ruộng sau mưa và dùng biện pháp sinh học!";
    } else if (lowerMessage.includes("thời tiết")) {
      return "Hiện tại, miền Tây có mưa lớn. Hãy bảo vệ ruộng lúa khỏi ngập úng!";
    } else if (lowerMessage.includes("thuốc")) {
      return "Hãy sử dụng thuốc bảo vệ thực vật theo liều lượng khuyến cáo để đảm bảo an toàn.";
    } else {
      return "Xin lỗi, mình chưa hiểu. Bạn có thể hỏi về bệnh lúa, thời tiết, hoặc thuốc bảo vệ thực vật.";
    }
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
            <p className="text-gray-500 text-center">
              Chưa có tin nhắn. Hãy bắt đầu hỏi!
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="flex items-start">
                    <img
                      src={pic}
                      alt="Chatbot Logo"
                      className="w-12 h-12 rounded-full mr-2 mt-1"
                    />
                    <div
                      className={`inline-block p-2 rounded-lg bg-gray-200 text-gray-800`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-xs opacity-70">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                )}
                {msg.sender === "user" && (
                  <div
                    className={`inline-block p-2 rounded-lg bg-sky-500 text-white`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-xs opacity-70">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 p-2 bg-white rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-600 transition"
          >
            Gửi
          </button>
        </form>

        {/* Quick Links */}
        {/* <div className="mt-4 text-center">
          <p className="text-gray-600 mb-2">Khám phá thêm:</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/sustainable-methods"
              className="bg-sky-500 text-white py-1 px-3 rounded-lg hover:bg-sky-600 transition"
            >
              Biện pháp Sinh học
            </Link>
            <Link
              to="/weather-forecast"
              className="bg-sky-500 text-white py-1 px-3 rounded-lg hover:bg-sky-600 transition"
            >
              Dự báo Thời tiết
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Chatbot;
