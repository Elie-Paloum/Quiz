import {
  NavigationMenu,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "./components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "./auth-context";
import { UserCircleIcon } from "lucide-react";
import { useSidebar } from "./components/ui/sidebar";

import { ModeToggle } from "./components/ui/mode-toggle";

export function Nav() {
  const refTest = useRef<HTMLAnchorElement>(null);
  const refAbout = useRef<HTMLAnchorElement>(null);
  const { isLoggedIn } = useAuth();
  const { toggleSidebar } = useSidebar();

  return (
    <div className="w-full flex flex-row items-center justify-between flex-nowrap px-3 sm:px-6 py-2 gap-2 overflow-x-auto">
      <NavigationMenu>
        <NavigationMenuList className="flex flex-row gap-2 sm:gap-6">
          <NavigationMenuItem>
            <NavigationMenuLink
              ref={refTest}
              asChild
              onClick={() => {
                setTimeout(() => {
                  refTest.current?.focus();
                }, 0);
              }}
              className="bg-black hover:bg-black/90 shadow-none text-white dark:bg-blue-500 focus:bg-black dark:focus:bg-blue-500 focus:text-white focus:ring-2 focus:ring-black/50 dark:focus:ring-blue-500/50 active:bg-black/90 dark:active:bg-blue-600 transition-all px-3 py-1.5 rounded-md text-nowrap"
            >
              <Link to="/quiz">Test your IQ!</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              ref={refAbout}
              asChild
              onClick={() => {
                setTimeout(() => {
                  refAbout.current?.focus();
                }, 0);
              }}
              className="bg-black hover:bg-black/90 shadow-none text-white dark:bg-blue-500 focus:bg-black dark:focus:bg-blue-500 focus:text-white focus:ring-2 focus:ring-black/50 dark:focus:ring-blue-500/50 active:bg-black/90 dark:active:bg-blue-600 transition-all px-3 py-1.5 rounded-md text-nowrap"
            >
              <Link to="/about">Historians</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuIndicator className="NavigationMenuIndicator" />
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex flex-row gap-2 items-center shrink-0 ml-auto">
        {!isLoggedIn ? (
          <Button
            variant="outline"
            className="dark:hover:bg-blue-500 text-nowrap"
          >
            <Link to="/login+register" key="login">
              Login/Register
            </Link>
          </Button>
        ) : (
          <Button
            onClick={toggleSidebar}
            variant="outline"
            size={"icon"}
            className="dark:hover:bg-blue-500 text-nowrap cursor-pointer"
          >
            <UserCircleIcon size={24} />
          </Button>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
