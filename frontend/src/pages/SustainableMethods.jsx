import React, { useState } from "react";
import { Link } from "react-router-dom";
import pic from "./../assets/logo.png";
import { FaBars, FaTimes } from "@react-icons/all-files/fa/FaBars";
import { FaTimes as FaTimesIcon } from "@react-icons/all-files/fa/FaTimes";

function SustainableMethods() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const methods = [
    {
      id: 1,
      title: "Sử dụng Thiên Địch",
      description:
        "Sử dụng côn trùng có lợi như bọ rùa hoặc ong ký sinh để kiểm soát rầy nâu và sâu hại.",
      tips: "Thả thiên địch vào buổi sáng sớm, tránh thuốc trừ sâu hóa học.",
      images: [
        {
          src: pic,
          alt: "Bệnh đạo ôn trên lá",
        },
      ],
    },
    {
      id: 2,
      title: "Phân Bón Hữu Cơ",
      description:
        "Áp dụng phân chuồng hoặc phân xanh để cải thiện đất và tăng sức đề kháng cho cây lúa.",
      tips: "Bón lót trước khi cày 7-10 ngày, kết hợp với nước sạch.",
      images: [
        {
          src: pic,
          alt: "Bệnh đạo ôn trên lá",
        },
      ],
    },
    {
      id: 3,
      title: "Quản Lý Nước Hiệu Quả",
      description:
        "Kiểm soát mực nước trong ruộng để hạn chế bệnh đạo ôn và rầy nâu.",
      tips: "Giữ mực nước 3-5cm trong giai đoạn đầu, giảm nước khi lúa trổ bông.",
      images: [
        {
          src: pic,
          alt: "Bệnh đạo ôn trên lá",
        },
      ],
    },
  ];

  // Chọn phương pháp mặc định đầu tiên khi tải trang
  useState(() => {
    if (!selectedMethod && methods.length > 0) {
      setSelectedMethod(methods[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-sky-200">
      {/* Header with Toggle Button */}
      <div className="bg-sky-200 text-sky-800 p-4 text-center relative">
        {/* <h1 className="text-2xl font-bold">
          Biện Pháp Bảo Vệ Cây Lúa Bền Vững
        </h1> */}
        <p className="text-lg font-bold">
          Hướng dẫn thực hành nông nghiệp an toàn và hiệu quả
        </p>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-4 top-8 text-black  hover:text-gray-500 focus:outline-none"
        >
          {isSidebarOpen ? <FaTimesIcon size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Main Layout: 1/4 Left (Menu), 3/4 Right (Content) */}
      <div className="flex h-screen">
        {/* Left Sidebar (1/4) - Menu */}
        <div
          className={`bg-sky-100 p-4 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? "w-1/5" : "w-0 p-0"
          }`}
        >
          {isSidebarOpen && (
            <>
              <h3 className="text-lg font-semibold text-sky-800 mb-4">
                Danh mục
              </h3>
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  className={`w-full text-left p-2 mb-2 ${
                    selectedMethod?.id === method.id
                      ? "bg-sky-300 text-white"
                      : "hover:bg-sky-200"
                  }`}
                >
                  {method.title}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Right Content (3/4) */}
        <div
          className={`bg-white p-6 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? "w-4/5" : "w-full"
          }`}
        >
          {selectedMethod ? (
            <>
              <img
                src={selectedMethod.images[0]?.src}
                alt={selectedMethod.title}
                className="w-fit h-48 object-cover mb-4"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg"; // Fallback nếu ảnh không tải
                }}
              />
              <h3 className="text-2xl font-medium text-sky-700 mb-2">
                {selectedMethod.title}
              </h3>
              <p className="text-gray-600 mb-4">{selectedMethod.description}</p>
              <p className="text-sm text-gray-500 italic">
                Mẹo: {selectedMethod.tips}
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-center">
              Vui lòng chọn một phương pháp từ danh mục.
            </p>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-4 text-center bg-sky-100">
        <p className="text-gray-600 mb-2">Khám phá thêm:</p>
        <div className="flex justify-center gap-4">
          <Link
            to="/chatbot"
            className="bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition"
          >
            Chatbot Tư vấn
          </Link>
          <Link
            to="/weather-forecast"
            className="bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition"
          >
            Dự báo Thời tiết
          </Link>
          <Link
            to="/forum"
            className="bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition"
          >
            Diễn đàn
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SustainableMethods;
