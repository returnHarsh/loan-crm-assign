import React, { Dispatch, SetStateAction } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    pageNumber: number;
    setPageNumber: Dispatch<SetStateAction<number>>;
    limit: number;
    setLimit: Dispatch<SetStateAction<number>>;
    totalItems: number;
}

export const PaginationControls = React.memo(({ 
    pageNumber, setPageNumber, 
    limit, setLimit, 
    totalItems 
}: PaginationControlsProps) => {

    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startItem = ((pageNumber - 1) * limit) + 1;
    const endItem = Math.min(pageNumber * limit, totalItems);

    const handlePrev = () => {
        if (pageNumber > 1) setPageNumber(prev => prev - 1);
    };

    const handleNext = () => {
        if (pageNumber < totalPages) setPageNumber(prev => prev + 1);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 bg-card p-4 rounded-xl border border-border shadow-sm">
            <div className="text-sm text-muted-foreground font-medium text-center sm:text-left">
                Showing <span className="text-primary">{totalItems === 0 ? 0 : startItem}</span> to <span className="text-primary">{endItem}</span> of <span className="text-primary">{totalItems}</span> entries
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                    <span className="text-sm text-muted-foreground font-medium">Rows per page:</span>
                    <select 
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-primary focus:border-primary block p-1.5 outline-none font-medium"
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPageNumber(1);
                        }}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-1 bg-slate-50 border border-border p-1 rounded-xl shadow-sm">
                    <button 
                        onClick={handlePrev} 
                        disabled={pageNumber === 1}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="text-sm font-semibold text-primary px-3 whitespace-nowrap">
                        Page {pageNumber} of {totalPages}
                    </span>

                    <button 
                        onClick={handleNext} 
                        disabled={pageNumber === totalPages}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
});
