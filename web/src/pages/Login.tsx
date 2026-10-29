import { useFormik } from "formik";
import * as Yup from "yup";
import AppTextField from "../components/common/AppTextField";
import AppButton from "../components/common/AppButton"
import Typography from "@mui/material/Typography";
import AppBox from "../components/common/AppBox"
import { useNavigate, Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { loginUser } from "../services/AuthApi";
import AppLoader from "../components/common/AppLoader";
import { encryptPassword } from "../utils/encryptPassword";

const loginSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email("Enter a valid email address")
        .required("Email is required"),

    password: Yup.string()
        .required("password is required")
        .min(8, "Password must be atleast 8 charactes long")
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase')
        .matches(/[A-Z]/, 'Password requires a uppercase'),
});


type LoginFormValues = {
    email: string;
    password: string;
};

export default function Login() {
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const formik = useFormik<LoginFormValues>({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginSchema,


        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            try {
                setStatus(undefined);

                // Encrypt password before sending it to backend
                const encryptedPassword = await
                    encryptPassword(values.password);

                // Send encrypted password
                const result = await loginUser({
                    email: values.email,
                    encryptedPassword,
                });

                console.log("Login response:", result);
                console.log("User:", result.user);



                // Save user details
                localStorage.setItem("user", JSON.stringify(result.user));


                setSuccessMessage("Login successful! Redirecting to dashboard...");
                setSuccessOpen(true);
                setTimeout(() => {
                    navigate("/dashboard");
                    // resetForm();
                }, 1500);

            } catch (error) {
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Invalid email or password"
                );

                setErrorOpen(true);
            } finally {
                setSubmitting(false);
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
                    Log In
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, textAlign: "center" }}
                >
                    Welcome back! Please enter your details.
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    <AppTextField
                        label="Email address"
                        required
                        type="email"
                        {...formik.getFieldProps("email")}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={
                            formik.touched.email ? formik.errors.email : ""
                        }
                    />

                    <AppTextField
                        label="Password"
                        required
                        type="password"
                        {...formik.getFieldProps("password")}
                        error={
                            formik.touched.password && Boolean(formik.errors.password)
                        }
                        helperText={
                            formik.touched.password ? formik.errors.password : ""
                        }

                    />


                    <AppBox sx={{ display: "flex", justifyContent: "center", }}>
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
                        >
                            {formik.isSubmitting ? (
                                <AppLoader size={20} />
                            ) : (
                                "Log In"
                            )}
                        </AppButton>

                    </AppBox>
                    <Typography
                        variant="body2"
                        sx={{
                            mt: 2,
                            textAlign: "center",
                            color: "text.secondary",
                        }}
                    >
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            style={{
                                color: "#1976d2",
                                fontWeight: 600,
                                textDecoration: "none",
                            }}
                        >
                            Create account
                        </Link>
                    </Typography>
                </form>
            </AppBox>
            <Snackbar
                open={successOpen}
                autoHideDuration={1500}
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
            <Snackbar
                open={errorOpen}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => setErrorOpen(false)}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => setErrorOpen(false)}
                    sx={{ width: "100%" }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </AppBox>
    );
}