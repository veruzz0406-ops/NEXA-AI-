import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MessageSquare, ArrowRight, Calendar } from 'lucide-react';

export default function SearchModal({
  isOpen,
  onClose,
  chats,
  onSelectChat,
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredChats = chats.filter((chat) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const titleMatch = chat.title.toLowerCase().includes(q);
    const messageMatch = chat.messages?.some((m) =>
      m.content?.toLowerCase().includes(q)
    );
    return titleMatch || messageMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl glass-panel bg-[#0c0e24] border border-purple-500/30 shadow-2xl overflow-hidden text-slate-100">
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-purple-500/20 bg-[#10122e]">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversation titles or messages..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredChats.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No conversations found matching "{query}"
            </div>
          ) : (
            filteredChats.map((chat) => {
              const previewMessage = chat.messages?.[chat.messages.length - 1]?.content || 'Empty conversation';
              const date = new Date(chat.updatedAt).toLocaleDateString();

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat.id);
                    onClose();
                  }}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-purple-600/15 cursor-pointer transition-all border border-transparent hover:border-purple-500/20"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1 pr-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-white group-hover:text-purple-200 truncate">
                        {chat.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate line-clamp-1 mt-0.5">
                        {previewMessage.replace(/[#*`]/g, '')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {date}
                    </span>
                    <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#080917]/80 border-t border-purple-500/10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{filteredChats.length} conversation{filteredChats.length === 1 ? '' : 's'}</span>
          <span>Click any item to open</span>
        </div>
      </div>
    </div>
  );
}
