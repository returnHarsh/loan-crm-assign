import { useMemo, useState } from "react"
import loans from "../../../data/loans.json"
import { DateFilterType, Loan, LoanStatus, RiskCategory, StatsType } from "@/types/loans.types";

export interface BranchInsight {
    branch: string;
    totalLoanAmount: number;
    loanCount: number;
    averageRiskScore: number;
    disbursedAmount: number;
    status: Record<LoanStatus, number>;
    riskCategory: Record<RiskCategory, number>;
    topStatus: LoanStatus;
    approvalRate: number;
    rejectionRate: number;
}

const STATUSES: LoanStatus[] = ["Applied", "Under Review", "Approved", "Disbursed", "Rejected"];
const RISK_CATEGORIES: RiskCategory[] = ["Low", "Medium", "High"];

const createEmptyBranch = (branch: string) => ({
    branch,
    totalLoanAmount: 0,
    loanCount: 0,
    totalRiskScore: 0,
    disbursedAmount: 0,
    status: Object.fromEntries(STATUSES.map(s => [s, 0])) as Record<LoanStatus, number>,
    riskCategory: Object.fromEntries(RISK_CATEGORIES.map(r => [r, 0])) as Record<RiskCategory, number>,
});

const computeStats = (filteredLoans: Loan[]): StatsType => {
    let totalDisbursedAmount = 0;
    let activeApplications = 0;
    let totalApproved = 0;
    let totalUnderReview = 0;
    let totalRiskScore = 0;
    let rejectedLoans = 0;

    const totalCount = filteredLoans.length;

    filteredLoans.forEach((loan: Loan) => {
        // 1. Calculate status-based aggregates
        if (loan.status === "Disbursed") {
            totalDisbursedAmount += loan.loanAmount;
        } else if (loan.status === "Approved") {
            totalApproved += 1;
        } else if (loan.status === "Under Review") {
            totalUnderReview += 1;
        } else if (loan.status === "Rejected") {
            rejectedLoans += 1;
        }

        // Active applications logic (status other than Disbursed, Rejected, or Approved)
        if (loan.status !== "Disbursed" && loan.status !== "Rejected" && loan.status !== "Approved") {
            activeApplications += 1;
        }

        // 2. Accumulating risk scores for averaging
        totalRiskScore += loan.riskScore;
    });

    return {
        totalDisbursedAmount,
        activeApplications,
        totalApproved,
        totalUnderReview,
        averageRiskScore: totalCount > 0
            ? Number(((totalRiskScore / totalCount) * 100).toFixed(2))
            : 0,
        rejectionRate: totalCount > 0
            ? Number(((rejectedLoans / totalCount) * 100).toFixed(2))
            : 0
    };
};

export const useDashboard = () => {
    const [loansData] = useState<Loan[]>((loans as Loan[]) || []);
    const [filter, setFilter] = useState<DateFilterType>({
        type: "all",
        start: null,
        end: null
    });

    // 1. Derived state for filtered data
    const filteredData = useMemo(() => {
        if (filter.type === "all") return loansData;
        if (!filter.start || !filter.end) return loansData;

        const startDate = filter.start;
        const endDate = filter.end;

        return loansData.filter((loan: Loan) => {
            const appliedDate = new Date(loan.appliedDate);
            return appliedDate >= startDate && appliedDate <= endDate;
        });
    }, [filter, loansData]);

    // 2. Branch-level insights — aggregated per branch, sorted by total volume
    const insights: BranchInsight[] = useMemo(() => {
        const map: Record<string, ReturnType<typeof createEmptyBranch>> = {};

        filteredData.forEach((loan: Loan) => {
            const key = loan.branch;
            if (!map[key]) {
                map[key] = createEmptyBranch(key);
            }
            const entry = map[key];
            entry.totalLoanAmount += loan.loanAmount;
            entry.loanCount += 1;
            entry.totalRiskScore += loan.riskScore;
            entry.status[loan.status] += 1;
            entry.riskCategory[loan.riskCategory] += 1;

            if (loan.status === "Disbursed") {
                entry.disbursedAmount += loan.loanAmount;
            }
        });

        console.log("map is : ", map)

        return Object.values(map)
            .map((entry): BranchInsight => {
                const topStatus = (Object.entries(entry.status) as [LoanStatus, number][])
                    .sort((a, b) => b[1] - a[1])[0][0];
                const decided = entry.status["Approved"] + entry.status["Disbursed"] + entry.status["Rejected"];

                return {
                    branch: entry.branch,
                    totalLoanAmount: entry.totalLoanAmount,
                    loanCount: entry.loanCount,
                    averageRiskScore: entry.loanCount > 0
                        ? Number((entry.totalRiskScore / entry.loanCount).toFixed(1))
                        : 0,
                    disbursedAmount: entry.disbursedAmount,
                    status: entry.status,
                    riskCategory: entry.riskCategory,
                    topStatus,
                    approvalRate: decided > 0
                        ? Number((((entry.status["Approved"] + entry.status["Disbursed"]) / decided) * 100).toFixed(1))
                        : 0,
                    rejectionRate: decided > 0
                        ? Number(((entry.status["Rejected"] / decided) * 100).toFixed(1))
                        : 0,
                };
            })
            .sort((a, b) => b.totalLoanAmount - a.totalLoanAmount);
    }, [filteredData]);

    const stats = useMemo(() => {
        return computeStats(filteredData);
    }, [filteredData]);

    return {
        filter,
        setFilter,
        filteredData,
        stats,
        insights,
    };
};