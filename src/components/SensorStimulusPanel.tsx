import React, { useState } from 'react';
import type { CircuitComponent } from '../types/circuit';
import { Radar, Compass, Droplets, Activity, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  components: CircuitComponent[];
  isRunning: boolean;
  onUpdateComponentProperties: (id: string, props: Record<string, any>) => void;
}

export const SensorStimulusPanel: React.FC<Props> = ({
  components,
  isRunning,
  onUpdateComponentProperties,
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
        <button className="text-slate-400 hover:text-white">
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4 max-h-72 overflow-y-auto">
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
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>2 cm (Near)</span>
                <span>Time-of-Flight: {Math.round(((ultrasonic.properties.distanceCm ?? 25) * 2 / 0.0343))} µs</span>
                <span>400 cm (Far)</span>
              </div>
            </div>
          )}

          {/* MPU-6050 6-Axis IMU Simulator */}
          {imu && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-300 flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>MPU-6050 3D Orientation Tilt</span>
                </span>
                <span className="font-mono text-indigo-400 font-bold">
                  P: {imu.properties.imuTilt?.pitch ?? 0}° | R: {imu.properties.imuTilt?.roll ?? 0}°
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Pitch (X-axis tilt)</span>
                  <span>{imu.properties.imuTilt?.pitch ?? 0}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={imu.properties.imuTilt?.pitch ?? 0}
                  onChange={(e) =>
                    onUpdateComponentProperties(imu.id, {
                      imuTilt: {
                        ...(imu.properties.imuTilt || { roll: 0, yaw: 0 }),
                        pitch: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full accent-indigo-400"
                />
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
                className="w-full accent-emerald-400"
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
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
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
