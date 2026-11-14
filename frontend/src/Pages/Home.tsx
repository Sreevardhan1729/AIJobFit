import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/home/Hero";
import ToolCards from "../components/home/ToolCards";
import TryIt from "../components/home/TryIt";
import HowItWorks from "../components/home/HowItWorks";
import HonestyStrip from "../components/home/HonestyStrip";
import BuiltWith from "../components/home/BuiltWith";
import About from "../components/home/About";

export default function Home() {
  const { hash } = useLocation();

  // Navbar links like "/#how-it-works" arrive from other pages before the section exists.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <>
      <Hero />
      <ToolCards />
      <TryIt />
      <HowItWorks />
      <HonestyStrip />
      <BuiltWith />
      <About />
    </>
  );
}
