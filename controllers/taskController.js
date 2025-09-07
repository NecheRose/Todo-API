import Task from "../models/taskSchema.js";
import Category from "../models/categorySchema.js";



// Create Task
export const createTasks = async (req, res) => {
  try {
    const { title, description, category, priority, dueDate, reminderBefore, status } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    // Check free plan limit(For scalability when payment gateway is integrated)
    const taskCount = await Task.countDocuments({ user: userId });
    if (req.user.plan === "free" && taskCount >= 5) {
      return res.status(403).json({
        message: "You have reached the free plan limit. Upgrade to add more tasks.",
      });
    }

    // Validate category existence
    if (category) {
      const categoryExists = await Category.findOne({ 
        _id: category, 
        $or: [{ user: userId }, { user: null }]  // allow system or user-owned 
      })
       
      if (!categoryExists) {
        return res.status(400).json({ message: "Cateory not found" });
      }
    }

    let parsedDueDate = null;
    let reminderAt = null;

    //  Validate dueDate
    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ message: "Invalid due date format" });
      }
      parsedDueDate = parsedDate;

      // Calculate reminder
      const reminderMinutes = reminderBefore ?? 60;
      reminderAt = new Date(parsedDate.getTime() - reminderMinutes * 60000);
    }

    const task = new Task({
      user: userId,
      title,
      description,
      category,
      priority,
      status: status || "incomplete",
      dueDate: parsedDueDate,
      reminderBefore: reminderBefore ?? 60,
      reminderAt,
    });

    await task.save();

    // Populate category name for response
    const populatedTask = await Task.findById(task._id).populate("category", "name");

    return res.status(201).json({
      message: "Task created successfully",
      task: {
        _id: populatedTask._id,
        title: populatedTask.title,
        description: populatedTask.description,
        category: populatedTask.category,
        priority: populatedTask.priority,
        status: populatedTask.status,
        dueDate: populatedTask.dueDate,
        reminderBefore: populatedTask.reminderBefore
      },
    });
  } catch (err) {
    console.error("Error creating task:", err);
    return res.status(500).json({ message: "Error creating task", error: err.message });
  }
};

// Mark task as completed/complete
export const toggleTaskStatus = async (req, res) => {
  try {
    const userId = req.user._id; 
    const taskId = req.params.id;

    // Find the task and ensure it belongs to the user
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Toggle between complete and incomplete
    if (task.status === "completed") {
      task.status = "incomplete";
      await task.save();
      return res.status(200).json({ message: "Task marked as incomplete", task });
    } else {
      task.status = "completed";
      await task.save();
      return res.status(200).json({ message: "Task marked as complete", task });
    };
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

// Get all tasks (with filters)
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { priority, status } = req.query;

    const filter = { user: userId };

    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const tasks = await Task.find(filter).populate("category").sort({ dueDate: 1 });

    return res.status(200).json({ tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

// Get one task
export const getOneTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({ _id: id, user: userId }).populate("category");

    if (!task) return res.status(404).json({ message: "Task not found" });

    return res.status(200).json({ task });
  } catch (err) {
    console.error("Error fetching task:", err);
    return res.status(500).json({ message: "Error fetching task", error: err.message });
  }
};

// Update task
export const updateTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, category, priority, status, dueDate, reminderBefore } = req.body;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Partial updates
    if (title) task.title = title;
    if (description) task.description = description;
    if (category) task.category = category;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (dueDate || reminderBefore) {
      const reminderMinutes = reminderBefore ?? task.reminderBefore ?? 60;
      task.reminderBefore = reminderMinutes;
      task.reminderAt = new Date(task.dueDate.getTime() - reminderMinutes * 60 * 1000);
    }

    await task.save();

    return res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    console.error("Error updating task:", err);
    return res.status(500).json({ message: "Error updating task", error: err.message });
  }
};

// Soft delete task
export const deleteTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    return res.status(200).json({ message: "Task soft deleted", task });
  } catch (err) {
    console.error("Error deleting task:", err);
    return res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};

// Restore task
export const restoreTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Free plan limit check before restoring
    if (req.user.plan === "free") {
      const activeCount = await Task.countDocuments({
        user: userId,
        deletedAt: null, // only active tasks
      });

      if (activeCount >= 5) {
        return res.status(403).json({
          message: "Free plan limit reached. Upgrade to restore more tasks.",
        });
      }
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId, deletedAt: { $ne: null } },
      { $set: { deletedAt: null } },
      { new: true }
    );

    if (!task) { 
      return res.status(404).json({ message: "Task not found or not deleted" });
    };

    return res.status(200).json({ message: "Task restored successfully", task });
  } catch (err) {
    console.error("Error restoring task:", err);
    return res.status(500).json({ message: "Error restoring task", error: err.message });
  }
};

// Get tasks by status
export const getTasksByStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query; 

    // Validate status
    if (!["incomplete", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'incomplete' or 'completed'" });
    }

    const tasks = await Task.find({
      user: userId,
      status
    }).populate("category");

    return res.status(200).json({ tasks });
  } catch (err) {
    console.error("Error fetching tasks by status:", err);
    return res.status(500).json({ message: "Error fetching tasks by status", error: err.message });
  }
};


  