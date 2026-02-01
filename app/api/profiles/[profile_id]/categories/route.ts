import { authService } from "@/lib/services";
import { Links, Meta } from "@/services/types/paginated-response";
import axios from "axios";

export interface Category {
    id: number;
    name: string;
    profile_id: number;
}

export interface CategoriesApiResponse {
    data: Category[];
    links: Links;
    meta: Meta;
    code: number;
    message: string;
    success: boolean;
    status: number;
}

export interface CategoryApiResponse {
    data: Category;
    code: number;
    message: string;
    success: boolean;
    status: number;
}

const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

export const categoriesApi = {
    getCategories: async (profile_id: number) => {
        const token = authService.getAccessToken();
        if (!token) {
            throw new Error("No access token found. Please log in.");
        }
        const response = await axios.get(`${API_URL}/profiles/${profile_id}/categories`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return response.data;
    },

    createCategory: async (profile_id: number, name: string) => {
        const token = authService.getAccessToken();
        if (!token) {
            throw new Error("No access token found. Please log in.");
        }
        const response = await axios.post(`${API_URL}/profiles/${profile_id}/categories`, 
            { name },
            {
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        return response.data;
    },

    updateCategory: async (profile_id: number, category_id: number, name: string) => {
        const token = authService.getAccessToken();
        if (!token) {
            throw new Error("No access token found. Please log in.");
        }
        const response = await axios.put(`${API_URL}/profiles/${profile_id}/categories/${category_id}`, 
            { name },
            {
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        return response.data;
    },

    deleteCategory: async (profile_id: number, category_id: number) => {
        const token = authService.getAccessToken();
        if (!token) {
            throw new Error("No access token found. Please log in.");
        }
        const response = await axios.delete(`${API_URL}/profiles/${profile_id}/categories/${category_id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        return response.data;
    },
}; 