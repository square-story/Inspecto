import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ui/DarkModeSwitch";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserProfileIcon } from "./UserProfileIcon";

const Navbar04Page = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);


    return (
        <div className="w-screen fixed top-6 z-40" >
            <nav className="inset-x-4 absolute h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
                <div className="h-full flex items-center justify-between mx-auto px-4">
                    <Logo />

                    {/* Desktop Menu */}
                    <NavMenu className="hidden md:block" />

                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        {!isAuthenticated ? (
                            <Button
                                variant="outline"
                                className="sm:inline-flex rounded-full"
                                onClick={() => navigate("/user/login")}
                            >
                                Sign In
                            </Button>

                        ) : (
                            <UserProfileIcon />
                        )}


                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <NavigationSheet />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar04Page;
