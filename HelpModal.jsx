import React from 'react';
import {
  X,
  HelpCircle,
  Command,
  Sparkles,
  ShieldCheck,
  Zap,
  ExternalLink,
} from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel bg-[#0d0f24] border border-purple-500/25 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Help & Shortcuts</h2>
              <p className="text-xs text-slate-400">NEXA AI Documentation & Quick Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 py-4 text-sm">
          {/* Overview */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs leading-relaxed text-purple-200">
            <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Welcome to NEXA AI
            </p>
            NEXA AI is a state-of-the-art conversational AI system created with a futuristic purple aesthetic, glassmorphism, responsive navigation, and real-time streaming AI generation backed by Express and Google Gemini.
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Command className="w-3.5 h-3.5" />
              <span>Keyboard Shortcuts</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131533] border border-purple-500/10 text-xs">
                <span className="text-slate-300">Send prompt</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-purple-200">
                  Enter
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131533] border border-purple-500/10 text-xs">
                <span className="text-slate-300">New line in input</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-purple-200">
                  Shift + Enter
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131533] border border-purple-500/10 text-xs">
                <span className="text-slate-300">Quick search conversations</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-purple-200">
                  Ctrl + K
                </kbd>
              </div>
            </div>
          </div>

          {/* Key Capabilities */}
          <div>
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Features & Tools</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 list-disc pl-4 marker:text-purple-400">
              <li><strong>Real-Time SSE Streaming:</strong> Watch tokens stream character by character.</li>
              <li><strong>Voice Speech-to-Text:</strong> Click the microphone icon to dictate queries hands-free.</li>
              <li><strong>Read Aloud (TTS):</strong> Listen to any response by clicking the audio speaker button.</li>
              <li><strong>Code Highlighting:</strong> One-click copy for all multi-language code snippets.</li>
              <li><strong>Offline Fallback:</strong> Fully interactive even without an external API key.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-purple-500/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-glow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
