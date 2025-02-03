import ContentSection from "@/components/content-section";
import { fetchVehicles } from "@/features/vehicle/vehicleSlice";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DisplayVehicle from "./components/DisplayVehicle";
import AddVehicleDialog from "./components/AddVechicleDialogBox";

const VehicleManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const vehicles = useSelector((state: RootState) => state.vehicle.vehicles);

    useEffect(() => {
        dispatch(fetchVehicles());
    }, [dispatch]);

    return (
        <ContentSection
            title="Vehicle Section"
            desc="Manage Your Vehicles Here"
            className="p-4 bg-background rounded-lg border"
            scrollAreaClassName="p-3"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {vehicles.map((vehicle) => (
                    <DisplayVehicle key={vehicle._id} CarDetails={vehicle} />
                ))}
                <div className="flex justify-center items-center">
                    <AddVehicleDialog />
                </div>
            </div>
        </ContentSection>
    );
};

export default VehicleManagement;