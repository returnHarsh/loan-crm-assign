import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { DateFilterType } from "@/types/loans.types";
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface DashboardFilterProps {
  filter: DateFilterType;
  setFilter: Dispatch<SetStateAction<DateFilterType>>;
}

export function DashboardFilter({ filter, setFilter }: DashboardFilterProps) {
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  const options: { label: string; value: DateFilterType["type"] }[] = [
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "last7Days" },
    { label: "This Month", value: "thisMonth" },
    { label: "Custom", value: "custom" },
  ];

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (filter.type === "custom") {
      setCustomStart(filter.start ? formatLocalDate(filter.start) : "");
      setCustomEnd(filter.end ? formatLocalDate(filter.end) : "");
    }
  }, [filter.type, filter.start, filter.end]);

  const handleSelect = (type: DateFilterType["type"]) => {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    if (type === "today") {
      start = startOfDay(today);
      end = endOfDay(today);
    } else if (type === "last7Days") {
      start = startOfDay(subDays(today, 7));
      end = endOfDay(today);
    } else if (type === "thisMonth") {
      start = startOfMonth(today);
      end = endOfMonth(today);
    } else if (type === "custom") {
      start = filter.start || startOfDay(subDays(today, 30));
      end = filter.end || endOfDay(today);
      setCustomStart(formatLocalDate(start));
      setCustomEnd(formatLocalDate(end));
    }

    setFilter({ type, start, end });
  };

  const applyCustomFilter = () => {
    let start: Date | null = null;
    let end: Date | null = null;

    if (customStart) start = startOfDay(parseISO(customStart));
    if (customEnd) end = endOfDay(parseISO(customEnd));

    setFilter({ type: "custom", start, end });
  };

  console.log("custom start is : ", customStart);
  console.log("custom end is ", customEnd);

  return (
    <div className="flex flex-col xl:flex-row xl:items-center gap-4">
      <div className="flex items-center p-1 bg-card border border-border rounded-xl shadow-sm overflow-x-auto">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap",
              filter.type === opt.value
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filter.type === "custom" && (
        <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-xl shadow-sm">
          <CalendarIcon className="w-4 h-4 text-muted-foreground ml-1" />
          <input
            type="date"
            className="text-sm bg-transparent border-none text-foreground focus:outline-none focus:ring-0 cursor-pointer"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
          />
          <span className="text-muted-foreground font-medium">-</span>
          <input
            type="date"
            className="text-sm bg-transparent border-none text-foreground focus:outline-none focus:ring-0 cursor-pointer"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
          />
          <button
            onClick={applyCustomFilter}
            className="px-3 py-1 ml-1 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-light transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
