import { useMemo, useState } from 'react';
import { DateFilterType, Loan } from '@/types/loans.types';
import { format } from 'date-fns';
import { ArrowDown, BarChart2, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sankey, ResponsiveContainer, Tooltip, Layer, Rectangle } from 'recharts';

interface ConversionFunnelProps {
  data: Loan[];
  filter: DateFilterType
}

const renderSankeyNode = ({ x, y, width, height, index, payload, containerWidth }: any) => {
  const isOut = x + width + 6 > containerWidth;
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle x={x} y={y} width={width} height={height} fill={payload.fill} fillOpacity="1" rx={3} />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="12"
        fill="#0f172a"
        fontWeight={600}
        dy={4}
      >
        {payload.name} ({payload.value})
      </text>
    </Layer>
  );
};

export const ConversionFunnel = ({ data, filter }: ConversionFunnelProps) => {
  const [viewType, setViewType] = useState<"funnel" | "sankey">("funnel");

  // Custom CSS Funnel Data (Cumulative)
  const funnelStages = useMemo(() => {
    let appliedCount = 0;
    let underReviewCount = 0;
    let approvedCount = 0;
    let disbursedCount = 0;
    let rejectedCount = 0;

    data.forEach(loan => {
      if (loan.status === 'Applied') appliedCount++;
      else if (loan.status === 'Under Review') underReviewCount++;
      else if (loan.status === 'Approved') approvedCount++;
      else if (loan.status === 'Disbursed') disbursedCount++;
      else if (loan.status === 'Rejected') rejectedCount++;
    });

    const totalApplied = appliedCount + underReviewCount + approvedCount + disbursedCount + rejectedCount;
    const totalUnderReview = underReviewCount + approvedCount + disbursedCount;
    const totalApproved = approvedCount + disbursedCount;
    const totalDisbursed = disbursedCount;

    const stages = [
      { label: "Applied", value: totalApplied, color: "bg-slate-800" },
      { label: "Under Review", value: totalUnderReview, color: "bg-blue-500" },
      { label: "Approved", value: totalApproved, color: "bg-emerald-400" },
      { label: "Disbursed", value: totalDisbursed, color: "bg-emerald-600" },
    ];

    const max = totalApplied || 1;

    return stages.map((stage, idx) => {
      const percentageOfTotal = Math.round((stage.value / max) * 100);
      let dropoff = 0;

      if (idx > 0) {
        const prevValue = stages[idx - 1].value;
        if (prevValue > 0) {
          dropoff = Math.round(((prevValue - stage.value) / prevValue) * 100);
        }
      }

      return { ...stage, percentageOfTotal, dropoff };
    });
  }, [data]);

  // Sankey Data
  const sankeyData = useMemo(() => {
    let appliedCount = 0;
    let underReviewCount = 0;
    let approvedCount = 0;
    let disbursedCount = 0;
    let rejectedCount = 0;

    data.forEach(loan => {
      if (loan.status === 'Applied') appliedCount++;
      else if (loan.status === 'Under Review') underReviewCount++;
      else if (loan.status === 'Approved') approvedCount++;
      else if (loan.status === 'Disbursed') disbursedCount++;
      else if (loan.status === 'Rejected') rejectedCount++;
      else appliedCount++;
    });

    const toUnderReview = underReviewCount + approvedCount + disbursedCount;
    const droppedAtApplied = appliedCount + rejectedCount;

    const toApproved = approvedCount + disbursedCount;
    const droppedAtUR = underReviewCount;

    const toDisbursed = disbursedCount;
    const droppedAtAppr = approvedCount;

    const nodes = [
      { name: "Applied", fill: "#0f172a" },
      { name: "Under Review", fill: "#3b82f6" },
      { name: "Approved", fill: "#10b981" },
      { name: "Disbursed", fill: "#22c55e" },
      { name: "Dropped/Pending", fill: "#cbd5e1" }
    ];

    const links = [
      { source: 0, target: 1, value: toUnderReview },
      { source: 0, target: 4, value: droppedAtApplied },
      { source: 1, target: 2, value: toApproved },
      { source: 1, target: 4, value: droppedAtUR },
      { source: 2, target: 3, value: toDisbursed },
      { source: 2, target: 4, value: droppedAtAppr },
    ].filter(link => link.value > 0);

    return { nodes, links };
  }, [data]);

  const dateRangeText = useMemo(() => {
    if (filter?.start && filter?.end) {
      return `${format(filter.start, 'dd MMM yyyy')} - ${format(filter.end, 'dd MMM yyyy')}`;
    }
    return "All Time";
  }, [filter]);

  return (
    <div className={`bg-card text-card-foreground rounded-2xl border border-border p-4 sm:p-6 shadow-sm w-full ${viewType != "funnel" ? "h-[400px] overflow-y-auto" : ""} flex flex-col  overflow-x-hidden`}>
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h3 className="text-lg font-semibold text-primary">Conversion Funnel</h3>
          <p className="text-sm text-muted-foreground">Pipeline drop-off analysis</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewType("funnel")}
              className={cn(
                "p-1.5 rounded-md text-xs font-semibold flex items-center transition-all",
                viewType === "funnel" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              title="Standard Funnel"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType("sankey")}
              className={cn(
                "p-1.5 rounded-md text-xs font-semibold flex items-center transition-all",
                viewType === "sankey" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              title="Sankey Chart"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs font-medium text-muted-foreground bg-slate-100 px-3 py-1.5 rounded-lg">
            {dateRangeText}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center min-h-0 py-2">
        {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-slate-50/50 rounded-xl border border-dashed border-border">
            No pipeline data available.
          </div>
        ) : viewType === "funnel" ? (
          <div className="flex flex-col items-center w-full max-w-md mx-auto">
            {funnelStages.map((step, idx) => (
              <div key={step.label} className="flex flex-col items-center w-full">

                {/* Drop off indicator */}
                {idx > 0 && (
                  <div className="flex flex-col items-center text-muted-foreground my-1.5 opacity-80">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-red-500">{step.dropoff}% Drop-off</span>
                    <ArrowDown className="w-4 h-4 text-slate-300 -mt-1" />
                  </div>
                )}

                {/* Funnel Bar */}
                <div
                  className={cn(
                    "h-12 sm:h-14 rounded-xl flex items-center justify-between px-4 text-white font-bold transition-all duration-1000 ease-out shadow-sm",
                    step.color
                  )}
                  style={{ width: `${Math.max(step.percentageOfTotal, 25)}%` }}
                >
                  <span className="truncate text-xs sm:text-sm mr-2">{step.label}</span>
                  <span className="text-sm sm:text-base">{step.value.toLocaleString()}</span>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={sankeyData}
              node={renderSankeyNode}
              link={{ stroke: '#e2e8f0', strokeOpacity: 0.6 }}
              nodePadding={40}
              margin={{ top: 20, right: 120, bottom: 20, left: 20 }}
            >
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#0f172a', fontWeight: 600 }}
              />
            </Sankey>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
