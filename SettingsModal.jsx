import React, { useState } from 'react';
import {
  X,
  Key,
  Sliders,
  Cpu,
  Trash2,
  ExternalLink,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  apiKey,
  onSaveApiKey,
  model,
  onChangeModel,
  temperature,
  onChangeTemperature,
  systemInstruction,
  onChangeSystemInstruction,
  onClearAllChats,
  onToast,
}) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(keyInput.trim());
    if (onToast) onToast('Settings saved successfully!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel bg-[#0d0f24] border border-purple-500/25 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-500/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Nexa AI Settings</h2>
              <p className="text-xs text-slate-400">Configure models, keys & appearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form Body */}
        <div className="space-y-5 py-5 text-sm">
          {/* Appearance / Theme */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/15">
            <div>
              <span className="font-semibold text-slate-200">Theme Mode</span>
              <p className="text-xs text-slate-400">Toggle between Dark and Light mode</p>
            </div>
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-medium transition-all"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-purple-300" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Google Gemini API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200 flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <span>Google Gemini API Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 underline underline-offset-2"
              >
                <span>Get free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy... (leave blank for offline demo mode)"
                className="w-full bg-[#131533] border border-purple-500/25 rounded-xl px-3.5 py-2.5 text-xs font-mono text-purple-200 placeholder-slate-500 outline-none focus:border-purple-400 focus:shadow-glow-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Keys are kept secure and can also be configured in the backend <code className="text-purple-300">server/.env</code> file.
            </p>
          </div>

          {/* Gemini Model Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>AI Engine / Model</span>
            </label>
            <select
              value={model}
              onChange={(e) => onChangeModel(e.target.value)}
              className="w-full bg-[#131533] border border-purple-500/25 rounded-xl px-3.5 py-2.5 text-xs text-purple-100 outline-none focus:border-purple-400 cursor-pointer"
            >
              <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Fastest, Recommended)</option>
              <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep Reasoning)</option>
              <option value="gemini-2.0-flash">Google Gemini 2.0 Flash</option>
            </select>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-200">
                Creativity / Temperature: <span className="text-purple-300 font-mono">{temperature}</span>
              </label>
              <span className="text-slate-400">
                {temperature < 0.4 ? 'Precise' : temperature > 0.7 ? 'Creative' : 'Balanced'}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => onChangeTemperature(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Custom Persona / System Instruction */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200 text-xs">
              System Instruction / Persona
            </label>
            <textarea
              rows={2}
              value={systemInstruction}
              onChange={(e) => onChangeSystemInstruction(e.target.value)}
              placeholder="You are Nexa AI, a brilliant and precise AI assistant..."
              className="w-full bg-[#131533] border border-purple-500/25 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-purple-400 resize-none"
            />
          </div>

          {/* Clear History Danger Zone */}
          <div className="pt-2 border-t border-purple-500/15">
            {confirmClear ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 animate-fade-in">
                <span className="text-xs text-rose-300 font-medium">Delete all chat history?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClearAllChats();
                      setConfirmClear(false);
                      if (onToast) onToast('All chats deleted', 'info');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Chat History</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-500/15">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-sm transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}
