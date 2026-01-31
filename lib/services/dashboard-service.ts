import { api } from './api';

// Dashboard data interfaces
export interface DashboardTask {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category_id: number;
  category: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    profile_id: number;
  };
}

export interface DashboardData {
  completed: {
    percentage: number;
    total: number;
  };
  todo: {
    percentage: number;
    total: number;
  };
  in_progress: {
    percentage: number;
    total: number;
  };
  total_tasks: number;
  recent_tasks: DashboardTask[];
}

export interface DashboardResponse {
  data: DashboardData;
  code: number;
  message: string;
  success: boolean;
  status: number;
}

export class DashboardService {
  private static instance: DashboardService;

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  /**
   * Get dashboard data for a specific profile
   */
  async getDashboardData(profileId: string): Promise<DashboardData> {
    try {
      const response = await api.get<DashboardResponse>(`/api/dashboard/${profileId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch dashboard data');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Dashboard service error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Profile not found');
      }
      
      if (error.response?.status === 401) {
        throw new Error('Unauthorized access');
      }
      
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }

  /**
   * Get formatted stats for dashboard display
   */
  async getDashboardStats(profileId: string): Promise<{
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
  }> {
    const data = await this.getDashboardData(profileId);
    
    return {
      total: data.total_tasks,
      todo: data.todo.percentage,
      inProgress: data.in_progress.percentage,
      completed: data.completed.percentage,
    };
  }

  /**
   * Get recent tasks for dashboard display
   */
  async getRecentTasks(profileId: string): Promise<DashboardTask[]> {
    const data = await this.getDashboardData(profileId);
    return data.recent_tasks;
  }
}

// Export singleton instance
export const dashboardService = DashboardService.getInstance();