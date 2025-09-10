"use client";

import { useRouter } from 'next/navigation';
import { api } from "@/lib/axios";
import Swal from "sweetalert2";

export function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, logout!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.post('/api/logout');
                    localStorage.removeItem('userData');
                    Swal.fire(
                        'Logged out!',
                        'You have been logged out.',
                        'success'
                    );
                    router.push('/');
                } catch (error) {
                    console.error('Logout error:', error);
                    Swal.fire(
                        'Error!',
                        'Failed to logout. Please try again.',
                        'error'
                    );
                }
            }
        });
    };

    return (
        <div className="flex items-center">
            <button onClick={handleLogout} className="text-md font-bold bg-red-500 px-3 py-1 text-white rounded">
                Logout
            </button>
        </div>
    )
}
