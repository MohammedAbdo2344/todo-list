import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

// Dashboard data interface
interface DashboardData {
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
  recent_tasks: Array<{
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
  }>;
}

interface DashboardResponse {
  data: DashboardData;
  code: number;
  message: string;
  success: boolean;
  status: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { profile_id: string } }
) {
  try {
    const profileId = params.profile_id;
    
    if (!profileId) {
      return NextResponse.json(
        { 
          data: null,
          code: 400,
          message: 'Profile ID is required',
          success: false,
          status: 400
        },
        { status: 400 }
      );
    }

    // Call Laravel API endpoint
    const response = await axios.get<DashboardResponse>(
      `${API_URL}/profiles/${profileId}/dashboard`
    );

    return NextResponse.json(response.data);
    
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    
    // Handle different error scenarios
    if (error.response?.status === 404) {
      return NextResponse.json(
        {
          data: null,
          code: 404,
          message: 'Profile not found',
          success: false,
          status: 404
        },
        { status: 404 }
      );
    }

    if (error.response?.status === 401) {
      return NextResponse.json(
        {
          data: null,
          code: 401,
          message: 'Unauthorized',
          success: false,
          status: 401
        },
        { status: 401 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        data: null,
        code: 500,
        message: error?.response?.data?.message || 'Internal server error',
        success: false,
        status: 500
      },
      { status: 500 }
    );
  }
} 