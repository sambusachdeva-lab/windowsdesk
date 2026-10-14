import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  ShieldCheck, 
  HardDrive, 
  Cpu, 
  Activity, 
  Terminal, 
  Check, 
  Wrench,
  Clock
} from 'lucide-react';
import { DiagnosticCheckItem } from '../types/support';

const INITIAL_CHECKS: DiagnosticCheckItem[] = [
  {
    id: 'chk-wuauserv',
    name: 'Windows Update & BITS Services',
    category: 'OS Services',
    status: 'pending',
    metric: 'Queue State',
    details: 'Verifying wuauserv, bits, and cryptsvc operational status.'
  },
  {
    id: 'chk-winsxs',
    name: 'Component Store (WinSxS) Integrity',
    category: 'System Files',
    status: 'pending',
    metric: 'DISM Health',
    details: 'Scanning for package corruption or missing side-by-side manifests.'
  },
  {
    id: 'chk-storage',
    name: 'Primary Storage Volume (C:) SMART Status',
    category: 'Hardware & Storage',
    status: 'pending',
    metric: '99% Life Left',
    details: 'Testing NVMe wear level, bad sectors, and NTFS journal consistency.'
  },
  {
    id: 'chk-ram',
    name: 'Physical RAM & Pagefile Allocation',
    category: 'Memory',
    status: 'pending',
    metric: '31.8 GB Avail',
    details: 'Checking kernel pool allocations, non-paged pool limit, and commit charge.'
  },
  {
    id: 'chk-security',
    name: 'Microsoft Defender & Core Isolation (HVCI)',
    category: 'Security',
    status: 'pending',
    metric: 'Signatures v1.421',
    details: 'Confirming hypervisor-protected code integrity and antimalware definitions.'
  }
];

