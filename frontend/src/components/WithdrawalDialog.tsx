import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { WithdrawalService } from "@/services/withdrawal.service";
import { AxiosError } from "axios";

const withdrawalFormSchema = z.object({
    amount: z.number().min(1000, "Minimum withdrawal amount is ₹1000"),
    method: z.enum(["BANK_TRANSFER", "UPI"]),
    bankDetails: z.object({
        accountNumber: z.string().optional(),
        ifscCode: z.string().optional(),
        accountHolderName: z.string().optional(),
        bankName: z.string().optional(),
    }).optional(),
    upiId: z.string(),
})


type WithdrawalFormValues = z.infer<typeof withdrawalFormSchema>

interface WithdrawalDialogProps {
    availableBalance: number;
    onSuccess?: () => void;
}


export function WithdrawalDialog({ availableBalance, onSuccess }: WithdrawalDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<WithdrawalFormValues>({
        resolver: zodResolver(withdrawalFormSchema),
        defaultValues: {
            amount: 0,
            method: 'BANK_TRANSFER'
        }
    })

    const onSubmit = async (data: WithdrawalFormValues) => {
        if (data.amount > availableBalance) {
            toast.error("Insufficient balance")
            return;
        }

        setIsLoading(true)

        try {
            const paymentDetails = data.method === "BANK_TRANSFER"
                ? {
                    accountNumber: data.bankDetails?.accountNumber || "",
                    ifscCode: data.bankDetails?.ifscCode,
                    accountHolderName: data.bankDetails?.accountHolderName || "",
                    bankName: data.bankDetails?.bankName || ""
                }
                : { upiId: data.upiId || "" }

            await WithdrawalService.requestWithdrawal(
                data.amount,
                data.method as "BANK_TRANSFER" | "UPI",
                paymentDetails
            )

            toast.success("Withdrawal request submitted successfully")
            setOpen(false)
            onSuccess?.()
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false)
        }
    }

    const method = form.watch('method')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Request Withdrawal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request Withdrawal</DialogTitle>
                    <DialogDescription>
                        Available balance: ₹{availableBalance}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter Amount"
                                            {...field}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Withdrawal Method</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select Method' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="BANK_TRANSFER">
                                                Bank Transfer
                                            </SelectItem>
                                            <SelectItem value="UPI">UPI</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {method === "BANK_TRANSFER" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="bankDetails.accountNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bankDetails.accountHolderName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Holder Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bankDetails.bankName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bankDetails.ifscCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>IFSC Code</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {method === 'UPI' && (
                            <FormField
                                control={form.control}
                                name="upiId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>UPI ID</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing" : "Submit Request"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}