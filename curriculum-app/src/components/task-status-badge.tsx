"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { api } from "@/lib/axios";

interface TaskStatusBadgeProps {
    taskId: number;
    currentStatus: string;
    onStatusChange?: (newStatus: string) => void;
    size?: "sm" | "md" | "lg";
    readonly?: boolean;
}

const statusConfig = {
    "Open": {
        label: "Open",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        hoverColor: "hover:bg-green-200 dark:hover:bg-green-800",
        dotColor: "bg-green-500",
    },
    "In Progress": {
        label: "In Progress",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-800",
        dotColor: "bg-blue-500",
    },
    "Closed": {
        label: "Closed",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        hoverColor: "hover:bg-red-200 dark:hover:bg-red-800",
        dotColor: "bg-red-500",
    },
};

export function TaskStatusBadge({
    taskId,
    currentStatus,
    onStatusChange,
    size = "md",
    readonly = false,
}: TaskStatusBadgeProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        if (readonly) return;

        setIsLoading(true);
        try {
            await api.patch(`/api/task/status/`, {
                taskId: taskId,
                status: newStatus,
            });

            setStatus(newStatus);
            onStatusChange?.(newStatus);
        } catch (error) {
            console.error("Failed to update task status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        return statusConfig[status as keyof typeof statusConfig]?.color || "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status: string) => {
        return statusConfig[status as keyof typeof statusConfig]?.label || status;
    };

    const sizeClasses = {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
    };

    if (readonly) {
        return (
            <Badge className={`${getStatusColor(status)} ${sizeClasses[size]} cursor-default`}>
                {getStatusLabel(status)}
            </Badge>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={`h-auto p-0 hover:bg-transparent transition-all duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={isLoading}
                >
                    <Badge
                        className={`${getStatusColor(status)} ${sizeClasses[size]} cursor-pointer transition-all duration-200 flex items-center gap-1 border-2 border-transparent hover:border-gray-300`}
                    >
                        {getStatusLabel(status)}
                        <ChevronDown className="h-3 w-3" />
                    </Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
                {Object.entries(statusConfig).map(([key, config]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => handleStatusChange(key)}
                        className={`cursor-pointer ${status === key ? "bg-accent" : ""
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                            <span>{config.label}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
