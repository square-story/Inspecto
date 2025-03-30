import { Separator } from "@/components/ui/separator";
import {
    DribbbleIcon,
    GithubIcon,
    TwitchIcon,
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
            <footer>
                <div className="max-w-screen-xl mx-auto">
                    <div className="py-12 flex flex-col justify-start items-center text-center">
                        <span className="text-7xl font-bold">Inspecto</span>
                        <ul className="mt-6 flex items-center text-center gap-4 flex-wrap">
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
                            <a href="#" target="_blank">
                                <TwitterIcon className="h-5 w-5" />
                            </a>
                            <a href="#" target="_blank">
                                <DribbbleIcon className="h-5 w-5" />
                            </a>
                            <a href="#" target="_blank">
                                <TwitchIcon className="h-5 w-5" />
                            </a>
                            <a href="#" target="_blank">
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
