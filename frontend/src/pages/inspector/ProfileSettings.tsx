import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, DockIcon, LocateIcon, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState } from "react"; // Adjust based on your Redux slice
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";

// Define the InspectorState interface
interface InspectorState {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    profile_image: string;
    certificates: string[];
    yearOfExp: number;
    phone: string;
    signature: string;
    specialization: string[];
    start_time: string;
    end_time: string;
    avaliable_days: number;
}

const tabs = [
    {
        name: "Profile",
        value: "profile",
        icon: User,
    },
    {
        name: "Location",
        value: "location",
        icon: LocateIcon,
    },
    {
        name: "Slots",
        value: "slots",
        icon: Clock,
    },
    {
        name: "Documents",
        value: "documents",
        icon: DockIcon,
    },
];

const ProfileSettings = () => {
    const inspectorDetails = useSelector((state: RootState) => state.inspector); // Fetch details from Redux store
    const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes
    const [localDetails, setLocalDetails] = useState<InspectorState>(inspectorDetails); // Local state for editing

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleArrayInputChange = (name: keyof InspectorState, index: number, value: string) => {
        setLocalDetails((prev) => ({
            ...prev,
            [name]: (prev[name] as string[]).map((item, i) => (i === index ? value : item)),
        }));
    };

    const handleAddArrayItem = (name: keyof InspectorState, value: string) => {
        setLocalDetails((prev) => ({
            ...prev,
            [name]: [...(prev[name] as string[]), value],
        }));
    };

    const handleRemoveArrayItem = (name: keyof InspectorState, index: number) => {
        setLocalDetails((prev) => ({
            ...prev,
            [name]: (prev[name] as string[]).filter((_, i) => i !== index),
        }));
    };

    const handleSave = () => {
        toast.success(JSON.stringify(localDetails))
        setIsEditing(false); // Exit edit mode
    };

    const handleEdit = () => {
        setIsEditing(true); // Enter edit mode
    };

    return (
        <Tabs
            orientation="vertical"
            defaultValue={tabs[0].value}
            className="min-h-[524px] h-full w-full flex flex-col md:flex-row items-start gap-4 justify-center"
        >
            {/* TabsList at the bottom on mobile, on the side on larger screens */}
            <TabsList className="shrink-0 grid grid-cols-4 md:grid-cols-1 w-full md:w-auto p-0 bg-background fixed bottom-0 left-0 right-0 md:static md:bottom-auto md:left-auto md:right-auto">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="border-l-2 border-transparent justify-center md:justify-start rounded-none data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:bg-primary/5 py-1.5"
                    >
                        <tab.icon className="h-5 w-5 me-2" />
                        <span className="hidden md:inline">{tab.name}</span>
                    </TabsTrigger>
                ))}
            </TabsList>

            {/* TabsContent */}
            <div className="h-full flex items-center justify-center max-w-full w-full border rounded-md font-medium text-muted-foreground p-4 mt-4 md:mt-0">
                {tabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value} className="w-full">
                        <div className="space-y-4">
                            {/* Edit Button */}
                            <div className="flex justify-end">
                                {isEditing ? (
                                    <Button onClick={handleSave}>Save</Button>
                                ) : (
                                    <Button onClick={handleEdit}>Edit</Button>
                                )}
                            </div>

                            {tab.value === "profile" && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Profile Image */}
                                        <div className="space-y-2">
                                            <Label>Profile Image</Label>
                                            {isEditing ? (
                                                <Input
                                                    name="profile_image"
                                                    value={localDetails.profile_image}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                <img
                                                    src={localDetails.profile_image}
                                                    alt="Profile"
                                                    className="w-24 h-24 rounded-full"
                                                />
                                            )}
                                        </div>
                                        {/* Signature Image */}
                                        <div className="space-y-2">
                                            <Label>Signature</Label>
                                            {isEditing ? (
                                                <Input
                                                    name="signature"
                                                    value={localDetails.signature}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                <img
                                                    src={localDetails.signature}
                                                    alt="Signature"
                                                    className="w-24 h-24"
                                                />
                                            )}
                                        </div>
                                        {/* Other Fields */}
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    value={localDetails.firstName}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                <p>{localDetails.firstName}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    value={localDetails.lastName}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                <p>{localDetails.lastName}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    value={localDetails.email}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                <p>{localDetails.email}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            {isEditing ? (
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={localDetails.phone}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                <p>{localDetails.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                            {tab.value === "location" && (
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    {isEditing ? (
                                        <Input
                                            id="address"
                                            name="address"
                                            value={localDetails.address}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p>{localDetails.address}</p>
                                    )}
                                </div>
                            )}
                            {tab.value === "slots" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">Start Time</Label>
                                        {isEditing ? (
                                            <Input
                                                id="start_time"
                                                name="start_time"
                                                type="time"
                                                value={localDetails.start_time}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <p>{localDetails.start_time}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">End Time</Label>
                                        {isEditing ? (
                                            <Input
                                                id="end_time"
                                                name="end_time"
                                                type="time"
                                                value={localDetails.end_time}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <p>{localDetails.end_time}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="avaliable_days">Available Days</Label>
                                        {isEditing ? (
                                            <Input
                                                id="avaliable_days"
                                                name="avaliable_days"
                                                type="number"
                                                value={localDetails.avaliable_days}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <p>{localDetails.avaliable_days}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {tab.value === "documents" && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Certificates</Label>
                                        {localDetails.certificates.map((certificate, index) => (
                                            <div key={index} className="flex gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <Input
                                                            value={certificate}
                                                            onChange={(e) =>
                                                                handleArrayInputChange("certificates", index, e.target.value)
                                                            }
                                                        />
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleRemoveArrayItem("certificates", index)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <p>{certificate}</p>
                                                )}
                                            </div>
                                        ))}
                                        {isEditing && (
                                            <Button onClick={() => handleAddArrayItem("certificates", "")}>
                                                Add Certificate
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Specialization</Label>
                                        {localDetails.specialization.map((specialization, index) => (
                                            <div key={index} className="flex gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <Input
                                                            value={specialization}
                                                            onChange={(e) =>
                                                                handleArrayInputChange("specialization", index, e.target.value)
                                                            }
                                                        />
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleRemoveArrayItem("specialization", index)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <p>{specialization}</p>
                                                )}
                                            </div>
                                        ))}
                                        {isEditing && (
                                            <Button onClick={() => handleAddArrayItem("specialization", "")}>
                                                Add Specialization
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    );
};

export default ProfileSettings;