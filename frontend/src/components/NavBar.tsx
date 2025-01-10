import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Theme Toggle Button Component
const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        const applyTheme = (dark: boolean) => {
            document.documentElement.classList.toggle('dark', dark);
            localStorage.setItem('theme', dark ? 'dark' : 'light');
        };

        applyTheme(isDark);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme')) {
                setIsDark(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
                <Moon className="h-5 w-5 text-gray-500" />
            )}
        </button>
    );
};

const Logo = () => {
    const navigate = useNavigate();

    return (
        <div
            className="text-gray-900 dark:text-white font-bold text-2xl cursor-pointer"
            onClick={() => navigate('/')}
        >
            Inspecto
        </div>
    );
};

interface LinksProps {
    isMobile: boolean;
    onLinkClick: () => void;
}

const Links = ({ isMobile, onLinkClick }: LinksProps) => {
    const navigate = useNavigate();

    const menuItems = [
        { name: "About Us", path: "/about" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "Contact", path: "/contact" },
    ];

    const baseStyles = isMobile
        ? "flex flex-col space-y-4 items-center"
        : "hidden md:flex space-x-8";

    const handleClick = (path: string) => {
        navigate(path);
        onLinkClick();
    };

    return (
        <ul className={baseStyles}>
            {menuItems.map((item) => (
                <li key={item.name}>
                    <button
                        onClick={() => handleClick(item.path)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        {item.name}
                    </button>
                </li>
            ))}
        </ul>
    );
};

const SignInButton = () => {
    const navigate = useNavigate();

    return (
        <button
            className="bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/user/login')}
        >
            Sign In
        </button>
    );
};

interface MobileMenuButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
    return (
        <button
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={onClick}
            aria-label="Toggle menu"
        >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
    );
};

interface MobileMenuProps {
    isOpen: boolean;
    onLinkClick: () => void;
}

const MobileMenu = ({ isOpen, onLinkClick }: MobileMenuProps) => {
    if (!isOpen) return null;

    return (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md py-4">
            <Links isMobile={true} onLinkClick={onLinkClick} />
            <div className="mt-4 flex justify-center gap-4 items-center">
                <SignInButton />
                <ThemeToggle />
            </div>
        </div>
    );
};

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-10 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <Logo />
                <div className="hidden md:block">
                    <Links isMobile={false} onLinkClick={closeMenu} />
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <SignInButton />
                    <ThemeToggle />
                </div>
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
                </div>
            </div>
            <MobileMenu isOpen={isMenuOpen} onLinkClick={closeMenu} />
        </nav>
    );
};

export default Navbar;