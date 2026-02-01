import { authService, CreateTaskData, UpdateTaskData } from "@/lib/services";
import { Links, Meta } from "@/services/types/paginated-response";
import axios from "axios";

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

const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

export const tasksApi = {
    getTasks: async (profile_id: number) => {
        const token = authService.getAccessToken();
        if (!token) {
            throw new Error("No access token found. Please log in.");
        }
        const response = await axios.get(`${API_URL}/profiles/${profile_id}/tasks`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return response.data;
    },

    createTask: async (profile_id: number, data: CreateTaskData) => {
        const token = authService.getAccessToken();
        if (!token) {
            throw new Error("No access token found. Please log in.");
        }
        const response = await axios.post(`${API_URL}/profiles/${profile_id}/tasks`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return response.data;
    },

    updateTask: async (profile_id: number, task_id: number, data: UpdateTaskData) => {
        const token = authService.getAccessToken();
        if (!token) {
            throw new Error("No access token found. Please log in.");
        }
        const response = await axios.put(`${API_URL}/profiles/${profile_id}/tasks/${task_id}`, data, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return response.data;
    },

    deleteTask: async (profile_id: number, task_id: number) => {
        const token = authService.getAccessToken();
        if (!token) {
            throw new Error("No access token found. Please log in.");
        }
        const response = await axios.delete(`${API_URL}/profiles/${profile_id}/tasks/${task_id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return response.data;
    },
} 