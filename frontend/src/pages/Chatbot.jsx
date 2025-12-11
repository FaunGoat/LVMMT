import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import argibot from "./../assets/argibot.png";
import placeholderImage from "../assets/images/placeholder.jpg";
import WeatherPopup from "../components/Common/WeatherPopup";

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
          sessionId: "user-session-123",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.reply || "Xin lỗi, tôi chưa hiểu câu hỏi của bạn.",
        data: data.payload || null,
      };
    } catch (error) {
      console.error("Lỗi kết nối backend:", error);
      return {
        text: "Không thể kết nối với server. Vui lòng kiểm tra:\n• Server đã chạy chưa?\n• URL có đúng không?\n• CORS đã được cấu hình chưa?",
        data: null,
      };
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
    const botResponse = await sendMessageToBot(currentInput);

    const botMessage = {
      text: botResponse.text,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      data: botResponse.data,
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

  // LẤY URL ẢNH
  const getImageUrl = (image) => {
    if (!image) return placeholderImage;

    if (image.url) {
      return image.url;
    }

    if (image.path) {
      return `http://localhost:5000${image.path}`;
    }

    return placeholderImage;
  };

  // RENDER MESSAGE
  const renderMessage = (msg, i) => {
    if (msg.sender === "user") {
      return (
        <div key={i} className="mb-4 text-right">
          <div className="inline-block bg-sky-500 text-white p-3 rounded-lg max-w-md">
            <p className="text-xl">{msg.text}</p>
            <span className="text-xs opacity-80 mt-1 inline-block">
              {msg.timestamp}
            </span>
          </div>
        </div>
      );
    }

    // Bot message
    const hasDisease = msg.data?.type === "disease" && msg.data?.disease;
    const hasWeather = msg.data?.type === "weather";

    // ✅ Kiểm tra xem có nên hiển thị ảnh không
    const shouldShowImages =
      msg.data?.showImages === true &&
      hasDisease &&
      msg.data.disease.images &&
      msg.data.disease.images.length > 0;

    return (
      <div key={i} className="mb-4 text-left">
        <div className="flex items-start gap-3">
          <img
            src={argibot}
            alt="Bot"
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="max-w-3xl">
            {/* Text response */}
            <div className="bg-gray-100 p-3 rounded-lg whitespace-pre-wrap">
              <p className="text-gray-800 text-xl">{msg.text}</p>
              <span className="text-xs text-gray-500 mt-1 inline-block">
                {msg.timestamp}
              </span>
            </div>

            {/* ✅ CHỈ HIỂN THỊ ẢNH KHI showImages === true */}
            {shouldShowImages && (
              <div className="mt-3 bg-white rounded-lg shadow-md overflow-hidden border-2 border-sky-200">
                {/* Images Gallery */}
                <div className="grid grid-cols-2 gap-2 p-3">
                  {msg.data.disease.images.slice(0, 2).map((image, idx) => {
                    const imageUrl = getImageUrl(image);

                    return (
                      <div key={idx} className="relative group">
                        <img
                          src={imageUrl}
                          alt={
                            image.alt || image.caption || msg.data.disease.name
                          }
                          className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = placeholderImage;
                          }}
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg"></div>
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="truncate">{image.caption}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Link to detail */}
                <div className="p-3 bg-sky-50 border-t border-sky-200">
                  <Link
                    to={msg.data.disease.link}
                    className="flex items-center justify-between text-sky-700 hover:text-sky-900 font-medium transition-colors duration-200"
                  >
                    <span>
                      📖 Xem thông tin chi tiết về {msg.data.disease.name}
                    </span>
                    <span className="transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            )}

            {/* ✅ HIỂN THỊ LINK ĐẾN CHI TIẾT (không có ảnh) nếu là disease nhưng không hiển thị ảnh */}
            {hasDisease && !shouldShowImages && (
              <div className="mt-3 bg-white rounded-lg shadow-md overflow-hidden border-2 border-sky-200">
                <div className="p-3 bg-sky-50">
                  <Link
                    to={msg.data.disease.link}
                    className="flex items-center justify-between text-sky-700 hover:text-sky-900 font-medium transition-colors duration-200"
                  >
                    <span>
                      📖 Xem thông tin chi tiết về {msg.data.disease.name}
                    </span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Weather link */}
            {hasWeather && (
              <div className="mt-3 bg-white rounded-lg shadow-md overflow-hidden border-2 border-cyan-200">
                <div className="p-3 bg-cyan-50">
                  <Link
                    to={msg.data.link}
                    className="flex items-center justify-between text-cyan-700 hover:text-cyan-900 font-medium transition-colors duration-200"
                  >
                    <span>🌤️ Xem dự báo thời tiết chi tiết</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-fit bg-sky-200">
      {/* Weather Popup */}
      <WeatherPopup />

      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="bg-sky-500 text-white p-2 rounded-lg mb-4 text-center relative">
          <h1 className="text-2xl font-bold">Chatbot Tư vấn</h1>
          <p className="text-base">Hỗ trợ nông dân 24/7</p>

          {/* Nút xóa lịch sử */}
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="absolute right-4 top-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
              title="Xóa lịch sử chat"
            >
              Xóa lịch sử
            </button>
          )}
        </div>

        {/* Chat Area */}
        <div
          ref={chatContainerRef}
          className="bg-white p-4 rounded-lg shadow-md min-h-[67vh] max-h-[67vh] overflow-y-auto mb-4 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <div className="mb-4">
                <img
                  src={argibot}
                  alt="ArgiBot"
                  className="w-24 h-24 mx-auto"
                />
              </div>
              <p className="text-lg font-semibold mb-2">
                Chào mừng bạn đến với ArgiBot! 🌾
              </p>
            </div>
          ) : (
            messages.map((msg, i) => renderMessage(msg, i))
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
            className="flex-1 p-3 bg-white rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? "Đang trả lời..." : "Gửi"}
          </button>
        </form>

        {/* Gợi ý câu hỏi */}
        {messages.length === 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Câu hỏi gợi ý:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Bệnh đạo ôn là gì?",
                "Triệu chứng rầy nâu",
                "Cách chữa lem lép hạt",
                "Thời tiết hôm nay",
                "Phòng ngừa cháy bìa lá",
                "Đạo ôn xuất hiện khi nào?",
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="bg-white border border-sky-300 text-sky-700 px-3 py-1 rounded-full text-sm hover:bg-sky-50 hover:border-sky-400 transition-all duration-200 shadow-sm"
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
