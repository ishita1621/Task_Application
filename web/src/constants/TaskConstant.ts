export const PRIORITIES = ["High", "Medium", "Low"] as const;

export type TaskPriority = (typeof PRIORITIES)[number];
export const STATUSES = [
  "Open",
  "In Progress",
  "Implemented",
  "Re-opened",
  "Closed",
] as const;

export type TaskStatus = (typeof STATUSES)[number];
export const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "All" },
  { label: "Open", value: "Open" },
  { label: "In Progress", value: "In Progress" },
  { label: "Implemented", value: "Implemented" },
  { label: "Re-opened", value: "Re-opened" },
  { label: "Closed", value: "Closed" },
] as const;

export const PRIORITY_FILTER_OPTIONS = [
  { label: "All Priorities", value: "All" },
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
] as const;