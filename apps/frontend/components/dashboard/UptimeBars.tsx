"use client";

import { cn } from "@/lib/utils";
import type { Tick } from "@/types/website";

interface UptimeBarsProps {
  ticks: Tick[];
  maxBars?: number;
}

export function UptimeBars({ ticks, maxBars = 60 }: UptimeBarsProps) {
  // Create array of maxBars length, filling with ticks or null
  const bars = Array.from({ length: maxBars }, (_, index) => {
    return ticks[index] || null;
  });

  return (
    <div>
      <div className="flex h-6 gap-0.5 rounded-sm overflow-hidden">
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
                "flex-1 min-w-[2px] rounded-[1px]",
                hasData 
                  ? isSuccess 
                    ? "bg-green-600" 
                    : "bg-red-600"
                  : "bg-gray-200 dark:bg-gray-800"
              )}
              title={tooltipText}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>30m</span>
        <span>now</span>
      </div>
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes === 1) return "1 min ago";
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return "1 hour ago";
  return `${diffInHours} hours ago`;
}