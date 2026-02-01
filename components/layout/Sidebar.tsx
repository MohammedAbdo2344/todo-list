'use client';

import { useRouter, usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ClipboardDocumentCheckIcon, 
  FolderIcon, 
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';

interface SidebarProps {
  onCreateTask?: () => void;
  onCreateCategory?: () => void;
}

export function Sidebar({ onCreateTask, onCreateCategory }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardDocumentCheckIcon },
    { name: 'Categories', href: '/dashboard/categories', icon: FolderIcon },
    { name: 'Deleted Tasks', href: '/dashboard/deleted-tasks', icon: TrashIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Menu</h2>
        
        {/* Quick Actions */}
        <div className="space-y-2 mb-8">
          <Button
            onClick={onCreateTask}
            className="w-full justify-start"
            size="sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <Button
            onClick={onCreateCategory}
            variant="secondary"
            className="w-full justify-start"
            size="sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
