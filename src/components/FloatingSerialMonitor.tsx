import React, { useState, useEffect, useRef } from 'react';
import type { CircuitComponent } from '../types/circuit';
import { mcuRuntime, type SerialLogEntry } from '../engine/mcuRuntime';
import {
  Terminal,
  X,
  Trash2,
  Copy,
  Check,
  Pause,
  Play,
  CornerDownLeft,
  Maximize2,
  Minimize2,
  Sliders,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mcuComponent: CircuitComponent | null;
  allMcus?: CircuitComponent[];
  onSelectMcu?: (id: string) => void;
  onOpenSensorStimulus?: () => void;
}

const BAUD_RATES = [
  300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 250000, 500000, 1000000, 2000000,
];

export const FloatingSerialMonitor: React.FC<Props> = ({
  isOpen,
  onClose,
  mcuComponent,
  allMcus = [],
  onSelectMcu,
  onOpenSensorStimulus,
}) => {
  const [logs, setLogs] = useState<SerialLogEntry[]>([]);
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [inputCmd, setInputCmd] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  // Dragging state for floating window
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: Math.max(20, window.innerWidth - 540),
    y: 80,
  });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Poll runtime logs
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      if (isPaused) return;
      const state = mcuRuntime.getActiveState();
      setLogs([...state.serialLogs]);
      if (state.baudRate && state.baudRate !== baudRate) {
        setBaudRate(state.baudRate);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, baudRate]);

  // Autoscroll
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Handle Dragging
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (isMaximized) return;
    // Don't drag if clicking buttons or dropdowns
    if ((e.target as HTMLElement).closest('button, select, input')) return;

    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = ev.clientX - dragStartRef.current.mouseX;
      const dy = ev.clientY - dragStartRef.current.mouseY;
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 300, dragStartRef.current.startX + dx)),
        y: Math.max(60, Math.min(window.innerHeight - 150, dragStartRef.current.startY + dy)),
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleSendCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCmd.trim()) return;
    mcuRuntime.addStdinLog(inputCmd.trim());
    setInputCmd('');
  };

  const handleClear = () => {
    mcuRuntime.clearLogs();
    setLogs([]);
  };

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      style={
        isMaximized
          ? { top: 64, left: 16, right: 16, bottom: 16 }
          : { top: position.y, left: position.x, width: 500, height: 420 }
      }
      className="fixed z-40 flex flex-col bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none"
    >
      {/* Draggable Header */}
      <div
        onMouseDown={handleMouseDownHeader}
        className="px-4 py-2.5 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between cursor-move"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white tracking-wide">Live Serial Monitor</span>
              <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </span>
            </div>
            {/* Target MCU */}
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
              <span>Target:</span>
              {allMcus.length > 1 && onSelectMcu ? (
                <select
                  value={mcuComponent?.id}
                  onChange={(e) => onSelectMcu(e.target.value)}
                  className="bg-slate-800/90 text-cyan-300 rounded px-1.5 py-0.2 border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {allMcus.map((mcu) => (
                    <option key={mcu.id} value={mcu.id}>
                      {mcu.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-cyan-300 font-semibold">{mcuComponent?.name || 'MCU'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          {onOpenSensorStimulus && (
            <button
              onClick={onOpenSensorStimulus}
              className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
              title="Open Sensor Stimulus Controls"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
            title={isMaximized ? 'Restore Window' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            title="Close Serial Monitor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-3 py-1.5 bg-slate-900/70 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          {/* Baud Rate Picker */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] text-slate-400">Baud:</span>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              className="bg-slate-800 text-slate-200 text-[11px] font-mono rounded px-1.5 py-0.5 border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {BAUD_RATES.map((rate) => (
                <option key={rate} value={rate}>
                  {rate.toLocaleString()} baud
                </option>
              ))}
            </select>
          </div>

          {/* Autoscroll checkbox */}
          <label className="flex items-center space-x-1.5 text-[11px] text-slate-400 cursor-pointer hover:text-slate-200">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="accent-cyan-400 rounded cursor-pointer"
            />
            <span>Autoscroll</span>
          </label>
        </div>

        {/* Buttons: Pause, Clear, Copy */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isPaused ? 'Resume stream' : 'Pause output'}
          >
            {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? 'Paused' : 'Pause'}</span>
          </button>

          <button
            onClick={handleCopyLogs}
            className="flex items-center space-x-1 px-2 py-0.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded text-[11px] transition-colors cursor-pointer"
            title="Copy all logs"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleClear}
            className="flex items-center space-x-1 px-2 py-0.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded text-[11px] transition-colors cursor-pointer"
            title="Clear terminal"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-3.5 font-mono text-[11px] leading-relaxed overflow-y-auto space-y-1 bg-[#050811] select-text"
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 italic py-8 text-center">
            Waiting for Serial telemetry from {mcuComponent?.name || 'microcontroller'}...
            <div className="text-[10px] text-slate-600 mt-1">
              Tip: Upload a sketch containing <code className="text-cyan-400">Serial.println(...)</code> or adjust sensor variables!
            </div>
          </div>
        ) : (
          logs.map((log) => {
            if (log.type === 'system') {
              return (
                <div key={log.id} className="text-amber-400/90 flex items-start space-x-2">
                  <span className="text-slate-600 shrink-0 select-none">{log.timestamp}</span>
                  <span>{log.text}</span>
                </div>
              );
            }
            if (log.type === 'stdin') {
              return (
                <div key={log.id} className="text-fuchsia-400 flex items-start space-x-2 font-bold">
                  <span className="text-slate-600 shrink-0 select-none">{log.timestamp}</span>
                  <span>{log.text}</span>
                </div>
              );
            }
            return (
              <div key={log.id} className="text-cyan-300/95 flex items-start space-x-2 hover:bg-slate-900/40 px-1 rounded">
                <span className="text-slate-600 shrink-0 select-none">{log.timestamp}</span>
                <span className="break-all">{log.text}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Send Command Input Line */}
      <form
        onSubmit={handleSendCommand}
        className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            placeholder="Send command to MCU (e.g. 'R', 'TILT', '1')..."
            className="w-full px-3 py-1.5 bg-slate-950 text-slate-200 text-xs font-mono rounded-lg border border-slate-700/80 focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shadow-sm shadow-cyan-500/10"
        >
          <span>Send</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
