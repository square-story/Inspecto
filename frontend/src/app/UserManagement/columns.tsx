import { DataTableColumnHeader } from "@/components/columnHeader";
import { SignedAvatar } from "@/components/SignedAvatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export type IUsers = {
    _id: string;
    firstName: string;
    email: string;
    status: boolean;
    profile_image: string;
    address?: string
    authProvider: string;
}

export const columns = ({
    setIsDrawerOpen,
    setSelectedUser,
    onBlockUser,
}: {
    setIsDrawerOpen: (open: boolean) => void;
    setSelectedUser: (user: IUsers | null) => void;
    onBlockUser: (userId: string, currentStatus: boolean) => Promise<void>;
}): ColumnDef<IUsers>[] => [
        {
            accessorKey: "profile_image",
            header: "Profile",
            cell: ({ row }) => {
                const profileImage = row.getValue("profile_image") as string;
                return (
                    <SignedAvatar
                        publicId={profileImage}
                        fallback={`${row.getValue("firstName") || ''}`}
                        className="h-8 w-8"
                    />
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
            cell: ({ row }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const [isLoading, setIsLoading] = useState(false);

                const handleBlockToggle = async () => {
                    try {
                        setIsLoading(true);
                        await onBlockUser(row.original._id, row.original.status);
                    } catch (error) {
                        console.error('Error toggling user block status:', error);
                    } finally {
                        setIsLoading(false);
                    }
                };

                return (
                    <Button
                        variant={row.original.status ? 'destructive' : 'default'}
                        onClick={handleBlockToggle}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : row.original.status ? 'Block' : 'Unblock'}
                    </Button>
                );
            }
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