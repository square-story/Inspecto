import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function UserProfile() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 border-r p-6">
                <h2 className="text-lg font-semibold mb-4">Profile Sections</h2>

            </div>

            {/* Main Content */}
            <ScrollArea className="flex-1 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        some
                    </CardContent>
                </Card>
            </ScrollArea>
        </div>
    );
}