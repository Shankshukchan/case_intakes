// Custom hook for task management

import { useState, useEffect, useCallback } from "react";
import { HearingTask } from "../types";
import { TaskService } from "../services/task.service";
import { toast } from "sonner";

const AUTO_REFRESH_INTERVAL = 30000; // Refresh every 30 seconds

export function useTasks(caseId?: string, autoRefresh: boolean = true) {
  const [tasks, setTasks] = useState<HearingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = caseId
      ? await TaskService.getTasksByCase(caseId)
      : await TaskService.getAllTasks();

    if (response.success && response.data) {
      setTasks(response.data);
    } else {
      setError(response.error || "Failed to load tasks");
      toast.error(response.error || "Failed to load tasks");
    }

    setLoading(false);
  }, [caseId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTasks();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchTasks, autoRefresh]);

  const createTask = useCallback(
    async (data: Omit<HearingTask, "id" | "createdAt" | "updatedAt">) => {
      const response = await TaskService.createTask(data);

      if (response.success) {
        toast.success("Task created successfully");
        await fetchTasks();
        return response.data;
      } else {
        if (response.validationErrors && response.validationErrors.length > 0) {
          response.validationErrors.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else {
          toast.error(response.error || "Failed to create task");
        }
        throw new Error(response.error);
      }
    },
    [fetchTasks],
  );

  const updateTask = useCallback(
    async (id: string, data: Partial<HearingTask>) => {
      const response = await TaskService.updateTask(id, data);

      if (response.success) {
        toast.success("Task updated successfully");
        await fetchTasks();
        return response.data;
      } else {
        if (response.validationErrors && response.validationErrors.length > 0) {
          response.validationErrors.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else {
          toast.error(response.error || "Failed to update task");
        }
        throw new Error(response.error);
      }
    },
    [fetchTasks],
  );

  const toggleTaskStatus = useCallback(
    async (id: string) => {
      const response = await TaskService.toggleTaskStatus(id);

      if (response.success) {
        await fetchTasks();
        return response.data;
      } else {
        toast.error(response.error || "Failed to toggle task status");
        throw new Error(response.error);
      }
    },
    [fetchTasks],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const response = await TaskService.deleteTask(id);

      if (response.success) {
        toast.success("Task deleted successfully");
        await fetchTasks();
      } else {
        toast.error(response.error || "Failed to delete task");
        throw new Error(response.error);
      }
    },
    [fetchTasks],
  );

  const refresh = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    refresh,
  };
}
