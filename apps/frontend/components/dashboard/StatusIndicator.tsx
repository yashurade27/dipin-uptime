"use client";

import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  isUp: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusIndicator({ isUp, size = "md", className }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div
      className={cn(
        "rounded-full",
        sizeClasses[size],
        isUp ? "bg-green-600" : "bg-red-600",
        className
      )}
      title={isUp ? "Online" : "Offline"}
    />
  );
}