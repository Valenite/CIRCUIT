import React, { useRef, useEffect } from 'react';
import type { CircuitComponent, SimulationResult } from '../types/circuit';
import { COMPONENT_TEMPLATES } from '../constants/components';
import { X, Zap, Cpu, ToggleLeft, ToggleRight, Sliders } from 'lucide-react';

interface Props {
  component: CircuitComponent;
  simResult: SimulationResult;
  canvasX: number; // Screen-space X of component center
  canvasY: number; // Screen-space Y of component top
  onUpdateProperties: (id: string, props: Record<string, any>) => void;
  onClose: () => void;
}

/** Returns a human-readable label for a property key */
function propLabel(key: string): string {
  const map: Record<string, string> = {
    resistance: 'Resistance (Ω)',
    voltage: 'Voltage (V)',
    frequency: 'Frequency (Hz)',
    capacitance: 'Capacitance (F)',
    inductance: 'Inductance (H)',
    potValue: 'Pot Position (0-1)',
    lightLevel: 'Light Level (0-1)',
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    distanceCm: 'Distance (cm)',
    servoAngle: 'Servo Angle (°)',
    currentRating: 'Current Rating (A)',
    gain: 'Gain',
    thresholdVoltage: 'Threshold (V)',
    motorSpeedA: 'Motor A Speed (0-1)',
    motorSpeedB: 'Motor B Speed (0-1)',
    stimulusValue: 'Stimulus (0-1)',
  };
  return map[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Properties that are numeric sliders/inputs and safe to expose */
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
  capacitance:      { min: 0, max: 0.1, step: 0.000001 },
  inductance:       { min: 0, max: 10, step: 0.001 },
  potValue:         { min: 0, max: 1, step: 0.01 },
  lightLevel:       { min: 0, max: 1, step: 0.01 },
  temperature:      { min: -40, max: 150, step: 0.5 },
  humidity:         { min: 0, max: 100, step: 1 },
  distanceCm:       { min: 2, max: 400, step: 1 },
  servoAngle:       { min: 0, max: 180, step: 1 },
  currentRating:    { min: 0.1, max: 30, step: 0.1 },
  gain:             { min: 1, max: 1000, step: 1 },
  thresholdVoltage: { min: 0, max: 15, step: 0.1 },
  motorSpeedA:      { min: 0, max: 1, step: 0.01 },
  motorSpeedB:      { min: 0, max: 1, step: 0.01 },
  stimulusValue:    { min: 0, max: 1, step: 0.01 },
};

export const PropertyPanel: React.FC<Props> = ({
  component,
  simResult,
  canvasX,
  canvasY,
  onUpdateProperties,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const template = COMPONENT_TEMPLATES[component.type];
  const output = simResult.componentOutputs[component.id];

  // Numeric props that this component actually has
  const relevantNumericProps = NUMERIC_PROPS.filter(
    (key) => component.properties[key] !== undefined
  );

  // Compute panel position (clamp to screen)
  const panelW = 276;
  const panelH = Math.min(500, 180 + relevantNumericProps.length * 72);

  // Start right of component, then clamp
  let left = canvasX + 20;
  let top = canvasY - 20;

  useEffect(() => {
    if (!panelRef.current) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let newLeft = left;
    let newTop = top;

    if (newLeft + panelW > vw - 8) newLeft = vw - panelW - 8;
    if (newLeft < 8) newLeft = 8;
    if (newTop + panelH > vh - 8) newTop = vh - panelH - 8;
    if (newTop < 8) newTop = 8;

    panelRef.current.style.left = `${newLeft}px`;
    panelRef.current.style.top = `${newTop}px`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={panelRef}
      className="fixed z-50 pointer-events-auto"
      style={{ left, top, width: panelW }}
    >
      {/* Glass card */}
      <div className="bg-[#0a0f1e]/96 border border-cyan-500/30 rounded-2xl shadow-[0_8px_48px_rgba(0,240,255,0.15)] backdrop-blur-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-gradient-to-r from-cyan-950/40 to-slate-900/40">
          <div className="flex items-center gap-2 min-w-0">
            <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{component.name}</div>
              <div className="text-[10px] text-slate-500 font-mono truncate">{component.type}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-2 p-1 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-all shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Sim Status */}
        {output && (
          <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800/60 flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${output.powered ? 'bg-green-400 shadow-[0_0_6px_#4ade80]' : 'bg-slate-600'}`}
              />
              <span className={`text-[10px] font-bold ${output.powered ? 'text-green-400' : 'text-slate-500'}`}>
                {output.powered ? 'POWERED' : 'OFF'}
              </span>
            </div>
            {output.voltageDrop !== undefined && (
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Zap className="w-2.5 h-2.5 text-yellow-400" />
                <span className="font-mono text-yellow-300">{output.voltageDrop.toFixed(2)} V</span>
              </div>
            )}
            {output.current !== undefined && (
              <div className="text-[10px] font-mono text-slate-400">
                <span className="text-blue-300">{(output.current * 1000).toFixed(1)} mA</span>
              </div>
            )}
            {output.brightness !== undefined && (
              <div className="text-[10px] font-mono text-slate-400">
                <span className="text-amber-300">{Math.round(output.brightness * 100)}% bright</span>
              </div>
            )}
            {output.rpm !== undefined && (
              <div className="text-[10px] font-mono text-slate-400">
                <span className="text-cyan-300">{Math.round(output.rpm ?? 0)} RPM</span>
              </div>
            )}
            {output.sensorReading !== undefined && (
              <div className="text-[10px] font-mono text-slate-400">
                <span className="text-purple-300">{output.sensorReading}</span>
              </div>
            )}
          </div>
        )}

        {/* Editable Properties */}
        <div className="px-4 py-3 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {/* Boolean toggle: state */}
          {component.properties.state !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">State</span>
              <button
                onClick={() =>
                  onUpdateProperties(component.id, { state: !component.properties.state })
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  component.properties.state
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700'
                }`}
              >
                {component.properties.state ? (
                  <ToggleRight className="w-4 h-4" />
                ) : (
                  <ToggleLeft className="w-4 h-4" />
                )}
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
                onChange={(e) =>
                  onUpdateProperties(component.id, { ledColor: e.target.value })
                }
                className="w-10 h-7 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
              />
            </div>
          )}

          {/* Numeric properties with sliders */}
          {relevantNumericProps.map((key) => {
            const val = Number(component.properties[key]);
            const range = PROP_RANGES[key] ?? { min: 0, max: 1, step: 0.01 };
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-semibold">{propLabel(key)}</span>
                  <input
                    type="number"
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={val}
                    onChange={(e) =>
                      onUpdateProperties(component.id, { [key]: parseFloat(e.target.value) })
                    }
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
                    onChange={(e) =>
                      onUpdateProperties(component.id, { [key]: parseFloat(e.target.value) })
                    }
                    className="flex-1 h-1.5 accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}

          {/* If no editable props */}
          {relevantNumericProps.length === 0 &&
            component.properties.state === undefined &&
            component.properties.ledColor === undefined && (
              <div className="text-center py-3 text-xs text-slate-500 italic">
                No editable properties
              </div>
            )}
        </div>

        {/* Footer — template info */}
        {template && (
          <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40">
            <div className="text-[10px] text-slate-500 leading-snug">
              <span className="text-slate-400 font-semibold">{template.title}</span>
              {template.description && (
                <span className="ml-1 text-slate-600">— {template.description}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
