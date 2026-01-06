export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'work' | 'family' | 'other';
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  completedCount: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'work' | 'family' | 'other';
  starred: boolean;
  subtasks: { title: string; completed: boolean }[];
}

export type TaskFilter = 'all' | 'completed' | 'pending' | 'starred';
export type TaskSort = 'dueDate' | 'priority' | 'created' | 'alphabetical'; 