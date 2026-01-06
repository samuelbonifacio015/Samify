
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* Props para el header */
interface HeaderProps {
  currentDate: Date;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
}
  
/* Componente para el header */
const Header = ({ currentDate, onNavigateMonth, onGoToToday }: HeaderProps) => {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  /* Estado para el mes y el año */
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  /* Renderizado del header */
  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigateMonth('prev')}
        className="hover:bg-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="text-center min-w-[200px]">
        <h1 className="text-lg font-semibold text-gray-900">
          {currentMonth} {currentYear}
        </h1>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigateMonth('next')}
        className="hover:bg-gray-100"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        onClick={onGoToToday}
        className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-2xl shadow-soft"
      >
        Hoy
      </Button>
    </div>
  );
};

export default Header;
