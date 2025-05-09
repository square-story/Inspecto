import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useState } from "react";
import { useLoadingState } from "@/hooks/useLoadingState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { WalletService } from "@/services/wallet.service";

interface IUserWalletStats {
  totalSpent: number;
  totalRefunds: number;
  walletBalance: number;
  pendingRefunds: number;
  recentTransactions: any[];
  monthlyStats: {
    month: string;
    spent: number;
    refunds: number;
    transactionCount: number;
  }[];
}

export default function UserWallet() {
  const [stats, setStats] = useState<IUserWalletStats>({
    totalSpent: 0,
    totalRefunds: 0,
    walletBalance: 0,
    pendingRefunds: 0,
    recentTransactions: [],
    monthlyStats: []
  });

  const { loading, withLoading } = useLoadingState();

  const fetchStats = useCallback(async () => {
    await withLoading(async () => {
      try {
        const response = await WalletService.getUserWalletStats();
        if (response) {
          setStats(response);
        } else {
          console.error("Received undefined stats");
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    });
  }, [withLoading]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4">
      <div className="flex flex-col gap-2 sm:gap-4">
      <h3 className="text-base sm:text-lg font-medium">Your Wallet</h3>

      <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Wallet Balance</h3>
                <p className="text-xl sm:text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.walletBalance}`}</p>
            </Card>
          <Card className="p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Total Spent</h3>
            <p className="text-xl sm:text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.totalSpent}`}</p>
          </Card>
          <Card className="p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Total Refunds</h3>
            <p className="text-xl sm:text-2xl font-bold">{loading ? <LoadingSpinner /> : `₹${stats.totalRefunds}`}</p>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="transactions" className="space-y-2 sm:space-y-4">
      <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="transactions" className="text-xs sm:text-sm px-3 sm:px-4">
                Transactions
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs sm:text-sm px-3 sm:px-4">
                Monthly Stats
            </TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
            <div className="rounded-md border overflow-x-auto">
                <table className="min-w-[600px] sm:min-w-full divide-y divide-secondary">
                    <thead>
                        <tr>
                            <th className="px-3 sm:px-6 py-2 text-xs">Date</th>
                            <th className="px-3 sm:px-6 py-2 text-xs">Type</th>
                            <th className="px-3 sm:px-6 py-2 text-xs">Amount</th>
                            <th className="hidden xs:table-cell px-3 sm:px-6 py-2 text-xs">Status</th>
                            <th className="hidden sm:table-cell px-3 sm:px-6 py-2 text-xs">Description</th>
                        </tr>
                    </thead>
              <tbody className=" divide-y divide-secondary">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : stats.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  stats.recentTransactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-3 sm:px-6 py-2 whitespace-nowrap text-xs sm:text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-2 whitespace-nowrap text-xs sm:text-sm">
                        {transaction.type}
                      </td>
                      <td className="px-3 sm:px-6 py-2 whitespace-nowrap text-xs sm:text-sm">
                        ₹{transaction.amount}
                      </td>
                      <td className="px-3 sm:px-6 py-2 whitespace-nowrap text-xs sm:text-sm">
                        {transaction.status}
                      </td>
                      <td className="px-3 sm:px-6 py-2 whitespace-nowrap text-xs sm:text-sm">
                        {transaction.description}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="stats" className="space-y-4">
          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-secondary">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Refunds</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Transactions</th>
                </tr>
              </thead>
              <tbody className=" divide-y divide-secondary">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : stats.monthlyStats.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      No monthly stats found
                    </td>
                  </tr>
                ) : (
                  stats.monthlyStats.map((stat, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {stat.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ₹{stat.spent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ₹{stat.refunds}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {stat.transactionCount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}