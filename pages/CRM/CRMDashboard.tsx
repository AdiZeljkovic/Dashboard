
import React from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, TrendingUp, ArrowUpRight, DollarSign, Clock, CheckSquare, MoreHorizontal, Phone, Mail, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';

export const CRMDashboard: React.FC = () => {
  const { clients, tasks, communications, deals } = useData();

  // --- CALCULATIONS ---
  const totalClients = clients.length;
  const activeDeals = deals.length;
  const pipelineValue = deals.reduce((acc, curr) => acc + curr.value, 0);
  
  // Calculate Conversion Rate (Won deals / Total deals)
  const wonDeals = deals.filter(d => d.stage === 'Won').length;
  const conversionRate = activeDeals > 0 ? (wonDeals / activeDeals) * 100 : 0;

  // Recent Activity Feed (from Communications)
  const recentActivities = communications
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Top Clients by Value
  const topClients = [...clients]
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  // CRM Specific Tasks
  const crmTasks = tasks
    .filter(t => t.source === 'CRM' && !t.completed)
    .slice(0, 4);

  // Chart Data Preparation
  const funnelData = [
    { name: 'Lead', value: clients.filter(c => c.status === 'Lead').length },
    { name: 'Negot.', value: clients.filter(c => c.status === 'Negotiation').length },
    { name: 'Prop.', value: clients.filter(c => c.status === 'Proposal').length },
    { name: 'Active', value: clients.filter(c => c.status === 'Active').length },
  ];

  // Mock Revenue Data vs Target
  const revenueData = [
    { name: 'Jan', actual: 4000, target: 3000 },
    { name: 'Feb', actual: 3000, target: 3200 },
    { name: 'Mar', actual: 2000, target: 3500 },
    { name: 'Apr', actual: 2780, target: 3800 },
    { name: 'Maj', actual: 4890, target: 4000 },
    { name: 'Jun', actual: 5390, target: 4200 },
  ];

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Active': return 'text-green-400 bg-green-500/10 border-green-500/20';
          case 'Lead': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
          case 'Negotiation': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
          default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
      }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6">
       
       {/* --- TOP KPI ROW --- */}
       <GlassCard className="md:col-span-3 p-6 flex items-center justify-between relative overflow-hidden group">
         <div className="relative z-10">
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1">Ukupno Klijenata</p>
            <h3 className="text-3xl font-display font-bold text-white">{totalClients}</h3>
            <span className="text-green-400 text-xs flex items-center gap-1 mt-2 font-medium bg-green-500/10 w-fit px-1.5 py-0.5 rounded"><TrendingUp size={12}/> +12%</span>
         </div>
         <div className="p-3 bg-primary/20 rounded-xl text-primary group-hover:scale-110 transition-transform duration-500">
            <Users size={24} />
         </div>
       </GlassCard>

       <GlassCard className="md:col-span-3 p-6 flex items-center justify-between relative overflow-hidden group">
         <div className="relative z-10">
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1">Pipeline Vrijednost</p>
            <h3 className="text-3xl font-display font-bold text-white">{pipelineValue.toLocaleString()} KM</h3>
            <span className="text-zinc-500 text-xs mt-2 block">Potencijalni prihodi</span>
         </div>
         <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 group-hover:scale-110 transition-transform duration-500">
            <DollarSign size={24} />
         </div>
       </GlassCard>

       <GlassCard className="md:col-span-3 p-6 flex items-center justify-between relative overflow-hidden group">
         <div className="relative z-10">
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1">Aktivni Poslovi</p>
            <h3 className="text-3xl font-display font-bold text-white">{activeDeals}</h3>
            <span className="text-blue-400 text-xs mt-2 block">Otvoreni pregovori</span>
         </div>
         <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 group-hover:scale-110 transition-transform duration-500">
            <Briefcase size={24} />
         </div>
       </GlassCard>

       <GlassCard className="md:col-span-3 p-6 flex items-center justify-between relative overflow-hidden group">
         <div className="relative z-10">
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1">Stopa Konverzije</p>
            <h3 className="text-3xl font-display font-bold text-white">{conversionRate.toFixed(1)}%</h3>
            <div className="w-24 h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-green-500" style={{width: `${conversionRate}%`}}></div>
            </div>
         </div>
         <div className="p-3 bg-green-500/20 rounded-xl text-green-400 group-hover:scale-110 transition-transform duration-500">
            <ArrowUpRight size={24} />
         </div>
       </GlassCard>


       {/* --- CHARTS ROW --- */}
       <div className="md:col-span-8 flex flex-col gap-6">
            {/* Revenue Trend */}
            <GlassCard className="p-6 h-[350px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display font-bold text-lg">Pregled Prihoda vs Cilj</h3>
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-2 text-zinc-400"><span className="w-2 h-2 rounded-full bg-primary"></span> Stvarno</div>
                        <div className="flex items-center gap-2 text-zinc-400"><span className="w-2 h-2 rounded-full bg-zinc-600"></span> Cilj</div>
                    </div>
                </div>
                <div className="flex-1 w-full -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #333', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                            <Area type="monotone" dataKey="target" stroke="#52525b" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sales Funnel */}
                <GlassCard className="p-6 h-[300px] flex flex-col">
                    <h3 className="font-display font-bold text-lg mb-4">Sales Funnel</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                <XAxis type="number" stroke="#666" hide />
                                <XAxis type="category" dataKey="name" stroke="#666" fontSize={12} width={50} />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #333' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                                    {funnelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'][index % 4]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* CRM Tasks */}
                <GlassCard className="p-6 h-[300px] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-display font-bold text-lg">Zadaci (Follow-up)</h3>
                        <span className="text-xs bg-white/5 px-2 py-1 rounded text-zinc-400">{crmTasks.length} pending</span>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {crmTasks.length === 0 ? <p className="text-zinc-500 text-sm">Nema CRM zadataka.</p> : crmTasks.map(task => (
                            <div key={task.id} className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                                <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center ${task.priority === 'high' ? 'border-red-500' : 'border-zinc-500'}`}>
                                    {task.priority === 'high' && <div className="w-2 h-2 bg-red-500 rounded-sm" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-zinc-300 group-hover:text-white line-clamp-1">{task.title}</p>
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Due: Today</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
       </div>


       {/* --- SIDEBAR COLUMN --- */}
       <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* Top Clients */}
            <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display font-bold text-lg">Top Klijenti</h3>
                    <MoreHorizontal size={16} className="text-zinc-500" />
                </div>
                <div className="space-y-4">
                    {topClients.map((client, i) => (
                        <div key={client.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center font-bold text-sm border border-white/10">
                                {client.name.charAt(0)}
                             </div>
                             <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-zinc-200 truncate">{client.name}</h4>
                                <p className="text-xs text-zinc-500 truncate">{client.company}</p>
                             </div>
                             <div className="text-right">
                                <span className="block font-mono font-bold text-white text-sm">{client.value > 1000 ? (client.value/1000).toFixed(1) + 'k' : client.value}</span>
                                <span className="text-[10px] text-zinc-500">KM</span>
                             </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 py-2 text-xs text-zinc-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    Vidi sve klijente
                </button>
            </GlassCard>

            {/* Recent Activity Feed */}
            <GlassCard className="p-6 flex-1 flex flex-col">
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-primary" /> Nedavne Aktivnosti
                </h3>
                <div className="relative pl-4 border-l border-white/10 space-y-6 flex-1">
                    {recentActivities.length === 0 ? <p className="text-zinc-500 text-sm">Nema nedavnih aktivnosti.</p> : recentActivities.map(comm => (
                        <div key={comm.id} className="relative group">
                            <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-black ${comm.type === 'Call' ? 'bg-green-500' : comm.type === 'Meeting' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                                    {comm.type === 'Call' && <Phone size={10}/>}
                                    {comm.type === 'Email' && <Mail size={10}/>}
                                    {comm.type === 'Meeting' && <Briefcase size={10}/>}
                                    {comm.type}
                                </span>
                                <span className="text-[10px] text-zinc-500">{comm.date}</span>
                            </div>
                            <p className="text-sm text-zinc-400 leading-snug group-hover:text-zinc-200 transition-colors">
                                {comm.summary}
                            </p>
                        </div>
                    ))}
                </div>
            </GlassCard>

       </div>

    </div>
  );
};
