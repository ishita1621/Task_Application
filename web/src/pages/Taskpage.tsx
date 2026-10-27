import { useState } from "react";
import CustomizedDialogs from "../components/MuiDialog";
import TaskDataGrid from "../components/MuiDataGrid";
import TaskPageContent from "../components/common/TaskPageContent";
import UserDetailsDialog, {
  type UserDetails,
} from "../components/UserDetails";

type Task = {
  id: number;
  title: string;
  priority: string;
  dueDate: string | null;
  completed: boolean;
};

export default function Taskspage() {
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const handleUserDetails = (): void => {
    setShowUserDetails(true);
  };

  const handleSubmit = (task: Task): void => {
    let existingTasks: Task[] = [];

    try {
      const savedTasks = localStorage.getItem("tasks");

      if (savedTasks) {
        const parsedData: unknown = JSON.parse(savedTasks);

        if (Array.isArray(parsedData)) {
          existingTasks = parsedData as Task[];
        } else if (
          parsedData !== null &&
          typeof parsedData === "object"
        ) {
          existingTasks = [parsedData as Task];
        }
      }
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }

    const updatedTasks = [...existingTasks, task];

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    console.log("Saved tasks:", updatedTasks);

    setOpenTaskDialog(false);
  };

  const handleFilter = (): void => {
    console.log("Filter clicked");
  };

  const handleSaveUserDetails = (values: UserDetails): void => {
    const { password, ...safeUserDetails } = values;

    console.log("User details:", safeUserDetails);
    setShowUserDetails(false);
  };

  return (
    <TaskPageContent
      onAddTask={() => setOpenTaskDialog(true)}
      onFilter={handleFilter}
      onUserDetails={handleUserDetails}
    >
      {/* <CustomizedDialogs
        openTaskDialog={openTaskDialog}
        handleClose={() => setOpenTaskDialog(false)}
        handleSubmit={handleSubmit}
      /> */}
      <UserDetailsDialog
        open={showUserDetails}
        onClose={() => setShowUserDetails(false)}
        onSave={handleSaveUserDetails}
      />
    </TaskPageContent>
  );
}