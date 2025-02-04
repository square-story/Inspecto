import React, { useState, } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Calendar, Wrench, ShieldCheck, Edit, Trash2 } from "lucide-react";
import { useDispatch } from 'react-redux';
import { deleteVehicle, updateVehicle, Vehicle } from '@/features/vehicle/vehicleSlice';
import { AppDispatch } from '@/store';


interface DisplayVehicleProps {
    CarDetails: Vehicle;
    onEdit?: () => void;
    onDelete?: () => void;
    onClose?: () => void;
}

const DetailItem = ({ icon, label, value }: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="flex items-center gap-3 bg-background p-3 rounded-lg">
        {icon}
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value}</p>
        </div>
    </div>
);

const VehicleDetailSheet = ({
    isOpen,
    onOpenChange,
    carDetails,
    onEdit,
    onDelete
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    carDetails: Vehicle;
    onEdit: () => void;
    onDelete: () => void;
}) => {
    const additionalInfo = [
        { icon: <Car className="h-5 w-5 text-primary" />, label: "Vehicle Type", value: carDetails.type },
        { icon: <Calendar className="h-5 w-5 text-primary" />, label: "Year", value: carDetails.year.toString() },
        { icon: <Wrench className="h-5 w-5 text-primary" />, label: "Transmission", value: carDetails.transmission }
    ];

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <div className="flex justify-between items-center">
                        <SheetTitle>{carDetails.make} {carDetails.vehicleModel}</SheetTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={onEdit}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={onDelete}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </SheetHeader>

                <div className="space-y-6">
                    {carDetails.frontViewImage && (
                        <img
                            src={carDetails.frontViewImage}
                            alt={`${carDetails.make} ${carDetails.vehicleModel}`}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {additionalInfo.map((item, index) => (
                            <DetailItem key={index} {...item} />
                        ))}
                    </div>
                </div>

                <SheetFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

const EditVehicleDialog = ({
    isOpen,
    onOpenChange,
    vehicle,
    onSave
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle: Vehicle;
    onSave: (vehicle: Vehicle) => Promise<void>;
}) => {
    const [editedVehicle, setEditedVehicle] = useState(vehicle);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedVehicle(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Vehicle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="make">Make</Label>
                        <Input
                            id="make"
                            name="make"
                            value={editedVehicle.make}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="vehicleModel">Model</Label>
                        <Input
                            id="vehicleModel"
                            name="vehicleModel"
                            value={editedVehicle.vehicleModel}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onSave(editedVehicle)}>Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const DisplayVehicle: React.FC<DisplayVehicleProps> = ({ CarDetails, }) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = async () => {
        try {
            await dispatch(deleteVehicle(CarDetails._id)).unwrap();
        } catch (error) {
            console.error('Failed to delete vehicle:', error);
        }
    };

    const handleSave = async (vehicle: Vehicle) => {
        try {
            await dispatch(updateVehicle(vehicle)).unwrap();
            setIsEditOpen(false);
        } catch (error) {
            console.error('Failed to update vehicle:', error);
        }
    };

    return (
        <>
            <Card className="w-72">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Car className="h-5 w-5" />
                        <div>
                            <h3 className="text-sm font-medium">{CarDetails.make} {CarDetails.vehicleModel}</h3>
                            <p className="text-xs text-muted-foreground">{CarDetails.year}</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Wrench className="h-4 w-4" />
                            <span>{CarDetails.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            <span>{CarDetails.registrationNumber}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button className="w-full" onClick={() => setIsDetailOpen(true)}>
                        View Details
                    </Button>
                </CardFooter>
            </Card>

            <VehicleDetailSheet
                isOpen={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                carDetails={CarDetails}
                onEdit={() => setIsEditOpen(true)}
                onDelete={handleDelete}
            />

            <EditVehicleDialog
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                vehicle={CarDetails}
                onSave={handleSave}
            />
        </>
    );
};

export default DisplayVehicle;