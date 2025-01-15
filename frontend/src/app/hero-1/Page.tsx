import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronRight } from "lucide-react";



const Hero01 = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
                <div>
                    <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
                        Just released v1.0.0
                    </Badge>
                    <h1 className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight">
                        Reliable Car Inspection at Your Fingertips!
                    </h1>
                    <p className="mt-6 max-w-[60ch] text-lg">
                        Register your vehicle, book inspections with verified professionals, and access centralized reports – all in one place
                    </p>
                    <div className="mt-12 flex items-center gap-4">
                        <Button size="lg" className="rounded-full text-base">
                            Register Now <ArrowUpRight className="!h-5 !w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full text-base shadow-none"
                        >
                            <ChevronRight className="!h-5 !w-5" /> Learn More
                        </Button>
                    </div>
                </div>
                <div className="w-full aspect-video bg-accent rounded-xl overflow-hidden group">
                    <img className="rounded-xl transform transition-transform duration-500 group-hover:scale-105 object-cover w-full h-full" src="https://sureshdrives.com/assets/img/blog/09.jpg" alt="" />
                </div>
            </div>
        </div>
    );
};

export default Hero01;
