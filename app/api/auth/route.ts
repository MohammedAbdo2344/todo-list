import { NextRequest, NextResponse } from 'next/server';

// This is a fallback route - actual endpoints are now in separate files:
// POST /api/auth/register - Create user + profile + return JWT
// POST /api/auth/login - Authenticate and return JWT  
// POST /api/auth/logout - Invalidate token
// POST /api/auth/refresh - Refresh JWT token
// GET /api/auth/user-profile - Get current user info

export async function GET() {
  return NextResponse.json({
    message: 'Authentication API endpoints:',
    endpoints: {
      'POST /api/auth/register': 'Create user + profile + return JWT',
      'POST /api/auth/login': 'Authenticate and return JWT',
      'POST /api/auth/logout': 'Invalidate token',
      'POST /api/auth/refresh': 'Refresh JWT token',
      'GET /api/auth/user-profile': 'Get current user info',
    }
  });
}

export async function POST() {
  return NextResponse.json(
    { error: 'Invalid endpoint. Use /api/auth/login, /api/auth/register, etc.' },
    { status: 404 }
  );
}
