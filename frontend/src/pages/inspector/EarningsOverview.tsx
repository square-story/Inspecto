import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TransactionHistory from "@/components/inspector/transaction-history"
// import UpcomingEarnings from "@/components/inspector/upcoming-earnings"
import PaymentStats from "@/components/inspector/payment-stats"
import { useEffect, useState } from "react"
import { IWalletStats } from "@/types/inspector.wallet.stats"
import { useLoadingState } from "@/hooks/useLoadingState"
import LoadingSpinner from "@/components/LoadingSpinner"
import { WithdrawalDialog } from "@/components/WithdrawalDialog"
import { WalletService } from "@/services/wallet.service"

export default function PaymentsPage() {
    const [stats, setStats] = useState<IWalletStats>({
        totalEarnings: 0,
        totalTransactions: 0,
        totalPlatformFee: 0,
        pendingBalance: 0,
        availableBalance: 0,
        monthlyStats: [],
        recentTransactions: []
    });

    //for loading state
    const { loading, withLoading } = useLoadingState();

    const fetchStats = async () => {
        await withLoading(async () => {
            try {
                const response = await WalletService.getInspctorWalletStats();
                if (response) {
                    setStats(response);
                } else {
                    console.error("Received undefined stats");
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        });
    };

    useEffect(() => {
        fetchStats();
    }, [withLoading]);

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">

            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Payment Management</h1>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="p-4">
                        <h3 className="font-medium text-sm text-muted-foreground">Total Earnings</h3>
                        <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.totalEarnings}`}</p>
                    </Card>
                    <Card className="p-4">
                        <h3 className="font-medium text-sm text-muted-foreground">Platform Fees</h3>
                        <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.totalPlatformFee}`}</p>
                    </Card>
                    <Card className="p-4">
                        <h3 className="font-medium text-sm text-muted-foreground">Total Transactions</h3>
                        <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : stats.totalTransactions}</p>
                    </Card>
                    <Card className="p-4">
                        <h3 className="font-medium text-sm text-muted-foreground">Total Transactions</h3>
                        <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.availableBalance}`}</p>
                    </Card>
                    <Card className="p-4">
                        <h3 className="font-medium text-sm text-muted-foreground">Total Transactions</h3>
                        <p className="text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.pendingBalance}`}</p>
                    </Card>
                    <Card className="p-4 flex justify-start items-start">
                        <WithdrawalDialog
                            availableBalance={stats.availableBalance}
                            onSuccess={() => fetchStats()}
                        />
                    </Card>
                </div>
            </div>

            <Tabs defaultValue="transactions" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                    {/* <TabsTrigger value="upcoming">Upcoming Earnings</TabsTrigger> */}
                    <TabsTrigger value="stats">Payment Stats</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions" className="space-y-4">
                    <TransactionHistory recentTransactions={stats.recentTransactions} />
                </TabsContent>
                {/* <TabsContent value="upcoming" className="space-y-4">
                    <UpcomingEarnings />
                </TabsContent> */}
                <TabsContent value="stats" className="space-y-4">
                    <PaymentStats />
                </TabsContent>
            </Tabs>
        </div>
    )
}

