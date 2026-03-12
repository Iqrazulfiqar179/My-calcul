import React, { useState, useEffect, useRef } from 'react';
import * as math from 'mathjs';
import { 
  Calculator, 
  Sparkles, 
  History, 
  Delete, 
  RotateCcw, 
  ChevronRight, 
  Send,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { askMathAI } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiResponse]);

  const handleButtonClick = (value: string) => {
    setError(null);
    if (value === '=') {
      calculate();
    } else if (value === 'C') {
      setDisplay('');
      setResult(null);
    } else if (value === 'DEL') {
      setDisplay(prev => prev.slice(0, -1));
    } else {
      setDisplay(prev => prev + value);
    }
  };

  const calculate = () => {
    try {
      if (!display) return;
      const evaluated = math.evaluate(display);
      const resString = evaluated.toString();
      setResult(resString);
      setHistory(prev => [display + ' = ' + resString, ...prev].slice(0, 10));
    } catch (err) {
      setError('Invalid Expression');
    }
  };

  const handleAiSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!aiInput.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);
    
    const context = display ? `Current expression: ${display}${result ? `, Result: ${result}` : ''}` : undefined;
    const response = await askMathAI(aiInput, context);
    
    setAiResponse(response);
    setIsAiLoading(false);
    setAiInput('');
  };

  const buttons = [
    { label: 'sin', type: 'sci', value: 'sin(' },
    { label: 'cos', type: 'sci', value: 'cos(' },
    { label: 'tan', type: 'sci', value: 'tan(' },
    { label: 'log', type: 'sci', value: 'log10(' },
    { label: 'ln', type: 'sci', value: 'log(' },
    { label: '√', type: 'sci', value: 'sqrt(' },
    { label: '^', type: 'sci', value: '^' },
    { label: 'π', type: 'sci', value: 'PI' },
    { label: '(', type: 'sci', value: '(' },
    { label: ')', type: 'sci', value: ')' },
    { label: '7', type: 'num', value: '7' },
    { label: '8', type: 'num', value: '8' },
    { label: '9', type: 'num', value: '9' },
    { label: 'DEL', type: 'clear', value: 'DEL' },
    { label: 'C', type: 'clear', value: 'C' },
    { label: '4', type: 'num', value: '4' },
    { label: '5', type: 'num', value: '5' },
    { label: '6', type: 'num', value: '6' },
    { label: '×', type: 'op', value: '*' },
    { label: '÷', type: 'op', value: '/' },
    { label: '1', type: 'num', value: '1' },
    { label: '2', type: 'num', value: '2' },
    { label: '3', type: 'num', value: '3' },
    { label: '+', type: 'op', value: '+' },
    { label: '-', type: 'op', value: '-' },
    { label: '0', type: 'num', value: '0' },
    { label: '.', type: 'num', value: '.' },
    { label: 'e', type: 'sci', value: 'e' },
    { label: '%', type: 'op', value: '%' },
    { label: '=', type: 'action', value: '=' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-zinc-950 selection:bg-indigo-500/30">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Calculator */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Scientific AI</h1>
            </div>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-100"
            >
              <History className="w-5 h-5" />
            </button>
          </div>

          <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6 shadow-2xl">
            {/* Display */}
            <div className="bg-zinc-950/50 rounded-2xl p-6 flex flex-col items-end justify-center min-h-[140px] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-50" />
              <div className="text-zinc-500 font-mono text-sm mb-1 h-5 overflow-hidden text-right w-full">
                {error ? <span className="text-rose-500">{error}</span> : display}
              </div>
              <div className="text-4xl md:text-5xl font-mono font-medium tracking-tighter text-white truncate w-full text-right">
                {result || display || '0'}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-5 gap-3">
              {buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleButtonClick(btn.value)}
                  className={cn(
                    "calc-btn h-14 md:h-16 text-lg",
                    btn.type === 'num' && "calc-btn-num",
                    btn.type === 'op' && "calc-btn-op",
                    btn.type === 'sci' && "calc-btn-sci",
                    btn.type === 'action' && "calc-btn-action",
                    btn.type === 'clear' && "calc-btn-clear",
                    btn.label === '=' && "col-span-1"
                  )}
                >
                  {btn.label === 'DEL' ? <Delete className="w-5 h-5" /> : btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: AI Assistant */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">AI Assistant</h2>
          </div>

          <div className="glass-panel rounded-3xl flex flex-col h-[600px] shadow-2xl overflow-hidden">
            {/* AI Chat History */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
            >
              {!aiResponse && !isAiLoading && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Info className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-medium">Ask me anything about math</p>
                    <p className="text-sm">"How do I solve quadratic equations?"</p>
                    <p className="text-sm">"Explain the Pythagorean theorem"</p>
                  </div>
                </div>
              )}

              {aiResponse && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-800/50 rounded-2xl p-4 text-sm leading-relaxed text-zinc-200 border border-white/5"
                >
                  <div className="prose prose-invert max-w-none">
                    {aiResponse.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">{line}</p>
                    ))}
                  </div>
                </motion.div>
              )}

              {isAiLoading && (
                <div className="flex items-center gap-3 text-zinc-400">
                  <div className="flex gap-1">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-2 h-2 rounded-full bg-indigo-500" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-indigo-500" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-2 h-2 rounded-full bg-indigo-500" 
                    />
                  </div>
                  <span className="text-xs font-medium uppercase tracking-widest">AI is thinking...</span>
                </div>
              )}
            </div>

            {/* AI Input */}
            <div className="p-4 bg-zinc-950/30 border-t border-white/5">
              <form onSubmit={handleAiSubmit} className="relative">
                <input 
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask a math question..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
                <button 
                  type="submit"
                  disabled={isAiLoading || !aiInput.trim()}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl transition-all flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* History Overlay */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel w-full max-w-md rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-400" />
                  Calculation History
                </h3>
                <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-zinc-800 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 max-h-[400px] overflow-y-auto space-y-3">
                {history.length === 0 ? (
                  <p className="text-center text-zinc-500 py-8">No history yet</p>
                ) : (
                  history.map((item, i) => (
                    <div 
                      key={i} 
                      className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 font-mono text-sm flex items-center justify-between group cursor-pointer hover:bg-zinc-800 transition-colors"
                      onClick={() => {
                        const [expr] = item.split(' = ');
                        setDisplay(expr);
                        setResult(null);
                        setShowHistory(false);
                      }}
                    >
                      <span className="truncate flex-1">{item}</span>
                      <RotateCcw className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 bg-zinc-900/30 text-center">
                <button 
                  onClick={() => setHistory([])}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium uppercase tracking-widest"
                >
                  Clear All History
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="mt-8 text-zinc-600 text-xs flex items-center gap-4">
        <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Powered by mathjs</span>
        <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3" /> AI by Gemini</span>
      </div>
    </div>
  );
}

