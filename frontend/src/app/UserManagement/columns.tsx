import { DataTableColumnHeader } from "@/components/columnHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export type IUsers = {
    _id: string;
    firstName: string;
    email: string;
    status: boolean;
    profile_image: string;
}

export const columns = ({
    setIsDrawerOpen,
    setSelectedUser,
}: {
    setIsDrawerOpen: (open: boolean) => void;
    setSelectedUser: (user: IUsers | null) => void;
}): ColumnDef<IUsers>[] => [
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
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="First Name" />
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                row.original.status ? (
                    <Button variant='destructive'>Block</Button>
                ) : (
                    <Button variant='default'>Un Block</Button>
                )
            )
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original;

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
                                onClick={() => navigator.clipboard.writeText(user._id)}
                            >
                                Copy Inspector ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedUser(user);
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
    ]