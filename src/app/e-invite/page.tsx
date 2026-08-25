"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

function RegistrationContent() {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: '',
    description: '',
  });

  // Auto-populate from URL query params (e.g. from email invite click)
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const nameParam = searchParams.get('name');
    const deptParam = searchParams.get('department');

    if (emailParam || nameParam || deptParam) {
      setFormData(prev => ({
        ...prev,
        email: emailParam ? decodeURIComponent(emailParam) : prev.email,
        name: nameParam ? decodeURIComponent(nameParam) : prev.name,
        department: deptParam ? decodeURIComponent(deptParam) : prev.department,
      }));
    }
  }, [searchParams]);

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
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit registration. Please try again.');
    }
  };

  return (
    <main className="relative min-h-screen bg-[#f3efe6] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans text-slate-800 antialiased overflow-hidden selection:bg-[#00bceb] selection:text-white">
      
      {/* Ambient Moving Mesh Gradient Glows */}
      <div className="fixed -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#00bceb]/25 via-[#00bceb]/10 to-transparent blur-[100px] pointer-events-none animate-ambient-mesh" />
      <div className="fixed -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#0b257c]/20 via-[#0b257c]/5 to-transparent blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="fixed top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-orange-400/10 to-pink-500/10 blur-[130px] pointer-events-none" />

      {/* Floating 3D Geometric Aesthetic Shapes */}
      <div className="fixed top-8 left-10 w-24 h-24 rounded-full sphere-3d-navy opacity-80 pointer-events-none animate-float hidden md:block" />
      <div className="fixed bottom-12 left-1/4 w-16 h-16 rounded-full sphere-3d-yellow opacity-75 pointer-events-none animate-float-delayed hidden md:block" />
      <div className="fixed top-1/4 right-8 w-28 h-28 rounded-full sphere-3d-cyan opacity-85 pointer-events-none animate-float hidden lg:block" />
      <div className="fixed bottom-8 right-16 w-20 h-20 rounded-full sphere-3d-red opacity-80 pointer-events-none animate-float-delayed hidden md:block" />

      {/* Background Soft Studio Clay Texture */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-30 mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: `url('/clay-bg.jpg')` }}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="clay-card bg-white/95 backdrop-blur-md border border-white/80 shadow-[0_25px_70px_rgba(0,0,0,0.08)] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 transition-all duration-300">
          
          {/* Top Section: Logo + Heading + Subtitle */}
          <div className="pb-8 mb-8 border-b border-slate-200/80 space-y-4">
            
            {/* Logo Capsule */}
            <div className="flex items-center justify-center sm:justify-start">
              <div className="flex items-center gap-4 bg-white/80 px-5 py-2.5 rounded-full border border-slate-100 shadow-xs backdrop-blur-xs">
                <Image 
                  src="/arsenal-logo.jpg" 
                  alt="Arsenal Logo" 
                  width={120} 
                  height={38} 
                  priority
                  style={{ width: 'auto', height: 'auto' }}
                  className="object-contain" 
                />
                <div className="h-6 w-px bg-slate-300" />
                <Image 
                  src="/cisco-logo.png" 
                  alt="Cisco Logo" 
                  width={90} 
                  height={38} 
                  priority
                  style={{ width: 'auto', height: 'auto' }}
                  className="object-contain" 
                />
              </div>
            </div>

            {/* Heading and Content */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Trusted AI for a New Digital India
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed font-normal">
                Reserve your executive seat for the exclusive Cisco & Arsenal leadership summit on next-generation artificial intelligence, enterprise resilience, and modern SOC architectures.
              </p>
            </div>

          </div>

          {/* Aligned 2-Column Grid (Form on Left | Poster Image on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            
            {/* Left Column: Registration Form (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              {status === 'success' ? (
                <div className="h-full flex flex-col justify-center bg-emerald-50 border border-emerald-200/80 rounded-3xl p-8 text-center space-y-3 animate-fadeIn shadow-xs">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/25">
                    ✓
                  </div>
                  <h3 className="text-xl font-extrabold text-emerald-950">
                    Registration Submitted
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your executive pass request has been received. Our team will verify your invitation and dispatch your confirmed VIP pass to <strong>{formData.email}</strong> shortly.
                  </p>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ name: '', phone: '', email: '', department: '', description: '' });
                        setStatus('idle');
                      }}
                      className="px-6 py-2 rounded-full bg-white text-emerald-700 font-bold text-xs border border-emerald-200 hover:bg-emerald-100/60 transition shadow-2xs"
                    >
                      Register Another Attendee
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Sanjay Singhal"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur('name')}
                      className={`clay-input w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#00bceb] focus:ring-2 focus:ring-[#00bceb]/20 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-xs ${
                        touched.name && errors.name ? 'border-rose-400 focus:border-rose-500' : ''
                      }`}
                    />
                    {touched.name && errors.name && (
                      <p className="text-rose-500 text-[11px] font-semibold mt-1 ml-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Official Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Official Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="sanjay@enterprise.com"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        className={`clay-input w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#00bceb] focus:ring-2 focus:ring-[#00bceb]/20 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-xs ${
                          touched.email && errors.email ? 'border-rose-400 focus:border-rose-500' : ''
                        }`}
                      />
                      {touched.email && errors.email && (
                        <p className="text-rose-500 text-[11px] font-semibold mt-1 ml-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur('phone')}
                        className={`clay-input w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#00bceb] focus:ring-2 focus:ring-[#00bceb]/20 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-xs ${
                          touched.phone && errors.phone ? 'border-rose-400 focus:border-rose-500' : ''
                        }`}
                      />
                      {touched.phone && errors.phone && (
                        <p className="text-rose-500 text-[11px] font-semibold mt-1 ml-1">{errors.phone}</p>
                      )}
                    </div>

                  </div>

                  {/* Department / Designation */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Department / Executive Role <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      placeholder="e.g. Chief Information Security Officer (CISO)"
                      value={formData.department}
                      onChange={handleChange}
                      onBlur={() => handleBlur('department')}
                      className={`clay-input w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#00bceb] focus:ring-2 focus:ring-[#00bceb]/20 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-xs ${
                        touched.department && errors.department ? 'border-rose-400 focus:border-rose-500' : ''
                      }`}
                    />
                    {touched.department && errors.department && (
                      <p className="text-rose-500 text-[11px] font-semibold mt-1 ml-1">{errors.department}</p>
                    )}
                  </div>

                  {/* Description / Special Inquiries */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Special Inquiries or Discussion Topics <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      placeholder="Any specific questions on Cisco AI architecture or Splunk SOC integration..."
                      value={formData.description}
                      onChange={handleChange}
                      className="clay-input w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#00bceb] focus:ring-2 focus:ring-[#00bceb]/20 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-xs"
                    />
                  </div>

                  {/* Error Alert */}
                  {status === 'error' && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                      <span>⚠️</span>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="clay-btn-gradient w-full py-3.5 px-6 rounded-full text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-[#00bceb] via-[#049fd9] to-[#0b257c] hover:opacity-95 shadow-lg shadow-cyan-500/25"
                    >
                      {status === 'loading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Registration...</span>
                        </>
                      ) : (
                        <span>Confirm Executive Seat →</span>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>

            {/* Right Column: Visual Poster Showcase (5 cols) Aligned to Form */}
            <div className="lg:col-span-5 flex flex-col">
              
              {/* 3D Studio Poster Showcase */}
              <div className="relative h-full min-h-[380px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#03091e] via-[#0b257c] to-[#00bceb] p-7 sm:p-8 text-white shadow-xl flex flex-col justify-between border border-cyan-400/20">
                
                {/* Background Studio Poster Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-overlay pointer-events-none"
                  style={{ backgroundImage: `url('/ai-poster.jpg')` }}
                />
                
                {/* Floating 3D ambient orbs inside the poster */}
                <div className="absolute top-8 right-6 w-16 h-16 rounded-full sphere-3d-yellow opacity-75 blur-[1px] pointer-events-none" />
                <div className="absolute bottom-16 left-4 w-12 h-12 rounded-full sphere-3d-red opacity-80 blur-[1px] pointer-events-none" />

                {/* Card Top Details */}
                <div className="relative z-10 space-y-3">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border border-white/20">
                    VIP Delegate Access
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
                    AI Evolution & Cybernetic Harmony
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed font-normal pt-1">
                    Explore sovereign AI architectures, high-performance secure networks, and autonomous Splunk SOC defense for India's digital future.
                  </p>
                </div>

                {/* Card Footer Badge */}
                <div className="relative z-10 pt-4 flex items-center justify-between text-xs text-cyan-100/80 border-t border-white/10">
                  <span className="font-semibold">Hosted by Team AIPL</span>
                  <span className="font-extrabold text-white tracking-wider">Arsenal | Cisco</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3efe6]" />}>
      <RegistrationContent />
    </Suspense>
  );
}
