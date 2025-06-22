import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./styles/custom.css";
import App from "./App.tsx";
import { AuthProvider } from "./auth-context.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { MySidebar } from "./mysidebar.tsx";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider defaultOpen={false}>
          <App />
          <MySidebar />
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
