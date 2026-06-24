import React from "react";
import { Loan } from "@/types/loans.types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

interface ApplicationsTableProps {
    data: Loan[];
}

const getStatusColor = (status: Loan["status"]) => {
    switch (status) {
        case "Applied": return "bg-slate-100 text-slate-700 border-slate-200";
        case "Under Review": return "bg-amber-100 text-amber-700 border-amber-200";
        case "Approved": return "bg-blue-100 text-blue-700 border-blue-200";
        case "Disbursed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case "Rejected": return "bg-red-100 text-red-700 border-red-200";
        default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
};

const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50";
    if (score >= 50) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
};

export const ApplicationsTable = React.memo(({ data }: ApplicationsTableProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="w-full bg-card rounded-2xl border border-border shadow-sm p-12 flex flex-col items-center justify-center">
                <p className="text-lg font-semibold text-primary">No applications found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters to see more results.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-card rounded-2xl border border-border shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-border">
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Applicant</th>
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Loan Details</th>
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date Applied</th>
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Score</th>
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.map((loan) => (
                        <tr key={loan.loanId} className="hover:bg-slate-50/50 transition-colors">
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-primary">{loan.applicantName}</span>
                                    <span className="text-xs text-muted-foreground mt-0.5">{loan.loanId}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-primary">
                                        ${loan.loanAmount.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-0.5">{loan.loanType}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-slate-600 font-medium">
                                    {format(new Date(loan.appliedDate), 'MMM dd, yyyy')}
                                </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", getRiskScoreColor(loan.riskScore))}>
                                    {loan.riskScore}
                                </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border", getStatusColor(loan.status))}>
                                    {loan.status}
                                </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-muted-foreground">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});
