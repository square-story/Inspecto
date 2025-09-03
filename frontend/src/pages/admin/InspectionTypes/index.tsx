"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    createInspectionType,
    deleteInspectionType,
    featchAllInspectionTypes,
    toggleInspectionTypeStatus,
    updateInspectionType,
} from "@/features/inspectionType/inspectionTypeSlice"
import type { AppDispatch, RootState } from "@/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useConfirm } from "@omit/react-confirm-dialog"
import { Pencil, Plus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { InspectionTypeDialog } from "./components/InspectionTypeDialog"
import { InspectionType, inspectionTypeCreateSchema, InspectionTypeCreateValues, inspectionTypeEditSchema, InspectionTypeEditValues } from "@/types/inspection.types"
import { defaultCreateValues, defaultEditValues } from "./default"
import { AxiosError } from "axios"


const InspectionTypesManagement = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [currentType, setCurrentType] = useState<InspectionType | null>(null)
    const confirm = useConfirm()

    // Create form
    const createForm = useForm<InspectionTypeCreateValues>({
        resolver: zodResolver(inspectionTypeCreateSchema),
        defaultValues: defaultCreateValues,
        mode: "onChange",
    })

    // Edit form
    const editForm = useForm<InspectionTypeEditValues>({
        resolver: zodResolver(inspectionTypeEditSchema),
        defaultValues: defaultEditValues,
        mode: "onChange",
    })

    const dispatch = useDispatch<AppDispatch>()
    const { inspectionTypes, loading, error } = useSelector((state: RootState) => state.inspectionType)

    // Fetch inspection types on component mount
    useEffect(() => {
        dispatch(featchAllInspectionTypes())
    }, [dispatch])

    // Handle create form submission
    const handleCreateSubmit = async (data: InspectionTypeCreateValues) => {
        try {
            await dispatch(createInspectionType(data)).unwrap()
            toast.success("Inspection type created successfully!")
            setIsCreateDialogOpen(false)
            createForm.reset(defaultCreateValues)
            dispatch(featchAllInspectionTypes()) // Refresh the data
        } catch (error: unknown) {
            toast.error((error as AxiosError).message || "Failed to create inspection type")
        }
    }

    // Handle toggle status
    const handleToggleStatus = async (id: string) => {
        try {
            await dispatch(toggleInspectionTypeStatus(id)).unwrap()
            toast.success("Status updated successfully")
            dispatch(featchAllInspectionTypes())
        } catch (error: unknown) {
            toast.error((error as AxiosError).message || "Failed to update status")
        }
    }

    // Open edit dialog with current type data
    const handleEditClick = (type: InspectionType) => {
        setCurrentType(type)
        editForm.reset({
            price: type.price,
            platformFee: type.platformFee,
            duration: type.duration,
            features: type.features,
            fields: type.fields,
            isActive: type.isActive,
        })

        setIsEditDialogOpen(true)
    }

    // Handle edit form submission
    const handleEditSubmit = async (data: InspectionTypeEditValues) => {
        if (!currentType?._id) return

        try {
            await dispatch(
                updateInspectionType({
                    id: currentType._id,
                    data: {
                        ...data,
                        isActive: currentType.isActive, // Keep the original status
                    },
                }),
            ).unwrap()

            toast.success("Updated successfully!")
            setIsEditDialogOpen(false)
            setCurrentType(null)
            dispatch(featchAllInspectionTypes()) // Refresh the data
        } catch (error: unknown) {
            toast.error((error as AxiosError).message || "Failed to update")
        }
    }

    // Handle delete with confirmation
    const handleDeleteClick = async (id: string) => {
        try {
            const response = await confirm({
                title: "Delete Item",
                description: "Are you sure? This action cannot be undone.",
                icon: <Trash className="size-4 text-destructive" />,
                confirmText: "Delete",
                cancelText: "Cancel",
                cancelButton: {
                    size: "default",
                    variant: "outline",
                },
                confirmButton: {
                    className: "bg-red-500 hover:bg-red-600 text-white",
                },
                alertDialogTitle: {
                    className: "flex items-center gap-2",
                },
            })

            if (response) {
                await dispatch(deleteInspectionType(id)).unwrap()
                dispatch(featchAllInspectionTypes())
                toast.success("Deleted successfully!")
            }
        } catch (error: unknown) {
            toast.error((error as AxiosError).message || "Failed to delete")
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Inspection Types</h2>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Type
                    </Button>
                </div>

                <InspectionTypeDialog
                    open={isCreateDialogOpen}
                    setOpen={setIsCreateDialogOpen}
                    title="Add New Inspection Type"
                    description="Create a new inspection type with details and features."
                    form={createForm as never}
                    onSubmit={handleCreateSubmit as never}
                    loading={loading}
                />

                <InspectionTypeDialog
                    open={isEditDialogOpen}
                    setOpen={setIsEditDialogOpen}
                    title={`Edit ${currentType?.name}`}
                    description="Modify price, fee, duration and features."
                    form={editForm}
                    onSubmit={handleEditSubmit}
                    loading={loading}
                    isEdit
                />
                {/* Main Content */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Inspection Types</CardTitle>
                        <CardDescription>Manage pricing and features</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-4">Loading...</div>
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
                                                <Switch checked={type.isActive} onCheckedChange={() => handleToggleStatus(type._id)} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleEditClick(type)}>
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                    <Button variant="outline" size="icon" onClick={() => handleDeleteClick(type._id)}>
                                                        <Trash className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </div>
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
