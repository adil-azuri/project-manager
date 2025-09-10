// src/controller/projects.ts
import { Request, Response } from "express";
import { prisma } from "../prisma/prisma-client";
import { supabaseUploadService } from "../utility/supabase-upload";

export async function get_all_project(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role;

        if (!userId) {
            return res.status(401).json({
                code: 401,
                status: "error",
                message: "User not authenticated"
            });
        }

        let roleCurrent = {};

        if (userRole !== 'ADMIN') {
            roleCurrent = {
                assignToId: userId
            };
        }

        const projects = await prisma.projects.findMany({
            where: roleCurrent,
            orderBy: {
                id: 'desc'
            },
            include: {
                assignTo: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true
                    }
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true
                    }
                },
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        const message = userRole === 'ADMIN'
            ? "Successfully fetched all projects"
            : "Successfully fetched your assigned projects";

        res.status(200).json({
            code: 200,
            status: "success",
            message,
            data: {
                projects,
                role: userRole
            }
        });

    } catch (error: any) {
        console.error("Error fetching projects:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to fetch projects",
            cause: error.message
        });
    }
}

export async function add_project(req: Request, res: Response) {
    try {
        const { assignToId, title, description } = req.body;
        const file = req.file;

        if (!title || title.length < 5 || title.length > 100) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "Title is required, and must be between 5 and 100 characters."
            });
        }

        const parsedAssignToId = parseInt(assignToId);
        if (isNaN(parsedAssignToId)) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "assignToId is required and must be a valid number."
            });
        }

        let imageUrl = null;
        if (file) {
            try {
                const uploadResult = await supabaseUploadService.uploadFile(file);
                imageUrl = uploadResult.url;
            } catch (uploadError) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: "File upload failed",
                    cause: uploadError instanceof Error ? uploadError.message : "Unknown upload error"
                });
            }
        }

        const newProject = await prisma.projects.create({
            data: {
                assignToId: parsedAssignToId,
                title: title.trim(),
                description: description ? description.trim() : null,
                imageUrl: imageUrl
            },
            include: {
                assignTo: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json({
            code: 201,
            status: "success",
            message: "Project created successfully",
            data: newProject
        });

    } catch (error: any) {
        console.error("Error creating project:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to create project",
            cause: error.message
        });
    }
}


export async function detail_project(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id as any)

        if (isNaN(id)) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "Invalid project ID"
            });
        }

        const project = await prisma.projects.findUnique({
            where: { id },
            include: {
                assignTo: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true
                    }
                },
                tasks: true,
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!project) {
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "Project not found"
            });
        }

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Successfully fetched project details",
            data: project
        });

    } catch (error: any) {
        console.error("Error fetching project details:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to fetch project details",
            cause: error.message
        });
    }
}

export async function update_project(req: Request, res: Response) {
    try {
        const { giveto, title, description } = req.body;
        const file = req.file;
        const project_id = parseInt(req.params.id as any);

        if (isNaN(project_id)) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "Invalid project ID."
            });
        }

        if (!giveto) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "assignToId is required."
            });
        }

        const parsedgiveto = parseInt(giveto);
        if (isNaN(parsedgiveto)) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "assignToId must be a valid number."
            });
        }

        const updateData: any = {
            assignToId: parsedgiveto
        };

        if (title !== undefined) {
            if (title.length < 5 || title.length > 100) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: "Validation failed",
                    details: "Title must be between 5 and 100 characters."
                });
            }
            updateData.title = title.trim();
        }

        if (description !== undefined) {
            updateData.description = description ? description.trim() : null;
        }

        if (file) {
            try {
                const uploadResult = await supabaseUploadService.uploadFile(file);
                updateData.imageUrl = uploadResult.url;
            } catch (uploadError) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: "File upload failed",
                    cause: uploadError instanceof Error ? uploadError.message : "Unknown upload error"
                });
            }
        } else if (file === null) {
            updateData.imageUrl = null;
        }

        const updatedProject = await prisma.projects.update({
            where: { id: project_id },
            data: updateData,
            include: {
                assignTo: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Project updated successfully",
            data: updatedProject
        });

    } catch (error: any) {
        console.error("Error updating project:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to update project",
            cause: error.message
        });
    }
}

export async function delete_project(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role;
        const { id } = req.params as { id: string };


        if (!userId) {
            return res.status(401).json({
                code: 401,
                status: "error",
                message: "User not authenticated"
            });
        }

        const projectId = parseInt(id);
        if (isNaN(projectId)) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "Invalid project ID format."
            });
        }

        const project = await prisma.projects.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "Project not found"
            });
        }

        if (userRole !== 'ADMIN') {
            return res.status(403).json({
                code: 403,
                status: "error",
                message: "Only admins can delete projects"
            });
        }

        await prisma.projects.delete({
            where: { id: projectId }
        });

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Project deleted successfully"
        });

    } catch (error: any) {
        console.error("Error deleting project:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to delete project",
            cause: error.message
        });
    }
}

export async function update_project_status(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role;
        const { id } = req.params as { id: string };
        const { status } = req.body;

        if (!userId) {
            return res.status(401).json({
                code: 401,
                status: "error",
                message: "User not authenticated"
            });
        }

        const projectId = parseInt(id);
        if (isNaN(projectId)) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "Invalid project ID format."
            });
        }

        const allowedStatuses = ['Open', 'In Progress', 'Closed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Invalid status. Allowed: Open, In Progress, Closed"
            });
        }

        const project = await prisma.projects.findUnique({
            where: { id: projectId },
            include: {
                assignTo: true
            }
        });

        if (!project) {
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "Project not found"
            });
        }

        if (userRole !== 'ADMIN' && project.assignToId !== userId) {
            return res.status(403).json({
                code: 403,
                status: "error",
                message: "You can only update status of projects assigned to you"
            });
        }

        const updatedProject = await prisma.projects.update({
            where: { id: projectId },
            data: { status },
        });

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Project status updated successfully",
            data: updatedProject
        });

    } catch (error: any) {
        console.error("Error updating project status:", error);
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Failed to update project status",
            cause: error.message
        });
    }
}
