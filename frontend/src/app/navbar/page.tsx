import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { useNavigate } from 'react-router-dom'
import { ModeToggle } from "@/components/ui/DarkModeSwitch";

const Navbar04Page = () => {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-muted">
            <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
                <div className="h-full flex items-center justify-between mx-auto px-4">
                    <Logo />

                    {/* Desktop Menu */}
                    <NavMenu className="hidden md:block" />

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="sm:inline-flex rounded-full"
                            onClick={() => navigate('/user/login')}
                        >
                            Sign In
                        </Button>
                        <ModeToggle />

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
