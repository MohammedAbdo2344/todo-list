import { NextRequest, NextResponse } from 'next/server';

// This would normally be shared with the main tasks route
// For simplicity, we'll redeclare it here
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const taskId = params.id;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    const { searchParams } = new URL(request.url);
    const restore = searchParams.get('restore') === 'true';
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    if (restore) {
      tasks[taskIndex].deletedAt = null;
    } else {
      tasks[taskIndex].deletedAt = new Date().toISOString();
    }
    
    tasks[taskIndex].updatedAt = new Date().toISOString();
    
    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
