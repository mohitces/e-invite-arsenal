"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid admin password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#f3efe6] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans antialiased overflow-hidden selection:bg-[#00bceb] selection:text-white">
      
      {/* Ambient Moving Mesh Gradient Glows */}
      <div className="fixed -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#00bceb]/25 via-[#00bceb]/10 to-transparent blur-[90px] pointer-events-none animate-ambient-mesh" />
      <div className="fixed -bottom-28 -right-28 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#0b257c]/20 via-[#0b257c]/10 to-transparent blur-[100px] pointer-events-none animate-pulse-slow" />
      
      {/* Background Soft Studio Texture */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-25 mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: `url('/clay-bg.jpg')` }}
      />

      {/* Main Container */}
      <div className="relative w-full max-w-md">

        {/* 3D Decorative Spheres & Shapes in Background */}
        <div className="absolute -left-16 -top-10 w-44 h-44 rounded-full bg-[#9ba885] opacity-85 shadow-xl -z-20 pointer-events-none blur-[2px] animate-morph-clay" />
        <div className="absolute -right-12 -bottom-10 w-40 h-40 rounded-full bg-[#d9988b] opacity-85 shadow-xl -z-20 pointer-events-none blur-[2px] animate-float-reverse" />
        
        {/* Floating 3D Spheres */}
        <div 
          className="absolute -left-10 top-20 w-20 h-20 rounded-full sphere-3d-yellow -z-10 pointer-events-none blur-[3px] opacity-90 animate-float-slow"
          style={{ filter: 'blur(3px) drop-shadow(8px 14px 20px rgba(0, 0, 0, 0.2))' }}
        />
        <div 
          className="absolute -right-8 bottom-12 w-24 h-24 rounded-full sphere-3d-red -z-10 pointer-events-none blur-[4px] opacity-90 animate-float-reverse"
          style={{ filter: 'blur(4px) drop-shadow(10px 18px 24px rgba(0, 0, 0, 0.25))' }}
        />

        {/* Floating Clay Card */}
        <div className="relative z-20 w-full bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_25px_80px_rgba(0,0,0,0.11)] border border-slate-100/90 p-8 sm:p-10 backdrop-blur-xs">
          
          {/* Centered Logo & Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl shadow-xs mb-4">
              <Image 
                src="/arsenal-logo.jpg" 
                alt="Arsenal" 
                width={92} 
                height={30} 
                style={{ width: 'auto', height: 'auto' }}
                className="object-contain" 
                priority
              />
              <div className="h-4 w-px bg-slate-300" />
              <Image 
                src="/cisco-logo.png" 
                alt="Cisco" 
                width={78} 
                height={30} 
                style={{ width: 'auto', height: 'auto' }}
                className="object-contain" 
                priority
              />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Event Admin Portal
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Trusted AI for a New Digital India • Host Management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Password Field */}
            <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 focus-within:border-[#00bceb] focus-within:ring-2 focus-within:ring-[#00bceb]/20 rounded-2xl p-3.5 transition">
              <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase">
                Admin Access Password <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none mt-1 font-medium"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00bceb] via-[#049fd9] to-[#0b257c] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-50 transition transform hover:-translate-y-0.5"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link href="/e-invite" className="text-xs font-semibold text-slate-400 hover:text-[#00bceb] transition">
              ← Back to Registration Form
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
