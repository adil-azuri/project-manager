import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utility/app-error";
import { prisma } from "../prisma/prisma-client";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
    if (!token) {
        return next(new AppError("Authentication required", 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    } catch (err) {
        next(new AppError("Invalid token", 401));
    }
};

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return next(new AppError("User not authenticated", 401));
        }

        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user || user.role !== 'ADMIN') {
            return next(new AppError("Forbidden: Admin access required", 403));
        }

        next();
    } catch (error) {
        next(new AppError("Authorization failed", 500));
    }
};