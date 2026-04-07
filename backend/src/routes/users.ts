import { Router, Request, Response } from "express";
import { UserModel } from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

/**
 * GET /users/current
 * Get the current user
 */
router.get("/current", authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, error: "Not authenticated" });
    }

    res.json({
      success: true,
      data: {
        id: req.user._id,
        ...req.user,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /users/switch-role
 * Switch user role (for testing purposes - Admin only)
 */
router.post(
  "/switch-role",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { role } = req.body;

      if (!["Admin", "Intern"].includes(role)) {
        return res.status(400).json({
          success: false,
          error: "Invalid role. Must be 'Admin' or 'Intern'",
        });
      }

      if (!req.user || !req.user._id) {
        return res
          .status(401)
          .json({ success: false, error: "Not authenticated" });
      }

      const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { role },
        { new: true },
      );

      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }

      res.json({
        success: true,
        data: {
          id: user._id,
          ...user.toObject(),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
);

export default router;
