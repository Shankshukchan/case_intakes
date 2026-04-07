import { Router, Request, Response } from "express";
import { CaseModel } from "../models/Case.js";
import { TaskModel } from "../models/Task.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

// Middleware
router.use(authenticate);

/**
 * GET /dashboard/summary
 * Get dashboard metrics
 */
router.get("/summary", authorize, async (_req: Request, res: Response) => {
  try {
    const totalActiveCases = await CaseModel.countDocuments();

    // Upcoming hearings in next 7 days
    const today = new Date();
    const sevenDaysFromNow = new Date(
      today.getTime() + 7 * 24 * 60 * 60 * 1000,
    );

    const upcomingHearings = await CaseModel.countDocuments({
      nextHearingDate: {
        $gte: today.toISOString().split("T")[0],
        $lte: sevenDaysFromNow.toISOString().split("T")[0],
      },
    });

    const pendingTasks = await TaskModel.countDocuments({ status: "Pending" });
    const completedTasks = await TaskModel.countDocuments({
      status: "Completed",
    });

    res.json({
      success: true,
      data: {
        totalActiveCases,
        upcomingHearings,
        pendingTasks,
        completedTasks,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
