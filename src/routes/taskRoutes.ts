import { Router } from "express";
import {
getTasks,
getTask,
createTask,
updateTask,
deleteTask,
} from "../controllers/taskController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// everything below this needs auth
router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.get("/:id", getTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
