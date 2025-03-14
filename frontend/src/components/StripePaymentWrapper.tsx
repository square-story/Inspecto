/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axiosInstance from '@/api/axios';

// Types
interface CheckoutFormProps {
    clientSecret: string;
    onSuccess: (paymentIntent: PaymentIntent) => void;
    onError: (message: string) => void;

}

interface StripePaymentWrapperProps {
    amount: number;
    inspectionId: string;
    onPaymentSuccess: (payment: PaymentResponse) => void;
    onPaymentError: (message: string) => void;
    isRetry?: boolean;
    paymentIntentId?: string;
}

interface PaymentResponse {
    id: string;
    amount: number;
    status: string;
    created: number;
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (error) {
                onError(error.message || 'An unknown error occurred');
            } else if (paymentIntent?.status === 'succeeded') {
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

const StripePaymentWrapper: React.FC<StripePaymentWrapperProps> = ({
    amount,
    inspectionId,
    onPaymentSuccess,
    onPaymentError,
    isRetry = false,
    paymentIntentId
}) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                const response = await axiosInstance.post<{ clientSecret: string }>('/payments/create-payment-intent', {
                    amount,
                    inspectionId,
                    isRetry,
                    paymentIntentId
                });
                setClientSecret(response.data.clientSecret);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
                setError(errorMessage);
                onPaymentError(errorMessage);
            }
        };

        initializePayment();
    }, [amount, inspectionId, onPaymentError, isRetry, paymentIntentId]);

    const handlePaymentSuccess = async (paymentIntent: PaymentIntent) => {
        try {
            const response = await axiosInstance.get<{ success: boolean; payment: PaymentResponse }>(
                `/payments/verify/${paymentIntent.id}`
            );

            if (response.data.success) {
                setSuccess(true);
                onPaymentSuccess(response.data.payment);
            } else {
                throw new Error('Payment verification failed');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
            onPaymentError(errorMessage);
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

    if (!clientSecret) {
        return null; // Or a loading state
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Complete Payment</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    );
};

export default StripePaymentWrapper;