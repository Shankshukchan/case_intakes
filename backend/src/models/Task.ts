import mongoose from "mongoose";
import { IHearingTask } from "../types.js";

const taskSchema = new mongoose.Schema<IHearingTask>(
  {
    caseId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const TaskModel = mongoose.model<IHearingTask>("Task", taskSchema);
