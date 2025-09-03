import { Info } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { InspectionType } from "@/types/inspection.types";






export const InspectionTypeCard = ({ type, selected, onSelect }: { type: InspectionType, selected: boolean, onSelect: (id: string) => void }) => (
    <Card
        className={`cursor-pointer transition-all ${selected ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}
        onClick={() => onSelect(type._id)}
    >
        <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-lg">{type.name}</h3>
                    <p className="text-sm text-gray-500">Duration: {type.duration}</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                        <p className="text-xl font-bold">₹ {type.price + type.platformFee}</p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="cursor-help">
                                    <Info className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Platform fee: ₹{type.platformFee} included</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
            <ul className="space-y-2">
                {type.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {feature}
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);