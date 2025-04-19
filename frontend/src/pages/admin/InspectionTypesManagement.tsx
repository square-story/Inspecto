import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TagsInput } from "@/components/ui/tags-input"
import { createInspectionType, deleteInspectionType, featchAllInspectionTypes, InspectionType, toggleInspectionTypeStatus, updateInspectionType } from "@/features/inspectionType/inspectionTypeSlice"
import { AppDispatch, RootState } from "@/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useConfirm } from "@omit/react-confirm-dialog"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { string, z } from "zod"


const defaultFormData: InspectionType = {
    name: "",
    price: 0,
    platformFee: 0,
    duration: "",
    features: [""],
    isActive: true,
};

const inspectionTypeFormSchema = z.object({
    name: string().min(2, { message: 'Inspection Type name must be at least 2 characters.' })
        .max(20, { message: 'Inspection Type name must not be longer than 20 characters.' }),
    price: z.coerce.number().min(50, "minimum value will 50").max(700, 'Maximum value will 700'),
    platformFee: z.coerce.number().min(50, "minimum value will 50").max(700, 'Maximum value will 700'),
    duration: string().min(2, { message: 'duration will be at least 2 characters' }),
    features: z.array(z.string()).min(1, { message: 'At least one feature is required' }),
    isActive: z.boolean(),
})

export type InspectionTypeFormValues = z.infer<typeof inspectionTypeFormSchema>



const InspectionTypesManagement = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState<InspectionType>(defaultFormData);
    const confirm = useConfirm();


    const form = useForm<InspectionTypeFormValues>({
        resolver: zodResolver(inspectionTypeFormSchema),
        defaultValues: defaultFormData,
        mode: 'onChange'
    })

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

    async function onSubmit(data: InspectionTypeFormValues) {
        try {
            await dispatch(createInspectionType(data)).unwrap();
            toast.success('Inspection type created successfully!');
            setIsCreateDialogOpen(false);
            setFormData(defaultFormData);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to create inspection type")
        }
    }

    const handleEditClick = async (type: InspectionType) => {

        const response = await confirm({
            title: 'Edit Item',
            description: 'Are you sure? This action cannot be undone.',
            icon: <Edit className="size-4 text-yellow-400" />,
            confirmText: 'Edit',
            cancelText: 'Cancel',
            cancelButton: {
                size: 'default',
                variant: 'outline'
            },
            confirmButton: {
                className: 'bg-red-500 hover:bg-red-600 text-white'
            },
            alertDialogTitle: {
                className: 'flex items-center gap-2'
            }
        })
        if (response) {
            setFormData(type);
            form.reset({
                name: type.name,
                price: type.price,
                platformFee: type.platformFee,
                duration: type.duration,
                features: type.features,
                isActive: type.isActive
            });
            setIsEditDialogOpen(true);
        }
    };

    const handleEditSubmit = async (data: InspectionTypeFormValues) => {
        try {
            await dispatch(updateInspectionType({
                id: formData._id as string,
                data
            })).unwrap();
            toast.success('Inspection type updated successfully!');
            setIsEditDialogOpen(false);
            setFormData(defaultFormData);
            form.reset(defaultFormData);
        } catch (error: any) {
            toast.error(error.message || "Failed to update inspection type");
        }
    };

    const handleDeleteClick = async (type: string) => {
        try {
            const response = await confirm({
                title: 'Delete Item',
                description: 'Are you sure? This action cannot be undone.',
                icon: <Trash className="size-4 text-destructive" />,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                cancelButton: {
                    size: 'default',
                    variant: 'outline'
                },
                confirmButton: {
                    className: 'bg-red-500 hover:bg-red-600 text-white'
                },
                alertDialogTitle: {
                    className: 'flex items-center gap-2'
                }
            })
            if (response) {
                await dispatch(deleteInspectionType(type)).unwrap();
                dispatch(featchAllInspectionTypes());
                toast.success('Inspection type deleted successfully!')
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete the details')
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Inspection Types Management</h2>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setFormData(defaultFormData)}>
                                <Plus className="mr-2 h-4 w-4" /> Add New Type
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Create New Inspection Type</DialogTitle>
                                <DialogDescription>
                                    Add a new inspection type with details and features.
                                </DialogDescription>
                            </DialogHeader>
                            <Form  {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <ScrollArea className="h-full max-h-[calc(80vh-8rem)] rounded-md px-5">
                                        <div className="grid gap-4 py-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Inspection Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Inspection Name"
                                                                {...field}
                                                                className="w-full"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                        <FormDescription>
                                                            Please provide a valid inspection type name.
                                                        </FormDescription>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField

                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Inspection Price</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Inspection Price"
                                                                {...field}
                                                                className="w-full"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField

                                                control={form.control}
                                                name="platformFee"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Platform Fee</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Platform Fee"
                                                                {...field}
                                                                className="w-full"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <FormField

                                                control={form.control}
                                                name="duration"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Duration</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g. 45-60 mins"
                                                                {...field}
                                                                className="w-full"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                        <FormDescription>
                                                            Please provide a valid duration.
                                                        </FormDescription>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
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
                                                        <FormDescription>
                                                            Please provide at least one feature.
                                                        </FormDescription>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="isActive"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormLabel>Is Active</FormLabel>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormItem>
                                            )}
                                        />

                                    </ScrollArea>

                                    <DialogFooter>
                                        <Button disabled={loading}>Create Inspection Type</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit Inspection Type</DialogTitle>
                            <DialogDescription>
                                Modify the inspection type details and features.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleEditSubmit)}>
                                <ScrollArea className="h-full max-h-[calc(80vh-8rem)] rounded-md px-5">
                                    <div className="grid gap-4 py-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Inspection Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Inspection Name"
                                                            {...field}
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                    <FormDescription>
                                                        Please provide a valid inspection type name.
                                                    </FormDescription>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Inspection Price</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Inspection Price"
                                                            {...field}
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="platformFee"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Platform Fee</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Platform Fee"
                                                            {...field}
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="duration"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Duration</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g. 45-60 mins"
                                                            {...field}
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                    <FormDescription>
                                                        Please provide a valid duration.
                                                    </FormDescription>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
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
                                                    <FormDescription>
                                                        Please provide at least one feature.
                                                    </FormDescription>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormLabel>Is Active</FormLabel>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </ScrollArea>
                                <DialogFooter>
                                    <Button type="submit" disabled={loading}>Update Inspection Type</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
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