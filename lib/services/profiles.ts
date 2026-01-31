import { api } from './api';

export interface Profile {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export interface CreateProfileData {
  name: string;
  userId: string;
}

export const profileService = {
  async getProfiles(userId: string): Promise<Profile[]> {
    const response = await api.get(`/api/profiles?userId=${userId}`);
    return response.data;
  },

  async createProfile(data: CreateProfileData): Promise<Profile> {
    const response = await api.post('/api/profiles', data);
    return response.data;
  },
};
