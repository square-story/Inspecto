export interface IAdminDashboardStats {
    totalUsers: number;
    totalInspectors: number;
    totalInspections: number;
    totalEarnings: number;
    earningData: {
        name: string;
        platformFee: number;
        inspectorFee: number;
        total: number;
    }[];
}