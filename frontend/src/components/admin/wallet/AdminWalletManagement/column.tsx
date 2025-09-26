"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, Check, MoreHorizontal, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WithdrawalStats } from "@/types/wallet.stats"
import { useConfirm } from "@omit/react-confirm-dialog"
import { toast } from "sonner"
import { WithdrawalService } from "@/services/withdrawal.service"
import { DeleteConfirmContent } from "@/features/admin/inspectors/InspectorManagment/components/DenyReason"

// Define the type for our data
export type WithdrawalRequest = {
    id: string
    user: string
    amount: number
    requestDate: string
    status: "pending" | "approved" | "rejected"
    method: 'UPI' | 'BANK_TRANSFER'
    accountDetails: string
}

export const withdrawalColumns: ColumnDef<WithdrawalStats, unknown>[] = [
    {
        accessorKey: "id",
        header: "Request ID",
        cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "user",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Inspector
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "requestDate",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Request Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <div>{format(new Date(row.getValue("requestDate")), "PPP")}</div>
        },
    },
    {
        accessorKey: "method",
        header: "Payment Method",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            return (
                <Badge
                    variant={status === "approved".toUpperCase() ? "default" : status === "rejected".toUpperCase() ? "destructive" : "outline"}
                    className={
                        status === "approved".toUpperCase() ? "bg-green-500" : status === "rejected".toUpperCase() ? "bg-red-500" : "bg-yellow-500 text-black"
                    }
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const withdrawal = row.original;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const confirm = useConfirm();

            const handleApprove = async () => {
                let successReason = "";
                const result = await confirm({
                    title: "Approve Withdrawal",
                    description: "Are you sure you want to approve this withdrawal request?",
                    icon: <Check className="size-4 text-green-600" />,
                    confirmButton: {
                        className: "bg-green-500 hover:bg-green-600 text-white",
                        onClick: async () => {
                            if (!successReason.trim()) {
                                toast.error("Please provide a denial reason");
                                return false;
                            }

                            try {
                                await WithdrawalService.processWithdrawal(withdrawal.id, 'approve', successReason)
                                return true
                            } catch (error) {
                                console.error("Denial error:", error);
                                return false;
                            }
                        }
                    },
                    alertDialogTitle: {
                        className: 'flex items-center gap-5'
                    },
                    contentSlot: <DeleteConfirmContent
                        onValueChange={(value: string) => {
                            successReason = value;
                        }}
                    />
                });

                if (result) {
                    try {
                        toast.success("Withdrawal approved successfully!");
                    } catch (error) {
                        console.error("Approval error:", error);
                        toast.error("Failed to approve withdrawal.");
                    }
                }
            };

            const handleReject = async () => {

                let rejectReason = "";
                const result = await confirm({
                    title: "Reject Withdrawal",
                    description: "Are you sure you want to reject this withdrawal request?",
                    icon: <X className="size-4 text-red-600" />,
                    confirmButton: {
                        className: "bg-red-500 hover:bg-red-600 text-white",
                        onClick: async () => {
                            if (!rejectReason.trim()) {
                                toast.error("Please provide a denial reason");
                                return false;
                            }

                            try {
                                await WithdrawalService.processWithdrawal(withdrawal.id, 'reject', rejectReason)
                                return true
                            } catch (error) {
                                console.error("Denial error:", error);
                                return false;
                            }
                        }
                    },
                    alertDialogTitle: {
                        className: 'flex items-center gap-5'
                    },
                    contentSlot: <DeleteConfirmContent
                        onValueChange={(value: string) => {
                            rejectReason = value;
                        }}
                    />
                });

                if (result) {
                    try {
                        toast.success("Withdrawal rejected successfully!");
                    } catch (error) {
                        console.error("Rejection error:", error);
                        toast.error("Failed to reject withdrawal.");
                    }
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(withdrawal.id)}>Copy ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        {withdrawal.status === "pending".toUpperCase() && (
                            <>
                                <DropdownMenuItem className="text-green-600" onClick={handleApprove}>
                                    <Check className="mr-2 h-4 w-4" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={handleReject}>
                                    <X className="mr-2 h-4 w-4" /> Reject
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]

