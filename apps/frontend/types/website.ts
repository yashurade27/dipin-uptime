export type Tick = {
  id: string;
  status: number;
  createdAt: string; // ISO string
  latency: number; // in milliseconds
};

export type Website = {
  id: string;
  url: string;
  name?: string;
  ticks: Tick[];
  createdAt?: string;
  updatedAt?: string;
};

export type UptimeStats = {
  uptime: number; // percentage
  totalTicks: number;
  successfulTicks: number;
  averageLatency: number;
};