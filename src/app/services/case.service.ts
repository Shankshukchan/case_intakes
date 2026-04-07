// Case service - handles case CRUD operations with validation
// Uses backend API instead of localStorage

import { Case, CaseFilters, ApiResponse } from "../types";
import { ApiService } from "./api.service";

export class CaseService {
  static async getAllCases(
    filters?: CaseFilters,
  ): Promise<ApiResponse<Case[]>> {
    try {
      const cases = await ApiService.getCases(filters);
      return {
        success: true,
        data: cases,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch cases",
      };
    }
  }

  static async getCase(id: string): Promise<ApiResponse<Case>> {
    try {
      const caseData = await ApiService.getCase(id);

      if (!caseData) {
        return {
          success: false,
          error: "Case not found",
        };
      }

      return {
        success: true,
        data: caseData,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch case",
      };
    }
  }

  static async createCase(
    data: Omit<Case, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<Case>> {
    try {
      const newCase = await ApiService.createCase(data);
      return {
        success: true,
        data: newCase,
      };
    } catch (error: any) {
      // Parse validation errors from error message
      const errorMessage = error.message || "Failed to create case";
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  static async updateCase(
    id: string,
    data: Partial<Case>,
  ): Promise<ApiResponse<Case>> {
    try {
      const updatedCase = await ApiService.updateCase(id, data);
      return {
        success: true,
        data: updatedCase,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to update case",
      };
    }
  }

  static async deleteCase(id: string): Promise<ApiResponse<void>> {
    try {
      await ApiService.deleteCase(id);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to delete case",
      };
    }
  }
}
