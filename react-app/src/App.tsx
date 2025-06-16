import { ThemeProvider } from "@/components/ui/theme-provider";
import "./index.css";
import { Nav } from "./nav";
import Quiz from "./quiz";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { About } from "./about";
import { AnimatePresence } from "framer-motion";
import VantaNetBackground from "./vantabg";
import { LoginRegister } from "./loginregister";
import { useAuth } from "./auth-context";

function App() {
  const location = useLocation();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="h-12 w-12 border-4 border-t-transparent border-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full text-sm sm:text-base overflow-x-hidden">
      <VantaNetBackground />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className=" px-3 sm:px-5 md:px-8 lg:px-12 pt-4">
          <Nav></Nav>
        </div>
        <div className="flex-grow flex px-3 sm:px-5 md:px-8 lg:px-12 py-4">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="/about" replace />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="about" element={<About />} />
              <Route path="login+register" element={<LoginRegister />} />
            </Routes>
          </AnimatePresence>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
