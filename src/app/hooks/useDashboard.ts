// Custom hook for dashboard metrics

import { useState, useEffect, useCallback } from "react";
import { DashboardMetrics } from "../types";
import { DashboardService } from "../services/dashboard.service";
import { toast } from "sonner";

const AUTO_REFRESH_INTERVAL = 30000; // Refresh every 30 seconds

export function useDashboard(autoRefresh: boolean = true) {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalActiveCases: 0,
    upcomingHearings: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await DashboardService.getMetrics();

    if (response.success && response.data) {
      setMetrics(response.data);
    } else {
      setError(response.error || "Failed to load dashboard metrics");
      toast.error(response.error || "Failed to load dashboard metrics");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchMetrics();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchMetrics, autoRefresh]);

  const refresh = useCallback(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refresh,
  };
}
