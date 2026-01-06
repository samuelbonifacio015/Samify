import { createContext, useContext, useState, useMemo, useCallback, useEffect, ReactNode } from 'react';
import { Task, TaskFilter, TaskSort } from '@/types/task';
import { supabaseClient } from '@/lib/supabaseClient';

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
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => void;
  toggleTaskStarred: (id: string) => void;
  addSubtask: (taskId: string, subtaskTitle: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('dueDate');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          return;
        }

        if (data) {
          const formattedTasks: Task[] = data.map((task) => {
            const typedTask = task as {
              id: string;
              title: string;
              description: string | null;
              completed: boolean;
              due_date: string | null;
              priority: 'low' | 'medium' | 'high';
              category: 'personal' | 'work' | 'family' | 'other';
              created_at: string;
              updated_at: string;
              starred: boolean;
              subtasks?: { id: string; title: string; completed: boolean }[];
            };
            return {
              id: typedTask.id,
              title: typedTask.title,
              description: typedTask.description || undefined,
              completed: typedTask.completed,
              dueDate: typedTask.due_date ? new Date(typedTask.due_date) : undefined,
              priority: typedTask.priority,
              category: typedTask.category,
              createdAt: new Date(typedTask.created_at),
              updatedAt: new Date(typedTask.updated_at),
              starred: typedTask.starred,
              subtasks: typedTask.subtasks || []
            };
          });
          setTasks(formattedTasks);
        }
      } catch (err) {
      }
    };

    loadTasks();
  }, []);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const taskToInsert = {
      title: taskData.title,
      description: taskData.description || null,
      completed: taskData.completed,
      due_date: taskData.dueDate?.toISOString() || null,
      priority: taskData.priority,
      category: taskData.category,
      starred: taskData.starred,
      subtasks: taskData.subtasks || []
    };

    const { data, error } = await supabaseClient
      .from('tasks')
      .insert(taskToInsert)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const newTask: Task = {
      id: data.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      priority: data.priority,
      category: data.category,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      starred: data.starred,
      subtasks: data.subtasks || []
    };

    setTasks(prev => {
      const updated = [newTask, ...prev];
      return updated;
    });
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const updatesToSend: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (updates.title !== undefined) updatesToSend.title = updates.title;
    if (updates.description !== undefined) updatesToSend.description = updates.description;
    if (updates.completed !== undefined) updatesToSend.completed = updates.completed;
    if (updates.dueDate !== undefined) updatesToSend.due_date = updates.dueDate.toISOString();
    if (updates.priority !== undefined) updatesToSend.priority = updates.priority;
    if (updates.category !== undefined) updatesToSend.category = updates.category;
    if (updates.starred !== undefined) updatesToSend.starred = updates.starred;
    if (updates.subtasks !== undefined) updatesToSend.subtasks = updates.subtasks;

    const { error } = await supabaseClient
      .from('tasks')
      .update(updatesToSend)
      .eq('id', id);

    if (error) {
      throw error;
    }

    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await supabaseClient
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    setTasks(prev => {
      const filtered = prev.filter(task => task.id !== id);
      return filtered;
    });
  }, []);

  const toggleTaskCompletion = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const { error } = await supabaseClient
      .from('tasks')
      .update({ completed: !task.completed, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return;
    }

    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  }, [tasks]);

  const toggleTaskStarred = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const { error } = await supabaseClient
      .from('tasks')
      .update({ starred: !task.starred, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return;
    }

    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, starred: !task.starred, updatedAt: new Date() }
        : task
    ));
  }, [tasks]);

  const addSubtask = useCallback((taskId: string, subtaskTitle: string) => {
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

    const priorityOrder = { high: 3, medium: 2, low: 1 };

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
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
