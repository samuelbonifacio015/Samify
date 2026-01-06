
import { useState, useMemo } from 'react';
import { CalendarEvent } from '@/types/event';

// Hook para manejar el calendario.
export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Reunión de equipo',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      type: 'meeting',
      description: 'Revisión semanal del proyecto'
    },
    {
      id: '2',
      title: 'Presentación cliente',
      date: new Date(Date.now() + 86400000),
      startTime: '14:00',
      endTime: '15:30',
      type: 'work',
      description: 'Presentar propuesta final'
    }
  ]);

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updatedEvent: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const monthCalendar = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Ajuste para empezar el lunes
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - daysToSubtract);
    
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return days;
  }, [currentDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return {
    currentDate,
    setCurrentDate,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    monthCalendar,
    navigateMonth,
    goToToday
  };
};
