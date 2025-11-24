
import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, Wallet, Building2, User, 
  PieChart as PieIcon, TrendingUp, CreditCard, ShoppingBag, Home, 
  Zap, Car, Coffee, ShieldAlert, CalendarClock, MoreHorizontal 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid 
} from 'recharts';
import { useData } from '../context/DataContext';

export const FinancePage: React.FC = () => {
  const { transactions } = useData();
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal');
  const [timeRange, setTimeRange] = useState('Ovaj mjesec');

  // --- DATA PROCESSING ---

  // Filter Transactions based on tab
  const businessKeywords = ['Klijenti', 'Infrastruktura', 'Software', 'Freelance', 'Porez', 'Plata'];
  const currentTransactions = transactions.filter(t => {
     const isBusiness = businessKeywords.includes(t.category);
     return activeTab === 'business' ? isBusiness : !isBusiness;
  });

  // Totals
  const income = currentTransactions.filter(t => t.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = currentTransactions.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expense;

  // Savings Rate (Mock logic)
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  // Category Data for Pie Chart & Progress Bars
  const categoryMap = new Map<string, number>();
  currentTransactions.filter(t => t.type === 'Expense').forEach(t => {
     categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });
  
  // Colors for categories
  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  
  const categories = Array.from(categoryMap).map(([name, value], i) => ({
    name, 
    value, 
    color: COLORS[i % COLORS.length],
    // Mock budgets for Personal
    budget: activeTab === 'personal' ? (name === 'Hrana' ? 600 : name === 'Režije' ? 300 : name === 'Transport' ? 200 : 500) : 0
  })).sort((a, b) => b.value - a.value);

  // Chart Data (Mocked Trend)
  const data = [
    { name: '1', income: income * 0.2, expense: expense * 0.1 },
    { name: '5', income: income * 0.3, expense: expense * 0.4 },
    { name: '10', income: income * 0.5, expense: expense * 0.3 },
    { name: '15', income: income * 0.6, expense: expense * 0.6 },
    { name: '20', income: income * 0.8, expense: expense * 0.8 },
    { name: '25', income: income * 0.9, expense: expense * 0.9 },
    { name: '30', income: income, expense: expense },
  ];

  // Mock Recurring Bills (Only for Personal)
  const recurringBills = [
    { name: 'Kirija', amount: 650, date: '01. Nov', icon: Home, status: 'paid' },
    { name: 'Telemach', amount: 65, date: '10. Nov', icon: Zap, status: 'pending' },
    { name: 'Netflix', amount: 24, date: '15. Nov', icon: CalendarClock, status: 'pending' },
    { name: 'Gym', amount: 60, date: '20. Nov', icon: ShieldAlert, status: 'pending' },
  ];

  // Helper for Category Icons
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('hrana') || n.includes('market')) return ShoppingBag;
    if (n.includes('režije') || n.includes('računi')) return Home;
    if (n.includes('transport') || n.includes('gorivo')) return Car;
    if (n.includes('zabava') || n.includes('kafa')) return Coffee;
    if (n.includes('plata')) return Wallet;
    return CreditCard;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-display font-bold text-white">Finansije & Budžet</h1>
            <p className="text-zinc-400 text-sm">
              {activeTab === 'personal' ? 'Upravljanje kućnim budžetom i troškovima' : 'Pregled poslovnih prihoda i rashoda'}
            </p>
         </div>
         
         <div className="flex items-center gap-4">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-primary/50"
            >
              <option>Ovaj mjesec</option>
              <option>Prošli mjesec</option>
              <option>Ova godina</option>
            </select>

            <div className="flex bg-black/40 rounded-xl p-1 border border-white/10 backdrop-blur">
                <button 
                  onClick={() => setActiveTab('personal')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
                  ${activeTab === 'personal' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:text-white'}
                  `}
                >
                  <User size={16} /> Lično
                </button>
                <button 
                  onClick={() => setActiveTab('business')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
                  ${activeTab === 'business' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:text-white'}
                  `}
                >
                  <Building2 size={16} /> Firma
                </button>
            </div>
         </div>
      </div>

      {/* HERO STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Net Balance */}
         <GlassCard className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-24 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all duration-500"></div>
            <div className="relative z-10">
               <div className="flex items-center gap-2 text-zinc-400 mb-4 text-xs uppercase tracking-widest font-bold">
                 <Wallet size={16} /> Trenutno Stanje
               </div>
               <div className="flex items-baseline gap-1 mb-2">
                 <span className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
                   {balance.toLocaleString('bs-BA', { minimumFractionDigits: 2 })}
                 </span>
                 <span className="text-xl text-zinc-500">KM</span>
               </div>
               <div className="flex items-center gap-2 text-xs">
                 <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-medium flex items-center gap-1">
                   <TrendingUp size={12} /> +12.5%
                 </span>
                 <span className="text-zinc-500">u odnosu na prošli mj.</span>
               </div>
            </div>
         </GlassCard>

         {/* Income Card */}
         <GlassCard className="p-6 flex flex-col justify-center relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                  <ArrowUpRight size={24} />
               </div>
               <span className="text-xs text-zinc-500 uppercase">Prihodi</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-green-400 mb-1">
              +{income.toLocaleString('bs-BA', { minimumFractionDigits: 2 })} KM
            </h3>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
               <div className="h-full bg-green-500" style={{width: '75%'}}></div>
            </div>
         </GlassCard>

         {/* Expense Card */}
         <GlassCard className="p-6 flex flex-col justify-center relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                  <ArrowDownRight size={24} />
               </div>
               <span className="text-xs text-zinc-500 uppercase">Rashodi</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-red-400 mb-1">
              -{expense.toLocaleString('bs-BA', { minimumFractionDigits: 2 })} KM
            </h3>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
               <div className="h-full bg-red-500" style={{width: '45%'}}></div>
            </div>
         </GlassCard>
      </div>

      {/* MAIN VISUALIZATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* CASH FLOW CHART */}
         <GlassCard className="lg:col-span-2 p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                 <TrendingUp size={18} className="text-primary" />
                 Tok Novca (Cash Flow)
              </h3>
              <div className="flex gap-2">
                 <span className="flex items-center gap-1 text-xs text-zinc-400"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Prihodi</span>
                 <span className="flex items-center gap-1 text-xs text-zinc-400"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Rashodi</span>
              </div>
            </div>
            <div className="flex-1 w-full -ml-2">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                     <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                     <XAxis dataKey="name" stroke="#666" tickLine={false} axisLine={false} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                     />
                     <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                     <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </GlassCard>

         {/* BUDGET & SAVINGS (Personal) OR METRICS (Business) */}
         <GlassCard className="p-6 flex flex-col">
             <h3 className="text-lg font-bold font-display text-white mb-6">
                {activeTab === 'personal' ? 'Mjesečni Budžet' : 'Profitna Marža'}
             </h3>
             
             <div className="flex-1 flex flex-col items-center justify-center relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{value: expense}, {value: income - expense}]} // Simple spent vs left
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        startAngle={180}
                        endAngle={0}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#ef4444" />
                        <Cell fill="#333" />
                      </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 
                 <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-zinc-500 text-xs uppercase block">Potrošeno</span>
                    <span className="text-3xl font-bold text-white">{expense.toLocaleString()}</span>
                    <span className="text-zinc-500 text-sm block">od {income.toLocaleString()} KM</span>
                 </div>
             </div>

             <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-sm text-zinc-300">Savings Rate</span>
                   <span className="text-sm font-bold text-green-400">{savingsRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-green-600 to-green-400" style={{ width: `${savingsRate}%` }}></div>
                </div>
             </div>
         </GlassCard>
      </div>

      {/* DETAILED BREAKDOWN (Only for Personal usually, but useful for both) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto">
         
         {/* CATEGORY BREAKDOWN */}
         <GlassCard className="xl:col-span-2 p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold font-display flex items-center gap-2">
                  <PieIcon size={18} className="text-primary" /> Troškovnik po kategorijama
               </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Donut Chart */}
                <div className="h-[250px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                            data={categories}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                         >
                            {categories.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                         </Pie>
                         <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#333'}} />
                      </PieChart>
                   </ResponsiveContainer>
                </div>

                {/* List with Progress Bars */}
                <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                   {categories.map((cat, i) => {
                      const Icon = getCategoryIcon(cat.name);
                      const percent = (cat.value / expense) * 100;
                      const budgetPercent = cat.budget > 0 ? (cat.value / cat.budget) * 100 : 0;

                      return (
                        <div key={i} className="group">
                           <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-2">
                                 <div className="p-1.5 rounded bg-white/5 text-zinc-400 group-hover:text-white transition-colors">
                                    <Icon size={14} />
                                 </div>
                                 <span className="text-sm font-medium text-zinc-300">{cat.name}</span>
                              </div>
                              <div className="text-right">
                                 <span className="text-sm font-bold text-white block">{cat.value} KM</span>
                              </div>
                           </div>
                           
                           {/* Dual Progress Bar: Usage vs Total Expense AND Budget usage */}
                           <div className="relative pt-1">
                              <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
                                 <span>{percent.toFixed(1)}% ukupnog</span>
                                 {activeTab === 'personal' && cat.budget > 0 && <span>Budžet: {cat.budget} KM</span>}
                              </div>
                              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden relative">
                                 <div 
                                    className="h-full rounded-full" 
                                    style={{ width: `${activeTab === 'personal' && cat.budget > 0 ? budgetPercent : percent}%`, backgroundColor: cat.color }}
                                 ></div>
                              </div>
                           </div>
                        </div>
                      );
                   })}
                </div>
            </div>
         </GlassCard>

         {/* RECURRING BILLS (FIKSNI TROŠKOVI) */}
         {activeTab === 'personal' && (
             <GlassCard className="p-6">
                <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
                   <CalendarClock size={18} className="text-orange-400" /> Fiksni Troškovi
                </h3>
                <div className="space-y-3">
                   {recurringBills.map((bill, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
                         <div className={`p-2 rounded-lg ${bill.status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                            <bill.icon size={18} />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-sm font-bold text-zinc-200">{bill.name}</h4>
                            <span className="text-xs text-zinc-500">Dospijeva: {bill.date}</span>
                         </div>
                         <div className="text-right">
                            <span className="block font-mono font-bold text-white">{bill.amount} KM</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${bill.status === 'paid' ? 'border-green-500/30 text-green-400' : 'border-orange-500/30 text-orange-400'}`}>
                               {bill.status === 'paid' ? 'Plaćeno' : 'Čeka'}
                            </span>
                         </div>
                      </div>
                   ))}
                   
                   <button className="w-full py-2 mt-4 border border-dashed border-white/20 rounded-lg text-zinc-500 text-xs hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all">
                      + Dodaj fiksni trošak
                   </button>
                </div>
             </GlassCard>
         )}

         {/* IF BUSINESS, MAYBE SHOW RECENT INVOICES INSTEAD */}
         {activeTab === 'business' && (
            <GlassCard className="p-6">
               <h3 className="text-lg font-bold font-display mb-6">Zadnje Fakture</h3>
               <div className="flex items-center justify-center h-40 text-zinc-500 text-sm">
                  Poveži CRM za prikaz faktura.
               </div>
            </GlassCard>
         )}
      </div>

      {/* TRANSACTIONS LIST */}
      <GlassCard className="overflow-hidden">
         <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold font-display">Nedavne Transakcije</h3>
            <button className="text-xs bg-white/5 hover:bg-white/10 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">
               Vidi sve
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-black/20 text-zinc-500 text-xs uppercase tracking-wider">
                  <tr>
                     <th className="px-6 py-4 font-medium">Datum</th>
                     <th className="px-6 py-4 font-medium">Opis</th>
                     <th className="px-6 py-4 font-medium">Kategorija</th>
                     <th className="px-6 py-4 font-medium text-right">Iznos</th>
                     <th className="px-6 py-4 font-medium text-center">Akcija</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {currentTransactions.map(t => (
                     <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-sm text-zinc-400 font-mono">{t.date}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === 'Income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                 {t.type === 'Income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                              </div>
                              <span className="text-sm font-medium text-zinc-200">{t.description}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-zinc-400">
                              {t.category}
                           </span>
                        </td>
                        <td className={`px-6 py-4 text-sm font-bold text-right font-mono ${t.type === 'Income' ? 'text-green-400' : 'text-zinc-200'}`}>
                           {t.type === 'Income' ? '+' : '-'}{t.amount.toFixed(2)} KM
                        </td>
                        <td className="px-6 py-4 text-center">
                           <button className="text-zinc-600 hover:text-white transition-colors">
                              <MoreHorizontal size={16} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </GlassCard>
    </div>
  );
};
