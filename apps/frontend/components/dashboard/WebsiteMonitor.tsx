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
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Accordion type="single" collapsible>
        <AccordionItem value={website.id} className="border-none">
          <div className="p-3">
            <AccordionTrigger className="flex items-center justify-between w-full hover:no-underline p-0 [&[data-state=open]>div>div:last-child]:opacity-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <StatusIndicator isUp={isUp} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground text-sm truncate">
                      {website.name || new URL(website.url).hostname}
                    </h3>
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-md font-medium flex-shrink-0",
                      isUp 
                        ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950" 
                        : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950"
                    )}>
                      {isUp ? "UP" : "DOWN"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{stats.uptime.toFixed(1)}% uptime</span>
                    {latestTick && <span>{latestTick.latency}ms</span>}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <UptimeBars ticks={recentTicks} maxBars={20} compact />
                </div>
              </div>
            </AccordionTrigger>
          </div>

          <AccordionContent>
            <div className="px-3 pb-3 border-t border-border">
              <div className="pt-3 space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-foreground mb-2">Last 30 minutes</h4>
                  <UptimeBars ticks={recentTicks} maxBars={60} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground block">Uptime</span>
                    <span className="text-foreground font-medium">{stats.uptime.toFixed(1)}%</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground block">Avg Response</span>
                    <span className="text-foreground font-medium">{stats.averageLatency}ms</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground block">Checks</span>
                    <span className="text-foreground font-medium">{stats.successfulTicks}/{stats.totalTicks}</span>
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