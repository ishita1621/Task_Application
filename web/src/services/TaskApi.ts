import axiosInstance from "./AxiosInstance";
import { CreateTaskData } from "../types/Task";
// export type CreateTaskData = {
//     title: string;
//     description?: string;
//     priority: string;
//     status: string;
//     dueDate?: string | null;
//     assignee?: string;
// };

export async function createTask(data: CreateTaskData) {
    try {
        const response = await axiosInstance.post("/tasks", data);

        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to create task"
        );
    }
}

export async function getAllTasks() {
    try {
        const response = await axiosInstance.get("/tasks");

        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch tasks"
        );
    }
}

export async function updateTask(
    taskId: string,
    data: Partial<CreateTaskData> //Partial makes every property optional, so you don't have to send the entire task.
) {
    try {
        const response = await axiosInstance.patch(
            `/tasks/${taskId}`,
            data
        );

        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to update task"
        );
    }
}

export async function deleteTask(taskId: string) {
    try {
        const response = await axiosInstance.delete(`/tasks/${taskId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to delete task"
        );
    }
}