import React from "react";
import { Link } from "react-router-dom";
import GSTSVTX from "./../assets/GSTSVTX.jpeg";
import pic from "./../assets/logo.png";

function Home() {
  const featuredItems = [
    {
      title: "Bệnh Đạo Ôn Trên Cây Lúa",
      description: "Học cách nhận biết và phòng trừ bệnh đạo ôn hiệu quả.",
      link: "/sustainable-methods",
      images: [
        {
          src: pic,
          alt: "Bệnh đạo ôn trên lá",
        },
      ],
    },
    {
      title: "Dự Báo Thời Tiết",
      description: "Cảnh báo mưa nhiều, dễ gây bệnh đạo ôn và rầy nâu.",
      link: "/weather-forecast",
      images: [
        {
          src: pic,
          alt: "Dự Báo Thời Tiết",
        },
      ],
    },
    {
      title: "Sử Dụng Thuốc Bảo Vệ Thực Vật An Toàn",
      description:
        "Hướng dẫn sử dụng thuốc bảo vệ thực vật an toàn, hiệu quả và tiết kiệm.",
      link: "/sustainable-methods",
      images: [
        {
          src: pic,
          alt: "Sử Dụng Thuốc Bảo Vệ Thực Vật",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-sky-200">
      {/* Hero Section */}
      <div
        className="relative py-16 bg-cover bg-center min-h-[400px] text-white"
        style={{
          backgroundImage: `url('src/assets/bg-caylua12.jpg')`,
          imageRendering: "crisp-edges",
        }}
      >
        {/* Overlay để văn bản nổi bật */}
        <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-6xl text-cyan-200 font-bold mt-16 mb-10">
            Chatbot Bảo Vệ Cây Lúa
          </h1>
          {/* <p className="text-lg mb-6">
            Hỗ trợ nông dân Việt Nam tra cứu thông tin bệnh lúa, tư vấn qua
            chatbot, và dự báo thời tiết. Hãy cùng bảo vệ mùa màng của bạn!
          </p> */}
          <Link
            to="/chatbot"
            className="bg-white text-sky-700 font-semibold text-xl py-2 px-4 rounded-lg hover:bg-sky-100 transition relative z-10"
          >
            Bắt đầu chat
          </Link>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-semibold text-center mb-8 text-sky-800">
          Thông Tin Nổi Bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredItems.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-sky-700 mb-2">
                {item.title}
              </h3>
              <img
                src={item.images[0]?.src}
                alt={item.images[0]?.alt}
                className="w-full h-[400px] object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 mb-4">{item.description}</p>
              <Link
                to={item.link}
                className="text-sky-500 hover:text-sky-700 underline"
              >
                Xem thêm
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Professor Quote Section */}
      <div className="container mx-auto py-10 border-t border-b border-emerald-900 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left: Quote */}
          <div className="md:w-2/3 p-6 bg-sky-100 border border-sky-300 rounded-lg shadow-md">
            <p className="text-lg text-gray-700 italic">
              "Cần làm sao cho bà con nông dân trở thành những người nông dân
              mới, những nhà khoa học, biết áp dụng kỹ thuật sinh học trong việc
              trồng trọt. Bên cạnh đó, phải làm sao để liên kết giữa nông dân và
              doanh nghiệp ngày càng chặt chẽ..."
            </p>
            <p className="mt-2 text-sky-800 font-semibold">
              - GS. TS. Võ Tòng Xuân
            </p>
          </div>
          {/* Right: Photo */}
          <div className="md:w-1/3 flex justify-center">
            <img
              src={GSTSVTX}
              alt="GS. TS. Võ Tòng Xuân"
              className="w-128 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Recent Weather Alerts Section */}
      <div className="mb-8 text-center">
        <h3 className="text-xl font-semibold text-sky-800 mb-4">
          Cảnh báo Thời tiết Gần đây
        </h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg">
            Mưa lớn tại các tỉnh miền Tây, hãy kiểm tra thường xuyên đồng ruộng
            của bạn.
          </p>
          <p className="text-sm text-gray-600 mt-2 mb-2">
            Cập nhật: 25/09/2025
          </p>
          <Link
            to="/weather-forecast"
            className="text-sky-500 hover:text-sky-700 underline"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>

      {/* Quick Links Section */}
      {/* <div className="text-center py-10 bg-white">
        <h3 className="text-2xl font-semibold mb-6 text-sky-800">
          Khám Phá Thêm
        </h3>
        <div className="flex justify-center gap-4">
          <Link
            to="/sustainable-methods"
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Biện pháp Sinh học
          </Link>
          <Link
            to="/weather-forecast"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Dự báo Thời tiết
          </Link>
          <Link
            to="/chatbot"
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
          >
            Chatbot Tư vấn
          </Link>
          <Link
            to="/forum"
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            Diễn đàn Cộng đồng
          </Link>
        </div>
      </div> */}
    </div>
  );
}

export default Home;
