import React from 'react';
import { HelpCircle, PenTool, BookOpen, Code2, ArrowUpRight } from 'lucide-react';

const suggestions = [
  {
    id: 'explain',
    title: 'Explain Something',
    subtitle: 'Break down quantum superposition and how qubits operate simply',
    prompt: 'Explain quantum superposition and how qubits differ from classical bits in simple terms.',
    icon: HelpCircle,
    accent: 'from-purple-500/20 to-violet-500/10',
    iconColor: 'text-purple-400',
  },
  {
    id: 'write',
    title: 'Write Something',
    subtitle: 'Draft an engaging LinkedIn post regarding modern autonomous AI agents',
    prompt: 'Draft an engaging thought-leadership post about autonomous AI agents in software engineering.',
    icon: PenTool,
    accent: 'from-fuchsia-500/20 to-purple-500/10',
    iconColor: 'text-fuchsia-400',
  },
  {
    id: 'learn',
    title: 'Learn Something New',
    subtitle: 'Master distributed caching strategies and the thundering herd problem',
    prompt: 'Teach me the core concepts of distributed caching strategies and how to solve the thundering herd problem.',
    icon: BookOpen,
    accent: 'from-indigo-500/20 to-purple-500/10',
    iconColor: 'text-indigo-400',
  },
  {
    id: 'solve',
    title: 'Solve a Problem',
    subtitle: 'Debug an async batch queue in JavaScript with memory leak prevention',
    prompt: 'Write a robust, production-ready async batch processing function in JavaScript with bounded concurrency and error handling.',
    icon: Code2,
    accent: 'from-violet-500/20 to-pink-500/10',
    iconColor: 'text-violet-400',
  },
];

export default function SuggestionCards({ onSelectSuggestion }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8 mb-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {suggestions.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => onSelectSuggestion(card.prompt)}
              className="group relative flex flex-col text-left p-4.5 rounded-2xl glass-card bg-[#0e1025]/80 hover:bg-[#151736]/90 border border-purple-500/15 hover:border-purple-400/40 transition-all duration-300 overflow-hidden cursor-pointer shadow-sm hover:shadow-glow-sm"
            >
              {/* Subtle gradient hover wash */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <div className="relative z-10 flex items-start justify-between w-full mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-purple-500/10 border border-purple-500/25 group-hover:border-purple-400/50 group-hover:scale-105 transition-all">
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-purple-200 transition-colors">
                    {card.title}
                  </h3>
                </div>

                <div className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <p className="relative z-10 text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed transition-colors line-clamp-2">
                {card.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
