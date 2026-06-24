import { StatsType } from "@/types/loans.types"
import { KpiCard } from "@/components/ui/KpiCard"
import {
    Banknote,
    Activity,
    Gauge,
    XCircle,
    CheckCircle2,
    Clock
} from "lucide-react"

export const KPIcards = ({ stats }: { stats: StatsType }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <KpiCard
                title="Total Disbursed"
                value={stats.totalDisbursedAmount}
                icon={Banknote}
                isCurrency={true}
                trend="+12.5%"
                trendDirection="up"
                delay={0}
                themeColor="accent"
            />
            <KpiCard
                title="Active Applications"
                value={stats.activeApplications}
                icon={Activity}
                trend="+4.2%"
                trendDirection="up"
                delay={1}
                themeColor="primary"
            />
            <KpiCard
                title="Avg Risk Score"
                value={stats.averageRiskScore}
                icon={Gauge}
                trend="-1.5%"
                trendDirection="down"
                delay={2}
                themeColor="primary"
            />
            <KpiCard
                title="Rejection Rate"
                value={stats.rejectionRate}
                icon={XCircle}
                trend="-0.8%"
                trendDirection="down"
                delay={3}
                themeColor="primary"
            />
            <KpiCard
                title="Total Approved"
                value={stats.totalApproved}
                icon={CheckCircle2}
                trend="+8.1%"
                trendDirection="up"
                delay={4}
                themeColor="accent"
            />
            <KpiCard
                title="Under Review"
                value={stats.totalUnderReview}
                icon={Clock}
                trend="-2.4%"
                trendDirection="neutral"
                delay={5}
                themeColor="primary"
            />
        </div>
    )
}