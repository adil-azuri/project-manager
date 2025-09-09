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
    userRole?: string;
}

export default function TasksSection({ projectId, tasks, onTasksUpdate, userRole }: TasksSectionProps) {
    const taskCount = Array.isArray(tasks) ? tasks.length : 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Tugas ({taskCount})</CardTitle>
                        <CardDescription>Daftar tugas dalam proyek ini</CardDescription>
                    </div>
                    {userRole === 'ADMIN' && (
                        <InputTask onTaskAdded={onTasksUpdate} projectId={projectId} />
                    )}
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
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
