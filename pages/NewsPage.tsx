
import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Cpu, Gamepad2, Globe, Youtube, Play, Clock, ArrowUpRight, TrendingUp, RefreshCw, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';

export const NewsPage: React.FC = () => {
  const { news, videos, refreshNews } = useData();
  const [activeTab, setActiveTab] = useState<'tech' | 'gaming' | 'world'>('tech');
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [visibleNewsCount, setVisibleNewsCount] = useState(10);
  const [visibleVideoCount, setVisibleVideoCount] = useState(8); // 8 fits grid better (4 cols x 2 rows)

  // Reset pagination when switching tabs
  useEffect(() => {
    setVisibleNewsCount(10);
    setVisibleVideoCount(8);
  }, [activeTab]);

  const handleRefresh = async () => {
      setLoading(true);
      await refreshNews();
      setLoading(false);
  };

  const loadMoreNews = () => setVisibleNewsCount(prev => prev + 10);
  const loadMoreVideos = () => setVisibleVideoCount(prev => prev + 8);

  // Helper to get category style
  const getCategoryConfig = (cat: string) => {
    switch (cat) {
      case 'tech': return { label: 'Tech', icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-500' };
      case 'gaming': return { label: 'Gaming', icon: Gamepad2, color: 'text-purple-400', bg: 'bg-purple-500' };
      case 'world': return { label: 'Svijet', icon: Globe, color: 'text-green-400', bg: 'bg-green-500' };
      default: return { label: 'Tech', icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-500' };
    }
  };

  const currentNews = news.filter(n => n.category === activeTab);
  const currentVideos = videos.filter(v => v.category === activeTab);
  const currentConfig = getCategoryConfig(activeTab);

  const featuredNews = currentNews.find(n => n.featured) || currentNews[0];
  const allOtherNews = currentNews.filter(n => n.id !== featuredNews?.id);
  
  // Sliced data for display
  const displayNews = allOtherNews.slice(0, visibleNewsCount);
  const displayVideos = currentVideos.slice(0, visibleVideoCount);

  return (
    <div className="space-y-10 pb-10 relative">
       
       {/* Navigation Tabs */}
       <div className="flex justify-center items-center relative">
          <div className="flex bg-black/40 rounded-full p-1 border border-white/10 backdrop-blur-xl shadow-2xl">
            {(['tech', 'gaming', 'world'] as const).map((cat) => {
               const config = getCategoryConfig(cat);
               return (
               <button
                 key={cat}
                 onClick={() => setActiveTab(cat)}
                 className={`px-8 py-2.5 rounded-full text-sm font-medium flex items-center gap-2.5 transition-all duration-300 relative overflow-hidden
                   ${activeTab === cat ? 'text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'text-zinc-500 hover:text-white'}
                 `}
               >
                 {activeTab === cat && (
                   <div className={`absolute inset-0 opacity-20 ${config.bg}`} />
                 )}
                 {React.createElement(config.icon, { size: 16 })}
                 <span className="relative z-10">{config.label}</span>
               </button>
            )})}
          </div>

          <button 
             onClick={handleRefresh} 
             disabled={loading}
             className="absolute right-0 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white p-2.5 rounded-full transition-all border border-white/5 group"
             title="Osvježi izvore"
          >
             <RefreshCw size={18} className={`group-hover:text-primary transition-colors ${loading ? "animate-spin" : ""}`} />
          </button>
       </div>

       {/* News Layout */}
       {featuredNews ? (
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Main Featured Article (Hero) */}
            <a href={featuredNews.url} target="_blank" rel="noreferrer" className="xl:col-span-2 block group">
                <GlassCard className="p-0 overflow-hidden relative min-h-[400px] flex flex-col justify-end h-full">
                <div className="absolute inset-0">
                    <img 
                        src={featuredNews.img} 
                        alt={featuredNews.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                </div>
                
                <div className="relative z-10 p-8 space-y-4">
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/10 ${currentConfig.color}`}>
                            {currentConfig.label} Featured
                        </span>
                        <span className="text-zinc-400 text-xs flex items-center gap-1">
                            <Clock size={12} /> {featuredNews.time}
                        </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight group-hover:text-primary transition-colors">
                        {featuredNews.title}
                    </h2>
                    <p className="text-zinc-300 text-lg max-w-2xl line-clamp-2">
                        {featuredNews.summary}
                    </p>
                    
                    <div className="pt-2 flex items-center gap-2 text-sm font-medium text-zinc-400">
                        <span>{featuredNews.source}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span className="group-hover:text-white transition-colors flex items-center gap-1">
                            Pročitaj više <ArrowUpRight size={14} />
                        </span>
                    </div>
                </div>
                </GlassCard>
            </a>
  
            {/* Side Feed (Standard Cards) */}
            <div className="flex flex-col gap-6">
               {displayNews.map(news => (
                 <a href={news.url} target="_blank" rel="noreferrer" key={news.id} className="block h-full">
                    <GlassCard className="group p-0 overflow-hidden cursor-pointer flex flex-col h-full hover:border-white/20">
                        <div className="h-48 relative overflow-hidden">
                        <img 
                            src={news.img} 
                            alt={news.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[10px] font-bold text-white border border-white/10">
                                {news.source}
                            </span>
                        </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-2 text-[10px] text-zinc-500 uppercase tracking-widest">
                            <span className={currentConfig.color}>{currentConfig.label}</span>
                            <span>•</span>
                            <span>{news.time}</span>
                        </div>
                        <h3 className="text-lg font-bold font-display text-white mb-2 leading-snug group-hover:text-primary transition-colors">
                            {news.title}
                        </h3>
                        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">
                            {news.summary}
                        </p>
                        </div>
                    </GlassCard>
                 </a>
               ))}
               
               {/* Load More News Button */}
               {allOtherNews.length > visibleNewsCount && (
                   <button 
                     onClick={loadMoreNews}
                     className="w-full py-4 bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                   >
                       Učitaj još vijesti <ChevronDown size={16} />
                   </button>
               )}
               
               {allOtherNews.length === 0 && <p className="text-zinc-500 text-center">Nema dodatnih vijesti. Dodajte izvore u Admin panelu.</p>}
            </div>
         </div>
       ) : (
         <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
             <Globe size={48} className="mx-auto text-zinc-600 mb-4" />
             <h3 className="text-xl font-bold text-zinc-300">Nema vijesti za ovu kategoriju</h3>
             <p className="text-zinc-500 mt-2">Idite na Admin panel -> Sadržaj i dodajte RSS izvore.</p>
         </div>
       )}

       {/* YouTube Section */}
       <div className="pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 rounded-lg bg-red-600/20 text-red-500">
                <Youtube size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-display font-bold text-white">Trending Video</h2>
                <p className="text-sm text-zinc-500">Najnovije sa vaših YouTube kanala</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {displayVideos.map((video) => (
                <a href={video.url} target="_blank" rel="noreferrer" key={video.id}>
                    <GlassCard className="p-0 overflow-hidden group cursor-pointer border-transparent hover:border-red-500/30 bg-black/20 h-full">
                    <div className="aspect-video bg-zinc-900 relative flex items-center justify-center overflow-hidden">
                        {video.thumbnail ? (
                             <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        ) : (
                            <Youtube size={32} className="text-zinc-700" />
                        )}
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                                <Play size={20} className="text-white ml-1" fill="white" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4">
                        <h4 className="text-sm font-bold text-zinc-200 line-clamp-2 leading-tight mb-2 group-hover:text-red-400 transition-colors">
                            {video.title}
                        </h4>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[8px] text-zinc-300">
                                {video.channel.charAt(0)}
                                </div>
                                <span className="text-xs text-zinc-400 truncate max-w-[100px]">{video.channel}</span>
                            </div>
                        </div>
                    </div>
                    </GlassCard>
                </a>
             ))}
          </div>

          {/* Load More Videos Button */}
          {currentVideos.length > visibleVideoCount && (
             <div className="mt-8 flex justify-center">
                <button 
                  onClick={loadMoreVideos}
                  className="px-8 py-3 bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                >
                    Učitaj još videa <ChevronDown size={16} />
                </button>
             </div>
          )}

          {currentVideos.length === 0 && (
             <div className="text-center text-zinc-500 py-10">Nema videa. Dodajte YouTube ID u Admin panelu.</div>
          )}
       </div>
    </div>
  );
};
