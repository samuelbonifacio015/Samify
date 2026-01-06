//Tipos de eventos
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'work' | 'personal' | 'meeting';
  description?: string;
  participants?: string[];
  reminder?: number; 
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
}

//Tipos de formulario de eventos
export interface EventFormData {
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'work' | 'personal' | 'meeting';
  description: string;
  participants: string;
  reminder: number;
  isRecurring: boolean;
  recurringType: 'daily' | 'weekly' | 'monthly';
}
