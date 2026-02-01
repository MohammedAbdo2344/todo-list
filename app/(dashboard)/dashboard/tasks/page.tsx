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
      // Mock profile for demonstration
      const mockProfile = {
        id: '1',
        name: 'Demo Profile',
        userId: user.id,
      };
      setProfiles([mockProfile]);
      setCurrentProfile(mockProfile);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const loadTasks = async () => {
    try {
      // Mock data for demonstration
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Projects Page',
          description: 'Create the main projects page with navigation',
          status: 'todo',
          priority: 'high',
          categoryId: '1',
          profileId: '1',
          deletedAt: null,
          createdAt: '2026-01-05',
          updatedAt: '2026-01-05',
        },
        {
          id: '2',
          title: 'Nav bar',
          description: 'Implement responsive navigation bar',
          status: 'completed',
          priority: 'medium',
          categoryId: '2',
          profileId: '1',
          deletedAt: null,
          createdAt: '2026-01-04',
          updatedAt: '2026-01-04',
        },
        {
          id: '3',
          title: 'Footer',
          description: 'Design and implement footer component',
          status: 'completed',
          priority: 'low',
          categoryId: '2',
          profileId: '1',
          deletedAt: null,
          createdAt: '2026-01-03',
          updatedAt: '2026-01-03',
        },
        {
          id: '4',
          title: 'About Page',
          description: 'Create about us page with team information',
          status: 'completed',
          priority: 'medium',
          categoryId: '3',
          profileId: '1',
          deletedAt: null,
          createdAt: '2026-01-02',
          updatedAt: '2026-01-02',
        },
        {
          id: '5',
          title: 'Product Page',
          description: 'Build product showcase page',
          status: 'completed',
          priority: 'high',
          categoryId: '3',
          profileId: '1',
          deletedAt: null,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
        {
          id: '6',
          title: 'Service Page',
          description: 'Develop services listing page',
          status: 'completed',
          priority: 'medium',
          categoryId: '3',
          profileId: '1',
          deletedAt: null,
          createdAt: '2025-12-31',
          updatedAt: '2025-12-31',
        },
        {
          id: '7',
          title: 'Contact Us',
          description: 'Create contact form and page',
          status: 'completed',
          priority: 'low',
          categoryId: '3',
          profileId: '1',
          deletedAt: null,
          createdAt: '2025-12-30',
          updatedAt: '2025-12-30',
        },
        {
          id: '8',
          title: 'User Authentication',
          description: 'Implement login and signup functionality',
          status: 'in-progress',
          priority: 'high',
          categoryId: '1',
          profileId: '1',
          deletedAt: null,
          createdAt: '2026-01-06',
          updatedAt: '2026-01-06',
        },
        {
          id: '9',
          title: 'Database Setup',
          description: 'Configure database and migrations',
          status: 'in-progress',
          priority: 'high',
          categoryId: '1',
          profileId: '1',
          deletedAt: null,
          createdAt: '2026-01-07',
          updatedAt: '2026-01-07',
        },
      ];
      setTasks(mockTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
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
      {/* <Header user={user} /> */}
      
      <div className="flex">
        {/* <Sidebar onCreateTask={handleCreateTask} /> */}
        
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

            {/* Tasks Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TO DO Column */}
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">TO DO</h3>
                  <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {filteredTasks.filter(task => task.status === 'todo').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredTasks
                    .filter(task => task.status === 'todo')
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleEditTask(task)}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${task.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                            ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${task.priority === 'low' ? 'bg-green-100 text-green-800' : ''}
                          `}>
                            {task.priority}
                          </span>
                          {getCategoryById(task.categoryId) && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {getCategoryById(task.categoryId)?.name}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  {filteredTasks.filter(task => task.status === 'todo').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No tasks to do</p>
                    </div>
                  )}
                </div>
              </div>

              {/* IN PROGRESS Column */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-blue-700">IN PROGRESS</h3>
                  <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {filteredTasks.filter(task => task.status === 'in-progress').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredTasks
                    .filter(task => task.status === 'in-progress')
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleEditTask(task)}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${task.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                            ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${task.priority === 'low' ? 'bg-green-100 text-green-800' : ''}
                          `}>
                            {task.priority}
                          </span>
                          {getCategoryById(task.categoryId) && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {getCategoryById(task.categoryId)?.name}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  {filteredTasks.filter(task => task.status === 'in-progress').length === 0 && (
                    <div className="text-center py-8 text-blue-500">
                      <p className="text-sm">No tasks in progress</p>
                    </div>
                  )}
                </div>
              </div>

              {/* COMPLETED Column */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-green-700">COMPLETED</h3>
                  <span className="bg-green-200 text-green-700 px-2 py-1 rounded-full text-xs">
                    {filteredTasks.filter(task => task.status === 'completed').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredTasks
                    .filter(task => task.status === 'completed')
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-green-200 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleEditTask(task)}
                      >
                        <h4 className="font-medium text-gray-900 mb-2 line-through">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${task.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                            ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${task.priority === 'low' ? 'bg-green-100 text-green-800' : ''}
                          `}>
                            {task.priority}
                          </span>
                          {getCategoryById(task.categoryId) && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {getCategoryById(task.categoryId)?.name}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  {filteredTasks.filter(task => task.status === 'completed').length === 0 && (
                    <div className="text-center py-8 text-green-500">
                      <p className="text-sm">No completed tasks</p>
                    </div>
                  )}
                </div>
              </div>
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
