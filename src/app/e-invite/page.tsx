"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: '',
    description: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Required';
        if (value.trim().length < 2) return 'Min 2 chars';
        return '';
      case 'phone': {
        const digits = value.replace(/[^0-9]/g, '');
        if (!value.trim()) return 'Required';
        if (digits.length < 10 || digits.length > 15) {
          return '10–15 digits';
        }
        return '';
      }
      case 'email': {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value.trim()) return 'Required';
        if (!emailRegex.test(value.trim())) return 'Invalid email';
        return '';
      }
      case 'department':
        if (!value.trim()) return 'Required';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Live validation if already touched
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: err }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields on submit
    const newErrors: { [key: string]: string } = {
      name: validateField('name', formData.name),
      phone: validateField('phone', formData.phone),
      email: validateField('email', formData.email),
      department: validateField('department', formData.department),
    };

    setTouched({ name: true, phone: true, email: true, department: true });
    setErrors(newErrors);

    // If any error exists, prevent submit
    if (Object.values(newErrors).some(err => err !== '')) {
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#f3efe6] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans antialiased overflow-hidden selection:bg-[#00bceb] selection:text-white">
      
      {/* Ambient Moving Mesh Gradient Glows (Nagarro Style Background Dynamics) */}
      <div className="fixed -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#00bceb]/25 via-[#00bceb]/10 to-transparent blur-[90px] pointer-events-none animate-ambient-mesh" />
      <div className="fixed -bottom-28 -right-28 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#0b257c]/20 via-[#0b257c]/10 to-transparent blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="fixed top-1/4 right-0 w-[340px] h-[340px] rounded-full bg-gradient-to-l from-[#fbc02d]/15 to-transparent blur-[80px] pointer-events-none animate-float-reverse" />
      
      {/* Background Soft Studio Texture */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-25 mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: `url('/clay-bg.jpg')` }}
      />

      {/* Main Wrapper with Decreased Width */}
      <div className="relative w-full max-w-[980px]">

        {/* --- 3D DECORATIVE ARTISTIC ELEMENTS (With Nagarro-style smooth floating animations) --- */}
        
        {/* Layered Organic Clay Shapes Behind the Left Card */}
        <div className="absolute -left-24 sm:-left-32 -top-10 w-64 sm:w-80 h-[460px] rounded-[150px] bg-[#9ba885] -rotate-12 opacity-90 shadow-2xl -z-20 pointer-events-none blur-[2px] animate-morph-clay" />
        <div className="absolute -left-28 sm:-left-36 top-52 w-56 sm:w-72 h-80 rounded-[120px] bg-[#d9988b] rotate-12 opacity-90 shadow-xl -z-20 pointer-events-none blur-[2px] animate-float-reverse" />
        <div className="absolute -left-16 sm:-left-24 -bottom-12 w-56 sm:w-72 h-72 rounded-full bg-[#cca062] opacity-75 -z-20 pointer-events-none blur-[2px] animate-pulse-slow" />

        {/* 1. Yellow 3D Sphere (Gentle floating motion) */}
        <div 
          className="absolute -left-16 sm:-left-20 top-40 sm:top-44 w-24 h-24 sm:w-28 sm:h-28 rounded-full sphere-3d-yellow -z-10 pointer-events-none blur-[4px] opacity-95 animate-float-slow"
          style={{ filter: 'blur(4px) drop-shadow(10px 18px 24px rgba(0, 0, 0, 0.2))' }}
        />

        {/* 2. Red 3D Sphere (Reverse organic floating motion) */}
        <div 
          className="absolute -left-14 sm:-left-20 -bottom-12 sm:-bottom-16 w-32 h-32 sm:w-44 sm:h-44 rounded-full sphere-3d-red -z-10 pointer-events-none blur-[5px] opacity-95 animate-float-reverse"
          style={{ filter: 'blur(5px) drop-shadow(14px 22px 30px rgba(0, 0, 0, 0.28))' }}
        />

        {/* 3. Small Peach 3D Sphere (Delicate breathing motion) */}
        <div 
          className="absolute left-1/2 sm:left-[55%] -bottom-7 sm:-bottom-9 w-14 h-14 sm:w-18 sm:h-18 rounded-full sphere-3d-peach -z-10 pointer-events-none blur-[3px] opacity-90 animate-float-peach"
          style={{ filter: 'blur(3px) drop-shadow(6px 10px 16px rgba(0, 0, 0, 0.18))' }}
        />

        {/* --- MAIN FLOATING APPLICATION CANVAS --- */}
        <div className="relative z-20 w-full bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_25px_80px_rgba(0,0,0,0.11)] border border-slate-100/90 p-6 sm:p-9 lg:p-10 flex flex-col justify-between backdrop-blur-xs">
          
          {/* Top Logo & Heading Header (Centered) */}
          <header className="flex flex-col items-center justify-center text-center pb-6 border-b border-slate-100">
            <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl shadow-xs mb-3">
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
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Event Pass Registration
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Trusted AI for a New Digital India • Delegate Details
            </p>
          </header>

          {/* Content Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6">
            
            {/* Left Column: Registration Form (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              <div>
                {/* Form or Success State */}
                {status === 'success' ? (
                  <div className="bg-gradient-to-b from-emerald-50/90 to-teal-50/40 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center my-2 shadow-sm animate-fadeIn">
                    <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-100">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2">
                      Submission Verified
                    </div>
                    <h2 className="text-xl font-extrabold text-emerald-950 mb-1.5">Registration Received!</h2>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6 max-w-sm mx-auto">
                      Thank you, <strong className="text-emerald-900">{formData.name}</strong>. Your details have been submitted. Once verified by our team, your official invitation pass will be sent to <strong className="text-emerald-900">{formData.email}</strong>.
                    </p>
                    <button 
                      onClick={() => {
                        setStatus('idle');
                        setFormData({ name: '', phone: '', email: '', department: '', description: '' });
                        setErrors({});
                        setTouched({});
                      }}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition transform hover:-translate-y-0.5"
                    >
                      <span>Register Another Person</span>
                      <span>→</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                    {status === 'error' && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-600 px-3.5 py-2.5 rounded-2xl text-xs flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <path strokeLinecap="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                        </svg>
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* 2 Fields Per Row Layout (2x2 Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      
                      {/* Field 1: Full Name */}
                      <div className={`border rounded-2xl p-3.5 transition flex flex-col justify-between ${
                        touched.name && errors.name 
                          ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/20' 
                          : 'bg-slate-50/80 hover:bg-slate-50 border-slate-200/80 focus-within:border-[#00bceb] focus-within:ring-2 focus-within:ring-[#00bceb]/20'
                      }`}>
                        <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase">
                          Full Name <span className={`transition-colors duration-200 font-bold ${formData.name.trim().length >= 2 ? 'text-emerald-500' : 'text-red-500'}`}>*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={() => handleBlur('name')}
                          placeholder="John Doe"
                          className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none mt-1 font-medium"
                        />
                        {touched.name && errors.name && (
                          <div className="text-[10px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-fadeIn">
                            <span>⚠️</span> <span>{errors.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Field 2: Phone Number */}
                      <div className={`border rounded-2xl p-3.5 transition flex flex-col justify-between ${
                        touched.phone && errors.phone 
                          ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/20' 
                          : 'bg-slate-50/80 hover:bg-slate-50 border-slate-200/80 focus-within:border-[#00bceb] focus-within:ring-2 focus-within:ring-[#00bceb]/20'
                      }`}>
                        <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase">
                          Phone Number <span className={`transition-colors duration-200 font-bold ${(formData.phone.replace(/[^0-9]/g, '').length >= 10 && formData.phone.replace(/[^0-9]/g, '').length <= 15) ? 'text-emerald-500' : 'text-red-500'}`}>*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={() => handleBlur('phone')}
                          placeholder="+91 98765 43210"
                          className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none mt-1 font-medium"
                        />
                        {touched.phone && errors.phone && (
                          <div className="text-[10px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-fadeIn">
                            <span>⚠️</span> <span>{errors.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Field 3: Email */}
                      <div className={`border rounded-2xl p-3.5 transition flex flex-col justify-between ${
                        touched.email && errors.email 
                          ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/20' 
                          : 'bg-slate-50/80 hover:bg-slate-50 border-slate-200/80 focus-within:border-[#00bceb] focus-within:ring-2 focus-within:ring-[#00bceb]/20'
                      }`}>
                        <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase">
                          Official Email <span className={`transition-colors duration-200 font-bold ${/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim()) ? 'text-emerald-500' : 'text-red-500'}`}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={() => handleBlur('email')}
                          placeholder="name@company.com"
                          className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none mt-1 font-medium"
                        />
                        {touched.email && errors.email && (
                          <div className="text-[10px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-fadeIn">
                            <span>⚠️</span> <span>{errors.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Field 4: Department */}
                      <div className={`border rounded-2xl p-3.5 transition flex flex-col justify-between ${
                        touched.department && errors.department 
                          ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/20' 
                          : 'bg-slate-50/80 hover:bg-slate-50 border-slate-200/80 focus-within:border-[#00bceb] focus-within:ring-2 focus-within:ring-[#00bceb]/20'
                      }`}>
                        <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase">
                          Department <span className={`transition-colors duration-200 font-bold ${formData.department.trim().length >= 1 ? 'text-emerald-500' : 'text-red-500'}`}>*</span>
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          onBlur={() => handleBlur('department')}
                          placeholder="IT, Cyber Security, SOC"
                          className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none mt-1 font-medium"
                        />
                        {touched.department && errors.department && (
                          <div className="text-[10px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-fadeIn">
                            <span>⚠️</span> <span>{errors.department}</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Field 5: Description Textarea */}
                    <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 focus-within:border-[#00bceb] focus-within:ring-2 focus-within:ring-[#00bceb]/20 rounded-2xl p-3.5 transition">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-slate-800 tracking-wide uppercase">
                          Description
                        </label>
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                          OPTIONAL
                        </span>
                      </div>
                      <textarea
                        name="description"
                        rows={2}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Add any specific notes, questions, or topics of interest..."
                        className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none mt-1 font-medium resize-none"
                      />
                    </div>

                    {/* Bottom Actions Row (Removed Question text, clean button alignment) */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ name: '', phone: '', email: '', department: '', description: '' });
                          setErrors({});
                          setTouched({});
                        }}
                        className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                      >
                        Reset
                      </button>

                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="inline-flex items-center justify-center gap-1.5 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#00bceb] via-[#049fd9] to-[#0b257c] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-50 transition transform hover:-translate-y-0.5"
                      >
                        {status === 'loading' ? 'Validating...' : 'Confirm Registration →'}
                      </button>
                    </div>

                  </form>
                )}
              </div>

            </div>

            {/* Right Column: Featured Event Card Poster (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="relative w-full h-full min-h-[320px] rounded-[26px] overflow-hidden bg-gradient-to-b from-[#0b257c] via-[#051a5c] to-[#00bceb] p-6 text-white flex flex-col justify-between shadow-lg">
                
                {/* Overlay Graphic */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay pointer-events-none"
                  style={{ backgroundImage: `url('/ai-poster.jpg')` }}
                />
                
                {/* Floating 3D ambient orbs inside the poster */}
                <div className="absolute top-6 right-5 w-14 h-14 rounded-full sphere-3d-yellow opacity-75 blur-[1px] pointer-events-none" />
                <div className="absolute bottom-12 left-3 w-10 h-10 rounded-full sphere-3d-red opacity-80 blur-[1px] pointer-events-none" />

                {/* Card Top Details */}
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase mb-3 border border-white/20">
                    <span>Executive Roundtable</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold tracking-tight leading-snug">
                    Trusted AI for a New Digital India
                  </h3>
                  <p className="text-[11px] text-cyan-100/90 mt-1.5 leading-relaxed">
                    Join industry leaders as we explore AI strategies, secure networking, Splunk SOC, and intelligent infrastructure.
                  </p>
                </div>

                {/* Card Footer Badge */}
                <div className="relative z-10 pt-3 flex items-center justify-between text-[10px] text-cyan-100/80 border-t border-white/10">
                  <span>Hosted by Team AIPL</span>
                  <span className="font-semibold text-white">Arsenal | Cisco</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
