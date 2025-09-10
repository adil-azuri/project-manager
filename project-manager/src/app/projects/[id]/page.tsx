'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/axios';
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
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>('');

    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            try {
                const response = await api.get<ApiResponse>(`/api/project/${id}`);

                if (response.data?.data && response.data.code === 200) {
                    setProject(response.data.data);
                } else {
                    setError('Project not found');
                }
            } catch (err: any) {
                console.error('Error fetching project:', err);
                setError(err.response?.data?.message || 'Failed to fetch project');
            }
        };

        fetchProject();
    }, [id]);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await api.get('/api/get-all-project');
                if (response.data.code === 200) {
                    setUserRole(response.data.data.role);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

    const reFetchData = async () => {
        try {
            const response = await api.get<ApiResponse>(`/api/project/${id}`);

            if (response.data?.data && response.data.code === 200) {
                setProject(response.data.data);
            }
        } catch (err: any) {
            console.error('Error re-fetching project:', err);
        }
    };

    const handleStatusChange = async (projectId: number, newStatus: string) => {
        if (!project) return;
        const previousStatus = project.status;
        setProject({ ...project, status: newStatus });

        try {
            await api.patch(`/api/project/status/${projectId}`, {
                status: newStatus,
            });
        } catch (err) {
            console.error('Error updating project status:', err);
            setProject({ ...project, status: previousStatus });
            alert('Failed to update status. Please try again.');
        }
    };

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
                        <strong>Error:</strong> {error}
                    </div>
                    <div className="mt-4">
                        <Link href="/dashboard">
                            <Button variant="outline">← Back to Dashboard</Button>
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
                            ← Back to Dashboard
                        </Button>
                    </Link>
                </div>

                <Card className="overflow-hidden">
                    <div className="relative flex">
                        {project?.imageUrl && (
                            <div className="mx-5 my-auto flex justify-center">
                                <div className="flex items-center justify-center w-70 h-70">
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{project?.title || 'Loading...'}</h1>
                                    <p className="text-muted-foreground text-lg">{project?.description || 'Loading project details...'}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <ProjectStatusBadge
                                        projectId={project?.id ?? 0}
                                        currentStatus={project?.status ?? "Open"}
                                        onStatusChange={(newStatus) => handleStatusChange(project?.id ?? 0, newStatus)}
                                    />
                                </div>
                            </div>

                            <hr className="my-6" />

                            <div className="flex">
                                <div className=' w-full'>
                                    <h3 className=" font-semibold mb-2 text-muted-foreground">Assigned to</h3>
                                    <div className="flex items-center space-x-3">
                                        <div className='flex justify-between  w-full '>
                                            <div className='flex gap-4'>
                                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                                                    {project?.assignTo.name.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{project?.assignTo.name || 'Loading...'}</p>
                                                    <p className="text-sm text-muted-foreground">{project?.assignTo.email || 'Loading...'}</p>
                                                </div>
                                            </div>


                                            {userRole === 'ADMIN' && project && (
                                                <div className=' flex flex-col justify-end space-y-5 mr-10'>
                                                    <Link href={`/projects/${project.id}`} className='flex justify-center'>
                                                        <Button className=' text-md font-bold bg-blue-500 px-3 py-1 text-white rounded hover:bg-blue-600 transition-colors'>
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
                                            )}


                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </Card>

                <hr className="my-6" />

                {project ? (
                    <div>
                        <TasksSection
                            projectId={project.id}
                            tasks={project.tasks || []}
                            onTasksUpdate={reFetchData}
                            userRole={userRole}
                        />
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3 text-muted-foreground">Loading tasks...</span>
                    </div>
                )}


            </div>
        </div>
    );
}