import React, { useState } from 'react';
import { Hexagon, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

export const LoginPage: React.FC = () => {
  const { login } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Simulate network delay for effect
    setTimeout(() => {
        const success = login(email, password);
        if (!success) {
            setError(true);
            setLoading(false);
        }
        // If success, state changes in App.tsx will trigger redirect automatically
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden font-sans">
        
        {/* Animated Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-purple-600/10 rounded-full blur-[100px] animate-blob mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen pointer-events-none" />

        <div className="w-full max-w-md p-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-black/20 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative flex items-center justify-center w-16 h-16 mb-4">
                        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full"></div>
                        <Hexagon className="text-primary fill-primary/10 relative z-10" size={64} strokeWidth={1.5} />
                        <span className="absolute z-20 font-display font-bold text-white text-2xl select-none">A</span>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">Dobrodošli nazad</h1>
                    <p className="text-zinc-500 mt-2 text-sm">Prijavite se za pristup Life OS-u</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none focus:border-primary/50 transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Lozinka</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none focus:border-primary/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} />
                            Pogrešan email ili lozinka.
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group mt-4"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <>
                                Prijavi se <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                     <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Zaštićeni Sistem • Adi Zeljković</p>
                </div>
            </div>
        </div>
    </div>
  );
};