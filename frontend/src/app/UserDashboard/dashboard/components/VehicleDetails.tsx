import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
// import { PlusCircle } from "lucide-react";
import { Vehicle } from "@/features/vehicle/vehicleSlice";
import { formatDate } from "date-fns";


const VehicleDetails = ({ vehicles, loading }: { vehicles: Vehicle[]; loading: boolean }) => {
    const navigate = useNavigate();

    const handleAddVehicle = () => {
        navigate("/user/dashboard/vehicles");
    };

    const handleViewVehicle = () => {
        navigate(`/user/dashboard/vehicles`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <LoadingSpinner />
            </div>
        );
    }

    if (vehicles.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center h-40 p-6">
                    <p className="text-muted-foreground mb-4">No vehicles found</p>
                    <Button onClick={handleAddVehicle}>
                        Add a Vehicle
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Your Vehicles</h3>
                <Button size="sm" onClick={handleAddVehicle}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Vehicle
                </Button>
            </div> */}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => (
                    <Card key={vehicle._id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">
                                    {vehicle.make} {vehicle.vehicleModel}
                                </CardTitle>
                                <Badge variant={vehicle.lastInspectionId?.report?.passedInspection ? "outline" : "secondary"}>
                                    {vehicle.lastInspectionId?.report?.passedInspection ? "Passed" : "Failed"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {vehicle.year} • {vehicle.fuelType}
                            </p>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="space-y-1">
                                <p className="text-sm">
                                    <span className="font-medium">Registration:</span> {vehicle.registrationNumber}
                                </p>
                                {vehicle.lastInspectionId?.date && (
                                    <p className="text-sm">
                                        <span className="font-medium">Last Inspection:</span> {formatDate(new Date(vehicle.lastInspectionId.date), 'PP')}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => handleViewVehicle()}
                            >
                                View Details
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VehicleDetails;