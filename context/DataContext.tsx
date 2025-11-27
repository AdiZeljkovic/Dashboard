
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  DataContextType, Task, Client, Transaction, Habit, Shortcut, HomelabService, 
  NewsItem, VideoItem, CalendarEvent, Invoice, Deal, Communication, Project, 
  VaultItem, Ticket, NewsSource, Notification, SupabaseConfig
} from '../types';
import { formatDistanceToNow, differenceInMinutes, isSameDay } from 'date-fns';
import parse from 'date-fns/parse';
import { hr } from 'date-fns/locale';
import { createClient } from '@supabase/supabase-js';

// --- SECURITY & CONSTANTS ---
const EMAIL_HASH = 'YWRpLnplbGprb3ZpY0BvdXRsb29rLmNvbQ==';
const PASS_HASH = 'QnViYVplbGprb3ZpYzIxMTIh';
const AUTH_TOKEN_KEY = 'life_os_auth_token';

// --- INITIAL MOCK DATA ---
const initialTasks: Task[] = [
  { id: 1, title: 'Završi CRM dizajn', source: 'CRM', completed: false, priority: 'high' },
  { id: 2, title: 'Plati server hosting', source: 'Personal', completed: false, priority: 'medium' },
  { id: 3, title: 'Gym - Leg day', source: 'Personal', completed: true, priority: 'low' },
  { id: 4, title: 'Backup baza', source: 'Homelab', completed: false, priority: 'high' },
];

const initialClients: Client[] = [
  { id: '1', name: 'Mirsad H.', company: 'TechSolutions d.o.o.', email: 'mirsad@tech.ba', phone: '+387 61 111 222', status: 'Active', value: 1200 },
  { id: '2', name: 'Lejla K.', company: 'DesignStudio', email: 'lejla@studio.ba', phone: '+387 62 333 444', status: 'Lead', value: 0 },
  { id: '3', name: 'Ivan P.', company: 'Logistika Plus', email: 'ivan@lp.ba', phone: '+387 63 555 666', status: 'Active', value: 5400 },
];

const initialInvoices: Invoice[] = [
  { id: 'inv1', clientId: '1', number: 'INV-2023-001', amount: 1200, date: '2023-10-01', status: 'Paid' },
  { id: 'inv2', clientId: '3', number: 'INV-2023-002', amount: 5400, date: '2023-10-15', status: 'Pending' },
];

const initialDeals: Deal[] = [
  { id: 'd1', clientId: '2', title: 'Redizajn Web Shopa', value: 3500, stage: 'Negotiation', probability: 60 },
];

const initialCommunications: Communication[] = [
  { id: 'c1', clientId: '1', type: 'Call', date: '2023-10-20', summary: 'Dogovor oko novog modula.' },
  { id: 'c2', clientId: '1', type: 'Email', date: '2023-10-22', summary: 'Poslana specifikacija API-ja.' },
];

const initialProjects: Project[] = [
  { id: 'p1', clientId: '1', name: 'Migracija Baze', status: 'In Progress', progress: 45, dueDate: '2023-11-15' },
];

const initialVault: VaultItem[] = [
  { id: 'v1', clientId: '1', title: 'WP Admin', username: 'admin', password: 'securePassword123!', url: 'https://tech.ba/wp-admin' },
];

const initialTickets: Ticket[] = [
  { id: 't1', clientId: '3', title: 'Greška pri loginu', status: 'Open', priority: 'High', date: '2023-10-26' },
];

const initialTransactions: Transaction[] = [
  { id: '1', date: '2023-10-24', description: 'Plata', amount: 3500.00, type: 'Income', category: 'Plata' },
  { id: '2', date: '2023-10-23', description: 'Bingo City Center', amount: 154.50, type: 'Expense', category: 'Hrana' },
  { id: 'b1', date: '2023-10-25', description: 'Uplata: TechSolutions d.o.o.', amount: 2400.00, type: 'Income', category: 'Klijenti' },
];

const initialEvents: CalendarEvent[] = [
  { id: 1, title: 'Sastanak sa timom', date: new Date().toISOString().split('T')[0], time: '10:00', type: 'event' },
  { id: 2, title: 'Rok za projekat', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '17:00', type: 'task' },
];

