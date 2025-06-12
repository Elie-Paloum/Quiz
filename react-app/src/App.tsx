import { useState } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./index.css";
import { Nav } from "./nav";
import { ModeToggle } from "./components/ui/mode-toggle";
import ProfileCard from "./ProfileCard";

import Quiz from "./quiz";
import { Route, Routes, useLocation } from "react-router-dom";
import { About } from "./about";
import { AnimatePresence } from "framer-motion";
import { Button } from "./components/ui/button";
import VantaBackground from "./vantabg";

function App() {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex flex-col mt-8 ml-4 flex-nowrap">
          <div className="flex flex-row">
            <div className="w-[95%]">
              {" "}
              <Nav></Nav>
            </div>
            <div className="pr-[20px]">
              <Button variant="outline" className="dark:hover:bg-blue-500">
                Login/Register
              </Button>
            </div>
            <div className="pr-[20px]">
              <ModeToggle></ModeToggle>
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/quiz" element={<Quiz />} />
            <Route path="about" element={<About />} />
          </Routes>
        </AnimatePresence>
      </ThemeProvider>
    </div>
  );
}

export default App;
