import { Router } from "express";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// simple test route to make sure auth middleware works
router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user!.userId,
  });
});

export default router;
