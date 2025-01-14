"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/BackButton";

// Validation schema using zod
const formSchema = z
    .object({
        email: z.string().email("Must be a valid email format"),
        password: z
            .string()
            .regex(
                /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                "Password should contain at least one number and one special character"
            )
            .min(6, "Password must be at least 6 characters long"),
        confirmPass: z.string(),
        firstName: z.string().min(3, "First name must be at least 3 characters"),
        lastName: z.string().min(3, "Last name must be at least 3 characters"),
    })
    .refine((data) => data.password === data.confirmPass, {
        message: "Passwords must match",
        path: ["confirmPass"], // Attach error to the confirmPass field
    });

export function SignUp() {
    // Initialize the form using react-hook-form with zod
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPass: "",
            firstName: "",
            lastName: "",
        },
    });

    // Handle form submission
    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("Form submitted successfully:", data);
    }

    return (
        <div className="p-4">

            <Form {...form}>
                <BackButton />
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col p-4 mx-auto max-w-3xl border rounded-md gap-4"
                >
                    <h1 className="text-3xl font-bold">User Creation</h1>
                    <p className="text-base">Sign up to create an account</p>

                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter your email"
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password and Confirm Password Fields */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter your password"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPass"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Re-enter your password"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* First Name Field */}
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="e.g., John"
                                        type="text"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Last Name Field */}
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="e.g., Wick"
                                        type="text"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit and Google Sign-in Buttons */}
                    <div className="flex flex-col items-center w-full gap-4">
                        <Button
                            className="rounded-lg w-full"
                            size="sm"
                            type="submit"
                        >
                            Submit
                        </Button>
                        <Button
                            variant="outline"
                            className="flex items-center justify-center w-full"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="h-5 w-5 mr-2"
                            >
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.15 0 5.7 1.05 7.8 3.15l5.85-5.85C33.9 3.6 29.4 1.5 24 1.5 14.7 1.5 7.2 7.95 4.35 16.2l6.75 5.25C12.9 14.1 17.85 9.5 24 9.5z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M46.5 24c0-1.5-.15-3-.45-4.5H24v9h12.75c-.6 3-2.4 5.4-4.95 7.05l6.75 5.25C42.75 37.5 46.5 31.2 46.5 24z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M11.1 28.2c-1.05-3-1.05-6.3 0-9.3l-6.75-5.25c-3 6-3 13.8 0 19.8l6.75-5.25z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M24 46.5c5.4 0 10.2-1.8 13.8-4.95l-6.75-5.25c-2.1 1.35-4.8 2.1-7.05 2.1-6.15 0-11.1-4.65-12.75-10.65l-6.75 5.25C7.2 40.05 14.7 46.5 24 46.5z"
                                />
                            </svg>
                            Sign in with Google
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
