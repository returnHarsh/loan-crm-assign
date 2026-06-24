"use client";

import { motion } from "framer-motion";
import { BranchInsight } from "../hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {
    Building2,
    TrendingUp,
    TrendingDown,
    Shield,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    FileText,
    Clock,
    Banknote,
} from "lucide-react";
import { LoanStatus } from "@/types/loans.types";

const STATUS_COLORS: Record<LoanStatus, string> = {
    Applied: "#6366f1",
    "Under Review": "#f59e0b",
    Approved: "#3b82f6",
    Disbursed: "#10b981",
    Rejected: "#ef4444",
};

const STATUS_ICONS: Record<LoanStatus, typeof FileText> = {
    Applied: FileText,
    "Under Review": Clock,
    Approved: CheckCircle2,
    Disbursed: Banknote,
    Rejected: XCircle,
};

const RISK_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
    Low: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "#10b981" },
    Medium: { bg: "bg-amber-50", text: "text-amber-700", bar: "#f59e0b" },
    High: { bg: "bg-red-50", text: "text-red-700", bar: "#ef4444" },
};

const getRiskLevel = (score: number): "Low" | "Medium" | "High" => {
    if (score <= 30) return "Low";
    if (score <= 70) return "Medium";
    return "High";
};

interface BranchInsightsProps {
    insights: BranchInsight[];
}

export const BranchInsights = ({ insights }: BranchInsightsProps) => {
    if (!insights || insights.length === 0) {
        return (
            <div className="bg-card text-card-foreground rounded-2xl border border-border p-8 shadow-sm text-center">
                <p className="text-muted-foreground">No branch data available for the selected period.</p>
            </div>
        );
    }

    const maxLoanAmount = Math.max(...insights.map((i) => i.totalLoanAmount));

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                    <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-primary tracking-tight">
                        Branch Performance Insights
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Comparative analytics across {insights.length} active branches
                    </p>
                </div>
            </div>

            {/* Branch Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {insights.map((branch, index) => (
                    <BranchCard
                        key={branch.branch}
                        branch={branch}
                        index={index}
                        maxLoanAmount={maxLoanAmount}
                    />
                ))}
            </div>
        </div>
    );
};

function BranchCard({
    branch,
    index,
    maxLoanAmount,
}: {
    branch: BranchInsight;
    index: number;
    maxLoanAmount: number;
}) {
    const riskLevel = getRiskLevel(branch.averageRiskScore);
    const riskStyle = RISK_COLORS[riskLevel];
    const volumePercent = maxLoanAmount > 0 ? (branch.totalLoanAmount / maxLoanAmount) * 100 : 0;

    // Build status bar chart data — only include statuses with count > 0
    const statusChartData = (Object.entries(branch.status) as [LoanStatus, number][])
        .filter(([, count]) => count > 0)
        .map(([status, count]) => ({
            name: status,
            count,
            fill: STATUS_COLORS[status],
        }));

    // Risk category breakdown
    const riskData = (["Low", "Medium", "High"] as const).map((cat) => ({
        label: cat,
        count: branch.riskCategory[cat],
        ...RISK_COLORS[cat],
    }));

    const totalRiskLoans = riskData.reduce((s, r) => s + r.count, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
            className="relative overflow-hidden bg-card text-card-foreground rounded-2xl border border-border shadow-sm group transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/20"
        >
            {/* Top accent bar */}
            <div
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${volumePercent}%` }}
            />

            <div className="p-5 pt-4 space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-primary leading-tight">
                                {branch.branch}
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium">
                                {branch.loanCount} application{branch.loanCount !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>

                    {/* Risk Badge */}
                    <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${riskStyle.bg} ${riskStyle.text}`}
                    >
                        {riskLevel === "High" ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                            <Shield className="w-3.5 h-3.5" />
                        )}
                        Risk: {branch.averageRiskScore}
                    </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                    <MetricPill
                        label="Total Volume"
                        value={formatCurrency(branch.totalLoanAmount)}
                        icon={<TrendingUp className="w-3.5 h-3.5 text-primary" />}
                    />
                    <MetricPill
                        label="Disbursed"
                        value={formatCurrency(branch.disbursedAmount)}
                        icon={<Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                    />
                    <MetricPill
                        label="Approval"
                        value={`${branch.approvalRate}%`}
                        icon={
                            branch.approvalRate >= 50 ? (
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                            )
                        }
                    />
                </div>

                {/* Status Distribution Mini Chart */}
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status Breakdown
                    </p>
                    <div className="h-[100px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={statusChartData}
                                layout="vertical"
                                margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
                                barSize={14}
                            >
                                <XAxis type="number" hide />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={80}
                                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "1px solid #e2e8f0",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.08)",
                                        padding: "6px 10px",
                                        fontSize: "12px",
                                    }}
                                    formatter={(value: any, name: any) => [
                                        `${value} loans`,
                                        name,
                                    ]}
                                />
                                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                                    {statusChartData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Category Bar */}
                <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Risk Profile
                    </p>
                    <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-100">
                        {riskData.map((r) => {
                            const pct =
                                totalRiskLoans > 0 ? (r.count / totalRiskLoans) * 100 : 0;
                            if (pct === 0) return null;
                            return (
                                <div
                                    key={r.label}
                                    className="h-full transition-all duration-500"
                                    style={{
                                        width: `${pct}%`,
                                        backgroundColor: r.bar,
                                    }}
                                    title={`${r.label}: ${r.count} (${pct.toFixed(0)}%)`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        {riskData.map((r) => (
                            <div key={r.label} className="flex items-center gap-1.5">
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: r.bar }}
                                />
                                <span className="text-[10px] font-medium text-muted-foreground">
                                    {r.label} ({r.count})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer — top status & rejection rate */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                        {(() => {
                            const Icon = STATUS_ICONS[branch.topStatus];
                            return <Icon className="w-3.5 h-3.5" style={{ color: STATUS_COLORS[branch.topStatus] }} />;
                        })()}
                        <span className="text-xs text-muted-foreground font-medium">
                            Top:{" "}
                            <span className="font-bold text-foreground">{branch.topStatus}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-xs text-muted-foreground font-medium">
                            Rejection:{" "}
                            <span
                                className={`font-bold ${branch.rejectionRate > 40 ? "text-red-600" : "text-foreground"}`}
                            >
                                {branch.rejectionRate}%
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function MetricPill({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="bg-slate-50/80 rounded-xl px-3 py-2.5 text-center space-y-1 border border-slate-100 hover:bg-slate-100/80 transition-colors duration-200">
            <div className="flex items-center justify-center gap-1">
                {icon}
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <p className="text-sm font-extrabold text-primary tracking-tight truncate" title={value}>
                {value}
            </p>
        </div>
    );
}