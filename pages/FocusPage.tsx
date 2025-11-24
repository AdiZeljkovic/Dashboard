import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Play, Pause, RotateCcw, Target, Coffee } from 'lucide-react';

export const FocusPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [duration, setDuration] = useState(25 * 60);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const setTimerMode = (newMode: 'focus' | 'short' | 'long') => {
    setMode(newMode);
    setIsActive(false);
    let time = 25 * 60;
    if (newMode === 'short') time = 5 * 60;
    if (newMode === 'long') time = 15 * 60;
    setTimeLeft(time);
    setDuration(time);
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // SVG Circle calculation
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / duration) * circumference;

  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center relative">
       {/* Background Decoration */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

       <div className="flex flex-col items-center gap-8 z-10 w-full max-w-md">
          {/* Mode Selector */}
          <div className="flex bg-black/40 p-1 rounded-full border border-white/10 backdrop-blur-md">
            {[
              { id: 'focus', label: 'Deep Work', icon: Target },
              { id: 'short', label: 'Short Break', icon: Coffee },
              { id: 'long', label: 'Long Break', icon: Coffee },
            ].map((m) => (
               <button
                 key={m.id}
                 onClick={() => setTimerMode(m.id as any)}
                 className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300
                   ${mode === m.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-zinc-500 hover:text-zinc-200'}
                 `}
               >
                 <m.icon size={14} />
                 {m.label}
               </button>
            ))}
          </div>

          {/* Main Timer Visual */}
          <div className="relative group">
             {/* Progress Circle SVG */}
             <svg width="320" height="320" className="transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="160" cy="160" r={radius}
                  stroke="hsl(217 32% 17%)"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="160" cy="160" r={radius}
                  stroke="hsl(263 70% 65%)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear shadow-[0_0_20px_theme(colors.primary.DEFAULT)]"
                  style={{ filter: "drop-shadow(0 0 6px rgba(139, 92, 246, 0.5))" }}
                />
             </svg>
             
             {/* Text Center */}
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-7xl font-display font-bold text-white tracking-tighter tabular-nums">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-zinc-500 uppercase tracking-widest text-xs mt-2">
                  {isActive ? 'Fokusiran si' : 'Spreman?'}
                </span>
             </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
             <button 
               onClick={toggleTimer}
               className="group relative w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
             >
               {isActive ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
             </button>
             
             <button 
               onClick={resetTimer}
               className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
             >
               <RotateCcw size={24} />
             </button>
          </div>
       </div>
    </div>
  );
};