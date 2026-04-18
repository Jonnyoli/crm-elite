'use client';

import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Simple security - can be enhanced to an API call later
        if (password === 'Kikosimba1979') { // Re-used the pass we know from env for simplicity, or we can use admin central
            document.cookie = "crm_auth=true; path=/; max-age=31536000"; // 1 year cookie
            router.push('/');
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#FE6B00]/5 to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FE6B00]/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="w-full max-w-md z-10 relative animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-[#0a0d14]/80 backdrop-blur-3xl border border-white/5 p-10 rounded-[40px] luxury-shadow">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-[#161B22] rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative">
                            {error ? (
                                <Lock className="w-6 h-6 text-red-500 animate-pulse" />
                            ) : (
                                <ShieldCheck className="w-6 h-6 text-[#FE6B00]" />
                            )}
                            <div className="absolute -inset-1 bg-[#FE6B00] blur-xl opacity-20 -z-10" />
                        </div>
                        <h1 className="text-2xl font-black text-white font-outfit uppercase tracking-widest text-center">
                            Elite CRM <span className="text-[#FE6B00]">Access</span>
                        </h1>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2 font-bold">
                            Autorização Necessária
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Master Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="•••••••••"
                                className="w-full px-6 py-4 bg-black/40 border border-white/5 rounded-2xl text-white outline-none focus:border-[#FE6B00] focus:bg-white/5 transition-all text-center tracking-widest text-lg"
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-[10px] uppercase font-bold text-center mt-2 tracking-widest animate-in slide-in-from-top-1">Acesso Recusado</p>}
                        </div>

                        <button 
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 py-4 si-gradient rounded-2xl font-black text-xs text-white uppercase tracking-widest shadow-[0_0_30px_rgba(254,107,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Aceder ao Sistema <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
