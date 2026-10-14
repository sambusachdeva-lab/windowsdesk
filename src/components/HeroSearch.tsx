import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, ShieldCheck, AlertCircle, Wrench, RefreshCw, Volume2, Wifi, HardDrive, Key, FileText, CheckCircle2 } from 'lucide-react';
import { ERROR_CODES, TROUBLESHOOT_FLOWS, KNOWLEDGE_ARTICLES } from '../data/supportData';

interface HeroSearchProps {
  onSelectTroubleshooter: (id: string) => void;
  onSelectErrorCode: (code: string) => void;
  onSelectArticle: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  onLaunchScan: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSelectTroubleshooter,
  onSelectErrorCode,
  onSelectArticle,
  onNavigateTab,
  onLaunchScan,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Filter results across error codes, troubleshooters, and articles
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return null;

    const matchedErrors = ERROR_CODES.filter(
      (e) =>
        e.code.toLowerCase().includes(trimmed) ||
        e.name.toLowerCase().includes(trimmed) ||
        e.summary.toLowerCase().includes(trimmed)
    ).slice(0, 3);

    const matchedTroubleshooters = TROUBLESHOOT_FLOWS.filter(
      (t) =>
        t.title.toLowerCase().includes(trimmed) ||
        t.summary.toLowerCase().includes(trimmed) ||
        t.category.toLowerCase().includes(trimmed)
    ).slice(0, 3);

