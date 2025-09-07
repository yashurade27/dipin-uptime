"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebsiteMonitor } from "@/components/dashboard/WebsiteMonitor";
import { AddWebsiteModal } from "@/components/dashboard/AddWebsiteModal";
import { useWebsites } from "@/hooks/useWebsites";

export default function DashboardPage() {
  const { websites, isLoading, addWebsite, refreshWebsites } = useWebsites();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddWebsite = async (url: string) => {
    try {
      await addWebsite(url);
      setIsAddModalOpen(false);
      refreshWebsites?.();
    } catch (error) {
      throw error;
    }
  };

  // Calculate overall stats
  const totalSites = websites.length;
  const onlineSites = websites.filter(site => {
    const latestTick = site.ticks?.[0];
    return latestTick?.status === 200;
  }).length;
  const avgUptime = websites.length > 0 
    ? websites.reduce((acc, site) => {
        const recentTicks = site.ticks?.slice(0, 10) || [];
        const uptime = recentTicks.length > 0 
          ? (recentTicks.filter(t => t.status === 200).length / recentTicks.length) * 100
          : 0;
        return acc + uptime;
      }, 0) / websites.length
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-3">
            <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading monitors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-foreground">
            Monitors
          </h1>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="h-8 px-3 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>

        {/* Stats */}
        {websites.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-medium text-foreground">{totalSites}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Online</p>
              <p className="text-lg font-medium text-green-600">{onlineSites}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Uptime</p>
              <p className="text-lg font-medium text-foreground">{avgUptime.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Monitors */}
        {websites.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                No monitors
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Start monitoring your websites and APIs
              </p>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                size="sm"
                className="h-8 px-3 text-xs"
              >
                Add Monitor
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {websites.map((website) => (
              <WebsiteMonitor key={website.id} website={website} />
            ))}
          </div>
        )}

        <AddWebsiteModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onAddWebsite={handleAddWebsite}
        />
      </div>
    </div>
  );
}