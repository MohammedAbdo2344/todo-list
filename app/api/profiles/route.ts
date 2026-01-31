import { NextRequest, NextResponse } from 'next/server';

// Mock data storage
let profiles: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }
    
    const userProfiles = profiles.filter(p => p.userId === userId);
    return NextResponse.json(userProfiles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, userId } = body;
    
    if (!name || !userId) {
      return NextResponse.json(
        { error: 'Name and userId required' },
        { status: 400 }
      );
    }
    
    const newProfile = {
      id: Date.now().toString(),
      name,
      userId,
      createdAt: new Date().toISOString(),
    };
    
    profiles.push(newProfile);
    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
