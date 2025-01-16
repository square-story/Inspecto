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
import BackButton from '@/components/BackButton'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/features/store'
import { loginUser } from '@/features/auth/authAPI'
import { setCredentials } from '@/features/auth/authSlice'
import { setUser } from '@/features/user/userSlice'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

// Improved schema with additional validation rules
const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
})


export default function LoginPreview() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const { setError } = form;
    const handleNav = useNavigate()

    const dispatch = useDispatch<AppDispatch>()

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const result = await dispatch(
                loginUser({
                    email: data.email,
                    password: data.password,
                    role: "user",
                })
            ).unwrap();


            if (result) {
                const { accessToken, role } = result
                dispatch(setCredentials({ accessToken, role: role as "user" | "admin" | "inspector" }))
                if (result.userDetails) {
                    dispatch(setUser(result.userDetails))
                }
                toast.success('Login successfully')
                handleNav("/");
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                // Handle field-specific errors
                if (error.response?.data?.field === 'email') {
                    setError('email', { type: 'manual', message: error.response?.data.message });
                } else if (error.response?.data?.field === 'password') {
                    setError('password', { type: 'manual', message: error.response?.data.message });
                } else {
                    // Handle general errors
                    setError('root', { type: 'manual', message: error.response?.data?.message || 'An error occurred' });
                }
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-[100vh] h-full w-full items-center justify-center px-4">

            <Card className="mx-auto max-w-sm">

                <CardHeader>
                    <BackButton />
                    <CardTitle className="text-2xl">User Login</CardTitle>
                    <CardDescription>
                        Enter your email and password to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel htmlFor="email">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    placeholder="johndoe@mail.com"
                                                    type="email"
                                                    autoComplete="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <div className="flex justify-between items-center">
                                                <FormLabel htmlFor="password">Password</FormLabel>
                                                <a
                                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer"
                                                    onClick={() => handleNav("/user/forget")}
                                                >
                                                    Forgot your password?
                                                </a>
                                            </div>
                                            <FormControl>
                                                <PasswordInput
                                                    id="password"
                                                    placeholder="******"
                                                    autoComplete="current-password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    Login
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
                                    Login with Google
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <a
                            className="underline underline-offset-4 cursor-pointer"
                            onClick={() => handleNav("/user/register")}
                        >
                            Sign up
                        </a>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Are You A Inspector?{" "}
                        <a
                            className="underline underline-offset-4 cursor-pointer"
                            onClick={() => handleNav("/inspector/login")}
                        >
                            Click Here
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

