'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { authService, profileService, taskService, categoryService } from '@/lib/services';
import { Task, Category } from '@/lib/services';
import { getStatusColor, formatDate } from '@/lib/utils';

export default function DeletedTasksPage() {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      loadDeletedTasks();
      loadCategories();
    }
  }, [currentProfile]);

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

  const loadDeletedTasks = async () => {
    try {
      const tasks = await taskService.getTasks({
        profileId: currentProfile.id,
        deleted: true,
      });
      setDeletedTasks(tasks);
    } catch (error) {
      console.error('Failed to load deleted tasks:', error);
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

  const handleProfileChange = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    setCurrentProfile(profile);
  };

  const handleRestoreTask = async (task: Task) => {
    setIsLoading(true);
    try {
      await taskService.restoreTask(task.id);
      loadDeletedTasks();
    } catch (error) {
      console.error('Failed to restore task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermanentDelete = async (task: Task) => {
    if (window.confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // Permanent delete (not implemented in mock API)
        console.log('Permanent delete task:', task);
        loadDeletedTasks();
      } catch (error) {
        console.error('Failed to permanently delete task:', error);
      } finally {
        setIsLoading(false);
      }
    }
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
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Deleted Tasks</h1>
              <p className="text-gray-600 mt-1">
                Manage deleted tasks for {currentProfile.name}
              </p>
            </div>

            {/* Deleted Tasks List */}
            <div className="space-y-4">
              {deletedTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <TrashIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No deleted tasks</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Tasks you delete will appear here for recovery
                  </p>
                </div>
              ) : (
                deletedTasks.map((task) => {
                  const category = getCategoryById(task.categoryId);
                  return (
                    <Card key={task.id} className="border-red-200 bg-red-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              {category && (
                                <div 
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                  style={{ 
                                    backgroundColor: `${category.color}20`, 
                                    color: category.color,
                                    border: `1px solid ${category.color}40`
                                  }}
                                >
                                  {category.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="text-xs text-gray-500">
                              Deleted {formatDate(task.deletedAt!)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-red-200">
                          <div className="text-sm text-gray-600">
                            Created {formatDate(task.createdAt)}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleRestoreTask(task)}
                              disabled={isLoading}
                              className="flex items-center space-x-1"
                            >
                              <ArrowPathIcon className="h-4 w-4" />
                              <span>Restore</span>
                            </Button>
                            
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handlePermanentDelete(task)}
                              disabled={isLoading}
                              className="flex items-center space-x-1"
                            >
                              <TrashIcon className="h-4 w-4" />
                              <span>Delete Forever</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
