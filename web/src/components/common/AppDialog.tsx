import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import type { TextFieldProps } from "@mui/material/TextField";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { Dayjs } from "dayjs";
import type { ReactNode } from "react";
import type { FormikErrors, FormikTouched } from "formik";

import AppDialogTitle from "./AppDialogTitle";
import AppCloseButton from "./AppCloseButton";
import AppTextField from "./AppTextField";
import AppSelect from "./AppSelect";
import AppDatePicker from "./AppDatePicker";
import AppButton from "./AppButton";
import BootstrapDialog from "./BootstrapDialog";
import Stack from "@mui/material/Stack";

import {
  PRIORITIES,
  STATUSES,
  type TaskPriority,
  type TaskStatus,
} from "../../constants/TaskConstant";

type TaskFormValues = {
  title: string;
  description: string;
  priority: TaskPriority | "";
  status: TaskStatus;
  dueDate: Dayjs | null;
  assignee: string;
};

type AppTaskDialogProps = {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  priority: TaskPriority | "";
  status: TaskStatus;
  dueDate: Dayjs | null;
  assignee: string;

  errors: FormikErrors<TaskFormValues>;
  touched: FormikTouched<TaskFormValues>;

  handleTitleChange: NonNullable<TextFieldProps["onChange"]>;
  handleDescriptionChange: NonNullable<TextFieldProps["onChange"]>;
  handleAssigneeChange: NonNullable<TextFieldProps["onChange"]>;
  handlePriorityChange: (event: SelectChangeEvent<string>) => void;
  handleStatusChange: (event: SelectChangeEvent<string>) => void;
  handleDueDateChange: (date: Dayjs | null) => void;
  handleBlur: NonNullable<TextFieldProps["onBlur"]>;
  handleSave: () => void;

  dialogTitle?: ReactNode;
};

export default function AppDialog({
  open,
  handleClose,
  title,
  description,
  priority,
  status,
  dueDate,
  assignee,
  errors,
  touched,
  handleTitleChange,
  handleDescriptionChange,
  handleAssigneeChange,
  handlePriorityChange,
  handleStatusChange,
  handleDueDateChange,
  handleBlur,
  handleSave,
  dialogTitle = "Add Task",
}: AppTaskDialogProps) {
  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <AppDialogTitle>{dialogTitle}</AppDialogTitle>

      <AppCloseButton onClick={handleClose} />


<DialogContent dividers>
  <Stack spacing={2}>
    <AppTextField
      label="Task Title"
      name="title"
      value={title}
      onChange={handleTitleChange}
      onBlur={handleBlur}
      error={Boolean(touched.title && errors.title)}
      helperText={touched.title ? errors.title : ""}
    />

    <AppTextField
      label="Description"
      name="description"
      value={description}
      onChange={handleDescriptionChange}
      onBlur={handleBlur}
      multiline
      rows={3}
      error={Boolean(touched.description && errors.description)}
      helperText={touched.description ? errors.description : ""}
    />

    <AppTextField
      label="Assignee"
      name="assignee"
      value={assignee}
      onChange={handleAssigneeChange}
      onBlur={handleBlur}
      error={Boolean(touched.assignee && errors.assignee)}
      helperText={touched.assignee ? errors.assignee : ""}
    />

    <AppSelect
      label="Priority"
      value={priority}
      onChange={handlePriorityChange}
      options={PRIORITIES.map((item) => ({
        label: item,
        value: item,
      }))}
      error={Boolean(touched.priority && errors.priority)}
      helperText={touched.priority ? errors.priority : ""}
    />

    <AppSelect
      label="Status"
      value={status}
      onChange={handleStatusChange}
      options={STATUSES.map((item) => ({
        label: item,
        value: item,
      }))}
      error={Boolean(touched.status && errors.status)}
      helperText={touched.status ? errors.status : ""}
    />

    <AppDatePicker
      label="Due Date"
      value={dueDate}
      onChange={handleDueDateChange}
      onBlur={() =>
        handleBlur({
          target: { name: "dueDate" },
        } as React.FocusEvent<HTMLInputElement>)
      }
      error={Boolean(touched.dueDate && errors.dueDate)}
      helperText={touched.dueDate ? errors.dueDate : ""}
    />
  </Stack>
</DialogContent>


      <DialogActions>
        <AppButton onClick={handleClose} color="inherit">
          Cancel
        </AppButton>

        <AppButton onClick={handleSave}>
          Save Task
        </AppButton>
      </DialogActions>
    </BootstrapDialog>
  );
}
