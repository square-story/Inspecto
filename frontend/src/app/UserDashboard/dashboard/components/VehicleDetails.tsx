import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PlusCircle } from "lucide-react";

interface Vehicle {
    _id: string;
    make: string;
    model: string;
    year: string;
    registrationNumber: string;
    fuelType: string;
    lastInspectionDate?: string;
    status: "active" | "inactive" | "pending";
}

const VehicleDetails = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // In a real implementation, fetch data from API
        // For now, using mock data
        setTimeout(() => {
            setVehicles([
                {
                    _id: "veh1",
                    make: "Toyota",
                    model: "Camry",
                    year: "2019",
                    registrationNumber: "KA-01-AB-1234",
                    fuelType: "Petrol",
                    lastInspectionDate: "2023-01-15",
                    status: "active"
                },
                {
                    _id: "veh2",
                    make: "Honda",
                    model: "City",
                    year: "2020",
                    registrationNumber: "KA-02-CD-5678",
                    fuelType: "Petrol",
                    lastInspectionDate: "2023-03-10",
                    status: "active"
                },
                {
                    _id: "veh3",
                    make: "Maruti Suzuki",
                    model: "Swift",
                    year: "2021",
                    registrationNumber: "KA-03-EF-9012",
                    fuelType: "Diesel",
                    status: "pending"
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleAddVehicle = () => {
        navigate("/user/dashboard/vehicles/add");
    };

    const handleViewVehicle = (id: string) => {
        navigate(`/user/dashboard/vehicles/${id}`);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "active":
                return "success";
            case "inactive":
                return "destructive";
            case "pending":
                return "outline";
            default:
                return "secondary";
        }
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
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Your Vehicles</h3>
                <Button size="sm" onClick={handleAddVehicle}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Vehicle
                </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => (
                    <Card key={vehicle._id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">
                                    {vehicle.make} {vehicle.model}
                                </CardTitle>
                                <Badge variant={getStatusBadgeVariant(vehicle.status) as any}>
                                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
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
                                {vehicle.lastInspectionDate && (
                                    <p className="text-sm">
                                        <span className="font-medium">Last Inspection:</span> {new Date(vehicle.lastInspectionDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleViewVehicle(vehicle._id)}
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