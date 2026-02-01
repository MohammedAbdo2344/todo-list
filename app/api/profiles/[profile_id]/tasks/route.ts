import { Links, Meta } from "@/services/types/paginated-response";

export interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'to-do' | 'in-progress' | 'completed';
    created_at: string;
    category: {
        id: number;
        name: string;
    };
}

export interface TasksApiResponse {
    data: Task[];
    links: Links;
    meta: Meta;
    code: number;
    message: string;
    success: boolean;
    status: number;
}

export const tasksApi = {
  gettasks:async ()=>{
    
  }, 
} 