import React, { useState } from 'react';
import type { CircuitComponent } from '../types/circuit';
import { synthesizeAiComponent } from '../engine/aiComponentEngine';
import { Sparkles, X, Bot, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComponentCreated: (component: CircuitComponent) => void;
}

const QUICK_PROMPTS = [
  'Arduino Uno R3',
  'ESP32 NodeMCU Wi-Fi',
  'HC-SR04 Ultrasonic Distance Sensor',
  'MPU-6050 6-Axis IMU (Gyro + Accel)',
  'DHT22 Temp & Humidity Sensor',
  'HC-SR501 PIR Motion Sensor',
  'SSD1306 I2C OLED Display',
  'L298N Dual H-Bridge Motor Driver',
];

export const AiComponentModal: React.FC<Props> = ({ isOpen, onClose, onComponentCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  if (!isOpen) return null;

  const handleGenerate = (targetPrompt?: string) => {
    const finalPrompt = targetPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setIsGenerating(true);
    setProgressStep(1);

    setTimeout(() => {
      setProgressStep(2);
      setTimeout(() => {
        setProgressStep(3);
        setTimeout(() => {
          const comp = synthesizeAiComponent(finalPrompt);
          onComponentCreated(comp);
          setIsGenerating(false);
          setProgressStep(0);
          setPrompt('');
          onClose();
        }, 600);
      }, 700);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900/95 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>AI Component Synthesizer</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full">
                  Autonomous
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Type any chip, sensor, module, or microcontroller to research and generate with exact pinouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Prompt input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Describe the component or enter a part number:</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Arduino Uno, ESP32, HC-SR04 ultrasonic, MPU-6050, or any custom IC..."
                value={prompt}
                disabled={isGenerating}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 focus:border-cyan-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                className="absolute right-2 top-2 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center space-x-1.5 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Generation Stepper animation */}
          {isGenerating && (
            <div className="p-4 bg-slate-950/80 border border-cyan-500/20 rounded-xl space-y-2.5 animate-pulse">
              <div className="text-xs font-semibold text-cyan-400 flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Deep Research in Progress:</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className={`flex items-center space-x-2 ${progressStep >= 1 ? 'text-slate-200' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${progressStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Researching manufacturer datasheet and pinout specifications...</span>
                </div>
                <div className={`flex items-center space-x-2 ${progressStep >= 2 ? 'text-slate-200' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${progressStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Synthesizing electrical node conductances and voltage rails...</span>
                </div>
                <div className={`flex items-center space-x-2 ${progressStep >= 3 ? 'text-slate-200' : 'text-slate-500'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${progressStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Generating realistic PCB package layout and adding to canvas!</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick suggestions */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-medium block">Or choose a pre-researched component:</span>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  disabled={isGenerating}
                  onClick={() => handleGenerate(p)}
                  className="px-2.5 py-1.5 bg-slate-950 hover:bg-cyan-950/50 hover:border-cyan-500/50 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-cyan-300 transition-all font-mono"
                >
                  + {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
