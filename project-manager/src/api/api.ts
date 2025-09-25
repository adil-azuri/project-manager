import { cookies } from 'next/headers';
import { Project, ApiResponse } from '@/types/project';
import { baseURL } from '@/lib/axios';

export async function fetchProjects(): Promise<{ projects: Project[]; userName: string }> {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${baseURL}/api/get-all-project`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  const data: ApiResponse<{ projects: Project[]; name: string; role: string }> = await response.json();

  if (data.code !== 200) {
    throw new Error('Failed to load projects');
  }

  return {
    projects: data.data.projects,
    userName: data.data.name,
  };
}

export async function fetchProject(id: number): Promise<Project> {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${baseURL}/api/project/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Project not found');
  }

  const data: ApiResponse<Project> = await response.json();

  if (data.code !== 200) {
    throw new Error('Project not found');
  }

  return data.data;
}

export async function fetchUserRole(): Promise<string> {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${baseURL}/api/get-all-project`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  if (response.ok) {
    const data: ApiResponse<{ role: string }> = await response.json();
    if (data.code === 200) {
      return data.data.role;
    }
  }

  return '';
}
