import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Vehicle } from "@/features/vehicle/vehicleSlice";
import { useSignedImage } from "@/hooks/useSignedImage";
import { AlertCircle, Barcode, Calendar, Car, ClipboardCheck, Download, Edit, Fuel, Palette, ShieldCheck, Trash2, View, Wrench } from "lucide-react";
import { format } from 'date-fns';
import { toast } from "sonner";
import { getSignedPdfUrl } from "@/utils/cloudinary";
import { saveAs } from "file-saver"
import { useNavigate } from "react-router-dom";



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

export const VehicleDetailSheet = ({
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
        format(new Date(date), 'MMM dd, yyyy');

    const { imageUrl: frontImageUrl, isLoading: isFrontLoading, error: frontError } =
        useSignedImage(isOpen ? vehicle.frontViewImage : null);

    const { imageUrl: rearImageUrl, isLoading: isRearLoading, error: rearError } =
        useSignedImage(isOpen ? vehicle.rearViewImage : null);

    const navigate = useNavigate();

    const DownloadReport = async () => {
        try {
            if (!vehicle?.lastInspectionId?.report?.reportPdfUrl) {
                toast.error("Report PDF not available")
                return
            }

            // Get signed URL from backend
            const signedUrl = await getSignedPdfUrl(vehicle.lastInspectionId.report.reportPdfUrl)

            // Fetch the PDF blob
            const response = await fetch(signedUrl)
            const pdfBlob = await response.blob()

            // Download with proper filename
            const filename = `Inspection-Report-${vehicle.lastInspectionId.bookingReference}.pdf`
            saveAs(pdfBlob, filename)

            toast.success("Report download started")
        } catch {
            toast.error("Error downloading report")
        }
    };

    const ViewReport = async () => {
        try {
            if (!vehicle?.lastInspectionId?.report?.reportPdfUrl) {
                toast.error("Report PDF not available")
                return
            }

            navigate(`/user/dashboard/report/${vehicle.lastInspectionId._id}`);

            toast.success("Report opened in new tab")
        } catch {
            toast.error("Error opening report")
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent>
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
                    <Separator />
                </SheetHeader>

                <ScrollArea className="h-[calc(90vh-8rem)] px-2">
                    <div className="space-y-8 mt-6">
                        {(vehicle.frontViewImage || vehicle.rearViewImage) && (
                            <div className="grid grid-cols-2 gap-4">
                                {vehicle.frontViewImage && (
                                    <div className="relative w-full h-40">
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
                                    <div className="relative w-full h-40">
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
                                    {vehicle.lastInspectionId && vehicle.lastInspectionId.report?.reportPdfUrl && (
                                        <>
                                            <Button onClick={() => DownloadReport()} className="col-span-2 mt-4" variant="outline">
                                                <Download className="h-4 w-4 mr-2" />
                                                Download Inspection Report
                                            </Button>
                                            <Button onClick={() => ViewReport()} className="col-span-2 mt-4" variant="outline">
                                                <View className="h-4 w-4 mr-2" />
                                                View Inspection Report
                                            </Button>
                                        </>

                                    )}
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
                                        icon={<AlertCircle className="h-5 w-5" />}
                                        label="Last Inspection Status"
                                        value={vehicle.lastInspectionId?.report?.status ? vehicle.lastInspectionId.report.status : 'N/A'}
                                    />
                                    <DetailItem
                                        icon={<ClipboardCheck className="h-5 w-5" />}
                                        label="Last Inspection"
                                        value={vehicle.lastInspectionId?.date ? formatDate(vehicle.lastInspectionId.date) : 'N/A'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </ScrollArea>
                <SheetFooter className="mt-6">
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};