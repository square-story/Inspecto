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
import GoogleButton from './GoogleButton'
import { GoogleOAuthProvider } from '@react-oauth/google'

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
                    dispatch(setUser({
                        ...result.userDetails,
                        profile_image: result.userDetails.profile_image || ''
                    }))
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
                                <Button variant='link' className="w-full">
                                    <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}>
                                        <GoogleButton />
                                    </GoogleOAuthProvider>
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

