import { useState } from "react";
import { Plus, Bell, Calendar } from "lucide-react";
import { useCalendar } from "@/hooks/useCalendar";
import { useMobile } from "@/hooks/use-mobile";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CalendarGrid from "@/components/CalendarGrid";
import EventModal from "@/components/EventModal";
import FloatingActionButton from "@/components/FloatingActionButton";
import NavigationToggle from "@/components/NavigationToggle";
import Tasks from "@/pages/Tasks";
import { CalendarEvent } from "@/types/event";

const Index = () => {
  const isMobile = useMobile();
  const [currentView, setCurrentView] = useState<"calendar" | "tasks">(
    "calendar"
  );

  const {
    currentDate,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    monthCalendar,
    navigateMonth,
    goToToday,
  } = useCalendar();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);

  const handleDateClick = (date: Date) => {
    if (currentView === "calendar") {
      setSelectedDate(date);
      setEditingEvent(undefined);
      setIsEventModalOpen(true);
    }
  };

  const handleCreateEvent = () => {
    setSelectedDate(new Date());
    setEditingEvent(undefined);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: any) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
  };

  const handleViewChange = (view: "calendar" | "tasks") => {
    setCurrentView(view);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar 
          inTasks={currentView === "tasks"}
          onCreateEvent={handleCreateEvent}
          onCreateTask={() => console.log('Create task')}
        />

        <SidebarInset className="flex-1">
          {/* Header with sidebar trigger and navigation */}
          <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-soft">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="md:hidden" />
                <div className="hidden md:block">
                  <SidebarTrigger />
                </div>

                {/* Navigation Toggle */}
                <NavigationToggle
                  currentView={currentView}
                  onViewChange={handleViewChange}
                />
              </div>

              {/* Calendar Navigation controls */}
              {currentView === "calendar" && (
                <Header
                  currentDate={currentDate}
                  onNavigateMonth={navigateMonth}
                  onGoToToday={goToToday}
                />
              )}
            </div>
          </div>

          {/* Main content */}
          <main className="p-6">
            {currentView === "calendar" ? (
              <div className="animate-fade-in">
                <CalendarGrid
                  days={monthCalendar}
                  currentDate={currentDate}
                  getEventsForDate={getEventsForDate}
                  onDateClick={handleDateClick}
                />
              </div>
            ) : (
              <div className="animate-fade-in">
                <Tasks />
              </div>
            )}

            {currentView === "calendar" && (
              <EventModal
                isOpen={isEventModalOpen}
                onClose={() => setIsEventModalOpen(false)}
                onSave={handleSaveEvent}
                selectedDate={selectedDate}
                editingEvent={editingEvent}
              />
            )}

            {/* Show floating button on mobile when sidebar is collapsed */}
            <div className="md:hidden">
              <FloatingActionButton
                onClick={
                  currentView === "calendar" ? handleCreateEvent : () => {}
                }
              />
            </div>
          </main>

          {/* Welcome section - only show in calendar view */}
          {currentView === "calendar" && (
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    ¡Bienvenido a Samify! 📅
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Tu herramienta de productividad completa - Calendario y
                    Tareas
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        Crear Eventos
                      </h3>
                      <p className="text-sm text-gray-600">
                        Haz clic en cualquier día o usa el botón "+"
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Bell className="h-6 w-6 text-success" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        Gestionar Tareas
                      </h3>
                      <p className="text-sm text-gray-600">
                        Cambia a la vista de tareas para organizarte
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Calendar className="h-6 w-6 text-orange-500" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        Vista Integrada
                      </h3>
                      <p className="text-sm text-gray-600">
                        Alterna entre calendario y tareas fácilmente
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
