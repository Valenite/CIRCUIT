import React, { useRef } from 'react';
import type { ViewMode, WireRoutingType } from '../types/circuit';
import {
  Play,
  Square,
  Cpu,
  Layers,
  FileCode2,
  Trash2,
  Download,
  Upload,
  FileText,
  Sparkles,
  Wand2,
  Code2,
  Terminal,
  CornerDownRight,
  Spline,
  Grid,
} from 'lucide-react';

interface Props {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  isRunning: boolean;
  onToggleSimulation: () => void;
  onClearCircuit: () => void;
  onExportJson: () => void;
  onImportJson: (json: string) => void;
  onOpenBom: () => void;
  onAutoWire: () => void;
  onOpenCodeEditor: () => void;
  isSerialMonitorOpen?: boolean;
  onToggleSerialMonitor?: () => void;
  hasMcu: boolean;
  onCleanAllWires: () => void;
  defaultRoutingMode: WireRoutingType;
  onToggleDefaultRoutingMode: () => void;
  gridSnap: boolean;
  onToggleGridSnap: () => void;
}

export const Navbar: React.FC<Props> = ({
  viewMode,
  onChangeViewMode,
  isRunning,
  onToggleSimulation,
  onClearCircuit,
  onExportJson,
  onImportJson,
  onOpenBom,
  onAutoWire,
  onOpenCodeEditor,
  isSerialMonitorOpen = false,
  onToggleSerialMonitor,
  hasMcu,
  onCleanAllWires,
  defaultRoutingMode,
  onToggleDefaultRoutingMode,
  gridSnap,
  onToggleGridSnap,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportJson(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="h-14 bg-[#090e1c] border-b border-slate-800/80 px-4 flex items-center justify-between z-30 shrink-0 select-none shadow-md">
      {/* Left: Project title & menu */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm tracking-tight text-white">CircuitCraft</span>
            <span className="text-[10px] text-slate-400 font-medium">v2.0</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <button onClick={onExportJson} className="hover:text-slate-300 transition-colors cursor-pointer">File</button>
            <span>•</span>
            <button onClick={onOpenBom} className="hover:text-slate-300 transition-colors cursor-pointer">BOM</button>
            <span>•</span>
            <button onClick={onClearCircuit} className="hover:text-rose-400 transition-colors cursor-pointer">Reset</button>
          </div>
        </div>
      </div>

      {/* Center: Mode switcher, Simulation button, Clean Wires, Wire geometry, Grid */}
      <div className="flex items-center space-x-3">
        {/* Cirkit-Style Segmented View Switcher: Design | Schematic | Firmware */}
        <div className="bg-slate-950/90 p-1 rounded-xl border border-slate-800 flex items-center space-x-1 shadow-inner">
          <button
            onClick={() => onChangeViewMode('realistic')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'realistic'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Design</span>
          </button>
          <button
            onClick={() => onChangeViewMode('schematic')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'schematic'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Schematic</span>
          </button>
          {hasMcu && (
            <>
              <button
                onClick={onOpenCodeEditor}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-slate-900 transition-all cursor-pointer"
                title="Open Firmware Code Editor"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Firmware</span>
              </button>
              <button
                onClick={onToggleSerialMonitor}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSerialMonitorOpen
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-cyan-400 hover:bg-slate-900'
                }`}
                title="Toggle Live Serial Monitor (Side-by-Side with Canvas)"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Serial</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              </button>
            </>
          )}
        </div>

        {/* Circular Run/Stop Simulation Button (Cirkit Style) */}
        <button
          onClick={onToggleSimulation}
          className={`flex items-center justify-center w-9 h-9 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
            isRunning
              ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30 ring-2 ring-rose-500/40'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-500/40'
          }`}
          title={isRunning ? 'Stop Simulation' : 'Run Simulation'}
        >
          {isRunning ? (
            <Square className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          )}
        </button>

        <div className="h-4 w-px bg-slate-800" />

        {/* CLEAN WIRES in Topbar (as specifically requested) */}
        <button
          onClick={onCleanAllWires}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 hover:text-cyan-300 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700/80 hover:border-cyan-500/40 transition-all shadow-sm cursor-pointer"
          title="Realign and straighten all wires to 90° Manhattan grid lines"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Clean Wires</span>
        </button>

        {/* Wire Style: Straight (90°) vs Curved */}
        <button
          onClick={onToggleDefaultRoutingMode}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700/80 transition-all cursor-pointer"
          title="Toggle wire routing mode (Straight 90° vs Curved)"
        >
          {defaultRoutingMode === 'orthogonal' ? (
            <>
              <CornerDownRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>Straight 90°</span>
            </>
          ) : (
            <>
              <Spline className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Curved</span>
            </>
          )}
        </button>

        {/* Grid Snapping Toggle */}
        <button
          onClick={onToggleGridSnap}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            gridSnap
              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
              : 'bg-slate-900/60 text-slate-500 border-slate-800'
          }`}
          title="Toggle 10px Grid Snap"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Grid: {gridSnap ? '10px' : 'Free'}</span>
        </button>

        {/* Auto-Wire Button */}
        <button
          onClick={onAutoWire}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 rounded-xl text-xs font-medium border border-cyan-500/30 transition-all cursor-pointer"
          title="Auto-wire standard power, ground and signals"
        >
          <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Auto-Wire</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenBom}
          className="flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
          title="Bill of Materials"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>BOM</span>
        </button>

        <button
          onClick={onExportJson}
          className="flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
          title="Export Circuit Project (JSON)"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
          title="Import Circuit (JSON)"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={onClearCircuit}
          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
          title="Clear circuit"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
