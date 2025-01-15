import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import axiosInstance from '@/api/axios'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'


// Define validation schema using Zod
const formSchema = z
    .object({
        firstName: z
            .string()
            .min(2, { message: 'Name must be at least 2 characters long' }),
        lastName: z
            .string()
            .min(2, { message: 'Name must be at least 2 characters long' }),
        email: z.string().email({ message: 'Invalid email address' }),
        password: z
            .string()
            .min(6, { message: 'Password must be at least 6 characters long' })
            .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    })

export default function RegisterPreview() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const navigate = useNavigate()

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            const response = await axiosInstance.post('/user/register', data)

            if (response) {
                localStorage.setItem('otp-email', data.email)
                toast.info('Please Check Your Mail For Verification')
                navigate('/user/verify-otp')
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.message) {
                form.setError("email", {
                    type: "manual",
                    message: error.response.data.message,
                });
                toast.error(error.response.data.message)
            } else {
                console.error("Unexpected error:", error);
            }
        }
    }

    return (
        <div className="flex min-h-[100vh] h-full w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Create a new account by filling out the form below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-4">
                                {/* Name Field */}
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel htmlFor="firstName">Full Name</FormLabel>
                                            <FormControl>
                                                <Input id="firstName" placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel htmlFor="lastName">Last Name</FormLabel>
                                            <FormControl>
                                                <Input id="lastName" placeholder="Snow" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel htmlFor="email">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    placeholder="johnsnow@gmail.com"
                                                    type="email"
                                                    autoComplete="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel htmlFor="password">Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    id="password"
                                                    placeholder="******"
                                                    autoComplete="new-password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm Password Field */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel htmlFor="confirmPassword">
                                                Confirm Password
                                            </FormLabel>
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

                                <Button type="submit" className="w-full">
                                    Register
                                </Button>
                                <Button variant="outline" className="w-full">
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
                                    Register With Google
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <a onClick={() => navigate('/user/login')} className="underline cursor-pointer">
                            Login
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
