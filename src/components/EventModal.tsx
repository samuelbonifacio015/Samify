
import { useState, useEffect } from 'react';
import { X, Calendar, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarEvent, EventFormData } from '@/types/event';

/* Props para el modal de eventos */
interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  selectedDate?: Date;
  editingEvent?: CalendarEvent;
}

/* Componente para el modal de eventos */
const EventModal = ({ isOpen, onClose, onSave, selectedDate, editingEvent }: EventModalProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: selectedDate || new Date(),
    startTime: '09:00',
    endTime: '10:00',
    type: 'work',
    description: '',
    participants: '',
    reminder: 10,
    isRecurring: false,
    recurringType: 'weekly'
  });

  /* Estado para los errores */
  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        date: editingEvent.date,
        startTime: editingEvent.startTime,
        endTime: editingEvent.endTime,
        type: editingEvent.type,
        description: editingEvent.description || '',
        participants: editingEvent.participants?.join(', ') || '',
        reminder: editingEvent.reminder || 10,
        isRecurring: editingEvent.isRecurring || false,
        recurringType: editingEvent.recurringType || 'weekly'
      });
    } else if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  }, [editingEvent, selectedDate]);

  /* Función para validar el formulario */
  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'La hora de fin debe ser posterior a la de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Función para manejar el envío del formulario */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const participants = formData.participants
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    onSave({
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      description: formData.description,
      participants,
      reminder: formData.reminder,
      isRecurring: formData.isRecurring,
      recurringType: formData.recurringType
    });

    onClose();
    setFormData({
      title: '',
      date: selectedDate || new Date(),
      startTime: '09:00',
      endTime: '10:00',
      type: 'work',
      description: '',
      participants: '',
      reminder: 10,
      isRecurring: false,
      recurringType: 'weekly'
    });
    setErrors({});
  };

  /* Función para cerrar el modal */
  const handleClose = () => {
    onClose();
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título del evento *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ej: Reunión de equipo"
              className={`rounded-xl ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date.toISOString().split('T')[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Trabajo</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="meeting">Reunión</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora inicio</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora fin</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className={`rounded-xl ${errors.endTime ? 'border-red-500' : ''}`}
              />
              {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detalles adicionales del evento..."
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>

          {/* Participantes */}
          <div className="space-y-2">
            <Label htmlFor="participants">Invitar participantes</Label>
            <Input
              id="participants"
              value={formData.participants}
              onChange={(e) => setFormData(prev => ({ ...prev, participants: e.target.value }))}
              placeholder="correo1@ejemplo.com, correo2@ejemplo.com..."
              className="rounded-xl"
            />
          </div>

          {/* Recordatorio */}
          <div className="space-y-2">
            <Label htmlFor="reminder">Recordatorio</Label>
            <Select value={formData.reminder.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, reminder: parseInt(value) }))}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutos antes</SelectItem>
                <SelectItem value="10">10 minutos antes</SelectItem>
                <SelectItem value="30">30 minutos antes</SelectItem>
                <SelectItem value="60">1 hora antes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Evento recurrente */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="recurring">Repetir evento</Label>
              <p className="text-sm text-gray-500">Crear evento recurrente</p>
            </div>
            <Switch
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
            />
          </div>

          {formData.isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="recurringType">Frecuencia</Label>
              <Select value={formData.recurringType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, recurringType: value }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

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
              {editingEvent ? 'Actualizar' : 'Crear Evento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
