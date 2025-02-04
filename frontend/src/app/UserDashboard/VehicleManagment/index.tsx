import ContentSection from "@/components/content-section";
import { fetchVehicles } from "@/features/vehicle/vehicleSlice";
import { AppDispatch, RootState } from "@/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DisplayVehicle from "./components/DisplayVehicle";
import AddVehicleDialog from "./components/AddVechicleDialogBox";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const VehicleManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const vehicles = useSelector((state: RootState) => state.vehicle.vehicles);

    const refreshVehicles = React.useCallback(() => {
        dispatch(fetchVehicles());
    }, [dispatch]);

    React.useEffect(() => {
        refreshVehicles();
    }, [refreshVehicles]);

    return (
        <ContentSection
            title="Vehicle Section"
            desc="Manage Your Vehicles Here"
            className="p-4 bg-background rounded-lg border"
            scrollAreaClassName="p-3"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {vehicles.map((vehicle) => (
                    <DisplayVehicle
                        key={vehicle._id}
                        vehicle={vehicle}
                    />
                ))}
                <Card className="w-72 flex flex-col items-center justify-center p-6 border-dashed border-2 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer text-center">
                    <PlusCircle className="w-10 h-10 mb-5" />
                    <AddVehicleDialog onSuccess={refreshVehicles} />
                </Card>
            </div>
        </ContentSection>
    );
};




export default VehicleManagement;