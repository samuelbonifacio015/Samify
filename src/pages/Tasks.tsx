import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useMobile } from '@/hooks/use-mobile';
import { Task } from '@/types/task';
import TaskList from '@/components/TaskList';
import TaskModal from '@/components/TaskModal';

const Tasks = () => {
  const isMobile = useMobile();
  const { addTask, updateTask } = useTasks();
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleCreateTask = () => {
    if (isMobile) {
      setEditingTask(undefined);
      setIsTaskModalOpen(true);
    } else {
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
    <>
      <TaskList 
        onCreateTask={handleCreateTask}
        onEditTask={handleEditTask}
        showQuickAdd={showQuickAdd}
        onQuickAddClose={() => setShowQuickAdd(false)}
      />
      
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(undefined);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </>
  );
};

export default Tasks;