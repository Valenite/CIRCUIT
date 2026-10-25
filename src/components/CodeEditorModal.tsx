import React, { useState } from 'react';
import type { CircuitComponent } from '../types/circuit';
import { Code2, Play, X, Terminal, Check, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  component: CircuitComponent | null;
  onSaveCode: (componentId: string, newCode: string) => void;
}

const SKETCH_TEMPLATES: Record<string, string> = {
  blink: `// Blink Example Sketch
const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);   // turn the LED on
  delay(500);                  // wait for a half second
  digitalWrite(ledPin, LOW);    // turn the LED off
  delay(500);                  // wait for a half second
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
  ultrasonic: `// HC-SR04 Ultrasonic Distance Reader
const int trigPin = 9;
const int echoPin = 10;
const int ledPin = 13;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delay(2);
  digitalWrite(trigPin, HIGH);
  delay(10);
  digitalWrite(trigPin, LOW);
  
  // Flash LED on detection
  digitalWrite(ledPin, HIGH);
  delay(400);
  digitalWrite(ledPin, LOW);
  delay(400);
}
`,
};

export const CodeEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  component,
  onSaveCode,
}) => {
  if (!isOpen || !component) return null;

  const [code, setCode] = useState<string>(
    component.properties.code || SKETCH_TEMPLATES.blink
  );
  const [activeTab, setActiveTab] = useState<'editor' | 'serial'>('editor');
  const [isCompiled, setIsCompiled] = useState(false);

  const handleCompileAndRun = () => {
    onSaveCode(component.id, code);
    setIsCompiled(true);
    setTimeout(() => setIsCompiled(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>{component.name} Code Editor</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                  C++ / Wiring
                </span>
              </h2>
              <p className="text-xs text-slate-400">Compile firmware and execute live on board pins</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Templates */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Templates:</span>
            <button
              onClick={() => setCode(SKETCH_TEMPLATES.blink)}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
            >
              Standard Blink
            </button>
            <button
              onClick={() => setCode(SKETCH_TEMPLATES.fast_blink)}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
            >
              High-Speed Strobe
            </button>
            <button
              onClick={() => setCode(SKETCH_TEMPLATES.ultrasonic)}
              className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
            >
              Ultrasonic Distance
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold ${
                activeTab === 'editor' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Sketch.ino</span>
            </button>
            <button
              onClick={() => setActiveTab('serial')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold ${
                activeTab === 'serial' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Serial Monitor</span>
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
            <div className="w-full h-full p-6 font-mono text-xs text-slate-300 overflow-y-auto space-y-2">
              <div className="text-slate-500 border-b border-slate-800 pb-2">
                --- Serial Monitor (Baud Rate: 115200) ---
              </div>
              <div>[SYSTEM] Board connected on Virtual COM Port. Clock 16.000 MHz.</div>
              <div>[MCU] GPIO Pin 13 set to OUTPUT.</div>
              <div className="text-emerald-400">[LOOP] Pulse cycle running synchronously with circuit solver.</div>
              {component.properties.serialLogs?.map((log, i) => (
                <div key={i} className="text-sky-400">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Target: {component.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCode(component.properties.code || SKETCH_TEMPLATES.blink)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleCompileAndRun}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all"
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
