// Custom hook for case management

import { useState, useEffect, useCallback } from "react";
import { Case, CaseFilters } from "../types";
import { CaseService } from "../services/case.service";
import { toast } from "sonner";

const AUTO_REFRESH_INTERVAL = 30000; // Refresh every 30 seconds

export function useCases(filters?: CaseFilters, autoRefresh: boolean = true) {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await CaseService.getAllCases(filters);

    if (response.success && response.data) {
      setCases(response.data);
    } else {
      setError(response.error || "Failed to load cases");
      toast.error(response.error || "Failed to load cases");
    }

    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchCases();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchCases, autoRefresh]);

  const createCase = useCallback(
    async (data: Omit<Case, "id" | "createdAt" | "updatedAt">) => {
      const response = await CaseService.createCase(data);

      if (response.success) {
        toast.success("Case created successfully");
        await fetchCases();
        return response.data;
      } else {
        if (response.validationErrors && response.validationErrors.length > 0) {
          response.validationErrors.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else {
          toast.error(response.error || "Failed to create case");
        }
        throw new Error(response.error);
      }
    },
    [fetchCases],
  );

  const updateCase = useCallback(
    async (id: string, data: Partial<Case>) => {
      const response = await CaseService.updateCase(id, data);

      if (response.success) {
        toast.success("Case updated successfully");
        await fetchCases();
        return response.data;
      } else {
        if (response.validationErrors && response.validationErrors.length > 0) {
          response.validationErrors.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else {
          toast.error(response.error || "Failed to update case");
        }
        throw new Error(response.error);
      }
    },
    [fetchCases],
  );

  const deleteCase = useCallback(
    async (id: string) => {
      const response = await CaseService.deleteCase(id);

      if (response.success) {
        toast.success("Case deleted successfully");
        await fetchCases();
      } else {
        toast.error(response.error || "Failed to delete case");
        throw new Error(response.error);
      }
    },
    [fetchCases],
  );

  const refresh = useCallback(() => {
    fetchCases();
  }, [fetchCases]);

  return {
    cases,
    loading,
    error,
    createCase,
    updateCase,
    deleteCase,
    refresh,
  };
}
