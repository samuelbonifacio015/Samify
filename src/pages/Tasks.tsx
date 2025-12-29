import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useMobile } from '@/hooks/use-mobile';
import { Task } from '@/types/task';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import TaskModal from '@/components/TaskModal';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

const Tasks = () => {
  const isMobile = useMobile();
  const { addTask, updateTask } = useTasks();
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleCreateTask = () => {
    if (isMobile) {
      // En móvil usar modal completo
      setEditingTask(undefined);
      setIsTaskModalOpen(true);
    } else {
      // En desktop usar QuickAdd
      setShowQuickAdd(true);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar 
          inTasks={true}
          onCreateTask={handleCreateTask}
        />
        
        <SidebarInset className="flex-1">
          <TaskList 
            onCreateTask={handleCreateTask}
            onEditTask={handleEditTask}
            showQuickAdd={showQuickAdd}
            onQuickAddClose={() => setShowQuickAdd(false)}
          />
        </SidebarInset>
      </div>
      
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(undefined);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </SidebarProvider>
  );
};

export default Tasks; 