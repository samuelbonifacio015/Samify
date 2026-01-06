
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* Componente para el mini calendario */
const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    /* Ajuste para empezar el lunes */
    const dayOfWeek = startDate.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
      
      if (days.length >= 42) break;
    }
    
    return days;
  };

  /* Función para navegar entre meses */
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Button>
        
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 capitalize">
            {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
          </h2>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      {/* Dias de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grilla del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            className={`
              h-10 w-10 text-sm rounded-full transition-all duration-200 relative
              ${isCurrentMonth(day) 
                ? 'text-gray-900 hover:bg-gray-100' 
                : 'text-gray-300'
              }
              ${isToday(day) 
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md' 
                : ''
              }
            `}
          >
            {day.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
