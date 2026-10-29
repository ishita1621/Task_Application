
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import AppTextField from "../components/common/AppTextField";
import AppButton from "../components/common/AppButton";
import AppBox from "../components/common/AppBox";
import { signupUser } from "../services/AuthApi";
import { useNavigate } from "react-router-dom";
import AppLoader from "../components/common/AppLoader";

// Validation for personal details
const personalDetailsSchema = Yup.object({
    firstName: Yup.string()
        .trim()
        .required("First name is required")
        .matches(
            /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
            "Enter a valid first name"
        ),

    middleName: Yup.string()
        .trim()
        .matches(
            /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
            {
                message: "Enter a valid middle name",
                excludeEmptyString: true,   //skip the regex validation when the middle name is empty
            }
        ),

    lastName: Yup.string()
        .trim()
        .required("Last name is required")
        .matches(
            /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
            "Enter a valid last name"
        ),

    email: Yup.string()
        .trim()
        .email("Enter a valid email address")
        .required("Email is required"),
});

// Validation for password details
const passwordSchema = Yup.object({

    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter"),

    confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Passwords do not match"),
});

type SignupFormValues = {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function Signup() {
    const [step, setStep] = useState(1);
    const [successOpen, setSuccessOpen] = useState(false);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");

    const formik = useFormik<SignupFormValues>({
        initialValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },

        validationSchema:
            step === 1 ? personalDetailsSchema : passwordSchema,


        onSubmit: async (values, { setStatus }) => {
            try {
                setStatus(undefined);

                const result = await signupUser(values);

                console.log("Signup successful:", result);

                setSuccessMessage(
                    "Your account has been created successfully! Please log in to continue."
                );

                setSuccessOpen(true);

                setTimeout(() => {
                    navigate("/login");
                }, 2500);
            } catch (error) {
                setStatus({
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Something went wrong",
                });
            }
        },

    });

    return (
        <AppBox
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f4f6fb",
                p: 2,
            }}
        >
            <AppBox
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    bgcolor: "#ffffff",
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ mb: 1, textAlign: "center", fontWeight: 700 }}
                >
                    {step === 1 ? "Create Account" : "Create Password"}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, textAlign: "center" }}
                >
                    {step === 1
                        ? "Enter your personal details to get started."
                        : "Set your password to complete registration."}
                </Typography>

                <Typography
                    variant="caption"
                    color="primary"
                    sx={{ display: "block", mb: 2, textAlign: "center" }}
                >
                    Step {step} of 2
                </Typography>

                <form onSubmit={formik.handleSubmit} noValidate>
                    {step === 1 ? (
                        <>
                            <AppTextField
                                label="First name"
                                required
                                {...formik.getFieldProps("firstName")}
                                error={
                                    formik.touched.firstName &&
                                    Boolean(formik.errors.firstName)
                                }
                                helperText={
                                    formik.touched.firstName
                                        ? formik.errors.firstName
                                        : ""
                                }
                            />

                            <AppTextField
                                label="Middle name (optional)"
                                {...formik.getFieldProps("middleName")}
                                error={
                                    formik.touched.middleName &&
                                    Boolean(formik.errors.middleName)
                                }
                                helperText={
                                    formik.touched.middleName
                                        ? formik.errors.middleName
                                        : ""
                                }
                            />

                            <AppTextField
                                label="Last name"
                                required
                                {...formik.getFieldProps("lastName")}
                                error={
                                    formik.touched.lastName &&
                                    Boolean(formik.errors.lastName)
                                }
                                helperText={
                                    formik.touched.lastName
                                        ? formik.errors.lastName
                                        : ""
                                }
                            />

                            <AppTextField
                                label="Email address"
                                required
                                type="email"
                                {...formik.getFieldProps("email")}
                                error={
                                    formik.touched.email &&
                                    Boolean(formik.errors.email)
                                }
                                helperText={
                                    formik.touched.email
                                        ? formik.errors.email
                                        : ""
                                }
                            />

                            <AppBox
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mt: 1,
                                }}
                            >
                                <AppButton
                                    type="button"
                                    onClick={async () => {
                                        const errors = await personalDetailsSchema.validate(
                                            {
                                                firstName: formik.values.firstName,
                                                middleName: formik.values.middleName,
                                                lastName: formik.values.lastName,
                                                email: formik.values.email,
                                            },
                                            { abortEarly: false }
                                        ).catch((error) => error);

                                        if (errors instanceof Yup.ValidationError) {
                                            const fieldErrors: Record<string, string> = {};

                                            errors.inner.forEach((error) => {
                                                if (error.path) {
                                                    fieldErrors[error.path] = error.message;
                                                }
                                            });

                                            formik.setErrors(fieldErrors);
                                            formik.setTouched({
                                                firstName: true,
                                                middleName: true,
                                                lastName: true,
                                                email: true,
                                            });

                                            return;
                                        }

                                        formik.setErrors({});
                                        setStep(2);
                                    }}
                                    sx={{
                                        width: "100%",
                                        py: 1.3,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    Continue
                                </AppButton>
                            </AppBox>
                        </>
                    ) : (
                        <>
                            <AppTextField
                                label="Password"
                                required
                                type="password"
                                {...formik.getFieldProps("password")}
                                error={
                                    formik.touched.password &&
                                    Boolean(formik.errors.password)
                                }
                                helperText={
                                    formik.touched.password
                                        ? formik.errors.password
                                        : ""
                                }
                            />

                            <AppTextField
                                label="Confirm password"
                                required
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
                            />

                            {formik.status?.message && (
                                <Typography
                                    color={formik.status.success ? "success.main" : "error"}
                                    variant="body2"
                                    sx={{ mt: 1 }}
                                >
                                    {formik.status.message}
                                </Typography>
                            )}

                            <AppBox
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                    mt: 1,
                                }}
                            >
                                <AppButton
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    sx={{
                                        width: "100%",
                                        py: 1.3,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                    }}
                                > {formik.isSubmitting ? (
                                    <AppLoader size={20} />
                                ) : (
                                    "Sign Up"
                                )}
                                </AppButton>

                                <AppButton
                                    type="button"
                                    disabled={formik.isSubmitting}
                                    onClick={() => {
                                        setStep(1);
                                        formik.setStatus(undefined);
                                    }}
                                    sx={{
                                        width: "100%",
                                        py: 1,
                                        textTransform: "none",
                                    }}
                                >
                                    Back to personal details
                                </AppButton>
                            </AppBox>
                        </>
                    )}
                </form>
            </AppBox>

            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => setSuccessOpen(false)}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSuccessOpen(false)}
                    sx={{ width: "100%" }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </AppBox>
    );
}
