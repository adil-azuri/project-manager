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
import { ChevronDown, Loader2 } from "lucide-react";

interface ProjectStatusBadgeProps {
    projectId: number;
    currentStatus: string;
    onStatusChange?: (newStatus: string) => void;
    size?: "sm" | "md" | "lg";
    readonly?: boolean;
}

const statusConfig = {
    "Open": {
        label: "Open",
        color: "bg-green-100 text-white dark:bg-green-900 dark:bg-green-700",
        hoverColor: "hover:bg-green-200 dark:hover:bg-green-800",
        dotColor: "bg-green-500",
    },
    "In Progress": {
        label: "In Progress",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-white",
        hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-700",
        dotColor: "bg-blue-500",
    },
    "Closed": {
        label: "Closed",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        hoverColor: "hover:bg-red-200 dark:hover:bg-red-800",
        dotColor: "bg-red-500",
    },
};

export function ProjectStatusBadge({
    projectId,
    currentStatus,
    onStatusChange,
    size = "md",
    readonly = false,
}: ProjectStatusBadgeProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        if (readonly) return;

        if (onStatusChange && typeof onStatusChange === "function") {
            setIsLoading(true);
            try {
                await onStatusChange(newStatus);
            } catch (error) {
                console.error("Failed to update project status:", error);
            } finally {
                setIsLoading(false);
            }
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
            <Badge className={`${getStatusColor(currentStatus)} ${sizeClasses[size]} cursor-default`}>
                {getStatusLabel(currentStatus)}
            </Badge>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    className={`h-auto p-0 hover:bg-transparent transition-all duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={isLoading}
                >
                    <Badge
                        className={`${getStatusColor(currentStatus)} ${sizeClasses[size]} cursor-pointer transition-all duration-200 flex items-center gap-1 border-2 border-transparent hover:border-gray-300`}
                    >
                        {getStatusLabel(currentStatus)}
                        {isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <ChevronDown className="h-3 w-3" />
                        )}
                    </Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
                {Object.entries(statusConfig).map(([key, config]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => handleStatusChange(key)}
                        className={`cursor-pointer ${currentStatus === key ? "bg-accent" : ""
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
