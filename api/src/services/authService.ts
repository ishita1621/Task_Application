import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    createUser,
    findUserByEmail,
} from "../repositories/UserRepo";

import type { CreateUserData } from "../types/Task";

export async function signupUser(data: CreateUserData) {
    // Normalize email
    const email = data.email.trim().toLowerCase();

    // Check whether the email is already registered
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // Hash the decrypted password using bcrypt
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user in the database
    const user = await createUser({
        firstName: data.firstName.trim(),
        middleName: data.middleName?.trim() || undefined,
        lastName: data.lastName.trim(),
        email,
        password: hashedPassword,
    });

    return user;
}

export async function loginUser(email: string, password: string) {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // Compare entered password with stored bcrypt hash
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // Generate JWT
    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );

    // Return safe user details (never return password hash)
    return {
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
        },
    };
}