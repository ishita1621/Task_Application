import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
    createUser,
    findUserByEmail,
} from "../repositories/UserRepo";

type SignupData = {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
};

export async function signupUser(data: SignupData) {
    const email = data.email.trim().toLowerCase();

    // Check whether this email is already registered
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Save the user through the repository
    return createUser({
        firstName: data.firstName.trim(),
        middleName: data.middleName?.trim() || undefined,
        lastName: data.lastName.trim(),
        email,
        password: hashedPassword,
    });
}


export async function loginUser(email: string, password: string) {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user in database
    const user = await findUserByEmail(normalizedEmail);

    // Check whether user exists
    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // Compare entered password with stored hashed password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // Generate JWT after successful authentication
    const token = jwt.sign(
        {
            userId: user.id,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "1h",
        }
    );

    // Return user details, without password
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
