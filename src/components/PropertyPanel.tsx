import React, { useRef, useEffect, useState } from 'react';
import type { CircuitComponent, SimulationResult } from '../types/circuit';
import { COMPONENT_TEMPLATES } from '../constants/components';
import { X, Zap, Cpu, ToggleLeft, ToggleRight, Sliders } from 'lucide-react';

interface Props {
  component: CircuitComponent;
  simResult: SimulationResult;
  anchorX: number; // Screen-space X of click
  anchorY: number; // Screen-space Y of click
  onUpdateProperties: (id: string, props: Record<string, any>) => void;
  onClose: () => void;
}

function propLabel(key: string): string {
  const map: Record<string, string> = {
    resistance: 'Resistance (Ω)',
    voltage: 'Voltage (V)',
    frequency: 'Frequency (Hz)',
    capacitance: 'Capacitance (µF)',
    inductance: 'Inductance (H)',
    potValue: 'Pot Position',
    lightLevel: 'Light Level',
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    distanceCm: 'Distance (cm)',
    servoAngle: 'Servo Angle (°)',
    currentRating: 'Current Rating (A)',
    gain: 'Gain',
    thresholdVoltage: 'Threshold (V)',
    motorSpeedA: 'Motor A Speed',
    motorSpeedB: 'Motor B Speed',
    stimulusValue: 'Stimulus',
  };
  return map[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const NUMERIC_PROPS = [
  'resistance', 'voltage', 'frequency', 'capacitance', 'inductance',
  'potValue', 'lightLevel', 'temperature', 'humidity', 'distanceCm',
  'servoAngle', 'currentRating', 'gain', 'thresholdVoltage',
  'motorSpeedA', 'motorSpeedB', 'stimulusValue',
];

const PROP_RANGES: Record<string, { min: number; max: number; step: number }> = {
  resistance:       { min: 0, max: 10_000_000, step: 1 },
  voltage:          { min: -50, max: 50, step: 0.1 },
  frequency:        { min: 1, max: 1_000_000, step: 1 },
  capacitance:      { min: 0, max: 10000, step: 1 },
  inductance:       { min: 0, max: 10, step: 0.001 },
  potValue:         { min: 0, max: 1, step: 0.01 },
  lightLevel:       { min: 0, max: 1, step: 0.01 },
  temperature:      { min: -40, max: 150, step: 0.5 },
  humidity:         { min: 0, max: 100, step: 1 },
  distanceCm:       { min: 2, max: 400, step: 1 },
  servoAngle:       { min: 0, max: 180, step: 1 },
  currentRating:    { min: 0.001, max: 30, step: 0.001 },
  gain:             { min: 1, max: 1000, step: 1 },
  thresholdVoltage: { min: 0, max: 15, step: 0.1 },
  motorSpeedA:      { min: 0, max: 1, step: 0.01 },
  motorSpeedB:      { min: 0, max: 1, step: 0.01 },
  stimulusValue:    { min: 0, max: 1, step: 0.01 },
};

const PANEL_W = 280;

export const PropertyPanel: React.FC<Props> = ({
  component,
  simResult,
  anchorX,
  anchorY,
  onUpdateProperties,
  onClose,
}) => {
  const template = COMPONENT_TEMPLATES[component.type];
  const output = simResult.componentOutputs[component.id];

  const relevantNumericProps = NUMERIC_PROPS.filter(
    (key) => component.properties[key] !== undefined
  );

  // Compute stable panel position once on mount from anchor point
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Position right of cursor, clamped to viewport
    const panelH = Math.min(520, 160 + relevantNumericProps.length * 74);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = anchorX + 16;
    let top = anchorY - 16;

    // Flip left if not enough space on right
    if (left + PANEL_W > vw - 8) left = anchorX - PANEL_W - 16;
    if (left < 8) left = 8;
    if (top + panelH > vh - 8) top = vh - panelH - 8;
    if (top < 8) top = 8;

    setPos({ left, top });
  // Only run on mount — anchor is stable from click event
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draggable panel
  const dragRef = useRef<{ startX: number; startY: number; origLeft: number; origTop: number } | null>(null);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (!pos) return;
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origLeft: pos.left,
      origTop: pos.top,
    };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setPos({
        left: dragRef.current.origLeft + ev.clientX - dragRef.current.startX,
        top: dragRef.current.origTop + ev.clientY - dragRef.current.startY,
      });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (!pos) return null;

  return (
    <div
      ref={panelRef}
      className="fixed z-[60] pointer-events-auto select-none"
      style={{ left: pos.left, top: pos.top, width: PANEL_W }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="bg-[#0a0f1e]/98 border border-cyan-500/40 rounded-2xl shadow-[0_12px_60px_rgba(0,240,255,0.2)] backdrop-blur-2xl overflow-hidden">

        {/* Draggable Header */}
        <div
          className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800/80 bg-gradient-to-r from-cyan-950/50 to-slate-900/50 cursor-grab active:cursor-grabbing"
          onMouseDown={handleHeaderMouseDown}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate leading-tight">{component.name}</div>
              <div className="text-[9px] text-slate-500 font-mono truncate">{component.type}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()}
            className="ml-2 p-1 text-slate-500 hover:text-white hover:bg-slate-700/60 rounded-lg transition-all shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Sim Status */}
        {output && (
          <div className="px-3.5 py-2 bg-slate-950/60 border-b border-slate-800/60 flex flex-wrap gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full transition-all ${output.powered ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-slate-700'}`}
              />
              <span className={`text-[10px] font-bold ${output.powered ? 'text-green-400' : 'text-slate-600'}`}>
                {output.powered ? 'POWERED' : 'UNPOWERED'}
              </span>
            </div>
            {output.powered && output.voltageDrop !== undefined && output.voltageDrop > 0 && (
              <div className="flex items-center gap-1 text-[10px]">
                <Zap className="w-2.5 h-2.5 text-yellow-400" />
                <span className="font-mono text-yellow-300">{output.voltageDrop.toFixed(2)}V</span>
              </div>
            )}
            {output.powered && output.current !== undefined && output.current > 0 && (
              <span className="text-[10px] font-mono text-blue-300">
                {(output.current * 1000).toFixed(1)}mA
              </span>
            )}
            {output.brightness !== undefined && output.brightness > 0 && (
              <span className="text-[10px] font-mono text-amber-300">
                {Math.round(output.brightness * 100)}% bright
              </span>
            )}
            {output.rpm !== undefined && output.rpm > 0 && (
              <span className="text-[10px] font-mono text-cyan-300">
                {Math.round(output.rpm)} RPM
              </span>
            )}
            {output.burnedOut && (
              <span className="text-[10px] font-bold text-red-400">⚠ BURNED OUT</span>
            )}
            {output.sensorReading !== undefined && (
              <span className="text-[10px] font-mono text-purple-300">
                {String(output.sensorReading)}
              </span>
            )}
          </div>
        )}

        {/* Scrollable Properties */}
        <div className="px-3.5 py-3 space-y-3 max-h-72 overflow-y-auto">

          {/* Boolean: state toggle */}
          {component.properties.state !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">State</span>
              <button
                onClick={() => onUpdateProperties(component.id, { state: !component.properties.state })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  component.properties.state
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700'
                }`}
              >
                {component.properties.state ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {component.properties.state ? 'ON' : 'OFF'}
              </button>
            </div>
          )}

          {/* LED Color picker */}
          {component.properties.ledColor !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">LED Color</span>
              <input
                type="color"
                value={component.properties.ledColor || '#ff0000'}
                onChange={(e) => onUpdateProperties(component.id, { ledColor: e.target.value })}
                className="w-10 h-7 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
              />
            </div>
          )}

          {/* Numeric sliders */}
          {relevantNumericProps.map((key) => {
            const val = Number(component.properties[key]);
            const range = PROP_RANGES[key] ?? { min: 0, max: 100, step: 1 };
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-semibold">{propLabel(key)}</span>
                  <input
                    type="number"
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={val}
                    onChange={(e) => onUpdateProperties(component.id, { [key]: parseFloat(e.target.value) || 0 })}
                    className="w-24 text-right text-xs bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/50 focus:border-cyan-400 text-cyan-300 font-mono rounded-lg px-2 py-1 outline-none transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-2.5 h-2.5 text-slate-600 shrink-0" />
                  <input
                    type="range"
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={val}
                    onChange={(e) => onUpdateProperties(component.id, { [key]: parseFloat(e.target.value) })}
                    className="flex-1 h-1.5 accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}

          {relevantNumericProps.length === 0 &&
            component.properties.state === undefined &&
            component.properties.ledColor === undefined && (
              <div className="text-center py-4 text-xs text-slate-600 italic">
                No editable properties
              </div>
            )}
        </div>

        {/* Footer */}
        {template && (
          <div className="px-3.5 py-2 border-t border-slate-800/60 bg-slate-950/40">
            <div className="text-[10px] text-slate-500 leading-snug">
              <span className="text-slate-400 font-semibold">{template.title}</span>
              {template.description && (
                <span className="text-slate-600"> — {template.description}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
