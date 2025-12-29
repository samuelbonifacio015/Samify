
import { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Check,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MiniCalendar from './MiniCalendar';

interface AppSidebarProps {
  onCreateEvent: () => void;
}

const AppSidebar = ({ onCreateEvent }: AppSidebarProps) => {
  const { state } = useSidebar();
  const [myCalendars, setMyCalendars] = useState([
    { id: 1, name: 'Personal', color: '#3B82F6', checked: true },
    { id: 2, name: 'Trabajo', color: '#10B981', checked: true },
    { id: 3, name: 'Familia', color: '#F59E0B', checked: false },
  ]);
  
  const [otherCalendars, setOtherCalendars] = useState([
    { id: 1, name: 'Feriados', color: '#EF4444', checked: true },
    { id: 2, name: 'Festividades', color: '#8B5CF6', checked: false },
  ]);

  const [myCalendarsExpanded, setMyCalendarsExpanded] = useState(true);
  const [otherCalendarsExpanded, setOtherCalendarsExpanded] = useState(true);

  const toggleCalendar = (id: number, type: 'my' | 'other') => {
    if (type === 'my') {
      setMyCalendars(prev => 
        prev.map(cal => cal.id === id ? { ...cal, checked: !cal.checked } : cal)
      );
    } else {
      setOtherCalendars(prev => 
        prev.map(cal => cal.id === id ? { ...cal, checked: !cal.checked } : cal)
      );
    }
  };

  const handleCreateAction = (type: 'event' | 'task' | 'reminder') => {
    if (type === 'event') {
      onCreateEvent();
    }
    console.log(`Creating ${type}`);
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-primary" />
          {state === 'expanded' && (
            <span className="text-xl font-bold text-gray-900">Samify</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6">
        {/* Botón Crear */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-soft transition-all duration-200"
                size={state === 'expanded' ? 'default' : 'icon'}
              >
                <Plus className="h-4 w-4" />
                {state === 'expanded' && <span className="ml-2">Crear</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-white border border-gray-200 shadow-lg rounded-2xl">
              <DropdownMenuItem 
                onClick={() => handleCreateAction('event')}
                className="hover:bg-gray-50 rounded-xl m-1"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Evento
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleCreateAction('task')}
                className="hover:bg-gray-50 rounded-xl m-1"
              >
                <Check className="h-4 w-4 mr-2" />
                Tarea
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleCreateAction('reminder')}
                className="hover:bg-gray-50 rounded-xl m-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Recordatorio
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mini Calendario */}
        {state === 'expanded' && (
          <div>
            <MiniCalendar />
          </div>
        )}

        {/* Búsqueda */}
        {state === 'expanded' && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar personas y eventos"
              className="pl-10 rounded-2xl border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
        )}

        {/* Mis Calendarios */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between text-gray-700 font-semibold">
            <div className="flex items-center">
              <button
                onClick={() => setMyCalendarsExpanded(!myCalendarsExpanded)}
                className="mr-2 hover:bg-gray-100 rounded p-1"
              >
                {myCalendarsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {state === 'expanded' && 'Mis calendarios'}
            </div>
            {state === 'expanded' && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </SidebarGroupLabel>
          
          {myCalendarsExpanded && (
            <SidebarGroupContent className="space-y-2">
              {myCalendars.map((calendar) => (
                <div key={calendar.id} className="flex items-center space-x-3 py-1 px-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <Checkbox
                    checked={calendar.checked}
                    onCheckedChange={() => toggleCalendar(calendar.id, 'my')}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: calendar.color }}
                  />
                  {state === 'expanded' && (
                    <span className="text-sm text-gray-700 flex-1">{calendar.name}</span>
                  )}
                </div>
              ))}
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* Otros Calendarios */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between text-gray-700 font-semibold">
            <div className="flex items-center">
              <button
                onClick={() => setOtherCalendarsExpanded(!otherCalendarsExpanded)}
                className="mr-2 hover:bg-gray-100 rounded p-1"
              >
                {otherCalendarsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {state === 'expanded' && 'Otros calendarios'}
            </div>
            {state === 'expanded' && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </SidebarGroupLabel>
          
          {otherCalendarsExpanded && (
            <SidebarGroupContent className="space-y-2">
              {otherCalendars.map((calendar) => (
                <div key={calendar.id} className="flex items-center space-x-3 py-1 px-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <Checkbox
                    checked={calendar.checked}
                    onCheckedChange={() => toggleCalendar(calendar.id, 'other')}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: calendar.color }}
                  />
                  {state === 'expanded' && (
                    <span className="text-sm text-gray-700 flex-1">{calendar.name}</span>
                  )}
                </div>
              ))}
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
