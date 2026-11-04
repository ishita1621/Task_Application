import type { Dayjs } from "dayjs";
import { TaskStatus, TaskPriority } from "../constants/TaskConstant";
export type BackendTaskPriority =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type BackendTaskStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "IMPLEMENTED"
  | "RE_OPENED"
  | "CLOSED";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: BackendTaskPriority;
  status: BackendTaskStatus;
  dueDate: string | null;
  assignee: string;
};

export type CreateTaskData = {
  title: string;
  description?: string;
  priority: BackendTaskPriority;
  status: BackendTaskStatus;
  dueDate: string | null;
  assignee?: string;
};

export type TaskFormData = {
  title: string;
  description: string;
  assignee?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Dayjs | null;
};