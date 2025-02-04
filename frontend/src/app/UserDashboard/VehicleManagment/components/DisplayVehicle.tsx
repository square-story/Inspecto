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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Vehicle } from "@/features/vehicle/vehicleSlice";
import {
    ArrowRight,
    Car,
    Calendar,
    Wrench,
    ShieldCheck,
    Edit,
    Trash2,
    BookText
} from "lucide-react";
import { useDispatch } from 'react-redux';
import { deleteVehicle, updateVehicle } from '@/features/vehicle/vehicleSlice';
import { AppDispatch } from '@/store';

interface DisplayVehicleProps {
    CarDetails: Vehicle;
}

const DisplayVehicle: React.FC<DisplayVehicleProps> = ({ CarDetails }) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editedVehicle, setEditedVehicle] = useState<Vehicle>(CarDetails);

    const dispatch = useDispatch<AppDispatch>();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedVehicle(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveEdit = () => {
        // Dispatch update action
        dispatch(updateVehicle(editedVehicle));
        setIsEditModalOpen(false);
        setIsDetailOpen(false);
    };

    const handleDelete = () => {
        // Dispatch delete action
        dispatch(deleteVehicle(CarDetails._id));
        setIsDeleteDialogOpen(false);
        setIsDetailOpen(false);
    };

    const VehicleDetailSheet = () => (
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <SheetContent className="w-[500px] overflow-y-auto pt-14">
                <SheetHeader className="mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Car className="h-6 w-6 text-primary" />
                            <SheetTitle>{CarDetails.make} {CarDetails.vehicleModel}</SheetTitle>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
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

                <SheetClose asChild>
                    <Button variant="outline" className="w-full mt-6">
                        Close Details
                    </Button>
                </SheetClose>
            </SheetContent>
        </Sheet>
    );

    const EditVehicleDialog = () => (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Vehicle Details</DialogTitle>
                    <DialogDescription>
                        Make changes to your vehicle information here.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="make" className="text-right">
                            Make
                        </Label>
                        <Input
                            id="make"
                            name="make"
                            value={editedVehicle.make}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="vehicleModel" className="text-right">
                            Model
                        </Label>
                        <Input
                            id="vehicleModel"
                            name="vehicleModel"
                            value={editedVehicle.vehicleModel}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="year" className="text-right">
                            Year
                        </Label>
                        <Input
                            id="year"
                            name="year"
                            type="number"
                            value={editedVehicle.year}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    {/* Add more fields as needed */}
                </div>
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );

    const DeleteConfirmationDialog = () => (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the vehicle from your records.
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={handleDelete}
                    >
                        Delete Vehicle
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
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
            <EditVehicleDialog />
            <DeleteConfirmationDialog />
        </>
    );
};

export default DisplayVehicle;