
import { Request, Response } from "express";
import { prisma } from "../prisma/prisma-client";


export async function add_task(req: Request, res: Response) {
    try {
        const { projectId, task } = req.body;

        if (!task) {
            return res.status(400).json({ message: "Task is required" });
        }
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const newTask = await prisma.tasks.create({
            data: {
                projectId: parseInt(projectId),
                title: task,
            },
        });

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Task successfully created.",
            data: newTask
        });
    } catch (error: any) {
        console.error("Failed to add reply:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to create reply",
            cause: error.message
        });
    }
}

export async function update_task_status(req: Request, res: Response) {
    try {
        const { taskId, status } = req.body;

        if (!taskId || !status) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "taskId and status are required."
            });
        }

        const taskIdNum = parseInt(taskId);
        if (isNaN(taskIdNum)) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "Invalid task ID format."
            });
        }

        const allowedStatuses = ['Open', 'In Progress', 'Closed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}`
            });
        }

        const task = await prisma.tasks.findUnique({
            where: { id: taskIdNum },
        });

        if (!task) {
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "Task not found"
            });
        }


        const updatedTask = await prisma.tasks.update({
            where: { id: taskIdNum },
            data: { status },
        });

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Task status updated successfully",
            data: updatedTask
        });

    } catch (error: any) {
        console.error("Error updating task status:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to update task status",
            cause: error.message
        });
    }
}
