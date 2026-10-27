export const PRIORITIES = ["High", "Medium", "Low"] as const;

export type TaskPriority = (typeof PRIORITIES)[number];
export const STATUSES = [
  "Pending",
  "In Progress",
  "Completed",
] as const;

export type TaskStatus = (typeof STATUSES)[number];

export const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
] as const;

export const PRIORITY_FILTER_OPTIONS = [
  { label: "All Priorities", value: "All" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
] as const;