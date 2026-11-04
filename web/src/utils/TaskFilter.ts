
type TaskStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "IMPLEMENTED"
  | "RE_OPENED"
  | "CLOSED";

type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

type Task = {
  id: string;
  title: string;
  description: string | null;
  assignee: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
};


type TaskFilters = {
  search: string;
  status: string;
  priority: string;
};

export const filterTasks = (
  tasks: Task[],
  filters: TaskFilters
): Task[] => {
  return tasks.filter((task) => {

    const matchesSearch = task.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const statusMap: Record<string, TaskStatus> = {
      Open: "OPEN",
      "In Progress": "IN_PROGRESS",
      Implemented: "IMPLEMENTED",
      "Re-opened": "RE_OPENED",
      Closed: "CLOSED",
    };

    const priorityMap: Record<string, TaskPriority> = {
      High: "HIGH",
      Medium: "MEDIUM",
      Low: "LOW",
    };

    const matchesStatus =
      filters.status === "All" ||
      task.status === statusMap[filters.status];

    const matchesPriority =
      filters.priority === "All" ||
      task.priority === priorityMap[filters.priority];

    return matchesSearch && matchesStatus && matchesPriority;
  });
};