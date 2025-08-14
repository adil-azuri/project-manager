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

        // If user is not admin, only show projects assigned to them
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
        const { assignToId, title, description, status, } = req.body;
        const file = req.file;

        if (!title || title.length < 5 || title.length > 100) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "Title is required, Title must be between 5 and 100 characters"
            });
        }

        if (!assignToId) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "assignToId is required"
            });
        }

        const allowedStatuses = ['Open', 'In Progress', 'Done'];
        if (status && !allowedStatuses.includes(status as string)) {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Validation failed",
                details: "Status must be one of: Open, In Progress, Done"
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
                assignToId: parseInt(assignToId),
                title: title.trim(),
                description: description ? description.trim() : null,
                status: status || 'Open',
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
                tasks: {
                    include: {
                        assignedTo: {
                            select: {
                                id: true,
                                email: true,
                                name: true
                            }
                        }
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
