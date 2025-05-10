import { Vehicle } from "@/features/vehicle/vehicleSlice";
import { useSignedImage } from "@/hooks/useSignedImage";
import { format } from "date-fns";
import { Car } from "lucide-react";

export const VehicleDetails = ({ vehicle }: { vehicle: Vehicle }) => {
    const { imageUrl: frontImageUrl, isLoading: isFrontLoading, error: frontError } =
        useSignedImage(vehicle.frontViewImage);

    const { imageUrl: rearImageUrl, isLoading: isRearLoading, error: rearError } =
        useSignedImage(vehicle.rearViewImage);
    return (
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
                        {vehicle.lastInspectionId?.date
                            ? format(new Date(vehicle.lastInspectionId.date), 'dd MMM yyyy')
                            : "N/A"}
                    </p>
                </div>
            </div>

            {(vehicle.frontViewImage || vehicle.rearViewImage) && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                    {vehicle.frontViewImage && (
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Front View</p>
                            {isFrontLoading ? (
                                <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg">
                                    <span className="text-xs text-muted-foreground">Loading...</span>
                                </div>
                            ) : frontError ? (
                                <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg">
                                    <span className="text-xs text-red-500">Failed to load image</span>
                                </div>
                            ) : (
                                <img
                                    src={frontImageUrl}
                                    alt="Front view"
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                            )}
                        </div>
                    )}
                    {vehicle.rearViewImage && (
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Rear View</p>
                            {isRearLoading ? (
                                <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg">
                                    <span className="text-xs text-muted-foreground">Loading...</span>
                                </div>
                            ) : rearError ? (
                                <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg">
                                    <span className="text-xs text-red-500">Failed to load image</span>
                                </div>
                            ) : (
                                <img
                                    src={rearImageUrl}
                                    alt="Rear view"
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
};