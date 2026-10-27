import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { useFormik } from "formik";
import * as Yup from "yup";

import AppDialogTitle from "./common/AppDialogTitle";
import AppCloseButton from "./common/AppCloseButton";
import AppTextField from "./common/AppTextField";
import AppButton from "./common/AppButton";

export type UserDetails = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
};

type UserDetailsDialogProps = {
    open: boolean;
    onClose: () => void;
    onSave: (values: UserDetails) => void;
};

const validationSchema = Yup.object({
    fullName: Yup.string()
        .trim()
        .min(3, "Name must contain at least 3 characters")
        .required("Full name is required"),

    email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),

    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be atleast 8 charactes long")
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase')
        .matches(/[A-Z]/, 'Password requires a uppercase'),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Please confirm your password"),

    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
        .required("Phone number is required"),

    address: Yup.string()
        .trim()
        .required("Address is required"),
});

export default function UserDetailsDialog({
    open,
    onClose,
    onSave,
}: UserDetailsDialogProps) {
    const formik = useFormik<UserDetails>({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            address: "",
        },

        validationSchema,

        onSubmit: (values, { resetForm }) => {
            const userDetails = {
                ...values,
                fullName: values.fullName.trim(),
                address: values.address.trim(),
            };

            onSave(userDetails);
            resetForm();
            onClose();
        },
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="user-details-title"
        >
            <AppDialogTitle id="user-details-title">
                User Details
            </AppDialogTitle>

            <AppCloseButton onClick={onClose} />

            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <AppTextField
                        label="Full Name"
                        {...formik.getFieldProps("fullName")}
                        error={
                            formik.touched.fullName &&
                            Boolean(formik.errors.fullName)
                        }
                        helperText={
                            formik.touched.fullName
                                ? formik.errors.fullName
                                : ""
                        }
                    />

                    <AppTextField
                        label="Email"
                        type="email"
                        {...formik.getFieldProps("email")}
                        error={
                            formik.touched.email &&
                            Boolean(formik.errors.email)
                        }
                        helperText={
                            formik.touched.email ? formik.errors.email : ""
                        }
                        sx={{ mt: 2 }}
                    />

                    <AppTextField
                        label="Password"
                        type="password"
                        {...formik.getFieldProps("password")}
                        error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                        }
                        helperText={
                            formik.touched.password ? formik.errors.password : ""
                        }
                        sx={{ mt: 2 }}
                    />

                    <AppTextField
                        label="Confirm Password"
                        type="password"
                        {...formik.getFieldProps("confirmPassword")}
                        error={
                            formik.touched.confirmPassword &&
                            Boolean(formik.errors.confirmPassword)
                        }
                        helperText={
                            formik.touched.confirmPassword
                                ? formik.errors.confirmPassword
                                : ""
                        }
                        sx={{ mt: 2 }}
                    />

                    <AppTextField
                        label="Phone Number"
                        {...formik.getFieldProps("phone")}
                        error={
                            formik.touched.phone &&
                            Boolean(formik.errors.phone)
                        }
                        helperText={
                            formik.touched.phone ? formik.errors.phone : ""
                        }
                        sx={{ mt: 2 }}
                    />

                    <AppTextField
                        label="Address"
                        multiline
                        rows={3}
                        {...formik.getFieldProps("address")}
                        error={
                            formik.touched.address &&
                            Boolean(formik.errors.address)
                        }
                        helperText={
                            formik.touched.address
                                ? formik.errors.address
                                : ""
                        }
                        sx={{ mt: 2 }}
                    />
                </DialogContent>

                <DialogActions>
                    <AppButton
                        type="button"
                        color="inherit"
                        onClick={() => {
                            formik.resetForm();
                            onClose();
                        }}
                    >
                        Cancel
                    </AppButton>

                    <AppButton
                        type="submit"
                        disabled={formik.isSubmitting}
                    >
                        Save Details
                    </AppButton>
                </DialogActions>
            </form>
        </Dialog>
    );
}