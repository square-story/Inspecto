import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Vehicle } from "@/features/vehicle/vehicleSlice";
import { Barcode, Calendar, Car, ClipboardCheck, Edit, Fuel, Palette, ShieldCheck, Trash2, Wrench } from "lucide-react";



const DetailItem = ({ icon, label, value }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) => (
    <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg">
        <span className="text-muted-foreground">{icon}</span>
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xs font-thin">{value || 'N/A'}</p>
        </div>
    </div>
);

export const VehicleDetailSheet = ({
    isOpen,
    onOpenChange,
    vehicle,
    onEdit,
    onDelete
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle: Vehicle;
    onEdit: () => void;
    onDelete: () => void;
}) => {
    const formatDate = (date: Date) =>
        new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <div className="flex justify-between items-center pt-6">
                        <SheetTitle className="text-2xl">{vehicle.make} {vehicle.vehicleModel}</SheetTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={onEdit}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={onDelete}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <Separator />
                </SheetHeader>

                <ScrollArea className="h-[calc(90vh-8rem)] px-2">
                    <div className="space-y-8 mt-6">
                        {(vehicle.frontViewImage || vehicle.rearViewImage) && (
                            <div className="grid grid-cols-2 gap-4">
                                {vehicle.frontViewImage && (
                                    <img
                                        src={vehicle.frontViewImage}
                                        alt="Front view"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                )}
                                {vehicle.rearViewImage && (
                                    <img
                                        src={vehicle.rearViewImage}
                                        alt="Rear view"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                )}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Specifications</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem
                                        icon={<Car className="h-5 w-5" />}
                                        label="Vehicle Type"
                                        value={vehicle.type}
                                    />
                                    <DetailItem
                                        icon={<Calendar className="h-5 w-5" />}
                                        label="Year"
                                        value={vehicle.year}
                                    />
                                    <DetailItem
                                        icon={<Wrench className="h-5 w-5" />}
                                        label="Transmission"
                                        value={vehicle.transmission}
                                    />
                                    <DetailItem
                                        icon={<Fuel className="h-5 w-5" />}
                                        label="Fuel Type"
                                        value={vehicle.fuelType}
                                    />
                                    <DetailItem
                                        icon={<Palette className="h-5 w-5" />}
                                        label="Color"
                                        value={vehicle.color || 'N/A'}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Registration & Identification</h3>
                                <div className="grid grid-row-2 gap-4">
                                    <DetailItem
                                        icon={<ShieldCheck className="h-5 w-5" />}
                                        label="Registration Number"
                                        value={vehicle.registrationNumber}
                                    />
                                    <DetailItem
                                        icon={<Barcode className="h-5 w-5" />}
                                        label="Chassis Number"
                                        value={vehicle.chassisNumber}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Dates</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem
                                        icon={<Calendar className="h-5 w-5" />}
                                        label="Insurance Expiry"
                                        value={formatDate(vehicle.insuranceExpiry)}
                                    />
                                    <DetailItem
                                        icon={<ClipboardCheck className="h-5 w-5" />}
                                        label="Last Inspection"
                                        value={vehicle.lastInspectionDate ? formatDate(vehicle.lastInspectionDate) : 'N/A'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </ScrollArea>
                <SheetFooter className="mt-6">
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};