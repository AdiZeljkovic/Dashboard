
import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { 
  Search, Phone, Mail, Building, ArrowLeft, MoreHorizontal, FileText, 
  Folder, Shield, Tag, Plus, CheckCircle, Clock, Trash2, Eye, EyeOff, MessageSquare 
} from 'lucide-react';
import { Client, Invoice, Deal, Project, VaultItem, Ticket, Communication } from '../../types';
import { useData } from '../../context/DataContext';

export const CRMClients: React.FC = () => {
  const { 
    clients, updateClient, 
    invoices, addInvoice, deleteInvoice,
    deals, addDeal, deleteDeal,
    communications, addCommunication, deleteCommunication,
    projects, addProject, deleteProject,
    vaultItems, addVaultItem, deleteVaultItem,
    tickets, addTicket, deleteTicket
  } = useData();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showModal, setShowModal] = useState<string | null>(null); // 'invoice', 'deal', etc.
  
  // Forms state
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({ number: '', amount: 0, status: 'Pending', date: new Date().toISOString().split('T')[0] });
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({ title: '', value: 0, stage: 'Lead', probability: 50 });
  const [newComm, setNewComm] = useState<Partial<Communication>>({ type: 'Call', summary: '', date: new Date().toISOString().split('T')[0] });
  const [newProject, setNewProject] = useState<Partial<Project>>({ name: '', status: 'Planning', progress: 0, dueDate: '' });
  const [newVault, setNewVault] = useState<Partial<VaultItem>>({ title: '', username: '', password: '', url: '' });
  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({ title: '', status: 'Open', priority: 'Medium', date: new Date().toISOString().split('T')[0] });

  // Handlers for adding items
  const handleAddInvoice = () => {
    if(selectedClient && newInvoice.number) {
        addInvoice({ ...newInvoice, id: Date.now().toString(), clientId: selectedClient.id } as Invoice);
        setShowModal(null);
        setNewInvoice({ number: '', amount: 0, status: 'Pending', date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleAddDeal = () => {
    if(selectedClient && newDeal.title) {
        addDeal({ ...newDeal, id: Date.now().toString(), clientId: selectedClient.id } as Deal);
        setShowModal(null);
        setNewDeal({ title: '', value: 0, stage: 'Lead', probability: 50 });
    }
  };

  const handleAddComm = () => {
    if(selectedClient && newComm.summary) {
        addCommunication({ ...newComm, id: Date.now().toString(), clientId: selectedClient.id } as Communication);
        setShowModal(null);
        setNewComm({ type: 'Call', summary: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleAddProject = () => {
    if(selectedClient && newProject.name) {
        addProject({ ...newProject, id: Date.now().toString(), clientId: selectedClient.id } as Project);
        setShowModal(null);
        setNewProject({ name: '', status: 'Planning', progress: 0, dueDate: '' });
    }
  };

  const handleAddVault = () => {
    if(selectedClient && newVault.title) {
        addVaultItem({ ...newVault, id: Date.now().toString(), clientId: selectedClient.id } as VaultItem);
        setShowModal(null);
        setNewVault({ title: '', username: '', password: '', url: '' });
    }
  };

  const handleAddTicket = () => {
    if(selectedClient && newTicket.title) {
        addTicket({ ...newTicket, id: Date.now().toString(), clientId: selectedClient.id } as Ticket);
        setShowModal(null);
        setNewTicket({ title: '', status: 'Open', priority: 'Medium', date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleUpdateNotes = (notes: string) => {
    if(selectedClient) {
        updateClient({ ...selectedClient, notes });
        setSelectedClient({ ...selectedClient, notes });
    }
  };

  if (selectedClient) {
    const clientInvoices = invoices.filter(i => i.clientId === selectedClient.id);
    const clientDeals = deals.filter(d => d.clientId === selectedClient.id);
    const clientComms = communications.filter(c => c.clientId === selectedClient.id);
    const clientProjects = projects.filter(p => p.clientId === selectedClient.id);
    const clientVault = vaultItems.filter(v => v.clientId === selectedClient.id);
    const clientTickets = tickets.filter(t => t.clientId === selectedClient.id);

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
         <button 
           onClick={() => setSelectedClient(null)} 
           className="mb-6 flex items-center text-zinc-400 hover:text-white transition-colors gap-2"
         >
           <ArrowLeft size={18} /> Nazad na listu
         </button>

         {/* Client Header */}
         <GlassCard className="p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[60px]" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-2xl font-bold border border-white/10 shadow-lg">
                    {selectedClient.name.charAt(0)}
                 </div>
                 <div>
                    <h1 className="text-3xl font-display font-bold">{selectedClient.name}</h1>
                    <div className="flex items-center gap-2 text-zinc-400 mt-1">
                       <Building size={14} /> {selectedClient.company}
                    </div>
                    <div className="flex gap-2 mt-3">
                       <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/20">{selectedClient.status}</span>
                    </div>
                 </div>
              </div>
              <div className="flex gap-3">
                 <a href={`tel:${selectedClient.phone}`} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5"><Phone size={18} /></a>
                 <a href={`mailto:${selectedClient.email}`} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5"><Mail size={18} /></a>
              </div>
            </div>
         </GlassCard>

         {/* Detailed View Tabs */}
         <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
                {[
                    { id: 'info', label: 'Info', icon: FileText },
                    { id: 'invoices', label: 'Fakture', icon: Tag },
                    { id: 'deals', label: 'Poslovi', icon: CheckCircle },
                    { id: 'comm', label: 'Komunikacija', icon: MessageSquare },
                    { id: 'projects', label: 'Projekti', icon: Folder },
                    { id: 'vault', label: 'Vault', icon: Shield },
                    { id: 'tickets', label: 'Tiketi', icon: CheckCircle },
                ].map((tab) => (
                   <button 
                     key={tab.id} 
                     onClick={() => setActiveTab(tab.id)}
                     className={`text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                   >
                      <tab.icon size={16} />
                      {tab.label}
                   </button>
                ))}
            </div>
            
            <div className="col-span-12 lg:col-span-9">
               <GlassCard className="p-6 min-h-[400px]">
                  
                  {/* INFO TAB */}
                  {activeTab === 'info' && (
                      <div>
                        <h3 className="font-display font-bold mb-6 text-xl">Osnovne Informacije</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-500 uppercase tracking-wide">Email</label>
                                <p className="text-zinc-200">{selectedClient.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-500 uppercase tracking-wide">Telefon</label>
                                <p className="text-zinc-200">{selectedClient.phone}</p>
                            </div>
                            <div className="col-span-2 space-y-2 mt-4">
                                <label className="text-xs text-zinc-500 uppercase tracking-wide">Privatne Bilješke</label>
                                <textarea 
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-zinc-300 min-h-[150px] outline-none focus:border-primary/50" 
                                    value={selectedClient.notes || ''}
                                    onChange={(e) => handleUpdateNotes(e.target.value)}
                                    placeholder="Unesite bilješke o klijentu..."
                                ></textarea>
                            </div>
                        </div>
                      </div>
                  )}

                  {/* INVOICES TAB */}
                  {activeTab === 'invoices' && (
                      <div>
                          <div className="flex justify-between items-center mb-6">
                             <h3 className="font-display font-bold text-xl">Fakture</h3>
                             <button onClick={() => setShowModal('invoice')} className="text-xs bg-primary px-3 py-1.5 rounded text-white font-bold flex items-center gap-2 hover:bg-primary/90"><Plus size={14}/> Nova Faktura</button>
                          </div>
                          <div className="space-y-3">
                              {clientInvoices.length === 0 ? <p className="text-zinc-500 text-sm">Nema faktura.</p> : clientInvoices.map(inv => (
                                  <div key={inv.id} className="flex justify-between items-center p-3 border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
                                      <div>
                                          <div className="font-mono font-bold text-zinc-200">{inv.number}</div>
                                          <div className="text-xs text-zinc-500">{inv.date}</div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                          <span className={`text-xs px-2 py-1 rounded border ${inv.status === 'Paid' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-orange-500/30 text-orange-400 bg-orange-500/10'}`}>{inv.status}</span>
                                          <span className="font-bold">{inv.amount} KM</span>
                                          <button onClick={() => deleteInvoice(inv.id)} className="text-zinc-600 hover:text-red-400"><Trash2 size={14}/></button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* DEALS TAB */}
                  {activeTab === 'deals' && (
                      <div>
                           <div className="flex justify-between items-center mb-6">
                             <h3 className="font-display font-bold text-xl">Poslovi (Deals)</h3>
                             <button onClick={() => setShowModal('deal')} className="text-xs bg-primary px-3 py-1.5 rounded text-white font-bold flex items-center gap-2 hover:bg-primary/90"><Plus size={14}/> Novi Posao</button>
                          </div>
                          <div className="space-y-3">
                              {clientDeals.length === 0 ? <p className="text-zinc-500 text-sm">Nema aktivnih poslova.</p> : clientDeals.map(deal => (
                                  <div key={deal.id} className="p-4 border border-white/5 rounded-lg hover:bg-white/5 transition-colors relative group">
                                      <div className="flex justify-between items-start mb-2">
                                          <h4 className="font-bold text-white">{deal.title}</h4>
                                          <span className="font-mono text-primary font-bold">{deal.value} KM</span>
                                      </div>
                                      <div className="flex items-center justify-between text-xs text-zinc-500">
                                          <span>Stage: {deal.stage}</span>
                                          <span>Vjerovatnoća: {deal.probability}%</span>
                                      </div>
                                      <div className="w-full bg-zinc-800 h-1 mt-3 rounded-full overflow-hidden">
                                          <div className="bg-primary h-full" style={{width: `${deal.probability}%`}}></div>
                                      </div>
                                      <button onClick={() => deleteDeal(deal.id)} className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
                  
                  {/* COMMUNICATION TAB */}
                  {activeTab === 'comm' && (
                      <div>
                           <div className="flex justify-between items-center mb-6">
                             <h3 className="font-display font-bold text-xl">Komunikacija</h3>
                             <button onClick={() => setShowModal('comm')} className="text-xs bg-primary px-3 py-1.5 rounded text-white font-bold flex items-center gap-2 hover:bg-primary/90"><Plus size={14}/> Zabilježi</button>
                          </div>
                          <div className="relative border-l border-white/10 ml-3 space-y-6 pl-6 pb-4">
                              {clientComms.length === 0 ? <p className="text-zinc-500 text-sm">Nema zapisa.</p> : clientComms.map(c => (
                                  <div key={c.id} className="relative">
                                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-600"></div>
                                      <div className="text-xs text-zinc-500 mb-1">{c.date} • {c.type}</div>
                                      <p className="text-sm text-zinc-300 bg-white/5 p-3 rounded-lg border border-white/5 relative group">
                                          {c.summary}
                                          <button onClick={() => deleteCommunication(c.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                                      </p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* PROJECTS TAB */}
                  {activeTab === 'projects' && (
                      <div>
                           <div className="flex justify-between items-center mb-6">
                             <h3 className="font-display font-bold text-xl">Projekti</h3>
                             <button onClick={() => setShowModal('project')} className="text-xs bg-primary px-3 py-1.5 rounded text-white font-bold flex items-center gap-2 hover:bg-primary/90"><Plus size={14}/> Novi Projekt</button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {clientProjects.length === 0 ? <p className="text-zinc-500 text-sm col-span-full">Nema projekata.</p> : clientProjects.map(p => (
                                  <div key={p.id} className="p-4 border border-white/5 rounded-lg bg-white/5 relative group">
                                      <div className="flex justify-between items-start mb-4">
                                          <div>
                                              <h4 className="font-bold text-white">{p.name}</h4>
                                              <span className="text-xs text-zinc-400">Rok: {p.dueDate}</span>
                                          </div>
                                          <span className="text-[10px] px-2 py-1 rounded bg-black/40 border border-white/10 uppercase tracking-wider">{p.status}</span>
                                      </div>
                                      <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                          <span>Progress</span>
                                          <span>{p.progress}%</span>
                                      </div>
                                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                          <div className="bg-green-500 h-full" style={{width: `${p.progress}%`}}></div>
                                      </div>
                                      <button onClick={() => deleteProject(p.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* VAULT TAB */}
                  {activeTab === 'vault' && (
                      <div>
                           <div className="flex justify-between items-center mb-6">
                             <h3 className="font-display font-bold text-xl flex items-center gap-2"><Shield size={20} className="text-primary"/> Vault</h3>
                             <button onClick={() => setShowModal('vault')} className="text-xs bg-primary px-3 py-1.5 rounded text-white font-bold flex items-center gap-2 hover:bg-primary/90"><Plus size={14}/> Dodaj Podatke</button>
                          </div>
                          <div className="space-y-3">
                              {clientVault.length === 0 ? <p className="text-zinc-500 text-sm">Nema sačuvanih lozinki.</p> : clientVault.map(v => (
                                  <div key={v.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-white/5 rounded-lg bg-white/5 group">
                                      <div className="mb-2 md:mb-0">
                                          <h4 className="font-bold text-zinc-200">{v.title}</h4>
                                          <a href={v.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">{v.url}</a>
                                      </div>
                                      <div className="flex items-center gap-4">
                                          <div className="flex flex-col items-end">
                                              <span className="text-xs text-zinc-500">Username: <span className="text-zinc-300">{v.username}</span></span>
                                              <div className="flex items-center gap-2 group/pass cursor-pointer">
                                                  <span className="text-xs text-zinc-500">Pass:</span> 
                                                  <span className="text-xs text-white blur-sm group-hover/pass:blur-none transition-all duration-300 bg-black/50 px-2 rounded font-mono">{v.password}</span>
                                              </div>
                                          </div>
                                          <button onClick={() => deleteVaultItem(v.id)} className="text-zinc-600 hover:text-red-400 p-2"><Trash2 size={16}/></button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
                  
                  {/* TICKETS TAB */}
                  {activeTab === 'tickets' && (
                      <div>
                           <div className="flex justify-between items-center mb-6">
                             <h3 className="font-display font-bold text-xl">Podrška (Tickets)</h3>
                             <button onClick={() => setShowModal('ticket')} className="text-xs bg-primary px-3 py-1.5 rounded text-white font-bold flex items-center gap-2 hover:bg-primary/90"><Plus size={14}/> Novi Tiket</button>
                          </div>
                          <div className="space-y-2">
                              {clientTickets.length === 0 ? <p className="text-zinc-500 text-sm">Nema tiketa.</p> : clientTickets.map(t => (
                                  <div key={t.id} className="flex justify-between items-center p-3 border border-white/5 rounded-lg bg-white/5">
                                      <div className="flex items-center gap-3">
                                          <div className={`w-2 h-2 rounded-full ${t.status === 'Open' ? 'bg-green-500' : 'bg-zinc-500'}`}></div>
                                          <span className="font-medium text-sm">{t.title}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                          <span className={`text-[10px] uppercase font-bold ${t.priority === 'High' ? 'text-red-400' : 'text-zinc-400'}`}>{t.priority}</span>
                                          <span className="text-xs text-zinc-500">{t.date}</span>
                                          <button onClick={() => deleteTicket(t.id)} className="text-zinc-600 hover:text-red-400"><Trash2 size={14}/></button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

               </GlassCard>
            </div>
         </div>
         
         {/* --- MODALS --- */}
         {showModal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                 <GlassCard className="w-full max-w-md p-6 animate-in zoom-in-95">
                     <h3 className="text-xl font-bold mb-4 capitalize">Dodaj: {showModal}</h3>
                     
                     {showModal === 'invoice' && (
                         <div className="space-y-4">
                             <input type="text" placeholder="Broj fakture" value={newInvoice.number} onChange={e => setNewInvoice({...newInvoice, number: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <input type="number" placeholder="Iznos" value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: Number(e.target.value)})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <input type="date" value={newInvoice.date} onChange={e => setNewInvoice({...newInvoice, date: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <button onClick={handleAddInvoice} className="w-full bg-primary py-2 rounded text-white font-bold">Sačuvaj</button>
                         </div>
                     )}

                     {showModal === 'deal' && (
                         <div className="space-y-4">
                             <input type="text" placeholder="Naziv posla" value={newDeal.title} onChange={e => setNewDeal({...newDeal, title: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <input type="number" placeholder="Vrijednost" value={newDeal.value} onChange={e => setNewDeal({...newDeal, value: Number(e.target.value)})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <select value={newDeal.stage} onChange={e => setNewDeal({...newDeal, stage: e.target.value as any})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white">
                                 <option>Lead</option><option>Negotiation</option><option>Proposal</option><option>Won</option>
                             </select>
                             <button onClick={handleAddDeal} className="w-full bg-primary py-2 rounded text-white font-bold">Sačuvaj</button>
                         </div>
                     )}

                     {showModal === 'comm' && (
                         <div className="space-y-4">
                             <select value={newComm.type} onChange={e => setNewComm({...newComm, type: e.target.value as any})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white">
                                 <option>Call</option><option>Email</option><option>Meeting</option>
                             </select>
                             <textarea placeholder="Sažetak razgovora..." value={newComm.summary} onChange={e => setNewComm({...newComm, summary: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white h-24"/>
                             <button onClick={handleAddComm} className="w-full bg-primary py-2 rounded text-white font-bold">Sačuvaj</button>
                         </div>
                     )}

                     {showModal === 'project' && (
                         <div className="space-y-4">
                             <input type="text" placeholder="Naziv projekta" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <input type="date" placeholder="Rok" value={newProject.dueDate} onChange={e => setNewProject({...newProject, dueDate: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <button onClick={handleAddProject} className="w-full bg-primary py-2 rounded text-white font-bold">Sačuvaj</button>
                         </div>
                     )}

                     {showModal === 'vault' && (
                         <div className="space-y-4">
                             <input type="text" placeholder="Naslov (npr. CPANEL)" value={newVault.title} onChange={e => setNewVault({...newVault, title: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <input type="text" placeholder="URL" value={newVault.url} onChange={e => setNewVault({...newVault, url: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <input type="text" placeholder="Username" value={newVault.username} onChange={e => setNewVault({...newVault, username: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <input type="text" placeholder="Password" value={newVault.password} onChange={e => setNewVault({...newVault, password: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <button onClick={handleAddVault} className="w-full bg-primary py-2 rounded text-white font-bold">Sačuvaj</button>
                         </div>
                     )}

                     {showModal === 'ticket' && (
                         <div className="space-y-4">
                             <input type="text" placeholder="Naslov problema" value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"/>
                             <select value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value as any})} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white">
                                 <option>Low</option><option>Medium</option><option>High</option>
                             </select>
                             <button onClick={handleAddTicket} className="w-full bg-primary py-2 rounded text-white font-bold">Sačuvaj</button>
                         </div>
                     )}

                     <button onClick={() => setShowModal(null)} className="w-full mt-2 py-2 text-zinc-400 hover:text-white">Odustani</button>
                 </GlassCard>
             </div>
         )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Pretraži klijente..." 
              className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-primary/50 text-white placeholder:text-zinc-600"
            />
         </div>
         <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-zinc-300 hover:text-white flex items-center gap-2">
            <Tag size={16} /> Filter
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.length === 0 ? (
           <p className="text-zinc-500 col-span-full text-center py-10">Nema klijenata u bazi. Dodajte ih preko Admin panela.</p>
        ) : (
          clients.map(client => (
            <GlassCard key={client.id} className="p-6 cursor-pointer group hover:bg-white/5 border-white/5" onClick={() => setSelectedClient(client)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 group-hover:bg-primary group-hover:text-white transition-colors">
                      {client.name.charAt(0)}
                  </div>
                  <button className="text-zinc-600 hover:text-white"><MoreHorizontal size={20} /></button>
                </div>
                <h3 className="text-lg font-bold font-display text-white">{client.name}</h3>
                <p className="text-zinc-500 text-sm mb-4">{client.company}</p>
                
                <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Mail size={14} /> {client.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Phone size={14} /> {client.phone}
                  </div>
                </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
