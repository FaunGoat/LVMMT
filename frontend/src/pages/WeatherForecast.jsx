import React from "react";
import { Link } from "react-router-dom";

function WeatherForecast() {
  const weatherData = [
    { day: "10/10/2025", condition: "Mưa", temp: "28°C" },
    { day: "11/10/2025", condition: "Nắng", temp: "32°C" },
    { day: "12/10/2025", condition: "Mưa rào", temp: "29°C" },
  ];

  return (
    <div className="min-h-screen bg-sky-200">
      <div className="container mx-auto py-6">
        <div className="bg-sky-500 text-white p-4 rounded-lg mb-4 text-center">
          <h1 className="text-2xl font-bold">Dự báo Thời tiết</h1>
          <p className="text-sm">
            Cập nhật cho khu vực Đồng bằng sông Cửu Long
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {weatherData.map((day, index) => (
            <div key={index} className="flex justify-between p-2 border-b">
              <span>{day.day}</span>
              <span>{day.condition}</span>
              <span>{day.temp}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition"
          >
            Quay lại Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WeatherForecast;
