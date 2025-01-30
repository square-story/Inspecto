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
                            <div className="p-4">
                                {/* Profile Section */}
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-20 w-20 border border-gray-300">
                                        <AvatarImage src={selectedInspector.profile_image} alt="Profile" />
                                        <AvatarFallback className="text-lg font-semibold">
                                            {selectedInspector.firstName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-lg font-medium">
                                            {selectedInspector.firstName} {selectedInspector.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">{selectedInspector.email}</p>
                                        <p className="text-sm text-gray-500">{selectedInspector.phone || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Inspector Details */}
                                <div className="mt-4 space-y-2">
                                    <p><strong>ID:</strong> {selectedInspector._id}</p>
                                    <p><strong>Verification Status:</strong>
                                        <span className={`ml-2 px-2 py-1 rounded-md text-white text-xs 
                    ${selectedInspector.isListed ? "bg-green-500" : "bg-red-500"}`}>
                                            {selectedInspector.isListed ? "Verified" : "Not Verified"}
                                        </span>
                                    </p>
                                    <p><strong>Details Status:</strong>
                                        <span className={`ml-2 px-2 py-1 rounded-md text-white text-xs 
                    ${selectedInspector.isCompleted ? "bg-green-500" : "bg-red-500"}`}>
                                            {selectedInspector.isCompleted ? "Complete" : "Incomplete"}
                                        </span>
                                    </p>
                                    <p><strong>Years of Experience:</strong> {selectedInspector.yearOfExp || "N/A"}</p>
                                    <p><strong>Specialization:</strong>
                                        {selectedInspector.specialization && selectedInspector.specialization.length > 0 ? (
                                            <span className="ml-2">{selectedInspector.specialization.join(", ")}</span>
                                        ) : (
                                            " N/A"
                                        )}
                                    </p>
                                    <p><strong>Available Time:</strong>
                                        {selectedInspector.start_time && selectedInspector.end_time ? (
                                            <span className="ml-2">{selectedInspector.start_time} - {selectedInspector.end_time}</span>
                                        ) : (
                                            " N/A"
                                        )}
                                    </p>
                                    <p><strong>Available Days per Week:</strong> {selectedInspector.avaliable_days || "N/A"}</p>

                                    {/* Certificates Section with "View Document" Icon */}
                                    {selectedInspector.certificates && selectedInspector.certificates.length > 0 && (
                                        <div>
                                            <strong>Certificates:</strong>
                                            <ul className="flex flex-wrap mt-1 space-x-2">
                                                {selectedInspector.certificates.map((certificate, index) => (
                                                    <li key={index}>
                                                        <a
                                                            href={certificate}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 hover:underline flex items-center space-x-1"
                                                        >
                                                            <span>View Document</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>


                                {/* Approve & Deny Buttons */}
                                <div className="mt-6 flex justify-end space-x-3">
                                    <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white text-lg px-6 py-3">
                                        Deny
                                    </Button>
                                    <Button variant="default" className="bg-green-500 hover:bg-green-600 text-lg px-6 py-3">
                                        Approve
                                    </Button>
                                </div>
                            </div>
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

