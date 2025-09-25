import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma/prisma-client";
import { signToken } from "../utility/jwt";
const router = express.Router();

// CREATE User  
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({ error: 'Email, name, and password are required' });
        }

        const validateUserInput = (name: string, email: string, password: string): string | null => {
            if (name.length <= 4) {
                return 'Invalid name';
            }
            if (!email.includes('@') || email.length <= 10) {
                return 'Invalid email';
            }
            if (password.length < 6) {
                return 'Password must be at least 6 characters';
            }
            return null;
        };

        const validationError = validateUserInput(name, email, password);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user already exists
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    { email },
                    { name }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Name or Email already exists' });
        }

        // Create new user using Prisma
        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });

        res.status(201).json({
            message: 'User registered successfully',
            data: newUser
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

// Login User
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }

        // Find user using Prisma
        const user = await prisma.users.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'User or password invalid' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'User or password invalid' });
        }

        const token = signToken({
            id: user.id,
            email,
            name: user.name,
            role: user.role
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        const { password: _, ...userData } = user;
        res.json({
            message: 'Login successful',
            data: userData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout User
router.post('/logout', async (req: Request, res: Response) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.json({
            message: 'Logout successful'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Logout failed' });
    }
});

router.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        res.json({
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

export default router;
