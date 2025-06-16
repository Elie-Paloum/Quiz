import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./auth-context.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { MySidebar } from "./mysidebar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider defaultOpen={false}>
          <App />
          <MySidebar />
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
