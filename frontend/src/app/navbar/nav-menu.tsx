import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { useNavigate } from 'react-router-dom';

export const NavMenu = (props: NavigationMenuProps) => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <NavigationMenu {...props}>
            <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <button className="hover:font-bold hover:ease-in-out duration-300" onClick={() => handleNavigation('/')}>
                            About Us
                        </button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <button className="hover:font-bold hover:ease-in-out duration-300" onClick={() => handleNavigation('/')}>
                            How It Works
                        </button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <button className="hover:font-bold hover:ease-in-out duration-300" onClick={() => handleNavigation('/')}>
                            Contact
                        </button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};