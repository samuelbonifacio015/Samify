import { useState } from 'react';
import { 
  Calendar,
  CheckSquare,
  Plus, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Check,
  Settings,
  Star,
  List,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useTasks } from '@/hooks/useTasks';
import {
  Sidebar as SidebarUI,
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

interface SidebarProps {
  inTasks: boolean;
  onCreateEvent?: () => void;
  onCreateTask?: () => void;
}

const Sidebar = ({ inTasks, onCreateEvent, onCreateTask }: SidebarProps) => {
  const { state } = useSidebar();
  const { filter, setFilter, stats } = useTasks();
  
  // Calendar state
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
  
  // Tasks state
  const [myListsExpanded, setMyListsExpanded] = useState(true);
  
  const taskLists = [
    { 
      id: 'all', 
      name: 'Todas las tareas', 
      icon: List, 
      count: stats.total,
      color: '#6B7280'
    },
    { 
      id: 'starred', 
      name: 'Destacadas', 
      icon: Star, 
      count: stats.starred,
      color: '#F59E0B'
    },
    { 
      id: 'pending', 
      name: 'Pendientes', 
      icon: Clock, 
      count: stats.pending,
      color: '#3B82F6'
    },
    { 
      id: 'completed', 
      name: 'Completadas', 
      icon: Check, 
      count: stats.completed,
      color: '#10B981'
    }
  ];

  const myLists = [
    { 
      id: 'personal', 
      name: 'Mis tareas', 
      color: '#3B82F6', 
      count: stats.total,
      isChecked: true
    }
  ];

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

  const handleCreateAction = (type: 'event' | 'task' | 'list' | 'reminder') => {
    if (type === 'event' && onCreateEvent) {
      onCreateEvent();
    } else if (type === 'task' && onCreateTask) {
      onCreateTask();
    }
    console.log(`Creating ${type}`);
  };

  return (
    <SidebarUI className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {inTasks ? (
            <CheckSquare className="h-6 w-6 text-primary" />
          ) : (
            <Calendar className="h-6 w-6 text-primary" />
          )}
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
              {inTasks ? (
                <>
                  <DropdownMenuItem 
                    onClick={() => handleCreateAction('task')}
                    className="hover:bg-gray-50 rounded-xl m-1"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Tarea
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleCreateAction('list')}
                    className="hover:bg-gray-50 rounded-xl m-1"
                  >
                    <List className="h-4 w-4 mr-2" />
                    Lista
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem 
                  onClick={() => handleCreateAction('event')}
                  className="hover:bg-gray-50 rounded-xl m-1"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Evento
                </DropdownMenuItem>
              )}
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

        {/* Calendar View - Mini Calendario */}
        {!inTasks && state === 'expanded' && (
          <div>
            <MiniCalendar />
          </div>
        )}

        {/* Búsqueda */}
        {state === 'expanded' && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={inTasks ? "Buscar tareas" : "Buscar personas y eventos"}
              className="pl-10 rounded-2xl border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>
        )}

        {/* Tasks View - Filtros principales */}
        {inTasks && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {taskLists.map((list) => {
                  const Icon = list.icon;
                  const isActive = filter === list.id;
                  
                  return (
                    <SidebarMenuItem key={list.id}>
                      <SidebarMenuButton 
                        onClick={() => setFilter(list.id as any)}
                        className={`w-full ${state === 'expanded' ? 'justify-between' : 'justify-center'} hover:bg-gray-50 rounded-lg transition-colors py-2 px-3 ${
                          isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-700'
                        }`}
                        tooltip={state === 'collapsed' ? list.name : undefined}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4" style={{ color: isActive ? '#3B82F6' : list.color }} />
                          {state === 'expanded' && (
                            <span className="text-sm font-medium">{list.name}</span>
                          )}
                        </div>
                        {state === 'expanded' && list.count > 0 && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {list.count}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Calendar View - Mis Calendarios */}
        {!inTasks && (
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
        )}

        {/* Calendar View - Otros Calendarios */}
        {!inTasks && (
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
        )}

        {/* Tasks View - Mis Listas */}
        {inTasks && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between text-gray-700 font-semibold">
              <div className="flex items-center">
                <button
                  onClick={() => setMyListsExpanded(!myListsExpanded)}
                  className="mr-2 hover:bg-gray-100 rounded p-1"
                >
                  {myListsExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {state === 'expanded' && 'Mis listas'}
              </div>
              {state === 'expanded' && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </SidebarGroupLabel>
            
            {myListsExpanded && (
              <SidebarGroupContent className="space-y-2">
                {myLists.map((list) => (
                  <div key={list.id} className="flex items-center space-x-3 py-1 px-2 hover:bg-gray-50 rounded-xl transition-colors">
                    <input 
                      type="checkbox" 
                      checked={list.isChecked}
                      onChange={() => {}}
                      aria-label={`Mostrar ${list.name}`}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                    />
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: list.color }}
                    />
                    {state === 'expanded' && (
                      <span className="text-sm text-gray-700 flex-1">{list.name}</span>
                    )}
                  </div>
                ))}
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        )}

        {/* Tasks View - Estadísticas rápidas */}
        {inTasks && state === 'expanded' && stats.overdue > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
            <div className="flex items-start space-x-2 text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Tareas vencidas</p>
                <p className="text-xs text-red-600">{stats.overdue} tareas necesitan atención</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </SidebarUI>
  );
};

export default Sidebar;

