import { tasksApi } from '@/app/api/profiles/[profile_id]/tasks/route';
import { api } from './api';

export interface TaskCategory {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: TaskCategory;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'to-do' | 'in-progress' | 'completed';
  category_id: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  status?: 'to-do' | 'in-progress' | 'completed';
  category_id?: number;
}

export interface TaskFilters {
  profileId: number;
  categoryId?: number;
  status?: 'todo' | 'in-progress' | 'completed';
  deleted?: boolean;
}

export const taskService = {
  async getTasks(profileId: number): Promise<Task[]> {
    const response = await tasksApi.getTasks(profileId);
    return response.data || [];
  },

  async createTask(profileId: number, data: CreateTaskData): Promise<Task> {
    const response = await tasksApi.createTask(profileId, data);
    return response;
  },

  async updateTask(profile_id: number, task_id: number, data: UpdateTaskData): Promise<Task> {
    const response = await tasksApi.updateTask(profile_id, task_id, data);
    return response;
  },

  async deleteTask(profile_id: number, task_id: number): Promise<Task> {
    const response = await tasksApi.deleteTask(profile_id, task_id);
    return response;
  },

  async restoreTask(id: number): Promise<Task> {
    const response = await api.delete(`/api/tasks/${id}?restore=true`);
    return response.data;
  },

  // total and percentage of tasks
  async getTaskStats(profileId: number): Promise<{ total: number; todo: number; inProgress: number; completed: number }> {
    try {
      const [todoResponse, completedResponse, inProgressResponse] = await Promise.all([
        api.get(`/api/profiles/${profileId}/tasks/todo/percentage`),
        api.get(`/api/profiles/${profileId}/tasks/completed/percentage`),
        api.get(`/api/profiles/${profileId}/tasks/in_progress/percentage`)
      ]);

      const todoData = todoResponse.data.data;
      const completedData = completedResponse.data.data;
      const inProgressData = inProgressResponse.data.data;

      return {
        total: todoData.total || completedData.total || inProgressData.total || 0,
        todo: todoData.percentage || 0,
        inProgress: inProgressData.percentage || 0,
        completed: completedData.percentage || 0
      };
    } catch (error) {
      console.error('Error fetching task stats:', error);
      return {
        total: 0,
        todo: 0,
        inProgress: 0,
        completed: 0
      };
    }
  },
};
