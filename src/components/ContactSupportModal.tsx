import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare, 
  Laptop, 
  LifeBuoy, 
  Headphones 
} from 'lucide-react';
import { SupportTicket } from '../types/support';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: string;
  initialErrorCode?: string;
}

export const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  isOpen,
  onClose,
  initialContext = '',
  initialErrorCode = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [windowsVersion, setWindowsVersion] = useState('Windows 11 (24H2)');
  const [deviceModel, setDeviceModel] = useState('');
  const [category, setCategory] = useState(initialErrorCode ? 'Update' : 'General');
  const [description, setDescription] = useState(
    initialContext
      ? `Diagnostic trail from troubleshooter:\n${initialContext}`
      : initialErrorCode
      ? `Investigating Windows Error Code: ${initialErrorCode}`
      : ''
  );
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);
  const [copiedTicketId, setCopiedTicketId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([]);
  const [userReply, setUserReply] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `MS-SR-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const newTicket: SupportTicket = {
        ticketId,
        name,
        email,
        windowsVersion,
        category,
        subject: initialErrorCode ? `Case regarding ${initialErrorCode}` : `Support Request: ${category}`,
        description,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'In Queue',
        assignedEngineer: 'Sarah L. (Windows Escalation Team)',
        priority: 'Normal',
      };
      setSubmittedTicket(newTicket);
      setIsSubmitting(false);

      // Preload chat
      setChatMessages([
        {
          sender: 'agent',
          text: `Hello ${name}, thank you for contacting Microsoft Support. I've received your ticket (${ticketId}) regarding ${category}. Reviewing your diagnostic telemetry now.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 700);
  };

  const handleCopyTicket = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTicketId(true);
    setTimeout(() => setCopiedTicketId(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userReply.trim()) return;

    const currentReply = userReply;
    setUserReply('');
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: currentReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Simulated agent reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `Understood. I am cross-referencing your device logs. Please run 'sfc /scannow' or check if your BIOS firmware is up to date while I prepare the remote assistance package.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#0067b8]/10 text-[#0067b8]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Microsoft Support Assistance
              </h3>
              <p className="text-xs text-slate-500">
                Connect with official Windows technical specialists · 24/7 Queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {submittedTicket ? (
            /* Ticket Confirmation & Queue / Chat Screen */
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-800">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-emerald-900">
                      Support Request Registered Successfully
                    </div>
                    <p className="text-xs text-emerald-800 mt-1">
                      A confirmation email and remote session invite have been dispatched to <strong>{submittedTicket.email}</strong>.
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900 text-sm bg-white px-3 py-1 rounded border border-emerald-300">
                        {submittedTicket.ticketId}
                      </span>
                      <button
                        onClick={() => handleCopyTicket(submittedTicket.ticketId)}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                      >
                        {copiedTicketId ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Reference ID
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Queue Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">Queue Position:</span>
                  <div className="font-bold text-slate-900 tabular-nums">#2 in line</div>
                </div>
                <div>
                  <span className="text-slate-500">Estimated Callback:</span>
                  <div className="font-bold text-slate-900 tabular-nums">~2 mins</div>
                </div>
                <div>
                  <span className="text-slate-500">Assigned Specialist:</span>
                  <div className="font-bold text-slate-900">{submittedTicket.assignedEngineer}</div>
                </div>
              </div>

              {/* Live Web Chat Session Simulation */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-900 text-white p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold">Live Support Chat Room</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{submittedTicket.ticketId}</span>
                </div>

                <div className="p-4 bg-slate-50 h-52 overflow-y-auto space-y-3 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-[#0067b8] text-white rounded-br-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 px-1 font-mono">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="p-2.5 bg-white border-t border-slate-200 flex gap-2">
                  <input
                    type="text"
                    value={userReply}
                    onChange={(e) => setUserReply(e.target.value)}
                    placeholder="Type message to support engineer..."
                    className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0067b8]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#0067b8] hover:bg-[#005a9e] text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Ticket Creation Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0067b8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0067b8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Windows Version
                  </label>
                  <select
                    value={windowsVersion}
                    onChange={(e) => setWindowsVersion(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0067b8] bg-white"
                  >
                    <option value="Windows 11 (24H2)">Windows 11 (24H2)</option>
                    <option value="Windows 11 (23H2)">Windows 11 (23H2)</option>
                    <option value="Windows 10 (22H2)">Windows 10 (22H2)</option>
                    <option value="Windows Server">Windows Server 2022/2025</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Device Model
                  </label>
                  <input
                    type="text"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="Surface Pro / Dell XPS..."
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0067b8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0067b8] bg-white"
                  >
                    <option value="BSOD / Crash">Blue Screen / BSOD</option>
                    <option value="Windows Update">Windows Update</option>
                    <option value="Wi-Fi / Network">Wi-Fi & Internet</option>
                    <option value="Sound / Audio">Audio & Microphone</option>
                    <option value="Activation">Activation & Key</option>
                    <option value="General">Hardware / Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Describe what happened & any error message
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the symptoms, steps taken, or error messages encountered..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0067b8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Estimated response time: <strong className="text-slate-800">~2 minutes</strong>
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#0067b8] hover:bg-[#005a9e] rounded-lg transition-colors shadow-xs"
                  >
                    {isSubmitting ? 'Creating Ticket...' : 'Submit Support Request'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
