import type { Request, Response } from "express";
import User from "../models/user";
import { registerSchema, loginSchema } from "../validators/authSchemas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is missing in .env");
}

// helper for creating auth tokens
// keeping it here for now instead of a utils folder
const createToken = (userId: string) => {
  return jwt.sign(
    { userId },
    jwtSecret,
    { expiresIn: "7d" }
  );
};

export const register = async (req: Request, res: Response) => {
  const parsedBody = registerSchema.safeParse(req.body);
  
  if (!parsedBody.success) {
    return res.status(400).json({
      error: "Invalid input",
      details: parsedBody.error.issues.map(err => ({
        path: err.path[0],
        message: err.message,
      })),
    });
  }
  
  const { name, email, password } = parsedBody.data;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already taken" });
  }
  
  const hashedPassword = await bcrypt.hash(password, 12);
  
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  
  const token = createToken(user._id.toString());
  
  res.status(201).json({
    message: "Registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const parsedBody = loginSchema.safeParse(req.body);
  
  if (!parsedBody.success) {
    return res.status(400).json({
      error: "Invalid email or password",
    });
  }
  
  const { email, password } = parsedBody.data;
  
  const user = await User.findOne({ email }).select("+password");
  
  const isValidPassword =
  user && (await bcrypt.compare(password, user.password));
  
  if (!user || !isValidPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  const token = createToken(user._id.toString());
  
  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
