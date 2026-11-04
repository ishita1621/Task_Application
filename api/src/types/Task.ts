export const BACKEND_PRIORITIES = [
    "HIGH",
    "MEDIUM",
    "LOW",
] as const;

export type BackendPriority =
    (typeof BACKEND_PRIORITIES)[number];

export const BACKEND_STATUSES = [
    "OPEN",
    "IN_PROGRESS",
    "IMPLEMENTED",
    "RE_OPENED",
    "CLOSED",
] as const;

export type BackendStatus =
    (typeof BACKEND_STATUSES)[number];

export type Task = {
    id: string;
    title: string;
    description: string | null;
    priority: BackendPriority;
    status: BackendStatus;
    dueDate: string | null;
    assignee: string | null;
};

export type CreateTaskInput = {
    title: string;
    description?: string;
    assignee?: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "OPEN" | "IN_PROGRESS" | "IMPLEMENTED" | "RE_OPENED" | "CLOSED";
    dueDate?: Date;
    userId: number;
};

export type SignupData = {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type CreateUserData = {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
};