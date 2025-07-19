
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck } from "lucide-react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/columnHeader";
import LongText from "@/components/ui/LongText";
import { SignedAvatar } from "@/components/SignedAvatar";

export type Inspectors = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isListed: boolean;
    isCompleted: boolean;
    profile_image: string;
    certificates?: [string];
    yearOfExp?: number;
    phone?: string;
    signature?: string;
    specialization?: [string];
    start_time?: string;
    end_time?: string;
    avaliable_days?: number;
    status: string;
}

export const columns = ({
    setIsDrawerOpen,
    setSelectedInspector,
}: {
    setIsDrawerOpen: (open: boolean) => void;
    setSelectedInspector: (inspector: Inspectors | null) => void;
}): ColumnDef<Inspectors>[] => [
        {
            accessorKey: "profile_image",
            header: "Profile",
            cell: ({ row }) => {
                const profileImage = row.getValue("profile_image") as string;
                return (
                    <SignedAvatar
                        publicId={profileImage}
                        fallback={`${row.getValue("firstName") || ''} ${row.getValue("lastName") || ''}`}
                        className="h-8 w-8"
                    />
                );
            },
            enableHiding: false
        },
        {
            id: 'fullName',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title='Name' />
            ),
            cell: ({ row }) => {
                const { firstName, lastName } = row.original
                const fullName = `${firstName} ${lastName}`
                return <LongText className='max-w-36'>{fullName}</LongText>
            },
            filterFn: (row, _columnId, filterValue) => {
                const { firstName, lastName } = row.original
                const fullName = `${firstName} ${lastName}`.toLowerCase()
                return fullName.includes(filterValue.toLowerCase()) // Case-insensitive match
            },
            meta: { className: 'w-36' },
        },

        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
        },
        {
            accessorKey: "isListed",
            header: "Status",
            cell: ({ row }) => (
                row.original.isListed && row.original.status !== "BLOCKED" ? (
                    <CircleCheck color="green" />
                ) : (
                    <Button variant='destructive' onClick={() => {
                        const inspector = row.original;
                        setSelectedInspector(inspector);
                        setIsDrawerOpen(true);
                    }}>View Details</Button>
                )
            ),
            enableColumnFilter: true,
            filterFn: (row, columnId, filterValue) => {
                return filterValue.includes(row.getValue(columnId))
            },
        },
        {
            accessorKey: "phone",
            header: "Phone Number",
            cell: ({ row }) => (
                row.original.phone
            )
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const inspector = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(inspector._id)}
                            >
                                Copy Inspector ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedInspector(inspector);
                                    setIsDrawerOpen(true);
                                }}
                            >
                                View Inspector
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];