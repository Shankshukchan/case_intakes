import mongoose from "mongoose";
import { CaseModel } from "../models/Case.js";
import { TaskModel } from "../models/Task.js";
import { UserModel } from "../models/User.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/case-intake";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await CaseModel.deleteMany({});
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const adminUser = new UserModel({
      name: "Admin User",
      email: "admin@legalops.com",
      role: "Admin",
    });

    const internUser = new UserModel({
      name: "Intern User",
      email: "intern@legalops.com",
      role: "Intern",
    });

    await adminUser.save();
    await internUser.save();
    console.log("Created users");

    // Create sample cases
    const today = new Date();
    const cases = await CaseModel.insertMany([
      {
        caseTitle: "Smith vs. Johnson Corp",
        clientName: "John Smith",
        courtName: "District Court of New York",
        caseType: "Commercial Dispute",
        nextHearingDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        stage: "Arguments",
        notes: "Complex commercial dispute involving contract breach",
      },
      {
        caseTitle: "Green vs. State Board",
        clientName: "Maria Green",
        courtName: "State Court of California",
        caseType: "Administrative",
        nextHearingDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        stage: "Evidence",
        notes: "Administrative law case",
      },
      {
        caseTitle: "Brown Family Trust Dispute",
        clientName: "Robert Brown",
        courtName: "Probate Court of Texas",
        caseType: "Family Law",
        nextHearingDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        stage: "Filing",
        notes: "Estate and trust distribution dispute",
      },
    ]);
    console.log("Created 3 sample cases");

    // Create sample tasks
    await TaskModel.insertMany([
      {
        caseId: cases[0]._id.toString(),
        title: "Prepare witness statements",
        dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        ownerName: "Sarah Mitchell",
        priority: "High",
        status: "Pending",
      },
      {
        caseId: cases[0]._id.toString(),
        title: "Review contract documents",
        dueDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        ownerName: "David Lee",
        priority: "High",
        status: "Completed",
      },
      {
        caseId: cases[1]._id.toString(),
        title: "File motion for summary judgment",
        dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        ownerName: "Sarah Mitchell",
        priority: "Medium",
        status: "Pending",
      },
      {
        caseId: cases[1]._id.toString(),
        title: "Obtain medical records",
        dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        ownerName: "Jessica Chen",
        priority: "High",
        status: "Pending",
      },
      {
        caseId: cases[2]._id.toString(),
        title: "Prepare discovery responses",
        dueDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        ownerName: "David Lee",
        priority: "Medium",
        status: "Pending",
      },
    ]);
    console.log("Created 5 sample tasks");

    console.log("\n✓ Database seeded successfully!");
    console.log(`\nYou can now log in with:`);
    console.log(`Admin: admin@legalops.com (role: Admin)`);
    console.log(`Intern: intern@legalops.com (role: Intern)`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
