import React, { useState } from 'react';
import type { CircuitComponent } from '../types/circuit';
import { Radar, Compass, Droplets, Activity, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface Props {
  components: CircuitComponent[];
  isRunning: boolean;
  onUpdateComponentProperties: (id: string, props: Record<string, any>) => void;
  onOpenSerialMonitor?: () => void;
}

export const SensorStimulusPanel: React.FC<Props> = ({
  components,
  isRunning,
  onUpdateComponentProperties,
  onOpenSerialMonitor,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Only display when simulation is actively running
  if (!isRunning) {
    return null;
  }

  // Find active sensors on the canvas
  const ultrasonic = components.find((c) => c.type === 'hc_sr04');
  const imu = components.find((c) => c.type === 'mpu_6050');
  const dht = components.find((c) => c.type === 'dht22');
  const pir = components.find((c) => c.type === 'pir_motion');

  if (!ultrasonic && !imu && !dht && !pir) {
    return null;
  }

  // Current MPU-6050 tilt values
  const pitch = imu?.properties.imuTilt?.pitch ?? 0;
  const roll = imu?.properties.imuTilt?.roll ?? 0;
  const yaw = imu?.properties.imuTilt?.yaw ?? 0;

  // Real-time calculated telemetry for display
  const radP = (pitch * Math.PI) / 180;
  const radR = (roll * Math.PI) / 180;
  const ax = Math.sin(radP);
  const ay = -Math.sin(radR);
  const az = Math.cos(radP) * Math.cos(radR);

  const handleUpdateImu = (p: number, r: number, y: number) => {
    if (!imu) return;
    onUpdateComponentProperties(imu.id, {
      imuTilt: { pitch: p, roll: r, yaw: y },
    });
  };

  return (
    <div className="absolute bottom-4 left-84 z-20 bg-slate-900/90 border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-md overflow-hidden max-w-md w-full transition-all">
      {/* Header */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            Sensor Interactive Test Bench
          </span>
          <span className="px-1.5 py-0.2 text-[10px] bg-cyan-500/20 text-cyan-300 rounded font-mono">
            Active
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {onOpenSerialMonitor && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenSerialMonitor();
              }}
              className="px-2 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-[10px] font-semibold flex items-center space-x-1 transition-colors cursor-pointer mr-1"
              title="Open Live Serial Monitor"
            >
              <Terminal className="w-3 h-3" />
              <span>Serial</span>
            </button>
          )}
          <button className="text-slate-400 hover:text-white">
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
          {/* MPU-6050 6-Axis IMU Simulator */}
          {imu && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-300 flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>MPU-6050 6-Axis Motion Sensor</span>
                </span>
                <span className="font-mono text-indigo-400 font-bold text-[11px]">
                  P: {pitch}° | R: {roll}° | Y: {yaw}°
                </span>
              </div>

              {/* Live Acceleration Card */}
              <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-900/60 rounded-lg border border-slate-800/80 font-mono text-[10px]">
                <div className="text-center">
                  <span className="text-slate-500">Ax: </span>
                  <span className="text-emerald-400 font-bold">{ax.toFixed(2)}g</span>
                </div>
                <div className="text-center">
                  <span className="text-slate-500">Ay: </span>
                  <span className="text-emerald-400 font-bold">{ay.toFixed(2)}g</span>
                </div>
                <div className="text-center">
                  <span className="text-slate-500">Az: </span>
                  <span className="text-emerald-400 font-bold">{az.toFixed(2)}g</span>
                </div>
              </div>

              {/* Pitch Slider */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Pitch (X-axis tilt: Forward / Backward)</span>
                  <span className="font-mono text-cyan-300">{pitch}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={pitch}
                  onChange={(e) => handleUpdateImu(parseInt(e.target.value, 10), roll, yaw)}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>

              {/* Roll Slider */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Roll (Y-axis tilt: Left / Right)</span>
                  <span className="font-mono text-cyan-300">{roll}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={roll}
                  onChange={(e) => handleUpdateImu(pitch, parseInt(e.target.value, 10), yaw)}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>

              {/* Yaw Slider */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Yaw (Z-axis rotation)</span>
                  <span className="font-mono text-cyan-300">{yaw}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={yaw}
                  onChange={(e) => handleUpdateImu(pitch, roll, parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>

              {/* 1-Click Orientation Presets */}
              <div className="pt-1 flex items-center space-x-1.5 overflow-x-auto">
                <span className="text-[10px] text-slate-500 shrink-0">Presets:</span>
                <button
                  onClick={() => handleUpdateImu(0, 0, 0)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] transition-colors shrink-0 cursor-pointer"
                >
                  Flat (0,0)
                </button>
                <button
                  onClick={() => handleUpdateImu(45, 0, 0)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded text-[10px] transition-colors shrink-0 cursor-pointer"
                >
                  Tilt +45° P
                </button>
                <button
                  onClick={() => handleUpdateImu(-45, 0, 0)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded text-[10px] transition-colors shrink-0 cursor-pointer"
                >
                  Tilt -45° P
                </button>
                <button
                  onClick={() => handleUpdateImu(0, 45, 0)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[10px] transition-colors shrink-0 cursor-pointer"
                >
                  Roll +45° R
                </button>
                <button
                  onClick={() => handleUpdateImu(0, -45, 0)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[10px] transition-colors shrink-0 cursor-pointer"
                >
                  Roll -45° R
                </button>
              </div>
            </div>
          )}

          {/* Ultrasonic HC-SR04 Simulator */}
          {ultrasonic && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-300 flex items-center space-x-1.5">
                  <Radar className="w-4 h-4 text-cyan-400" />
                  <span>HC-SR04 Obstacle Distance</span>
                </span>
                <span className="font-mono text-cyan-400 font-bold">
                  {ultrasonic.properties.distanceCm ?? 25} cm
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="400"
                value={ultrasonic.properties.distanceCm ?? 25}
                onChange={(e) =>
                  onUpdateComponentProperties(ultrasonic.id, {
                    distanceCm: parseInt(e.target.value, 10),
                  })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>2 cm (Near)</span>
                <span>Time-of-Flight: {Math.round(((ultrasonic.properties.distanceCm ?? 25) * 2) / 0.0343)} µs</span>
                <span>400 cm (Far)</span>
              </div>
            </div>
          )}

          {/* DHT22 Temp & Humidity */}
          {dht && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-300 flex items-center space-x-1.5">
                  <Droplets className="w-4 h-4 text-emerald-400" />
                  <span>DHT22 Atmosphere Chamber</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {dht.properties.temperature ?? 24}°C | {dht.properties.humidity ?? 55}% RH
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={dht.properties.humidity ?? 55}
                onChange={(e) =>
                  onUpdateComponentProperties(dht.id, {
                    humidity: parseInt(e.target.value, 10),
                  })
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          )}

          {/* PIR Motion Trigger */}
          {pir && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300">HC-SR501 Motion Trigger:</span>
              <button
                onClick={() => {
                  onUpdateComponentProperties(pir.id, { motionDetected: true });
                  setTimeout(() => {
                    onUpdateComponentProperties(pir.id, { motionDetected: false });
                  }, 2500);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  pir.properties.motionDetected
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-slate-800 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {pir.properties.motionDetected ? 'Motion Active (3.3V Out)' : 'Wave Hand (Trigger)'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
