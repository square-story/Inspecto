import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface tipContent {
    ButtonContent: string;
    HoverContent: string;
}

export default function ToolTip({ ButtonContent, HoverContent }: tipContent) {

    return (
        <div className="flex flex-col gap-6 items-center">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <Button variant="outline">{ButtonContent}</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{HoverContent}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
