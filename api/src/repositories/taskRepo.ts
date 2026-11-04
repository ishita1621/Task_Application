
import prisma from "../lib/prisma";

export async function createTask(data: {
    title: string;
    description?: string;
    assignee?: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "OPEN" | "IN_PROGRESS" | "IMPLEMENTED" | "RE_OPENED" | "CLOSED";
    dueDate?: Date;
    userId: number;
}) {
    return prisma.task.create({
        data,
    });
}

export async function findTaskByTitle(
    userId: number,
    normalizedTitle: string
) {
    const tasks = await prisma.task.findMany({
        where: {
            userId,
        },
        select: {
            id: true,
            title: true,
        },
    });

    return tasks.find(
        (task) => task.title.trim().toLowerCase() === normalizedTitle
    );
}

//to get task for the log in user
export async function getAllTasks(userId: number) {
    return prisma.task.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
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
    return prisma.task.updateMany({
        where: {
            id: taskId,
            userId: userId,
        },
        data,
    });
}

export async function deleteTask(
    taskId: string,
    userId: number
) {
    return prisma.task.deleteMany({
        where: {
            id: taskId,
            userId,
        },
    });
}