import { useFormik } from "formik";
import * as Yup from "yup";
import AppDialog from "./common/AppDialog";
import {
  PRIORITIES,
  STATUSES,
  type TaskPriority,
  type TaskStatus,
} from "../constants/TaskConstant";
import type { Dayjs } from "dayjs";

type Task = {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  assignee: string;
};

type CustomizedDialogsProps = {
  openTaskDialog: boolean;
  handleClose: () => void;
  handleSubmit: (task: Task) => void;
};

type TaskFormValues = {
  title: string;
  description: string;
  priority: TaskPriority | "";
  status: TaskStatus;
  dueDate: Dayjs | null;
  assignee: string;
};

const taskSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Task title is required")
    .max(100, "Title cannot exceed 100 characters"),

  description: Yup.string()
    .trim()
    .required("Description is required")
    .max(500, "Description cannot exceed 500 characters"),

  priority: Yup.string()
    .oneOf([...PRIORITIES], "Select a valid priority")
    .required("Priority is required"),

  status: Yup.string()
    .oneOf([...STATUSES], "Select a valid status")
    .required("Status is required"),

  assignee: Yup.string()
    .trim()
    .required("Assignee is required"),

  dueDate: Yup.mixed<Dayjs>()
    .nullable()
    .required("Due date is required")
    .test(
      "valid-date",
      "Enter a valid due date",
      (value) => value == null || value.isValid()
    ),
});

export default function CustomizedDialogs({
  openTaskDialog,
  handleClose,
  handleSubmit,
}: CustomizedDialogsProps) {
  const formik = useFormik<TaskFormValues>({
    initialValues: {
      title: "",
      description: "",
      priority: "",
      status: "Pending",
      dueDate: null,
      assignee: "",
    },

    validationSchema: taskSchema,
    validateOnBlur: true,
    validateOnChange: true,

    onSubmit: (values, { resetForm }) => {
      if (!values.priority || !values.dueDate) {
        return;
      }

      const task: Task = {
        id: Date.now(),
        title: values.title.trim(),
        description: values.description.trim(),
        priority: values.priority,
        status: values.status,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        assignee: values.assignee.trim(),
      };

      handleSubmit(task);
      resetForm();
    },
  });

  const handleDialogClose = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <AppDialog
      open={openTaskDialog}
      handleClose={handleDialogClose}
      title={formik.values.title}
      description={formik.values.description}
      priority={formik.values.priority}
      status={formik.values.status}
      dueDate={formik.values.dueDate}
      assignee={formik.values.assignee}
      errors={formik.errors}
      touched={formik.touched}
      handleTitleChange={formik.handleChange}
      handleDescriptionChange={formik.handleChange}
      handleAssigneeChange={formik.handleChange}
      handlePriorityChange={(event) => {
        formik.setFieldValue("priority", event.target.value);
        formik.setFieldTouched("priority", true, false);
      }}
      handleStatusChange={(event) => {
        formik.setFieldValue("status", event.target.value);
        formik.setFieldTouched("status", true, false);
      }}
      handleDueDateChange={(date) => {
        formik.setFieldValue("dueDate", date);
        formik.setFieldTouched("dueDate", true, false);
      }}
      handleBlur={formik.handleBlur}
      handleSave={() => {
        void formik.validateForm().then((errors) => {
          if (Object.keys(errors).length === 0) {
            formik.handleSubmit();
          } else {
            formik.setTouched({
              title: true,
              description: true,
              priority: true,
              status: true,
              dueDate: true,
              assignee: true,
            });
          }
        });
      }}
    />
  );
}
