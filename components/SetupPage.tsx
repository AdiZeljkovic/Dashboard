import React, { useState } from 'react';
import { Database, Save, Server, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';

export const SetupPage: React.FC = () => {
  const { updateSupabaseConfig } = useData();
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && key) {
      updateSupabaseConfig({
        url,
        key,
        connected: true
      });
      // Force reload to ensure context re-initializes cleanly with new config
      window.location.reload(); 
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden font-sans p-6">
       {/* Background */}
       <div className="absolute top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-green-600/10 rounded-full blur-[100px] animate-blob mix-blend-screen pointer-events-none" />

       <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-black/20 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl">
             <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 text-primary shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                   <Server size={32} />
                </div>
                <h1 className="text-3xl font-display font-bold text-white text-center">System Setup</h1>
                <p className="text-zinc-500 mt-2 text-center text-sm">Configure your database connection to continue.</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                      <Database size={12} /> Supabase Project URL
                   </label>
                   <input 
                      type="text" 
                      required
                      placeholder="https://your-project.supabase.co"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-zinc-600 outline-none focus:border-primary/50 transition-all font-mono text-sm"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                      <ShieldCheck size={12} /> API Key (Anon/Public)
                   </label>
                   <input 
                      type="password" 
                      required
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-zinc-600 outline-none focus:border-primary/50 transition-all font-mono text-sm"
                   />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group mt-4"
                >
                   <Save size={18} /> Save Configuration
                </button>
             </form>
             
             <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5 text-xs text-zinc-400 text-center leading-relaxed">
                This application requires a Supabase backend to function. Your credentials are stored locally in your browser.
             </div>
          </div>
       </div>
    </div>
  );
};