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
                        <button onClick={() => handleNavigation('/')}>
                            Home
                        </button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <button onClick={() => handleNavigation('/blog')}>
                            Blog
                        </button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                {/* Add more NavigationMenuItems as needed */}
            </NavigationMenuList>
        </NavigationMenu>
    );
};