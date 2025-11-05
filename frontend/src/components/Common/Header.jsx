import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      {/* Topbar */}
      <Topbar />
      {/* Navbar */}
      <Navbar />
    </header>
  );
};
export default Header;
