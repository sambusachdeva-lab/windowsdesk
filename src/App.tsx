/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { TroubleshooterWizard } from './components/TroubleshooterWizard';
import { ErrorCodeLookup } from './components/ErrorCodeLookup';
import { SystemHealthScan } from './components/SystemHealthScan';
import { DriverCatalog } from './components/DriverCatalog';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ContactSupportModal } from './components/ContactSupportModal';
import { Footer } from './components/Footer';
import { 
  Wrench, 
  AlertOctagon, 
  Activity, 
  Cpu, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedTroubleshooterId, setSelectedTroubleshooterId] = useState<string>('bsod');
  const [selectedErrorCode, setSelectedErrorCode] = useState<string>('0x80070005');
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>(undefined);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [contactContext, setContactContext] = useState<string>('');
  const [contactErrorCode, setContactErrorCode] = useState<string>('');

  const handleSelectTroubleshooter = (id: string) => {
    setSelectedTroubleshooterId(id);
    setActiveTab('troubleshoot');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectErrorCode = (code: string) => {
    setSelectedErrorCode(code);
    setActiveTab('errors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (id: string) => {
    setSelectedArticleId(id);
    setActiveTab('knowledge');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenContactWithCode = (code: string, name: string) => {
    setContactErrorCode(`${code} (${name})`);
    setContactContext(`User initiated ticket from Error Code Decoder for ${code}`);
    setIsContactOpen(true);
  };

  const handleEscalateToSupport = (diagnosticContext: string) => {
    setContactContext(diagnosticContext);
    setContactErrorCode('');
    setIsContactOpen(true);
  };

  const handleOpenGeneralContact = () => {
    setContactContext('');
    setContactErrorCode('');
    setIsContactOpen(true);
  };

  const handleLaunchHealthScan = () => {
    setActiveTab('health');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      {/* Top Bar (adheres to Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenContact={handleOpenGeneralContact}
        onOpenQuickScan={handleLaunchHealthScan}
      />

      <main className="flex-1">
        {/* If Overview tab: Render Hero Search + Bento Tool Grid + Core Modules */}
        {activeTab === 'overview' && (
          <div>
            <HeroSearch
              onSelectTroubleshooter={handleSelectTroubleshooter}
              onSelectErrorCode={handleSelectErrorCode}
              onSelectArticle={handleSelectArticle}
              onNavigateTab={setActiveTab}
              onLaunchScan={handleLaunchHealthScan}
            />

            {/* Quick Diagnostic Hub: Asymmetric Bento Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="mb-8">
                <div className="text-xs font-semibold text-[#0067b8] uppercase tracking-wider">
                  Core Diagnostic Hub
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Choose a support tool to begin
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-xl">
                  Whether you need automated repair commands, hardware driver updates, or live assistance, our utilities are calibrated for Windows 11 and 10.
                </p>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bento Card 1: Interactive Troubleshooters (Span 2) */}
                <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-blue-50 text-[#0067b8]">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono text-slate-400">5 Diagnostic Trees</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      Step-by-Step Interactive Troubleshooters
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
                      Resolve Blue Screen crashes, Windows Update stuck at 0%, broken Wi-Fi connectivity, sound crackling, and high 100% disk usage with verified copyable commands.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {['BSOD Crashes', 'Update Stuck', 'Wi-Fi Drops', 'Audio Silent', '100% Disk'].map((item) => (
                        <span key={item} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('troubleshoot')}
                      className="text-xs font-semibold text-[#0067b8] hover:text-[#005a9e] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Launch Troubleshooter</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-slate-400 font-mono">avg 4.2 min fix</span>
                  </div>
                </div>

                {/* Bento Card 2: Error Code Lookup */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 w-fit mb-4">
                      <AlertOctagon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      Error Code Decoder
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Lookup 0x800... hex codes, NTSTATUS codes, and kernel bug checks with root cause breakdowns.
                    </p>

                    <div className="mt-4 font-mono text-xs text-slate-500 space-y-1">
                      <div>· 0x80070005 (Access Denied)</div>
                      <div>· 0x80244018 (HTTP Forbidden)</div>
                      <div>· CRITICAL_PROCESS_DIED</div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => setActiveTab('errors')}
                      className="text-xs font-semibold text-[#0067b8] hover:text-[#005a9e] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Search Error Codes</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bento Card 3: System Health Scan */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 w-fit mb-4">
                      <Activity className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      System Health & Scan
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Run automated health audit for storage SMART health, DISM component store, and security intelligence.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={handleLaunchHealthScan}
                      className="text-xs font-semibold text-[#0067b8] hover:text-[#005a9e] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Run Health Scan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-emerald-700 font-medium">100% Non-destructive</span>
                  </div>
                </div>

                {/* Bento Card 4: Drivers & Firmware */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 w-fit mb-4">
                      <Cpu className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      Drivers & Firmware
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      WHQL-certified drivers for Surface, Intel, AMD, NVIDIA, and Qualcomm Snapdragon X Elite with Winget commands.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => setActiveTab('drivers')}
                      className="text-xs font-semibold text-[#0067b8] hover:text-[#005a9e] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Browse Certified Drivers</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bento Card 5: Knowledge Base & Guides */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="p-2.5 rounded-lg bg-blue-50 text-[#0067b8] w-fit mb-4">
                      <BookOpen className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      Guides & BitLocker Recovery
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Official walkthroughs on finding 48-digit BitLocker keys, Media Creation Tool clean installs, and restore points.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => setActiveTab('knowledge')}
                      className="text-xs font-semibold text-[#0067b8] hover:text-[#005a9e] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Read Documentation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Preview of Featured Troubleshooter */}
              <div className="mt-16">
                <TroubleshooterWizard
                  initialFlowId={selectedTroubleshooterId}
                  onEscalateToSupport={handleEscalateToSupport}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Troubleshooters Full View */}
        {activeTab === 'troubleshoot' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <TroubleshooterWizard
              initialFlowId={selectedTroubleshooterId}
              onEscalateToSupport={handleEscalateToSupport}
            />
          </div>
        )}

        {/* Tab 2: Error Code Lookup Full View */}
        {activeTab === 'errors' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ErrorCodeLookup
              initialCode={selectedErrorCode}
              onOpenTicketWithCode={handleOpenContactWithCode}
            />
          </div>
        )}

        {/* Tab 3: System Health Scan Full View */}
        {activeTab === 'health' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SystemHealthScan />
          </div>
        )}

        {/* Tab 4: Drivers & Firmware Catalog */}
        {activeTab === 'drivers' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <DriverCatalog />
          </div>
        )}

        {/* Tab 5: Guides & Knowledge Base */}
        {activeTab === 'knowledge' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <KnowledgeBase initialArticleId={selectedArticleId} />
          </div>
        )}
      </main>

      {/* Contact & Support Ticket Booking Modal */}
      <ContactSupportModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialContext={contactContext}
        initialErrorCode={contactErrorCode}
      />

      {/* Quiet Windows Footer */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenContact={handleOpenGeneralContact}
      />
    </div>
  );
}
