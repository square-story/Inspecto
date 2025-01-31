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
import { useNavigate } from 'react-router-dom'
import { loginUser } from '@/features/auth/authAPI'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/features/auth/authSlice'
import { AppDispatch } from '@/store'
import { AxiosError } from 'axios'

// Improved schema with additional validation rules
const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .regex(/[a-zA-Z0-9]/, { message: 'Password must be Alphanumeric' }),
})

export default function LoginPreview() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const result = await dispatch(
                loginUser({
                    email: values.email,
                    password: values.password,
                    role: "admin",
                })
            ).unwrap();

            if (result) {
                const { accessToken, role } = result
                dispatch(setCredentials({ accessToken, role: role as "user" | "admin" | "inspector", status: true }))
                toast.success('Login successfully')
                navigate("/admin/dashboard");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                // Handle field-specific errors
                if (error.response?.data?.field === 'email') {
                    form.setError('email', { type: 'manual', message: error.response?.data.message });
                } else if (error.response?.data?.field === 'password') {
                    form.setError('password', { type: 'manual', message: error.response?.data.message });
                } else {
                    // Handle general errors
                    form.setError('root', { type: 'manual', message: error.response?.data?.message || 'An error occurred' });
                }
            } else {
                console.error('Unexpected error:', error);
            }
        }
    }

    return (
        <div className="flex flex-col min-h-[100vh] h-full w-full items-center justify-center px-4">

            <Card className="mx-auto max-w-sm">

                <CardHeader>
                    <BackButton />
                    <CardTitle className="text-2xl">Admin Login</CardTitle>
                    <CardDescription>
                        Enter email and password to login to your admin account.
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
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
