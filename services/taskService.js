import cron from "node-cron";
import Task from "../models/taskSchema.js";
import sgMail from "@sendgrid/mail"; // official SendGrid Node.js package

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Run every 10 minutes to check for upcoming reminders
export const reminderTaskJob = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const now = new Date();

      // Find tasks whose reminder time is due
      const tasksToRemind = await Task.find({
        reminderAt: { $lte: now, $exists: true },
        status: { $ne: "completed" },
      }).populate("user");

      for (const task of tasksToRemind) {
        if (!task.user?.email) continue; // skip if user email missing

        // Send email via SendGrid
        const msg = {
          to: task.user.email,
          from: process.env.SENDGRID_SENDER_EMAIL, 
          subject: `Reminder: "${task.title}" is coming up`,
          text: `Hi ${task.user.username},\n\nYour task "${task.title}" is due at ${task.dueDate}.`,
        };

        await sgMail.send(msg);

        // Remove reminder so it won't send again
        task.reminderAt = undefined;

        await task.save();
      }
    } catch (err) {
      console.error("Error sending task reminders:", err);
    }
  });
};

