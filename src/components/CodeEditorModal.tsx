import React, { useState, useEffect, useRef } from 'react';
import type { CircuitComponent } from '../types/circuit';
import { mcuRuntime, type SerialLogEntry } from '../engine/mcuRuntime';
import {
  Code2,
  Play,
  X,
  Terminal,
  Check,
  RotateCcw,
  ExternalLink,
  Trash2,
  Compass,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  component: CircuitComponent | null;
  onSaveCode: (componentId: string, newCode: string) => void;
  allMcus?: CircuitComponent[];
  onSelectMcu?: (id: string) => void;
  onOpenFloatingSerial?: () => void;
}

const BAUD_RATES = [
  300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400, 250000, 500000, 1000000, 2000000,
];

const SKETCH_TEMPLATES: Record<string, string> = {
  mpu6050: `// MPU-6050 6-Axis Accelerometer & Gyroscope Live Telemetry
#include <Wire.h>

const int MPU_ADDR = 0x68; // Default I2C Address

void setup() {
  Serial.begin(115200);
  Wire.begin();
  Serial.println("==========================================");
  Serial.println("  MPU-6050 6-Axis IMU Initialized (I2C)   ");
  Serial.println("==========================================");
}

void loop() {
  // Read live tilt angles & acceleration
  float pitch, roll, yaw;
  float ax, ay, az;
  float temp;

  // Print live telemetry stream to Serial Monitor
  Serial.print("[IMU] Pitch: ");
  Serial.print(pitch, 1);
  Serial.print(" deg | Roll: ");
  Serial.print(roll, 1);
  Serial.print(" deg | Ax: ");
  Serial.print(ax, 2);
  Serial.print("g  Ay: ");
  Serial.print(ay, 2);
  Serial.print("g  Az: ");
  Serial.print(az, 2);
  Serial.print("g | Temp: ");
  Serial.print(temp, 1);
  Serial.println(" C");

  delay(200);
}
`,
  blink: `// Standard Blink Sketch
const int ledPin = 13;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  Serial.println("LED Blink Sketch Started");
}

void loop() {
  digitalWrite(ledPin, HIGH);   // turn the LED on
  Serial.println("LED State: HIGH");
  delay(500);                  // wait half a second
  digitalWrite(ledPin, LOW);    // turn the LED off
  Serial.println("LED State: LOW");
  delay(500);                  // wait half a second
}
`,
  ultrasonic: `// HC-SR04 Ultrasonic Distance Reader
const int trigPin = 9;
const int echoPin = 10;
const int ledPin = 13;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.println("HC-SR04 Ultrasonic Sonar Initialized");
}

void loop() {
  // Trigger sonar pulse
  digitalWrite(trigPin, LOW);
  delay(2);
  digitalWrite(trigPin, HIGH);
  delay(10);
  digitalWrite(trigPin, LOW);

  // Measure distance
  long distance;
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  // Alert indicator if obstacle near
  if (distance < 15) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
  delay(250);
}
`,
  fast_blink: `// High-Speed Flasher
const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(100);
  digitalWrite(ledPin, LOW);
  delay(100);
}
`,
};

