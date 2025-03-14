export interface IInspectionStats {
    totalInspections: number;
    pendingInspections: number;
    totalEarnings: number;
    thisMonthEarnings: number;
    completionRate: number;
}

export interface IInspectionStatsFromInspectionDB {
    completedInspections: number
    totalInspections: number;
    pendingInspections: number;
}

export interface IInspectionStatesFromPaymentDB {
    totalEarnings: number;
    thisMonthEarnings: number;
}

