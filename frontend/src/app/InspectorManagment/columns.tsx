//contain our column definitions.

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CircleCheck, X } from "lucide-react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type Inspectors = {
    _id: string;
    firstName: string;
    email: string;
    isListed: boolean;
    isCompleted: boolean;
    profile_image: string;
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
                    <Avatar>
                        <AvatarImage src={profileImage} alt="Profile" />
                        <AvatarFallback className="rounded-full">SN</AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            accessorKey: "firstName",
            header: "FirstName",
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "isListed",
            header: "Verification Status",
            cell: ({ row }) => (
                row.original.isListed ? (
                    <CircleCheck color="green" />
                ) : (
                    <Button variant='destructive'>View Details</Button>
                )
            )
        },
        {
            accessorKey: "isCompleted",
            header: "Status",
            cell: ({ row }) => (
                row.original.isCompleted ? (
                    <CircleCheck color="green" />
                ) : (
                    <X color="red" />
                )
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
                            <DropdownMenuItem>View payment details</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];