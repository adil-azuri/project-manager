'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputTask from '@/components/Task_Component/add-task';
import { TaskStatusBadge } from '@/components/Task_Component/task-status-badge';
import { Task } from '@/types/project';

interface TasksSectionProps {
    projectId: number;
    tasks: Task[];
    onTasksUpdate?: () => void;
    userRole?: string;
}

const statusOrder = {
    "Open": 1,
    "In Progress": 2,
    "Closed": 3,
};

export default function TasksSection({ projectId, tasks, onTasksUpdate = () => {}, userRole }: TasksSectionProps) {
    const taskCount = Array.isArray(tasks) ? tasks.length : 0;

    const sortedTasks = Array.isArray(tasks)
        ? [...tasks].sort((a, b) => {
            const orderA = statusOrder[a.status as keyof typeof statusOrder] || 4;
            const orderB = statusOrder[b.status as keyof typeof statusOrder] || 4;
            return orderA - orderB;
        })
        : [];

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Tasks ({taskCount})</CardTitle>
                        <CardDescription>List of tasks in this project</CardDescription>
                    </div>
                    {userRole === 'ADMIN' && (
                        <InputTask onTaskAdded={onTasksUpdate} projectId={projectId} />
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {sortedTasks.length > 0 ? (
                        sortedTasks.map((task) => (
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
                                                    Due: {new Date(task.dueDate).toLocaleDateString('en-US')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">No tasks for this project yet</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
