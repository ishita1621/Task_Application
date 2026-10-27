import type {
  TaskPriority,
  TaskStatus,
} from "../constants/TaskConstant";

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  assignee: string;
};