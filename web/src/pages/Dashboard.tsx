import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import MuiDataGrid from "../components/MuiDataGrid"
import AddIcon from "@mui/icons-material/Add";
import CustomizedDialogs from "../components/MuiDialog";
import { saveTasks, loadData } from "../services/TaskStorage";
import AppButton from "../components/common/AppButton.js";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import type { Task } from "../types/Task";


const cardDetails = [
  { title: "Total Tasks", color: "#2563eb" },
  { title: "Pending Tasks", color: "#d97706" },
  { title: "In Progress Tasks", color: "#7c3aed" },
  { title: "Completed Tasks", color: "#059669" },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [refreshGrid, setRefreshGrid] = useState(0);
  const [successOpen, setSuccessOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const savedTasks = loadData();
    setTasks(Array.isArray(savedTasks) ? savedTasks : []);
  }, []);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status?.toLowerCase() === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status?.toLowerCase() === "in progress"
  ).length;

  const pendingTasks = tasks.filter((task) => {
    const status = task.status?.toLowerCase();

    return (
      status === "pending"
    );
  }).length;

  const handleTasksChange = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const taskStats = [
    { ...cardDetails[0], count: totalTasks },
    { ...cardDetails[1], count: pendingTasks },
    { ...cardDetails[2], count: inProgressTasks },
    { ...cardDetails[3], count: completedTasks },
  ];
  const handleAddTask = () => {
    setOpenTaskDialog(true);
  };

  const handleSubmit = (task: Task) => {
    const existingTasks = loadData();

    const currentTasks: Task[] = Array.isArray(existingTasks)
      ? existingTasks
      : [];

    const updatedTasks = [...currentTasks, task];

    saveTasks(updatedTasks);
    setTasks(updatedTasks);
    setRefreshGrid((previous) => previous + 1);

    setOpenTaskDialog(false);
    setSuccessOpen(true);
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