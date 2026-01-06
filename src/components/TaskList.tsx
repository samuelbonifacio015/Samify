import { useState } from 'react';
import {
  Plus,
  Star,
  Calendar,
  MoreVertical,
  Check,
  X,
  Trash2,
  AlertCircle,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTasks } from '@/hooks/useTasksProvider';
import { Task } from '@/types/task';
import QuickTaskAdd from './QuickTaskAdd';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskListProps {
  onCreateTask: () => void;
  showQuickAdd?: boolean;
  onQuickAddClose?: () => void;
}

const TaskList = ({ onCreateTask, showQuickAdd, onQuickAddClose }: TaskListProps) => {
  const {
    tasks,
    stats,
    filter,
    toggleTaskCompletion,
    toggleTaskStarred,
    deleteTask,
    addTask,
    updateTask
  } = useTasks();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [editingTaskData, setEditingTaskData] = useState<Task | null>(null);

  const getFilterTitle = () => {
    switch (filter) {
      case 'all': return 'Mis tareas';
      case 'starred': return 'Destacadas';
      case 'pending': return 'Pendientes';
      case 'completed': return 'Completadas';
      default: return 'Mis tareas';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Sin prioridad';
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle.trim(),
        completed: false,
        priority: 'medium',
        category: 'personal',
        starred: false
      });

      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleQuickAddClose = () => {
    onQuickAddClose?.();
  };

  const handleEditChange = (field: keyof Task, value: any) => {
    if (editingTaskData) {
      setEditingTaskData(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleSaveEdit = () => {
    if (editingTaskData) {
      updateTask(editingTaskData.id, editingTaskData);
      setSelectedTaskId(null);
      setEditingTaskData(null);
    }
  };

  const handleCancelEdit = () => {
    setSelectedTaskId(null);
    setEditingTaskData(null);
  };

  if (tasks.length === 0 && !isAddingTask && !showQuickAdd) {
    return (
      <div className="h-screen flex flex-col bg-white">
        {/* Empty state centrado verticalmente */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Check className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No hay tareas aún</h2>
            <p className="text-gray-600 mb-8">
              Agrega tareas pendientes y lleva un seguimiento de ellas.
            </p>
            <Button
              onClick={onCreateTask}
              className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar una tarea
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header centrado */}
      <div className="bg-white border-b border-gray-100 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 text-center">{getFilterTitle()}</h1>
          {stats.total > 0 && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              {stats.pending} pendientes, {stats.completed} completadas
            </p>
          )}
        </div>
      </div>

      {/* Contenido centrado */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto py-6">
          {/* Quick add for desktop */}
          <QuickTaskAdd 
            isOpen={!!showQuickAdd}
            onClose={handleQuickAddClose}
            onComplete={handleQuickAddClose}
          />

          {/* Add new task quickly - mobile version */}
          {isAddingTask && (
            <div className="px-6 mb-4">
              <div className="p-4 border border-gray-200 bg-white rounded-2xl shadow-sm">
                <div className="flex items-center space-x-3">
                  <Checkbox disabled className="opacity-50" />
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Escribe una nueva tarea..."
                    className="flex-1 border-0 bg-transparent focus:ring-0 focus:border-0 p-0 text-gray-900"
                    autoFocus
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleAddTask}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingTask(false);
                        setNewTaskTitle('');
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add task button */}
          {!isAddingTask && !showQuickAdd && (
            <div className="px-6 mb-4">
              <Button
                onClick={onCreateTask}
                variant="ghost"
                className="w-full justify-center text-primary hover:bg-primary/10 rounded-2xl h-12 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">Agregar una tarea</span>
              </Button>
            </div>
          )}

          {/* Task list */}
          {tasks.length > 0 && (
            <div className="px-6 pb-6">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {tasks.map((task) => (
                    <DropdownMenu key={task.id} open={selectedTaskId === task.id} onOpenChange={(open) => {
                      if (open) {
                        setSelectedTaskId(task.id);
                        setEditingTaskData({ ...task });
                      } else {
                        setSelectedTaskId(null);
                        setEditingTaskData(null);
                      }
                    }}>
                      <DropdownMenuTrigger asChild>
                        <div
                          className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                            task.completed ? 'opacity-60' : ''
                          } ${selectedTaskId === task.id ? 'bg-gray-50' : ''}`}
                        >
                          <div className="flex items-start space-x-4">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTaskCompletion(task.id)}
                              className="mt-1"
                              onClick={(e) => e.stopPropagation()}
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className={`font-medium ${
                                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                                  }`}>
                                    {task.title}
                                  </h3>
                                  {task.description && (
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                  )}
                                  
                                  <div className="flex items-center space-x-4 mt-2">
                                    {task.dueDate && (
                                      <div className={`flex items-center space-x-1 text-xs ${
                                        isOverdue(task) ? 'text-red-600' : 'text-gray-500'
                                      }`}>
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDate(task.dueDate)}</span>
                                        {isOverdue(task) && <AlertCircle className="h-3 w-3" />}
                                      </div>
                                    )}
                                    
                                    <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                                      {getPriorityText(task.priority)}
                                    </Badge>
                                    
                                    {task.subtasks && task.subtasks.length > 0 && (
                                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <Check className="h-3 w-3" />
                                        <span>
                                          {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTaskStarred(task.id);
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-auto"
                                  >
                                    <Star className={`h-4 w-4 ${
                                      task.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                                    }`} />
                                  </Button>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="p-1 h-auto"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-96 bg-white border border-gray-200 shadow-lg rounded-xl p-4 max-h-96 overflow-y-auto">
                        {editingTaskData && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">Editar tarea</h3>
                              <div className="flex items-center space-x-2">
                                <Button
                                  onClick={() => {
                                    toggleTaskStarred(task.id);
                                    handleEditChange('starred', !editingTaskData.starred);
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-auto"
                                >
                                  <Star className={`h-4 w-4 ${
                                    editingTaskData.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                                  }`} />
                                </Button>
                                <Button
                                  onClick={() => {
                                    deleteTask(task.id);
                                    setSelectedTaskId(null);
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-auto text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Título */}
                            <div className="space-y-2">
                              <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">
                                Título
                              </Label>
                              <Input
                                id="edit-title"
                                value={editingTaskData.title}
                                onChange={(e) => handleEditChange('title', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                                placeholder="Título de la tarea"
                              />
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                              <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
                                Descripción
                              </Label>
                              <Textarea
                                id="edit-description"
                                value={editingTaskData.description || ''}
                                onChange={(e) => handleEditChange('description', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary resize-none"
                                placeholder="Descripción de la tarea"
                                rows={3}
                              />
                            </div>

                            {/* Fecha límite */}
                            <div className="space-y-2">
                              <Label htmlFor="edit-dueDate" className="text-sm font-medium text-gray-700">
                                Fecha límite
                              </Label>
                              <Input
                                id="edit-dueDate"
                                type="date"
                                value={editingTaskData.dueDate ? editingTaskData.dueDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => handleEditChange('dueDate', e.target.value ? new Date(e.target.value) : null)}
                                className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                              />
                            </div>

                            {/* Prioridad */}
                            <div className="space-y-2">
                              <Label htmlFor="edit-priority" className="text-sm font-medium text-gray-700">
                                Prioridad
                              </Label>
                              <Select value={editingTaskData.priority} onValueChange={(value) => handleEditChange('priority', value)}>
                                <SelectTrigger className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">Alta</SelectItem>
                                  <SelectItem value="medium">Media</SelectItem>
                                  <SelectItem value="low">Baja</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Categoría */}
                            <div className="space-y-2">
                              <Label htmlFor="edit-category" className="text-sm font-medium text-gray-700">
                                Categoría
                              </Label>
                              <Select value={editingTaskData.category} onValueChange={(value) => handleEditChange('category', value)}>
                                <SelectTrigger className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="personal">Personal</SelectItem>
                                  <SelectItem value="work">Trabajo</SelectItem>
                                  <SelectItem value="family">Familia</SelectItem>
                                  <SelectItem value="other">Otro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Botones */}
                            <div className="flex space-x-2 pt-4 border-t border-gray-200">
                              <Button
                                onClick={handleSaveEdit}
                                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Guardar
                              </Button>
                              <Button
                                onClick={handleCancelEdit}
                                variant="outline"
                                className="flex-1 rounded-lg"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList; 