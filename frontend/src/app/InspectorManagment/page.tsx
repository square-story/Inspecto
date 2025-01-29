// app/InspectorManagement/DemoPage.tsx
"use client";

import { useEffect, useState } from "react";
import { InspectorDataTable } from "./components/InspectorDataTable";
import { Inspectors, columns } from "./columns";
import { AdminService } from "@/services/admin.service";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
    const [data, setData] = useState<Inspectors[]>([]);

    useEffect(() => {
        async function fetchData() {
            const response = await AdminService.getInspectors();
            setData(response.data)
        }
        fetchData();
    }, []);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedInspector, setSelectedInspector] = useState<Inspectors | null>(null);

    return (
        <div className="container mx-auto py-10">
            <InspectorDataTable columns={columns({ setIsDrawerOpen, setSelectedInspector })} data={data} />
            {/* Drawer for Inspector Details */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Inspector Details</DrawerTitle>
                        <DrawerDescription>
                            View all details of the selected inspector.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4">
                        {selectedInspector && (
                            <>
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={selectedInspector.profile_image} alt="Profile" />
                                        <AvatarFallback>{selectedInspector.firstName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{selectedInspector.firstName}</p>
                                        <p className="text-sm text-gray-500">{selectedInspector.email}</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <p><strong>ID:</strong> {selectedInspector._id}</p>
                                    <p><strong>Verification Status:</strong> {selectedInspector.isListed ? "Verified" : "Not Verified"}</p>
                                    <p><strong>Details Status:</strong> {selectedInspector.isCompleted ? "Complete" : "Incomplete"}</p>
                                </div>
                            </>
                        )}
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline" onClick={() => setSelectedInspector(null)}>
                                Close
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

