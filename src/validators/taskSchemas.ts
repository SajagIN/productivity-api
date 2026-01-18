import { z } from "zod";
import { Priority, Status } from "../models/task";

// schema for creating a new task
export const createTaskSchema = z.object({
    title: z
    .string()
    .min(1, "Title is required")
    .max(200),
    description: z
    .string()
    .max(1000)
    .optional(),
    priority: z
    .nativeEnum(Priority)
    .optional(),
    status: z
    .nativeEnum(Status)
    .optional(),
    // deadline comes in as a string, will be parsed to Date later
    deadline: z
    .string()
    .optional(),
    tags: z
    .array(z.string())
    .optional(),
});

// schema for updating an existing task
export const updateTaskSchema = z.object({
    title: z
    .string()
    .min(1)
    .max(200)
    .optional(),
    description: z
    .string()
    .max(1000)
    .optional(),
    priority: z
    .nativeEnum(Priority)
    .optional(),
    status: z
    .nativeEnum(Status)
    .optional(),
    deadline: z
    .string()
    .optional(),
    tags: z
    .array(z.string())
    .optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
