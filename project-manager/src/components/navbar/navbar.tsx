'use client';
import { useEffect, useState } from 'react';
import { Logout } from "@/components/auth/logout-button";
import { api } from "@/lib/axios";

export function Navbar() {
    const [userRole, setUserRole] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await api.get('/api/get-all-project');
                if (response.data.code === 200) {
                    setUserRole(response.data.data.role);
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4 px-4">
                <a href="/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-primary font-semibold text-lg">Project     Manager</span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
                    <div className="flex items-center space-x-4">
                        {userRole === 'ADMIN' && (
                            <a
                                href="/add-project"
                                className="text-primary hover:text-primary/80 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Add Project
                            </a>
                        )}
                        <Logout />
                    </div>
                    <button
                        data-collapse-toggle="navbar-cta"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-muted-foreground rounded-lg md:hidden hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-controls="navbar-cta"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    )
}
