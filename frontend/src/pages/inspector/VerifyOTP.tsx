import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { AppDispatch } from "@/store";
import { AuthServices } from '@/services/auth.service';

const formSchema = z.object({
    otp: z.string().min(6, "OTP must be 6 digits").max(6)
});

export default function InspectorOTPVerification({ role = "inspector" }) {
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(true);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: ""
        }
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const email = localStorage.getItem('otp-email') || '';
            const otp = values.otp;
            const response = await AuthServices.verifyOTP('inspector', { email, otp })

            if (response?.data?.message) {
                toast.success(response.data.message);
            } else {
                toast.success('Successfully created your account');
            }

            localStorage.removeItem('otp-email');
            const { accessToken } = response.data;
            dispatch(setCredentials({ accessToken, role: 'inspector', status: true }));
            navigate(`/${role}/dashboard`);
        } catch (error) {
            console.error("Form submission error", error);
            toast.error('Failed to verify OTP. Please try again.');
        }
    }

    const handleResendOTP = async () => {
        try {
            const email = localStorage.getItem('otp-email');
            if (!email) {
                toast.error('Email not found. Please try again.');
                return;
            }

            const response = await AuthServices.resentOTP('inspector', email)

            toast.success(response.data.message);
            setTimeLeft(60);
            setIsActive(true);
            form.reset();
        } catch (error) {
            console.error("Resend OTP error", error);
            toast.error('Failed to resend OTP. Please try again.');
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card className="w-full max-w-md mx-auto shadow-lg">
                    <CardContent className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-base font-semibold">Verification Code</FormLabel>
                                            <FormControl>
                                                <InputOTP
                                                    maxLength={6}
                                                    {...field}
                                                    className="gap-2"
                                                >
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
                                            <FormDescription>
                                                Please enter the verification code sent to your email
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-4">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                    >
                                        Verify OTP
                                    </Button>

                                    <div className="text-center space-y-2">
                                        <p className="text-sm text-gray-500">
                                            Didn't receive the code?
                                        </p>
                                        {timeLeft > 0 ? (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="w-full text-gray-500 cursor-not-allowed"
                                                disabled
                                            >
                                                Resend in {formatTime(timeLeft)}
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full"
                                                onClick={handleResendOTP}
                                            >
                                                Resend Code
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}