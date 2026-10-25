import React, { useState } from 'react';
import type { ComponentType } from '../types/circuit';
import { COMPONENT_TEMPLATES } from '../constants/components';
import {
  Zap,
  Sliders,
  Cpu,
  Binary,
  ToggleLeft,
  Lightbulb,
  Gauge,
  Search,
  BookOpen,
  Sparkles,
  Bot,
  Layers,
  Activity,
  Tv,
  ChevronLeft,
  Package,
} from 'lucide-react';

interface Props {
  onAddComponent: (type: ComponentType) => void;
  onLoadExample: (exampleKey: string) => void;
  onSynthesizeAi: (prompt: string) => void;
}

export const Sidebar: React.FC<Props> = ({
  onAddComponent,
  onLoadExample,
  onSynthesizeAi,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'parts' | 'starters'>('parts');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { name: 'All', icon: Zap },
    { name: 'Microcontrollers', icon: Bot },
    { name: 'Modules', icon: Layers },
    { name: 'Sensors', icon: Activity },
    { name: 'Displays', icon: Tv },
    { name: 'Power', icon: Zap },
    { name: 'Passive', icon: Sliders },
    { name: 'Semiconductors', icon: Cpu },
    { name: 'Logic Gates', icon: Binary },
    { name: 'Input', icon: ToggleLeft },
    { name: 'Output', icon: Lightbulb },
    { name: 'Instruments', icon: Gauge },
  ];

  const templates = Object.values(COMPONENT_TEMPLATES).filter((tmpl) => {
    const matchesSearch =
      tmpl.title.toLowerCase().includes(search.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(search.toLowerCase()) ||
      tmpl.type.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || tmpl.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
      {/* Sleek Compact Floating Dock (No empty full-height bar!) */}
      <div className="pointer-events-auto absolute top-4 left-4 flex flex-col items-center bg-[#070b14]/90 border border-slate-800/90 rounded-2xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.7)] backdrop-blur-md space-y-1.5 transition-all">
        <button
          onClick={() => {
            if (isOpen && activeTab === 'parts') {
              setIsOpen(false);
            } else {
              setActiveTab('parts');
              setIsOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${
            isOpen && activeTab === 'parts'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
          }`}
          title="Component Parts Library"
        >
          <Package className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1 tracking-tight">Parts</span>
        </button>

        <div className="w-7 h-px bg-slate-800/80" />

        <button
          onClick={() => {
            if (isOpen && activeTab === 'starters') {
              setIsOpen(false);
            } else {
              setActiveTab('starters');
              setIsOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${
            isOpen && activeTab === 'starters'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
          }`}
          title="Starter Circuits & Examples"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1 tracking-tight">Examples</span>
        </button>
      </div>

      {/* Slide-out Floating Drawer Panel */}
      {isOpen && (
        <aside className="pointer-events-auto absolute top-4 left-20 bottom-4 w-80 bg-[#0a0f1d]/95 border border-slate-800/90 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col z-30 animate-in slide-in-from-left-4 fade-in duration-200 overflow-hidden">
          {/* Header with Title and Close button */}
          <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
              {activeTab === 'parts' ? 'Component Library' : 'Starter Examples'}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {activeTab === 'parts' ? (
            <>
              {/* Search Bar */}
              <div className="p-3 border-b border-slate-800/80">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search parts (e.g. TB6612, ESP32, Resistor)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-medium"
                    autoFocus
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-1.5 p-2 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Component Item Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <div className="text-[10px] text-slate-500 px-1 font-mono uppercase tracking-wider flex justify-between">
                  <span>{templates.length} PARTS</span>
                  <span>CLICK TO ADD</span>
                </div>

                {templates.map((tmpl) => (
                  <div
                    key={tmpl.type}
                    onClick={() => {
                      onAddComponent(tmpl.type);
                    }}
                    className="group p-2.5 bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800/80 hover:border-cyan-500/50 rounded-xl cursor-pointer transition-all flex items-center justify-between shadow-sm"
                  >
                    <div className="pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                          {tmpl.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded font-mono">
                          {tmpl.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{tmpl.description}</div>
                    </div>
                    <button className="text-xs px-2.5 py-1 bg-slate-800/80 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-300 rounded-lg font-bold transition-all shrink-0">
                      +
                    </button>
                  </div>
                ))}

                {/* AI SYNTHESIS TRIGGER - ONLY appears when part is NOT found in search! */}
                {templates.length === 0 && search.trim().length > 0 && (
                  <div className="p-4 bg-slate-900/90 border border-cyan-500/40 rounded-2xl text-center space-y-3 m-1 shadow-lg animate-in fade-in zoom-in-95">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-cyan-400">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">No built-in part for "{search}"</div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                        Research & synthesize it automatically with AI with full pinouts
                      </div>
                    </div>
                    <button
                      onClick={() => onSynthesizeAi(search)}
                      className="w-full py-2 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Synthesize "{search}" with AI</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Starter Circuits List */
            <div className="p-3 space-y-2 flex-1 overflow-y-auto">
              <p className="text-xs text-slate-400 mb-3">Load pre-built starter schematics to test and learn:</p>
              <button
                onClick={() => {
                  onLoadExample('led_simple');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-slate-200 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-cyan-300">💡 LED &amp; Current Limiting Resistor</div>
                <div className="text-[11px] text-slate-400">Basic DC circuit with 9V battery, 220Ω resistor, and LED</div>
              </button>

              <button
                onClick={() => {
                  onLoadExample('pot_dimmer');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-slate-200 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-cyan-300">🎛️ Potentiometer Dimmer</div>
                <div className="text-[11px] text-slate-400">Voltage divider with adjustable rotary potentiometer</div>
              </button>

              <button
                onClick={() => {
                  onLoadExample('transistor_switch');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-slate-200 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-cyan-300">🔲 Transistor BJT Switch</div>
                <div className="text-[11px] text-slate-400">NPN transistor driving a load from base switch</div>
              </button>

              <button
                onClick={() => {
                  onLoadExample('logic_and_demo');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-slate-200 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-cyan-300">🔀 74HC08 Dual Input AND Gate</div>
                <div className="text-[11px] text-slate-400">Digital logic verification with tactile inputs</div>
              </button>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};
