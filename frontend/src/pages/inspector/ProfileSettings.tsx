
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, DockIcon, LocateIcon, User } from "lucide-react";

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
        value: "Slots",
        icon: Clock,
    },
    {
        name: "Documents",
        value: "Documents",
        icon: DockIcon,
    },
];

const ProfileSettings = () => {
    return (
        <Tabs
            orientation="vertical"
            defaultValue={tabs[0].value}
            className="min-h-[524px] h-full w-full flex items-start gap-4 justify-center"
        >
            <TabsList className="shrink-0 grid grid-cols-1 min-w-28 p-0 bg-background">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="border-l-2 border-transparent justify-start rounded-none data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:bg-primary/5 py-1.5"
                    >
                        <tab.icon className="h-5 w-5 me-2" /> {tab.name}
                    </TabsTrigger>
                ))}
            </TabsList>

            <div className="h-full flex items-center justify-center max-w-full  w-full border rounded-md font-medium text-muted-foreground">
                {tabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value}>
                        {tab.name} Content
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    )
}

export default ProfileSettings