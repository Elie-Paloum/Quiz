import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUpForm } from "@/myform";
import { Login } from "./login";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "./auth-context";
import { Navigate } from "react-router-dom";

export function LoginRegister() {
  const [activeTab, setActiveTab] = useState("login");
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/about" replace />;
  }
  return (
    <motion.div
      className="flex-1 flex"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col justify-center items-center flex-1 px-4 sm:px-6 md:px-8 w-full">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className=" flex w-full  flex-col gap-6 justify-center items-center flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex  justify-around">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Login />
              </TabsContent>
              <TabsContent value="register">
                <SignUpForm onSuccess={() => setActiveTab("login")} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
