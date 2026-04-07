// Validation service - simulates backend validation

import { Case, HearingTask, ValidationError } from "../types";

export class ValidationService {
  static validateCase(data: Partial<Case>): ValidationError[] {
    const errors: ValidationError[] = [];

    // caseTitle validation
    if (!data.caseTitle || data.caseTitle.trim().length === 0) {
      errors.push({
        field: "caseTitle",
        message: "Case title is required",
      });
    } else if (data.caseTitle.trim().length < 3) {
      errors.push({
        field: "caseTitle",
        message: "Case title must be at least 3 characters",
      });
    }

    // clientName validation
    if (!data.clientName || data.clientName.trim().length === 0) {
      errors.push({
        field: "clientName",
        message: "Client name is required",
      });
    }

    // courtName validation
    if (!data.courtName || data.courtName.trim().length === 0) {
      errors.push({
        field: "courtName",
        message: "Court name is required",
      });
    }

    // caseType validation
    if (!data.caseType || data.caseType.trim().length === 0) {
      errors.push({
        field: "caseType",
        message: "Case type is required",
      });
    }

    // nextHearingDate validation
    if (!data.nextHearingDate) {
      errors.push({
        field: "nextHearingDate",
        message: "Next hearing date is required",
      });
    } else {
      const hearingDate = new Date(data.nextHearingDate);
      if (isNaN(hearingDate.getTime())) {
        errors.push({
          field: "nextHearingDate",
          message: "Invalid date format",
        });
      }
    }

    // stage validation
    if (!data.stage) {
      errors.push({
        field: "stage",
        message: "Stage is required",
      });
    }

    // notes validation (optional but with max length)
    if (data.notes && data.notes.length > 1000) {
      errors.push({
        field: "notes",
        message: "Notes cannot exceed 1000 characters",
      });
    }

    return errors;
  }

  static validateTask(data: Partial<HearingTask>): ValidationError[] {
    const errors: ValidationError[] = [];

    // title validation
    if (!data.title || data.title.trim().length === 0) {
      errors.push({
        field: "title",
        message: "Task title is required",
      });
    }

    // dueDate validation
    if (!data.dueDate) {
      errors.push({
        field: "dueDate",
        message: "Due date is required",
      });
    } else {
      const dueDate = new Date(data.dueDate);
      if (isNaN(dueDate.getTime())) {
        errors.push({
          field: "dueDate",
          message: "Invalid date format",
        });
      }
    }

    // ownerName validation
    if (!data.ownerName || data.ownerName.trim().length === 0) {
      errors.push({
        field: "ownerName",
        message: "Owner name is required",
      });
    }

    // priority validation
    if (!data.priority) {
      errors.push({
        field: "priority",
        message: "Priority is required",
      });
    }

    // caseId validation
    if (!data.caseId) {
      errors.push({
        field: "caseId",
        message: "Task must be associated with a case",
      });
    }

    return errors;
  }
}
