import React, { useRef } from "react";
import { Loan } from "@/types/loans.types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

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

export const ApplicationsVirtualizedTable = React.memo(({ data }: ApplicationsTableProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 76, // Estimated height of each row in pixels
        overscan: 10,
    });

    if (!data || data.length === 0) {
        return (
            <div className="w-full bg-card rounded-2xl border border-border shadow-sm p-12 flex flex-col items-center justify-center">
                <p className="text-lg font-semibold text-primary">No applications found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters to see more results.</p>
            </div>
        );
    }

    return (
        <div
            ref={parentRef}
            className="w-full bg-card rounded-2xl border border-border shadow-sm overflow-auto"
            style={{ maxHeight: '600px' }}
        >
            <div className="w-full text-left min-w-[800px]">
                {/* Table Header */}
                <div className="sticky top-0 z-10 bg-slate-50 border-b border-border grid grid-cols-6 gap-4 px-6 py-4 shadow-sm">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Applicant</div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Loan Details</div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date Applied</div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Score</div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</div>
                </div>

                {/* Table Body (Virtualized) */}
                <div
                    className="relative w-full"
                    style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const loan = data[virtualRow.index];
                        return (
                            <div
                                key={loan.loanId}
                                className="absolute top-0 left-0 w-full hover:bg-slate-50/50 transition-colors border-b border-border grid grid-cols-6 gap-4 items-center px-6"
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <div className="col-span-1 whitespace-nowrap overflow-hidden text-ellipsis py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-primary truncate">{loan.applicantName}</span>
                                        <span className="text-xs text-muted-foreground mt-0.5 truncate">{loan.loanId}</span>
                                    </div>
                                </div>

                                <div className="col-span-1 whitespace-nowrap overflow-hidden text-ellipsis py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-primary truncate">
                                            ${loan.loanAmount.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-muted-foreground mt-0.5 truncate">{loan.loanType}</span>
                                    </div>
                                </div>

                                <div className="col-span-1 whitespace-nowrap py-4">
                                    <span className="text-sm text-slate-600 font-medium">
                                        {format(new Date(loan.appliedDate), 'MMM dd, yyyy')}
                                    </span>
                                </div>

                                <div className="col-span-1 whitespace-nowrap py-4">
                                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold inline-block", getRiskScoreColor(loan.riskScore))}>
                                        {loan.riskScore}
                                    </span>
                                </div>

                                <div className="col-span-1 whitespace-nowrap py-4">
                                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border inline-block", getStatusColor(loan.status))}>
                                        {loan.status}
                                    </span>
                                </div>

                                <div className="col-span-1 whitespace-nowrap text-right flex justify-end py-4">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-muted-foreground">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});
