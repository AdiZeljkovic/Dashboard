
import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Check, Smile, Frown, Meh, Angry, Laugh } from 'lucide-react';
import { useData } from '../context/DataContext';

const days = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];

export const HabitsMood: React.FC = () => {
  const { habits } = useData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Habits */}
      <GlassCard className="p-8">
        <h2 className="text-2xl font-display font-bold mb-6">Praćenje Navika</h2>
        <div className="space-y-6">
           {/* Header */}
           <div className="grid grid-cols-10 gap-2 mb-2">
              <div className="col-span-3"></div>
              {days.map(d => <div key={d} className="text-center text-xs text-zinc-500">{d}</div>)}
           </div>

           {habits.length === 0 ? <p className="text-zinc-500 text-center">Nema definisanih navika.</p> : habits.map(habit => (
             <div key={habit.id} className="grid grid-cols-10 gap-2 items-center group">
                <div className="col-span-3 flex flex-col">
                   <span className="font-medium text-zinc-200 group-hover:text-primary transition-colors">{habit.name}</span>
                   <span className="text-xs text-zinc-500">🔥 {habit.streak} dana</span>
                </div>
                {habit.history.map((done, i) => (
                   <div key={i} className="flex justify-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300
                         ${done 
                           ? 'bg-primary border-primary text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]' 
                           : 'bg-white/5 border-white/5 text-transparent hover:border-zinc-500'}
                      `}>
                         <Check size={14} strokeWidth={4} />
                      </div>
                   </div>
                ))}
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
              { icon: Angry, color: 'hover:text-red-500 hover:bg-red-500/10', label: 'Ljut' },
              { icon: Frown, color: 'hover:text-orange-500 hover:bg-orange-500/10', label: 'Tužan' },
              { icon: Meh, color: 'hover:text-yellow-500 hover:bg-yellow-500/10', label: 'Meh' },
              { icon: Smile, color: 'hover:text-blue-500 hover:bg-blue-500/10', label: 'Dobro' },
              { icon: Laugh, color: 'hover:text-green-500 hover:bg-green-500/10', label: 'Super' },
            ].map((m, i) => (
               <button key={i} className={`flex-1 aspect-square rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 ${m.color} group`}>
                  <m.icon size={32} className="text-zinc-400 group-hover:text-inherit transition-colors" />
                  <span className="text-xs text-zinc-500 group-hover:text-inherit">{m.label}</span>
               </button>
            ))}
         </div>

         <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Historija</h3>
         <div className="flex gap-1 h-32 items-end">
            {[3, 4, 5, 2, 4, 5, 3, 4, 5, 5, 4, 3, 2, 4].map((val, i) => (
               <div 
                  key={i} 
                  className="flex-1 bg-white/5 hover:bg-primary/50 transition-colors rounded-t-sm relative group"
                  style={{ height: `${val * 20}%` }}
               >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                    {val}/5
                 </div>
               </div>
            ))}
         </div>
      </GlassCard>

    </div>
  );
};
