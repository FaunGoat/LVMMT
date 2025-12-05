import React from "react";
import { FaTimes as FaTimesIcon } from "react-icons/fa";

const DiseaseFilterModal = ({
  isFilterPopupOpen,
  setIsFilterPopupOpen,
  filterType,
  setFilterType,
  filterRisk,
  setFilterRisk,
  filterSeason,
  setFilterSeason,
  filterStage,
  setFilterStage,
  filterPart,
  setFilterPart,
  handleSearch,
  clearFilters,
}) => {
  if (!isFilterPopupOpen) return null;

  const sidebarWidth = 320;

  return (
    <div
      className="fixed z-40 transition-transform duration-300" // sticky thay vì fixed/absolute
      style={{
        height: "calc(50vh - 160px)",
        top: "213px", // Dừng lại cùng lúc với Sidebar
        left: `${sidebarWidth}px`,
        width: "380px",
      }}
      onClick={() => setIsFilterPopupOpen(false)} // Click backdrop để đóng
    >
      {/* Modal Content */}
      <div
        className="bg-white rounded-r-xl shadow-2xl p-6 w-full h-full overflow-y-auto border-l border-sky-100 relative"
        onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng khi click vào nội dung modal
      >
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h4 className="text-xl font-bold text-sky-700">Bộ lọc Nâng cao</h4>
          <button
            onClick={() => setIsFilterPopupOpen(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimesIcon size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Filter Group 1: Loại Bệnh & Mức độ */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 border border-sky-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            >
              <option value="all">Loại bệnh</option>
              <option value="Bệnh nấm">Nấm</option>
              <option value="Bệnh vi khuẩn">Vi khuẩn</option>
              <option value="Bệnh virus">Virus</option>
              <option value="Sâu hại">Sâu hại</option>
              <option value="Sâu bệnh khác">Khác</option>
            </select>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="w-full p-2 border border-sky-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            >
              <option value="all">Mức độ nguy hiểm</option>
              <option value="Rất cao">Rất cao</option>
              <option value="Cao">Cao</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Thấp">Thấp</option>
            </select>
          </div>

          {/* Filter Group 2: Mùa vụ & Giai đoạn */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={filterSeason}
              onChange={(e) => setFilterSeason(e.target.value)}
              className="w-full p-2 border border-sky-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            >
              <option value="all">Mùa vụ</option>
              <option value="Đông Xuân">Đông Xuân</option>
              <option value="Hè Thu">Hè Thu</option>
              <option value="Cả năm">Cả năm</option>
            </select>

            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="w-full p-2 border border-sky-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            >
              <option value="all">Giai đoạn cây trồng</option>
              <option value="Gieo mạ">Gieo mạ</option>
              <option value="Cấy non">Cấy non</option>
              <option value="Đẻ nhánh">Đẻ nhánh</option>
              <option value="Làm đòng">Làm đòng</option>
              <option value="Trổ bông">Trổ bông</option>
              <option value="Chín sữa">Chín sữa</option>
              <option value="Chín vàng">Chín vàng</option>
              <option value="Thu hoạch">Thu hoạch</option>
            </select>
          </div>

          {/* Filter Group 3: Triệu chứng */}
          <select
            value={filterPart}
            onChange={(e) => setFilterPart(e.target.value)}
            className="w-full p-2 border border-sky-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
          >
            <option value="all">-- Bộ phận bị bệnh --</option>
            <option value="Lá">Lá (Đốm, cháy...)</option>
            <option value="Thân">Thân (Thối, đục...)</option>
            <option value="Bông">Bông (Lem lép...)</option>
            <option value="Hạt">Hạt</option>
            <option value="Rễ">Rễ</option>
            <option value="Ngọn">Ngọn</option>
            <option value="Gốc">Gốc</option>
            <option value="Toàn cây">Toàn cây</option>
          </select>
        </div>

        {/* Nút Áp dụng & Xóa */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSearch}
            className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-md transition font-medium"
          >
            Áp dụng bộ lọc
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Xóa tất cả
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiseaseFilterModal;
