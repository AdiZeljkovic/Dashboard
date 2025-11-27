
import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useData } from '../context/DataContext';
import { Plus, Trash2, Users, DollarSign, CheckSquare, Settings, LayoutGrid, Newspaper, Activity, RefreshCw, Cloud, Database, Lock, Save, Download } from 'lucide-react';
import { Client, Task, Transaction, Shortcut, HomelabService, NewsItem, VideoItem, Habit, NewsSource } from '../types';

export const AdminPage: React.FC = () => {
  const { 
    tasks, addTask, deleteTask, 
    clients, addClient, deleteClient,
    transactions, addTransaction, deleteTransaction,
    shortcuts, addShortcut, deleteShortcut,
    homelabServices, addHomelabService, deleteHomelabService,
    quickNote, updateQuickNote,
    addNewsSource, deleteNewsSource, newsSources, refreshNews,
    addHabit, deleteHabit, habits,
    supabaseConfig, updateSupabaseConfig, syncFromCloud
  } = useData();

  const [activeTab, setActiveTab] = useState<'tasks' | 'clients' | 'finance' | 'dashboard' | 'content' | 'habits' | 'cloud'>('tasks');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCloudLoading, setIsCloudLoading] = useState(false);

  // Form States
  const [newTask, setNewTask] = useState('');
  const [newClient, setNewClient] = useState<Partial<Client>>({ name: '', company: '', value: 0, status: 'Active' });
  const [newTrans, setNewTrans] = useState<Partial<Transaction>>({ description: '', amount: 0, type: 'Expense', category: 'Ostalo' });
  const [newShortcut, setNewShortcut] = useState<Partial<Shortcut>>({ name: '', url: '', iconName: 'Link', color: 'zinc' });
  const [newHomelab, setNewHomelab] = useState<Partial<HomelabService>>({ name: '', ip: '', url: 'http://', status: 'online' });
  const [newSource, setNewSource] = useState<Partial<NewsSource>>({ name: '', type: 'rss', url: '', category: 'tech' });
  const [newHabit, setNewHabit] = useState('');
  
  // Cloud Config State
  const [cloudUrl, setCloudUrl] = useState(supabaseConfig.url || '');
  const [cloudKey, setCloudKey] = useState(supabaseConfig.key || '');

  // Handlers
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask) return;
    addTask({ id: Date.now(), title: newTask, source: 'CRM', completed: false, priority: 'medium' });
    setNewTask('');
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;
    addClient({
      id: Date.now().toString(),
      name: newClient.name!,
      company: newClient.company || '',
      email: newClient.email || '',
      phone: newClient.phone || '',
      status: newClient.status as any,
      value: Number(newClient.value) || 0
    });
    setNewClient({ name: '', company: '', value: 0, status: 'Active', email: '', phone: '' });
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrans.description) return;
    addTransaction({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      description: newTrans.description!,
      amount: Number(newTrans.amount),
      type: newTrans.type as any,
      category: newTrans.category || 'Ostalo'
    });
    setNewTrans({ description: '', amount: 0, type: 'Expense', category: 'Ostalo' });
  };

  const handleAddShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShortcut.name) return;
    addShortcut({
        id: Date.now().toString(),
        name: newShortcut.name!,
        url: newShortcut.url!,
        iconName: newShortcut.iconName!,
        color: 'zinc'
    });
    setNewShortcut({ name: '', url: '', iconName: 'Link' });
  };

  const handleAddHomelab = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newHomelab.name) return;
      addHomelabService({
          id: Date.now().toString(),
          name: newHomelab.name!,
          ip: newHomelab.ip!,
          url: newHomelab.url!,
          status: newHomelab.status as any
      });
      setNewHomelab({ name: '', ip: '', url: 'http://', status: 'online' });
  };

  const handleAddSource = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newSource.name || !newSource.url) return;
      addNewsSource({
          id: Date.now().toString(),
          name: newSource.name!,
          type: newSource.type as any,
          url: newSource.url!,
          category: newSource.category as any
      });
      setNewSource({ name: '', type: 'rss', url: '', category: 'tech' });
  };

  const handleAddHabit = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newHabit) return;
      addHabit({
          id: Date.now().toString(),
          name: newHabit,
          streak: 0,
          history: [false, false, false, false, false, false, false]
      });
      setNewHabit('');
  };

  const handleSyncNews = async () => {
      setIsSyncing(true);
      await refreshNews();
      setIsSyncing(false);
  };

  const handleSaveCloudConfig = (e: React.FormEvent) => {
      e.preventDefault();
      updateSupabaseConfig({
          url: cloudUrl,
          key: cloudKey,
          connected: !!(cloudUrl && cloudKey)
      });
      alert("Pristupni podaci sačuvani!");
  };

  const handleManualCloudPull = async () => {
      setIsCloudLoading(true);
      await syncFromCloud();
      setIsCloudLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="p-3 bg-primary/20 rounded-xl text-primary">
          <Settings size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
          <p className="text-zinc-400">Upravljanje podacima aplikacije</p>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {[
            { id: 'tasks', label: 'Zadaci', icon: CheckSquare },
            { id: 'clients', label: 'Klijenti', icon: Users },
            { id: 'finance', label: 'Finansije', icon: DollarSign },
            { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
            { id: 'content', label: 'Sadržaj', icon: Newspaper },
            { id: 'habits', label: 'Navike', icon: Activity },
            { id: 'cloud', label: 'Cloud Baza', icon: Cloud },
        ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'}`}
            >
                <tab.icon size={18} /> {tab.label}
            </button>
        ))}
      </div>

      {/* --- TASKS --- */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4">Dodaj Novi Zadatak</h3>
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Naslov zadatka..." className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary"/>
              <button type="submit" className="bg-primary p-3 rounded-lg text-white hover:bg-primary/80"><Plus /></button>
            </form>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4">Svi Zadaci</h3>
            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {tasks.map(task => (
                <div key={task.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <span className={task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}>{task.title}</span>
                  <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* --- CLIENTS --- */}
      {activeTab === 'clients' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard className="p-6 lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Novi Klijent</h3>
            <form onSubmit={handleAddClient} className="space-y-4">
              <input type="text" placeholder="Ime i Prezime" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"/>
              <input type="text" placeholder="Kompanija" value={newClient.company} onChange={e => setNewClient({...newClient, company: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"/>
              <div className="grid grid-cols-2 gap-2">
                <input type="email" placeholder="Email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"/>
                <input type="text" placeholder="Telefon" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"/>
              </div>
              <select value={newClient.status} onChange={e => setNewClient({...newClient, status: e.target.value as any})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none">
                <option value="Active">Active</option>
                <option value="Lead">Lead</option>
                <option value="Negotiation">Negotiation</option>
              </select>
              <button type="submit" className="w-full bg-primary py-3 rounded-lg text-white font-bold hover:bg-primary/80">Dodaj Klijenta</button>
            </form>
          </GlassCard>
          <GlassCard className="p-6 lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">Baza Klijenata</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-zinc-400 text-xs uppercase"><tr><th className="p-3">Ime</th><th className="p-3">Kompanija</th><th className="p-3">Status</th><th className="p-3 text-right">Akcija</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {clients.map(client => (
                    <tr key={client.id} className="hover:bg-white/5">
                      <td className="p-3 font-medium">{client.name}</td>
                      <td className="p-3 text-zinc-400">{client.company}</td>
                      <td className="p-3"><span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">{client.status}</span></td>
                      <td className="p-3 text-right"><button onClick={() => deleteClient(client.id)} className="text-red-400 hover:text-white p-2 bg-red-500/10 rounded-lg hover:bg-red-500"><Trash2 size={14}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* --- FINANCE --- */}
      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard className="p-6 lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Nova Transakcija</h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <input type="text" placeholder="Opis (npr. Plata)" value={newTrans.description} onChange={e => setNewTrans({...newTrans, description: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"/>
              <div className="flex gap-2">
                <input type="number" placeholder="Iznos" value={newTrans.amount} onChange={e => setNewTrans({...newTrans, amount: Number(e.target.value)})} className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"/>
                <select value={newTrans.type} onChange={e => setNewTrans({...newTrans, type: e.target.value as any})} className="w-32 bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"><option value="Income">Prihod</option><option value="Expense">Rashod</option></select>
              </div>
              <input type="text" placeholder="Kategorija (npr. Hrana)" value={newTrans.category} onChange={e => setNewTrans({...newTrans, category: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none"/>
              <button type="submit" className="w-full bg-green-600 py-3 rounded-lg text-white font-bold hover:bg-green-500">Knjiži</button>
            </form>
          </GlassCard>
          <GlassCard className="p-6 lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">Dnevnik Transakcija</h3>
            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
               {transactions.map(t => (
                 <div key={t.id} className="flex justify-between items-center p-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div><p className="font-medium">{t.description}</p><p className="text-xs text-zinc-500">{t.date} • {t.category}</p></div>
                    <div className="flex items-center gap-4"><span className={`font-mono font-bold ${t.type === 'Income' ? 'text-green-400' : 'text-red-400'}`}>{t.type === 'Income' ? '+' : '-'}{t.amount} KM</span><button onClick={() => deleteTransaction(t.id)} className="text-zinc-600 hover:text-red-400"><Trash2 size={16}/></button></div>
                 </div>
               ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* --- DASHBOARD WIDGETS --- */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <GlassCard className="p-6">
                    <h3 className="text-xl font-bold mb-4">Shortcuts (Prečice)</h3>
                    <form onSubmit={handleAddShortcut} className="space-y-3 mb-6">
                        <input type="text" placeholder="Naziv (npr. YouTube)" value={newShortcut.name} onChange={e => setNewShortcut({...newShortcut, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"/>
                        <input type="text" placeholder="URL (https://...)" value={newShortcut.url} onChange={e => setNewShortcut({...newShortcut, url: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"/>
                        <select value={newShortcut.iconName} onChange={e => setNewShortcut({...newShortcut, iconName: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white">
                            <option value="Link">Default Link</option>
                            <option value="Youtube">YouTube</option>
                            <option value="Github">GitHub</option>
                            <option value="Cloud">Cloud</option>
                        </select>
                        <button type="submit" className="w-full bg-primary py-2 rounded-lg text-white">Dodaj Prečicu</button>
                    </form>
                    <div className="space-y-2">
                        {shortcuts.map(s => (
                            <div key={s.id} className="flex justify-between items-center p-2 border border-white/5 rounded">
                                <span>{s.name}</span>
                                <button onClick={() => deleteShortcut(s.id)} className="text-red-400"><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-xl font-bold mb-4">Quick Note Preview</h3>
                    <textarea 
                        className="w-full h-32 bg-black/20 border border-white/10 rounded-lg p-3 text-white" 
                        value={quickNote} 
                        onChange={(e) => updateQuickNote(e.target.value)}
                    />
                </GlassCard>
            </div>

            <GlassCard className="p-6">
                <h3 className="text-xl font-bold mb-4">Homelab Servisi</h3>
                <form onSubmit={handleAddHomelab} className="space-y-3 mb-6">
                    <input type="text" placeholder="Naziv (npr. Proxmox)" value={newHomelab.name} onChange={e => setNewHomelab({...newHomelab, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"/>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="IP Adresa" value={newHomelab.ip} onChange={e => setNewHomelab({...newHomelab, ip: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"/>
                        <input type="text" placeholder="URL (http://...)" value={newHomelab.url} onChange={e => setNewHomelab({...newHomelab, url: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"/>
                    </div>
                    <select value={newHomelab.status} onChange={e => setNewHomelab({...newHomelab, status: e.target.value as any})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white">
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                    </select>
                    <button type="submit" className="w-full bg-primary py-2 rounded-lg text-white">Dodaj Servis</button>
                </form>
                <div className="space-y-2">
                    {homelabServices.map(s => (
                        <div key={s.id} className="flex justify-between items-center p-2 border border-white/5 rounded">
                            <div>
                                <div className="font-bold">{s.name}</div>
                                <div className="text-xs text-zinc-500">{s.ip}</div>
                            </div>
                            <button onClick={() => deleteHomelabService(s.id)} className="text-red-400"><Trash2 size={14}/></button>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
      )}

      {/* --- CONTENT (NEWS & VIDEO SOURCES) --- */}
      {activeTab === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4">Izvori Sadržaja (RSS & YouTube)</h3>
                  <div className="mb-4 text-xs text-zinc-400 bg-white/5 p-3 rounded">
                      Unesite RSS link za portal (npr. klix.ba/rss) ili YouTube Channel ID.
                      <br/>Za YouTube ID: idite na kanal &rarr; About &rarr; Share &rarr; Copy Channel ID.
                  </div>
                  <form onSubmit={handleAddSource} className="space-y-3 mb-6">
                      <select value={newSource.category} onChange={e => setNewSource({...newSource, category: e.target.value as any})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white">
                          <option value="tech">Tech</option>
                          <option value="gaming">Gaming</option>
                          <option value="world">Svijet</option>
                      </select>
                      <select value={newSource.type} onChange={e => setNewSource({...newSource, type: e.target.value as any})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white">
                          <option value="rss">Portal (RSS)</option>
                          <option value="youtube">YouTube Kanal</option>
                      </select>
                      <input type="text" placeholder="Naziv (npr. Klix)" value={newSource.name} onChange={e => setNewSource({...newSource, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"/>
                      <input type="text" placeholder={newSource.type === 'youtube' ? "Channel ID" : "RSS URL"} value={newSource.url} onChange={e => setNewSource({...newSource, url: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white"/>
                      
                      <button type="submit" className="w-full bg-primary py-2 rounded-lg text-white">Dodaj Izvor</button>
                  </form>

                  <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-bold text-zinc-500 uppercase">Aktivni Izvori</span>
                     <button 
                        onClick={handleSyncNews} 
                        disabled={isSyncing}
                        className="text-xs flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white disabled:opacity-50"
                     >
                        <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? 'Sinhronizacija...' : 'Sync Now'}
                     </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                      {newsSources.map(s => (
                          <div key={s.id} className="flex justify-between items-center p-2 border border-white/5 rounded">
                              <div className="flex flex-col">
                                  <span className="font-bold text-sm">{s.name}</span>
                                  <span className="text-[10px] text-zinc-500 uppercase">{s.category} • {s.type}</span>
                              </div>
                              <button onClick={() => deleteNewsSource(s.id)} className="text-red-400"><Trash2 size={14}/></button>
                          </div>
                      ))}
                  </div>
              </GlassCard>

              {/* Keep Habtis on the other side or remove if redundant */}
              <GlassCard className="p-6">
                 <h3 className="text-xl font-bold mb-4">Uputstvo</h3>
                 <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-400">
                    <li>Dodajte izvore lijevo.</li>
                    <li>Kliknite "Sync Now" da odmah povučete vijesti.</li>
                    <li>RSS mora biti validan XML link.</li>
                    <li>Podaci se čuvaju u browseru.</li>
                 </ul>
              </GlassCard>
          </div>
      )}

      {/* --- HABITS --- */}
      {activeTab === 'habits' && (
          <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4">Upravljanje Navikama</h3>
              <div className="flex gap-4 mb-6">
                  <input type="text" placeholder="Nova navika (npr. Meditacija)" value={newHabit} onChange={e => setNewHabit(e.target.value)} className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white"/>
                  <button onClick={handleAddHabit} className="bg-primary px-6 rounded-lg text-white font-bold">Dodaj</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {habits.map(h => (
                      <div key={h.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center">
                          <div>
                              <div className="font-bold text-lg">{h.name}</div>
                              <div className="text-xs text-zinc-500">Streak: {h.streak}</div>
                          </div>
                          <button onClick={() => deleteHabit(h.id)} className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16}/></button>
                      </div>
                  ))}
              </div>
          </GlassCard>
      )}

      {/* --- CLOUD / SUPABASE --- */}
      {activeTab === 'cloud' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-green-500/20 text-green-500 rounded-lg"><Database size={24} /></div>
                   <div>
                       <h3 className="text-xl font-bold">Supabase Konfiguracija</h3>
                       <p className="text-sm text-zinc-400">Povežite svoj lokalni ili cloud Supabase.</p>
                   </div>
                </div>

                <form onSubmit={handleSaveCloudConfig} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-500 uppercase font-bold">Project URL</label>
                        <input 
                            type="text" 
                            placeholder="https://your-project.supabase.co" 
                            value={cloudUrl} 
                            onChange={e => setCloudUrl(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-500 uppercase font-bold">Anon Key</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                placeholder="eyJhbGciOiJIUzI1NiIsInR5..." 
                                value={cloudKey} 
                                onChange={e => setCloudKey(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono text-sm pr-10"
                            />
                            <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-primary py-3 rounded-lg text-white font-bold hover:bg-primary/90 flex items-center justify-center gap-2">
                            <Save size={18} /> Sačuvaj & Poveži
                        </button>
                        {supabaseConfig.connected && (
                            <div className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-500/10 px-3 py-3 rounded-lg border border-green-500/20">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Connected
                            </div>
                        )}
                    </div>
                </form>

                {supabaseConfig.connected && (
                    <div className="mt-8 border-t border-white/5 pt-6">
                        <h4 className="font-bold mb-4 text-sm uppercase text-zinc-500">Manual Sync</h4>
                        <button 
                            onClick={handleManualCloudPull}
                            disabled={isCloudLoading}
                            className="w-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                        >
                            <Download size={18} className={isCloudLoading ? "animate-bounce" : ""} /> 
                            {isCloudLoading ? "Preuzimanje..." : "Preuzmi podatke sa Clouda"}
                        </button>
                        <p className="text-xs text-zinc-500 mt-2 text-center">
                            * Podaci se automatski šalju na Cloud prilikom svake izmjene.
                        </p>
                    </div>
                )}
            </GlassCard>

            <GlassCard className="p-8 bg-[#1e1e1e]/50">
                <h3 className="text-xl font-bold mb-4">SQL Setup</h3>
                <p className="text-sm text-zinc-400 mb-4">
                    Da bi aplikacija radila, morate kreirati tabelu u Supabase-u. Kopirajte ovaj kod u SQL Editor:
                </p>

                <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-xs text-green-400 overflow-x-auto relative group">
<pre>{`-- 1. Create Table
create table life_os_data (
  key text primary key,
  value jsonb
);

-- 2. Enable RLS (Optional for local, good for cloud)
alter table life_os_data enable row level security;

-- 3. Allow Public Access (For simplicity)
create policy "Public Access" 
on life_os_data for all 
using (true) 
with check (true);`}</pre>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white">SQL</span>
                    </div>
                </div>

                <div className="mt-6 text-sm text-zinc-500 space-y-2">
                    <p><strong className="text-zinc-300">Kako radi?</strong> Aplikacija koristi Supabase kao Key-Value store (slično kao localStorage, ali u oblaku).</p>
                    <p><strong className="text-zinc-300">Sigurnost:</strong> Uneseni ključevi se čuvaju samo u vašem browseru.</p>
                </div>
            </GlassCard>
        </div>
      )}

    </div>
  );
};
