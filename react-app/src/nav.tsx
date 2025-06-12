import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"

import {Link} from 'react-router-dom'

export function Nav() {
  return (
    <div className="">
    <NavigationMenu>
   
      <NavigationMenuList>
        <NavigationMenuItem >
         <NavigationMenuLink>
          <Link to='/quiz'>Test your IQ!</Link>
          </NavigationMenuLink> 
         
        </NavigationMenuItem>
        
        <NavigationMenuItem>
        
          <NavigationMenuLink>
            <Link to='/about'>About us</Link>
            </NavigationMenuLink>
        </NavigationMenuItem>


        <NavigationMenuItem>
            <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
            <NavigationMenuContent>
                <div className="grid w-[200px] gap-3 p-4">
            <NavigationMenuLink asChild >Blog</NavigationMenuLink>
            </div>
            </NavigationMenuContent>
           
        </NavigationMenuItem>

        <NavigationMenuIndicator className="NavigationMenuIndicator" />
        
      </NavigationMenuList>

     
    </NavigationMenu>

    
    </div>
  );
}