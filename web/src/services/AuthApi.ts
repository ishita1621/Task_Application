import axiosInstance from "../services/AxiosInstance";

export type SignupData = {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export async function signupUser(data: SignupData) {
    try {
        const response = await axiosInstance.post(
            "/auth/signup",
            data
        );

        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Signup failed"
        );
    }
}
export type LoginData = {
    email: string;
    encryptedPassword: string;
};

export async function loginUser(data: LoginData) {
    try {
        const response = await axiosInstance.post(
            "/auth/login",
            data
        );

        const result = response.data;

        // Store the JWT returned by the backend
        localStorage.setItem("token", result.token);

        return result;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Login failed"
        );
    }
}
