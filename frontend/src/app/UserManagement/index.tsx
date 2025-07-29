import { useEffect, useState } from "react";
import { columns, IUsers } from "./columns";
import { AdminService } from "@/services/admin.service";
import { UserDataTable } from "./UserDataTable";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@omit/react-confirm-dialog";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function UserManagmentTable() {
    const [data, setData] = useState<IUsers[]>([]);
    const confirm = useConfirm();

    useEffect(() => {
        featchData()
    }, [])

    async function featchData() {
        const response = await AdminService.getUsers()
        setData(response.data)
    }

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUsers | null>(null);


    const handleBlockUser = async (userId: string, currentStatus: boolean) => {
        try {
            const result = await confirm({
                title: `${currentStatus ? "Block" : "Unblock"} User`,
                icon: <AlertTriangle className="size-4 text-yellow-500" />,
                description: `Are you sure you want to ${currentStatus ? "block" : "unblock"} this user? ${currentStatus
                    ? "They will not be able to access the system."
                    : "They will regain access to the system."
                    }`,
                confirmButton: {
                    className: `${currentStatus
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'} text-white`
                },
                cancelButton: {
                    className: 'bg-gray-200 hover:bg-gray-300'
                },
                alertDialogTitle: {
                    className: 'flex items-center gap-5'
                },
            });

            if (result) {
                const response = await AdminService.updateUserStatus(userId);
                if (response.data?.success) {
                    toast.success(response.data?.message);
                    setData(prev => prev.map(user =>
                        user._id === userId ? { ...user, status: !currentStatus } : user
                    ));
                } else {
                    toast.error(response.data?.message || "Failed to update user status");
                }
            }
        } catch (error) {
            console.error('Failed to update user status:', error);
            toast.error("An error occurred while updating user status");
        }
    };

    return (
        <div className="container mx-auto py-10">
            <UserDataTable columns={columns({ setIsDrawerOpen, setSelectedUser, onBlockUser: handleBlockUser })} data={data} />
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>User Details</DrawerTitle>
                        <DrawerDescription>
                            View all details of the selected User.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                        {selectedUser && (
                            <>
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={selectedUser.profile_image} alt="Profile" />
                                        <AvatarFallback>{selectedUser.firstName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{selectedUser.firstName}</p>
                                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <p><strong>ID:</strong> {selectedUser._id}</p>
                                    <p><strong>Verification Status:</strong> <span className={`${selectedUser.status ? "text-blue-900" : "text-red-900"} font-bold text-xl`}>{selectedUser.status ? "Verified" : "Blocked"}</span></p>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <p><strong>Address:</strong>{`${selectedUser.address ? `${selectedUser.address}` : "Not Updated"}`} </p>
                                    <p><strong>Method Of Registeration: </strong>{selectedUser.authProvider}</p>
                                </div>
                            </>
                        )}
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline" onClick={() => setSelectedUser(null)}>
                                Close
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}