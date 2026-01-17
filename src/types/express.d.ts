import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

// extending express request to attach user info from auth middleware
// this keeps req.user typed across the app