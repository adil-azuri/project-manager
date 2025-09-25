import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

import { fetchProject, fetchUserRole } from '@/api/api';
import { Project } from '@/types/project';

import { ProjectStatusBadge } from '@/components/Projects_Component/project-status-badge';
import { Navbar } from '@/components/navbar/navbar';
import TasksSection from '@/components/Task_Component/tasks-section';
import { DeleteProjectButton } from '@/components/Projects_Component/delete-project-button';
export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);

  let project: Project | null = null;
  let userRole = '';
  let error: string | null = null;

  try {
    project = await fetchProject(id);
    userRole = await fetchUserRole();
  } catch (err: unknown) {
    console.error('Error fetching data:', err);
    error = err instanceof Error ? err.message : 'Failed to fetch project';
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
          <div className="mt-4">
            <Link href="/dashboard">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading project...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-5 space-y-6">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[400px]">
            {project.imageUrl && (
              <div className="lg:w-1/3 flex items-center justify-center p-6 bg-secondary/50">
                <div className="w-64 h-64 flex items-center justify-center">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={256}
                    height={256}
                    className="w-full h-full object-contain"
                    unoptimized={true}
                  />
                </div>
              </div>
            )}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1 min-h-[100px]">
                    <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                    <p className="text-muted-foreground text-lg min-h-[80px] flex items-center">{project.description || 'No description available.'}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <ProjectStatusBadge
                      projectId={project.id}
                      currentStatus={project.status}
                    />
                  </div>
                </div>

                <hr className="my-6" />

                <div>
                  <h3 className="font-semibold mb-2 text-muted-foreground">Assigned to</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {project.assignTo.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{project.assignTo.name}</p>
                        <p className="text-sm text-muted-foreground">{project.assignTo.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {userRole === 'ADMIN' && (
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t">
                  <DeleteProjectButton
                    projectId={project.id.toString()}
                    projectName={project.title}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        <hr className="my-6" />

        <div>
          <TasksSection
            projectId={project.id}
            tasks={project.tasks || []}
            userRole={userRole}
          />
        </div>
      </div>
    </div>
  );
}
