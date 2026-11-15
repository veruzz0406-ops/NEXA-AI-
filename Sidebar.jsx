import React, { useState } from 'react';
import {
  Plus,
  Home,
  Search,
  Bookmark,
  Settings,
  HelpCircle,
  MessageSquare,
  Trash2,
  Star,
  Edit2,
  Check,
  X,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
  PanelLeftClose,
} from 'lucide-react';

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onToggleStarChat,
  onUpdateChatTitle,
  onOpenSettings,
  onOpenSearch,
  onOpenHelp,
  onGoHome,
  theme,
  onToggleTheme,
  isOpen,
  onCloseMobile,
}) {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);

  const handleStartEdit = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = (chatId, e) => {
    e?.stopPropagation();
    if (editTitle.trim()) {
      onUpdateChatTitle(chatId, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const handleCancelEdit = (e) => {
    e?.stopPropagation();
    setEditingChatId(null);
  };

  // Filter chats if starred view is active
  const displayedChats = filterStarredOnly
    ? chats.filter((c) => c.starred)
    : chats;

  // Group chats by date (Today, Yesterday, Previous)
  const now = new Date();
  const isToday = (dateStr) => {
    const d = new Date(dateStr);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  const isYesterday = (dateStr) => {
    const d = new Date(dateStr);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return (
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear()
    );
  };

  const todayChats = displayedChats.filter((c) => isToday(c.updatedAt));
  const yesterdayChats = displayedChats.filter((c) => isYesterday(c.updatedAt));
  const olderChats = displayedChats.filter(
    (c) => !isToday(c.updatedAt) && !isYesterday(c.updatedAt)
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 md:w-80 flex flex-col bg-[#0a0b1c]/95 dark:bg-[#0a0b1c]/95 border-r border-purple-500/15 backdrop-blur-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-500/10">
          <div
            onClick={onGoHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Glowing Logo Icon */}
            <div className="w-8 h-8 rounded-xl p-[1.5px] bg-gradient-to-tr from-purple-400 via-fuchsia-500 to-indigo-600 shadow-glow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[10px] bg-[#0c0d23] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-300" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wide text-white group-hover:text-purple-200 transition-colors">
                  NEXA AI
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-semibold uppercase tracking-wider border border-purple-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-purple-400/70 font-medium">
                Next-Gen Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-600/15 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action: New Chat Button with Purple Gradient */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-glow-sm hover:shadow-glow transition-all duration-300 group transform active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Navigation Quick Links */}
        <div className="px-3 space-y-1 text-sm font-medium">
          <button
            onClick={() => {
              onGoHome();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-purple-600/10 transition-colors"
          >
            <Home className="w-4 h-4 text-purple-400" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              onOpenSearch();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-purple-600/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-purple-400" />
              <span>Search</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400 font-mono">
              Ctrl+K
            </kbd>
          </button>

          <button
            onClick={() => setFilterStarredOnly(!filterStarredOnly)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
              filterStarredOnly
                ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-purple-600/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark className={`w-4 h-4 ${filterStarredOnly ? 'text-purple-300 fill-purple-300' : 'text-purple-400'}`} />
              <span>Saved Chats</span>
            </div>
            {chats.filter((c) => c.starred).length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-[10px]">
                {chats.filter((c) => c.starred).length}
              </span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="my-3 mx-4 border-t border-purple-500/10" />

        {/* Recent Chats Section (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4 custom-scrollbar">
          <div className="flex items-center justify-between px-3 pt-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300/60">
              {filterStarredOnly ? 'Saved Conversations' : 'Recent Chats'}
            </span>
            <span className="text-[11px] text-slate-500">
              {displayedChats.length}
            </span>
          </div>

          {displayedChats.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-slate-500">
              {filterStarredOnly ? 'No saved chats yet' : 'No conversation history'}
            </div>
          ) : (
            <>
              {/* Today */}
              {todayChats.length > 0 && (
                <div className="space-y-1">
                  <div className="px-3 text-[10px] font-medium text-slate-400">
                    Today
                  </div>
                  {todayChats.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isActive={activeChatId === chat.id}
                      isEditing={editingChatId === chat.id}
                      editTitle={editTitle}
                      setEditTitle={setEditTitle}
                      onSelect={() => {
                        onSelectChat(chat.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      onToggleStar={(e) => {
                        e.stopPropagation();
                        onToggleStarChat(chat.id);
                      }}
                      onStartEdit={(e) => handleStartEdit(chat, e)}
                      onSaveEdit={(e) => handleSaveEdit(chat.id, e)}
                      onCancelEdit={handleCancelEdit}
                    />
                  ))}
                </div>
              )}

              {/* Yesterday */}
              {yesterdayChats.length > 0 && (
                <div className="space-y-1">
                  <div className="px-3 text-[10px] font-medium text-slate-400">
                    Yesterday
                  </div>
                  {yesterdayChats.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isActive={activeChatId === chat.id}
                      isEditing={editingChatId === chat.id}
                      editTitle={editTitle}
                      setEditTitle={setEditTitle}
                      onSelect={() => {
                        onSelectChat(chat.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      onToggleStar={(e) => {
                        e.stopPropagation();
                        onToggleStarChat(chat.id);
                      }}
                      onStartEdit={(e) => handleStartEdit(chat, e)}
                      onSaveEdit={(e) => handleSaveEdit(chat.id, e)}
                      onCancelEdit={handleCancelEdit}
                    />
                  ))}
                </div>
              )}

              {/* Older */}
              {olderChats.length > 0 && (
                <div className="space-y-1">
                  <div className="px-3 text-[10px] font-medium text-slate-400">
                    Previous
                  </div>
                  {olderChats.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isActive={activeChatId === chat.id}
                      isEditing={editingChatId === chat.id}
                      editTitle={editTitle}
                      setEditTitle={setEditTitle}
                      onSelect={() => {
                        onSelectChat(chat.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      onToggleStar={(e) => {
                        e.stopPropagation();
                        onToggleStarChat(chat.id);
                      }}
                      onStartEdit={(e) => handleStartEdit(chat, e)}
                      onSaveEdit={(e) => handleSaveEdit(chat.id, e)}
                      onCancelEdit={handleCancelEdit}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-purple-500/10" />

        {/* Bottom Utility Links (Settings & Help) */}
        <div className="p-3 space-y-1 text-sm font-medium">
          <button
            onClick={() => {
              onOpenSettings();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-purple-600/10 transition-colors"
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              onOpenHelp();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-purple-600/10 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>Help & Docs</span>
          </button>
        </div>

        {/* User Profile Section at Bottom */}
        <div className="p-3 border-t border-purple-500/15 bg-[#080917]/70">
          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/20 border border-purple-500/15">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                <span>N</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080917]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  College Project User
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-purple-400 font-medium">
                    Pro Access
                  </span>
                  <span className="text-[9px] text-slate-500">• Online</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-purple-600/20 transition-colors"
              title="Preferences"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function ChatItem({
  chat,
  isActive,
  isEditing,
  editTitle,
  setEditTitle,
  onSelect,
  onDelete,
  onToggleStar,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}) {
  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-purple-600/25 text-white border-l-2 border-purple-400 shadow-sm font-semibold'
          : 'text-slate-300 hover:text-white hover:bg-purple-600/10'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
        <MessageSquare
          className={`w-3.5 h-3.5 shrink-0 ${
            isActive ? 'text-purple-300' : 'text-slate-500 group-hover:text-purple-400'
          }`}
        />

        {isEditing ? (
          <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveEdit(e);
                if (e.key === 'Escape') onCancelEdit(e);
              }}
              autoFocus
              className="w-full bg-[#181938] text-white px-1.5 py-0.5 rounded border border-purple-500/50 outline-none text-xs"
            />
            <button onClick={onSaveEdit} className="p-0.5 text-emerald-400 hover:text-emerald-300">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={onCancelEdit} className="p-0.5 text-rose-400 hover:text-rose-300">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="truncate">{chat.title}</span>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Star button */}
          <button
            onClick={onToggleStar}
            className={`p-1 rounded hover:bg-white/10 transition-colors ${
              chat.starred ? 'text-amber-400 fill-amber-400 !opacity-100' : 'text-slate-400'
            }`}
            title={chat.starred ? 'Unstar' : 'Star'}
          >
            <Star className={`w-3.5 h-3.5 ${chat.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          {/* Rename button */}
          <button
            onClick={onStartEdit}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Rename"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
