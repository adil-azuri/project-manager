export interface AssignTo {
    id: number;
    email: string;
    name: string;
    role: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
    priority?: string;
    dueDate?: string;
    createdAt?: string;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    status: string;
    imageUrl: string;
    assignToId: number;
    assignTo: AssignTo;
    tasks: Task[];
    categories: any[];
}

export interface ApiResponse<T> {
    code: number;
    status: string;
    message: string;
    data: T;
}
