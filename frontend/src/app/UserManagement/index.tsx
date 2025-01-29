"use client";

import { useEffect, useState } from "react";
import { columns, IUsers } from "./columns";
import { AdminService } from "@/services/admin.service";
import { UserDataTable } from "./UserDataTable";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function UserManagmentTable() {
    const [data, setData] = useState<IUsers[]>([]);

    useEffect(() => {
        (async function featchData() {
            const response = await AdminService.getUsers()
            setData(response.data)
        })()
    }, [])


    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUsers | null>(null);

    return (
        <div className="container mx-auto py-10">
            <UserDataTable columns={columns({ setIsDrawerOpen, setSelectedUser })} data={data} />
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Inspector Details</DrawerTitle>
                        <DrawerDescription>
                            View all details of the selected inspector.
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
                                    <p><strong>Verification Status:</strong> {selectedUser.status ? "Verified" : "Not Verified"}</p>
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