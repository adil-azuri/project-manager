'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/axios';
import InputTask from '@/components/add-task';
import { ProjectStatusBadge } from '@/components/project-status-badge';
import { Navbar } from '@/components/navbar/navbar';
import TasksSection from '@/components/tasks-section';
import { DeleteProjectButton } from '@/components/delete-project-button';

interface AssignTo {
    id: number;
    email: string;
    name: string;
    role: string;
}

interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
    priority?: string;
    dueDate?: string;
    createdAt?: string;
}

interface Project {
    id: number;
    title: string;
    description: string;
    status: string;
    imageUrl: string;
    assignToId: number;
    assignTo: AssignTo;
    tasks: Task[];
    categories: any[];
}

interface ApiResponse {
    code: number;
    status: string;
    message: string;
    data: Project;
}

export default function ProjectDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            try {
                setLoading(true);
                const response = await api.get<ApiResponse>(`/api/project/${id}`);

                if (response.data?.data && response.data.code === 200) {
                    setProject(response.data.data);
                } else {
                    setError('Project not found');
                }
            } catch (err: any) {
                console.error('Error fetching project:', err);
                setError(err.response?.data?.message || 'Failed to fetch project');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const reFetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get<ApiResponse>(`/api/project/${id}`);

            if (response.data?.data && response.data.code === 200) {
                setProject(response.data.data);
            }
        } catch (err: any) {
            console.error('Error re-fetching project:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (projectId: number, newStatus: string) => {
        try {
            await api.patch(`/api/project/status/${projectId}`, {
                status: newStatus,
            });
            reFetchData();
        } catch (err) {
            console.error('Error updating project status:', err);
        }
    };

    // Fungsi-fungsi styling sudah dipindahkan ke komponen TasksSection

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <span className="ml-3 text-muted-foreground">Loading project...</span>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
                        <strong>Error:</strong> {error || 'Project not found'}
                    </div>
                    <div className="mt-4">
                        <Link href="/dashboard">
                            <Button variant="outline">← Kembali ke Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <Navbar />

            <div className="max-w-6xl mx-auto mt-5 space-y-6">
                <div className="mb-6">
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm">
                            ← Kembali ke Dashboard
                        </Button>
                    </Link>
                </div>

                <Card className="overflow-hidden">
                    <div className="relative">
                        {project.imageUrl && (
                            <div className="h-48 md:h-64 bg-gradient-to-r from-primary/10 to-primary/5">
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                                    <p className="text-muted-foreground text-lg">{project.description}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <ProjectStatusBadge
                                        projectId={project.id}
                                        currentStatus={project.status}
                                        onStatusChange={(newStatus) => handleStatusChange(project.id, newStatus)}
                                    />
                                </div>
                            </div>

                            <hr className="my-6" />

                            <div className="flex">
                                <div className=' w-full'>
                                    <h3 className=" font-semibold mb-2 text-muted-foreground">Ditugaskan kepada</h3>
                                    <div className="flex items-center space-x-3">
                                        <div className='flex justify-between  w-full '>
                                            <div>
                                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                                                    {project.assignTo.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{project.assignTo.name}</p>
                                                    <p className="text-sm text-muted-foreground">{project.assignTo.email}</p>
                                                </div>
                                            </div>


                                            <div className=' flex flex-col space-y-5 mr-10'>
                                                <Link href={`/projects/${project.id}/edit`}>
                                                    <Button className='bg-blue-500 hover:bg-blue-600 w-full'>
                                                        Edit Project
                                                    </Button>
                                                </Link>
                                                <DeleteProjectButton
                                                    projectId={project.id.toString()}
                                                    projectName={project.title}
                                                    onDelete={() => {
                                                        window.location.href = '/dashboard';
                                                    }}
                                                />
                                            </div>


                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </Card>

                <hr className="my-6" />



                <TasksSection
                    projectId={project.id}
                    tasks={project.tasks || []}
                    onTasksUpdate={reFetchData}
                />


            </div>
        </div>
    );
}