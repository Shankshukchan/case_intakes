// API service for backend communication
// Replaces localStorage with real API calls

import { Case, HearingTask, User, CaseFilters } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Store current user ID in session storage
const USER_ID_KEY = "current_user_id";

export class ApiService {
  private static getCurrentUserId(): string | null {
    return sessionStorage.getItem(USER_ID_KEY);
  }

  private static setCurrentUserId(userId: string) {
    sessionStorage.setItem(USER_ID_KEY, userId);
  }

  private static getHeaders(): HeadersInit {
    const userId = this.getCurrentUserId();
    return {
      "Content-Type": "application/json",
      ...(userId && { "X-User-Id": userId }),
    };
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        success: false,
        error: `HTTP ${response.status}`,
      }));
      throw new Error(error.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  }

  // Cases
  static async getCases(filters?: CaseFilters): Promise<Case[]> {
    const params = new URLSearchParams();
    if (filters?.searchQuery) params.append("searchQuery", filters.searchQuery);
    if (filters?.stage) params.append("stage", filters.stage);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);

    const queryString = params.toString();
    const endpoint = `/cases${queryString ? `?${queryString}` : ""}`;

    return this.request<Case[]>(endpoint);
  }

  static async getCase(id: string): Promise<Case | null> {
    try {
      return await this.request<Case>(`/cases/${id}`);
    } catch {
      return null;
    }
  }

  static async createCase(
    data: Omit<Case, "id" | "createdAt" | "updatedAt">,
  ): Promise<Case> {
    return this.request<Case>("/cases", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateCase(id: string, data: Partial<Case>): Promise<Case> {
    return this.request<Case>(`/cases/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteCase(id: string): Promise<void> {
    await this.request(`/cases/${id}`, { method: "DELETE" });
  }

  // Tasks
  static async getTasks(caseId?: string): Promise<HearingTask[]> {
    const endpoint = caseId ? `/tasks/case/${caseId}` : "/tasks";
    return this.request<HearingTask[]>(endpoint);
  }

  static async getTasksByCase(caseId: string): Promise<HearingTask[]> {
    return this.getTasks(caseId);
  }

  static async createTask(
    data: Omit<HearingTask, "id" | "createdAt" | "updatedAt">,
  ): Promise<HearingTask> {
    return this.request<HearingTask>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateTask(
    id: string,
    data: Partial<HearingTask>,
  ): Promise<HearingTask> {
    return this.request<HearingTask>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async updateTaskStatus(
    id: string,
    status: "Pending" | "Completed",
  ): Promise<HearingTask> {
    return this.request<HearingTask>(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  static async deleteTask(id: string): Promise<void> {
    await this.request(`/tasks/${id}`, { method: "DELETE" });
  }

  // Dashboard
  static async getDashboardSummary() {
    return this.request<any>("/dashboard/summary");
  }

  // User
  static async getCurrentUser(): Promise<User> {
    try {
      const user = await this.request<User>("/users/current");
      if (user.id) {
        this.setCurrentUserId(user.id);
      }
      return user;
    } catch (error) {
      // If request fails, return a default user
      const defaultUser: User = {
        id: "default_admin",
        name: "Admin User",
        email: "admin@legalops.com",
        role: "Admin",
      };
      this.setCurrentUserId(defaultUser.id);
      return defaultUser;
    }
  }

  static async setUserRole(role: "Admin" | "Intern"): Promise<User> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    return this.request<User>("/users/switch-role", {
      method: "POST",
      body: JSON.stringify({ role }),
    });
  }

  static async clearAll(): Promise<void> {
    // In a real app, this would clear the backend session
    // For now, we just clear the local user ID
    sessionStorage.removeItem(USER_ID_KEY);
  }
}
