"use client";

import { cn } from "@/lib/utils";
import type { Tick } from "@/types/website";

interface UptimeBarsProps {
  ticks: Tick[];
  maxBars?: number;
  compact?: boolean;
}

export function UptimeBars({ ticks, maxBars = 60, compact = false }: UptimeBarsProps) {
  // Create array of maxBars length, filling with ticks or null
  const bars = Array.from({ length: maxBars }, (_, index) => {
    return ticks[index] || null;
  });

  const height = compact ? "h-3" : "h-4";
  const gap = compact ? "gap-0.5" : "gap-0.5";

  return (
    <div>
      <div className={cn("flex rounded-sm overflow-hidden", height, gap)}>
        {bars.map((tick, index) => {
          const isSuccess = tick?.status === 200;
          const hasData = tick !== null;
          const tooltipText = tick 
            ? `${tick.status} • ${tick.latency}ms`
            : "No data";

          return (
            <div
              key={index}
              className={cn(
                "flex-1 min-w-[1px] rounded-[1px]",
                hasData 
                  ? isSuccess 
                    ? "bg-green-500" 
                    : "bg-red-500"
                  : "bg-muted"
              )}
              title={tooltipText}
            />
          );
        })}
      </div>
      {!compact && (
        <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
          <span>30m ago</span>
          <span>now</span>
        </div>
      )}
    </div>
  );
}