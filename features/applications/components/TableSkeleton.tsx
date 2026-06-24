import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const TableSkeleton = React.memo(() => {
    return (
        <div className="w-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Table Header Skeleton */}
            <div className="bg-slate-50/50 border-b border-border px-6 py-4 grid grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i}>
                        <Skeleton width={96} height={16} />
                    </div>
                ))}
            </div>

            {/* Table Rows Skeleton */}
            <div className="flex flex-col">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="px-6 py-4 border-b border-border grid grid-cols-6 gap-4 items-center last:border-0">
                        {/* Applicant */}
                        <div className="col-span-1">
                            <Skeleton width={128} height={20} style={{ marginBottom: '8px' }} />
                            <Skeleton width={80} height={12} />
                        </div>
                        {/* Amount & Type */}
                        <div className="col-span-1">
                            <Skeleton width={96} height={20} style={{ marginBottom: '8px' }} />
                            <Skeleton width={64} height={12} />
                        </div>
                        {/* Date */}
                        <div className="col-span-1">
                            <Skeleton width={112} height={16} />
                        </div>
                        {/* Risk Score */}
                        <div className="col-span-1">
                            <Skeleton width={48} height={24} borderRadius={9999} />
                        </div>
                        {/* Status */}
                        <div className="col-span-1">
                            <Skeleton width={96} height={24} borderRadius={9999} />
                        </div>
                        {/* Actions */}
                        <div className="col-span-1 flex justify-end">
                            <Skeleton width={32} height={32} borderRadius={8} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
