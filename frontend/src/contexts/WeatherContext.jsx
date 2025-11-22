import React, { createContext, useContext, useState } from "react";

const WeatherContext = createContext();

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within WeatherProvider");
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchWeatherData = async (force = false) => {
    // Chỉ fetch nếu chưa có data hoặc force = true
    if (!force && weatherData && lastFetch) {
      const now = new Date();
      const diff = now - lastFetch;
      // Cache 30 phút
      if (diff < 30 * 60 * 1000) {
        return weatherData;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:5000/api/weather?location=Cần Thơ&days=3"
      );
      const data = await response.json();

      if (data.success) {
        setWeatherData(data.data);
        setLastFetch(new Date());
        return data.data;
      } else {
        throw new Error(data.error || "Không thể tải dự báo");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    setWeatherData(null);
    setLastFetch(null);
    localStorage.removeItem("weatherPopupLastShown");
  };

  const value = {
    weatherData,
    loading,
    error,
    fetchWeatherData,
    clearCache,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

export default WeatherContext;
