
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
import { loadData, saveTasks } from "../services/TaskStorage.js";
import {
  PRIORITIES,
  STATUSES,
  type TaskPriority,
  type TaskStatus,
  STATUS_FILTER_OPTIONS,
  PRIORITY_FILTER_OPTIONS,
} from "../constants/TaskConstant.js";
import { filterTasks } from "../utils/TaskFilter.js";
import type { Task } from "../types/Task.js"
import AppSelect from "./common/AppSelect.js";
import AppTextField from "./common/AppTextField.js";

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
  const [error, setError] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [editedTitle, setEditedTitle] = useState("");
  const [editedAssignee, setEditedAssignee] = useState("");
  const [editedPriority, setEditedPriority] =
    useState<TaskPriority>("Medium");
  const [editedStatus, setEditedStatus] =
    useState<TaskStatus>("Pending");
  const [editedDueDate, setEditedDueDate] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(false);

    try {
      const savedTasks = loadData();

      const localTasks = Array.isArray(savedTasks)
        ? savedTasks
        : [];

      setTasks(localTasks);
    } catch (error) {
      console.error("Failed to load saved tasks:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger]);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setEditedTitle(task.title);
    setEditedAssignee(task.assignee);
    setEditedPriority(task.priority);
    setEditedStatus(task.status);
    setEditedDueDate(task.dueDate ?? "");
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedTask || !editedTitle.trim()) return;

    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id
        ? {
          ...task,
          title: editedTitle.trim(),
          assignee: editedAssignee.trim(),
          priority: editedPriority,
          status: editedStatus,
          dueDate: editedDueDate || null,
        }
        : task
    );

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    onTasksChange(updatedTasks);

    setEditOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;

    const updatedTasks = tasks.filter(
      (task) => task.id !== taskToDelete.id
    );

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    onTasksChange(updatedTasks);
    setDeleteOpen(false);
    setTaskToDelete(null);
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
      width: 140,
      valueFormatter: (value) => value || "—",
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
          alignItems: "center",
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
        />
        <AppButton
          variant="outlined"
          onClick={() => setSearchText("")}
          sx={{ md: 4 }}
        >
          Clear Search
        </AppButton>
      </Box>

      <Box sx={{ height: 450, width: "100%", minWidth: 0 }}>
        <DataGrid
          rows={filteredTask}
          columns={columns}
          loading={loading}
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
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <AppDialogTitle>Edit Task</AppDialogTitle>

        <DialogContent>
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
          <AppButton onClick={() => setEditOpen(false)}>
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
        </DialogContent>

        <DialogActions>
          <AppButton onClick={() => setDeleteOpen(false)}>
            Cancel
          </AppButton>

          <AppButton
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