export const CodeEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  component,
  onSaveCode,
  allMcus = [],
  onSelectMcu,
  onOpenFloatingSerial,
}) => {
  const [code, setCode] = useState<string>(
    component?.properties.code || SKETCH_TEMPLATES.mpu6050
  );
  const [activeTab, setActiveTab] = useState<'editor' | 'serial'>('editor');
  const [isCompiled, setIsCompiled] = useState(false);
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [logs, setLogs] = useState<SerialLogEntry[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync code when component changes
  useEffect(() => {
    if (component?.properties.code) {
      setCode(component.properties.code);
    }
  }, [component?.id, component?.properties.code]);

  // Sync runtime logs when in serial tab
  useEffect(() => {
    if (!isOpen || activeTab !== 'serial') return;
    const interval = setInterval(() => {
      const state = mcuRuntime.getActiveState();
      setLogs([...state.serialLogs]);
    }, 100);
    return () => clearInterval(interval);
  }, [isOpen, activeTab]);

  // Autoscroll
  useEffect(() => {
    if (activeTab === 'serial' && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs, activeTab]);

  if (!isOpen || !component) return null;

  const handleCompileAndRun = () => {
    onSaveCode(component.id, code);
    setIsCompiled(true);
    setTimeout(() => setIsCompiled(false), 2000);
  };

  const handlePopOutSerial = () => {
    handleCompileAndRun();
    if (onOpenFloatingSerial) {
      onOpenFloatingSerial();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                {allMcus.length > 1 && onSelectMcu ? (
                  <select
                    value={component.id}
                    onChange={(e) => onSelectMcu(e.target.value)}
                    className="bg-slate-800 text-white text-sm font-bold rounded-md px-2 py-0.5 border border-slate-600 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    title="Select microcontroller target"
                  >
                    {allMcus.map((mcu) => (
                      <option key={mcu.id} value={mcu.id}>
                        {mcu.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{component.name}</span>
                )}
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                  C++ / Arduino Wiring
                </span>
              </h2>
              <p className="text-xs text-slate-400">Write firmware and monitor real-time serial telemetry</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Pop Out to Canvas Side-by-Side Button */}
            {onOpenFloatingSerial && (
              <button
                onClick={handlePopOutSerial}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
                title="Pop out Serial Monitor onto canvas to view side-by-side with sensor controls"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Side-by-Side</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Templates */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className="text-xs text-slate-400 font-medium">Templates:</span>
            <button
              onClick={() => setCode(SKETCH_TEMPLATES.mpu6050)}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 rounded-md transition-colors cursor-pointer font-semibold"
            >
              <Compass className="w-3 h-3 text-indigo-400" />
              <span>MPU-6050 IMU</span>
            </button>
            <button
              onClick={() => setCode(SKETCH_TEMPLATES.blink)}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors cursor-pointer"
            >
              Standard Blink
            </button>
            <button
              onClick={() => setCode(SKETCH_TEMPLATES.ultrasonic)}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors cursor-pointer"
            >
              Ultrasonic Distance
            </button>
            <button
              onClick={() => setCode(SKETCH_TEMPLATES.fast_blink)}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors cursor-pointer"
            >
              High-Speed Strobe
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'editor'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Sketch.ino</span>
            </button>
            <button
              onClick={() => setActiveTab('serial')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'serial'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Serial Monitor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </button>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-hidden relative bg-[#0b101b]">
          {activeTab === 'editor' ? (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-6 bg-transparent text-emerald-400 font-mono text-sm leading-relaxed resize-none focus:outline-none"
            />
          ) : (
            <div className="w-full h-full flex flex-col">
              {/* Serial Monitor Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-300 font-mono font-bold">Serial Output Stream</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Connected
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5">
                    <label className="text-xs text-slate-400 font-medium">Baud Rate:</label>
                    <select
                      value={baudRate}
                      onChange={(e) => setBaudRate(Number(e.target.value))}
                      className="bg-slate-800 text-slate-200 text-xs rounded-md px-2 py-0.5 border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {BAUD_RATES.map((rate) => (
                        <option key={rate} value={rate}>
                          {rate.toLocaleString()} baud
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      mcuRuntime.clearLogs();
                      setLogs([]);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    title="Clear Terminal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Logs Stream */}
              <div
                ref={scrollContainerRef}
                className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-y-auto space-y-1 bg-[#060a14]"
              >
                <div className="text-slate-500 border-b border-slate-800 pb-2 mb-2">
                  --- Virtual COM Port (Baud Rate: {baudRate.toLocaleString()}) ---
                </div>
                {logs.length === 0 ? (
                  <div className="text-slate-500 italic py-4">
                    Waiting for output from sketch. Compile and run firmware to start streaming.
                  </div>
                ) : (
                  logs.map((log) => {
                    if (log.type === 'system') {
                      return (
                        <div key={log.id} className="text-amber-400 flex items-start space-x-2">
                          <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                          <span>{log.text}</span>
                        </div>
                      );
                    }
                    if (log.type === 'stdin') {
                      return (
                        <div key={log.id} className="text-fuchsia-400 flex items-start space-x-2 font-bold">
                          <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                          <span>{log.text}</span>
                        </div>
                      );
                    }
                    return (
                      <div key={log.id} className="text-cyan-300 flex items-start space-x-2 hover:bg-slate-900/40 px-1 rounded">
                        <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                        <span className="break-all">{log.text}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Target: {component.name}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">{baudRate.toLocaleString()} baud</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCode(component.properties.code || SKETCH_TEMPLATES.mpu6050)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleCompileAndRun}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              {isCompiled ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Uploaded &amp; Running!</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Compile &amp; Run Firmware</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
