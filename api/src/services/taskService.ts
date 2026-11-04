
import * as taskRepository from "../repositories/taskRepo";
import { CreateTaskInput } from "../types/Task";

export async function createTask(data: CreateTaskInput) {
    const title = data.title.trim();

    if (!title) {
        throw new Error("Task title is required");
    }

    const normalizedTitle = title.toLowerCase();

    // Check whether the same user already has this task title
    const existingTask = await taskRepository.findTaskByTitle(
        data.userId,
        normalizedTitle
    );

    if (existingTask) {
        throw new Error("DUPLICATE_TASK_TITLE");
    }

    return taskRepository.createTask({
        ...data,
        title,
    });
}

export async function getAllTasks(userId: number) {
    return taskRepository.getAllTasks(userId);
}

export async function updateTask(
    taskId: string,
    userId: number,
    data: {
        title?: string;
        description?: string;
        priority?: "LOW" | "MEDIUM" | "HIGH";
        status?: "OPEN" | "IN_PROGRESS" | "IMPLEMENTED" | "RE_OPENED" | "CLOSED";
        dueDate?: Date | null;
    }
) {
    if (data.title !== undefined) {
        const trimmedTitle = data.title.trim();

        if (!trimmedTitle) {
            throw new Error("TITLE_REQUIRED");
        }

        data.title = trimmedTitle;
    }

    return taskRepository.updateTask(taskId, userId, data);
}

export async function deleteTask(
    taskId: string,
    userId: number
) {
    return taskRepository.deleteTask(taskId, userId);
}