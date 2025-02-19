import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TransactionHistory from "@/components/inspector/transaction-history"
import UpcomingEarnings from "@/components/inspector/upcoming-earnings"
import PaymentStats from "@/components/inspector/payment-stats"

export default function PaymentsPage() {
    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Payment Management</h1>
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="p-4">
                        <h3 className="font-medium text-sm text-muted-foreground">Total Earnings</h3>
                        <p className="text-2xl font-bold">₹45,231.89</p>
                    </Card>
                    <Card className="p-4">
                        <h3 className="font-medium text-sm text-muted-foreground">Platform Fees</h3>
                        <p className="text-2xl font-bold">₹4,523.19</p>
                    </Card>
                    <Card className="p-4">
                        <h3 className="font-medium text-sm text-muted-foreground">Pending Payments</h3>
                        <p className="text-2xl font-bold">₹12,450.00</p>
                    </Card>
                </div>
            </div>

            <Tabs defaultValue="transactions" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming Earnings</TabsTrigger>
                    <TabsTrigger value="stats">Payment Stats</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions" className="space-y-4">
                    <TransactionHistory />
                </TabsContent>
                <TabsContent value="upcoming" className="space-y-4">
                    <UpcomingEarnings />
                </TabsContent>
                <TabsContent value="stats" className="space-y-4">
                    <PaymentStats />
                </TabsContent>
            </Tabs>
        </div>
    )
}

