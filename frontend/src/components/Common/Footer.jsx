import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-sky-100 text-center p-4 text-sky-800 border-t">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-0">
        {/* Shop links */}
        <div>
          <h3 className="text-lg mb-4">Danh Mục</h3>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Thông Tin Bệnh Lúa
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Chatbot
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Dự Báo Thời Tiết
              </Link>
            </li>
          </ul>
        </div>
        {/* Support links */}
        <div>
          <h3 className="text-lg mb-4">Hỗ Trợ</h3>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Liên Hệ Chúng Tôi
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Điều khoản dịch vụ
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Về Chatbot
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Câu Hỏi Thường Gặp
              </Link>
            </li>
          </ul>
        </div>
        {/* Follow us */}
        <div>
          <h3 className="text-lg mb-4">Theo dõi chúng tôi</h3>
          <div className="flex justify-center space-x-4 mb-6">
            <a
              href="https://www.facebook.com/loi.nguyenminh.6595"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <FaFacebook className="h-8 w-8" />
            </a>
            <a
              href="https://www.instagram.com/lowji.ng_17"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <FaInstagram className="h-8 w-8" />
            </a>
            <a
              href="https://www.tiktok.com/@dytpf2r1n9no"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <FaTiktok className="h-7 w-7" />
            </a>
          </div>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="container mx-auto mt-6 px-4 lg:px-0 border-t border-emerald-900 pt-6">
        <p className="text-sm tracking-tighter text-center">
          © 2025, Lúa Việt - Ứng dụng hỗ trợ tư vấn bảo vệ cây lúa | Hotline: 12345678
        </p>
      </div>
      {/* <p>© 2025, Shaddock - Ứng dụng Bảo Vệ Cây Lúa | Hotline: 12345678</p> */}
    </footer>
  );
}

export default Footer;
