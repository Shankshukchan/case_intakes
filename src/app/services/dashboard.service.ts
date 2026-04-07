// Dashboard service - calculates metrics and analytics
// Uses backend API instead of localStorage

import { DashboardMetrics, ApiResponse } from "../types";
import { ApiService } from "./api.service";

export class DashboardService {
  static async getMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    try {
      const metrics = await ApiService.getDashboardSummary();
      return {
        success: true,
        data: metrics,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to calculate dashboard metrics",
      };
    }
  }
}
