/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step1Schema, Step2Schema, Step3Schema, Step4Schema, } from "./schemas";
import { Button } from "@/components/ui/button";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

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

    const onSubmit = async (data: unknown) => {
        toast.success(<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>)
        if (step < 4) {
            setStep(step + 1);
            return;
        } try {
            setLoading(true);

            // Send booking request to backend
            const response = await axiosInstance.post("/inspections/book", methods.getValues());

            if (response.status === 200) {
                toast.success("Inspection booked successfully!");
            }
            // Reset form after success
            methods.reset();
            setStep(1);
        } catch (error: any) {
            console.error("Error booking inspection:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                {step === 1 && <Step1 />}
                {step === 2 && <Step2 />}
                {step === 3 && <Step3 />}
                {step === 4 && <Step4 />}

                <div className="flex justify-between mt-4">
                    {step > 1 && (
                        <Button type="button" className="btn btn-outline" onClick={() => setStep(step - 1)}>
                            Back
                        </Button>
                    )}
                    <Button type="submit" className="btn">
                        {loading ? "Processing..." : step === 4 ? "Pay Now" : "Next"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default MultiStepForm;
