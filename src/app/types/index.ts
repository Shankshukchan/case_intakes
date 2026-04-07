// Core data types for the legal case management system

export type CaseStage = 
  | "Filing" 
  | "Evidence" 
  | "Arguments" 
  | "Order Reserved";

export type TaskPriority = "Low" | "Medium" | "High";

export type TaskStatus = "Pending" | "Completed";

export type UserRole = "Admin" | "Intern";

export interface Case {
  id: string;
  caseTitle: string;
  clientName: string;
  courtName: string;
  caseType: string;
  nextHearingDate: string; // ISO date string
  stage: CaseStage;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HearingTask {
  id: string;
  caseId: string;
  title: string;
  dueDate: string; // ISO date string
  ownerName: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface DashboardMetrics {
  totalActiveCases: number;
  upcomingHearings: number; // next 7 days
  pendingTasks: number;
  completedTasks: number;
}

export interface CaseFilters {
  searchQuery?: string; // searches caseTitle and clientName
  stage?: CaseStage;
  dateFrom?: string;
  dateTo?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: ValidationError[];
}
