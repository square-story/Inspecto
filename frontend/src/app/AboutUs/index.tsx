import {
    Bot,
    Calendar,
    FileText,
    Folder,
    Headphones,
    ShieldCheck,
} from "lucide-react";

const features = [
    {
        icon: Bot,
        title: "Certified Experts",
        description:
            "Get your vehicle inspected by top-rated professionals you can trust.",
    },
    {
        icon: Calendar,
        title: "Seamless Booking Experience",
        description:
            "Book your car inspection in just a few clicks—quick, easy, and hassle-free.",
    },
    {
        icon: FileText,
        title: "Instant Inspection Reports",
        description:
            "Receive detailed, easy-to-understand reports right at your fingertips.",
    },
    {
        icon: Headphones,
        title: "Round-the-Clock Support",
        description:
            "Our dedicated team is available 24/7 to assist you whenever you need help.",
    },
    {
        icon: ShieldCheck,
        title: "Secure & Transparent Process",
        description:
            "Enjoy peace of mind with a process designed for your safety and clarity.",
    },
    {
        icon: Folder,
        title: "All-in-One Report Access",
        description:
            "Easily access, manage, and share your inspection reports anytime, anywhere.",
    },
];

const Features01Page = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12">
            <div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-center">
                    Why Choose Inspecto?
                </h2>
                <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-lg mx-auto px-6">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="flex flex-col border rounded-xl py-6 px-5"
                        >
                            <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">
                                {feature.title}
                            </span>
                            <p className="mt-1 text-foreground/80 text-[15px]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features01Page;
