import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero01 = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    return (

        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-8 md:gap-12 py-8 md:py-12 mt-16 lg:mt-0">
            <div className="text-center lg:text-left">
                    <Badge className="cursor-default animate-bounce bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none hidden md:inline-flex">
                        Just released v1.0.0
                    </Badge>
                    <h1 className="mt-6 max-w-[15ch] text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tighter">
                Reliable Car Inspection at Your Fingertips!
            </h1>
            <p className="mt-6 max-w-[60ch] text-base md:text-lg">
                Register your vehicle, book inspections with verified professionals, and access centralized reports – all in one place
            </p>
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                        {isAuthenticated ? <Button size="lg" className="rounded-full text-base bg-holo-gradient px-6 py-3 shadow-lg border border-white/40 text-gray-900 font-semibold transition duration-200 hover:scale-105">
                            <Link
                                key={'/user/dashboard/inspection'}
                                to={'/user/dashboard/inspection'} className="flex flex-row">Book An Inspection Now<ArrowUpRight className="!h-5 !w-5" />
                            </Link>
                        </Button> : <Button size="lg" className="rounded-full text-base bg-holo-gradient px-6 py-3 shadow-lg border border-white/40 text-gray-900 font-semibold transition duration-200 hover:scale-105">
                            <Link
                                key={'/user/login'}
                                to={'/user/login'} className="flex flex-row">Get Started<ArrowUpRight className="!h-5 !w-5" />
                            </Link>
                        </Button>}
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
                <div className="w-full aspect-square md:aspect-video bg-accent rounded-xl overflow-hidden group">
                    <img src="https://i.pinimg.com/736x/7f/4e/02/7f4e02244d449a3ebfb367edc366d92f.jpg" alt="Car inspection" 
        className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
    );
};

export default Hero01;
