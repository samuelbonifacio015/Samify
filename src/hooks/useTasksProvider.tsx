import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { Task, TaskFilter, TaskSort } from '@/types/task';

interface TasksContextType {
  tasks: Task[];
  allTasks: Task[];
  filter: TaskFilter;
  sort: TaskSort;
  stats: {
    total: number;
    completed: number;
    pending: number;
    starred: number;
    overdue: number;
  };
  setFilter: (filter: TaskFilter) => void;
  setSort: (sort: TaskSort) => void;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  toggleTaskStarred: (id: string) => void;
  addSubtask: (taskId: string, subtaskTitle: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Revisar propuesta de diseño',
      description: 'Revisar los mockups y dar feedback',
      completed: false,
      dueDate: new Date(Date.now() + 86400000),
      priority: 'high',
      category: 'work',
      createdAt: new Date(),
      updatedAt: new Date(),
      starred: true,
      subtasks: [
        { id: '1a', title: 'Revisar wireframes', completed: true },
        { id: '1b', title: 'Validar colores', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Comprar ingredientes para la cena',
      description: '',
      completed: false,
      dueDate: new Date(),
      priority: 'medium',
      category: 'personal',
      createdAt: new Date(),
      updatedAt: new Date(),
      starred: false
    },
    {
      id: '3',
      title: 'Llamar al dentista',
      description: 'Programar cita de rutina',
      completed: true,
      priority: 'low',
      category: 'personal',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(),
      starred: false
    }
  ]);

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('dueDate');

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('[TasksProvider] addTask called with:', JSON.stringify(taskData, null, 2));
    
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('[TasksProvider] Created new task:', JSON.stringify(newTask, null, 2));
    
    setTasks(prev => {
      const updated = [...prev, newTask];
      console.log('[TasksProvider] Tasks after add:', updated.length, 'tasks');
      return updated;
    });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    console.log('[TasksProvider] updateTask called:', id, JSON.stringify(updates, null, 2));
    
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    console.log('[TasksProvider] deleteTask called:', id);
    
    setTasks(prev => {
      const filtered = prev.filter(task => task.id !== id);
      console.log('[TasksProvider] Tasks after delete:', filtered.length, 'tasks');
      return filtered;
    });
  }, []);

  const toggleTaskCompletion = useCallback((id: string) => {
    console.log('[TasksProvider] toggleTaskCompletion called:', id);
    
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  }, []);

  const toggleTaskStarred = useCallback((id: string) => {
    console.log('[TasksProvider] toggleTaskStarred called:', id);
    
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, starred: !task.starred, updatedAt: new Date() }
        : task
    ));
  }, []);

  const addSubtask = useCallback((taskId: string, subtaskTitle: string) => {
    console.log('[TasksProvider] addSubtask called:', taskId, subtaskTitle);
    
    const newSubtask = {
      id: Date.now().toString(),
      title: subtaskTitle,
      completed: false
    };
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            subtasks: [...(task.subtasks || []), newSubtask],
            updatedAt: new Date()
          }
        : task
    ));
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    console.log('[TasksProvider] toggleSubtask called:', taskId, subtaskId);
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            subtasks: task.subtasks?.map(sub => 
              sub.id === subtaskId 
                ? { ...sub, completed: !sub.completed }
                : sub
            ),
            updatedAt: new Date()
          }
        : task
    ));
  }, []);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    switch (filter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'starred':
        filtered = filtered.filter(task => task.starred);
        break;
      default:
        break;
    }

    switch (sort) {
      case 'dueDate':
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case 'created':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [tasks, filter, sort]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const starred = tasks.filter(t => t.starred).length;
    const overdue = tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < new Date() && 
      !t.completed
    ).length;

    return { total, completed, pending, starred, overdue };
  }, [tasks]);

  return (
    <TasksContext.Provider value={{
      tasks: filteredTasks,
      allTasks: tasks,
      filter,
      sort,
      stats,
      setFilter,
      setSort,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      toggleTaskStarred,
      addSubtask,
      toggleSubtask
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    console.warn('[useTasks] useTasks used outside of TasksProvider');
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
