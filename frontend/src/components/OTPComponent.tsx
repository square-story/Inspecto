import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot
} from "@/components/ui/input-otp"
import axiosInstance from "@/api/axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/features/auth/authSlice"
import { AppDispatch } from "@/features/store"

const formSchema = z.object({
    otp: z.string()
});

export default function OTPComponent() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            const email = localStorage.getItem('otp-email');
            const otp = values.otp;
            const response = await axiosInstance.post('/user/verify-otp', { email, otp });

            if (response?.data?.message) {
                toast.success(response.data.message);
            } else {
                toast.success('Successfully created your account');
            }
            localStorage.removeItem('otp-email')
            const { accessToken } = response.data
            dispatch(setCredentials({ accessToken, role: 'user' }))
            navigate('/')
        } catch (error) {
            console.error("Form submission error", error);

            // Optional: Display an error toast
            toast.error('Failed to verify OTP. Please try again.');
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

                <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>One-Time Password</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription>Please enter the one-time password sent to your email.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}