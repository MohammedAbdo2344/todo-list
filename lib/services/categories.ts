import { api } from './api';

export interface Category {
  id: string;
  name: string;
  profileId: string;
  color: string;
  createdAt: string;
}

export interface CreateCategoryData {
  name: string;
  profileId: string;
  color?: string;
}

export const categoryService = {
  async getCategories(profileId: string): Promise<Category[]> {
    const response = await api.get(`/api/categories?profileId=${profileId}`);
    return response.data;
  },

  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await api.post('/api/categories', data);
    return response.data;
  },
};
