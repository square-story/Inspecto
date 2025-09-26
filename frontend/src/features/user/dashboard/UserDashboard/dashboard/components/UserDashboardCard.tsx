import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardCard = ({ title, value, description }: { title: string; value: string; description: string }) => {
    return (
        <Card className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
};