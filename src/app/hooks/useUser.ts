// Custom hook for user management

import { useState, useEffect, useCallback } from "react";
import { User } from "../types";
import { ApiService } from "../services/api.service";
import { toast } from "sonner";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await ApiService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Continue with default user
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const setUserRole = useCallback(async (role: "Admin" | "Intern") => {
    try {
      const updatedUser = await ApiService.setUserRole(role);
      setUser(updatedUser);
      toast.success(`Role changed to ${role}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to change role");
    }
  }, []);

  const isAdmin = user?.role === "Admin";

  return {
    user,
    loading,
    setUserRole,
    isAdmin,
  };
}
