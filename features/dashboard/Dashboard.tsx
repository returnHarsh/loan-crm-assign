"use client"

import { KPIcards } from "./components/KPIcards"
import { DisbursalTrends } from "./components/DisbursalTrends"
import { DashboardFilter } from "./components/DashboardFilter"
import { StatusDistribution } from "./components/StatusDistribution"
import { ConversionFunnel } from "./components/ConversionFunnel"
import { BranchInsights } from "./components/Insight"
import { useDashboard } from "./hooks/useDashboard"

export const Dashboard = () => {

    const { filter, setFilter, filteredData, stats, insights } = useDashboard()

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-2">Monitor your loan applications and disbursal performance.</p>
                </div>
                <DashboardFilter filter={filter} setFilter={setFilter} />
            </div>
            <KPIcards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <DisbursalTrends data={filteredData} filter={filter} />
                </div>
                <div className="lg:col-span-1">
                    <StatusDistribution data={filteredData} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                <ConversionFunnel data={filteredData} filter={filter} />
            </div>

            <div className="mb-8">
                <BranchInsights insights={insights} />
            </div>
        </div>
    )
}