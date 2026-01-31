import { api } from './api';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  categoryId: string;
  profileId: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  categoryId: string;
  profileId: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  categoryId?: string;
}

export interface TaskFilters {
  profileId: string;
  categoryId?: string;
  status?: 'todo' | 'in-progress' | 'completed';
  deleted?: boolean;
}

export const taskService = {
  async getTasks(filters: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    params.append('profileId', filters.profileId);
    
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.status) params.append('status', filters.status);
    if (filters.deleted !== undefined) params.append('deleted', filters.deleted.toString());
    
    const response = await api.get(`/api/tasks?${params}`);
    return response.data;
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const response = await api.post('/api/tasks', data);
    return response.data;
  },

  async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
    const response = await api.put(`/api/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(id: string): Promise<Task> {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },

  async restoreTask(id: string): Promise<Task> {
    const response = await api.delete(`/api/tasks/${id}?restore=true`);
    return response.data;
  },

  // total and percentage of tasks
  async getTaskStats(profileId: string): Promise<{ total: number; todo: number; inProgress: number; completed: number }> {
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
