import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "./components/ui/button";

import { Link } from "react-router-dom";
import { ModeToggle } from "./components/ui/mode-toggle";

export function Nav() {
  return (
    <div className="flex flex-row">
      <div className="w-[95%]">
        {" "}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/quiz">Test your IQ!</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/about">About us</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[200px] gap-3 p-4">
                  <NavigationMenuLink asChild>Blog</NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuIndicator className="NavigationMenuIndicator" />
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="pr-[20px]">
        <Button variant="outline" className="dark:hover:bg-blue-500">
          <Link to="/login+register">Login/Register</Link>
        </Button>
      </div>
      <div className="pr-[20px]">
        <ModeToggle></ModeToggle>
      </div>
    </div>
  );
}
