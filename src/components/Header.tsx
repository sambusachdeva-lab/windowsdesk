import React from 'react';
import { LifeBuoy, Sparkles, Terminal, Activity, Cpu, BookOpen, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenContact: () => void;
  onOpenQuickScan: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenContact,
  onOpenQuickScan,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark with Windows 4-square glyph */}
          <button
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 text-left text-slate-900 group whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            {/* Windows 4-Square Emblem */}
            <div className="grid grid-cols-2 gap-0.5 w-5 h-5 shrink-0" aria-hidden="true">
              <span className="bg-[#0078d4] rounded-[1px] w-2.5 h-2.5" />
              <span className="bg-[#0078d4] rounded-[1px] w-2.5 h-2.5" />
              <span className="bg-[#0078d4] rounded-[1px] w-2.5 h-2.5" />
              <span className="bg-[#0078d4] rounded-[1px] w-2.5 h-2.5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Windows Support
            </span>
          </button>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('troubleshoot')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'troubleshoot' ? 'text-[#0067b8] font-semibold border-b-2 border-[#0067b8] py-5 -mb-[2px]' : ''
              }`}
            >
              Troubleshooters
            </button>
            <button
              onClick={() => onSelectTab('errors')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'errors' ? 'text-[#0067b8] font-semibold border-b-2 border-[#0067b8] py-5 -mb-[2px]' : ''
              }`}
            >
              Error Code Lookup
            </button>
            <button
              onClick={() => onSelectTab('health')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'health' ? 'text-[#0067b8] font-semibold border-b-2 border-[#0067b8] py-5 -mb-[2px]' : ''
              }`}
            >
              System Health
            </button>
            <button
              onClick={() => onSelectTab('drivers')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'drivers' ? 'text-[#0067b8] font-semibold border-b-2 border-[#0067b8] py-5 -mb-[2px]' : ''
              }`}
            >
              Drivers & Firmware
            </button>
            <button
              onClick={() => onSelectTab('knowledge')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'knowledge' ? 'text-[#0067b8] font-semibold border-b-2 border-[#0067b8] py-5 -mb-[2px]' : ''
              }`}
            >
              Guides & KB
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenContact}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0067b8] rounded-md hover:bg-[#005a9e] transition-colors whitespace-nowrap shrink-0 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0067b8] focus-visible:ring-offset-2"
            >
              Contact Helpdesk
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
