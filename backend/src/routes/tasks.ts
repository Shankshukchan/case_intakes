import { Router, Request, Response } from "express";
import { TaskModel } from "../models/Task.js";
import { validateTask } from "../utils/validation.js";
import { authenticate, authorize, adminOnly } from "../middleware/auth.js";

const router = Router();

// Middleware
router.use(authenticate);

/**
 * GET /tasks
 * Retrieve all tasks for a specific case
 */
router.get("/", authorize, async (req: Request, res: Response) => {
  try {
    const { caseId } = req.query;

    let query: any = {};
    if (caseId) {
      query.caseId = caseId;
    }

    const tasks = await TaskModel.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks.map((t) => ({
        id: t._id,
        ...t.toObject(),
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /tasks/case/:caseId
 * Retrieve all tasks for a specific case
 */
router.get("/case/:caseId", authorize, async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.find({ caseId: req.params.caseId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: tasks.map((t) => ({
        id: t._id,
        ...t.toObject(),
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /tasks
 * Create a new task for a case
 */
router.post("/", authorize, async (req: Request, res: Response) => {
  try {
    const validation = validateTask(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        validationErrors: validation.errors,
      });
    }

    const newTask = new TaskModel(req.body);
    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      data: {
        id: savedTask._id,
        ...savedTask.toObject(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /tasks/:id
 * Update a task
 */
router.put("/:id", authorize, async (req: Request, res: Response) => {
  try {
    const validation = validateTask(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        validationErrors: validation.errors,
      });
    }

    const task = await TaskModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    res.json({
      success: true,
      data: {
        id: task._id,
        ...task.toObject(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /tasks/:id/status
 * Update task status (Pending/Completed)
 */
router.patch("/:id/status", authorize, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be 'Pending' or 'Completed'",
      });
    }

    const task = await TaskModel.findByIdAndUpdate(
      req.params.id,
      {
        status,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    res.json({
      success: true,
      data: {
        id: task._id,
        ...task.toObject(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /tasks/:id
 * Delete a task (admin only)
 */
router.delete("/:id", adminOnly, async (req: Request, res: Response) => {
  try {
    const task = await TaskModel.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    res.json({
      success: true,
      data: { message: "Task deleted successfully" },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
