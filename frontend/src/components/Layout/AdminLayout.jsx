import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../../pages/AdminLogin";
import { FaSignOutAlt, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { useEffect } from "react";

export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, admin } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
      navigate("/admin/login", { replace: true });
    }
  };

  const getPageTitle = () => {
    if (location.pathname.includes("/admin/diseases")) {
      return "Quản Lý Bệnh Lúa";
    }
    return "Lúa Việt Admin";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-xl sticky top-0 z-50">
        <div className="px-6 py-7 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden hover:bg-white hover:bg-opacity-20 p-2 rounded transition text-2xl"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl ml-30 font-bold">{getPageTitle()}</h1>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Date & Time */}
            {/* <div className="hidden sm:flex flex-col items-end">
              <p className="text-lg font-semibold">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </p>
              <p className="text-sm text-sky-100">
                {new Date().toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div> */}

            {/* User Info */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white text-black bg-opacity-10 rounded-lg border border-white border-opacity-20">
              <FaUser className="text-xl" />
              <div>
                <p className="text-sm font-semibold">{admin?.name}</p>
                <p className="text-xs">{admin?.role}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition font-semibold text-lg hover:shadow-lg active:scale-95"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {/* {mobileMenuOpen && (
          <div className="md:hidden px-6 py-4 bg-sky-700 border-t border-sky-500">
            <p className="text-lg font-semibold mb-2">{admin?.name}</p>
            <p className="text-sm text-sky-100 mb-4">{admin?.email}</p>
            <button
              onClick={() => {
                navigate("/admin/diseases");
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition text-lg font-semibold bg-white text-sky-700 hover:bg-gray-100 mb-2"
            >
              <FaLeaf className="text-xl" />
              <span>Quản lý Bệnh</span>
            </button>
          </div>
        )} */}
      </header>

      <main className="flex-1">
        <div className="p-6 md:p-8 max-w-9/12 mx-auto">{children}</div>
      </main>
    </div>
  );
};
