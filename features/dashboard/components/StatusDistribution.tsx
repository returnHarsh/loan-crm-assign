import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Loan } from '@/types/loans.types';

interface StatusDistributionProps {
  data: Loan[];
}

const STATUS_COLORS: Record<string, string> = {
  'Disbursed': '#10B981',   // Emerald
  'Approved': '#3B82F6',    // Blue
  'Under Review': '#F59E0B',// Amber
  'Rejected': '#EF4444'     // Red
};

export const StatusDistribution = ({ data }: StatusDistributionProps) => {
  const chartData = useMemo(() => {
    const counts = data.reduce((acc, loan) => {
      if (loan.status == "Applied") return acc;
      acc[loan.status] = (acc[loan.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ensure predictable order
    const order = ['Disbursed', 'Approved', 'Under Review', 'Rejected'];
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        let indexA = order.indexOf(a.name);
        let indexB = order.indexOf(b.name);
        if (indexA === -1) indexA = 99;
        if (indexB === -1) indexB = 99;
        return indexA - indexB;
      });
  }, [data]);

  console.log("chartData is : ", chartData)

  const totalLoans = data.length;

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-sm w-full h-[400px] flex flex-col">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-primary">Status Distribution</h3>
        <p className="text-sm text-muted-foreground">Total Applications Recieved : {totalLoans} </p>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        {chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-slate-50/50 rounded-xl border border-dashed border-border mt-4">
            No data available.
          </div>
        ) : (
          <>
            {/* Center total text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
              <span className="text-3xl font-bold text-primary">{totalLoans}</span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || '#94a3b8'}
                      style={{ filter: `drop-shadow(0px 2px 4px ${STATUS_COLORS[entry.name] || '#94a3b8'}40)` }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '8px 12px' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                  formatter={(value: any, name: any) => [`${value} Applications`, `${name}`]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-sm font-medium text-slate-700 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};
