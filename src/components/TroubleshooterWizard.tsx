import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  ChevronRight, 
  Terminal, 
  LifeBuoy, 
  Flame, 
  Volume2, 
  Wifi, 
  HardDrive, 
  RefreshCw 
} from 'lucide-react';
import { TROUBLESHOOT_FLOWS } from '../data/supportData';
import { TroubleshootFlow } from '../types/support';

interface TroubleshooterWizardProps {
  initialFlowId?: string;
  onEscalateToSupport: (diagnosticContext: string) => void;
}

export const TroubleshooterWizard: React.FC<TroubleshooterWizardProps> = ({
  initialFlowId = 'bsod',
  onEscalateToSupport,
}) => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(initialFlowId);
  const [currentStepId, setCurrentStepId] = useState<string>('step_1');
  const [history, setHistory] = useState<string[]>(['step_1']);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [resolvedStatus, setResolvedStatus] = useState<boolean | null>(null);

  const currentFlow = TROUBLESHOOT_FLOWS.find((f) => f.id === selectedFlowId) || TROUBLESHOOT_FLOWS[0];
  const currentStep = currentFlow.steps[currentStepId] || currentFlow.steps[currentFlow.rootStepId];

  const handleSelectFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    const flow = TROUBLESHOOT_FLOWS.find((f) => f.id === flowId);
    if (flow) {
      setCurrentStepId(flow.rootStepId);
      setHistory([flow.rootStepId]);
      setResolvedStatus(null);
    }
  };

  const handleOptionSelect = (option: {
    label: string;
    nextStepId?: string;
    resolved?: boolean;
    escalate?: boolean;
  }) => {
    if (option.resolved) {
      setResolvedStatus(true);
      return;
    }
    if (option.escalate) {
      const summaryText = `Troubleshooter: ${currentFlow.title}\nLast step reached: ${currentStep.question}\nSelected choice: ${option.label}`;
      onEscalateToSupport(summaryText);
      return;
    }
    if (option.nextStepId && currentFlow.steps[option.nextStepId]) {
      setCurrentStepId(option.nextStepId);
      setHistory((prev) => [...prev, option.nextStepId!]);
    }
  };

  const handleReset = () => {
    setCurrentStepId(currentFlow.rootStepId);
    setHistory([currentFlow.rootStepId]);
    setResolvedStatus(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Troubleshooter Header & Selector Bar */}
      <div className="border-b border-slate-200 bg-slate-50 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-semibold text-[#0067b8] uppercase tracking-wider">
              Interactive Diagnostic Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              Guided Troubleshooter
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Diagnostic</span>
          </button>
        </div>

        {/* Category switcher tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TROUBLESHOOT_FLOWS.map((flow) => {
            const isActive = flow.id === selectedFlowId;
            return (
              <button
                key={flow.id}
                onClick={() => handleSelectFlow(flow.id)}
                className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#0067b8] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {flow.id === 'bsod' && <AlertTriangle className="w-3.5 h-3.5" />}
                {flow.id === 'update' && <RefreshCw className="w-3.5 h-3.5" />}
                {flow.id === 'network' && <Wifi className="w-3.5 h-3.5" />}
                {flow.id === 'audio' && <Volume2 className="w-3.5 h-3.5" />}
                {flow.id === 'performance' && <HardDrive className="w-3.5 h-3.5" />}
                <span>{flow.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Diagnostic Body */}
      <div className="p-6 sm:p-8">
        {/* Flow Metadata & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{currentFlow.title}</span>
            <span aria-hidden="true">·</span>
            <span>Est. {currentFlow.estimatedTime}</span>
            <span aria-hidden="true">·</span>
            <span>Severity: {currentFlow.severity}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <span>Step {history.length}</span>
            <span>/</span>
            <span>{Object.keys(currentFlow.steps).length} potential paths</span>
          </div>
        </div>

        {resolvedStatus ? (
          /* Success / Resolution State */
          <div className="py-8 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Issue Marked as Resolved</h3>
            <p className="mt-2 text-sm text-slate-600">
              Great! The recommended steps corrected the problem on your Windows device. A diagnostic log entry has been cleared.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Run Another Check
              </button>
              <button
                onClick={() => onEscalateToSupport(`Resolved case via troubleshooter: ${currentFlow.title}`)}
                className="px-4 py-2 text-xs font-semibold text-[#0067b8] border border-[#0067b8]/30 hover:bg-blue-50/50 rounded-md transition-colors"
              >
                Save Diagnostic Report
              </button>
            </div>
          </div>
        ) : (
          /* Active Question & Decision Node */
          <div className="mt-6 space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0067b8] mb-1">
                Diagnostic Query
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {currentStep.question}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl">
                {currentStep.description}
              </p>
            </div>

            {/* Actionable Terminal Command Snippet (if available) */}
            {currentStep.recommendedAction && (
              <div className="rounded-lg bg-slate-900 text-slate-100 p-4 border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5 font-medium text-slate-300">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span>Recommended Command: {currentStep.recommendedAction.label}</span>
                  </div>
                  {currentStep.recommendedAction.command && (
                    <button
                      onClick={() => handleCopy(currentStep.recommendedAction!.command!)}
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
                  )}
                </div>

                {currentStep.recommendedAction.command && (
                  <div className="bg-slate-950 p-2.5 rounded font-mono text-xs sm:text-sm text-emerald-400 select-all overflow-x-auto whitespace-pre">
                    {currentStep.recommendedAction.command}
                  </div>
                )}

                <div className="mt-2 text-xs text-slate-400">
                  {currentStep.recommendedAction.details}
                </div>
              </div>
            )}

            {/* Decision Options */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Select your observation:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStep.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    className="group text-left p-4 rounded-lg border border-slate-200 hover:border-[#0067b8] hover:bg-blue-50/30 transition-all flex items-start justify-between gap-3 shadow-xs"
                  >
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-[#0067b8] transition-colors">
                      {option.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0067b8] group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Need direct escalation link */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>None of these apply or need engineer help?</span>
              <button
                onClick={() =>
                  onEscalateToSupport(
                    `Troubleshooter: ${currentFlow.title} > Step: ${currentStep.question}`
                  )
                }
                className="font-semibold text-[#0067b8] hover:underline"
              >
                Connect with Helpdesk Engineer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
