import { NextRequest, NextResponse } from 'next/server';

// Mock data storage
let categories = [
  {
    id: '1',
    name: 'Work Tasks',
    profileId: '1',
    color: '#3B82F6',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Personal Tasks', 
    profileId: '1',
    color: '#10B981',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Shopping',
    profileId: '2',
    color: '#F59E0B',
    createdAt: new Date().toISOString(),
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    
    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID required' },
        { status: 400 }
      );
    }
    
    const profileCategories = categories.filter(c => c.profileId === profileId);
    return NextResponse.json(profileCategories);
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
    const { name, profileId, color } = body;
    
    if (!name || !profileId) {
      return NextResponse.json(
        { error: 'Name and profileId required' },
        { status: 400 }
      );
    }
    
    const newCategory = {
      id: Date.now().toString(),
      name,
      profileId,
      color: color || '#6B7280',
      createdAt: new Date().toISOString(),
    };
    
    categories.push(newCategory);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
