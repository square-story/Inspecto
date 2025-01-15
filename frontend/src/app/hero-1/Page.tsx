import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import SplitText from "../../components/SplitText";

const handleAnimationComplete = () => {
    console.log('All letters have animated!');
};

const Hero01 = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
                <div>
                    <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
                        Just released v1.0.0
                    </Badge>
                    <h1 className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tighter">
                        <SplitText
                            text="Reliable Car Inspection at Your Fingertips!"
                            delay={25}
                            animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                            easing="easeOutCubic"
                            threshold={0.5}
                            rootMargin="-50px"
                            onLetterAnimationComplete={handleAnimationComplete}
                        />
                    </h1>
                    <p className="mt-6 max-w-[60ch] text-lg">
                        <SplitText
                            text="Register your vehicle, book inspections with verified professionals, and access centralized reports – all in one place"
                            delay={25}
                            animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                            easing="easeOutCubic"
                            threshold={0.2}
                            rootMargin="-50px"
                            onLetterAnimationComplete={handleAnimationComplete}
                        />
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
