export type LoanStatus =
    | "Applied"
    | "Under Review"
    | "Approved"
    | "Disbursed"
    | "Rejected";

export type RiskCategory =
    | "Low"
    | "Medium"
    | "High";

export type LoanType =
    | "Personal Loan"
    | "Home Loan"
    | "Business Loan"
    | "Education Loan"
    | "Vehicle Loan";

export type Branch =
    | "Delhi"
    | "Noida"
    | "Gurgaon"
    | "Mumbai"
    | "Bangalore"
    | "Hyderabad"
    | "Pune";

export interface Loan {
    loanId: string;
    applicantName: string;
    loanAmount: number;
    loanType: LoanType;
    status: LoanStatus;
    riskScore: number;
    riskCategory: RiskCategory;
    appliedDate: string;
    lastUpdatedDate: string;
    approvedDate: string | null;
    disbursedDate: string | null;
    branch: Branch;
}


export interface StatsType {
    totalDisbursedAmount: number;
    activeApplications: number;
    averageRiskScore: number;
    rejectionRate: number;
    totalApproved: number;
    totalUnderReview: number;
}

export interface DateFilterType {
    type: "today" | "last7Days" | "thisMonth" | "custom" | "all";
    start: Date | null;
    end: Date | null;
}