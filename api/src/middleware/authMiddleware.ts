
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: number;
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export function authenticateToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    // Check whether token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Token is missing.",
        });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    jwt.verify(
        token,
        process.env.JWT_SECRET!,
        (error, decoded) => {
            if (error) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or expired token.",
                });
            }

            const payload = decoded as JwtPayload;

            // Attach user information to request
            req.user = {
                userId: payload.userId,
            };

            // Continue to next middleware or controller
            next();
        }
    );
}
