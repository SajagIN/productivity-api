import { z } from "zod";

// validation for user registration
export const registerSchema = z.object({
  name: z
  .string()
  .min(2, "Name too short")
  .max(50),
  email: z
  .string()
  .email("Invalid email"),
  password: z
  .string()
  .min(6, "Password must be at least 6 characters"),
});

// validation for login
export const loginSchema = z.object({
  email: z
  .string()
  .email("Invalid email"),
  password: z
  .string()
  .min(6, "Password too short"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
