'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InputTask from '@/components/add-task';
import { TaskStatusBadge } from './task-status-badge';
import { Task } from '@/types/project';

interface TasksSectionProps {
    projectId: number;
    tasks: Task[];
    onTasksUpdate: () => void;
}

export default function TasksSection({ projectId, tasks, onTasksUpdate }: TasksSectionProps) {

    const statusColors: Record<string, string> = {
        open: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        'in progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
        closed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    };

    const priorityColors: Record<string, string> = {
        high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    };

    const getTaskStatusColor = (status: string = '') => {
        return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    };

    const getPriorityColor = (priority?: string) => {
        if (!priority) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
        return priorityColors[priority.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    };

    const taskCount = Array.isArray(tasks) ? tasks.length : 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Tugas ({taskCount})</CardTitle>
                        <CardDescription>Daftar tugas dalam proyek ini</CardDescription>
                    </div>
                    <InputTask onTaskAdded={onTasksUpdate} projectId={projectId} />
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {Array.isArray(tasks) && tasks.length > 0 ? (
                        tasks.map((task) => (
                            <Card key={task.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center">
                                        <div className="flex-1 mb-2 md:mb-0">
                                            <h4 className="font-semibold text-lg">{task.title}</h4>
                                            {task.description && (
                                                <p className="text-sm text-muted-foreground">{task.description}</p>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0 flex items-center gap-2 text-sm">
                                            <TaskStatusBadge
                                                taskId={task.id}
                                                currentStatus={task.status}
                                                onStatusChange={onTasksUpdate}
                                                size="sm"
                                            />
                                            {task.priority && (
                                                <Badge className={getPriorityColor(task.priority)}>
                                                    {task.priority}
                                                </Badge>
                                            )}
                                            {task.dueDate && (
                                                <div className="text-xs text-muted-foreground whitespace-nowrap">
                                                    Due: {new Date(task.dueDate).toLocaleDateString('id-ID')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">
                                Belum ada tugas untuk proyek ini
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Tambahkan tugas baru untuk memulai
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
