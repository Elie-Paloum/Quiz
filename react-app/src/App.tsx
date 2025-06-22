import { ThemeProvider } from "@/components/ui/theme-provider";
import "./index.css";
import { Nav } from "./nav";
import Quiz from "./quiz";
import { Route, Routes, useLocation } from "react-router-dom";
import { About } from "./about";
import { AnimatePresence } from "framer-motion";
import VantaNetBackground from "./vantabg";
import { LoginRegister } from "./loginregister";
import { useAuth } from "./auth-context";
import DashBoard from "./dashboard";
import { LoginRequired } from "./components/LoginRequired";
import Home from "./Home";
import MyTable from "./mytable";
import Dashboard from "./dashboard";
// import DashBoard from "./dashboard";

function App() {
  const location = useLocation();
  const { loading, isLoggedIn, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="h-12 w-12 border-4 border-t-transparent border-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full text-sm sm:text-base overflow-x-hidden">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <VantaNetBackground />
        <div className="  px-3 sm:px-5 md:px-8 lg:px-12 py-4">
          <Nav></Nav>
        </div>
        <div className="flex-grow flex justify-center px-3 sm:px-5 md:px-8 lg:px-12 py-8 ">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route
                path="/quiz"
                element={isLoggedIn ? <Quiz /> : <LoginRequired />}
              />
              <Route
                path="about"
                element={isLoggedIn ? <About /> : <LoginRequired />}
              />
              <Route path="login+register" element={<LoginRegister />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admin/users" element={<MyTable />} />
            </Routes>
          </AnimatePresence>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
