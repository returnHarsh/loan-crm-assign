"use client";

import { useEffect, useState } from "react";
import { useApplications } from "./hooks/useApplications";
import { ApplicationsFilterBar } from "./components/ApplicationsFilterBar";
import { ApplicationsTable } from "./components/ApplicationsTable";
import { ApplicationsVirtualizedTable } from "./components/ApplicationsVirtualizedTable";
import { TableSkeleton } from "./components/TableSkeleton";
import { PaginationControls } from "./components/PaginationControls";
import { Loan } from "@/types/loans.types";

export const Applications = () => {
    const {
        fetchLoanData, loading,
        limit, setLimit,
        pageNumber, setPageNumber,
        filter, setFilter,
        sortFilter, setSortFilter,
        sortOrder, setSortOrder,
        sortDateType, setSortDateType,
        searchQuery, setSearchQuery,
        totalItems,
        viewAllData,
        setViewAllData
    } = useApplications();

    const [paginatedData, setPaginatedData] = useState<Loan[]>([]);


    useEffect(() => {
        const loadData = async () => {
            const data = await fetchLoanData(pageNumber, filter, sortFilter, sortOrder);
            if (data) {
                setPaginatedData(data);
            }
        };
        loadData();
    }, [pageNumber, limit, filter, sortFilter, sortOrder, sortDateType, searchQuery, viewAllData]);

    // Reset pagination to page 1 when filter or sort changes
    useEffect(() => {
        setPageNumber(1);
    }, [filter, sortFilter, sortOrder, sortDateType, searchQuery, viewAllData, setPageNumber]);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Applications Directory</h1>
                <p className="text-muted-foreground mt-2">View and manage all loan applications in the pipeline.</p>
                <button
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer"
                    onClick={() => {
                        setPaginatedData([]);
                        setViewAllData(prev => !prev);
                    }}
                >
                    {viewAllData ? 'View Pagination' : 'View All Data'}
                </button>
            </div>

            <ApplicationsFilterBar
                filter={filter} setFilter={setFilter}
                sortFilter={sortFilter} setSortFilter={setSortFilter}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                sortDateType={sortDateType} setSortDateType={setSortDateType}
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            />

            {loading ? (
                <TableSkeleton />
            ) : viewAllData ? (
                <ApplicationsVirtualizedTable data={paginatedData} />
            ) : (
                <ApplicationsTable data={paginatedData} />
            )}

            {!loading && totalItems > 0 && !viewAllData && (
                <PaginationControls
                    pageNumber={pageNumber} setPageNumber={setPageNumber}
                    limit={limit} setLimit={setLimit}
                    totalItems={totalItems}
                />
            )}
        </div>
    );
};