"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import type { Website } from "@/types/website";

// Mock data for development - remove when connecting to real API
const mockWebsites: Website[] = [
  {
    id: "1",
    url: "https://example.com",
    name: "Example Website",
    ticks: [
      {
        id: "t1",
        status: 200,
        latency: 245,
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
      {
        id: "t2", 
        status: 200,
        latency: 189,
        createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
      },
      {
        id: "t3",
        status: 500,
        latency: 0,
        createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      },
      {
        id: "t4",
        status: 200,
        latency: 298,
        createdAt: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "2",
    url: "https://api.service.com/health",
    name: "API Health Check",
    ticks: [
      {
        id: "t5",
        status: 200,
        latency: 87,
        createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      },
      {
        id: "t6",
        status: 200,
        latency: 92,
        createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      },
      {
        id: "t7",
        status: 200,
        latency: 156,
        createdAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
      },
    ],
  },
];

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:3001";
const USE_MOCK_DATA = process.env.NODE_ENV === "development"; // Toggle this for real API

interface UseWebsitesReturn {
  websites: Website[];
  isLoading: boolean;
  error: string | null;
  addWebsite: (url: string) => Promise<void>;
  removeWebsite: (id: string) => Promise<void>;
  refreshWebsites: () => Promise<void>;
}

export function useWebsites(): UseWebsitesReturn {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchWebsites = async () => {
    if (USE_MOCK_DATA) {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWebsites(mockWebsites);
      setIsLoading(false);
      return;
    }

    try {
      const token = await getToken();
      const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setWebsites(response.data.websites || response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load websites");
      console.error("Error fetching websites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addWebsite = async (url: string) => {
    if (USE_MOCK_DATA) {
      const newWebsite: Website = {
        id: `mock-${Date.now()}`,
        url: url.trim(),
        ticks: [],
      };
      setWebsites(prev => [newWebsite, ...prev]);
      return;
    }

    const token = await getToken();
    await axios.post(
      `${API_BACKEND_URL}/api/v1/website`,
      { url: url.trim() },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // Refresh the list
    await fetchWebsites();
  };

  const removeWebsite = async (id: string) => {
    if (USE_MOCK_DATA) {
      setWebsites(prev => prev.filter(w => w.id !== id));
      return;
    }

    const token = await getToken();
    await axios.delete(`${API_BACKEND_URL}/api/v1/website/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Refresh the list
    await fetchWebsites();
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  return {
    websites,
    isLoading,
    error,
    addWebsite,
    removeWebsite,
    refreshWebsites: fetchWebsites,
  };
}