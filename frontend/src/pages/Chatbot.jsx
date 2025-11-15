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
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (error) {
        console.error("Lỗi load lịch sử:", error);
        localStorage.removeItem("chatHistory");
      }
    }
  }, []);

  // Lưu lịch sử
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  // Cuộn xuống dưới
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // XÓA LỊCH SỬ CHAT
  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  // GỌI API BACKEND → DIALOGFLOW
  const sendMessageToBot = async (userInput) => {
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          sessionId: "user-session-123", // Có thể dùng userId thật nếu có đăng nhập
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reply || "Xin lỗi, tôi chưa hiểu câu hỏi của bạn.";
    } catch (error) {
      console.error("Lỗi kết nối backend:", error);
      return "Không thể kết nối với server. Vui lòng kiểm tra:\n• Server đã chạy chưa?\n• URL có đúng không?\n• CORS đã được cấu hình chưa?";
    }
  };

  // XỬ LÝ GỬI TIN NHẮN
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      text: input.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    const currentInput = input;
    setInput("");

    // GỌI API BACKEND
    const botReply = await sendMessageToBot(currentInput);

    const botMessage = {
      text: botReply,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  // XỬ LÝ ENTER ĐỂ GỬI
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="min-h-fit bg-sky-200">
      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="bg-sky-500 text-white p-2 rounded-lg mb-4 text-center relative">
          <h1 className="text-2xl font-bold">Chatbot Tư vấn</h1>
          <p className="text-base">Hỗ trợ nông dân 24/7</p>

          {/* Nút xóa lịch sử */}
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="absolute right-4 top-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
              title="Xóa lịch sử chat"
            >
              Xóa lịch sử
            </button>
          )}
        </div>

        {/* Chat Area */}
        <div
          ref={chatContainerRef}
          className="bg-white p-4 rounded-lg shadow-md min-h-[67vh] max-h-[67vh] overflow-y-auto mb-4"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <div className="mb-4">
                <img
                  src={argibot}
                  alt="ArgiBot"
                  className="w-24 h-24 mx-auto rounded-full"
                />
              </div>
              <p className="text-lg font-semibold mb-2">
                Chào mừng bạn đến với ArgiBot! 🌾
              </p>
              {/* <p className="text-sm">Tôi có thể giúp bạn tư vấn về:</p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Bệnh hại trên cây lúa</li>
                <li>• Cách phòng trừ và điều trị</li>
                <li>• Dự báo thời tiết ảnh hưởng đến lúa</li>
                <li>• Biện pháp canh tác bền vững</li>
              </ul> */}
              {/* <p className="text-xs mt-4 text-gray-400">
                Hãy bắt đầu bằng cách hỏi tôi một câu hỏi!
              </p> */}
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
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="bg-gray-100 p-3 rounded-lg max-w-3xl whitespace-pre-wrap text-left">
                      <p className="text-gray-800">{msg.text}</p>
                      <span className="text-xs text-gray-500 mt-1 inline-block">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="inline-block bg-sky-500 text-white p-3 rounded-lg max-w-md">
                    <p>{msg.text}</p>
                    <span className="text-xs opacity-80 mt-1 inline-block">
                      {msg.timestamp}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="text-left">
              <div className="flex items-center gap-3">
                <img
                  src={argibot}
                  alt="Bot"
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
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
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn... (Enter để gửi)"
            className="flex-1 p-3 bg-white rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang trả lời..." : "Gửi"}
          </button>
        </form>

        {/* Gợi ý câu hỏi */}
        {messages.length === 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Câu hỏi gợi ý:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Bệnh đạo ôn là gì?",
                "Cách chữa rầy nâu",
                "Thời tiết hôm nay",
                "Thuốc trừ sâu nào tốt?",
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="bg-white border border-sky-300 text-sky-700 px-3 py-1 rounded-full text-sm hover:bg-sky-50 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatbot;
