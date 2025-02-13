import { Vehicle } from "@/features/vehicle/vehicleSlice";
import { format } from "date-fns";
import { Car } from "lucide-react";

export const VehicleDetails = ({ vehicle }: { vehicle: Vehicle }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            <h3 className="text-lg font-semibold">{vehicle.make} {vehicle.vehicleModel}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <p className="text-gray-500">Registration</p>
                <p className="font-medium">{vehicle.registrationNumber || "N/A"}</p>
            </div>
            <div>
                <p className="text-gray-500">Year</p>
                <p className="font-medium">{vehicle.year || "N/A"}</p>
            </div>
            <div>
                <p className="text-gray-500">Vehicle Type</p>
                <p className="font-medium capitalize">{vehicle.type || "N/A"}</p>
            </div>
            <div>
                <p className="text-gray-500">Color</p>
                <p className="font-medium capitalize">{vehicle.color || "N/A"}</p>
            </div>
            <div>
                <p className="text-gray-500">Fuel Type</p>
                <p className="font-medium capitalize">{vehicle.fuelType || "N/A"}</p>
            </div>
            <div>
                <p className="text-gray-500">Transmission</p>
                <p className="font-medium capitalize">{vehicle.transmission || "N/A"}</p>
            </div>
            <div>
                <p className="text-gray-500">Chassis Number</p>
                <p className="font-medium">{vehicle.chassisNumber || "N/A"}</p>
            </div>
            <div>
                <p className="text-gray-500">Insurance Expiry</p>
                <p className="font-medium">
                    {vehicle.insuranceExpiry
                        ? format(new Date(vehicle.insuranceExpiry), 'dd MMM yyyy')
                        : "N/A"}
                </p>
            </div>
            <div>
                <p className="text-gray-500">Last Inspection</p>
                <p className="font-medium">
                    {vehicle.lastInspectionDate
                        ? format(new Date(vehicle.lastInspectionDate), 'dd MMM yyyy')
                        : "N/A"}
                </p>
            </div>
        </div>

        {(vehicle.frontViewImage || vehicle.rearViewImage) && (
            <div className="grid grid-cols-2 gap-4 pt-2">
                {vehicle.frontViewImage && (
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Front View</p>
                        <img
                            src={vehicle.frontViewImage}
                            alt="Vehicle front view"
                            className="rounded-md w-full h-32 object-cover"
                        />
                    </div>
                )}
                {vehicle.rearViewImage && (
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Rear View</p>
                        <img
                            src={vehicle.rearViewImage}
                            alt="Vehicle rear view"
                            className="rounded-md w-full h-32 object-cover"
                        />
                    </div>
                )}
            </div>
        )}
    </div>
);