import Button from "@mui/material/Button";
import { useAuth } from "./auth-context";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "./components/ui/sidebar";

export function MySidebar() {
  const { isLoggedIn, logout } = useAuth();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={logout}
                ></Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
