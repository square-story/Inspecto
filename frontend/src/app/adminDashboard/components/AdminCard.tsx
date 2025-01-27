import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { ArrowRight, Shapes } from "lucide-react";

const AdminCard = () => {
    return (
        <Card className="max-w-xs shadow-none">
            <CardHeader className="pt-4 pb-4 px-5 flex-row items-center gap-3 font-semibold">
                <div className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                    <Shapes className="h-5 w-5" />
                </div>
                Shadcn UI Blocks
            </CardHeader>

            <CardContent className="text-[15px] text-muted-foreground px-5">
                <p>
                    Explore a collection of Shadcn UI blocks and components, ready to
                    preview and copy.
                </p>
                <div className="mt-5 w-full aspect-video bg-muted rounded-xl" />
            </CardContent>

            <CardFooter>
                <Button className="/blocks">
                    Explore Blocks <ArrowRight />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default AdminCard;
