import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Terminal } from 'lucide-react';

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-purple-500/20 bg-[#0b0c1b] shadow-lg group">
      <div className="flex items-center justify-between px-4 py-2 bg-[#121326] border-b border-purple-500/15 text-xs text-purple-300 font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-purple-400" />
          <span>{language || 'code'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-[13.5px] font-mono leading-relaxed text-purple-100 bg-[#090a18]/90">
        <pre className="!bg-transparent !p-0 !m-0">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}

export default function MarkdownRenderer({ content, isTyping = false }) {
  return (
    <div className={`prose prose-invert max-w-none text-slate-200 leading-relaxed text-[15px] space-y-3 ${isTyping ? 'typing-cursor' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl md:text-2xl font-bold text-white mt-4 mb-2 pb-1 border-b border-purple-500/20" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg md:text-xl font-bold text-purple-100 mt-4 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base md:text-lg font-semibold text-purple-200 mt-3 mb-1.5" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-sm md:text-base font-semibold text-purple-300 mt-2 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-2 leading-relaxed text-slate-200 dark:text-slate-200" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 my-2 space-y-1 marker:text-purple-400" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1 marker:text-purple-400" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="pl-1" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-purple-500/70 bg-purple-500/5 px-4 py-2 rounded-r-lg my-3 italic text-purple-200" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-purple-500/20 bg-[#0d0e21]">
              <table className="w-full text-left text-sm border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border-b border-purple-500/30 bg-purple-900/30 px-4 py-2.5 font-semibold text-purple-200 text-xs uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border-b border-purple-500/10 px-4 py-2.5 text-slate-300 text-sm" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-purple-400 hover:text-purple-300 underline underline-offset-4 decoration-purple-500/40 hover:decoration-purple-400 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');

            if (!inline && (match || value.includes('\n'))) {
              return (
                <CodeBlock
                  language={match ? match[1] : ''}
                  value={value}
                />
              );
            }

            return (
              <code className="px-1.5 py-0.5 rounded-md bg-purple-950/60 text-purple-200 border border-purple-500/20 text-[13px] font-mono" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
