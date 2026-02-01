'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, Badge } from '@/components/ui';
import { Skeleton, DashboardSkeleton } from '@/components/ui/Skeleton';
import { dashboardService, DashboardTask } from '@/lib/services/dashboard-service';
import { getStatusColor } from '@/lib/utils';
import { useDashboard } from '../layout';

export default function DashboardPage() {
  const { user, currentProfile } = useDashboard();
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadTasksAndStats();
    }
  }, [user]);

  const loadTasksAndStats = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      // Use dashboard service to get both stats and tasks
      const [dashboardStats, recentTasks] = await Promise.all([
        dashboardService.getDashboardStats(user.id),
        dashboardService.getRecentTasks(user.id)
      ]);

      setStats(dashboardStats);
      setTasks(recentTasks);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <DashboardSkeleton />;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user.name}! Here's an overview of your tasks.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm font-medium text-gray-600">Total Tasks</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm font-medium text-gray-600">To Do</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.todo}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm font-medium text-gray-600">In Progress</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm font-medium text-gray-600">Completed</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks yet. Create your first task to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{task.description}</p>
                  </div>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
              ))}
              {tasks.length > 5 && (
                <button
                  onClick={() => router.push('/tasks')}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-500 py-2"
                >
                  View all tasks →
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
