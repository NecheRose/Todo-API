import cron from "node-cron";
import Task from "../models/Task.js";

export const startOverdueTaskJob = () => {
  cron.schedule("0 * * * *", async () => { // runs every hour
    await Task.updateMany(
      { dueDate: { $lt: new Date() }, status: { $ne: "completed" } },
      { $set: { status: "overdue" } }
    );
    console.log("✅ Overdue task job ran");
  });
};
