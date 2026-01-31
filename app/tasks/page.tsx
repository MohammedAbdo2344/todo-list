'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button, Input } from '@/components/ui';
import { authService, profileService, taskService, categoryService } from '@/lib/services';
import { Task, Category } from '@/lib/services';

export default function TasksPage() {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
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
    setUser(currentUser);
  }, [router]);

  useEffect(() => {
    if (user) {
      loadProfiles();
    }
  }, [user]);

  useEffect(() => {
    if (currentProfile) {
      loadTasks();
      loadCategories();
    }
  }, [currentProfile]);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create' && currentProfile) {
      setSelectedTask(null);
      setIsFormOpen(true);
    }
  }, [searchParams, currentProfile]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadProfiles = async () => {
    try {
      const userProfiles = await profileService.getProfiles(user.id);
      setProfiles(userProfiles);
      if (userProfiles.length > 0) {
        setCurrentProfile(userProfiles[0]);
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const profileTasks = await taskService.getTasks({
        profileId: currentProfile.id,
        deleted: false,
      });
      setTasks(profileTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const profileCategories = await categoryService.getCategories(currentProfile.id);
      setCategories(profileCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const applyFilters = () => {
    let filtered = tasks;

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.categoryId) {
      filtered = filtered.filter(task => task.categoryId === filters.categoryId);
    }

    if (filters.search) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleProfileChange = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    setCurrentProfile(profile);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = async (task: Task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(task.id);
        loadTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      await taskService.updateTask(task.id, { status: newStatus as any });
      loadTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleFormSuccess = () => {
    loadTasks();
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  if (!user || !currentProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentProfile={currentProfile}
        profiles={profiles}
        onProfileChange={handleProfileChange}
      />
      
      <div className="flex">
        <Sidebar onCreateTask={handleCreateTask} />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                <p className="text-gray-600 mt-1">
                  Manage your tasks for {currentProfile.name}
                </p>
              </div>
              <Button onClick={handleCreateTask}>
                Create Task
              </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
                
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <Button
                  variant="secondary"
                  onClick={() => setFilters({ status: '', categoryId: '', search: '' })}
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">
                    {tasks.length === 0 
                      ? 'No tasks yet. Create your first task to get started!' 
                      : 'No tasks match your filters.'
                    }
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={getCategoryById(task.categoryId)}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        task={selectedTask}
        profileId={currentProfile.id}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
