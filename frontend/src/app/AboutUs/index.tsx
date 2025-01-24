import {
    Blocks,
    Bot,
    ChartPie,
    Film,
    MessageCircle,
    Settings2,
} from "lucide-react";

const features = [
    {
        icon: Settings2,
        title: "Verified Inspectors",
        description:
            "Design your space with drag-and-drop simplicity—create grids, lists, or galleries in seconds.",
    },
    {
        icon: Blocks,
        title: "Easy & Fast Car Inspection Booking",
        description:
            "Easily schedule inspections at your convenience.",
    },
    {
        icon: Bot,
        title: "Hassle-Free Reports",
        description:
            "Access your inspection results anytime, anywhere.",
    },
    {
        icon: Film,
        title: " 24/7 Customer Support",
        description:
            "We’re here to help whenever you need us.",
    },
    {
        icon: ChartPie,
        title: "Safe and Secure Process",
        description:
            "Your vehicle and data are in good hands.",
    },
    {
        icon: MessageCircle,
        title: "Centralized Reports",
        description:
            "Access and share detailed inspection reports anytime.",
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
