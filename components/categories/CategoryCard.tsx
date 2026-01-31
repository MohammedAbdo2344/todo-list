'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui';
import { Category } from '@/lib/services';

interface CategoryCardProps {
  category: Category;
  taskCount: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCard({ category, taskCount, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h3 className="font-medium text-gray-900">{category.name}</h3>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
              className="p-1"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(category)}
              className="p-1 text-red-500 hover:text-red-600"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{taskCount} tasks</span>
          <span>Created {new Date(category.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
