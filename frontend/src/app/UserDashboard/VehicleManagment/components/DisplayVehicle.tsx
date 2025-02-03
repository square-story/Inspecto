import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Vehicle } from "@/features/vehicle/vehicleSlice";
import { ArrowRight, Car, Calendar, Wrench, ShieldCheck } from "lucide-react";

interface DisplayVehicleProps {
    CarDetails: Vehicle;
}

const DisplayVehicle: React.FC<DisplayVehicleProps> = ({ CarDetails }) => {
    return (
        <Card className="w-72 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pt-4 pb-4 px-5 flex-row items-center gap-3 font-semibold">
                <div className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                    <Car className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-sm font-medium">{CarDetails.make} {CarDetails.vehicleModel}</h3>
                    <p className="text-xs text-muted-foreground">{CarDetails.year}</p>
                </div>
            </CardHeader>

            <CardContent className="px-5 space-y-2">
                {CarDetails.frontViewImage ? (
                    <div className="w-full aspect-video relative rounded-xl overflow-hidden">
                        <img
                            src={CarDetails.frontViewImage}
                            alt={`${CarDetails.make} ${CarDetails.vehicleModel}`}
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full aspect-video bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                        No Image Available
                    </div>
                )}

                <div className="text-[13px] text-muted-foreground space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-primary" />
                        <span>{CarDetails.type} | {CarDetails.transmission} | {CarDetails.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Reg: {CarDetails.registrationNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Insurance Expires: {new Date(CarDetails.insuranceExpiry).toLocaleDateString()}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-5 pb-4">
                <Button className="w-full flex items-center justify-between">
                    View Details <ArrowRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DisplayVehicle;