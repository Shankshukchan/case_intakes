import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User.js";
import { IUser } from "../types.js";

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Authentication middleware
 * In a real app, this would verify JWT tokens.
 * For this demo, it retrieves the current user from DB.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get user ID from query/header (in real app, from JWT)
    const userId =
      (req.query.userId as string) || (req.headers["x-user-id"] as string);

    let user = null;

    // Try to find user by ID if provided
    if (userId) {
      try {
        user = await UserModel.findById(userId);
      } catch (e) {
        // Invalid ObjectId, fall through to next check
      }
    }

    // If no user found, get the first user (Admin by default from seed)
    if (!user) {
      user = await UserModel.findOne();
      if (!user) {
        user = new UserModel({
          name: "Admin User",
          email: "admin@legalops.com",
          role: "Admin",
        });
        await user.save();
      }
    }

    req.user = user.toObject();
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Authentication failed" });
  }
};

/**
 * Authorization middleware - restricts to Admin role
 */
export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user || req.user.role !== "Admin") {
    res.status(403).json({
      success: false,
      error: "Access denied. Admin role required.",
    });
    return;
  }
  next();
};

/**
 * Authorization middleware - allows both Admin and Intern
 */
export const authorize = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  next();
};
