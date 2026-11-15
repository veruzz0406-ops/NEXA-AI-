import React, { useRef, useState, useEffect } from 'react';
import {
  Send,
  Square,
  Paperclip,
  X,
  Mic,
  MicOff,
  FileText,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

export default function ChatInput({
  input,
  setInput,
  onSendMessage,
  isLoading,
  onStopGeneration,
  selectedModel = 'gemini-1.5-flash',
  hasApiKey = false,
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API for voice input if supported
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [setInput]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!input.trim() && !attachedFile) || isLoading) return;
    onSendMessage({
      text: input.trim(),
      file: attachedFile,
    });
    setInput('');
    setAttachedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
        data: reader.result.split(',')[1],
        mimeType: file.type || 'application/octet-stream',
        isImage: file.type.startsWith('image/'),
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition error:', err);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 md:pb-6">
      {/* Attached File Preview Chip */}
      {attachedFile && (
        <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-200 text-xs shadow-md animate-fade-in backdrop-blur-md">
          {attachedFile.isImage ? (
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-purple-400" />
          )}
          <span className="font-medium max-w-[200px] truncate">
            {attachedFile.name}
          </span>
          <span className="text-purple-400/70 text-[11px]">
            ({attachedFile.size})
          </span>
          <button
            onClick={() => setAttachedFile(null)}
            className="p-0.5 hover:bg-white/10 rounded-md text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Input Card */}
      <div className="relative rounded-2xl md:rounded-3xl bg-[#0d0e23]/90 dark:bg-[#0d0e23]/90 border border-purple-500/25 focus-within:border-purple-400/60 transition-all duration-300 shadow-lg focus-within:shadow-glow backdrop-blur-xl p-2 md:p-3">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.txt,.pdf,.js,.jsx,.ts,.tsx,.py,.json,.md,.html,.css"
        />

        {/* Text Area */}
        <div className="flex items-start px-2 pt-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Nexa AI anything..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400/70 text-[15px] md:text-base outline-none resize-none leading-relaxed min-h-[44px] max-h-[180px] custom-scrollbar"
          />

          {/* Clear input button */}
          {input.length > 0 && (
            <button
              onClick={() => {
                setInput('');
                if (textareaRef.current) textareaRef.current.style.height = 'auto';
              }}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors ml-1 shrink-0"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Bar: Action Tools & Send Button */}
        <div className="flex items-center justify-between pt-2 px-1 border-t border-purple-500/10 mt-1">
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Attach File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-purple-600/15 border border-transparent hover:border-purple-500/20 transition-all"
              title="Attach document or image"
            >
              <Paperclip className="w-4 h-4 md:w-4.5 md:h-4.5" />
            </button>

            {/* Voice Input Button */}
            {recognitionSupported && (
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                    : 'text-slate-400 hover:text-purple-300 hover:bg-purple-600/15 border-transparent hover:border-purple-500/20'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Voice input'}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 md:w-4.5 md:h-4.5" />
                ) : (
                  <Mic className="w-4 h-4 md:w-4.5 md:h-4.5" />
                )}
              </button>
            )}

            {/* Model Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/20 text-[11px] font-mono text-purple-300">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>{selectedModel}</span>
              {hasApiKey && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Connected to Google Gemini API" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Character count on long prompts */}
            {input.length > 120 && (
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                {input.length} chars
              </span>
            )}

            {/* Glowing Purple Circular Send Button */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all transform hover:scale-105 active:scale-95"
                title="Stop generation"
              >
                <Square className="w-4 h-4 fill-white" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() && !attachedFile}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                  input.trim() || attachedFile
                    ? 'bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 text-white shadow-glow-purple hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-purple-950/40 text-slate-600 border border-purple-500/10 cursor-not-allowed'
                }`}
                title="Send message (Enter)"
              >
                <Send className="w-4 h-4 md:w-4.5 md:h-4.5 transform -translate-x-0.5 translate-y-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle footer credit / shortcut reminder */}
      <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400/80 mt-2 text-center">
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[10px]">Enter</kbd> to send</span>
        <span>•</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[10px]">Shift + Enter</kbd> for new line</span>
      </div>
    </div>
  );
}
