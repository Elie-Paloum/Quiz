import { ThemeProvider } from "@/components/ui/theme-provider";
import "./index.css";
import { Nav } from "./nav";
import Quiz from "./quiz";
import { Route, Routes, useLocation } from "react-router-dom";
import { About } from "./about";
import { AnimatePresence } from "framer-motion";

import VantaNetBackground from "./vantabg";

import { LoginRegister } from "./loginregister";

function App() {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col">
      <VantaNetBackground />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex flex-col mt-8 ml-4 flex-nowrap">
          <Nav></Nav>
        </div>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/quiz" element={<Quiz />} />
            <Route path="about" element={<About />} />
            <Route path="login+register" element={<LoginRegister />} />
          </Routes>
        </AnimatePresence>
      </ThemeProvider>
    </div>
  );
}

export default App;
