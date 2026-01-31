import { ReactNode } from 'react';
import { ExclamationTriangleIcon, InboxIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'empty' | 'error';
  action?: ReactNode;
}

export function EmptyState({ title, description, icon = 'empty', action }: EmptyStateProps) {
  const IconComponent = icon === 'error' ? ExclamationTriangleIcon : InboxIcon;
  const iconColor = icon === 'error' ? 'text-red-400' : 'text-gray-400';

  return (
    <div className="text-center py-12">
      <IconComponent className={`mx-auto h-12 w-12 ${iconColor} mb-4`} />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
