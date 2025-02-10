"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step1Schema, Step2Schema, Step3Schema, Step4Schema, Step5Schema, } from "./schemas";
import { Button } from "@/components/ui/button";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import { toast } from "sonner";

const MultiStepForm = () => {
    const [step, setStep] = useState(1);

    const methods = useForm({
        mode: "onChange",
        resolver: zodResolver(
            step === 1
                ? Step1Schema
                : step === 2
                    ? Step2Schema
                    : step === 3
                        ? Step3Schema
                        : step === 4
                            ? Step4Schema
                            : Step5Schema
        ),
    });

    const onSubmit = (data: unknown) => {
        toast.success(<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>)
        if (step < 5) {
            setStep(step + 1);
        } else {
            toast.success(<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">{JSON.stringify(methods.getValues(), null, 2)}</code>
            </pre>)
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                {step === 1 && <Step1 />}
                {step === 2 && <Step2 />}
                {step === 3 && <Step3 />}
                {step === 4 && <Step4 />}
                {step === 5 && <Step5 />}

                <div className="flex justify-between mt-4">
                    {step > 1 && (
                        <Button type="button" className="btn btn-outline" onClick={() => setStep(step - 1)}>
                            Back
                        </Button>
                    )}
                    <Button type="submit" className="btn">
                        {step === 5 ? "Pay Now" : "Next"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default MultiStepForm;