    const matchedArticles = KNOWLEDGE_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(trimmed) ||
        a.excerpt.toLowerCase().includes(trimmed)
    ).slice(0, 3);

    const totalCount = matchedErrors.length + matchedTroubleshooters.length + matchedArticles.length;

    return {
      errors: matchedErrors,
      troubleshooters: matchedTroubleshooters,
      articles: matchedArticles,
      totalCount,
    };
  }, [query]);

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Search & Quick Actions */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0067b8] mb-3 tracking-wide">
              <span>Official Microsoft Support</span>
              <span aria-hidden="true">·</span>
              <span>Windows 11 & Windows 10</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
              How can we help you with Windows today?
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Find instant solutions for system crashes, update errors, hardware driver updates, and step-by-step diagnostic utilities.
            </p>

            {/* Interactive Search Bar */}
            <div className="relative mt-8 max-w-xl">
              <div
                className={`relative flex items-center bg-white rounded-lg border transition-all ${
                  isFocused
                    ? 'border-[#0067b8] ring-2 ring-[#0067b8]/20 shadow-md'
                    : 'border-slate-300 hover:border-slate-400 shadow-sm'
                }`}
              >
                <div className="pl-4 text-slate-400 pointer-events-none">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 250)}
                  placeholder="Search error code (e.g. 0x80070005, BSOD, audio, Wi-Fi)..."
                  className="w-full py-3.5 pl-3 pr-10 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none rounded-lg"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="pr-4 text-xs font-medium text-slate-400 hover:text-slate-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Instant Search Results Dropdown */}
              {isFocused && searchResults && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg border border-slate-200 shadow-xl z-30 max-h-96 overflow-y-auto p-3 space-y-3">
                  {searchResults.totalCount === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No matching support resources found for "{query}". Try checking our Error Code Decoder or starting a diagnostic scan.
                    </div>
                  ) : (
                    <>
                      {searchResults.errors.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                            Error Codes
                          </div>
                          {searchResults.errors.map((err) => (
                            <button
                              key={err.code}
                              onClick={() => {
                                onSelectErrorCode(err.code);
                                onNavigateTab('errors');
                              }}
                              className="w-full text-left p-2 rounded-md hover:bg-slate-50 transition-colors flex items-start gap-2.5"
                            >
                              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold font-mono text-slate-900 truncate">
                                  {err.code} <span className="font-sans font-normal text-slate-500 text-xs">({err.name})</span>
                                </div>
                                <div className="text-xs text-slate-600 truncate">{err.summary}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {searchResults.troubleshooters.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                            Interactive Troubleshooters
                          </div>
                          {searchResults.troubleshooters.map((tr) => (
                            <button
                              key={tr.id}
                              onClick={() => {
                                onSelectTroubleshooter(tr.id);
                                onNavigateTab('troubleshoot');
                              }}
                              className="w-full text-left p-2 rounded-md hover:bg-slate-50 transition-colors flex items-start gap-2.5"
                            >
                              <Wrench className="w-4 h-4 text-[#0067b8] mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-900 truncate">
                                  {tr.title}
                                </div>
                                <div className="text-xs text-slate-600 truncate">{tr.summary}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {searchResults.articles.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                            Guides & Articles
                          </div>
                          {searchResults.articles.map((art) => (
                            <button
                              key={art.id}
                              onClick={() => {
                                onSelectArticle(art.id);
                                onNavigateTab('knowledge');
                              }}
                              className="w-full text-left p-2 rounded-md hover:bg-slate-50 transition-colors flex items-start gap-2.5"
                            >
                              <FileText className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-900 truncate">
                                  {art.title}
                                </div>
                                <div className="text-xs text-slate-500 truncate">{art.excerpt}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Quick Topic Jump Buttons (Functional interactive buttons) */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-500 mr-1">Popular Topics:</span>
                <button
                  onClick={() => {
                    onSelectTroubleshooter('bsod');
                    onNavigateTab('troubleshoot');
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
                >
                  Blue Screen (BSOD)
                </button>
                <button
                  onClick={() => {
                    onSelectErrorCode('0x80070005');
                    onNavigateTab('errors');
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
                >
                  0x80070005
                </button>
                <button
                  onClick={() => {
                    onSelectTroubleshooter('network');
                    onNavigateTab('troubleshoot');
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
                >
                  Wi-Fi Drops
                </button>
                <button
                  onClick={() => {
                    onSelectTroubleshooter('audio');
                    onNavigateTab('troubleshoot');
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
                >
                  Audio Not Working
                </button>
                <button
                  onClick={() => {
                    onSelectArticle('art-bitlocker-recovery');
                    onNavigateTab('knowledge');
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
                >
                  BitLocker Key
                </button>
              </div>
            </div>

            {/* Quick Diagnostic Callout */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="p-2 rounded-md bg-[#0067b8]/10 text-[#0067b8] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 text-xs sm:text-sm text-slate-700">
                <span className="font-semibold text-slate-900">Unsure what is causing your PC issue?</span> Run the automated Windows Diagnostic Scan to test storage integrity, update services, and memory.
              </div>
              <button
                onClick={onLaunchScan}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0067b8] hover:bg-[#005a9e] rounded-md transition-colors shrink-0 shadow-sm whitespace-nowrap"
              >
                Run System Check
              </button>
            </div>
          </div>

          {/* Right Column: Visual Showcase Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-slate-900 group">
              <img
                src="/src/assets/images/hero_windows_workspace_1792021386214.jpg"
                alt="Modern workstation running Windows 11 with support diagnostics"
                className="w-full h-80 lg:h-96 object-cover opacity-95 group-hover:scale-[1.01] transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              
              {/* Overlay card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-lg border border-slate-200 text-slate-900 shadow-md">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All Support Services Active
                  </span>
                  <span className="font-mono text-slate-500">v24H2 Build 26100</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Surface & Windows Hardware Diagnostics
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>Automated fixes · Certified firmware</span>
                  <button
                    onClick={() => onNavigateTab('drivers')}
                    className="text-[#0067b8] font-semibold hover:underline flex items-center gap-1"
                  >
                    View catalog <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width System Telemetry KPI Strip below Hero */}
      <div className="bg-slate-50 border-t border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="border-r border-slate-200 last:border-none pr-4">
            <div className="text-xs text-slate-500 font-medium">Windows 11 Target</div>
            <div className="text-sm font-semibold text-slate-900 font-mono tabular-nums">Build 26100.1882</div>
          </div>
          <div className="border-r border-slate-200 last:border-none pr-4">
            <div className="text-xs text-slate-500 font-medium">Security Intelligence</div>
            <div className="text-sm font-semibold text-slate-900 font-mono tabular-nums">v1.421.902.0 (Latest)</div>
          </div>
          <div className="border-r border-slate-200 last:border-none pr-4">
            <div className="text-xs text-slate-500 font-medium">Windows Update Gateway</div>
            <div className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5 sm:justify-start justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Operational (100%)
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Support Desk Queue</div>
            <div className="text-sm font-semibold text-slate-900 tabular-nums">~2 min avg response</div>
          </div>
        </div>
      </div>
    </section>
  );
};
