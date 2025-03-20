import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero01 = () => {
    return (

        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12 ">
                <div>
                    <Badge className="cursor-default animate-bounce bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
                        Just released v1.0.0
                    </Badge>
                    <h1 className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tighter">
                        Reliable Car Inspection at Your Fingertips!
                    </h1>
                    <p className="mt-6 max-w-[60ch] text-lg">
                        Register your vehicle, book inspections with verified professionals, and access centralized reports – all in one place
                    </p>
                    <div className="mt-12 flex items-center gap-4">
                        <Button size="lg" className="rounded-full text-base bg-holo-gradient px-6 py-3 shadow-lg border border-white/40 text-gray-900 font-semibold transition duration-200 hover:scale-105">
                            Register Now <ArrowUpRight className="!h-5 !w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full text-base transition duration-200 hover:scale-105 shadow-lg border border-white/40"

                        >
                            <Link
                                key={'/questions'}
                                to={'/questions'} className="flex flex-row"><ChevronRight className="!h-5 !w-5" /> Learn More</Link>
                        </Button>
                    </div>
                </div>
                <div className="w-full aspect-video bg-accent rounded-xl overflow-hidden group">
                    <img src="https://i.pinimg.com/736x/7f/4e/02/7f4e02244d449a3ebfb367edc366d92f.jpg" alt="" />
                </div>
            </div>
        </div>
    );
};

export default Hero01;
