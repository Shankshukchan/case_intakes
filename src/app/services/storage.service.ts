// LocalStorage service for data persistence
// Simulates a database with async operations

import { Case, HearingTask, User } from "../types";

const STORAGE_KEYS = {
  CASES: "legal_cases",
  TASKS: "hearing_tasks",
  USER: "current_user",
} as const;

// Simulate network delay for realistic async behavior
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export class StorageService {
  // Cases
  static async getCases(): Promise<Case[]> {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.CASES);
    return data ? JSON.parse(data) : [];
  }

  static async saveCases(cases: Case[]): Promise<void> {
    await delay();
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  }

  static async getCase(id: string): Promise<Case | null> {
    const cases = await this.getCases();
    return cases.find(c => c.id === id) || null;
  }

  // Tasks
  static async getTasks(): Promise<HearingTask[]> {
    await delay();
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  }

  static async saveTasks(tasks: HearingTask[]): Promise<void> {
    await delay();
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  static async getTasksByCase(caseId: string): Promise<HearingTask[]> {
    const tasks = await this.getTasks();
    return tasks.filter(t => t.caseId === caseId);
  }

  // User
  static async getCurrentUser(): Promise<User> {
    await delay(50);
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) {
      return JSON.parse(data);
    }
    
    // Default user (Admin)
    const defaultUser: User = {
      id: "user_1",
      name: "Admin User",
      email: "admin@legalops.com",
      role: "Admin",
    };
    
    await this.saveCurrentUser(defaultUser);
    return defaultUser;
  }

  static async saveCurrentUser(user: User): Promise<void> {
    await delay(50);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static async setUserRole(role: "Admin" | "Intern"): Promise<User> {
    const user = await this.getCurrentUser();
    user.role = role;
    await this.saveCurrentUser(user);
    return user;
  }

  // Utility
  static async clearAll(): Promise<void> {
    await delay();
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
  }
}
