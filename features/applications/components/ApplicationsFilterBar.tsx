import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { ApplicationFilters, SortDateType, SortingFilterType } from "@/types/applications.types";
import { LoanStatus, RiskCategory } from "@/types/loans.types";
import { Filter, SortAsc, SortDesc, Search, RotateCcw } from "lucide-react";

interface ApplicationsFilterBarProps {
    filter: ApplicationFilters;
    setFilter: Dispatch<SetStateAction<ApplicationFilters>>;
    sortFilter: SortingFilterType;
    setSortFilter: Dispatch<SetStateAction<SortingFilterType>>;
    sortOrder: "asc" | "desc";
    setSortOrder: Dispatch<SetStateAction<"asc" | "desc">>;
    sortDateType: SortDateType;
    setSortDateType: Dispatch<SetStateAction<SortDateType>>;
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
}

export const ApplicationsFilterBar = React.memo(({
    filter, setFilter,
    sortFilter, setSortFilter,
    sortOrder, setSortOrder,
    sortDateType, setSortDateType,
    searchQuery, setSearchQuery
}: ApplicationsFilterBarProps) => {

    const statuses: LoanStatus[] = ["Applied", "Under Review", "Approved", "Disbursed", "Rejected"];
    const riskCategories: RiskCategory[] = ["Low", "Medium", "High"];

    const [localSearch, setLocalSearch] = useState(searchQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localSearch);
        }, 400);
        return () => clearTimeout(timer);
    }, [localSearch, setSearchQuery]);

    useEffect(() => {
        setLocalSearch(searchQuery);
    }, [searchQuery]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "") {
            setSortFilter(null);
            setSortDateType(null);
            return;
        }

        if (value === "loanAmount" || value === "riskScore") {
            setSortFilter(value as SortingFilterType);
            setSortDateType(null);
        } else {
            // It's a date sort
            setSortFilter("date");
            setSortDateType(value as SortDateType);
        }
    };

    const handleReset = () => {
        setSearchQuery("");
        setLocalSearch("");
        setFilter({ status: null, riskCategory: null });
        setSortFilter(null);
        setSortDateType(null);
        setSortOrder("asc");
    };

    return (
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl shadow-sm mb-6">

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto flex-1">
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5 outline-none font-medium"
                        placeholder="Search Name or ID..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                    />
                </div>

                <div className="hidden sm:block h-6 border-r border-border mx-1"></div>

                <div className="flex items-center gap-2 text-sm font-semibold text-primary w-full sm:w-auto">
                    <Filter className="w-4 h-4" />
                    <span className="inline">Filters</span>
                </div>

                <select
                    className="flex-1 min-w-[140px] sm:flex-none bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none font-medium"
                    value={filter.status || ""}
                    onChange={(e) => setFilter(prev => ({ ...prev, status: (e.target.value as LoanStatus) || null }))}
                >
                    <option value="">All Statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                    className="flex-1 min-w-[140px] sm:flex-none bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none font-medium"
                    value={filter.riskCategory || ""}
                    onChange={(e) => setFilter(prev => ({ ...prev, riskCategory: (e.target.value as RiskCategory) || null }))}
                >
                    <option value="">All Risk Categories</option>
                    {riskCategories.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-3 w-full xl:w-auto pt-3 xl:pt-0 border-t xl:border-none border-border">
                <select
                    className="flex-1 min-w-[150px] sm:flex-none bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none font-medium"
                    value={sortFilter === "date" && sortDateType ? sortDateType : (sortFilter || "")}
                    onChange={handleSortChange}
                >
                    <option value="">Sort By...</option>
                    <option value="loanAmount">Loan Amount</option>
                    <option value="riskScore">Risk Score</option>
                    <option value="appliedDate">Date Applied</option>
                    <option value="lastUpdatedDate">Last Updated Date</option>
                    {(filter.status == "Approved" || filter.status == "Disbursed") && <option value="approvedDate">Date Approved</option>}
                    {filter.status == "Disbursed" && <option value="disbursedDate">Date Disbursed</option>}
                </select>

                <button
                    onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                    className="p-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                    title={sortOrder === "asc" ? "Ascending" : "Descending"}
                >
                    {sortOrder === "asc" ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                </button>

                <div className="hidden xl:block h-6 border-r border-border mx-1"></div>

                <button
                    onClick={handleReset}
                    className="p-2.5 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 transition-colors shrink-0 flex items-center gap-2"
                    title="Reset All Filters"
                >
                    <RotateCcw className="w-5 h-5" />
                    <span className="text-sm font-semibold hidden sm:inline">Reset</span>
                </button>
            </div>
        </div>
    );
});
