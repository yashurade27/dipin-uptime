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

const API_BACKEND_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL || "http://localhost:8080";
const USE_MOCK_DATA = false; // Disable mock data to use real API

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
      console.log('Fetching websites from:', API_BACKEND_URL);
      const token = await getToken();
      console.log('Token received:', token ? 'Yes' : 'No');
      
      if (!token) {
        console.log('No token available, user might not be authenticated');
        setError("Please sign in to view your monitors");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // 10 second timeout
      });
      
      console.log('API Response:', response.data);
      setWebsites(response.data.websites || response.data || []);
      setError(null);
    } catch (err: any) {
      console.error("Full error object:", err);
      console.error("Error response:", err?.response);
      console.error("Error message:", err?.message);
      console.error("Error code:", err?.code);
      
      let errorMessage = "Failed to load websites";
      
      if (err?.code === 'ECONNREFUSED' || err?.message?.includes('Network Error')) {
        errorMessage = "Cannot connect to server. Please make sure the API server is running on port 8080.";
      } else if (err?.response?.status === 401) {
        errorMessage = "Authentication failed. Please sign in again.";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
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