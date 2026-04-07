// Task service - handles hearing task CRUD operations
// Uses backend API instead of localStorage

import { HearingTask, ApiResponse } from "../types";
import { ApiService } from "./api.service";

export class TaskService {
  static async getTasksByCase(
    caseId: string,
  ): Promise<ApiResponse<HearingTask[]>> {
    try {
      const tasks = await ApiService.getTasksByCase(caseId);
      return {
        success: true,
        data: tasks,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch tasks",
      };
    }
  }

  static async getAllTasks(): Promise<ApiResponse<HearingTask[]>> {
    try {
      const tasks = await ApiService.getTasks();
      return {
        success: true,
        data: tasks,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch tasks",
      };
    }
  }

  static async createTask(
    data: Omit<HearingTask, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<HearingTask>> {
    try {
      const newTask = await ApiService.createTask(data);
      return {
        success: true,
        data: newTask,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to create task",
      };
    }
  }

  static async updateTask(
    id: string,
    data: Partial<HearingTask>,
  ): Promise<ApiResponse<HearingTask>> {
    try {
      const updatedTask = await ApiService.updateTask(id, data);
      return {
        success: true,
        data: updatedTask,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to update task",
      };
    }
  }

  static async toggleTaskStatus(id: string): Promise<ApiResponse<HearingTask>> {
    try {
      // First fetch the task to get current status
      const tasks = await ApiService.getTasks();
      const task = tasks.find((t) => t.id === id);

      if (!task) {
        return {
          success: false,
          error: "Task not found",
        };
      }

      const newStatus = task.status === "Pending" ? "Completed" : "Pending";
      const updatedTask = await ApiService.updateTaskStatus(id, newStatus);

      return {
        success: true,
        data: updatedTask,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to toggle task status",
      };
    }
  }

  static async deleteTask(id: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.deleteTask(id);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to delete task",
      };
    }
  }
}
