import type { Request, Response } from "express";
import { signupUser, loginUser } from "../services/authService";
import { getPublicKey } from "../utils/encryption";
import { decryptPassword } from "../utils/decryptPassword";

export async function signup(req: Request, res: Response) {
    try {
        const {
            firstName,
            middleName,
            lastName,
            email,
            password: encryptedPassword,
            confirmPassword: encryptedConfirmPassword,
        } = req.body;
        // Basic validation
        if (
            typeof firstName !== "string" ||
            !firstName.trim() ||
            typeof lastName !== "string" ||
            !lastName.trim() ||
            typeof email !== "string" ||
            !email.trim() ||
            typeof encryptedPassword !== "string" ||
            !encryptedPassword ||
            typeof encryptedConfirmPassword !== "string" ||
            !encryptedConfirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        let password: string;
        let confirmPassword: string;

        try {
            password = decryptPassword(encryptedPassword);
            confirmPassword = decryptPassword(encryptedConfirmPassword);
        } catch (error) {
            console.error("Password decryption failed:", error);

            return res.status(400).json({
                success: false,
                message: "Unable to decrypt password",
            });
        }

        // Compare decrypted passwords
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Validate decrypted password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
        }

        const user = await signupUser({
            firstName: firstName.trim(),
            middleName:
                typeof middleName === "string"
                    ? middleName.trim()
                    : undefined,
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password,
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "EMAIL_ALREADY_EXISTS"
        ) {
            return res.status(409).json({
                success: false,
                message: "This email is already registered",
            });
        }

        console.error("Signup error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating your account",
        });
    }
}

export async function login(req: Request, res: Response) {
    console.log("Login body:", req.body);
    console.log("Email:", req.body?.email);
    console.log("Password exists:", Boolean(req.body?.password));
    try {
        const { email, encryptedPassword } = req.body;

        // Validate required fields
        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof encryptedPassword !== "string" ||
            !encryptedPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        let password: string;

        try {
            password = decryptPassword(encryptedPassword);
            console.log("Decrypted password length:", password.length);
        } catch (error) {
            console.error("Password decryption failed");

            return res.status(400).json({
                success: false,
                message: "Unable to decrypt password",
            });
        }


        // Call login service
        const result = await loginUser(email, password);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: result.user,
            token: result.token,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "INVALID_CREDENTIALS"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging in",
        });
    }
}


export function getEncryptionPublicKey(
    req: Request,
    res: Response
) {
    try {
        const publicKey = getPublicKey();

        return res.status(200).json({
            success: true,
            publicKey,
        });
    } catch (error) {
        console.error("Public key error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve encryption public key",
        });
    }
}
