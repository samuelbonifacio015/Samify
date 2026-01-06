import { useState, useMemo } from 'react';
import { Task, TaskFilter, TaskSort } from '@/types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Revisar propuesta de diseño',
      description: 'Revisar los mockups y dar feedback',
      completed: false,
      dueDate: new Date(Date.now() + 86400000), // mañana
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

  // Crear nueva tarea
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
  };

  // Actualizar tarea existente
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  };

  // Eliminar tarea
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Marcar tarea como completada/pendiente
  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  };

  // Marcar tarea como favorita
  const toggleTaskStarred = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, starred: !task.starred, updatedAt: new Date() }
        : task
    ));
  };

  // Agregar subtarea
  const addSubtask = (taskId: string, subtaskTitle: string) => {
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
  };

  // Togglear subtarea
  const toggleSubtask = (taskId: string, subtaskId: string) => {
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
  };

  // Filtrar tareas
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Aplicar filtros
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

    // Aplicar ordenamiento
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

  // Estadísticas
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

  return {
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
  };
}; 