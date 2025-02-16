import React, { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axiosInstance from '@/api/axios';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (error) {
                onError(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent);
            }
        } catch (err) {
            onError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            <Button
                type="submit"
                disabled={!stripe || loading}
                className="w-full"
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </Button>
        </form>
    );
};

const StripePaymentWrapper = ({ amount, inspectionId, onPaymentSuccess, onPaymentError }) => {
    const [clientSecret, setClientSecret] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    React.useEffect(() => {
        const initializePayment = async () => {
            try {
                const response = await axiosInstance.post('/payments/create-payment-intent', {
                    amount,
                    inspectionId
                });
                setClientSecret(response.data.clientSecret);
            } catch (err) {
                setError('Failed to initialize payment');
            }
        };

        initializePayment();
    }, [amount, inspectionId]);

    const handlePaymentSuccess = async (paymentIntent) => {
        try {
            const response = await axiosInstance.get(`/payments/verify/${paymentIntent.id}`);
            console.log("the response when check the status", response)
            if (response.data.success) {
                setSuccess(true);
                onPaymentSuccess(response.data.payment);
            }
        } catch (err) {
            onPaymentError('Payment verification failed');
        }
    };

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (success) {
        return (
            <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Payment completed successfully!</AlertDescription>
            </Alert>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Complete Payment</CardTitle>
            </CardHeader>
            <CardContent>
                {clientSecret && (
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: {
                                theme: 'stripe',
                            },
                        }}
                    >
                        <CheckoutForm
                            clientSecret={clientSecret}
                            onSuccess={handlePaymentSuccess}
                            onError={(msg) => {
                                setError(msg);
                                onPaymentError(msg);
                            }}
                        />
                    </Elements>
                )}
            </CardContent>
        </Card>
    );
};

export default StripePaymentWrapper;