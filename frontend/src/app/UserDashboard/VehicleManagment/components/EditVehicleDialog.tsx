import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Transmission, Vehicle, VehicleType } from "@/features/vehicle/vehicleSlice";
import { useState } from "react";

export const EditVehicleDialog = ({
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
            <DialogContent className="max-h-[80h] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Edit Vehicle Details</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-full max-h-[calc(90vh-8rem)] px-5">
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
                </ScrollArea>

                <div className="flex justify-end gap-5 mt-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onSave(editedVehicle)}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};