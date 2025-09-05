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
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Status Dashboard
            </h1>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Monitor
          </Button>
        </div>

        {/* Stats */}
        {websites.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-black dark:text-white">{totalSites}</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Online</p>
              <p className="text-xl font-bold text-black dark:text-white">{onlineSites}</p>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Uptime</p>
              <p className="text-xl font-bold text-black dark:text-white">{avgUptime.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Monitors */}
        {websites.length === 0 ? (
          <div className="border border-gray-200 dark:border-gray-800 rounded-md p-8 text-center">
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">
              No monitors yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add your first website to start monitoring
            </p>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Website
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
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