import { NextRequest, NextResponse } from 'next/server';

// Mock data storage
let tasks = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new feature',
    status: 'todo',
    priority: 'high',
    categoryId: '1',
    profileId: '1',
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Review and approve pending PRs',
    status: 'in-progress',
    priority: 'medium',
    categoryId: '1',
    profileId: '1',
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, vegetables',
    status: 'completed',
    priority: 'low',
    categoryId: '3',
    profileId: '2',
    deletedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Deleted task example',
    description: 'This task is soft deleted',
    status: 'todo',
    priority: 'medium',
    categoryId: '2',
    profileId: '1',
    deletedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const deleted = searchParams.get('deleted') === 'true';
    
    let filteredTasks = tasks;
    
    if (profileId) {
      filteredTasks = filteredTasks.filter(t => t.profileId === profileId);
    }
    
    if (categoryId) {
      filteredTasks = filteredTasks.filter(t => t.categoryId === categoryId);
    }
    
    if (status) {
      filteredTasks = filteredTasks.filter(t => t.status === status);
    }
    
    if (deleted) {
      filteredTasks = filteredTasks.filter(t => t.deletedAt !== null);
    } else {
      filteredTasks = filteredTasks.filter(t => t.deletedAt === null);
    }
    
    return NextResponse.json(filteredTasks);
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
    const { title, description, priority, categoryId, profileId, status } = body;
    
    if (!title || !categoryId || !profileId) {
      return NextResponse.json(
        { error: 'Title, categoryId, and profileId required' },
        { status: 400 }
      );
    }
    
    const newTask = {
      id: Date.now().toString(),
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      categoryId,
      profileId,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
