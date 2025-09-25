import React from 'react';
import { Navbar } from '@/components/navbar/navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchProjects } from '@/api/api';
import { Project } from '@/types/project';

const DashboardSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="p-6 rounded-lg shadow-md border bg-card text-card-foreground">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};

export const dynamic = "force-dynamic";

const Dashboard = async () => {
  let projects: Project[] = [];
  let userName = '';
  let error: string | null = null;

  try {
    const result = await fetchProjects();
    projects = result.projects;
    userName = result.userName;
  } catch (err: unknown) {
    console.error('Error fetching projects:', err);
    error = err instanceof Error ? err.message : 'Failed to fetch projects';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            <strong>Error:</strong> {error}
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
          <h1 className="text-3xl font-bold text-foreground">Hello, {userName}! 👋</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <DashboardSection title={`Your Projects (${projects.length})`}>
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
                              : project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                            }`}>
                            {project.status}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                          Assigned to: {project.assignTo.name}
                        </p>

                        <Link href={`/projects/${project.id}`}>
                          <Button variant="default" size="sm" className="w-full">
                            View Project Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">You don&apos;t have any projects yet.</p>
            )}
          </DashboardSection>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
