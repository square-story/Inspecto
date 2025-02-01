import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { inspectorService } from "@/services/inspector.service";
import { userService } from "@/services/user.service";
import { RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

const passwordFormSchema = z.object({
    currentPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
    newPassword: z.string().regex(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/, {
        message: "Password must be at least 6 characters long and contain both letters and numbers.",
    }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
});

export default function PasswordManagement() {
    const role = useSelector((state: RootState) => state.auth.role);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof passwordFormSchema>>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: z.infer<typeof passwordFormSchema>) {
        try {
            setIsLoading(true);

            let response;
            if (role === "user") {
                response = await userService.changePassword(data);
            } else if (role === "inspector") {
                response = await inspectorService.changePassword(data);
            } else {
                throw new Error("Invalid role");
            }

            toast.success(response.data.message || "Password changed successfully!");
            form.reset();
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    // Backend error with a message
                    toast.error(error.response.data.message || "Failed to change password.");
                    form.setError("currentPassword", {
                        type: "manual",
                        message: error.response.data.message,
                    });
                } else if (error.message) {
                    // Generic error (e.g., network error)
                    toast.error(error.message);
                }
            } else {
                // Fallback error message
                toast.error("An unexpected error occurred. Please try again.");
            }
            console.error("Error in onSubmit:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDialogClose = () => {
        form.reset(); // Reset the form when the dialog is closed
    };

    return (
        <Dialog onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
            <DialogTrigger asChild>
                <Button variant="outline">Change Password</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Enter your new password to reset your password.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                id="currentPassword"
                                                placeholder="******"
                                                autoComplete="current-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="newPassword">New Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                id="newPassword"
                                                placeholder="******"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                id="confirmPassword"
                                                placeholder="******"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Save changes"}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}