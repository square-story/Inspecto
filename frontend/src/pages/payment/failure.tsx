
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export const PaymentFailure = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    return (
        <Card className="max-w-md mx-auto mt-10">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <CardTitle>Payment Failed</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                    <p className="text-lg font-medium">
                        We couldn't process your payment
                    </p>
                    <p className="text-sm text-gray-600">
                        {searchParams.get('message') || 'An error occurred during payment processing.'}
                    </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-800">
                        Your booking is on hold. Please try again or contact support if the issue persists.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                >
                    Try Again
                </Button>
                <Button
                    onClick={() => window.location.href = '/support'}
                >
                    Contact Support
                </Button>
            </CardFooter>
        </Card>
    );
};