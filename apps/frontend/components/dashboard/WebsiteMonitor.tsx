"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StatusIndicator } from "./StatusIndicator";
import { UptimeBars } from "./UptimeBars";
import { cn } from "@/lib/utils";
import type { Website, Tick } from "@/types/website";

interface WebsiteMonitorProps {
  website: Website;
}

export function WebsiteMonitor({ website }: WebsiteMonitorProps) {
  const recentTicks = getRecentTicks(website.ticks);
  const isUp = getOverallStatus(recentTicks);
  const stats = getUptimeStats(recentTicks);
  const latestTick = recentTicks[0];

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-md">
      <Accordion type="single" collapsible>
        <AccordionItem value={website.id} className="border-none">
          <div className="p-4">
            <AccordionTrigger className="flex items-center justify-between w-full hover:no-underline p-0">
              <div className="flex items-center gap-3 flex-1">
                <StatusIndicator isUp={isUp} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-black dark:text-white">
                      {website.name || new URL(website.url).hostname}
                    </h3>
                    <span className={cn(
                      "text-xs px-2 py-0.5 border rounded-sm",
                      isUp ? "text-green-600 border-green-600" : "text-red-600 border-red-600"
                    )}>
                      {isUp ? "UP" : "DOWN"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <span>{stats.uptime.toFixed(1)}%</span>
                    {latestTick && <span>{latestTick.latency}ms</span>}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
          </div>

          <AccordionContent>
            <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-800">
              <div className="pt-4">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-black dark:text-white mb-2">Last 30 minutes</h4>
                  <UptimeBars ticks={recentTicks} />
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Uptime: </span>
                    <span className="text-black dark:text-white font-medium">{stats.uptime.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Avg: </span>
                    <span className="text-black dark:text-white font-medium">{stats.averageLatency}ms</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Checks: </span>
                    <span className="text-black dark:text-white font-medium">{stats.successfulTicks}/{stats.totalTicks}</span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function getRecentTicks(ticks: Tick[]): Tick[] {
  const now = Date.now();
  const thirtyMinsAgo = now - 30 * 60 * 1000;

  return (ticks ?? [])
    .map((tick) => ({ ...tick, timestamp: new Date(tick.createdAt).getTime() }))
    .filter((tick) => 
      !isNaN(tick.timestamp) && 
      tick.timestamp >= thirtyMinsAgo && 
      tick.timestamp <= now
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 30); // Show last 30 checks instead of 10
}

function getOverallStatus(ticks: Tick[]): boolean {
  if (!ticks || ticks.length === 0) return false;
  const latestTick = ticks[0];
  return latestTick?.status === 200;
}

function getUptimeStats(ticks: Tick[]) {
  if (!ticks || ticks.length === 0) {
    return { uptime: 0, totalTicks: 0, successfulTicks: 0, averageLatency: 0 };
  }

  const totalTicks = ticks.length;
  const successfulTicks = ticks.filter(tick => tick.status === 200).length;
  const uptime = totalTicks > 0 ? (successfulTicks / totalTicks) * 100 : 0;
  const totalLatency = ticks.reduce((sum, tick) => sum + (tick.latency || 0), 0);
  const averageLatency = totalTicks > 0 ? Math.round(totalLatency / totalTicks) : 0;

  return {
    uptime,
    totalTicks,
    successfulTicks,
    averageLatency,
  };
}