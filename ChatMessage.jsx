import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  User,
  Sparkles,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export default function ChatMessage({
  message,
  isLast,
  isLoading,
  onRegenerate,
  onToast,
}) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    if (onToast) onToast('Response copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      if (onToast) onToast('Speech synthesis not supported in this browser', 'info');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner audio
    const cleanText = message.content.replace(/[#*`_~$\\[\\]]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end w-full my-4 px-4 max-w-4xl mx-auto animate-fade-in">
        <div className="flex items-start gap-3 max-w-[85%] md:max-w-[75%] flex-row-reverse">
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <User className="w-4 h-4" />
          </div>

          <div className="flex flex-col items-end">
            {/* Attached file tag if any */}
            {message.fileData && (
              <div className="mb-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-900/40 border border-purple-500/20 text-purple-200 text-xs">
                {message.fileData.isImage ? (
                  <ImageIcon className="w-3.5 h-3.5 text-purple-300" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-purple-300" />
                )}
                <span>{message.fileData.name}</span>
              </div>
            )}

            {/* User message bubble */}
            <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-gradient-to-br from-purple-900/60 via-[#1e1346] to-[#120b33] border border-purple-500/30 text-slate-100 text-[15px] leading-relaxed shadow-md backdrop-blur-md">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>

            <span className="text-[10px] text-slate-400 mt-1 mr-1">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Assistant Message Layout
  return (
    <div className="flex justify-start w-full my-4 px-4 max-w-4xl mx-auto animate-fade-in group">
      <div className="flex items-start gap-3.5 w-full">
        {/* Nexa AI Avatar */}
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-purple-400 via-fuchsia-500 to-indigo-500 shrink-0 shadow-glow-sm">
          <div className="w-full h-full rounded-full bg-[#0a0a1a] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-white">Nexa AI</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 font-medium">
              Assistant
            </span>
            <span className="text-[10px] text-slate-400">
              {formatTime(message.timestamp)}
            </span>
          </div>

          {/* AI Response Card */}
          <div className="p-4 md:p-5 rounded-2xl rounded-tl-sm glass-card bg-[#0d0f26]/80 border border-purple-500/15 shadow-sm text-slate-100">
            {message.content ? (
              <MarkdownRenderer
                content={message.content}
                isTyping={isLoading && isLast}
              />
            ) : (
              <div className="flex items-center gap-2 text-purple-300 py-1">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 ml-1">Nexa is thinking...</span>
              </div>
            )}
          </div>

          {/* Assistant Action Bar */}
          {!isLoading && message.content && (
            <div className="flex items-center gap-1 mt-2 text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs hover:text-white hover:bg-purple-600/15 transition-colors"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Regenerate Button (on last message) */}
              {isLast && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs hover:text-white hover:bg-purple-600/15 transition-colors"
                  title="Regenerate response"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              )}

              {/* Text-to-Speech Read Aloud */}
              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  isSpeaking
                    ? 'text-purple-300 bg-purple-600/20'
                    : 'hover:text-white hover:bg-purple-600/15'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Thumbs up */}
              <button
                onClick={() => {
                  setLiked(liked === 'up' ? null : 'up');
                  if (onToast) onToast('Thank you for your feedback!', 'success');
                }}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  liked === 'up'
                    ? 'text-emerald-400 bg-emerald-500/15'
                    : 'hover:text-white hover:bg-purple-600/15'
                }`}
                title="Good response"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>

              {/* Thumbs down */}
              <button
                onClick={() => {
                  setLiked(liked === 'down' ? null : 'down');
                  if (onToast) onToast('Feedback noted. We will improve!', 'info');
                }}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  liked === 'down'
                    ? 'text-rose-400 bg-rose-500/15'
                    : 'hover:text-white hover:bg-purple-600/15'
                }`}
                title="Poor response"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
