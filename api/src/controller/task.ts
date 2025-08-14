import { Request, Response } from "express";
import { prisma } from "../prisma/prisma-client";
import { verifyToken } from "../utility/jwt";

// GET all tasks with optional project filter
export async function get_tasks(req: Request, res: Response) {
    try {
        const { project_id } = req.query;

        const whereClause = project_id ? {
            project_id: parseInt(project_id as string)
        } : {};

        const tasks = await prisma.task.findMany({
            where: whereClause,
            orderBy: {
                created_at: 'desc'
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                assigned_to: {
                    select: {
                        id: true,
                        username: true,
                        full_name: true,
                        photo_profile: true
                    }
                },
                created_by_user: {
                    select: {
                        id: true,
                        username: true,
                        full_name: true
                    }
                }
            }
        });

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Successfully fetched tasks",
            data: tasks
        });
    } catch (error: any) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to fetch tasks",
            cause: error.message
        });
    }
}

// GET single task by ID
export async function get_task_by_id(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                assigned_to: {
                    select: {
                        id: true,
                        username: true,
                        full_name: true,
                        photo_profile: true
                    }
                },
                created_by_user: {
                    select: {
                        id: true,
                        username: true,
                        full_name: true
                    }
                }
            }
        });

        if (!task) {
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "Task not found"
            });
        }

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Successfully fetched task",
            data: task
        });
    } catch (error: any) {
        console.error("Error fetching task:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to fetch task",
            cause: error.message
        });
    }
}

// POST create new task
export async function add_tasks(req: Request, res: Response) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({
            code: 401,
            status: "error",
            message: "Unauthorized"
        });
    }

    let account;
    try {
        account = verifyToken(token);
    } catch (err) {
        return res.status(403).json({
            code: 403,
            status: "error",
            message: "Invalid or expired token"
        });
    }

    try {
        const {
            project_id,
            title,
            description,
            status,
            priority,
            due_date,
            assigned_to_id
        } = req.body;

        // Validasi required fields
        if (!project_id) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Project ID is required"
            });
        }
        if (!title) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Title is required"
            });
        }

        const newTask = await prisma.task.create({
            data: {
                project_id: parseInt(project_id),
                title,
                description: description || null,
                status: status || 'TODO',
                priority: priority || 'MEDIUM',
                due_date: due_date ? new Date(due_date) : null,
                assigned_to_id: assigned_to_id ? parseInt(assigned_to_id) : null,
                created_by: account.id
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                assigned_to: {
                    select: {
                        id: true,
                        username: true,
                        full_name: true,
                        photo_profile: true
                    }
                },
                created_by_user: {
                    select: {
                        id: true,
                        username: true,
                        full_name: true
                    }
                }
            }
        });

        res.status(201).json({
            code: 201,
            status: "success",
            message: "Task successfully created",
            data: newTask
        });
    } catch (error: any) {
        console.error("Failed to create task:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to create task",
            cause: error.message
        });
    }
}

// PUT update task
export async function update_task(req: Request, res: Response) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({
            code: 401,
            status: "error",
            message: "Unauthorized"
        });
    }

    let account;
    try {
        account = verifyToken(token);
    } catch (err) {
        return res.status(403).json({
            code: 403,
            status: "error",
            message: "Invalid or expired token"
        });
    }

    try {
        const { id } = req.params;
        const {
            title,
            description,
            status,
            priority,
            due_date,
            assigned_to_id
        } = req.body;

        // Cek apakah task ada
        const existingTask = await prisma.task.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingTask) {
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "Task not found"
            });
        }

        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                title: title !== undefined ? title : existingTask.title,
                description: description !== undefined ? description : existingTask.description,
                status: status !== undefined ? status : existingTask.status,
                priority: priority !== undefined ? priority : existingTask.priority,
                due_date: due_date !== undefined ? (due_date ? new Date(due_date) : null) : existingTask.due_date,
                assigned_to_id: assigned_to_id !== undefined ? (assigned_to_id ? parseInt(assigned_to_id) : null) : existingTask.assigned_to_id
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                assigned_to: {
                    select: {
                        id: true,
                        username: true,
                        full_name: true,
                        photo_profile: true
                    }
                },
                created_by_user: {
                    select: {
                        id: true,
                        username: true,
                        full_name: true
                    }
                }
            }
        });

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Task successfully updated",
            data: updatedTask
        });
    } catch (error: any) {
        console.error("Failed to update task:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to update task",
            cause: error.message
        });
    }
}

// DELETE task
export async function delete_task(req: Request, res: Response) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({
            code: 401,
            status: "error",
            message: "Unauthorized"
        });
    }

    let account;
    try {
        account = verifyToken(token);
    } catch (err) {
        return res.status(403).json({
            code: 403,
            status: "error",
            message: "Invalid or expired token"
        });
    }

    try {
        const { id } = req.params;

        // Cek apakah task ada
        const existingTask = await prisma.task.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingTask) {
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "Task not found"
            });
        }

        await prisma.task.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Task successfully deleted"
        });
    } catch (error: any) {
        console.error("Failed to delete task:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to delete task",
            cause: error.message
        });
    }
}
