import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Sparkles,
  ChevronDown,
  Trash2,
  Share2,
  ArrowDown,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import Sidebar from './components/Sidebar';
import WelcomeOrb from './components/WelcomeOrb';
import SuggestionCards from './components/SuggestionCards';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import SettingsModal from './components/SettingsModal';
import SearchModal from './components/SearchModal';
import HelpModal from './components/HelpModal';
import Toast from './components/Toast';

import {
  fetchChats,
  createChat,
  updateChat,
  deleteChat,
  toggleStarChat,
  clearAllChats,
  streamChatCompletion,
} from './services/api';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nexa_theme') || 'dark';
  });

  // Settings states
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('nexa_gemini_api_key') || '';
  });
  const [model, setModel] = useState(() => {
    return localStorage.getItem('nexa_model') || 'gemini-1.5-flash';
  });
  const [temperature, setTemperature] = useState(() => {
    return parseFloat(localStorage.getItem('nexa_temp')) || 0.7;
  });
  const [systemInstruction, setSystemInstruction] = useState(() => {
    return (
      localStorage.getItem('nexa_system_prompt') ||
      'You are NEXA AI, an advanced conversational intelligence assistant. Deliver articulate, accurate, and beautifully structured responses with markdown formatting.'
    );
  });

  // Chats state
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Scroll & stream management
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const abortControllerRef = useRef(null);

  // Apply theme to HTML tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('nexa_theme', theme);
  }, [theme]);

  // Load chats on initial mount
  useEffect(() => {
    async function loadInitial() {
      try {
        const fetched = await fetchChats();
        if (fetched && fetched.length > 0) {
          setChats(fetched);
        }
      } catch (e) {
        console.warn('Initial chats fetch failed:', e);
      }
    }
    loadInitial();
  }, []);

  // Keyboard shortcut listener (Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsSearchOpen(false);
        setIsHelpOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show toast notification helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type, duration: 3000 });
  };

  // Scroll tracking
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollBottom(isUp);
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  // Current active chat object
  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // New Chat handler
  const handleNewChat = () => {
    setActiveChatId(null);
    setInput('');
    setIsLoading(false);
  };

  // Send message handler (streaming)
  const handleSendMessage = async ({ text, file }) => {
    if (!text && !file) return;

    let targetChatId = activeChatId;
    let currentChats = [...chats];

    // If on home screen, create new chat first
    if (!targetChatId) {
      const generatedTitle = text.slice(0, 36) + (text.length > 36 ? '...' : '');
      const newChatObj = {
        id: `chat-${Date.now()}`,
        title: generatedTitle || 'New Conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        starred: false,
        messages: [],
      };
      targetChatId = newChatObj.id;
      currentChats.unshift(newChatObj);
      setChats(currentChats);
      setActiveChatId(targetChatId);

      try {
        await createChat(newChatObj);
      } catch (e) {
        console.warn('Backend sync create warning:', e);
      }
    }

    // Prepare user message
    const userMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: text,
      fileData: file || null,
      timestamp: new Date().toISOString(),
    };

    // Prepare placeholder assistant message
    const assistantMessageId = `msg-${Date.now() + 1}-a`;
    const initialAssistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    // Update state with user message + empty assistant message
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === targetChatId) {
          return {
            ...c,
            updatedAt: new Date().toISOString(),
            messages: [...c.messages, userMessage, initialAssistantMessage],
          };
        }
        return c;
      })
    );

    setIsLoading(true);
    setTimeout(() => scrollToBottom(true), 50);

    // Stream response from server
    const targetChat = currentChats.find((c) => c.id === targetChatId);
    const historyMessages = [...(targetChat?.messages || []), userMessage];

    try {
      await streamChatCompletion({
        chatId: targetChatId,
        messages: historyMessages,
        apiKey,
        model,
        temperature,
        systemInstruction,
        onChunk: (chunk, fullText) => {
          setChats((prev) =>
            prev.map((c) => {
              if (c.id === targetChatId) {
                const updatedMsgs = c.messages.map((m) =>
                  m.id === assistantMessageId ? { ...m, content: fullText } : m
                );
                return { ...c, messages: updatedMsgs };
              }
              return c;
            })
          );
          scrollToBottom(false);
        },
        onDone: (finalText) => {
          setIsLoading(false);
          setChats((prev) =>
            prev.map((c) => {
              if (c.id === targetChatId) {
                const updatedMsgs = c.messages.map((m) =>
                  m.id === assistantMessageId ? { ...m, content: finalText } : m
                );
                return { ...c, messages: updatedMsgs, updatedAt: new Date().toISOString() };
              }
              return c;
            })
          );
          scrollToBottom(true);
        },
        onError: (err) => {
          console.error('Streaming error in App:', err);
          setIsLoading(false);
          showToast(err.message || 'Error generating response', 'error');
        },
      });
    } catch (err) {
      console.error('Chat error:', err);
      setIsLoading(false);
      showToast('Network error connecting to NEXA backend', 'error');
    }
  };

  // Regenerate last response
  const handleRegenerate = () => {
    if (!activeChat || activeChat.messages.length < 2 || isLoading) return;
    const messages = [...activeChat.messages];
    const lastUserIndex = messages.findLastIndex((m) => m.role === 'user');
    if (lastUserIndex === -1) return;

    const userPrompt = messages[lastUserIndex].content;
    const userFile = messages[lastUserIndex].fileData;

    // Prune messages back to before the assistant's response
    const pruned = messages.slice(0, lastUserIndex + 1);
    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, messages: pruned } : c))
    );

    // Re-issue
    handleSendMessage({ text: userPrompt, file: userFile });
  };

  // Stop generation
  const handleStopGeneration = () => {
    setIsLoading(false);
    showToast('Generation halted', 'info');
  };

  // Chat management handlers
  const handleDeleteChat = async (id) => {
    try {
      await deleteChat(id);
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (activeChatId === id) {
        setActiveChatId(null);
      }
      showToast('Conversation deleted', 'info');
    } catch (e) {
      showToast('Failed to delete chat', 'error');
    }
  };

  const handleToggleStarChat = async (id) => {
    try {
      await toggleStarChat(id);
      setChats((prev) =>
        prev.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateChatTitle = async (id, title) => {
    try {
      await updateChat(id, { title });
      setChats((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title } : c))
      );
      showToast('Title updated', 'success');
    } catch (e) {
      showToast('Failed to update title', 'error');
    }
  };

  const handleClearAllChats = async () => {
    try {
      await clearAllChats();
      setChats([]);
      setActiveChatId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('nexa_gemini_api_key', key);
  };

  const handleChangeModel = (m) => {
    setModel(m);
    localStorage.setItem('nexa_model', m);
  };

  const handleChangeTemperature = (t) => {
    setTemperature(t);
    localStorage.setItem('nexa_temp', t.toString());
  };

  const handleChangeSystemInstruction = (s) => {
    setSystemInstruction(s);
    localStorage.setItem('nexa_system_prompt', s);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-nexa-mesh text-slate-100 transition-colors duration-300">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Elegant Left Sidebar */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => setActiveChatId(id)}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onToggleStarChat={handleToggleStarChat}
        onUpdateChatTitle={handleUpdateChatTitle}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onGoHome={() => setActiveChatId(null)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 md:ml-80 relative">
        {/* Top Navigation Bar */}
        <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 border-b border-purple-500/10 glass-panel bg-[#090a18]/70 z-30">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-purple-600/15 md:hidden"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Conversation Title / Header */}
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-sm md:text-base font-semibold text-white truncate max-w-[200px] sm:max-w-md">
                {activeChat ? activeChat.title : 'NEXA AI Hub'}
              </h2>
              {activeChat && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 text-[10px] font-medium border border-purple-500/20">
                  {model}
                </span>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {activeChat && (
              <button
                onClick={() => handleDeleteChat(activeChat.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors"
                title="Delete this conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/30 text-purple-200 text-xs font-medium transition-all shadow-sm"
              title="Start fresh conversation"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
        </header>

        {/* Dynamic Center Stage: Welcome View OR Active Chat Thread */}
        <main
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-2 md:px-6 py-4 custom-scrollbar relative"
        >
          {!activeChat || activeChat.messages.length === 0 ? (
            /* Spacious Welcome Screen */
            <div className="min-h-full flex flex-col justify-center py-6">
              <WelcomeOrb />
              <SuggestionCards
                onSelectSuggestion={(prompt) => {
                  handleSendMessage({ text: prompt, file: null });
                }}
              />
            </div>
          ) : (
            /* Active Conversational Message Stream */
            <div className="py-2 pb-16">
              {activeChat.messages.map((message, idx) => (
                <ChatMessage
                  key={message.id || idx}
                  message={message}
                  isLast={idx === activeChat.messages.length - 1}
                  isLoading={isLoading && idx === activeChat.messages.length - 1}
                  onRegenerate={handleRegenerate}
                  onToast={showToast}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Floating Scroll to Bottom Button */}
          {showScrollBottom && (
            <button
              onClick={() => scrollToBottom(true)}
              className="fixed bottom-28 right-6 md:right-10 z-20 p-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple border border-purple-400/40 transition-all transform hover:scale-110 active:scale-95"
              title="Scroll to bottom"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}
        </main>

        {/* Fixed Modern Chat Input Area */}
        <div className="w-full shrink-0 relative z-20 bg-gradient-to-t from-[#060713] via-[#060713]/90 to-transparent pt-3">
          <ChatInput
            input={input}
            setInput={setInput}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onStopGeneration={handleStopGeneration}
            selectedModel={model}
            hasApiKey={Boolean(apiKey)}
          />
        </div>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        model={model}
        onChangeModel={handleChangeModel}
        temperature={temperature}
        onChangeTemperature={handleChangeTemperature}
        systemInstruction={systemInstruction}
        onChangeSystemInstruction={handleChangeSystemInstruction}
        onClearAllChats={handleClearAllChats}
        onToast={showToast}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chats={chats}
        onSelectChat={(id) => setActiveChatId(id)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
