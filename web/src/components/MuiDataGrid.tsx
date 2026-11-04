
import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AppButton from "./common/AppButton.js";
import AppDialogTitle from "./common/AppDialogTitle.js";
import {
  PRIORITIES,
  STATUSES,
  type TaskPriority,
  type TaskStatus,
  STATUS_FILTER_OPTIONS,
  PRIORITY_FILTER_OPTIONS,
} from "../constants/TaskConstant.js";
import { filterTasks } from "../utils/TaskFilter.js";
import AppSelect from "./common/AppSelect.js";
import AppTextField from "./common/AppTextField.js";
import { getAllTasks, updateTask, deleteTask } from "../services/TaskApi";
import type { Task, BackendTaskStatus, BackendTaskPriority } from "../types/Task.js";
import { formatDateIST } from "../utils/date";
import { CircularProgress } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
type MuiDataGridProps = {
  refreshTrigger: number;
  onTasksChange: (updatedTasks: Task[]) => void;
};

export default function MuiDataGrid({
  refreshTrigger,
  onTasksChange,
}: MuiDataGridProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedAssignee, setEditedAssignee] = useState<string>("");
  const [editedPriority, setEditedPriority] =
    useState<TaskPriority>("Medium");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedStatus, setEditedStatus] = useState<TaskStatus>("Open");
  const [editedDueDate, setEditedDueDate] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Fetch started");
      setLoading(true);
      console.log("Loading set to true");

      setError("");

      try {
        const response = await getAllTasks();
        console.log("API response received:", response);


        const fetchedTasks = Array.isArray(response)
          ? response
          : response.tasks;

        if (!Array.isArray(fetchedTasks)) {
          throw new Error("Invalid tasks response");
        }

        setTasks(fetchedTasks);
        onTasksChange(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setError("");
      } finally {
        setLoading(false);
        console.log("Loading set to false");
      }
    };

    fetchTasks();
  }, [refreshTrigger, onTasksChange]);

  const handleEdit = (task: Task) => {
    setEditError(null);
    setSelectedTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description ?? "");
    setEditedAssignee(task.assignee ?? "");

    setEditedPriority(
      task.priority === "HIGH"
        ? "High"
        : task.priority === "MEDIUM"
          ? "Medium"
          : "Low"
    );

    setEditedStatus(statusMap[task.status]);

    setEditedDueDate(
      task.dueDate
        ? task.dueDate.substring(0, 10)
        : ""
    );

    setEditOpen(true);
  };

  const statusMap: Record<BackendTaskStatus, TaskStatus> = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    IMPLEMENTED: "Implemented",
    RE_OPENED: "Re-opened",
    CLOSED: "Closed",
  };

  const backendStatusMap: Record<TaskStatus, BackendTaskStatus> = {
    Open: "OPEN",
    "In Progress": "IN_PROGRESS",
    Implemented: "IMPLEMENTED",
    "Re-opened": "RE_OPENED",
    Closed: "CLOSED",
  };

  const hasTaskChanged = (originalTask: Task): boolean => {
    const originalPriority: TaskPriority =
      originalTask.priority === "HIGH"
        ? "High"
        : originalTask.priority === "MEDIUM"
          ? "Medium"
          : "Low";

    const originalDueDate = originalTask.dueDate
      ? originalTask.dueDate.substring(0, 10)
      : "";

    return (
      editedTitle.trim() !== originalTask.title ||
      editedDescription.trim() !== (originalTask.description ?? "") ||
      editedAssignee.trim() !== (originalTask.assignee ?? "") ||
      editedPriority !== originalPriority ||
      editedStatus !== statusMap[originalTask.status] ||
      editedDueDate !== originalDueDate
    );
  };

  const handleSaveEdit = async () => {
    if (!selectedTask || !(editedTitle ?? "").trim()) return;
    if (!hasTaskChanged(selectedTask)) {
      setEditOpen(false);
      setSelectedTask(null);
      return;
    }
    setEditError(null);

    try {
      const backendPriorityMap: Record<TaskPriority, BackendTaskPriority> = {
        High: "HIGH",
        Medium: "MEDIUM",
        Low: "LOW",
      };

      const payload: Partial<Task> = {
        title: editedTitle.trim(),
        description: editedDescription.trim(),
        assignee: (editedAssignee ?? "").trim(),
        priority: backendPriorityMap[editedPriority],
        status: backendStatusMap[editedStatus],
        dueDate:
          editedDueDate && !Number.isNaN(new Date(editedDueDate).getTime())
            ? new Date(editedDueDate).toISOString()
            : null,
      };

      await updateTask(selectedTask.id, payload);

      const updatedTasks = tasks.map((task) =>
        task.id === selectedTask.id
          ? {
            ...task,
            ...payload,
          }
          : task
      );

      setTasks(updatedTasks);
      onTasksChange(updatedTasks);

      setEditOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
      setEditError(
        error instanceof Error
          ? error.message
          : "Failed to update task. Please try again."
      );
    }
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      setLoading(true);
      setError("");
      await deleteTask(taskToDelete.id);
      const updatedTasks = tasks.filter(
        (task) => task.id !== taskToDelete.id
      );
      setTasks(updatedTasks);
      onTasksChange(updatedTasks);
      setDeleteOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task: ", error);
      setError("Unable to delete task. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  const filteredTask = useMemo(() => {
    return filterTasks(tasks, {
      search: searchText,
      status: statusFilter,
      priority: priorityFilter,
    });
  }, [tasks, searchText, statusFilter, priorityFilter]);

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Task Title",
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 250,
      renderCell: (params) => (
        <Tooltip title={params.value || ""}>
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {params.value || "-"}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "assignee",
      headerName: "Assignee",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      renderCell: (params) => (
        <span>{formatDateIST(params.value)}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit task">
            <IconButton
              color="primary"
              aria-label={`Edit ${params.row.title}`}
              onClick={() => handleEdit(params.row as Task)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete task">
            <IconButton
              color="error"
              aria-label={`Delete ${params.row.title}`}
              onClick={() => handleDeleteClick(params.row as Task)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 2,
          mb: 2,
          flexWrap: "nowrap",
        }}
      >
        <Box sx={{ width: 270, flexShrink: 0 }}>
          <AppSelect
            label="Filter by Status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={STATUS_FILTER_OPTIONS}
          />
        </Box>

        <Box sx={{ width: 270, flexShrink: 0 }}>
          <AppSelect
            label="Filter by Priority"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            options={PRIORITY_FILTER_OPTIONS}
          />
        </Box>

        <AppButton
          variant="outlined"
          onClick={() => {
            setStatusFilter("All");
            setPriorityFilter("All");
          }}
          sx={{
            mt: "16px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            height: 40,
            m: 0,
          }}
        >
          Clear Filters
        </AppButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          mb: 2,
        }}
      >
        <AppTextField
          label="Search tasks"
          placeholder="Search by task title"
          fullWidth={false}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          sx={{
            width: 315,
            mb: 0,
          }}
        />

        <AppButton
          variant="outlined"
          onClick={() => setSearchText("")}
          sx={{
            height: 40,
            minWidth: 0,
            mt: "0px",
            mb: 0,
            whiteSpace: "nowrap",
          }}
        >
          Clear Search
        </AppButton>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Unable to load tasks. Please check whether the server is running.
        </Alert>
      )}
      <Box sx={{ height: 450, width: "100%", minWidth: 0, position: "relative", }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <DataGrid
          rows={filteredTask}
          columns={columns}
          loading={false}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
                page: 0,
              },
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Edit Task Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditError(null);
        }}

        fullWidth
        maxWidth="sm"
      >
        <AppDialogTitle>Edit Task</AppDialogTitle>

        <DialogContent>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Task Title"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            error={!editedTitle.trim()}
            helperText={
              !editedTitle.trim() ? "Task title is required" : ""
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            minRows={3}
            value={editedDescription}
            onChange={(event) =>
              setEditedDescription(event.target.value)
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Assignee"
            value={editedAssignee}
            onChange={(event) => setEditedAssignee(event.target.value)}
          />

          <FormControl fullWidth margin="normal" size="small">
            <InputLabel id="edit-priority-label">Priority</InputLabel>
            <Select
              labelId="edit-priority-label"
              label="Priority"
              value={editedPriority}
              onChange={(event: SelectChangeEvent) =>
                setEditedPriority(event.target.value as TaskPriority)
              }
            >
              {PRIORITIES.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" size="small">
            <InputLabel id="edit-status-label">Status</InputLabel>
            <Select
              labelId="edit-status-label"
              label="Status"
              value={editedStatus}
              onChange={(event: SelectChangeEvent) =>
                setEditedStatus(event.target.value as TaskStatus)
              }
            >
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Due Date"
            type="date"
            value={editedDueDate}
            onChange={(event) => setEditedDueDate(event.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </DialogContent>

        <DialogActions>
          <AppButton
            onClick={() => {
              setEditOpen(false);
              setEditError(null);
            }}>
            Cancel
          </AppButton>

          <AppButton
            variant="contained"
            onClick={handleSaveEdit}
            disabled={!editedTitle.trim()}
          >
            Save Changes
          </AppButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      >
        <AppDialogTitle>Delete Task?</AppDialogTitle>

        <DialogContent>
          Are you sure you want to delete "{taskToDelete?.title}"?

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <AppButton onClick={() => setDeleteOpen(false)}>
            Cancel
          </AppButton>

          <AppButton
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
