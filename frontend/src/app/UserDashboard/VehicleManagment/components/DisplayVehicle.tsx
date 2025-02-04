import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Car, Calendar, Wrench, ShieldCheck, Edit, Trash2, Fuel, Palette,
    Barcode, ClipboardCheck,
} from "lucide-react";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { deleteVehicle, Transmission, updateVehicle, Vehicle, VehicleType } from '@/features/vehicle/vehicleSlice';

interface DisplayVehicleProps {
    vehicle: Vehicle;
}

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

const VehicleDetailSheet = ({
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
            <SheetContent className="overflow-y-auto">
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
                </SheetHeader>

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

                <SheetFooter className="mt-6">
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedVehicle(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name: keyof Vehicle, value: string) => {
        setEditedVehicle(prev => ({
            ...prev,
            [name]: value ? new Date(value) : undefined
        }));
    };

    const handleNumberChange = (name: keyof Vehicle, value: string) => {
        setEditedVehicle(prev => ({
            ...prev,
            [name]: value ? parseInt(value, 10) : 0
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Edit Vehicle Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-8 py-4">
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">General Information</h4>
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
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="year">Year</Label>
                                <Input
                                    type="number"
                                    id="year"
                                    name="year"
                                    value={editedVehicle.year}
                                    onChange={(e) => handleNumberChange('year', e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type">Vehicle Type</Label>
                                <select
                                    id="type"
                                    name="type"
                                    value={editedVehicle.type}
                                    onChange={handleInputChange}
                                    className="col-span-3 border rounded-md p-2 bg-background"
                                >
                                    {Object.values(VehicleType).map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="color">Color</Label>
                                <Input
                                    type="color"
                                    id="color"
                                    name="color"
                                    value={editedVehicle.color || '#ffffff'}
                                    onChange={handleInputChange}
                                    className="col-span-3 h-10 w-20 p-1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Registration & Identification</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="registrationNumber">Registration Number</Label>
                                <Input
                                    id="registrationNumber"
                                    name="registrationNumber"
                                    value={editedVehicle.registrationNumber}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="chassisNumber">Chassis Number</Label>
                                <Input
                                    id="chassisNumber"
                                    name="chassisNumber"
                                    value={editedVehicle.chassisNumber}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Technical Specifications</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="fuelType">Fuel Type</Label>
                                <select
                                    id="fuelType"
                                    name="fuelType"
                                    value={editedVehicle.fuelType}
                                    onChange={handleInputChange}
                                    className="col-span-3 border rounded-md p-2 bg-background"
                                >
                                    {['petrol', 'diesel', 'electric', 'hybrid'].map((type) => (
                                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="transmission">Transmission</Label>
                                <select
                                    id="transmission"
                                    name="transmission"
                                    value={editedVehicle.transmission}
                                    onChange={handleInputChange}
                                    className="col-span-3 border rounded-md p-2 bg-background"
                                >
                                    {Object.values(Transmission).map((trans) => (
                                        <option key={trans} value={trans}>{trans}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Dates</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                                <Input
                                    type="date"
                                    id="insuranceExpiry"
                                    name="insuranceExpiry"
                                    onChange={(e) => handleDateChange('insuranceExpiry', e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="lastInspectionDate">Last Inspection</Label>
                                <Input
                                    type="date"
                                    id="lastInspectionDate"
                                    name="lastInspectionDate"
                                    onChange={(e) => handleDateChange('lastInspectionDate', e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Images</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="frontViewImage">Front Image URL</Label>
                                <Input
                                    id="frontViewImage"
                                    name="frontViewImage"
                                    value={editedVehicle.frontViewImage || ''}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="rearViewImage">Rear Image URL</Label>
                                <Input
                                    id="rearViewImage"
                                    name="rearViewImage"
                                    value={editedVehicle.rearViewImage || ''}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onSave(editedVehicle)}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const DisplayVehicle: React.FC<DisplayVehicleProps> = ({ vehicle }) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = async () => {
        try {
            await dispatch(deleteVehicle(vehicle._id)).unwrap();
            setIsDetailOpen(false);
        } catch (error) {
            console.error('Failed to delete vehicle:', error);
        }
    };

    const handleSave = async (editedVehicle: Vehicle) => {
        try {
            await dispatch(updateVehicle(editedVehicle)).unwrap();
            setIsEditOpen(false);
        } catch (error) {
            console.error('Failed to update vehicle:', error);
        }
    };

    return (
        <>
            <Card className="w-72 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <Car className="h-6 w-6 text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">{vehicle.make} {vehicle.vehicleModel}</h3>
                            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pb-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                            <span>{vehicle.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">{vehicle.registrationNumber}</span>
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
                vehicle={vehicle}
                onEdit={() => setIsEditOpen(true)}
                onDelete={handleDelete}
            />

            <EditVehicleDialog
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                vehicle={vehicle}
                onSave={handleSave}
            />
        </>
    );
};

export default DisplayVehicle;