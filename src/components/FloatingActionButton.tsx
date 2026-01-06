
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onClick: () => void;
}

/* Componente para el botón flotante */
const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 z-50 animate-scale-up"
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default FloatingActionButton;
