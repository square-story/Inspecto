import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';

export const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [paymentDetails, setPaymentDetails] = useState<any>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const paymentIntentId = searchParams.get('payment_intent');
                if (!paymentIntentId) {
                    throw new Error('Payment ID not found');
                }

                const response = await axiosInstance.get(`/payments/verify/${paymentIntentId}`);
                setPaymentDetails(response.data.payment);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to verify payment');
                navigate('/payment/failure');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    if (loading) {
        return <div>Verifying payment...</div>;
    }

    return (
        <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <CardTitle>Payment Successful!</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                    <p className="text-lg font-medium">
                        Thank you for your booking
                    </p>
                    <p className="text-sm text-gray-600">
                        Booking Reference: {paymentDetails?.inspection?.bookingReference}
                    </p>
                    <p className="text-sm text-gray-600">
                        Amount Paid: ${paymentDetails?.amount}
                    </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                        An email confirmation has been sent to your registered email address.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                >
                    Go to Dashboard
                </Button>
                <Button
                    onClick={() => navigate('/bookings')}
                >
                    View Bookings
                </Button>
            </CardFooter>
        </Card>
    );
};