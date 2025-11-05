import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SustainableMethods from "./pages/SustainableMethods";
import Chatbot from "./pages/Chatbot";
import WeatherForecast from "./pages/WeatherForecast";
import MainLayout from "./components/Layout/MainLayout";
// import Forum from "./pages/Forum";
// import { Toaster } from "sonner";
import { useEffect } from "react";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.key]); // Chạy mỗi khi pathname thay đổi (tức là khi chuyển route)

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sustainable-methods" element={<SustainableMethods />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/weather-forecast" element={<WeatherForecast />} />
          {/* <Route path="/forum" element={<Forum />} /> */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;
