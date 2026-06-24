"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  delay?: number;
  className?: string;
  isCurrency?: boolean;
  themeColor?: "primary" | "success" | "warning" | "danger" | "accent";
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "neutral",
  delay = 0,
  className,
  isCurrency = false,
  themeColor = "primary",
}: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "number" ? value : parseFloat(value.toString().replace(/[^0-9.-]+/g, "")) || 0;

  useEffect(() => {
    // Animate from the CURRENT display value to the NEW value
    let start = displayValue;
    const end = numericValue;

    // If it's already at the target, do nothing
    if (start === end) return;

    const duration = 800;
    const startTime = performance.now();

    const animateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setDisplayValue(start + (end - start) * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animateNumber);
  }, [numericValue]);

  const getFormattedValue = (val: number) => {
    if (isCurrency) return formatCurrency(val);
    if (title.includes("Rate") || title.includes("Score")) {
      return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(val) + (title.includes("Rate") ? "%" : "");
    }
    return formatNumber(val);
  };

  const formattedValue = typeof value === "string" && isNaN(Number(value))
    ? value
    : getFormattedValue(displayValue);

  const themeStyles = {
    primary: { iconBg: "bg-primary/10", iconColor: "text-primary", gradient: "from-primary to-primary-light" },
    success: { iconBg: "bg-success/10", iconColor: "text-success", gradient: "from-success to-emerald-400" },
    warning: { iconBg: "bg-warning/10", iconColor: "text-warning", gradient: "from-warning to-amber-400" },
    danger: { iconBg: "bg-danger/10", iconColor: "text-danger", gradient: "from-danger to-rose-400" },
    accent: { iconBg: "bg-accent/10", iconColor: "text-accent", gradient: "from-accent to-emerald-400" },
  }[themeColor];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between h-full group",
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20",
        className
      )}
    >
      <Icon className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.03] text-primary group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

      {/* Top Accent Line */}
      <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r", themeStyles.gradient)} />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className={cn("p-3.5 rounded-xl shrink-0 transition-colors duration-300", themeStyles.iconBg)}>
            <Icon className={cn("w-6 h-6", themeStyles.iconColor)} />
          </div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
            {title}
          </h3>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight truncate" title={formattedValue}>
            {formattedValue}
          </h2>
        </div>
      </div>

      {trend && (
        <div className="relative z-10 flex items-center justify-between text-sm pt-4 mt-6 border-t border-border/50">
          <div className="flex items-center">
            <span
              className={cn(
                "font-bold px-2 py-0.5 rounded-md text-xs",
                trendDirection === "up" ? "bg-success/10 text-success" :
                  trendDirection === "down" ? "bg-danger/10 text-danger" :
                    "bg-warning/10 text-warning"
              )}
            >
              {trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : "−"} {trend.replace(/[+-]/g, '')}
            </span>
            <span className="text-muted-foreground ml-2 text-xs truncate font-medium">vs last month</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
