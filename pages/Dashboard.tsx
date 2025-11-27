


import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Search, Youtube, Github, Cloud, Server, CheckSquare, Save, CloudRain, Sun, CloudSun, CloudLightning, ChevronDown, Link as LinkIcon, Sunrise, Sunset, Moon, Snowflake, Wind, Instagram, Linkedin, Twitter, Database, Monitor, Globe, Plus } from 'lucide-react';
import { format, getHours } from 'date-fns';
import { hr } from 'date-fns/locale';
import { useData } from '../context/DataContext';

export const Dashboard: React.FC = () => {
  const { tasks, toggleTask, shortcuts, homelabServices, addNote, prayerTimes } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState<'google' | 'bing' | 'duckduckgo'>('google');
  const [engineMenuOpen, setEngineMenuOpen] = useState(false);
  
  // Quick Note State
  const [newQuickNote, setNewQuickNote] = useState('');
  
  // Weather State
  const [weather, setWeather] = useState<{
    temp: number;
    description: string;
    wind: number;
    city: string;
    condition: string;
  } | null>(null);
  
  const [forecast, setForecast] = useState<Array<{
    date: Date;
    temp: number;
    condition: string;
  }>>([]);

  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);

  // Show ALL tasks, no slice
  const displayTasks = tasks;

  // Time & Weather Fetching
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Fetch Weather (OpenWeatherMap)
    const fetchWeather = async () => {
      const apiKey = '30784017ae9865710c046eb971f53269';
      const lat = 43.8563; // Sarajevo Latitude
      const lon = 18.4131; // Sarajevo Longitude

      try {
        // Current Weather
        const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=hr`);
        if (!currentRes.ok) throw new Error('Weather API response not ok');
        const currentData = await currentRes.json();

        // Forecast
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=hr`);
        if (!forecastRes.ok) throw new Error('Forecast API response not ok');
        const forecastData = await forecastRes.json();

        setWeather({
          temp: Math.round(currentData.main.temp),
          description: currentData.weather[0].description,
          wind: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
          city: currentData.name,
          condition: currentData.weather[0].main
        });

        // Process Forecast (Get data for next 3 days at 12:00)
        const dailyForecast: any[] = [];
        const seenDates = new Set();
        const today = new Date().toISOString().split('T')[0];

        for (const item of forecastData.list) {
            const dateStr = item.dt_txt.split(' ')[0];
            if (dateStr !== today && !seenDates.has(dateStr) && item.dt_txt.includes('12:00:00')) {
                dailyForecast.push({
                    date: new Date(item.dt_txt),
                    temp: Math.round(item.main.temp),
                    condition: item.weather[0].main
                });
                seenDates.add(dateStr);
            }
            if (dailyForecast.length === 3) break;
        }
        setForecast(dailyForecast);

      } catch (error) {
        console.warn("Weather API fetch failed, using fallback data.", error);
        // Fallback Data
        setWeather({
          temp: 18,
          description: 'Djelimično oblačno',
          wind: 12,
          city: 'Sarajevo',
          condition: 'Clouds'
        });
        setForecast([
            { date: new Date(Date.now() + 86400000), temp: 19, condition: 'Clear' },
            { date: new Date(Date.now() + 172800000), temp: 22, condition: 'Clouds' },
            { date: new Date(Date.now() + 259200000), temp: 17, condition: 'Rain' },
        ]);
      }
    };

    fetchWeather();
    
    return () => clearInterval(timer);
  }, []);

  // Calculate Next Prayer Highlight
  useEffect(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let foundNext = false;
    for (let i = 0; i < prayerTimes.length; i++) {
      const [h, m] = prayerTimes[i].time.split(':').map(Number);
      const prayerMinutes = h * 60 + m;

      if (prayerMinutes > currentMinutes) {
        setNextPrayerIndex(i);
        foundNext = true;
        break;
      }
    }
    // If passed all prayers (e.g., late night), next is Zora (index 0)
    if (!foundNext) setNextPrayerIndex(0);

  }, [currentTime, prayerTimes]);


  const getDayProgress = () => {
    const now = new Date();
    const start = new Date(now.setHours(0,0,0,0)).getTime();
    const end = new Date(now.setHours(23,59,59,999)).getTime();
    const current = new Date().getTime();
    return ((current - start) / (end - start)) * 100;
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    let url = '';
    switch (searchEngine) {
      case 'google': url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`; break;
      case 'bing': url = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`; break;
      case 'duckduckgo': url = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`; break;
    }
    window.open(url, '_blank');
  };

  const handleSaveNote = () => {
     if(!newQuickNote.trim()) return;
     addNote({
         id: Date.now().toString(),
         content: newQuickNote,
         date: new Date().toISOString().split('T')[0]
     });
     setNewQuickNote('');
     alert("Bilješka sačuvana! Vidi Admin Panel za pregled.");
  };

  const greeting = () => {
    const hour = getHours(currentTime);
    if (hour < 12) return "Dobro jutro";
    if (hour < 18) return "Dobar dan";
    return "Dobro veče";
  };

  const getWeatherIcon = (condition: string, size: number = 24) => {
    const c = condition.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle')) return <CloudRain size={size} className="text-blue-400" />;
    if (c.includes('snow')) return <Snowflake size={size} className="text-white" />;
    if (c.includes('clear')) return <Sun size={size} className="text-yellow-400" />;
    if (c.includes('clouds')) return <CloudSun size={size} className="text-zinc-400" />;
    if (c.includes('thunder')) return <CloudLightning size={size} className="text-purple-400" />;
    return <Cloud size={size} className="text-zinc-400" />;
  };

  const getShortcutIcon = (name: string) => {
    switch(name) {
      case 'Youtube': return <Youtube size={24} />;
      case 'Github': return <Github size={24} />;
      case 'Cloud': return <Cloud size={24} />;
      case 'Instagram': return <Instagram size={24} />;
      case 'Linkedin': return <Linkedin size={24} />;
      case 'Twitter': return <Twitter size={24} />;
      case 'Database': return <Database size={24} />;
      case 'Server': return <Server size={24} />;
      case 'Monitor': return <Monitor size={24} />;
      case 'Globe': return <Globe size={24} />;
      default: return <LinkIcon size={24} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-6 auto-rows-[minmax(160px,auto)]">
      
      {/* Hero / Clock & Weather */}
      <GlassCard className="md:col-span-4 lg:col-span-6 xl:col-span-6 row-span-2 flex flex-col justify-between p-8 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-all duration-1000" />
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
             <h2 className="text-zinc-400 font-medium uppercase tracking-widest text-xs mb-1">
                {weather ? weather.city : 'Učitavanje...'}, BiH
             </h2>
             <div className="flex items-center gap-3 text-zinc-100 mb-2">
                {weather ? getWeatherIcon(weather.condition, 32) : <Cloud size={32} className="animate-pulse" />}
                <span className="text-4xl font-display font-bold">
                    {weather ? `${weather.temp}°C` : '--'}
                </span>
             </div>
             <span className="text-zinc-500 text-sm capitalize flex items-center gap-2">
                {weather ? weather.description : 'Povezivanje...'}
                {weather && <span className="flex items-center gap-1 text-xs bg-white/5 px-2 py-0.5 rounded-full"><Wind size={10}/> {weather.wind} km/h</span>}
             </span>
          </div>
          
          <div className="flex gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
             {forecast.length > 0 ? forecast.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1 min-w-[50px]">
                   <span className="text-[10px] text-zinc-400 uppercase">{format(d.date, 'EEE', { locale: hr })}</span>
                   {getWeatherIcon(d.condition, 18)}
                   <span className="text-xs font-bold text-white">{d.temp}°</span>
                </div>
             )) : (
                 <div className="text-[10px] text-zinc-500">Učitavanje...</div>
             )}
          </div>
        </div>

        <div className="relative z-10 mt-auto pt-8">
           <div className="mb-2 text-primary font-medium tracking-wide flex items-center gap-2">
             <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
             {greeting()}, Adi.
           </div>
           <h1 className="text-7xl md:text-8xl xl:text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 tracking-tighter leading-none">
             {format(currentTime, 'HH:mm')}
           </h1>
           <div className="flex justify-between items-end mt-4">
             <p className="text-xl md:text-2xl text-zinc-400 font-light">
               {format(currentTime, 'EEEE, d. MMMM', { locale: hr })}
             </p>
             <div className="flex flex-col items-end gap-1 w-1/3">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Dan protekao</span>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: `${getDayProgress()}%` }}></div>
                </div>
             </div>
           </div>
        </div>
      </GlassCard>

      {/* Search Bar */}
      <div className="md:col-span-4 lg:col-span-6 xl:col-span-6 row-span-1 flex items-center z-20">
         <div className="w-full relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl opacity-20 group-hover:opacity-50 blur transition duration-500"></div>
            <form onSubmit={handleSearch} className="relative flex items-center bg-background/80 backdrop-blur-xl rounded-xl border border-white/10 p-1 shadow-2xl">
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setEngineMenuOpen(!engineMenuOpen)}
                  className="p-3 text-zinc-400 hover:text-white flex items-center gap-1 border-r border-white/10 mr-2"
                >
                  {searchEngine === 'google' && <span className="font-bold">G</span>}
                  {searchEngine === 'bing' && <span className="font-bold">B</span>}
                  {searchEngine === 'duckduckgo' && <span className="font-bold">D</span>}
                  <ChevronDown size={12} />
                </button>
                
                {engineMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-32 bg-[#0f172a] border border-white/10 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 z-50">
                     <div onClick={() => { setSearchEngine('google'); setEngineMenuOpen(false); }} className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm text-zinc-300 hover:text-white">Google</div>
                     <div onClick={() => { setSearchEngine('bing'); setEngineMenuOpen(false); }} className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm text-zinc-300 hover:text-white">Bing</div>
                     <div onClick={() => { setSearchEngine('duckduckgo'); setEngineMenuOpen(false); }} className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm text-zinc-300 hover:text-white">DuckDuckGo</div>
                  </div>
                )}
              </div>

              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Pretraži ${searchEngine}...`} 
                className="bg-transparent border-none outline-none text-xl text-white w-full placeholder:text-zinc-600 font-light h-12"
              />
              <button type="submit" className="p-3 hover:text-primary text-zinc-400 transition-colors">
                 <Search size={20} />
              </button>
            </form>
         </div>
      </div>

      {/* Shortcuts - Dynamic */}
      <GlassCard className="md:col-span-2 lg:col-span-3 xl:col-span-3 row-span-1 p-6 flex flex-col justify-between">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Shortcuts</h3>
        <div className="grid grid-cols-3 gap-3 mt-2">
           {shortcuts.map(shortcut => (
             <a 
               key={shortcut.id} 
               href={shortcut.url} 
               target="_blank" 
               rel="noreferrer" 
               className={`aspect-square flex flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-all`}
             >
               {getShortcutIcon(shortcut.iconName)}
               <span className="text-[10px] truncate w-full text-center px-1">{shortcut.name}</span>
             </a>
           ))}
        </div>
      </GlassCard>

      {/* Homelab Status - Dynamic & Clickable */}
      <GlassCard className="md:col-span-2 lg:col-span-3 xl:col-span-3 row-span-1 p-5">
        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
          <h3 className="text-zinc-100 font-display font-bold flex items-center gap-2">
             <Server size={16} className="text-primary" /> Homelab
          </h3>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-2">
          {homelabServices.map((item) => (
             <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                key={item.id} 
                className="flex justify-between items-center text-sm p-2 rounded hover:bg-white/5 transition-colors group"
             >
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'online' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-red-500'}`}></div>
                   <span className="text-zinc-300 font-medium group-hover:text-primary transition-colors">{item.name}</span>
                </div>
                <span className="text-[10px] text-zinc-600 font-mono group-hover:text-zinc-400">{item.ip}</span>
             </a>
          ))}
        </div>
      </GlassCard>

      {/* Vaktija Widget - Real Data */}
      <GlassCard className="md:col-span-2 lg:col-span-2 xl:col-span-2 row-span-2 p-0 overflow-hidden flex flex-col">
        <div className="bg-primary/10 p-4 border-b border-primary/10 flex justify-between items-center">
          <h3 className="font-display font-bold text-primary-foreground flex items-center gap-2">
             <Moon size={16} /> Vaktija
          </h3>
          <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">Sarajevo</span>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-center gap-1.5">
             {prayerTimes.map((p, i) => (
               <div 
                  key={i} 
                  className={`flex justify-between items-center p-2 rounded-lg transition-all 
                    ${i === nextPrayerIndex 
                      ? 'bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary pl-3 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                      : 'hover:bg-white/5 border-l-2 border-transparent'}`}
               >
                 <div className="flex items-center gap-2">
                    {i === 1 ? <Sunrise size={14} className="text-yellow-500" /> : i === 4 ? <Sunset size={14} className="text-orange-500" /> : null}
                    <span className={`text-sm ${i === nextPrayerIndex ? 'text-white font-medium' : 'text-zinc-500'}`}>{p.name}</span>
                 </div>
                 <span className={`text-sm font-mono ${i === nextPrayerIndex ? 'text-primary font-bold' : 'text-zinc-400'}`}>{p.time}</span>
               </div>
             ))}
        </div>
      </GlassCard>

      {/* Task List - Shows ALL tasks */}
      <GlassCard className="md:col-span-2 lg:col-span-4 xl:col-span-4 row-span-2 p-6 flex flex-col">
         <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-display font-bold">Moj Dan</h3>
           <div className="flex gap-2">
             <span className="text-xs px-2 py-1 rounded bg-white/5 text-zinc-400">{displayTasks.filter(t => t.completed).length}/{displayTasks.length}</span>
           </div>
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
           {displayTasks.map(task => (
             <div 
               key={task.id} 
               onClick={() => toggleTask(task.id)}
               className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
             >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${task.completed ? 'bg-primary border-primary' : 'border-zinc-600 group-hover:border-primary'}`}>
                  {task.completed && <CheckSquare size={12} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                   <p className={`text-sm truncate ${task.completed ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>{task.title}</p>
                </div>
                <span className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
             </div>
           ))}
           {displayTasks.length === 0 && <p className="text-center text-zinc-500 text-sm mt-10">Sve čisto! Nema zadataka.</p>}
         </div>
      </GlassCard>

      {/* Quick Notes - Add New */}
      <GlassCard className="md:col-span-4 lg:col-span-6 xl:col-span-6 row-span-1 p-0 flex flex-col">
         <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-black/20">
            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2"><Plus size={12}/> Dodaj Bilješku</h3>
            <button 
              onClick={handleSaveNote}
              className="text-primary hover:text-white transition-colors p-1"
            >
              <Save size={16} />
            </button>
         </div>
         <textarea 
            className="flex-1 w-full bg-transparent resize-none outline-none text-zinc-300 placeholder:text-zinc-700 font-light p-4 text-sm leading-relaxed"
            placeholder="Napiši novu bilješku i klikni Save..."
            value={newQuickNote}
            onChange={(e) => setNewQuickNote(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter' && e.ctrlKey) handleSaveNote();
            }}
         ></textarea>
      </GlassCard>

    </div>
  );
};
