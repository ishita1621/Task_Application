import { useState, useCallback } from "react";
import { Box, Paper, Typography } from "@mui/material";
import MuiDataGrid from "../components/MuiDataGrid"
import AddIcon from "@mui/icons-material/Add";
import CustomizedDialogs from "../components/MuiDialog";
import AppButton from "../components/common/AppButton.js";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import type { Task } from "../types/Task";
import { createTask } from "../services/TaskApi";
import { TaskFormData } from "../types/Task";
import type {
  TaskPriority,
  TaskStatus,
} from "../constants/TaskConstant";

import {
  BackendTaskPriority,
  BackendTaskStatus
} from "../types/Task"

import type { CreateTaskData } from "../types/Task";

// type TaskFormData = {
//   title: string;
//   description: string;
//   assignee: string;
//   priority: TaskPriority;
//   status: TaskStatus;
//   dueDate: Dayjs | null;
// };

const cardDetails = [
  { title: "Total Tasks", color: "#2563eb" },
  { title: "Open Tasks", color: "#d97706" },
  { title: "In Progress Tasks", color: "#7c3aed" },
  { title: "Implemented Tasks", color: "#0891b2" },
  { title: "Re-opened Tasks", color: "#ea580c" },
  { title: "Closed Tasks", color: "#059669" },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [refreshGrid, setRefreshGrid] = useState(0);
  const [successOpen, setSuccessOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  // useEffect(() => {
  //   const savedTasks = loadData();
  //   setTasks(Array.isArray(savedTasks) ? savedTasks : []);
  // }, []);

  const totalTasks = tasks.length;

  const openTasks = tasks.filter(
    (task) => task.status === "OPEN"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const implementedTasks = tasks.filter(
    (task) => task.status === "IMPLEMENTED"
  ).length;

  const reOpenedTasks = tasks.filter(
    (task) => task.status === "RE_OPENED"
  ).length;

  const closedTasks = tasks.filter(
    (task) => task.status === "CLOSED"
  ).length;

  const handleTasksChange = useCallback((updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  }, []);

  const taskStats = [
    { ...cardDetails[0], count: totalTasks },
    { ...cardDetails[1], count: openTasks },
    { ...cardDetails[2], count: inProgressTasks },
    { ...cardDetails[3], count: implementedTasks },
    { ...cardDetails[4], count: reOpenedTasks },
    { ...cardDetails[5], count: closedTasks },
  ];

  const handleAddTask = () => {
    setOpenTaskDialog(true);
  };

  const handleSubmit = async (task: TaskFormData) => {
    try {
      const priorityMap: Record<TaskPriority, BackendTaskPriority> = {
        High: "HIGH",
        Medium: "MEDIUM",
        Low: "LOW",
      };

      const statusMap: Record<TaskStatus, BackendTaskStatus> = {
        Open: "OPEN",
        "In Progress": "IN_PROGRESS",
        Implemented: "IMPLEMENTED",
        "Re-opened": "RE_OPENED",
        Closed: "CLOSED",
      };

      const payload: CreateTaskData = {
        title: task.title.trim(),
        description: task.description.trim(),
        priority: priorityMap[task.priority],
        status: statusMap[task.status],
        dueDate: task.dueDate
          ? task.dueDate.format("YYYY-MM-DD")
          : null,
        assignee: task.assignee,
      };

      await createTask(payload);

      setOpenTaskDialog(false);
      setRefreshGrid((previous) => previous + 1);
      setSuccessOpen(true);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f4f6fb",
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ FontWeight: 700 }}>
            DASHBOARD
          </Typography>

          <AppButton
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </AppButton>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {taskStats.map((stat) => (
            <Paper
              key={stat.title}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                borderTop: `4px solid ${stat.color}`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>

              <Typography
                variant="h4"
                sx={{ mt: 1, fontWeight: 700 }}
              >
                {stat.count}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
            mb: 2,
          }}
        >
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTask}
          >
            Add Task
          </AppButton>
        </Box>

        <CustomizedDialogs
          openTaskDialog={openTaskDialog}
          handleClose={() => setOpenTaskDialog(false)}
          handleSubmit={handleSubmit}
        />

        <MuiDataGrid refreshTrigger={refreshGrid}
          onTasksChange={handleTasksChange}
        />
        <Snackbar
          open={successOpen}
          autoHideDuration={3000}
          onClose={() => setSuccessOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSuccessOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Task added successfully!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}