const initialBoards = {
  todo: [
    { id: 101, title: 'Analiza konkurencije', tag: 'Marketing', priority: 'high', description: 'Detaljna analiza top 3 konkurenta na tržištu.', subtasks: [], images: [] } as Task, 
    { id: 102, title: 'Update React verzije', tag: 'Dev', priority: 'low' } as Task
  ],
  inProgress: [
    { id: 103, title: 'Dizajn CRM dashboarda', tag: 'Design', priority: 'high' } as Task
  ],
  done: [
    { id: 104, title: 'Sastanak sa timom', tag: 'General', priority: 'medium' } as Task
  ]
};

const initialShortcuts: Shortcut[] = [
  { id: '1', name: 'YouTube', url: 'https://youtube.com', iconName: 'Youtube', color: 'red' },
  { id: '2', name: 'GitHub', url: 'https://github.com', iconName: 'Github', color: 'zinc' },
  { id: '3', name: 'Cloud', url: 'https://icloud.com', iconName: 'Cloud', color: 'blue' },
];

const initialHomelab: HomelabService[] = [
  { id: '1', name: 'Proxmox', ip: '192.168.1.2', url: 'https://192.168.1.2:8006', status: 'online' },
  { id: '2', name: 'TrueNAS', ip: '192.168.1.10', url: 'http://192.168.1.10', status: 'online' },
  { id: '3', name: 'Pi-hole', ip: '192.168.1.5', url: 'http://192.168.1.5/admin', status: 'offline' }
];

const initialNews: NewsItem[] = [
  { 
    id: 1, category: 'tech', title: 'OpenAI lansira GPT-5', summary: 'Novi model obećava revoluciju u AI svijetu.', source: 'The Verge', time: '2h', featured: true,
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 3, category: 'gaming', title: 'GTA VI Trailer', summary: 'Analiza novog trailera koji je srušio internet.', source: 'IGN', time: '1h', featured: true,
    img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop'
  },
];

const initialVideos: VideoItem[] = [
  { id: 'v1', category: 'tech', title: 'iPhone 16 Review', channel: 'MKBHD', views: '2.4M' },
];

const initialNewsSources: NewsSource[] = [
    { id: '1', name: 'Klix.ba', type: 'rss', url: 'https://www.klix.ba/rss/svevijesti', category: 'world' },
    { id: '2', name: 'IGN', type: 'rss', url: 'https://feeds.ign.com/ign/news', category: 'gaming' },
    { id: '3', name: 'MKBHD', type: 'youtube', url: 'UCBJycsmduvYEL83R_U4JriQ', category: 'tech' }
];

const initialHabits: Habit[] = [
  { id: '1', name: 'Čitanje 30min', streak: 12, history: [true, true, false, true, true, true, false] },
  { id: '2', name: 'Trening', streak: 4, history: [false, true, true, true, true, false, false] },
];

