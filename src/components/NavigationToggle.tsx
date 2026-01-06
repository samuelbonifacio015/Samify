import { Calendar, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationToggleProps {
  currentView: 'calendar' | 'tasks';
  onViewChange: (view: 'calendar' | 'tasks') => void;
}

const NavigationToggle = ({ currentView, onViewChange }: NavigationToggleProps) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-2xl p-1">
      <Button
        variant={currentView === 'calendar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('calendar')}
        className={`rounded-xl px-4 py-2 font-medium transition-all ${
          currentView === 'calendar'
            ? 'bg-white shadow-soft text-gray-900'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Calendario
      </Button>
      <Button
        variant={currentView === 'tasks' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('tasks')}
        className={`rounded-xl px-4 py-2 font-medium transition-all ${
          currentView === 'tasks'
            ? 'bg-white shadow-soft text-gray-900'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <CheckSquare className="h-4 w-4 mr-2" />
        Tareas
      </Button>
    </div>
  );
};

export default NavigationToggle; 