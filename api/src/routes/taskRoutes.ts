import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";

import {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
} from "../controllers/taskController";

const router = Router();

// Protect all task routes
router.use(authenticateToken);

// Create a task
router.post("/", createTask);

// Get all tasks
router.get("/", getAllTasks);

// Update a task
router.patch("/:taskId", updateTask);

// Delete a task
router.delete("/:taskId", deleteTask);

export default router;