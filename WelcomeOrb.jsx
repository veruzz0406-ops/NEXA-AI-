import React from 'react';
import { Sparkles } from 'lucide-react';

export default function WelcomeOrb() {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto px-4 pt-4 pb-2 animate-fade-in">
      {/* Glowing AI Orb Visual Container */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Deep ambient back-glow */}
        <div className="absolute w-52 h-52 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-purple-700/40 via-violet-600/30 to-fuchsia-600/20 blur-3xl animate-pulse-slow pointer-events-none" />

        {/* Outer orbital rings with rotating animation */}
        <div className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full border border-purple-500/25 border-dashed animate-spin-slow pointer-events-none" />
        <div className="absolute w-48 h-48 md:w-60 md:h-60 rounded-full border border-violet-400/15 border-t-purple-400/60 animate-spin-reverse-slow pointer-events-none" />

        {/* Center Glowing Orb Body */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full p-[2px] bg-gradient-to-b from-purple-400 via-violet-600 to-indigo-800 shadow-glow-purple animate-orb-float">
          <div className="w-full h-full rounded-full overflow-hidden relative flex items-center justify-center bg-gradient-to-tr from-[#0b071e] via-[#1a0f3d] to-[#2c135f]">
            {/* Inner dynamic radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(233,213,255,0.7)_0%,rgba(168,85,247,0.4)_40%,transparent_70%)] animate-pulse" />

            {/* Futuristic geometric Nexa core emblem */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(233,213,255,0.9)]">
                  <defs>
                    <linearGradient id="orbCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="40%" stopColor="#d8b4fe" />
                      <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                  {/* Outer hexagon / diamond shield */}
                  <polygon
                    points="50,12 85,31 85,69 50,88 15,69 15,31"
                    fill="none"
                    stroke="url(#orbCoreGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                  {/* Inner dynamic pulse nucleus */}
                  <circle cx="50" cy="50" r="14" fill="url(#orbCoreGrad)" />
                  <circle cx="46" cy="46" r="4" fill="#ffffff" opacity="0.9" />
                </svg>
              </div>
            </div>

            {/* Orbiting Starlight Sparkles */}
            <div className="absolute top-3 right-5 w-1.5 h-1.5 rounded-full bg-purple-200 animate-ping" />
            <div className="absolute bottom-5 left-4 w-1 h-1 rounded-full bg-pink-300 animate-pulse" />
          </div>
        </div>

        {/* Mini status pill below orb */}
        <div className="absolute -bottom-3 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#12132a]/90 border border-purple-500/30 text-[11px] font-medium text-purple-200 backdrop-blur-md shadow-glow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Nexa Neural Core Active</span>
        </div>
      </div>

      {/* Main Headings */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          <span className="text-white">Hello, I'm </span>
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(192,132,252,0.4)]">
            Nexa AI.
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-300 font-normal max-w-xl mx-auto">
          Your ideas, questions and curiosity start here.
        </p>

        <p className="text-sm md:text-base font-medium text-purple-300/90 pt-1 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>How can I help you today?</span>
        </p>
      </div>
    </div>
  );
}
