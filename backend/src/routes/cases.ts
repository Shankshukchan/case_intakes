import { Router, Request, Response } from "express";
import { CaseModel } from "../models/Case.js";
import { TaskModel } from "../models/Task.js";
import { validateCase } from "../utils/validation.js";
import { authenticate, authorize, adminOnly } from "../middleware/auth.js";

const router = Router();

// Middleware
router.use(authenticate);

/**
 * GET /cases
 * Retrieve all cases with optional search and filtering
 */
router.get("/", authorize, async (req: Request, res: Response) => {
  try {
    const { searchQuery, stage, dateFrom, dateTo } = req.query;

    let query: any = {};

    // Search by case title or client name
    if (searchQuery) {
      query.$or = [
        { caseTitle: { $regex: searchQuery, $options: "i" } },
        { clientName: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Filter by stage
    if (stage) {
      query.stage = stage;
    }

    // Filter by hearing date range
    if (dateFrom || dateTo) {
      query.nextHearingDate = {};
      if (dateFrom) {
        query.nextHearingDate.$gte = dateFrom;
      }
      if (dateTo) {
        query.nextHearingDate.$lte = dateTo;
      }
    }

    const cases = await CaseModel.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: cases.map((c) => ({
        id: c._id,
        ...c.toObject(),
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /cases/:id
 * Retrieve a specific case
 */
router.get("/:id", authorize, async (req: Request, res: Response) => {
  try {
    const caseRecord = await CaseModel.findById(req.params.id);

    if (!caseRecord) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }

    res.json({
      success: true,
      data: {
        id: caseRecord._id,
        ...caseRecord.toObject(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /cases
 * Create a new case
 */
router.post("/", authorize, async (req: Request, res: Response) => {
  try {
    const validation = validateCase(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        validationErrors: validation.errors,
      });
    }

    const newCase = new CaseModel(req.body);
    const savedCase = await newCase.save();

    res.status(201).json({
      success: true,
      data: {
        id: savedCase._id,
        ...savedCase.toObject(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /cases/:id
 * Update a case
 */
router.put("/:id", authorize, async (req: Request, res: Response) => {
  try {
    const validation = validateCase(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        validationErrors: validation.errors,
      });
    }

    const caseRecord = await CaseModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!caseRecord) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }

    res.json({
      success: true,
      data: {
        id: caseRecord._id,
        ...caseRecord.toObject(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /cases/:id
 * Delete a case (admin only)
 * Cascade deletes associated tasks
 */
router.delete("/:id", adminOnly, async (req: Request, res: Response) => {
  try {
    const caseRecord = await CaseModel.findByIdAndDelete(req.params.id);

    if (!caseRecord) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }

    // Delete all associated tasks
    await TaskModel.deleteMany({ caseId: req.params.id });

    res.json({
      success: true,
      data: { message: "Case and associated tasks deleted successfully" },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
