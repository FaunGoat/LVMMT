import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SustainableMethods from "./pages/SustainableMethods";
import Chatbot from "./pages/Chatbot";
import WeatherForecast from "./pages/WeatherForecast";
import MainLayout from "./components/Layout/MainLayout";
import { WeatherProvider } from "./contexts/WeatherContext";
import AdminLogin, { AdminProvider } from "./pages/AdminLogin";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminDisease from "./pages/AdminDisease";
import AdminDiseaseDetail from "./pages/AdminDiseaseDetail";
import { AdminLayout } from "./components/Layout/AdminLayout";
import { useEffect } from "react";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.key]);

  return null;
};

const App = () => {
  return (
    <AdminProvider>
      <BrowserRouter>
        <WeatherProvider>
          <ScrollToTop />
          <MainLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route
                path="/sustainable-methods"
                element={<SustainableMethods />}
              />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/weather-forecast" element={<WeatherForecast />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/diseases"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminDisease />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/diseases/:diseaseId"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminDiseaseDetail />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MainLayout>
        </WeatherProvider>
      </BrowserRouter>
    </AdminProvider>
  );
};

export default App;
