import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step1Schema, Step2Schema, Step3Schema, Step4Schema } from "./schemas";
import { Button } from "@/components/ui/button";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";
import StripePaymentWrapper from "@/components/StripePaymentWrapper";
import { AxiosError } from "axios";

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [bookingData, setBookingData] = useState(null);


    const methods = useForm({
        mode: "onChange",
        resolver: zodResolver(
            step === 1
                ? Step1Schema
                : step === 2
                    ? Step2Schema
                    : step === 3
                        ? Step3Schema
                        : Step4Schema
        ),
    });

    const onSubmit = async () => {
        if (step < 4) {
            setStep(step + 1);
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post("/inspections/book", methods.getValues());

            if (response.status === 201) {
                setBookingData(response.data.data);
                setShowPayment(true);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error("Error booking inspection:", error);
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        toast.success("Inspection booked and payment completed successfully!");
        methods.reset();
        setStep(1);
        setShowPayment(false);
    };

    const handlePaymentError = (message: string) => {
        toast.error(message);
    };
    const values = methods.getValues()

    return (
        <FormProvider {...methods}>
            <div className="space-y-4 px-5">
                {!showPayment ? (
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        {step === 1 && <Step1 />}
                        {step === 2 && <Step2 />}
                        {step === 3 && <Step3 />}
                        {step === 4 && <Step4 />}

                        <div className="flex justify-between mt-4">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setStep(step - 1)}
                                >
                                    Back
                                </Button>
                            )}
                            <Button type="submit" variant="default">
                                {loading ? "Processing..." : step === 4 ? "Proceed to Payment" : "Next"}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <StripePaymentWrapper
                        amount={values.inspectionType === "basic" ? 250 : 300}
                        inspectionId={bookingData?._id}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={handlePaymentError}
                    />
                )}
            </div>
        </FormProvider>
    );
};

export default MultiStepForm;