import React, { useState } from 'react';
import { 
  BookOpen, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Eye, 
  ArrowRight, 
  Terminal, 
  Check, 
  Copy, 
  AlertCircle, 
  X,
  FileText 
} from 'lucide-react';
import { KNOWLEDGE_ARTICLES } from '../data/supportData';
import { KnowledgeArticle } from '../types/support';

interface KnowledgeBaseProps {
  initialArticleId?: string;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ initialArticleId }) => {
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(
    initialArticleId ? KNOWLEDGE_ARTICLES.find((a) => a.id === initialArticleId) || null : null
  );
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'yes' | 'no'>>({});
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const handleFeedback = (articleId: string, type: 'yes' | 'no') => {
    setFeedbackGiven((prev) => ({ ...prev, [articleId]: type }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <div className="text-xs font-semibold text-[#0067b8] uppercase tracking-wider">
          Official Documentation
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Windows Self-Service Knowledge Base
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Comprehensive step-by-step guides written and reviewed by Microsoft Windows engineers. Learn recovery methods, partition setups, and update configurations.
        </p>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {KNOWLEDGE_ARTICLES.map((art) => (
          <div
            key={art.id}
            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
          >
            <div>
              {/* Unboxed metadata with typographic separators */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span>{art.readingTime}</span>
                <span aria-hidden="true">·</span>
                <span>{art.lastUpdated}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{art.views.toLocaleString()} views</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {art.title}
              </h3>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                {art.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(art)}
                className="text-xs font-semibold text-[#0067b8] hover:text-[#005a9e] flex items-center gap-1.5 transition-colors"
              >
                <span>Read Complete Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{art.helpfulCount} people found this helpful</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>{selectedArticle.readingTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedArticle.lastUpdated}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
              <p className="text-base text-slate-800 font-medium">
                {selectedArticle.excerpt}
              </p>

              {selectedArticle.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-base font-bold text-slate-900">
                    {sec.heading}
                  </h4>
                  <p>{sec.content}</p>

                  {sec.callout && (
                    <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-blue-900 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-[#0067b8] mt-0.5 shrink-0" />
                      <span>{sec.callout}</span>
                    </div>
                  )}

                  {sec.terminalSnippet && (
                    <div className="rounded-lg bg-slate-900 text-slate-100 p-3.5 border border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span className="font-mono text-slate-300">PowerShell (Elevated)</span>
                        <button
                          onClick={() => handleCopy(sec.terminalSnippet!)}
                          className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                        >
                          {copiedSnippet ? (
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
                      <div className="font-mono text-xs text-emerald-400 select-all overflow-x-auto whitespace-pre">
                        {sec.terminalSnippet}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Feedback Section */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-700">
                  Was this information helpful?
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedback(selectedArticle.id, 'yes')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      feedbackGiven[selectedArticle.id] === 'yes'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Yes ({selectedArticle.helpfulCount + (feedbackGiven[selectedArticle.id] === 'yes' ? 1 : 0)})</span>
                  </button>

                  <button
                    onClick={() => handleFeedback(selectedArticle.id, 'no')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      feedbackGiven[selectedArticle.id] === 'no'
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>No</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
