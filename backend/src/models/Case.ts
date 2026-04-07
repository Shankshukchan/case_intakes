import mongoose from "mongoose";
import { ICase } from "../types.js";

const caseSchema = new mongoose.Schema<ICase>(
  {
    caseTitle: {
      type: String,
      required: true,
      minlength: 3,
    },
    clientName: {
      type: String,
      required: true,
    },
    courtName: {
      type: String,
      required: true,
    },
    caseType: {
      type: String,
      required: true,
    },
    nextHearingDate: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      enum: ["Filing", "Evidence", "Arguments", "Order Reserved"],
      required: true,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

export const CaseModel = mongoose.model<ICase>("Case", caseSchema);
