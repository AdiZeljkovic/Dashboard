

import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  Bell, Menu, X, LayoutGrid, Calendar, Kanban, DollarSign, Users, Target, CheckCircle, Globe, Settings, Hexagon,
  Moon, AlertCircle, Info, Clock, Check, LogOut
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatDistanceToNow } from 'date-fns';
import { hr } from 'date-fns/locale';

const navItems = [
  { label: 'Naslovnica', path: '/', icon: LayoutGrid },
  { label: 'Kalendar', path: '/calendar', icon: Calendar },
  { label: 'Boards', path: '/boards', icon: Kanban },
  { label: 'Finansije', path: '/finance', icon: DollarSign },
  { label: 'CRM', path: '/crm', icon: Users },
  { label: 'Fokus', path: '/focus', icon: Target },
  { label: 'Navike', path: '/habits', icon: CheckCircle },
  { label: 'Vijesti', path: '/news', icon: Globe },
  { label: 'Admin', path: '/admin', icon: Settings },
];

export const Layout: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications, removeNotification, logout } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type: string, category: string) => {
      if (category === 'prayer') return <Moon size={16} className="text-purple-400" />;
      if (category === 'finance') return <DollarSign size={16} className="text-red-400" />;
      if (category === 'habit') return <CheckCircle size={16} className="text-green-400" />;
      if (category === 'calendar') return <Calendar size={16} className="text-orange-400" />;
      return <Info size={16} className="text-blue-400" />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground relative overflow-x-hidden">
      
      {/* Animated Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-[100px] animate-blob mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-blue-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[45rem] h-[45rem] bg-primary/10 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo - Redesigned */}
          <div className="flex items-center gap-3 group cursor-pointer select-none">
             <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-all duration-500"></div>
                <Hexagon className="text-primary fill-primary/10 relative z-10 transition-transform group-hover:rotate-90 duration-700" size={32} strokeWidth={1.5} />
                <span className="absolute z-20 font-display font-bold text-white text-lg select-none">A</span>
             </div>
             <div className="flex flex-col">
                <span className="text-lg font-display font-bold text-white tracking-tight leading-none group-hover:text-primary transition-colors">
                  ADI ZELJKOVIĆ
                </span>
                <span className="text-[9px] text-zinc-500 font-medium tracking-[0.2em] uppercase">
                  Personal OS
                </span>
             </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 group
                    ${isActive 
                      ? 'text-white' 
                      : 'text-zinc-400 hover:text-white'}
                  `}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/30 -z-10 animate-in fade-in zoom-in-95 duration-200" />
                  )}
                  <item.icon size={14} className={isActive ? "text-white" : "group-hover:text-primary transition-colors"} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-zinc-300 hover:text-white group"
              >
                <Bell size={20} className={`group-hover:rotate-12 transition-transform ${unreadCount > 0 ? 'text-white' : ''}`} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary border border-background animate-pulse shadow-[0_0_8px_theme(colors.primary.DEFAULT)]"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 overflow-hidden z-50">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="font-bold text-white flex items-center gap-2">
                           Notifikacije 
                           {unreadCount > 0 && <span className="text-[10px] bg-primary px-1.5 py-0.5 rounded-full text-white">{unreadCount}</span>}
                        </h3>
                        <div className="flex gap-2">
                           <button onClick={markAllAsRead} className="text-[10px] hover:text-white text-zinc-400 transition-colors">Označi sve pročitano</button>
                           <button onClick={clearNotifications} className="text-[10px] hover:text-red-400 text-zinc-500 transition-colors">Obriši sve</button>
                        </div>
                    </div>
                    
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500 text-sm flex flex-col items-center gap-2">
                                <Bell size={24} className="opacity-20" />
                                Nema novih notifikacija.
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                   key={notif.id} 
                                   onClick={() => markAsRead(notif.id)}
                                   className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group flex gap-3 relative
                                      ${!notif.read ? 'bg-primary/5' : ''}
                                   `}
                                >
                                    <div className={`mt-1 p-2 rounded-lg h-fit ${!notif.read ? 'bg-white/10' : 'bg-transparent'}`}>
                                       {getNotifIcon(notif.type, notif.category)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-sm font-bold ${!notif.read ? 'text-white' : 'text-zinc-400'}`}>{notif.title}</h4>
                                            <span className="text-[10px] text-zinc-500">{formatDistanceToNow(notif.timestamp, { addSuffix: true, locale: hr } as any)}</span>
                                        </div>
                                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{notif.message}</p>
                                    </div>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-400 transition-all bg-[#0f1115] shadow-lg rounded-full"
                                    >
                                       <X size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
              )}
            </div>
            
            {/* Desktop Logout */}
            <button 
               onClick={logout} 
               className="hidden xl:flex w-9 h-9 items-center justify-center rounded-full hover:bg-white/10 text-zinc-300 hover:text-red-400 transition-colors"
               title="Odjavi se"
            >
                <LogOut size={20} />
            </button>

            {/* Mobile Toggle */}
            <button 
              className="xl:hidden p-2 text-zinc-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl pt-24 px-6 xl:hidden animate-in slide-in-from-top-10 flex flex-col gap-2 overflow-y-auto pb-6">
             {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    p-4 rounded-xl text-lg font-medium border border-transparent transition-all flex items-center gap-4
                    ${isActive 
                      ? 'bg-primary/20 border-primary/20 text-white shadow-lg shadow-primary/10' 
                      : 'bg-white/5 text-zinc-400 border-white/5'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={20} className={isActive ? 'text-primary' : ''} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
              
              <div className="h-px bg-white/5 my-2"></div>
              
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="p-4 rounded-xl text-lg font-medium border border-white/5 bg-white/5 text-zinc-400 flex items-center gap-4 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
              >
                  <LogOut size={20} />
                  Odjavi se
              </button>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 container mx-auto min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
        <Outlet />
      </main>
    </div>
  );
};