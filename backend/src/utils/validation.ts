import { ValidationError } from "../types.js";

export const validateCase = (
  data: any,
): { valid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!data.caseTitle || data.caseTitle.length < 3) {
    errors.push({
      field: "caseTitle",
      message: "Case title is required and must be at least 3 characters",
    });
  }

  if (!data.clientName) {
    errors.push({ field: "clientName", message: "Client name is required" });
  }

  if (!data.courtName) {
    errors.push({ field: "courtName", message: "Court name is required" });
  }

  if (!data.caseType) {
    errors.push({ field: "caseType", message: "Case type is required" });
  }

  if (!data.nextHearingDate) {
    errors.push({
      field: "nextHearingDate",
      message: "Next hearing date is required",
    });
  }

  if (
    !data.stage ||
    !["Filing", "Evidence", "Arguments", "Order Reserved"].includes(data.stage)
  ) {
    errors.push({ field: "stage", message: "Valid stage is required" });
  }

  if (data.notes && data.notes.length > 1000) {
    errors.push({
      field: "notes",
      message: "Notes must not exceed 1000 characters",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateTask = (
  data: any,
): { valid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  if (!data.caseId) {
    errors.push({ field: "caseId", message: "Case ID is required" });
  }

  if (!data.title) {
    errors.push({ field: "title", message: "Task title is required" });
  }

  if (!data.dueDate) {
    errors.push({ field: "dueDate", message: "Due date is required" });
  }

  if (!data.ownerName) {
    errors.push({ field: "ownerName", message: "Owner name is required" });
  }

  if (!data.priority || !["Low", "Medium", "High"].includes(data.priority)) {
    errors.push({
      field: "priority",
      message: "Valid priority is required (Low, Medium, High)",
    });
  }

  if (!data.status || !["Pending", "Completed"].includes(data.status)) {
    errors.push({
      field: "status",
      message: "Valid status is required (Pending, Completed)",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
