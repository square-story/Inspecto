import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    Car, Wrench, ShieldCheck,
} from "lucide-react";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { deleteVehicle, Vehicle, } from '@/features/vehicle/vehicleSlice';
import { EditVehicleDialog } from './EditVehicleDialog';
import { VehicleDetailSheet } from './VehicleDetailSheet';

interface DisplayVehicleProps {
    vehicle: Vehicle;
}



const DisplayVehicle: React.FC<DisplayVehicleProps> = ({ vehicle }) => {
    const dispatch = useDispatch<AppDispatch>()
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);


    const handleDelete = async () => {
        try {
            await dispatch(deleteVehicle(vehicle._id)).unwrap();
            setIsDetailOpen(false);
        } catch (error) {
            console.error('Failed to delete vehicle:', error);
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
            />
        </>
    );
};

export default DisplayVehicle;