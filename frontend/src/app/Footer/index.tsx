import { Separator } from "@/components/ui/separator";
import {
    GithubIcon,
    Instagram,
    Linkedin,
    TwitterIcon,
} from "lucide-react";

const footerLinks = [
    {
        title: "Overview",
        href: "#",
    },
    {
        title: "Features",
        href: "#",
    },
    {
        title: "Pricing",
        href: "#",
    },
    {
        title: "Careers",
        href: "#",
    },
    {
        title: "Help",
        href: "#",
    },
    {
        title: "Privacy",
        href: "#",
    },
];

const Footer05Page = () => {
    return (
        <div className="flex flex-col">
            <div className="grow bg-muted" />
            <footer className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-screen-xl mx-auto">
                <div className="py-12 flex flex-col items-center text-center">
                <span className="text-4xl md:text-7xl font-bold">Inspecto</span>
                <ul className="mt-6 flex flex-wrap justify-center gap-2 md:gap-4">
                            {footerLinks.map(({ title, href }) => (
                                <li key={title}>
                                    <a
                                        href={href}
                                        className="text-muted-foreground hover:text-foreground font-medium"
                                    >
                                        {title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Separator />
                    <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
                        {/* Copyright */}
                        <span className="text-muted-foreground">
                            &copy; {new Date().getFullYear()}{" "}
                            <a href="/" target="_blank">
                                Inspecto
                            </a>
                            . All rights reserved.
                        </span>

                        <div className="flex items-center gap-5 text-muted-foreground">
                            <a href="https://x.com/SadikBuilds" target="_blank">
                                <TwitterIcon className="h-5 w-5" />
                            </a>
                            <a href="https://www.linkedin.com/in/sadikkp/" target="_blank">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="https://www.instagram.com/square_story/" target="_blank">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="https://github.com/square-story" target="_blank">
                                <GithubIcon className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer05Page;
