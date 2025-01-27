//contain our column definitions.

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

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
                    <Avatar className="rounded-full">
                        <AvatarImage className="object-cover h-7 w-7 rounded-full" src={profileImage} alt="Profile" />
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
        },
        {
            accessorKey: "isCompleted",
            header: "Details Status",
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