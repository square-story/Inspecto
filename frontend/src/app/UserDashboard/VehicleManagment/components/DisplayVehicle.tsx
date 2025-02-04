import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetClose
} from "@/components/ui/sheet";
import { Vehicle } from "@/features/vehicle/vehicleSlice";
import {
    ArrowRight,
    Car,
    Calendar,
    Wrench,
    ShieldCheck,
    BookText
} from "lucide-react";

interface DisplayVehicleProps {
    CarDetails: Vehicle;
}

const DisplayVehicle: React.FC<DisplayVehicleProps> = ({ CarDetails }) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const VehicleDetailSheet = () => (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <SheetContent className="w-[500px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-3">
                        <Car className="h-6 w-6 text-primary" />
                        <span>{CarDetails.make} {CarDetails.vehicleModel}</span>
                    </SheetTitle>
                    <SheetDescription>
                        Comprehensive Vehicle Details
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Vehicle Image */}
                    <div className="w-full aspect-video bg-muted rounded-xl overflow-hidden">
                        {CarDetails.frontViewImage ? (
                            <img
                                src={CarDetails.frontViewImage}
                                alt={`${CarDetails.make} ${CarDetails.vehicleModel}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* Vehicle Details Grid */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/20 rounded-xl">
                        <DetailItem
                            icon={<Car className="h-5 w-5 text-primary" />}
                            label="Vehicle Type"
                            value={CarDetails.type}
                        />
                        <DetailItem
                            icon={<Calendar className="h-5 w-5 text-primary" />}
                            label="Year"
                            value={CarDetails.year.toString()}
                        />
                        <DetailItem
                            icon={<Wrench className="h-5 w-5 text-primary" />}
                            label="Transmission"
                            value={CarDetails.transmission}
                        />
                        <DetailItem
                            icon={<BookText className="h-5 w-5 text-primary" />}
                            label="Fuel Type"
                            value={CarDetails.fuelType}
                        />
                        <DetailItem
                            icon={<ShieldCheck className="h-5 w-5 text-primary" />}
                            label="Registration"
                            value={CarDetails.registrationNumber}
                        />
                        <DetailItem
                            icon={<Calendar className="h-5 w-5 text-primary" />}
                            label="Insurance Expiry"
                            value={new Date(CarDetails.insuranceExpiry).toLocaleDateString()}
                        />
                    </div>

                    {/* Optional Additional Details */}
                    {(CarDetails.color || CarDetails.chassisNumber) && (
                        <div className="bg-secondary/10 p-4 rounded-xl space-y-2">
                            <h4 className="text-sm font-semibold text-muted-foreground">Additional Information</h4>
                            {CarDetails.color && (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-5 w-5 rounded-full border"
                                        style={{ backgroundColor: CarDetails.color }}
                                    />
                                    <span className="text-sm">{CarDetails.color}</span>
                                </div>
                            )}
                            {CarDetails.chassisNumber && (
                                <div className="flex items-center gap-2">
                                    <BookText className="h-5 w-5 text-primary" />
                                    <span className="text-sm">Chassis: {CarDetails.chassisNumber}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <Button variant="default" className="w-full mt-6">
                    Edit Vehicle
                </Button>
                <Button variant="destructive" className="w-full mt-6">
                    Delete Vehicle
                </Button>
                <SheetClose asChild>
                    <Button variant="outline" className="w-full mt-6">
                        Close Details
                    </Button>
                </SheetClose>
            </SheetContent>
        </Sheet>
    );

    const DetailItem = ({
        icon,
        label,
        value
    }: {
        icon: React.ReactNode,
        label: string,
        value: string
    }) => (
        <div className="flex items-center gap-3 bg-background p-3 rounded-lg">
            {icon}
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );

    return (
        <>
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
                    <Button
                        className="w-full flex items-center justify-between"
                        onClick={() => setIsDetailOpen(true)}
                    >
                        View Details <ArrowRight className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>

            <VehicleDetailSheet />
        </>
    );
};

export default DisplayVehicle;