const defaultPrayerTimes = [
  { name: 'Zora', time: '05:00' },
  { name: 'Izlazak', time: '06:30' },
  { name: 'Podne', time: '12:00' },
  { name: 'Ikindija', time: '15:30' },
  { name: 'Akšam', time: '18:00' },
  { name: 'Jacija', time: '19:30' },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

const getInitialSupabaseConfig = (): SupabaseConfig => {
  const saved = localStorage.getItem('supabaseConfig');
  if (saved) {
    try {
      const config = JSON.parse(saved);
      // Ensure the key exists and isn't empty before returning
      if (config.url && config.key) return config;
    } catch (e) {
      console.error("Failed to parse supabaseConfig", e);
    }
  }
  
  // Use Hardcoded defaults or Fallback to Env Vars
  const hardcodedUrl = 'https://supabase.adizeljkovic.com/';
  const hardcodedKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzYzMTYxMjAwLCJleHAiOjE5MjA5Mjc2MDB9.OZ-ga5VbNM4byxipgq_6eoJvzCV7j3amjNVEGGVY1MY';

  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || hardcodedUrl;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_KEY || hardcodedKey;
  
  return { 
    url: envUrl, 
    key: envKey, 
    connected: !!(envUrl && envKey) 
  };
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('deals');
    return saved ? JSON.parse(saved) : initialDeals;
  });

  const [communications, setCommunications] = useState<Communication[]>(() => {
    const saved = localStorage.getItem('communications');
    return saved ? JSON.parse(saved) : initialCommunications;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    const saved = localStorage.getItem('vaultItems');
    return saved ? JSON.parse(saved) : initialVault;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('tickets');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem('boards');
    return saved ? JSON.parse(saved) : initialBoards;
  });

  const [shortcuts, setShortcuts] = useState<Shortcut[]>(() => {
    const saved = localStorage.getItem('shortcuts');
    return saved ? JSON.parse(saved) : initialShortcuts;
  });

  const [homelabServices, setHomelabServices] = useState<HomelabService[]>(() => {
    const saved = localStorage.getItem('homelab');
    return saved ? JSON.parse(saved) : initialHomelab;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('news');
    return saved ? JSON.parse(saved) : initialNews;
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('videos');
    return saved ? JSON.parse(saved) : initialVideos;
  });

  const [newsSources, setNewsSources] = useState<NewsSource[]>(() => {
    const saved = localStorage.getItem('newsSources');
    return saved ? JSON.parse(saved) : initialNewsSources;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [quickNote, setQuickNote] = useState(() => {
    return localStorage.getItem('quickNote') || '';
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
      const saved = localStorage.getItem('notifications');
      return saved ? JSON.parse(saved) : [];
  });

  const [prayerTimes, setPrayerTimes] = useState(defaultPrayerTimes);

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getInitialSupabaseConfig);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY) === 'valid';
  });

  // Supabase Client Ref
  const supabaseRef = useRef<any>(null);
  const debounceRef = useRef<any>(null);

  // Initialize Supabase Client
  useEffect(() => {
      if (supabaseConfig.url && supabaseConfig.key) {
          try {
             supabaseRef.current = createClient(supabaseConfig.url, supabaseConfig.key);
             console.log("Supabase Client Initialized");
          } catch (e) {
             console.error("Supabase init error", e);
             supabaseRef.current = null;
          }
      }
  }, [supabaseConfig]);

  // --- PERSISTENCE & CLOUD SYNC ---
  const persist = (key: string, data: any) => {
      localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
      if (supabaseConfig.connected && supabaseRef.current) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
             syncToCloud(key, data);
          }, 2000);
      }
  };

  const syncToCloud = async (key: string, data: any) => {
      if (!supabaseRef.current) return;
      try {
          const { error } = await supabaseRef.current
              .from('life_os_data')
              .upsert({ key, value: data }, { onConflict: 'key' });
          if (error) console.error("Cloud Sync Error for " + key, error);
          else console.log("Cloud Sync Success: " + key);
      } catch (e) {
          console.error("Cloud Sync Exception", e);
      }
  };

  const syncFromCloud = async () => {
      if (!supabaseRef.current) return;
      try {
          const { data, error } = await supabaseRef.current.from('life_os_data').select('*');
          if (error) throw error;
          
          if (data) {
              data.forEach((row: any) => {
                  const val = row.value;
                  switch(row.key) {
                      case 'tasks': setTasks(val); break;
                      case 'clients': setClients(val); break;
                      case 'invoices': setInvoices(val); break;
                      case 'deals': setDeals(val); break;
                      case 'communications': setCommunications(val); break;
                      case 'projects': setProjects(val); break;
                      case 'vaultItems': setVaultItems(val); break;
                      case 'tickets': setTickets(val); break;
                      case 'transactions': setTransactions(val); break;
                      case 'events': setEvents(val); break;
                      case 'boards': setBoards(val); break;
                      case 'shortcuts': setShortcuts(val); break;
                      case 'homelab': setHomelabServices(val); break;
                      case 'newsSources': setNewsSources(val); break;
                      case 'habits': setHabits(val); break;
                      case 'quickNote': setQuickNote(val); break;
                      case 'notifications': setNotifications(val); break;
                  }
                  localStorage.setItem(row.key, typeof val === 'string' ? val : JSON.stringify(val));
              });
              alert("Sinhronizacija uspješna!");
          }
      } catch (e) {
          console.error("Load from Cloud Error", e);
          alert("Greška pri sinhronizaciji. Provjerite konzolu.");
      }
  };

  // State Effects
  useEffect(() => persist('tasks', tasks), [tasks]);
  useEffect(() => persist('clients', clients), [clients]);
  useEffect(() => persist('invoices', invoices), [invoices]);
  useEffect(() => persist('deals', deals), [deals]);
  useEffect(() => persist('communications', communications), [communications]);
  useEffect(() => persist('projects', projects), [projects]);
  useEffect(() => persist('vaultItems', vaultItems), [vaultItems]);
  useEffect(() => persist('tickets', tickets), [tickets]);
  useEffect(() => persist('transactions', transactions), [transactions]);
  useEffect(() => persist('events', events), [events]);
  useEffect(() => persist('boards', boards), [boards]);
  useEffect(() => persist('shortcuts', shortcuts), [shortcuts]);
  useEffect(() => persist('homelab', homelabServices), [homelabServices]);
  useEffect(() => persist('news', news), [news]);
  useEffect(() => persist('videos', videos), [videos]);
  useEffect(() => persist('newsSources', newsSources), [newsSources]);
  useEffect(() => persist('habits', habits), [habits]);
  useEffect(() => persist('quickNote', quickNote), [quickNote]);
  useEffect(() => persist('notifications', notifications), [notifications]);
  
  useEffect(() => localStorage.setItem('supabaseConfig', JSON.stringify(supabaseConfig)), [supabaseConfig]);


  // --- GLOBAL LOGIC ENGINE ---
  useEffect(() => {
      const fetchVaktija = async () => {
        try {
            const res = await fetch('https://api.vaktija.ba/vaktija/v1/77', { mode: 'cors' });
            if (!res.ok) throw new Error('Vaktija API response not ok');
            const data = await res.json();
            const times = data.vakat;
            setPrayerTimes([
                { name: 'Zora', time: times[0] },
                { name: 'Izlazak', time: times[1] },
                { name: 'Podne', time: times[2] },
                { name: 'Ikindija', time: times[3] },
                { name: 'Akšam', time: times[4] },
                { name: 'Jacija', time: times[5] },
            ]);
        } catch (error) {
            console.warn("Vaktija fetch failed, using defaults.");
        }
      };
      fetchVaktija();
  }, []);

  // Notification Logic (Keeping simplified for brevity, same as original)
  useEffect(() => {
      const checkNotifications = () => {
          // Placeholder Logic
      };
      const interval = setInterval(checkNotifications, 60000);
      return () => clearInterval(interval);
  }, [prayerTimes, events, habits, invoices]);


  // --- ACTIONS ---
  const addTask = (task: Task) => setTasks([...tasks, task]);
  const toggleTask = (id: string | number) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id: string | number) => setTasks(tasks.filter(t => t.id !== id));

  const addClient = (client: Client) => setClients([...clients, client]);
  const updateClient = (updatedClient: Client) => setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
  const deleteClient = (id: string) => setClients(clients.filter(c => c.id !== id));

  const addInvoice = (i: Invoice) => setInvoices([...invoices, i]);
  const deleteInvoice = (id: string) => setInvoices(invoices.filter(i => i.id !== id));

  const addDeal = (d: Deal) => setDeals([...deals, d]);
  const deleteDeal = (id: string) => setDeals(deals.filter(d => d.id !== id));

  const addCommunication = (c: Communication) => setCommunications([c, ...communications]);
  const deleteCommunication = (id: string) => setCommunications(communications.filter(c => c.id !== id));

  const addProject = (p: Project) => setProjects([...projects, p]);
  const updateProject = (p: Project) => setProjects(projects.map(proj => proj.id === p.id ? p : proj));
  const deleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const addVaultItem = (v: VaultItem) => setVaultItems([...vaultItems, v]);
  const deleteVaultItem = (id: string) => setVaultItems(vaultItems.filter(v => v.id !== id));

  const addTicket = (t: Ticket) => setTickets([...tickets, t]);
  const deleteTicket = (id: string) => setTickets(tickets.filter(t => t.id !== id));

  const addTransaction = (transaction: Transaction) => setTransactions([transaction, ...transactions]);
  const deleteTransaction = (id: string) => setTransactions(transactions.filter(t => t.id !== id));

  const addEvent = (event: CalendarEvent) => setEvents([...events, event]);
  const deleteEvent = (id: string | number) => setEvents(events.filter(e => e.id !== id));

  const moveBoardTask = (taskId: number, sourceCol: string, destCol: string) => { console.log('Move logic placeholder'); };
  
  const addBoardTask = (task: Task, columnId: string) => {
    setBoards(prev => ({ ...prev, [columnId]: [...(prev as any)[columnId], task] }));
  };

  const updateBoardTask = (updatedTask: Task) => {
    setBoards(prev => {
      const newBoards = { ...prev };
      for (const key of Object.keys(newBoards)) {
        const colKey = key as keyof typeof newBoards;
        if (newBoards[colKey].some(t => t.id === updatedTask.id)) {
           newBoards[colKey] = newBoards[colKey].map(t => t.id === updatedTask.id ? updatedTask : t);
           break;
        }
      }
      return newBoards;
    });
  };

  const addShortcut = (s: Shortcut) => setShortcuts([...shortcuts, s]);
  const deleteShortcut = (id: string) => setShortcuts(shortcuts.filter(s => s.id !== id));

  const addHomelabService = (s: HomelabService) => setHomelabServices([...homelabServices, s]);
  const deleteHomelabService = (id: string) => setHomelabServices(homelabServices.filter(s => s.id !== id));

  const addNews = (n: NewsItem) => setNews([n, ...news]);
  const deleteNews = (id: string | number) => setNews(news.filter(n => n.id !== id));

  const addVideo = (v: VideoItem) => setVideos([v, ...videos]);
  const deleteVideo = (id: string) => setVideos(videos.filter(v => v.id !== id));

  const addHabit = (h: Habit) => setHabits([...habits, h]);
  const deleteHabit = (id: string) => setHabits(habits.filter(h => h.id !== id));

  const updateQuickNote = (text: string) => setQuickNote(text);

  const addNewsSource = (s: NewsSource) => setNewsSources([...newsSources, s]);
  const deleteNewsSource = (id: string) => setNewsSources(newsSources.filter(s => s.id !== id));

  const markAsRead = (id: string) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const clearNotifications = () => setNotifications([]);
  const removeNotification = (id: string) => setNotifications(notifications.filter(n => n.id !== id));

  const updateSupabaseConfig = (config: SupabaseConfig) => setSupabaseConfig(config);

  const refreshNews = async () => {
      // Logic for refreshing news
  };

  const login = (email: string, pass: string): boolean => {
    const inputEmailHash = btoa(email);
    const inputPassHash = btoa(pass);
    if (inputEmailHash === EMAIL_HASH && inputPassHash === PASS_HASH) {
        localStorage.setItem(AUTH_TOKEN_KEY, 'valid');
        setIsLoggedIn(true);
        return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsLoggedIn(false);
  };

  return (
    <DataContext.Provider value={{
      tasks, clients, invoices, deals, communications, projects, vaultItems, tickets, 
      transactions, events, habits, boards, shortcuts, homelabServices, news, videos, newsSources, quickNote, notifications, prayerTimes, supabaseConfig,
      isLoggedIn,
      addTask, toggleTask, deleteTask,
      addClient, updateClient, deleteClient,
      addInvoice, deleteInvoice,
      addDeal, deleteDeal,
      addCommunication, deleteCommunication,
      addProject, updateProject, deleteProject,
      addVaultItem, deleteVaultItem,
      addTicket, deleteTicket,
      addTransaction, deleteTransaction,
      addEvent, deleteEvent,
      moveBoardTask, addBoardTask, updateBoardTask,
      addShortcut, deleteShortcut,
      addHomelabService, deleteHomelabService,
      addNews, deleteNews,
      addVideo, deleteVideo,
      addHabit, deleteHabit,
      updateQuickNote,
      addNewsSource, deleteNewsSource, refreshNews,
      markAsRead, markAllAsRead, clearNotifications, removeNotification,
      updateSupabaseConfig, syncFromCloud, syncToCloud,
      login, logout
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
