import React, { useState, useRef, useEffect } from "react";
import { Plus, Check, X } from "lucide-react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface InputTaskProps {
    onTaskAdded?: () => void;
    projectId: number;
}

export default function InputTask({ onTaskAdded, projectId }: InputTaskProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    async function handleSubmit() {
        if (!value.trim()) {
            Swal.fire({
                title: "Warning",
                text: "Task cannot be empty!",
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        }

        const result = await Swal.fire({
            title: "Confirmation",
            text: `Are you sure you want to add this task?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, add it",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            await api.post("/api/tasks/add", {
                projectId: projectId,
                task: value,
            });

            Swal.fire({
                title: "Success!",
                text: "Task added successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            setValue("");
            setOpen(false);
            if (onTaskAdded) {
                onTaskAdded();
            }
        } catch (error) {
            console.error("Gagal mengirim task:", error);
            Swal.fire({
                title: "Failed",
                text: "An error occurred while adding the task.",
                icon: "error",
            });
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") handleSubmit();
        if (e.key === "Escape") {
            setValue("");
            setOpen(false);

        }
    }

    return (
        <div className="inline-flex items-center gap-2">
            {!open ? (
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-1 px-3 py-2 rounded bg-black text-white"
                >
                    <Plus size={16} /> Add Task
                </button>
            ) : (
                <>
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write something..."
                        className="px-3 py-2 rounded border border-gray-300"
                    />
                    <button
                        onClick={handleSubmit}
                        className="p-2 rounded bg-green-500 text-white"
                    >
                        <Check size={16} />
                    </button>
                    <button
                        onClick={() => {
                            setValue("");
                            setOpen(false);
                        }}
                        className="p-2 rounded bg-red-500 text-white"
                    >
                        <X size={16} />
                    </button>
                </>
            )}
        </div>
    );
}
