import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, username, gender } = body;
    
    // Validation
    if (!name || !email || !password || !username || !gender) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // TODO: Implement actual user creation logic
    // 1. Check if user already exists in database
    // 2. Hash the password using bcrypt
    // 3. Create user in database
    // 4. Create default profile for the user
    // 5. Generate real JWT token
    // 6. Return user data without password
    
    // Placeholder for database integration
    console.log('Register request:', { name, email, username, gender });
    
    return NextResponse.json(
      { error: 'Registration endpoint not yet implemented with database' },
      { status: 503 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
