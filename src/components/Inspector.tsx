import React from 'react';
import type { CircuitComponent, Wire, SimulationResult } from '../types/circuit';
import { COMPONENT_TEMPLATES, getResistorBands } from '../constants/components';
import { RotateCw, Trash2, Zap, Sun, Thermometer, Compass, CornerDownRight, Spline, RefreshCw } from 'lucide-react';

interface Props {
  selectedComponent: CircuitComponent | null;
  selectedWire: Wire | null;
  simResult: SimulationResult;
  onUpdateComponentProperties: (id: string, props: Record<string, any>) => void;
  onRotateComponent: (id: string) => void;
  onDeleteSelected: () => void;
  onChangeWireColor: (wireId: string, color: string) => void;
  onToggleWireRoutingType?: (wireId: string) => void;
  onResetWireWaypoints?: (wireId: string) => void;
}

const LED_COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Amber', hex: '#f97316' },
  { name: 'White', hex: '#f8fafc' },
];

export const Inspector: React.FC<Props> = ({
  selectedComponent,
  selectedWire,
  simResult,
  onUpdateComponentProperties,
  onRotateComponent,
  onDeleteSelected,
  onChangeWireColor,
  onToggleWireRoutingType,
  onResetWireWaypoints,
}) => {
  if (!selectedComponent && !selectedWire) {
    return null;
  }

  // Wire Inspector
  if (selectedWire) {
    const current = simResult.branchCurrents[selectedWire.id] || 0;
    const isOrthogonal = (selectedWire.routingType || 'orthogonal') === 'orthogonal';
    const waypointCount = selectedWire.waypoints?.length || 0;

    return (
      <aside className="w-80 h-full bg-[#0a0f1d] border-l border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto shadow-2xl">
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedWire.color }} />
                Wire Properties
              </span>
              <span className="text-[10px] text-slate-500 font-mono">ID: {selectedWire.id}</span>
            </div>
            <button
              onClick={onDeleteSelected}
              className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
              title="Delete Wire (Del)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Wire Routing Style Toggle */}
          <div>
            <label className="text-xs text-slate-400 block mb-2 font-medium">Routing Geometry</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onToggleWireRoutingType && onToggleWireRoutingType(selectedWire.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isOrthogonal
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CornerDownRight className="w-4 h-4" />
                <span>Straight 90°</span>
              </button>
              <button
                onClick={() => onToggleWireRoutingType && onToggleWireRoutingType(selectedWire.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  !isOrthogonal
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Spline className="w-4 h-4" />
                <span>Curved</span>
              </button>
            </div>
          </div>

          {/* Waypoints & Bends Control */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Bend Waypoints</span>
              <span className="font-mono text-cyan-400 font-bold">{waypointCount} handles</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Drag circular handles on the canvas to move wire corners and straighten bends to grid lines.
            </p>
            {waypointCount > 0 && (
              <button
                onClick={() => onResetWireWaypoints && onResetWireWaypoints(selectedWire.id)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto-Realign Path</span>
              </button>
            )}
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-xs text-slate-400 block mb-2 font-medium">Wire Color Palette</label>
            <div className="flex flex-wrap gap-2">
              {[
                '#ef4444',
                '#1e293b',
                '#3b82f6',
                '#10b981',
                '#eab308',
                '#f97316',
                '#8b5cf6',
                '#ec4899',
                '#06b6d4',
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => onChangeWireColor(selectedWire.id, c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    selectedWire.color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Telemetry */}
          <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800/90 space-y-2">
            <div className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Current Flow</span>
            </div>
            <div className="text-2xl font-mono font-bold text-cyan-400 tracking-tight">
              {simResult.isRunning ? `${(Math.abs(current) * 1000).toFixed(2)} mA` : '0.00 mA'}
            </div>
            <div className="text-[11px] text-slate-500">
              {simResult.isRunning
                ? current >= 0
                  ? 'Forward conventional current'
                  : 'Reverse conventional current'
                : 'Simulation paused'}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (!selectedComponent) return null;

  const template = COMPONENT_TEMPLATES[selectedComponent.type];
  const output = simResult.componentOutputs[selectedComponent.id];

  return (
    <aside className="w-80 h-full bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-semibold text-sm text-slate-200">
              {selectedComponent.name || template.title}
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              {template.category} • ID: {selectedComponent.id}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onRotateComponent(selectedComponent.id)}
              className="p-1.5 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              title="Rotate 90° (R)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={onDeleteSelected}
              className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
              title="Delete Component (Del)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tactile Switch / Push Button Controls */}
        {selectedComponent.type === 'push_button' && (
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Switch Contact</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                selectedComponent.properties.state
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {selectedComponent.properties.state ? 'CLOSED (ON)' : 'OPEN (OFF)'}
              </span>
            </div>

            <button
              onClick={() => {
                const next = !selectedComponent.properties.state;
                onUpdateComponentProperties(selectedComponent.id, { state: next });
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                selectedComponent.properties.state
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/30 ring-1 ring-emerald-400/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <span>{selectedComponent.properties.state ? 'Release Switch (Turn OFF)' : 'Press Switch (Turn ON)'}</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center">
              💡 Tip: You can also click the switch button directly on the canvas!
            </p>
          </div>
        )}

        {/* Toggle / Slide Switch Controls */}
        {selectedComponent.type === 'toggle_switch' && (
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Toggle Position</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                selectedComponent.properties.state
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {selectedComponent.properties.state ? 'ON (Pos 2)' : 'OFF (Pos 1)'}
              </span>
            </div>
            <button
              onClick={() => {
                const next = !selectedComponent.properties.state;
                onUpdateComponentProperties(selectedComponent.id, { state: next });
              }}
              className="w-full py-2.5 px-4 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Flip Switch
            </button>
          </div>
        )}

        {/* Resistor Controls */}
        {selectedComponent.type === 'resistor' && (
          <div className="space-y-3">
            <label className="text-xs text-slate-400 block">Resistance Value (Ω)</label>
            <input
              type="number"
              min="1"
              step="10"
              value={selectedComponent.properties.resistance || 220}
              onChange={(e) =>
                onUpdateComponentProperties(selectedComponent.id, {
                  resistance: Math.max(1, parseFloat(e.target.value) || 220),
                })
              }
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            />
            <div className="flex flex-wrap gap-1.5">
              {[100, 220, 330, 470, 1000, 4700, 10000].map((val) => (
                <button
                  key={val}
                  onClick={() =>
                    onUpdateComponentProperties(selectedComponent.id, {
                      resistance: val,
                    })
                  }
                  className="px-2 py-0.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono"
                >
                  {val >= 1000 ? `${val / 1000}kΩ` : `${val}Ω`}
                </button>
              ))}
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Color Bands</span>
              <div className="flex items-center space-x-1.5 h-4 bg-amber-100 rounded px-2">
                {getResistorBands(selectedComponent.properties.resistance || 220).map((b, i) => (
                  <div key={i} className="h-full w-2.5" style={{ backgroundColor: b }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Photoresistor (LDR) Controls */}
        {selectedComponent.type === 'photoresistor' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Ambient Light Level</span>
              </span>
              <span className="font-mono text-amber-300 font-bold">
                {selectedComponent.properties.lightLevel ?? 50}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedComponent.properties.lightLevel ?? 50}
              onChange={(e) =>
                onUpdateComponentProperties(selectedComponent.id, {
                  lightLevel: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Dark (500kΩ)</span>
              <span>Bright (400Ω)</span>
            </div>
          </div>
        )}

        {/* Thermistor Controls */}
        {selectedComponent.type === 'thermistor' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <span>Ambient Temperature</span>
              </span>
              <span className="font-mono text-rose-300 font-bold">
                {selectedComponent.properties.temperature ?? 25}°C
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="120"
              value={selectedComponent.properties.temperature ?? 25}
              onChange={(e) =>
                onUpdateComponentProperties(selectedComponent.id, {
                  temperature: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-rose-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-20°C (Cold/High R)</span>
              <span>120°C (Hot/Low R)</span>
            </div>
          </div>
        )}

        {/* Servo Motor Controls */}
        {selectedComponent.type === 'servo_motor' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>Servo Shaft Angle</span>
              </span>
              <span className="font-mono text-sky-300 font-bold">
                {selectedComponent.properties.servoAngle ?? 90}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              value={selectedComponent.properties.servoAngle ?? 90}
              onChange={(e) =>
                onUpdateComponentProperties(selectedComponent.id, {
                  servoAngle: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-sky-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0°</span>
              <span>90°</span>
              <span>180°</span>
            </div>
          </div>
        )}

        {/* DIP Switch Controls */}
        {selectedComponent.type === 'dip_switch' && (
          <div className="space-y-3">
            <label className="text-xs text-slate-400 block">Switch Positions</label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((idx) => {
                const currentStates = selectedComponent.properties.dipStates || [false, false, false, false];
                const isOn = currentStates[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      const newStates = [...currentStates];
                      newStates[idx] = !isOn;
                      onUpdateComponentProperties(selectedComponent.id, { dipStates: newStates });
                    }}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                      isOn
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    SW {idx + 1}: {isOn ? 'ON' : 'OFF'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Battery / DC Supply Controls */}
        {(selectedComponent.type === 'battery_9v' ||
          selectedComponent.type === 'battery_aa' ||
          selectedComponent.type === 'battery_coin' ||
          selectedComponent.type === 'battery_dc' ||
          selectedComponent.type === 'ac_source') && (
          <div className="space-y-3">
            <label className="text-xs text-slate-400 block">Voltage Output (Volts)</label>
            <input
              type="number"
              min="0.5"
              max="48"
              step="0.5"
              value={selectedComponent.properties.voltage || 5}
              onChange={(e) =>
                onUpdateComponentProperties(selectedComponent.id, {
                  voltage: Math.max(0.5, parseFloat(e.target.value) || 5),
                })
              }
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            />
            {selectedComponent.type === 'ac_source' && (
              <>
                <label className="text-xs text-slate-400 block">Frequency (Hz)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={selectedComponent.properties.frequency || 50}
                  onChange={(e) =>
                    onUpdateComponentProperties(selectedComponent.id, {
                      frequency: parseInt(e.target.value, 10) || 50,
                    })
                  }
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 font-mono"
                />
              </>
            )}
          </div>
        )}

        {/* Potentiometer Controls */}
        {selectedComponent.type === 'potentiometer' && (
          <div className="space-y-3">
            <label className="text-xs text-slate-400 block">
              Wiper Position: {Math.round((selectedComponent.properties.potValue ?? 0.5) * 100)}%
            </label>
            <input
              type="range"
              min="0.01"
              max="0.99"
              step="0.01"
              value={selectedComponent.properties.potValue ?? 0.5}
              onChange={(e) =>
                onUpdateComponentProperties(selectedComponent.id, {
                  potValue: parseFloat(e.target.value),
                })
              }
              className="w-full accent-sky-500"
            />
          </div>
        )}

        {/* LED Controls */}
        {selectedComponent.type === 'led' && (
          <div className="space-y-3">
            <label className="text-xs text-slate-400 block">LED Color</label>
            <div className="grid grid-cols-3 gap-2">
              {LED_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() =>
                    onUpdateComponentProperties(selectedComponent.id, {
                      ledColor: c.hex,
                    })
                  }
                  className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-lg border text-xs transition-colors ${
                    selectedComponent.properties.ledColor === c.hex
                      ? 'border-sky-500 bg-sky-500/10 text-white'
                      : 'border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Electrical Telemetry Box */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 mt-4">
          <div className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>Electrical Telemetry</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-slate-900 p-2 rounded-lg">
              <span className="text-[10px] text-slate-500 block uppercase">Voltage Drop</span>
              <span className="text-sm font-mono font-bold text-slate-200">
                {simResult.isRunning && output ? `${output.voltageDrop.toFixed(2)} V` : '0.00 V'}
              </span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg">
              <span className="text-[10px] text-slate-500 block uppercase">Current</span>
              <span className="text-sm font-mono font-bold text-sky-400">
                {simResult.isRunning && output
                  ? `${(output.current * 1000).toFixed(2)} mA`
                  : '0.00 mA'}
              </span>
            </div>
          </div>

          {output?.burnedOut && (
            <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
              ⚠️ <b>Component Blown!</b> Current exceeded maximum rating.
            </div>
          )}

          {output?.powered && (
            <div className="text-[11px] text-emerald-400 font-medium">
              ● Active &amp; Energized
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
