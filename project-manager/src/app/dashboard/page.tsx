'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { Navbar } from '@/components/navbar/navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  imageUrl: string;
  assignToId: number;
  assignTo: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  tasks: any[];
  categories: any[];
}

interface ApiResponse {
  code: number;
  status: string;
  message: string;
  data: {
    projects: Project[];
    name: string
    role: string;
  };
}

const DashboardSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="p-6 rounded-lg shadow-md border bg-card text-card-foreground">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse>('/api/get-all-project');

      if (response.data.code === 200) {
        setProjects(response.data.data.projects);
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserName(userData.name);
        } else {
          setUserName(response.data.data.name);
        }
      }
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUserName(userData.name);
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading projects...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            <strong>Error:</strong> {error}
            <button
              onClick={fetchProjects}
              className="ml-4 bg-destructive text-destructive-foreground px-3 py-1 rounded hover:bg-destructive/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Halo, {userName}! 👋</h1>
          <p className="text-muted-foreground mt-2">Selamat datang kembali di dashboard Anda. Berikut ringkasan proyek Anda.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <DashboardSection title={`Proyek Anda (${projects.length})`} >
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(project => (
                  <div key={project.id} className="p-4 rounded-lg border bg-secondary/50 hover:shadow-md transition-shadow flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{project.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      </div>
                      {project.imageUrl && (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-16 h-16 rounded-lg object-cover ml-2 flex-shrink-0"
                        />
                      )}
                    </div>

                    <div className="flex flex-col flex-grow">
                      <div className="mt-auto">
                        <div className="mb-3">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full
                          ${project.status === 'Open' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                              : project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                            }`}>
                            {project.status}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                          Ditugaskan kepada: {project.assignTo.name}
                        </p>


                        <Link href={`/projects/${project.id}`}>
                          <Button variant="default" size="sm" className="w-full">
                            Lihat Detail Project
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Anda belum memiliki proyek.</p>
            )}
          </DashboardSection>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
