import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Check, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTasks } from '@/hooks/useTasks';

interface QuickTaskAddProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const QuickTaskAdd = ({ isOpen, onClose, onComplete }: QuickTaskAddProps) => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [customDate, setCustomDate] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    let dueDate: Date | undefined;
    
    if (selectedDate === 'today') {
      dueDate = new Date();
    } else if (selectedDate === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = tomorrow;
    } else if (selectedDate === 'custom' && customDate) {
      dueDate = new Date(customDate);
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      completed: false,
      dueDate,
      priority: 'medium',
      category: 'personal',
      starred: false
    });

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedDate('today');
    setCustomDate('');
    setShowDetails(false);
    
    onComplete?.();
    onClose();
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setSelectedDate('today');
    setCustomDate('');
    setShowDetails(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="p-6">
      <div 
        ref={containerRef}
        className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 max-w-2xl mx-auto animate-fade-in"
      >
        {/* Title Input */}
        <div className="mb-4">
          <Input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Título"
            className="border-0 text-lg font-medium placeholder:text-gray-400 focus:ring-0 focus:border-0 p-0 h-auto bg-transparent"
          />
        </div>

        {/* Details Toggle */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal text-sm"
          >
            <ChevronDown className={`h-4 w-4 mr-1 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            Detalles
          </Button>
        </div>

        {/* Details Section */}
        {showDetails && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Agregar descripción..."
              className="border-0 resize-none text-sm placeholder:text-gray-400 focus:ring-0 focus:border-0 p-0 bg-transparent min-h-[60px]"
            />
          </div>
        )}

        {/* Date Selection */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant={selectedDate === 'today' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDate('today')}
              className={`rounded-xl text-sm ${selectedDate === 'today' ? 'bg-primary text-white' : 'text-gray-600 border-gray-200'}`}
            >
              Hoy
            </Button>
            <Button
              variant={selectedDate === 'tomorrow' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDate('tomorrow')}
              className={`rounded-xl text-sm ${selectedDate === 'tomorrow' ? 'bg-primary text-white' : 'text-gray-600 border-gray-200'}`}
            >
              Mañana
            </Button>
            <Button
              variant={selectedDate === 'custom' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDate('custom')}
              className={`rounded-xl text-sm ${selectedDate === 'custom' ? 'bg-primary text-white' : 'text-gray-600 border-gray-200'}`}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Fecha
            </Button>
          </div>
          
          {selectedDate === 'custom' && (
            <div className="mt-3">
              <Input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="text-sm border-gray-200 rounded-xl max-w-xs"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl text-sm px-6 py-2 font-medium"
            >
              <Check className="h-4 w-4 mr-2" />
              Agregar tarea
            </Button>
            <Button
              onClick={handleCancel}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700 rounded-xl text-sm px-4 py-2"
            >
              Cancelar
            </Button>
          </div>
          
          <div className="text-xs text-gray-400 hidden sm:block">
            Enter para guardar • Esc para cancelar
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickTaskAdd; 