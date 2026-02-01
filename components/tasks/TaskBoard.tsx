import React from 'react';
import { Task } from '@/lib/services';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskStatusChange: (taskId: number, newStatus: string) => void;
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isCompleted?: boolean;
  isDragging?: boolean;
}

const DraggableTaskCard: React.FC<TaskCardProps> = ({ task, onClick, isCompleted = false, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'border-gray-200';
      case 'in-progress':
        return 'border-blue-200';
      case 'completed':
        return 'border-green-200';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <h4 className={`font-medium text-gray-900 mb-2 ${isCompleted ? 'line-through' : ''}`}>
        {task.title}
      </h4>
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {task.category.name}
        </span>
      </div>
    </div>
  );
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isCompleted = false }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'border-gray-200';
      case 'in-progress':
        return 'border-blue-200';
      case 'completed':
        return 'border-green-200';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-sm border ${getBorderColor(task.status)} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <h4 className={`font-medium text-gray-900 mb-2 ${isCompleted ? 'line-through' : ''}`}>
        {task.title}
      </h4>
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {task.category.name}
        </span>
      </div>
    </div>
  );
};

interface TaskColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  bgColor: string;
  headerBgColor: string;
  headerTextColor: string;
  countBgColor: string;
  countTextColor: string;
  emptyTextColor: string;
}

const DroppableTaskColumn: React.FC<TaskColumnProps> = ({
  title,
  status,
  tasks,
  onTaskClick,
  bgColor,
  headerBgColor,
  headerTextColor,
  countBgColor,
  countTextColor,
  emptyTextColor
}) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const statusTasks = tasks.filter(task => task.status === status);

  return (
    <div className={`${bgColor} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${headerTextColor}`}>{title}</h3>
        <span className={`${countBgColor} ${countTextColor} px-2 py-1 rounded-full text-xs`}>
          {statusTasks.length}
        </span>
      </div>
      <div ref={setNodeRef} className="space-y-3 min-h-[100px]">
        <SortableContext items={statusTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {statusTasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              isCompleted={status === 'completed'}
            />
          ))}
        </SortableContext>
        {statusTasks.length === 0 && (
          <div className={`text-center py-8 ${emptyTextColor}`}>
            <p className="text-sm">
              {status === 'todo' && 'No tasks to do'}
              {status === 'in-progress' && 'No tasks in progress'}
              {status === 'completed' && 'No completed tasks'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  status,
  tasks,
  onTaskClick,
  bgColor,
  headerBgColor,
  headerTextColor,
  countBgColor,
  countTextColor,
  emptyTextColor
}) => {
  const statusTasks = tasks.filter(task => task.status === status);

  return (
    <div className={`${bgColor} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${headerTextColor}`}>{title}</h3>
        <span className={`${countBgColor} ${countTextColor} px-2 py-1 rounded-full text-xs`}>
          {statusTasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {statusTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            isCompleted={status === 'completed'}
          />
        ))}
        {statusTasks.length === 0 && (
          <div className={`text-center py-8 ${emptyTextColor}`}>
            <p className="text-sm">
              {status === 'todo' && 'No tasks to do'}
              {status === 'in-progress' && 'No tasks in progress'}
              {status === 'completed' && 'No completed tasks'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export function TaskBoard({ tasks, onTaskClick, onTaskStatusChange }: TaskBoardProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = Number(active.id);
    const newStatus = over.id as string;
    
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      onTaskStatusChange(taskId, newStatus);
    }
    
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="min-w-0 flex-1">
          <DroppableTaskColumn
            title="TO DO"
            status="todo"
            tasks={tasks}
            onTaskClick={onTaskClick}
            bgColor="bg-gray-100"
            headerBgColor="text-gray-700"
            headerTextColor="text-gray-700"
            countBgColor="bg-gray-200"
            countTextColor="text-gray-700"
            emptyTextColor="text-gray-500"
          />
        </div>

        <div className="min-w-0 flex-1">
          <DroppableTaskColumn
            title="IN PROGRESS"
            status="in-progress"
            tasks={tasks}
            onTaskClick={onTaskClick}
            bgColor="bg-blue-50"
            headerBgColor="text-blue-700"
            headerTextColor="text-blue-700"
            countBgColor="bg-blue-100"
            countTextColor="text-blue-700"
            emptyTextColor="text-blue-500"
          />
        </div>

        <div className="min-w-0 flex-1">
          <DroppableTaskColumn
            title="COMPLETED"
            status="completed"
            tasks={tasks}
            onTaskClick={onTaskClick}
            bgColor="bg-green-50"
            headerBgColor="text-green-700"
            headerTextColor="text-green-700"
            countBgColor="bg-green-100"
            countTextColor="text-green-700"
            emptyTextColor="text-green-500"
          />
        </div>
      </div>
      
      <DragOverlay>
        {activeTask && (
          <DraggableTaskCard
            task={activeTask}
            onClick={() => {}}
            isCompleted={activeTask.status === 'completed'}
            isDragging={true}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
