"use client";

import { useRouter } from 'next/navigation';
import { api } from "@/lib/axios";
import Swal from "sweetalert2";

interface DeleteProjectButtonProps {
    projectId: string;
    projectName: string;
    onDelete?: () => void;
}

export function DeleteProjectButton({ projectId, projectName, onDelete }: DeleteProjectButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${projectName}". This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/api/project/${projectId}`);
                    Swal.fire(
                        'Deleted!',
                        `Project "${projectName}" has been deleted successfully.`,
                        'success'
                    );

                    if (onDelete) {
                        onDelete();
                    } else {
                        router.push('/dashboard');
                    }
                } catch (error: any) {
                    console.error('Delete project error:', error);

                    let errorMessage = 'Failed to delete project. Please try again.';
                    if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    }

                    Swal.fire(
                        'Error!',
                        errorMessage,
                        'error'
                    );
                }
            }
        });
    };

    return (
        <div className="flex items-center">
            <button
                onClick={handleDelete}
                className="text-md font-bold bg-red-500 px-3 py-1 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
                Delete Project
            </button>
        </div>
    )
}
