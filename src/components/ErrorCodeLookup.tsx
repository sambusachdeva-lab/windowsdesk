import React, { useState } from 'react';
import { 
  Search, 
  Terminal, 
  Copy, 
  Check, 
  AlertOctagon, 
  ShieldAlert, 
  Cpu, 
  HelpCircle, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';
import { ERROR_CODES } from '../data/supportData';
import { ErrorCodeInfo } from '../types/support';

interface ErrorCodeLookupProps {
  initialCode?: string;
  onOpenTicketWithCode: (code: string, name: string) => void;
}

export const ErrorCodeLookup: React.FC<ErrorCodeLookupProps> = ({
  initialCode,
  onOpenTicketWithCode,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialCode || '');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedError, setSelectedError] = useState<ErrorCodeInfo>(
    ERROR_CODES.find((e) => e.code.toLowerCase() === (initialCode || '').toLowerCase()) ||
    ERROR_CODES[0]
  );
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const categories = ['All', 'Update', 'BSOD / Kernel', 'Activation', 'Filesystem'];

  const filteredErrors = ERROR_CODES.filter((err) => {
    const matchesCategory =
      activeCategory === 'All' || err.category === activeCategory;
    const matchesSearch =
      err.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      err.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      err.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      err.subsystem.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#0067b8] uppercase tracking-wider">
              Diagnostic Database
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
              Windows Error Code & Stop Code Decoder
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Decode hex error strings (0x800...) and Blue Screen bug check names with verified resolution commands.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by code (0x800...) or keyword"
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-[#0067b8] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Code List (Left) & Comprehensive Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Code Selector List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
          {filteredErrors.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
              No matching Windows error codes found for "{searchTerm}".
            </div>
          ) : (
            filteredErrors.map((err) => {
              const isSelected = selectedError.code === err.code;
              return (
                <button
                  key={err.code}
                  onClick={() => setSelectedError(err)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-blue-50/50 border-[#0067b8] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {err.code}
                    </span>
                    <span className="text-slate-500 font-medium">{err.category}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#0067b8] mb-1 font-mono truncate">
                    {err.name}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {err.summary}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Active Error Details & Fix Actions */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-500">
                Subsystem: {selectedError.subsystem}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
                {selectedError.code}
              </h3>
              <div className="text-sm font-semibold text-[#0067b8] font-mono">
                {selectedError.name}
              </div>
            </div>

            <button
              onClick={() => onOpenTicketWithCode(selectedError.code, selectedError.name)}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#0067b8] border border-[#0067b8]/30 hover:bg-blue-50 rounded-md transition-colors"
            >
              Open Ticket For This Error
            </button>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Error Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedError.summary}
            </p>
          </div>

          {/* Common Causes */}
          <div className="mt-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Common Root Causes
            </h4>
            <ul className="space-y-2">
              {selectedError.commonCauses.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Fix Command Box */}
          {selectedError.recommendedCommand && (
            <div className="mt-6 rounded-lg bg-slate-900 text-slate-100 p-4 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Elevated {selectedError.commandType?.toUpperCase() || 'CMD'} Repair Command</span>
                </div>
                <button
                  onClick={() => handleCopy(selectedError.recommendedCommand!)}
                  className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 p-2.5 rounded font-mono text-xs sm:text-sm text-emerald-400 select-all overflow-x-auto whitespace-pre">
                {selectedError.recommendedCommand}
              </div>
              <div className="text-[11px] text-slate-400 mt-1.5">
                Note: Run Command Prompt as Administrator before executing.
              </div>
            </div>
          )}

          {/* Step-by-step resolution checklist */}
          <div className="mt-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Standard Resolution Sequence
            </h4>
            <div className="space-y-3">
              {selectedError.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
