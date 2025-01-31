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
import BackButton from '@/components/BackButton'
import { useParams } from 'react-router-dom'
import { AxiosError } from 'axios'
import { AuthServices } from '@/services/auth.service'

// Schema for email validation
const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
})

export default function ForgetPasswordPreview() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    })

    const params = useParams()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { role } = params
            const response = await AuthServices.forgetPassword(role as 'inspector' | 'user', { email: values.email, role: role as 'inpector' | 'user' })
            if (response) {
                toast.success(response.message)
            }
        } catch (error) {
            console.error('Error sending password reset email', error)
            if (error instanceof AxiosError) {
                form.setError('email', { message: error.response?.data?.message })
                toast.error(error.response?.data?.message)
            }
        }
    }

    return (
        <div className="flex min-h-[100vh] h-full w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <BackButton />
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email address to receive a password reset link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-4">
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
                                <Button type="submit" className="w-full">
                                    Send Reset Link
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
