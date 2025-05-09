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
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/components/BackButton'
import GoogleButton from './GoogleButton'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthServices } from '@/services/auth.service'
import { useState } from 'react'
import { Loader } from 'lucide-react'


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

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setLoading(true)
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const response = await AuthServices.registerUser('user', formData)

            if (response) {
                localStorage.setItem('otp-email', data.email)
                toast.info('Please Check Your Mail For Verification')
                navigate('/user/verify-otp')
            }
        } catch (error) {
            setLoading(false)
            if (error instanceof AxiosError && error.response?.data?.message) {
                form.setError("email", {
                    type: "manual",
                    message: error.response.data.message,
                });
                toast.error(error.response.data.message)
            } else {
                console.error("Unexpected error:", error);
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[100vh] h-full w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <BackButton />
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
                                            <FormLabel htmlFor="firstName">First Name</FormLabel>
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

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader /> : "Register"}
                                </Button>
                                <Button variant='link' className="w-full">
                                    <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}>
                                        <GoogleButton />
                                    </GoogleOAuthProvider>
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
