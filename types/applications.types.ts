import { LoanStatus, RiskCategory } from "./loans.types";

export interface ApplicationFilters {
    status: LoanStatus | null,
    riskCategory: RiskCategory | null
}

export type SortingFilterType = "date" | "loanAmount" | "riskScore" | null
export type SortDateType = "appliedDate" | "lastUpdatedDate" | "approvedDate" | "disbursedDate" | null