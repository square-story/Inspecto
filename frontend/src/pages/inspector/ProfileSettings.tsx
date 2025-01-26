import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

export default function Component() {
    const inspector = useSelector((state: RootState) => state.inspector)
    return (
        <div className="w-full max-w-4xl mx-auto py-8 md:py-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Account Settings</h1>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={inspector.profile_image} className="object-cover" alt="User Avatar" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">Change</Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Name</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <div className="grid gap-1">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" type="text" defaultValue={inspector.firstName} />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" type="text" defaultValue={inspector.lastName} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Email</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue={inspector.email} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="email" defaultValue={inspector.phone} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <div className="grid gap-1">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" type="password" />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" type="password" />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" type="password" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8 flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
            </div>
        </div>
    )
}