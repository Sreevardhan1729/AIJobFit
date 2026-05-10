import React from "react";
import FrontPage from "../components/FrontPage";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import SelectBut from "../components/SelectBut";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <FrontPage />
      <SelectBut />
      <Features />
      <Contact />
      <Footer />
    </div>
  );
}
