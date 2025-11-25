import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { ChevronLeft, ChevronRight, Plus, Clock, Trash2, X, Calendar as CalendarIcon, CheckSquare, Bell } from 'lucide-react';
import { format, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, addMonths, isSameDay, isAfter } from 'date-fns';
import { hr } from 'date-fns/locale';
import { useData } from '../context/DataContext';
import { CalendarEvent } from '../types';

export const CalendarPage: React.FC = () => {
  const { events, addEvent, deleteEvent } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    type: 'event'
  });

  const getStartOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };
  
  const parseDate = (dateStr: string) => {
      // Ensure local time parsing to avoid timezone shifts
      return new Date(`${dateStr}T00:00`);
  };

  const monthStart = getStartOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add empty placeholders for grid alignment based on start day
  const startDay = getDay(monthStart); // 0 = Sunday
  const emptyDays = Array(startDay === 0 ? 6 : startDay - 1).fill(null); 

  const handlePrevMonth = () => setCurrentDate(addMonths(currentDate, -1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    addEvent({
      id: Date.now(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time || '00:00',
      type: newEvent.type as any || 'event'
    });
    
    setIsModalOpen(false);
    setNewEvent({ title: '', date: new Date().toISOString().split('T')[0], time: '12:00', type: 'event' });
  };

  // Filter events for sidebar
  const todayEvents = events.filter(e => isSameDay(parseDate(e.date), new Date())).sort((a, b) => a.time.localeCompare(b.time));
  const upcomingEvents = events
    .filter(e => isAfter(parseDate(e.date), new Date()) && !isSameDay(parseDate(e.date), new Date()))
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
    .slice(0, 5); // Show only next 5 events

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col xl:flex-row gap-6">
      
      {/* Main Calendar Grid */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Calendar Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-display font-bold capitalize flex items-center gap-4">
            {format(currentDate, 'MMMM yyyy', { locale: hr })}
            <span className="text-sm font-sans font-normal text-zinc-500 bg-white/5 px-3 py-1 rounded-full">
                {events.length} događaja
            </span>
          </h2>
          <div className="flex gap-2">
             <button onClick={handlePrevMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"><ChevronLeft size={20} /></button>
             <button onClick={handleNextMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"><ChevronRight size={20} /></button>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="ml-4 px-4 py-2 bg-primary text-white rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
             >
               <Plus size={18} /> Novi Događaj
             </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 mb-2">
          {['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'].map(d => (
            <div key={d} className="text-center text-zinc-500 text-sm font-medium uppercase tracking-wider">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr gap-2 min-h-[500px]">
          {emptyDays.map((_, i) => (
             <div key={`empty-${i}`} className="bg-transparent" />
          ))}
          {days.map((day) => {
            const dayEvents = events.filter(e => isSameDay(parseDate(e.date), day));
            return (
            <GlassCard 
              key={day.toString()} 
              hoverEffect={false}
              className={`min-h-[100px] p-3 flex flex-col gap-2 cursor-pointer hover:bg-white/5 transition-colors border-white/5 relative group
                ${isToday(day) ? 'bg-white/5 border-primary/50 ring-1 ring-primary/50' : ''}
              `}
              onClick={() => {
                  setNewEvent({ ...newEvent, date: format(day, 'yyyy-MM-dd') });
                  setIsModalOpen(true);
              }}
            >
              <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                    ${isToday(day) ? 'bg-primary text-white' : 'text-zinc-400'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 0 && <div className="w-1.5 h-1.5 bg-white rounded-full md:hidden"></div>}
              </div>
              
              {/* Event Indicators */}
              <div className="flex flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((e) => (
                    <div 
                        key={e.id} 
                        className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium flex items-center gap-1
                        ${e.type === 'event' ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30' : 
                          e.type === 'task' ? 'bg-green-500/20 text-green-200 border border-green-500/30' :
                          'bg-orange-500/20 text-orange-200 border border-orange-500/30'}
                        `}
                    >
                        {e.type === 'task' && <CheckSquare size={8} />}
                        {e.type === 'reminder' && <Bell size={8} />}
                        {e.title}
                    </div>
                ))}
                {dayEvents.length > 3 && (
                    <span className="text-[9px] text-zinc-500 pl-1">+{dayEvents.length - 3} više</span>
                )}
              </div>
              
              {/* Hover Add Button */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                  <Plus className="text-white" />
              </div>
            </GlassCard>
          )})}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full xl:w-96 flex flex-col gap-6">
         {/* Today Section */}
         <GlassCard className="p-6 flex-1 flex flex-col">
            <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Danas
                <span className="text-zinc-500 text-xs font-normal ml-auto">{format(new Date(), 'd. MMMM', { locale: hr })}</span>
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[300px] xl:max-h-none">
               {todayEvents.length === 0 ? (
                   <div className="text-center py-8 text-zinc-500 text-sm">Nema događaja za danas.</div>
               ) : (
                   todayEvents.map(e => (
                    <div key={e.id} className="flex gap-3 items-start border-l-2 border-primary pl-3 group hover:bg-white/5 p-2 rounded-r-lg transition-colors">
                        <div className="flex-1">
                            <span className="text-zinc-200 text-sm font-medium block">{e.title}</span>
                            <span className="text-zinc-500 text-xs flex items-center gap-1"><Clock size={10} /> {e.time}</span>
                        </div>
                        <button onClick={(event) => { event.stopPropagation(); deleteEvent(e.id); }} className="opacity-0 group-hover:opacity-100 text-red-400 p-1"><Trash2 size={14} /></button>
                    </div>
                   ))
               )}
            </div>
         </GlassCard>

         {/* Upcoming Section */}
         <GlassCard className="p-6 flex-1 flex flex-col">
            <h3 className="font-display font-bold mb-4 text-zinc-300">Nadolazeće</h3>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[300px] xl:max-h-none">
                {upcomingEvents.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 text-sm">Nema nadolazećih događaja.</div>
                ) : (
                    upcomingEvents.map(e => (
                        <div key={e.id} className="flex gap-3 items-center group p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <div className="flex flex-col items-center min-w-[3rem] bg-white/5 rounded p-1 border border-white/5">
                                <span className="text-[10px] text-zinc-400 uppercase">{format(parseDate(e.date), 'MMM')}</span>
                                <span className="text-lg font-bold text-white leading-none">{format(parseDate(e.date), 'dd')}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-zinc-300 text-sm font-medium truncate">{e.title}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-zinc-400">{e.type}</span>
                                    <span className="text-zinc-500 flex items-center gap-1"><Clock size={10} /> {e.time}</span>
                                </div>
                            </div>
                            <button onClick={() => deleteEvent(e.id)} className="opacity-0 group-hover:opacity-100 text-red-400 p-1"><Trash2 size={14} /></button>
                        </div>
                    ))
                )}
            </div>
         </GlassCard>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <GlassCard className="w-full max-w-md p-6 animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-display font-bold">Novi Događaj</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleSaveEvent} className="space-y-4">
                      <div>
                          <label className="block text-xs uppercase text-zinc-500 mb-1">Naziv</label>
                          <input 
                              type="text" 
                              required
                              value={newEvent.title}
                              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary"
                              placeholder="npr. Sastanak Uprave"
                              autoFocus
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs uppercase text-zinc-500 mb-1">Datum</label>
                              <input 
                                  type="date" 
                                  required
                                  value={newEvent.date}
                                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary [color-scheme:dark]"
                              />
                          </div>
                          <div>
                              <label className="block text-xs uppercase text-zinc-500 mb-1">Vrijeme</label>
                              <input 
                                  type="time" 
                                  value={newEvent.time}
                                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary [color-scheme:dark]"
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs uppercase text-zinc-500 mb-1">Tip</label>
                          <div className="grid grid-cols-3 gap-2">
                              {['event', 'task', 'reminder'].map(type => (
                                  <div 
                                      key={type}
                                      onClick={() => setNewEvent({...newEvent, type: type as any})}
                                      className={`cursor-pointer text-center py-2 rounded-lg border text-sm capitalize transition-all
                                          ${newEvent.type === type 
                                              ? 'bg-primary border-primary text-white' 
                                              : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'}
                                      `}
                                  >
                                      {type}
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="pt-4 flex justify-end gap-3">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Odustani</button>
                          <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20">Sačuvaj</button>
                      </div>
                  </form>
              </GlassCard>
          </div>
      )}
    </div>
  );
};