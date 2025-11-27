


import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Check, Smile, Frown, Meh, Angry, Laugh } from 'lucide-react';
import { useData } from '../context/DataContext';
import { format, subDays, isSameDay, eachDayOfInterval, subMonths } from 'date-fns';

export const HabitsMood: React.FC = () => {
  const { habits, toggleHabitForDate, addMoodEntry, moodEntries } = useData();

  // Generate last 14 days for the grid
  const today = new Date();
  const last14Days = Array.from({length: 14}, (_, i) => subDays(today, 13 - i));

  const handleMoodClick = (score: 1 | 2 | 3 | 4 | 5) => {
      addMoodEntry({
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          score: score
      });
      alert("Raspoloženje zabilježeno!");
  };

  const getMoodCount = (score: number) => moodEntries.filter(m => m.score === score).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Habits */}
      <GlassCard className="p-8">
        <h2 className="text-2xl font-display font-bold mb-6">Praćenje Navika</h2>
        <div className="space-y-8">
           
           {/* Header with Dates */}
           <div className="flex justify-end gap-1 mb-2 pl-[120px]">
              {last14Days.map((d, i) => (
                  <div key={i} className="w-6 text-center text-[10px] text-zinc-500 uppercase">
                      {format(d, 'dd')}
                  </div>
              ))}
           </div>

           {habits.length === 0 ? <p className="text-zinc-500 text-center">Nema definisanih navika.</p> : habits.map(habit => (
             <div key={habit.id} className="flex items-center gap-4 group">
                <div className="w-[120px] flex flex-col">
                   <span className="font-medium text-zinc-200 group-hover:text-primary transition-colors truncate" title={habit.name}>{habit.name}</span>
                   <span className="text-xs text-zinc-500">🔥 {habit.streak} dana</span>
                </div>
                
                <div className="flex-1 flex justify-end gap-1">
                    {last14Days.map((date, i) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const isDone = habit.completedDates?.includes(dateStr);
                        return (
                            <button 
                                key={i}
                                onClick={() => toggleHabitForDate(habit.id, dateStr)}
                                title={dateStr}
                                className={`w-6 h-6 rounded flex items-center justify-center border transition-all duration-200
                                    ${isDone 
                                    ? 'bg-primary border-primary text-white shadow-[0_0_8px_rgba(139,92,246,0.4)]' 
                                    : 'bg-white/5 border-white/5 text-transparent hover:border-zinc-500'}
                                `}
                            >
                                <Check size={12} strokeWidth={4} />
                            </button>
                        );
                    })}
                </div>
             </div>
           ))}
        </div>
      </GlassCard>

      {/* Mood Tracker */}
      <GlassCard className="p-8 flex flex-col">
         <h2 className="text-2xl font-display font-bold mb-2">Mood Tracker</h2>
         <p className="text-zinc-400 mb-8">Kako se osjećaš danas?</p>

         <div className="flex justify-between gap-2 mb-12">
            {[
              { icon: Angry, color: 'hover:text-red-500 hover:bg-red-500/10', label: 'Ljut', score: 1 },
              { icon: Frown, color: 'hover:text-orange-500 hover:bg-orange-500/10', label: 'Tužan', score: 2 },
              { icon: Meh, color: 'hover:text-yellow-500 hover:bg-yellow-500/10', label: 'Meh', score: 3 },
              { icon: Smile, color: 'hover:text-blue-500 hover:bg-blue-500/10', label: 'Dobro', score: 4 },
              { icon: Laugh, color: 'hover:text-green-500 hover:bg-green-500/10', label: 'Super', score: 5 },
            ].map((m, i) => (
               <button 
                  key={i} 
                  onClick={() => handleMoodClick(m.score as any)}
                  className={`flex-1 aspect-square rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 ${m.color} group`}
               >
                  <m.icon size={32} className="text-zinc-400 group-hover:text-inherit transition-colors" />
                  <span className="text-xs text-zinc-500 group-hover:text-inherit">{m.label}</span>
               </button>
            ))}
         </div>

         <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Statistika Raspoloženja</h3>
         <div className="flex gap-4 h-32 items-end px-4 border-b border-white/5 pb-2">
            {[1, 2, 3, 4, 5].map((score) => {
               const count = getMoodCount(score);
               const max = Math.max(...[1,2,3,4,5].map(s => getMoodCount(s))) || 1;
               const height = (count / max) * 100;
               
               let color = 'bg-zinc-500';
               if (score === 1) color = 'bg-red-500';
               if (score === 2) color = 'bg-orange-500';
               if (score === 3) color = 'bg-yellow-500';
               if (score === 4) color = 'bg-blue-500';
               if (score === 5) color = 'bg-green-500';

               return (
               <div key={score} className="flex-1 flex flex-col justify-end gap-2 group h-full">
                   <div className="text-center text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">{count}</div>
                   <div 
                      className={`w-full rounded-t-lg transition-all duration-500 opacity-50 group-hover:opacity-100 ${color}`}
                      style={{ height: `${height || 5}%` }}
                   ></div>
                   <div className="text-center font-bold text-zinc-500">{score}</div>
               </div>
            )})}
         </div>
      </GlassCard>

    </div>
  );
};
