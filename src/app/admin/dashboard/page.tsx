"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { emailTemplates } from '@/lib/emailTemplates';
import { 
  UsersIcon, 
  MailIcon, 
  SendIcon, 
  MonitorIcon, 
  SmartphoneIcon, 
  CheckIcon, 
  RefreshIcon, 
  ExternalLinkIcon, 
  MessageSquareIcon,
  SparklesIcon
} from '@/components/Icons';

interface Registration {
  _id: string;
  name: string;
  phone: string;
  email: string;
  department: string;
  description?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export default function AdminDashboard() {
  // Main Navigation Tabs: 'attendees' | 'pre-event' | 'passes'
  const [activeTab, setActiveTab] = useState<'attendees' | 'pre-event' | 'passes'>('attendees');
  
  // Pre-Event Sub-tabs: 'general' (bulk) | 'personal' (individual with dynamic vars)
  const [preEventMode, setPreEventMode] = useState<'general' | 'personal'>('general');

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Template & Preview States
  const [selectedPassDesign, setSelectedPassDesign] = useState<string>('clay-bento');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  // Dynamic Variables for Personalized Invites & Pass Preview
  const [personalData, setPersonalData] = useState({
    name: 'Vinay Malhotra',
    email: 'v.malhotra@tcs-enterprise.com',
    department: 'Chief Information Security Officer (CISO)',
  });

  // General Broadcast State
  const [generalData, setGeneralData] = useState({
    collectiveGreeting: 'Distinguished Technology Leader',
    recipientsText: '',
  });

  // Current Auto-Detected Domain / Origin
  const [currentOrigin, setCurrentOrigin] = useState('http://localhost:3000');

  // Sending status
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [sendMsg, setSendMsg] = useState('');
  const [previewInboxUrl, setPreviewInboxUrl] = useState<string | null>(null);

  const router = useRouter();

  // Automatically detect domain on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch('/api/admin/registrations');
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.data);
      } else if (res.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setRegistrations(prev => 
          prev.map(reg => reg._id === id ? { ...reg, status: newStatus as any } : reg)
        );
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert('Error updating status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendEmail = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/resend-email`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Invite email resent successfully!');
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      alert('Error sending email');
    } finally {
      setActionLoading(null);
    }
  };

  // Helper to parse general bulk emails
  const parsedGeneralEmails = generalData.recipientsText
    .split(/[\n,;]+/)
    .map(e => e.trim().toLowerCase())
    .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

  // Send Pre-Event Invitation (General or Personal)
  const handleSendPreEventInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendStatus('sending');
    setSendMsg('');

    try {
      if (preEventMode === 'general') {
        // Bulk send to multiple users
        if (parsedGeneralEmails.length === 0) {
          setSendStatus('error');
          setSendMsg('Please enter at least one valid recipient email address.');
          return;
        }

        const res = await fetch('/api/admin/email-templates/bulk-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: 'invite-register',
            recipients: parsedGeneralEmails,
            name: generalData.collectiveGreeting,
            department: 'Technology Leadership',
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setSendStatus('success');
          setSendMsg(`Successfully dispatched general invitation to ${data.successCount} recipient(s)!`);
        } else {
          setSendStatus('error');
          setSendMsg(data.error || 'Failed to dispatch general broadcast.');
        }
      } else {
        // Send personalized invitation with dynamic variables to single recipient
        if (!personalData.email) {
          setSendStatus('error');
          setSendMsg('Please enter the recipient email address.');
          return;
        }

        const res = await fetch('/api/admin/email-templates/test-send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: 'invite-register',
            to: personalData.email,
            name: personalData.name,
            department: personalData.department,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setSendStatus('success');
          setSendMsg(`Personalized invitation dispatched to ${personalData.name} (${personalData.email})!`);
          setPreviewInboxUrl(data.result?.previewUrl || null);
        } else {
          setSendStatus('error');
          setSendMsg(data.error || 'Failed to dispatch email.');
        }
      }
    } catch (err: any) {
      setSendStatus('error');
      setSendMsg(err.message || 'Error occurred while sending email');
    }
  };

  // Filtered Attendees list
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesFilter = filter === 'All' || reg.status === filter;
    const matchesSearch = 
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.description && reg.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      reg.phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: registrations.length,
    pending: registrations.filter(r => r.status === 'Pending').length,
    approved: registrations.filter(r => r.status === 'Approved').length,
    rejected: registrations.filter(r => r.status === 'Rejected').length,
  };

  // Pre-event template
  const inviteTemplate = emailTemplates.find(t => t.id === 'invite-register') || emailTemplates[0];
  const renderedPreEventHtml = inviteTemplate.generateHtml(
    preEventMode === 'general' 
      ? { name: generalData.collectiveGreeting, email: 'delegate@enterprise.com', department: 'Enterprise Technology', registrationUrl: `${currentOrigin}/e-invite` }
      : { ...personalData, registrationUrl: `${currentOrigin}/e-invite` }
  );

  // VIP Pass template
  const passTemplate = emailTemplates.find(t => t.id === selectedPassDesign) || emailTemplates[1];
  const renderedPassHtml = passTemplate.generateHtml({ ...personalData, registrationUrl: `${currentOrigin}/e-invite` });

  return (
    <main className="relative min-h-screen bg-[#f3efe6] text-slate-800 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 font-sans antialiased overflow-x-hidden selection:bg-[#00bceb] selection:text-white">
      
      {/* Ambient Moving Mesh Gradient Glows */}
      <div className="fixed -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#00bceb]/20 via-[#00bceb]/10 to-transparent blur-[90px] pointer-events-none animate-ambient-mesh" />
      <div className="fixed -bottom-28 -right-28 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#0b257c]/15 via-[#0b257c]/5 to-transparent blur-[100px] pointer-events-none animate-pulse-slow" />

      {/* Background Soft Studio Texture */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-25 mix-blend-multiply pointer-events-none"
        style={{ backgroundImage: `url('/clay-bg.jpg')` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Top Header Card (Responsive) */}
        <header className="bg-white rounded-[24px] sm:rounded-[28px] border border-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.06)] p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-xs">
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto">
            <div className="inline-flex items-center gap-2.5 sm:gap-3 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-2xl shadow-xs">
              <Image 
                src="/arsenal-logo.jpg" 
                alt="Arsenal" 
                width={80} 
                height={26} 
                style={{ width: 'auto', height: 'auto' }}
                className="object-contain" 
              />
              <div className="h-4 w-px bg-slate-300" />
              <Image 
                src="/cisco-logo.png" 
                alt="Cisco" 
                width={65} 
                height={26} 
                style={{ width: 'auto', height: 'auto' }}
                className="object-contain" 
              />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Event Admin Portal
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500">Trusted AI for a New Digital India • 18 Sept 2026</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
            
            {/* Main Navigation Switcher */}
            <div className="bg-slate-100 p-1 rounded-full flex items-center gap-1 border border-slate-200/60 text-xs">
              
              <button
                onClick={() => setActiveTab('attendees')}
                className={`px-3 sm:px-4 py-1.5 rounded-full font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'attendees'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UsersIcon className="w-3.5 h-3.5 text-slate-700" />
                <span>Attendees ({counts.all})</span>
              </button>
              
              <button
                onClick={() => setActiveTab('pre-event')}
                className={`px-3 sm:px-4 py-1.5 rounded-full font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'pre-event'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MailIcon className="w-3.5 h-3.5 text-[#00bceb]" />
                <span>Pre-Event Invites</span>
                <span className="bg-[#00bceb] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">New</span>
              </button>

              <button
                onClick={() => setActiveTab('passes')}
                className={`px-3 sm:px-4 py-1.5 rounded-full font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'passes'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎫 VIP Passes</span>
                <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">3</span>
              </button>

            </div>

            <div className="flex items-center gap-2">
              <Link 
                href="/e-invite" 
                target="_blank" 
                className="text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1"
              >
                <span>Public</span>
                <ExternalLinkIcon className="w-3 h-3 text-slate-500" />
              </Link>

              <button 
                onClick={() => {
                  document.cookie = "admin-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  router.push('/admin/login');
                }}
                className="text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
              >
                Sign Out
              </button>
            </div>

          </div>
        </header>

        {/* ----------------- TAB 1: ATTENDEES VIEW ----------------- */}
        {activeTab === 'attendees' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
                <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registrations</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{counts.all}</div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-[#00bceb] mt-1">100% synced</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
                <div className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Review</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{counts.pending}</div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-amber-500 mt-1">Awaiting decision</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
                <div className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">Approved Invites</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{counts.approved}</div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-500 mt-1">Pass dispatched</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
                <div className="text-[10px] sm:text-xs font-bold text-rose-600 uppercase tracking-wider">Rejected</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">{counts.rejected}</div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-rose-400 mt-1">Declined delegates</div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                      filter === tab
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab} ({tab === 'All' ? counts.all : counts[tab.toLowerCase() as keyof typeof counts]})
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search name, email, dept..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 sm:py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00bceb] focus:ring-2 focus:ring-[#00bceb]/20 font-medium"
                  />
                </div>
                <button 
                  onClick={fetchRegistrations}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 transition shrink-0 flex items-center gap-1.5"
                >
                  <RefreshIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                  <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <tr>
                      <th scope="col" className="px-5 py-4">Attendee</th>
                      <th scope="col" className="px-5 py-4">Contact</th>
                      <th scope="col" className="px-5 py-4">Department</th>
                      <th scope="col" className="px-5 py-4">Status</th>
                      <th scope="col" className="px-5 py-4">Registered Date</th>
                      <th scope="col" className="px-5 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                          Loading attendee registrations...
                        </td>
                      </tr>
                    ) : filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                          No matching attendees found.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg._id} className="hover:bg-slate-50/70 transition">
                          <td className="px-5 py-4 font-bold text-slate-900">
                            <div className="text-sm font-extrabold text-slate-900">{reg.name}</div>
                            {reg.description && (
                              <div className="text-[11px] text-slate-500 font-medium mt-1 max-w-xs truncate bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 flex items-center gap-1" title={reg.description}>
                                <MessageSquareIcon className="w-3 h-3 shrink-0 text-slate-400" />
                                <span className="truncate">{reg.description}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-[#00bceb]">{reg.email}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{reg.phone}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 whitespace-nowrap">
                              {reg.department}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-3 py-1 inline-flex text-[10px] font-extrabold uppercase tracking-wider rounded-full border ${
                              reg.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              reg.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                            {new Date(reg.createdAt).toLocaleString(undefined, { 
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {reg.status === 'Pending' && (
                                <>
                                  <button 
                                    disabled={actionLoading === reg._id}
                                    onClick={() => handleUpdateStatus(reg._id, 'Approved')} 
                                    className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs disabled:opacity-50 transition"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    disabled={actionLoading === reg._id}
                                    onClick={() => handleUpdateStatus(reg._id, 'Rejected')} 
                                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 text-rose-600 font-bold text-[11px] transition"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {reg.status === 'Approved' && (
                                <button 
                                  disabled={actionLoading === reg._id}
                                  onClick={() => handleResendEmail(reg._id)} 
                                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition"
                                >
                                  Resend Pass
                                </button>
                              )}

                              {reg.status === 'Rejected' && (
                                <button 
                                  disabled={actionLoading === reg._id}
                                  onClick={() => handleUpdateStatus(reg._id, 'Approved')} 
                                  className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition"
                                >
                                  Re-Approve
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: PRE-EVENT INVITATIONS (GENERAL & PERSONAL) ----------------- */}
        {activeTab === 'pre-event' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            
            {/* Top Sub-Nav Pills for General vs Personal */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Pre-Event Email Invitation Campaign
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-500">
                    Send interactive invitations with direct registration links.
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 hidden sm:inline">
                    Auto-links to {currentOrigin}/e-invite
                  </span>
                </div>
              </div>

              {/* General vs Personal Sub-Tabs */}
              <div className="bg-slate-100 p-1 rounded-full flex items-center gap-1 self-start sm:self-auto border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => {
                    setPreEventMode('general');
                    setSendStatus('idle');
                    setSendMsg('');
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 ${
                    preEventMode === 'general'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🌐 General Broadcast (Multi-User)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPreEventMode('personal');
                    setSendStatus('idle');
                    setSendMsg('');
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 ${
                    preEventMode === 'personal'
                      ? 'bg-[#00bceb] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>👤 Personalized VIP Invite</span>
                </button>
              </div>
            </div>

            {/* Pre-Event Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              
              {/* Left Column: Form & Dispatch (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* 1. GENERAL BROADCAST MODE */}
                {preEventMode === 'general' && (
                  <div className="bg-white rounded-[24px] sm:rounded-3xl border border-slate-100 p-4 sm:p-5 shadow-sm space-y-3.5">
                    
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                        <UsersIcon className="w-3.5 h-3.5 text-[#00bceb]" />
                        <span>General Multi-User Broadcast</span>
                      </h4>
                      <span className="text-[10px] text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-md">Batch Sender</span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Sends a standardized invitation to multiple executives. Clicking the email card or CTA button directly opens your live registration form.
                    </p>

                    <form onSubmit={handleSendPreEventInvite} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Collective Salutation / Greeting
                        </label>
                        <input
                          type="text"
                          value={generalData.collectiveGreeting}
                          onChange={(e) => setGeneralData(prev => ({ ...prev, collectiveGreeting: e.target.value }))}
                          placeholder="Distinguished Technology Leader"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#00bceb]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">
                            Recipient Email List
                          </label>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            parsedGeneralEmails.length > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {parsedGeneralEmails.length} Email{parsedGeneralEmails.length === 1 ? '' : 's'}
                          </span>
                        </div>
                        <textarea
                          rows={5}
                          required
                          placeholder="ciso@tcs.com, it-head@infosys.com&#10;director@wipro.com&#10;vp@hcl.com"
                          value={generalData.recipientsText}
                          onChange={(e) => setGeneralData(prev => ({ ...prev, recipientsText: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#00bceb] font-mono leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sendStatus === 'sending' || parsedGeneralEmails.length === 0}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md disabled:opacity-50"
                      >
                        <SendIcon className="w-3.5 h-3.5" />
                        <span>
                          {sendStatus === 'sending' 
                            ? `Broadcasting to ${parsedGeneralEmails.length} Users...` 
                            : `Send Invitation to ${parsedGeneralEmails.length} Users →`}
                        </span>
                      </button>
                    </form>

                    {sendMsg && (
                      <div className={`p-2.5 rounded-xl text-xs flex items-center gap-1.5 animate-fadeIn ${
                        sendStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        {sendStatus === 'success' ? <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" /> : <span>⚠️</span>}
                        <span>{sendMsg}</span>
                      </div>
                    )}

                  </div>
                )}

                {/* 2. PERSONALIZED VIP INVITE MODE */}
                {preEventMode === 'personal' && (
                  <div className="bg-white rounded-[24px] sm:rounded-3xl border border-slate-100 p-4 sm:p-5 shadow-sm space-y-3.5">
                    
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                        <SparklesIcon className="w-3.5 h-3.5 text-[#00bceb]" />
                        <span>Personalized VIP Invite</span>
                      </h4>
                      <span className="text-[10px] text-[#00bceb] font-bold bg-cyan-50 px-2 py-0.5 rounded-md">Dynamic Variables</span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Custom tailored VIP invitation addressing the delegate by their exact name and title. Links directly to your registration form.
                    </p>

                    <form onSubmit={handleSendPreEventInvite} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          VIP Delegate Name
                        </label>
                        <input
                          type="text"
                          required
                          value={personalData.name}
                          onChange={(e) => setPersonalData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Mr. Rajesh Sharma"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#00bceb]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Designation / Department
                        </label>
                        <input
                          type="text"
                          required
                          value={personalData.department}
                          onChange={(e) => setPersonalData(prev => ({ ...prev, department: e.target.value }))}
                          placeholder="e.g. VP & Head of Cybersecurity"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#00bceb]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Recipient Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={personalData.email}
                          onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="r.sharma@tcs.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#00bceb]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={sendStatus === 'sending'}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#00bceb] via-[#049fd9] to-[#0b257c] hover:opacity-95 text-white font-bold text-xs transition shadow-md shadow-cyan-500/20 disabled:opacity-50"
                      >
                        <SendIcon className="w-3.5 h-3.5" />
                        <span>
                          {sendStatus === 'sending' ? 'Dispatching VIP Invite...' : `Send VIP Invite to ${personalData.name} →`}
                        </span>
                      </button>
                    </form>

                    {sendMsg && (
                      <div className={`p-3 rounded-2xl text-xs flex flex-col gap-2 animate-fadeIn ${
                        sendStatus === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <div className="flex items-center gap-1.5 font-semibold">
                          {sendStatus === 'success' ? <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" /> : <span className="shrink-0">⚠️</span>}
                          <span>{sendMsg}</span>
                        </div>
                        {previewInboxUrl && (
                          <a
                            href={previewInboxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-full transition shadow-xs self-start"
                          >
                            <span>View Sent Email in Live Web Inbox ↗</span>
                          </a>
                        )}
                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* Right Column: Live Iframe Preview (8 cols) */}
              <div className="lg:col-span-8 flex flex-col">
                
                {/* Preview Toolbar */}
                <div className="bg-white rounded-t-[24px] sm:rounded-t-3xl border-t border-x border-slate-100 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      {preEventMode === 'general' ? 'General Broadcast Preview' : `Personalized VIP Invite: ${personalData.name}`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">• Auto-linked to your subdomain</span>
                  </div>

                  {/* Device Toggle */}
                  <div className="bg-slate-100 p-1 rounded-full flex items-center gap-1 self-end sm:self-auto">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 ${
                        previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      <MonitorIcon className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 ${
                        previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      <SmartphoneIcon className="w-3.5 h-3.5" />
                      <span>Mobile (375px)</span>
                    </button>
                  </div>
                </div>

                {/* Iframe Viewport Container */}
                <div className="bg-slate-100/70 border border-slate-200/80 rounded-b-[24px] sm:rounded-b-3xl p-2 sm:p-6 flex items-center justify-center min-h-[580px] sm:min-h-[640px] overflow-hidden">
                  <div className={`transition-all duration-300 w-full ${
                    previewDevice === 'mobile' ? 'max-w-[390px] shadow-2xl rounded-[32px] overflow-hidden border-4 sm:border-8 border-slate-900 bg-white' : 'max-w-2xl bg-transparent'
                  }`}>
                    <iframe
                      key={`preevent-${preEventMode}-${previewDevice}-${personalData.name}-${generalData.collectiveGreeting}-${currentOrigin}`}
                      srcDoc={renderedPreEventHtml}
                      title="Pre-Event Email Preview"
                      className="w-full h-[580px] sm:h-[620px] rounded-2xl bg-white border-0"
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ----------------- TAB 3: APPROVED VIP PASSES (3 DESIGN STYLES) ----------------- */}
        {activeTab === 'passes' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            
            {/* Design Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {emailTemplates.filter(t => t.id !== 'invite-register').map((tpl, idx) => {
                const isSelected = selectedPassDesign === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedPassDesign(tpl.id)}
                    className={`text-left p-4 rounded-[22px] transition-all relative border ${
                      isSelected
                        ? 'bg-white border-[#00bceb] ring-2 ring-[#00bceb]/25 shadow-lg shadow-cyan-500/10'
                        : 'bg-white/80 hover:bg-white border-slate-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-xl bg-slate-900 text-white font-extrabold text-[11px] flex items-center justify-center">
                        0{idx + 1}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        tpl.id === 'clay-bento' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        tpl.id === 'cyber-dark' ? 'bg-slate-900 text-cyan-300 border border-slate-800' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {tpl.designStyle}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1">{tpl.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Passes Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              
              {/* Left Column: Pass Customizer & Test Send (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-[24px] sm:rounded-3xl border border-slate-100 p-4 sm:p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <SparklesIcon className="w-3.5 h-3.5 text-[#00bceb]" />
                      <span>Pass Delegate Variables</span>
                    </h4>
                    <span className="text-[10px] text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-md">Live Dynamic</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Delegate Name</label>
                      <input 
                        type="text" 
                        value={personalData.name} 
                        onChange={(e) => setPersonalData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#00bceb]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Department / Role</label>
                      <input 
                        type="text" 
                        value={personalData.department} 
                        onChange={(e) => setPersonalData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#00bceb]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Recipient Email</label>
                      <input 
                        type="email" 
                        value={personalData.email} 
                        onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#00bceb]"
                      />
                    </div>
                  </div>
                </div>

                {/* Send Pass Card */}
                <div className="bg-white rounded-[24px] sm:rounded-3xl border border-slate-100 p-4 sm:p-5 shadow-sm">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <SendIcon className="w-3.5 h-3.5 text-[#00bceb]" />
                    <span>Send Approved Pass</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Dispatches the selected pass design to the delegate's email.
                  </p>

                  <button
                    onClick={async () => {
                      setSendStatus('sending');
                      setSendMsg('');
                      try {
                        const res = await fetch('/api/admin/email-templates/test-send', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            templateId: selectedPassDesign,
                            to: personalData.email,
                            name: personalData.name,
                            department: personalData.department,
                          }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setSendStatus('success');
                          setSendMsg(`Pass dispatched to ${personalData.email}!`);
                          setPreviewInboxUrl(data.result?.previewUrl || null);
                        } else {
                          setSendStatus('error');
                          setSendMsg(data.error || 'Failed to dispatch pass.');
                        }
                      } catch (err: any) {
                        setSendStatus('error');
                        setSendMsg(err.message || 'Error sending pass');
                      }
                    }}
                    disabled={sendStatus === 'sending'}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold text-xs transition shadow-md disabled:opacity-50"
                  >
                    <SendIcon className="w-3.5 h-3.5" />
                    <span>{sendStatus === 'sending' ? 'Sending Pass...' : `Dispatch Pass to ${personalData.email} →`}</span>
                  </button>

                  {sendMsg && (
                    <div className={`mt-3 p-3 rounded-2xl text-xs flex flex-col gap-2 animate-fadeIn ${
                      sendStatus === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      <div className="flex items-center gap-1.5 font-semibold">
                        {sendStatus === 'success' ? <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" /> : <span className="shrink-0">⚠️</span>}
                        <span>{sendMsg}</span>
                      </div>
                      {previewInboxUrl && (
                        <a
                          href={previewInboxUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-full transition shadow-xs self-start"
                        >
                          <span>View Sent Email in Live Web Inbox ↗</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Live Iframe (8 cols) */}
              <div className="lg:col-span-8 flex flex-col">
                <div className="bg-white rounded-t-[24px] sm:rounded-t-3xl border-t border-x border-slate-100 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">{passTemplate.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">• {passTemplate.designStyle}</span>
                  </div>

                  <div className="bg-slate-100 p-1 rounded-full flex items-center gap-1 self-end sm:self-auto">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 ${
                        previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      <MonitorIcon className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 ${
                        previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      <SmartphoneIcon className="w-3.5 h-3.5" />
                      <span>Mobile (375px)</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-100/70 border border-slate-200/80 rounded-b-[24px] sm:rounded-b-3xl p-2 sm:p-6 flex items-center justify-center min-h-[580px] sm:min-h-[640px] overflow-hidden">
                  <div className={`transition-all duration-300 w-full ${
                    previewDevice === 'mobile' ? 'max-w-[390px] shadow-2xl rounded-[32px] overflow-hidden border-4 sm:border-8 border-slate-900 bg-white' : 'max-w-2xl bg-transparent'
                  }`}>
                    <iframe
                      key={`pass-${selectedPassDesign}-${previewDevice}-${personalData.name}`}
                      srcDoc={renderedPassHtml}
                      title="Pass Preview"
                      className="w-full h-[580px] sm:h-[620px] rounded-2xl bg-white border-0"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}
