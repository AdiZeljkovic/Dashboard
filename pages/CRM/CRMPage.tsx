
import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { CRMDashboard } from './CRMDashboard';
import { CRMClients } from './CRMClients';
import { LayoutDashboard, Users, UserPlus, X, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Client } from '../../types';

export const CRMPage: React.FC = () => {
  const { addClient } = useData();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Client Form State
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Lead',
    value: 0
  });

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;

    addClient({
      id: Date.now().toString(),
      name: newClient.name,
      company: newClient.company || '',
      email: newClient.email || '',
      phone: newClient.phone || '',
      status: newClient.status as any || 'Lead',
      value: Number(newClient.value) || 0
    });

    setIsModalOpen(false);
    setNewClient({ name: '', company: '', email: '', phone: '', status: 'Lead', value: 0 });
    // Switch to clients tab to see the new addition
    setActiveTab('clients');
  };

  return (
    <div className="flex flex-col gap-6 relative">
      
      {/* Sub Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex bg-black/40 rounded-xl p-1 border border-white/10 backdrop-blur">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
              ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-lg' : 'text-zinc-400 hover:text-white'}
            `}
          >
            <LayoutDashboard size={16} /> Pregled
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
              ${activeTab === 'clients' ? 'bg-primary text-white shadow-lg' : 'text-zinc-400 hover:text-white'}
            `}
          >
            <Users size={16} /> Klijenti
          </button>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-white/10"
        >
          <UserPlus size={16} /> Novi Klijent
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[600px] animate-in fade-in duration-300">
         {activeTab === 'dashboard' ? <CRMDashboard /> : <CRMClients />}
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <GlassCard className="w-full max-w-lg p-8 animate-in zoom-in-95 duration-200 border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-display font-bold text-white">Novi Klijent</h2>
                    <p className="text-zinc-400 text-sm">Unesite osnovne podatke za CRM evidenciju.</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleSaveClient} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-zinc-500 uppercase">Ime i Prezime *</label>
                       <input 
                         required
                         type="text" 
                         placeholder="npr. Adnan H." 
                         value={newClient.name}
                         onChange={e => setNewClient({...newClient, name: e.target.value})}
                         className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary/50 focus:bg-white/5 transition-all"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-zinc-500 uppercase">Kompanija</label>
                       <input 
                         type="text" 
                         placeholder="npr. Firma d.o.o." 
                         value={newClient.company}
                         onChange={e => setNewClient({...newClient, company: e.target.value})}
                         className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary/50 focus:bg-white/5 transition-all"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
                       <input 
                         type="email" 
                         placeholder="email@kompanija.ba" 
                         value={newClient.email}
                         onChange={e => setNewClient({...newClient, email: e.target.value})}
                         className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary/50 focus:bg-white/5 transition-all"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-zinc-500 uppercase">Telefon</label>
                       <input 
                         type="text" 
                         placeholder="+387..." 
                         value={newClient.phone}
                         onChange={e => setNewClient({...newClient, phone: e.target.value})}
                         className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary/50 focus:bg-white/5 transition-all"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-zinc-500 uppercase">Est. Vrijednost (KM)</label>
                       <input 
                         type="number" 
                         placeholder="0.00" 
                         value={newClient.value}
                         onChange={e => setNewClient({...newClient, value: Number(e.target.value)})}
                         className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary/50 focus:bg-white/5 transition-all"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-zinc-500 uppercase">Status</label>
                       <select 
                         value={newClient.status}
                         onChange={e => setNewClient({...newClient, status: e.target.value as any})}
                         className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-primary/50 focus:bg-white/5 transition-all appearance-none"
                       >
                         <option value="Lead">Lead</option>
                         <option value="Negotiation">Negotiation</option>
                         <option value="Proposal">Proposal</option>
                         <option value="Active">Active</option>
                         <option value="Churned">Churned</option>
                       </select>
                    </div>
                 </div>

                 <div className="pt-4 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-medium"
                    >
                      Odustani
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={18} /> Sačuvaj Klijenta
                    </button>
                 </div>
              </form>
           </GlassCard>
        </div>
      )}
    </div>
  );
};
