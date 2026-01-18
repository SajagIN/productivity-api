import type { Request, Response } from "express";
import mongoose from "mongoose";
import Task  from "../models/task";
import type { ITask } from "../models/task";
import { createTaskSchema, updateTaskSchema } from "../validators/taskSchemas";

export const getTasks = async (req: Request, res: Response) => {
try {
const tasks = await Task.find({ userId: req.user!.userId })
.sort({ createdAt: -1 })
.lean();

res.json({ tasks });

} catch (error) {
res.status(500).json({ error: "Failed to fetch tasks" });
}
};

export const getTask = async (req: Request, res: Response) => {
try {
const task = await Task.findOne({
_id: req.params.id,
userId: req.user!.userId,
}).lean();

if (!task) {
  return res.status(404).json({ error: "Task not found" });
}

res.json({ task });

} catch (error) {
res.status(500).json({ error: "Failed to fetch task" });
}
};

export const createTask = async (req: Request, res: Response) => {
try {
const parsedBody = createTaskSchema.safeParse(req.body);

if (!parsedBody.success) {
  return res.status(400).json({
    error: "Invalid input",
    details: parsedBody.error.issues.map(err => err.message),
  });
}

const data = parsedBody.data;

const taskData: Omit<ITask, 'deadline'> & { deadline?: Date } = {
  ...data,
  userId: new mongoose.Types.ObjectId(req.user!.userId),
} as Omit<ITask, 'deadline'> & { deadline?: Date }; // Cast to satisfy type checker

if (data.deadline) {
  taskData.deadline = new Date(data.deadline);
}

const createdTask = await Task.create(taskData);
const task = await Task.findById(createdTask._id).lean();

res.status(201).json({
  message: "Task created successfully",
  task,
});

} catch (error) {
res.status(500).json({ error: "Failed to create task" });
}
};

export const updateTask = async (req: Request, res: Response) => {
try {
const parsedBody = updateTaskSchema.safeParse(req.body);

if (!parsedBody.success) {
  return res.status(400).json({
    error: "Invalid input",
    details: parsedBody.error.issues.map(err => err.message),
  });
}

const updateData: any = {
  ...parsedBody.data,
};

if (parsedBody.data.deadline) {
  updateData.deadline = new Date(parsedBody.data.deadline);
}

const task = await Task.findOneAndUpdate(
  { _id: req.params.id, userId: req.user!.userId },
  updateData,
  { new: true, runValidators: true }
).lean();

if (!task) {
  return res.status(404).json({ error: "Task not found" });
}

res.json({
  message: "Task updated successfully",
  task,
});

} catch (error) {
res.status(500).json({ error: "Failed to update task" });
}
};

export const deleteTask = async (req: Request, res: Response) => {
try {
const task = await Task.findOneAndDelete({
_id: req.params.id,
userId: req.user!.userId,
}).lean();

if (!task) {
  return res.status(404).json({ error: "Task not found" });
}

res.json({ message: "Task deleted successfully" });

} catch (error) {
res.status(500).json({ error: "Failed to delete task" });
}
};
