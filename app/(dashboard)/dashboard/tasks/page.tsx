'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { Button, Input } from '@/components/ui';
import { PageHeader } from '@/components/ui/PageHeader';
import { authService, taskService } from '@/lib/services';
import { Task, Category } from '@/lib/services';
import { TaskBoardSkeleton } from '@/components/ui/Skeleton';

export default function TasksPage() {
  const [profile, setProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    categoryId: '',
    search: '',
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setProfile(currentUser);
  }, [router]);

  useEffect(() => {
    if (profile) {
      loadTasks();
      loadCategories();
    }
  }, [profile]);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create') {
      setSelectedTask(null);
      setIsFormOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const tasks = await taskService.getTasks(profile.id);
      console.log('Tasks:', tasks);
      setTasks(tasks);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      // Mock categories for demonstration
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Development',
          profileId: '1',
          color: '#3B82F6',
          createdAt: '2026-01-01',
        },
        {
          id: '2',
          name: 'Design',
          profileId: '1',
          color: '#EF4444',
          createdAt: '2026-01-01',
        },
        {
          id: '3',
          name: 'Frontend',
          profileId: '1',
          color: '#10B981',
          createdAt: '2026-01-01',
        },
      ];
      setCategories(mockCategories);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = tasks;

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.categoryId) {
      filtered = filtered.filter(task => task.category.id === parseInt(filters.categoryId));
    }

    if (filters.search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = async (profileId: number, task: Task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(profileId, task.id);
        loadTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleTaskStatusChange = async (profileId: number, taskId: number, newStatus: string) => {
    try {
      await taskService.updateTask(profileId, taskId, { status: newStatus as any });
      loadTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleTaskStatusChangeWrapper = async (taskId: number, newStatus: string) => {
    await handleTaskStatusChange(parseInt(profile.id), taskId, newStatus);
  };

  const handleFormSuccess = () => {
    loadTasks();
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  if (!profile || isLoading) {
    return <TaskBoardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="w-full">
          <PageHeader
            title="Tasks"
            subtitle={`Manage your tasks`}
            action={{
              label: "Create Task",
              onClick: handleCreateTask
            }}
          />

          <TaskFilters
            filters={filters}
            categories={categories}
            onFilterChange={setFilters}
            onClearFilters={() => setFilters({ status: '', categoryId: '', search: '' })}
          />

          <TaskBoard
            tasks={filteredTasks}
            onTaskClick={handleEditTask}
            onTaskStatusChange={handleTaskStatusChangeWrapper}
          />
        </div>
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        task={selectedTask}
        profileId={profile.id}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
