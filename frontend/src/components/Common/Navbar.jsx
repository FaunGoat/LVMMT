import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-sky-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold">
          Lúa Việt
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-sky-200">
              Trang Chủ
            </Link>
          </li>
          <li>
            <Link to="/sustainable-methods" className="hover:text-sky-200">
              Thông Tin Bệnh Lúa
            </Link>
          </li>
          <li>
            <Link to="/chatbot" className="hover:text-sky-200">
              Chatbot
            </Link>
          </li>
          <li>
            <Link to="/weather-forecast" className="hover:text-sky-200">
              Dự Báo Thời Tiết
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
