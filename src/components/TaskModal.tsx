import { useState, useEffect } from 'react';
import { Plus, X, Calendar, Star, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Task, TaskFormData } from '@/types/task';

// Interfaz para las props del modal de tarea.
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTask?: Task;
}

const TaskModal = ({ isOpen, onClose, onSave, editingTask }: TaskModalProps) => {
  // Estado para el formulario de la tarea.
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: null,
    priority: 'medium',
    category: 'personal',
    starred: false,
    subtasks: []
  });

  const [newSubtask, setNewSubtask] = useState('');
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
        dueDate: editingTask.dueDate || null,
        priority: editingTask.priority,
        category: editingTask.category,
        starred: editingTask.starred,
        subtasks: editingTask.subtasks?.map(s => ({ title: s.title, completed: s.completed })) || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: null,
        priority: 'medium',
        category: 'personal',
        starred: false,
        subtasks: []
      });
    }
  }, [editingTask, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const subtasks = formData.subtasks.map((subtask, index) => ({
      id: `${Date.now()}-${index}`,
      title: subtask.title,
      completed: subtask.completed
    }));

    onSave({
      title: formData.title,
      description: formData.description,
      completed: false,
      dueDate: formData.dueDate,
      priority: formData.priority,
      category: formData.category,
      starred: formData.starred,
      subtasks: subtasks.length > 0 ? subtasks : undefined
    });

    onClose();
    setFormData({
      title: '',
      description: '',
      dueDate: null,
      priority: 'medium',
      category: 'personal',
      starred: false,
      subtasks: []
    });
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    setErrors({});
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, { title: newSubtask.trim(), completed: false }]
      }));
      setNewSubtask('');
    }
  };

  const removeSubtask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };

  const toggleSubtask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask, i) => 
        i === index ? { ...subtask, completed: !subtask.completed } : subtask
      )
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'family': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center">
            {editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}
            {formData.starred && <Star className="ml-2 h-5 w-5 text-yellow-400 fill-current" />}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título de la tarea *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ej: Completar informe mensual"
              className={`rounded-xl ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detalles adicionales de la tarea..."
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>

          {/* Fecha límite, Prioridad y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Fecha límite</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  dueDate: e.target.value ? new Date(e.target.value) : null 
                }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="rounded-xl">
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
          </div>

          {/* Tarea destacada */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="starred">Marcar como destacada</Label>
              <p className="text-sm text-gray-500">La tarea aparecerá en la lista de destacadas</p>
            </div>
            <Switch
              id="starred"
              checked={formData.starred}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, starred: checked }))}
            />
          </div>

          {/* Subtareas */}
          <div className="space-y-3">
            <Label>Subtareas</Label>
            
            {/* Lista de subtareas */}
            {formData.subtasks.length > 0 && (
              <div className="space-y-2">
                {formData.subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => toggleSubtask(index)}
                    />
                    <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {subtask.title}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubtask(index)}
                      className="p-1 h-auto text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Agregar subtarea */}
            <div className="flex items-center space-x-2">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Agregar subtarea..."
                className="flex-1 rounded-xl"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              />
              <Button
                type="button"
                onClick={addSubtask}
                disabled={!newSubtask.trim()}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Vista previa de etiquetas */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Etiquetas:</span>
            <Badge variant="secondary" className={getPriorityColor(formData.priority)}>
              {formData.priority === 'high' ? 'Alta' : formData.priority === 'medium' ? 'Media' : 'Baja'}
            </Badge>
            <Badge variant="secondary" className={getCategoryColor(formData.category)}>
              {formData.category === 'work' ? 'Trabajo' : 
               formData.category === 'personal' ? 'Personal' : 
               formData.category === 'family' ? 'Familia' : 'Otro'}
            </Badge>
            {formData.dueDate && (
              <Badge variant="outline" className="text-gray-600">
                <Calendar className="h-3 w-3 mr-1" />
                {formData.dueDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </Badge>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl"
            >
              {editingTask ? 'Actualizar Tarea' : 'Crear Tarea'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal; 