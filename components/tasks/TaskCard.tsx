'use client';

import { useState } from 'react';
import { PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { Task } from '@/lib/services';
import { getStatusColor, getPriorityColor, getPriorityIcon } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  category: any;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: string) => void;
}

export function TaskCard({ task, category, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusChange(task, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-1 ml-4">
            <span className={`text-lg ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
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
          
          <div className="flex items-center space-x-1">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isUpdating}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="p-1"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task)}
              className="p-1 text-red-500 hover:text-red-600"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
