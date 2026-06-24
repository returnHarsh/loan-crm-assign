import { useMemo } from 'react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';
import { DateFilterType, Loan } from '@/types/loans.types';
import { formatCurrency } from '@/lib/utils';
import {
  differenceInCalendarDays, format, parseISO,
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  startOfWeek, startOfMonth,
  isValid
} from 'date-fns';

interface DisbursalTrendsProps {
  data: Loan[];
  filter: DateFilterType;
}

export const DisbursalTrends = ({ data, filter }: DisbursalTrendsProps) => {

  const filteredData = useMemo(() => {
    return data.filter((item: Loan) => item.status === "Disbursed" && item.disbursedDate)
  }, [data])

  const getGranularity = (startDate: Date, endDate: Date) => {
    const days = differenceInCalendarDays(endDate, startDate);
    if (days <= 31) {
      return 'day'
    }
    if (days <= 180) {
      return 'week'
    }
    return 'month'
  }

  // const chartData = useMemo(() => {
  //   let startDate = filter.start;
  //   let endDate = filter.end;

  //   if (!startDate || !endDate) {
  //     if (filteredData.length === 0) return [];

  //     const sortedDates = filteredData
  //       .map(d => parseISO(d.disbursedDate!))
  //       .filter(d => isValid(d))
  //       .sort((a, b) => a.getTime() - b.getTime());

  //     if (sortedDates.length === 0) return [];

  //     startDate = startDate || sortedDates[0];
  //     endDate = endDate || sortedDates[sortedDates.length - 1];
  //   }

  //   if (!startDate || !endDate) return [];

  //   const granularity = getGranularity(startDate, endDate);

  //   let intervals: Date[] = [];
  //   try {
  //     if (granularity === 'day') {
  //       intervals = eachDayOfInterval({ start: startDate, end: endDate });
  //     } else if (granularity === 'week') {
  //       intervals = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });
  //     } else if (granularity === 'month') {
  //       intervals = eachMonthOfInterval({ start: startDate, end: endDate });
  //     }
  //   } catch (e) {
  //     // In case start date is after end date
  //     console.error(e);
  //     return [];
  //   }

  //   const bucketFormat = granularity === 'month' ? 'yyyy-MM' : 'yyyy-MM-dd';

  //   const dateGroupedData = new Map<string, number>();

  //   intervals.forEach(date => {
  //     let key = format(date, bucketFormat);
  //     if (granularity === 'week') {
  //        key = format(startOfWeek(date, { weekStartsOn: 1 }), bucketFormat);
  //     } else if (granularity === 'month') {
  //        key = format(startOfMonth(date), bucketFormat);
  //     }
  //     dateGroupedData.set(key, 0);
  //   });

  //   filteredData.forEach((data: Loan) => {
  //     const date = parseISO(data.disbursedDate!);
  //     if (!isValid(date)) return;

  //     let key = format(date, bucketFormat);
  //     if (granularity === 'week') {
  //       key = format(startOfWeek(date, { weekStartsOn: 1 }), bucketFormat);
  //     } else if (granularity === 'month') {
  //       key = format(startOfMonth(date), bucketFormat);
  //     }

  //     if (dateGroupedData.has(key)) {
  //        dateGroupedData.set(key, dateGroupedData.get(key)! + data.loanAmount);
  //     } else {
  //        dateGroupedData.set(key, data.loanAmount);
  //     }
  //   });

  //   return Array.from(dateGroupedData.entries())
  //     .map(([dateKey, amount]) => {
  //       const d = parseISO(granularity === 'month' ? `${dateKey}-01` : dateKey);

  //       let formattedDate = '';
  //       if (granularity === 'day') {
  //         formattedDate = format(d, 'MMM dd');
  //       } else if (granularity === 'week') {
  //         formattedDate = `Wk of ${format(d, 'MMM dd')}`;
  //       } else {
  //         formattedDate = format(d, 'MMM yyyy');
  //       }

  //       return {
  //         date: dateKey,
  //         amount,
  //         formattedDate
  //       };
  //     })
  //     .sort((a, b) => a.date.localeCompare(b.date));

  // }, [filteredData, filter.start, filter.end]);


  const chartData = useMemo(() => {

    // ============= filtered disbursed data in sorted order =============
    const loansDataSorted = filteredData.map((data: Loan) => {
      return { ...data, disbursedDate: new Date(data.disbursedDate!) }
    }).filter((sortedData: any) => {
      return isValid(sortedData.disbursedDate)
    }).sort((a: any, b: any) => {
      return a.disbursedDate.getTime() - b.disbursedDate.getTime()
    })

    if (loansDataSorted.length === 0) return [];

    const startDate = filter.start || loansDataSorted[0].disbursedDate;
    const endDate = filter.end || loansDataSorted[loansDataSorted.length - 1].disbursedDate

    const groupedData = new Map<string, number>();

    const granuality = getGranularity(startDate, endDate);

    switch (granuality) {
      case "day": {
        loansDataSorted.forEach((data: any) => {
          // Fix: disbursedDate is a Date object now, so split("T") will fail. Use format instead.
          const key = format(data.disbursedDate, 'dd MMM');
          const amount = groupedData.get(key) || 0
          groupedData.set(key, amount + data.loanAmount)
        })
        break;
      }
      case "week": {
        loansDataSorted.forEach((data: any) => {
          const date = data.disbursedDate;
          // Format week like "01 Jan - 07 Jan"
          const weekStart = startOfWeek(date, { weekStartsOn: 1 });
          const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000); // Sunday
          const key = `${format(weekStart, 'dd MMM')} - ${format(weekEnd, 'dd MMM')}`;

          const amount = groupedData.get(key) || 0;
          groupedData.set(key, amount + data.loanAmount)
        })
        break;
      }
      case "month": {
        loansDataSorted.forEach((data: any) => {
          const date = data.disbursedDate;
          const key = format(date, "MMM yyyy")
          const amount = groupedData.get(key) || 0;
          groupedData.set(key, amount + data.loanAmount)
        })
        break; // Added missing break
      }
    }

    return [...groupedData.entries()].map(([key, amount]) => {
      return {
        formattedDate: key,
        amount
      }
    })

  }, [filteredData, filter.start, filter.end])

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-sm w-full h-[400px] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">Disbursal Trends</h3>
          <p className="text-sm text-muted-foreground">Total disbursed amount over time</p>
        </div>
        {chartData.length > 0 && (
          <div className="text-xs font-medium text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
            {chartData.length} data points
          </div>
        )}
      </div>

      <div className="flex-1 w-full min-h-0">
        {chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-slate-50/50 rounded-xl border border-dashed border-border">
            No disbursal data available for the selected period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="formattedDate"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                dy={10}
                minTickGap={20}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />
              <Tooltip
                cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [formatCurrency(value as number), 'Disbursed']}
                labelStyle={{ color: '#0f172a', fontWeight: 600, marginBottom: '4px' }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAmount)"
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10B981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}