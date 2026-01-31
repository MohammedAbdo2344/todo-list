import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // TODO: Implement actual authentication logic
    // 1. Find user by email in database
    // 2. Compare hashed password using bcrypt
    // 3. Get user profiles from database
    // 4. Generate real JWT token
    // 5. Return user data without password
    
    // Placeholder for database integration
    console.log('Login request:', { body });
    
    // Call external API for authentication
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });

    console.log('Login response ==============>:', response.data);
    
    const { token, profile } = response.data;
    
    // Check if user data exists
    if (!profile) {
      return NextResponse.json(
        { error: 'User data not found in response' },
        { status: 400 }
      );
    }
    
    // Create response with user data
    const apiResponse = NextResponse.json({
      user: profile,
      token: token.access_token
    });
    
    // Set access token in HTTP-only cookie
    apiResponse.cookies.set('access_token', token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
      path: '/'
    });
    
    return apiResponse;
    
  } catch (error: any) {
    console.log('Login error:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Login failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
