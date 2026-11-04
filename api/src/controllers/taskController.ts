
import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as taskService from "../services/taskService";
import {
    BACKEND_PRIORITIES,
    BACKEND_STATUSES,
} from "../types/Task";


export async function createTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const {
            dueDate,
            priority,
            status,
            ...taskData
        } = req.body;

        // 1. Validate priority
        if (!BACKEND_PRIORITIES.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "Invalid priority",
            });
        }

        // 2. Validate status
        if (!BACKEND_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        // 3. Validate due date
        if (dueDate && isNaN(Date.parse(dueDate))) {
            return res.status(400).json({
                success: false,
                message: "Invalid date",
            });
        }

        // 4. Create task only after validation
        const task = await taskService.createTask({
            ...taskData,
            priority,
            status,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            userId,
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "DUPLICATE_TASK_TITLE"
        ) {
            return res.status(409).json({
                success: false,
                message: "A task with this title already exists",
            });
        }

        next(error);
    }
}
export async function getAllTasks(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const tasks = await taskService.getAllTasks(userId);

        return res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            tasks,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateTask(
    req: AuthRequest,
    res: Response
) {
    try {
        const taskId = Array.isArray(req.params.taskId)
            ? req.params.taskId[0]
            : req.params.taskId;
        if (!taskId) {
            return res.status(400).json({
                message: "Task ID is required",
            });
        }

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const updatedTask = await taskService.updateTask(
            taskId,
            userId,
            req.body
        );

        if (updatedTask.count === 0) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        return res.status(200).json({
            message: "Task updated successfully",
        });
    } catch (error) {
        if (error instanceof Error && error.message === "TITLE_REQUIRED") {
            return res.status(400).json({
                message: "Title cannot be empty",
            });
        }

        return res.status(500).json({
            message: "Failed to update task",
        });
    }
}

export async function deleteTask(
    req: AuthRequest,
    res: Response
) {
    try {
        const taskId = Array.isArray(req.params.taskId)
            ? req.params.taskId[0]
            : req.params.taskId;

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (!taskId) {
            return res.status(400).json({
                message: "Task ID is required",
            });
        }

        const deletedTask = await taskService.deleteTask(
            taskId,
            userId
        );

        if (deletedTask.count === 0) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete task",
        });
    }
}