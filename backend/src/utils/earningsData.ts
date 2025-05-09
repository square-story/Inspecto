import { format } from "date-fns";
import { IWalletTransaction, TransactionType } from "../models/wallet.model";

export const earningData = (fullWalletTransactions: IWalletTransaction[]) => {
    return fullWalletTransactions.reduce((acc, transaction) => {
        const month = format(new Date(transaction.date), 'MMM');
        const existing = acc.find(item => item.name === month);
        const amount = transaction.amount;

        if (existing) {
            existing.total += amount;
            if (transaction.type === "PLATFORM_FEE") {
                existing.platformFee += amount;
            } else {
                existing.inspectorFee += amount;
            }
        } else {
            acc.push({
                name: month,
                platformFee: transaction.type === "PLATFORM_FEE" ? amount : 0,
                inspectorFee: transaction.type !== "PLATFORM_FEE" && transaction.type !== TransactionType.REFUND ? amount : 0,
                total: amount
            });
        }
        return acc;
    }, [] as { name: string; platformFee: number; inspectorFee: number; total: number }[]);
};