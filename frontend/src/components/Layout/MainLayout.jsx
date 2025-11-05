import React from "react";
import Navbar from "../Common/Navbar";
import Header from "../Common/Header";
import Footer from "../Common/Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-sky-200">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
