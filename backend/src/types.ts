// Backend types matching frontend types
export type CaseStage = "Filing" | "Evidence" | "Arguments" | "Order Reserved";

export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "Pending" | "Completed";
export type UserRole = "Admin" | "Intern";

export interface ICase {
  _id?: string;
  caseTitle: string;
  clientName: string;
  courtName: string;
  caseType: string;
  nextHearingDate: string;
  stage: CaseStage;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHearingTask {
  _id?: string;
  caseId: string;
  title: string;
  dueDate: string;
  ownerName: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
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