export const SystemHealthScan: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeCheckIndex, setActiveCheckIndex] = useState<number>(-1);
  const [checks, setChecks] = useState<DiagnosticCheckItem[]>(INITIAL_CHECKS);
  const [scanCompleted, setScanCompleted] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<string[]>([
    'System Diagnostic Utility initialized.',
    'Ready to analyze Windows subsystems, storage health, and driver status.'
  ]);
  const [appliedFixes, setAppliedFixes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && activeCheckIndex < checks.length) {
      timer = setTimeout(() => {
        // Mark previous as completed
        setChecks((prev) => {
          const updated = [...prev];
          if (activeCheckIndex >= 0 && activeCheckIndex < updated.length) {
            // make the 2nd check (Component Store) give a simulated mild warning so user can test the fix action
            if (updated[activeCheckIndex].id === 'chk-winsxs') {
              updated[activeCheckIndex].status = 'warning';
              updated[activeCheckIndex].details = '1 orphaned manifest detected in staging cache. Quick cleanup recommended.';
              updated[activeCheckIndex].recommendation = 'Execute DISM StartComponentCleanup';
            } else {
              updated[activeCheckIndex].status = 'passed';
            }
          }
          if (activeCheckIndex + 1 < updated.length) {
            updated[activeCheckIndex + 1].status = 'running';
          }
          return updated;
        });

        const currentName = checks[activeCheckIndex]?.name || 'Subsystem';
        setLogMessages((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Verified ${currentName} -> PASSED`
        ]);

        const nextIndex = activeCheckIndex + 1;
        setActiveCheckIndex(nextIndex);
        setProgress(Math.round((nextIndex / checks.length) * 100));

        if (nextIndex >= checks.length) {
          setIsRunning(false);
          setScanCompleted(true);
          setLogMessages((prev) => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] Complete system health diagnostics finished successfully. (5/5 items assessed)`
          ]);
        }
      }, 750);
    }
    return () => clearTimeout(timer);
  }, [isRunning, activeCheckIndex, checks.length]);

  const handleStartScan = () => {
    setIsRunning(true);
    setScanCompleted(false);
    setProgress(0);
    setActiveCheckIndex(0);
    setAppliedFixes({});
    setChecks(INITIAL_CHECKS.map((c, i) => ({ ...c, status: i === 0 ? 'running' : 'pending' })));
    setLogMessages([
      `[${new Date().toLocaleTimeString()}] Starting comprehensive hardware & OS diagnostics...`,
      `[${new Date().toLocaleTimeString()}] Connecting to Windows Management Instrumentation (WMI)...`
    ]);
  };

  const handleApplyFix = (checkId: string) => {
    setAppliedFixes((prev) => ({ ...prev, [checkId]: true }));
    setChecks((prev) =>
      prev.map((c) =>
        c.id === checkId
          ? {
              ...c,
              status: 'passed',
              details: 'Resolved: DISM component cleanup executed. Manifest store is optimal.',
              recommendation: undefined
            }
          : c
      )
    );
    setLogMessages((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Automated remediation applied for ${checkId}. Component store is 100% clean.`
    ]);
  };

  const handleExportLog = () => {
    const textContent = `========================================================
WINDOWS SYSTEM HEALTH & DIAGNOSTIC REPORT
Generated: ${new Date().toISOString()}
Target: Windows 11 Build 26100.1882 (24H2)
Host Architecture: x64 / ARM64 Compatible
========================================================

DIAGNOSTIC SUBSYSTEM AUDIT:
${checks
  .map(
    (c) =>
      `[${c.status.toUpperCase()}] ${c.name}\n  Category: ${c.category}\n  Metric: ${c.metric}\n  Details: ${c.details}\n`
  )
  .join('\n')}

DIAGNOSTIC LOG STREAM:
${logMessages.join('\n')}

========================================================
Microsoft Support Diagnostic Engine · Internal Case Reference
========================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Windows_Diagnostic_Log_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-semibold text-[#0067b8] uppercase tracking-wider">
              Diagnostic Health Suite
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Windows System Health & Integrity Scan
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Verify the state of your Windows installation without restarting. Tests DISM component store, background services, NVMe storage integrity, and security signatures.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleStartScan}
              disabled={isRunning}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all ${
                isRunning
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-[#0067b8] hover:bg-[#005a9e] text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Scanning ({progress}%)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{scanCompleted ? 'Run Scan Again' : 'Start Diagnostic Scan'}</span>
                </>
              )}
            </button>

            {scanCompleted && (
              <button
                onClick={handleExportLog}
                className="px-4 py-2.5 text-sm font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="mt-6">
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5 font-mono">
              <span>Running automated health checks...</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#0067b8] h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Subsystem Test Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Subsystem Health Status
          </div>

          {checks.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">
                  {item.status === 'passed' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  {item.status === 'warning' && (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  )}
                  {item.status === 'running' && (
                    <RotateCw className="w-5 h-5 text-[#0067b8] animate-spin" />
                  )}
                  {item.status === 'pending' && (
                    <div className="w-5 h-5 rounded-full border border-slate-300" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-400 font-mono">· {item.category}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 tabular-nums">
                  {item.metric}
                </span>

                {item.status === 'warning' && (
                  <button
                    onClick={() => handleApplyFix(item.id)}
                    className="text-xs font-semibold text-[#0067b8] hover:underline flex items-center gap-1"
                  >
                    <Wrench className="w-3 h-3" /> Auto-Fix
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Live Terminal Diagnostic Log */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg text-slate-200 font-mono text-xs flex flex-col h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">Diagnostic Console Stream</span>
            </div>
            <span className="text-[11px] text-slate-500">Live Telemetry</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
            {logMessages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.includes('PASSED')
                    ? 'text-emerald-400'
                    : msg.includes('Warning') || msg.includes('orphaned')
                    ? 'text-amber-400'
                    : 'text-slate-300'
                }
              >
                {msg}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Status: {isRunning ? 'Active Scan' : scanCompleted ? 'Analysis Ready' : 'Idle'}</span>
            <span className="tabular-nums">5 Subsystems Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
