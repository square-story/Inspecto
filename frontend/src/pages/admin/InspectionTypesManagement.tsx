import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { featchAllInspectionTypes, InspectionType, toggleInspectionTypeStatus } from "@/features/inspectionType/inspectionTypeSlice"
import { AppDispatch, RootState } from "@/store"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

const InspectionTypesManagement = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { inspectionTypes, loading, error } = useSelector(
        (state: RootState) => state.inspectionType
    );

    useEffect(() => {
        dispatch(featchAllInspectionTypes());
    }, [dispatch]);

    const handleToggleStatus = async (id: string) => {
        try {
            await dispatch(toggleInspectionTypeStatus(id)).unwrap();
            toast.success("Inspection type status updated successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to update inspection type status");
        }
    };

    const handleEditClick = async (type: InspectionType) => {
        try {
            console.log(type)
            toast.success('Yess Edit modal will open in here')
        } catch (error: any) {
            toast.error(error.message || "Failed to Update the Details")
        }
    }

    const handleDeleteClick = async (type: string) => {
        try {
            console.log(type)
            toast.success('Yes Delete modal will perform')
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete the details')
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Inspection Types Management</h2>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Inspection Types</CardTitle>
                        <CardDescription>
                            Manage inspection types, pricing, and features
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-4">Loading inspection types...</div>
                        ) : error ? (
                            <div className="text-center py-4 text-red-500">{error}</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Platform Fee</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inspectionTypes.map((type) => (
                                        <TableRow key={type._id}>
                                            <TableCell className="font-medium">{type.name}</TableCell>
                                            <TableCell>₹{type.price}</TableCell>
                                            <TableCell>₹{type.platformFee}</TableCell>
                                            <TableCell>{type.duration}</TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={type.isActive}
                                                    onCheckedChange={() => handleToggleStatus(type._id)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleEditClick(type)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(type._id)}>
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default InspectionTypesManagement