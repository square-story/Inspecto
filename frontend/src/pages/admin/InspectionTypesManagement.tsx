"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TagsInput } from "@/components/ui/tags-input"
import {
    createInspectionType,
    deleteInspectionType,
    featchAllInspectionTypes,
    type InspectionType,
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
import { z } from "zod"

// Full schema for creating new inspection types
const inspectionTypeCreateSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters." })
        .max(20, { message: "Name must not be longer than 20 characters." }),
    price: z.coerce.number().min(50, "minimum value will 50").max(700, "Maximum value will 700"),
    platformFee: z.coerce.number().min(50, "minimum value will 50").max(700, "Maximum value will 700"),
    duration: z.string().min(2, { message: "duration will be at least 2 characters" }),
    features: z.array(z.string()).min(1, { message: "At least one feature is required" }),
    isActive: z.boolean().default(true),
})

// Simplified schema for editing (without name field)
const inspectionTypeEditSchema = z.object({
    price: z.coerce.number().min(50, "minimum value will 50").max(700, "Maximum value will 700"),
    platformFee: z.coerce.number().min(50, "minimum value will 50").max(700, "Maximum value will 700"),
    duration: z.string().min(2, { message: "duration will be at least 2 characters" }),
    features: z.array(z.string()).min(1, { message: "At least one feature is required" }),
})

export type InspectionTypeCreateValues = z.infer<typeof inspectionTypeCreateSchema>
export type InspectionTypeEditValues = z.infer<typeof inspectionTypeEditSchema>

const defaultCreateValues: InspectionTypeCreateValues = {
    name: "",
    price: 50,
    platformFee: 50,
    duration: "",
    features: [""],
    isActive: true,
}

const defaultEditValues: InspectionTypeEditValues = {
    price: 50,
    platformFee: 50,
    duration: "",
    features: [""],
}

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
        } catch (error: any) {
            toast.error(error.message || "Failed to create inspection type")
        }
    }

    // Handle toggle status
    const handleToggleStatus = async (id: string) => {
        try {
            await dispatch(toggleInspectionTypeStatus(id)).unwrap()
            toast.success("Status updated successfully")
            dispatch(featchAllInspectionTypes())
        } catch (error: any) {
            toast.error(error.message || "Failed to update status")
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
                        name: currentType.name, // Keep the original name
                        isActive: currentType.isActive, // Keep the original status
                    },
                }),
            ).unwrap()

            toast.success("Updated successfully!")
            setIsEditDialogOpen(false)
            setCurrentType(null)
            dispatch(featchAllInspectionTypes()) // Refresh the data
        } catch (error: any) {
            toast.error(error.message || "Failed to update")
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
        } catch (error: any) {
            toast.error(error.message || "Failed to delete")
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

                {/* Create Dialog */}
                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={(open) => {
                        setIsCreateDialogOpen(open)
                        if (!open) createForm.reset(defaultCreateValues)
                    }}
                >
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Inspection Type</DialogTitle>
                            <DialogDescription>Create a new inspection type with details and features.</DialogDescription>
                        </DialogHeader>
                        <Form {...createForm}>
                            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)}>
                                <ScrollArea className="max-h-[60vh] pr-4">
                                    <div className="grid gap-4 py-2">
                                        <FormField
                                            control={createForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Inspection Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Inspection Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={createForm.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Price (₹)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={createForm.control}
                                                name="platformFee"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Platform Fee (₹)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={createForm.control}
                                            name="duration"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Duration</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 45-60 mins" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={createForm.control}
                                            name="features"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Features</FormLabel>
                                                    <FormControl>
                                                        <TagsInput
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            placeholder="Enter features..."
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={createForm.control}
                                            name="isActive"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormLabel>Is Active</FormLabel>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </ScrollArea>
                                <DialogFooter className="mt-6">
                                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        Create
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) {
                            setCurrentType(null)
                            editForm.reset(defaultEditValues)
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Edit {currentType?.name}</DialogTitle>
                            <DialogDescription>Modify price, fee, duration and features.</DialogDescription>
                        </DialogHeader>
                        <Form {...editForm}>
                            <form onSubmit={editForm.handleSubmit(handleEditSubmit)}>
                                <ScrollArea className="max-h-[60vh] pr-4">
                                    <div className="grid gap-4 py-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={editForm.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Price (₹)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={editForm.control}
                                                name="platformFee"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Platform Fee (₹)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={editForm.control}
                                            name="duration"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Duration</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 45-60 mins" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={editForm.control}
                                            name="features"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Features</FormLabel>
                                                    <FormControl>
                                                        <TagsInput
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            placeholder="Enter features..."
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </ScrollArea>
                                <DialogFooter className="mt-6">
                                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

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
