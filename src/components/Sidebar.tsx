import React, { useState } from 'react';
import type { ComponentType } from '../types/circuit';
import { COMPONENT_TEMPLATES } from '../constants/components';
import {
  Zap,
  Sliders,
  Cpu,
  Binary,
  ToggleLeft,
  Lightbulb,
  Gauge,
  Search,
  BookOpen,
  Sparkles,
  Bot,
  Layers,
  Activity,
  Tv,
  ChevronLeft,
  Package,
  Wind,
} from 'lucide-react';

interface Props {
  onAddComponent: (type: ComponentType) => void;
  onLoadExample: (exampleKey: string) => void;
  onSynthesizeAi: (prompt: string) => void;
}

/** Returns a tiny SVG thumbnail for a component type */
function ComponentThumbnail({ type }: { type: ComponentType }) {
  const size = 44;

  const thumbs: Partial<Record<ComponentType, React.ReactNode>> = {
    // ── Power ──────────────────────────────────────────────────────────
    battery_9v: (
      <>
        <rect x="6" y="14" width="26" height="16" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1.5"/>
        <rect x="32" y="18" width="5" height="8" rx="1.5" fill="#94a3b8"/>
        <text x="19" y="24" fill="#22d3ee" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">9V</text>
        <line x1="8" y1="22" x2="14" y2="22" stroke="#ef4444" strokeWidth="1.5"/>
        <line x1="18" y1="22" x2="24" y2="22" stroke="#0f172a" strokeWidth="1.5"/>
      </>
    ),
    ground: (
      <>
        <line x1="22" y1="6" x2="22" y2="18" stroke="#64748b" strokeWidth="2"/>
        <line x1="10" y1="18" x2="34" y2="18" stroke="#64748b" strokeWidth="2"/>
        <line x1="14" y1="23" x2="30" y2="23" stroke="#64748b" strokeWidth="2"/>
        <line x1="18" y1="28" x2="26" y2="28" stroke="#64748b" strokeWidth="2"/>
      </>
    ),
    battery_18650: (
      <>
        <rect x="10" y="8" width="18" height="28" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <rect x="15" y="6" width="8" height="3" rx="1" fill="#64748b"/>
        <text x="19" y="26" fill="#22d3ee" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">18650</text>
        <line x1="19" y1="13" x2="19" y2="17" stroke="#22c55e" strokeWidth="1.5"/>
        <line x1="17" y1="15" x2="21" y2="15" stroke="#22c55e" strokeWidth="1.5"/>
      </>
    ),
    // ── Passive ────────────────────────────────────────────────────────
    resistor: (
      <>
        <line x1="2" y1="22" x2="10" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <rect x="10" y="16" width="24" height="12" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1.5"/>
        <line x1="34" y1="22" x2="42" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="15" y1="16" x2="15" y2="28" stroke="#92400e" strokeWidth="1"/>
        <line x1="20" y1="16" x2="20" y2="28" stroke="#1e40af" strokeWidth="1"/>
        <line x1="25" y1="16" x2="25" y2="28" stroke="#1e40af" strokeWidth="1"/>
        <line x1="30" y1="16" x2="30" y2="28" stroke="#92400e" strokeWidth="1"/>
      </>
    ),
    capacitor: (
      <>
        <line x1="2" y1="22" x2="18" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="18" y1="13" x2="18" y2="31" stroke="#60a5fa" strokeWidth="3"/>
        <line x1="26" y1="13" x2="26" y2="31" stroke="#60a5fa" strokeWidth="3"/>
        <line x1="26" y1="22" x2="42" y2="22" stroke="#94a3b8" strokeWidth="2"/>
      </>
    ),
    inductor: (
      <>
        <line x1="2" y1="22" x2="8" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <path d="M8 22 Q11 14 14 22 Q17 14 20 22 Q23 14 26 22 Q29 14 32 22 Q35 14 38 22" fill="none" stroke="#a78bfa" strokeWidth="2"/>
        <line x1="38" y1="22" x2="44" y2="22" stroke="#94a3b8" strokeWidth="2"/>
      </>
    ),
    diode: (
      <>
        <line x1="2" y1="22" x2="14" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <polygon points="14,14 14,30 28,22" fill="#f59e0b" stroke="#d97706" strokeWidth="1"/>
        <line x1="28" y1="14" x2="28" y2="30" stroke="#94a3b8" strokeWidth="2.5"/>
        <line x1="28" y1="22" x2="42" y2="22" stroke="#94a3b8" strokeWidth="2"/>
      </>
    ),
    potentiometer: (
      <>
        <line x1="2" y1="22" x2="10" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <rect x="10" y="16" width="24" height="12" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1.5"/>
        <line x1="34" y1="22" x2="42" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="22" y1="16" x2="22" y2="10" stroke="#22d3ee" strokeWidth="1.5"/>
        <polygon points="20,10 22,6 24,10" fill="#22d3ee"/>
      </>
    ),
    // ── Semiconductors ─────────────────────────────────────────────────
    transistor_npn: (
      <>
        <line x1="18" y1="12" x2="18" y2="32" stroke="#94a3b8" strokeWidth="2.5"/>
        <line x1="6" y1="22" x2="18" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="18" y1="16" x2="32" y2="10" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="18" y1="28" x2="32" y2="34" stroke="#94a3b8" strokeWidth="2"/>
        <polygon points="26,32 32,34 28,28" fill="#94a3b8"/>
      </>
    ),
    led: (
      <>
        <line x1="2" y1="22" x2="14" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <polygon points="14,14 14,30 28,22" fill="#f43f5e" stroke="#e11d48" strokeWidth="1"/>
        <line x1="28" y1="14" x2="28" y2="30" stroke="#94a3b8" strokeWidth="2.5"/>
        <line x1="28" y1="22" x2="42" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="32" y1="12" x2="36" y2="8" stroke="#fbbf24" strokeWidth="1.5" opacity="0.9"/>
        <line x1="36" y1="14" x2="40" y2="10" stroke="#fbbf24" strokeWidth="1.5" opacity="0.9"/>
      </>
    ),
    // ── MCU ───────────────────────────────────────────────────────────
    arduino_uno: (
      <>
        <rect x="4" y="6" width="36" height="32" rx="3" fill="#00878a" stroke="#006264" strokeWidth="1.5"/>
        <rect x="8" y="8" width="28" height="14" rx="1" fill="#004f51" strokeWidth="0"/>
        <text x="22" y="18" fill="#00e5ff" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">UNO</text>
        <rect x="8" y="32" width="28" height="3" rx="1" fill="#004f51"/>
        {[10,14,18,22,26,30].map(x => <circle key={x} cx={x} cy={26} r="1.5" fill="#fbbf24"/>)}
      </>
    ),
    arduino_nano: (
      <>
        <rect x="10" y="4" width="24" height="36" rx="3" fill="#00878a" stroke="#006264" strokeWidth="1.5"/>
        <rect x="12" y="6" width="20" height="12" rx="1" fill="#004f51"/>
        <text x="22" y="14" fill="#00e5ff" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">NANO</text>
        {[12,16,20,24,28].map(y => <><circle cx="10" cy={y} r="1.5" fill="#fbbf24"/><circle cx="34" cy={y} r="1.5" fill="#fbbf24"/></>)}
      </>
    ),
    arduino_mega: (
      <>
        <rect x="2" y="8" width="40" height="28" rx="3" fill="#00878a" stroke="#006264" strokeWidth="1.5"/>
        <rect x="4" y="10" width="32" height="12" rx="1" fill="#004f51"/>
        <text x="20" y="18" fill="#00e5ff" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">MEGA</text>
        {[6,10,14,18,22,26,30,34,38].map(x => <circle key={x} cx={x} cy={30} r="1.2" fill="#fbbf24"/>)}
      </>
    ),
    esp32: (
      <>
        <rect x="6" y="6" width="32" height="32" rx="3" fill="#1e3a5f" stroke="#2563eb" strokeWidth="1.5"/>
        <rect x="10" y="8" width="24" height="16" rx="2" fill="#0f172a"/>
        <text x="22" y="18" fill="#38bdf8" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ESP32</text>
        <rect x="16" y="24" width="12" height="8" rx="1.5" fill="#1e40af"/>
        {[8,12,16,20,24,28,32,36].map(x => <circle key={x} cx={x} cy={7} r="1" fill="#64748b"/>)}
      </>
    ),
    esp32_s3: (
      <>
        <rect x="6" y="6" width="32" height="32" rx="3" fill="#1e3a5f" stroke="#7c3aed" strokeWidth="1.5"/>
        <rect x="10" y="8" width="24" height="16" rx="2" fill="#0f172a"/>
        <text x="22" y="18" fill="#a78bfa" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">S3</text>
        {[8,12,16,20,24,28,32,36].map(x => <circle key={x} cx={x} cy={7} r="1" fill="#64748b"/>)}
      </>
    ),
    nodemcu_esp8266: (
      <>
        <rect x="8" y="4" width="28" height="36" rx="3" fill="#1e3a5f" stroke="#0ea5e9" strokeWidth="1.5"/>
        <rect x="10" y="6" width="24" height="14" rx="1" fill="#0f172a"/>
        <text x="22" y="14" fill="#38bdf8" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="monospace">8266</text>
        {[10,14,18,22,26,30].map(y => <><circle cx="8" cy={y} r="1.5" fill="#fbbf24"/><circle cx="36" cy={y} r="1.5" fill="#fbbf24"/></>)}
      </>
    ),
    raspberry_pi_pico: (
      <>
        <rect x="6" y="4" width="32" height="36" rx="3" fill="#10b981" stroke="#059669" strokeWidth="1.5"/>
        <rect x="10" y="12" width="24" height="16" rx="2" fill="#064e3b"/>
        <text x="22" y="21" fill="#6ee7b7" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PICO</text>
        {[8,12,16,20,24,28,32,36].map(x => <circle key={x} cx={x} cy={5} r="1.2" fill="#a7f3d0"/>)}
      </>
    ),
    raspberry_pi_4: (
      <>
        <rect x="2" y="6" width="40" height="32" rx="3" fill="#c2272d" stroke="#991b1b" strokeWidth="1.5"/>
        <rect x="8" y="10" width="16" height="12" rx="2" fill="#7f1d1d"/>
        <text x="16" y="18" fill="#fca5a5" fontSize="4" fontWeight="bold" textAnchor="middle" fontFamily="monospace">RPi4</text>
        <rect x="28" y="10" width="10" height="8" rx="1" fill="#7f1d1d"/>
        <rect x="28" y="20" width="10" height="8" rx="1" fill="#1e293b"/>
      </>
    ),
    // ── Sensors ───────────────────────────────────────────────────────
    emg_sensor: (
      <>
        <rect x="4" y="8" width="36" height="28" rx="4" fill="#881337" stroke="#be123c" strokeWidth="1.5"/>
        <circle cx="14" cy="22" r="7" fill="#d97706" stroke="#fbbf24" strokeWidth="1"/>
        <circle cx="14" cy="22" r="3.5" fill="#78350f"/>
        <circle cx="30" cy="22" r="7" fill="#d97706" stroke="#fbbf24" strokeWidth="1"/>
        <circle cx="30" cy="22" r="3.5" fill="#78350f"/>
        <rect x="19" y="18" width="6" height="8" rx="1" fill="#0f172a"/>
      </>
    ),
    hc_sr04: (
      <>
        <rect x="4" y="10" width="36" height="24" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <circle cx="14" cy="22" r="7" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5"/>
        <circle cx="14" cy="22" r="4" fill="#1e3a5f"/>
        <circle cx="30" cy="22" r="7" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5"/>
        <circle cx="30" cy="22" r="4" fill="#1e3a5f"/>
        <text x="22" y="38" fill="#94a3b8" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">HC-SR04</text>
      </>
    ),
    mpu_6050: (
      <>
        <rect x="10" y="10" width="24" height="24" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <rect x="13" y="13" width="18" height="18" rx="1" fill="#0f172a"/>
        <text x="22" y="25" fill="#38bdf8" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">MPU</text>
        <text x="22" y="31" fill="#94a3b8" fontSize="4" textAnchor="middle" fontFamily="monospace">6050</text>
      </>
    ),
    dht22: (
      <>
        <rect x="10" y="4" width="24" height="32" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <rect x="12" y="6" width="20" height="22" rx="3" fill="#0f172a"/>
        <text x="22" y="19" fill="#22d3ee" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">DHT</text>
        <text x="22" y="25" fill="#94a3b8" fontSize="4.5" textAnchor="middle" fontFamily="monospace">22</text>
        {[13,17,21,25].map(x => <line key={x} x1={x} y1="36" x2={x} y2="40" stroke="#94a3b8" strokeWidth="1.5"/>)}
      </>
    ),
    pir_motion: (
      <>
        <rect x="8" y="4" width="28" height="32" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <path d="M22 10 Q34 10 34 22 Q34 34 22 34 Q10 34 10 22 Q10 10 22 10" fill="#fbbf24" opacity="0.3"/>
        <circle cx="22" cy="22" r="8" fill="#d97706" stroke="#f59e0b" strokeWidth="1.5"/>
        <circle cx="22" cy="22" r="4" fill="#78350f"/>
        <text x="22" y="42" fill="#94a3b8" fontSize="4" textAnchor="middle">PIR</text>
      </>
    ),
    mq2_gas_sensor: (
      <>
        <rect x="4" y="8" width="36" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <circle cx="22" cy="22" r="9" fill="#92400e" stroke="#d97706" strokeWidth="1.5"/>
        <circle cx="22" cy="22" r="5" fill="#78350f"/>
        <text x="22" y="40" fill="#94a3b8" fontSize="5" textAnchor="middle" fontFamily="monospace">MQ-2</text>
      </>
    ),
    soil_moisture: (
      <>
        <rect x="8" y="4" width="16" height="36" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <line x1="10" y1="28" x2="22" y2="28" stroke="#22c55e" strokeWidth="1.5"/>
        <line x1="10" y1="32" x2="22" y2="32" stroke="#22c55e" strokeWidth="1.5"/>
        <path d="M22 32 L26 36 L26 40 L28 40" stroke="#22c55e" strokeWidth="1.5" fill="none"/>
        <text x="30" y="22" fill="#94a3b8" fontSize="5" textAnchor="middle" fontFamily="monospace">🌱</text>
      </>
    ),
    ir_sensor: (
      <>
        <rect x="8" y="8" width="28" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <circle cx="16" cy="22" r="5" fill="#0f172a" stroke="#64748b" strokeWidth="1"/>
        <circle cx="28" cy="22" r="5" fill="#a21caf" opacity="0.7" stroke="#c026d3" strokeWidth="1"/>
        <text x="22" y="40" fill="#94a3b8" fontSize="5" textAnchor="middle" fontFamily="monospace">IR</text>
      </>
    ),
    flame_sensor: (
      <>
        <rect x="8" y="8" width="28" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <text x="22" y="26" fontSize="16" textAnchor="middle">🔥</text>
        <text x="22" y="40" fill="#94a3b8" fontSize="5" textAnchor="middle" fontFamily="monospace">FLAME</text>
      </>
    ),
    sound_sensor: (
      <>
        <rect x="8" y="8" width="28" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <circle cx="22" cy="22" r="7" fill="#0f172a" stroke="#64748b" strokeWidth="1"/>
        <circle cx="22" cy="22" r="3" fill="#475569"/>
        <path d="M30 15 Q36 22 30 29" stroke="#22d3ee" strokeWidth="1.5" fill="none"/>
        <path d="M33 12 Q42 22 33 32" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.5"/>
      </>
    ),
    // ── Output ────────────────────────────────────────────────────────
    dc_motor: (
      <>
        <rect x="8" y="10" width="28" height="24" rx="6" fill="#64748b" stroke="#475569" strokeWidth="1.5"/>
        <circle cx="22" cy="22" r="7" fill="#334155"/>
        <line x1="4" y1="16" x2="10" y2="16" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="4" y1="28" x2="10" y2="28" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="28" y1="22" x2="38" y2="22" stroke="#94a3b8" strokeWidth="2.5"/>
      </>
    ),
    n20_motor: (
      <>
        <rect x="4" y="14" width="24" height="16" rx="4" fill="#94a3b8" stroke="#475569" strokeWidth="1.5"/>
        <rect x="2" y="18" width="5" height="8" rx="2" fill="#334155"/>
        <line x1="2" y1="20" x2="8" y2="20" stroke="#cbd5e1" strokeWidth="1.5"/>
        <line x1="2" y1="24" x2="8" y2="24" stroke="#cbd5e1" strokeWidth="1.5"/>
        <rect x="28" y="20" width="14" height="4" rx="2" fill="#64748b"/>
      </>
    ),
    stepper_motor: (
      <>
        <rect x="4" y="8" width="36" height="28" rx="4" fill="#475569" stroke="#334155" strokeWidth="1.5"/>
        <circle cx="22" cy="22" r="8" fill="#334155"/>
        <circle cx="22" cy="22" r="3" fill="#64748b"/>
        <line x1="22" y1="14" x2="22" y2="6" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="22" y1="30" x2="22" y2="38" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="30" y1="22" x2="38" y2="22" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="14" y1="22" x2="6" y2="22" stroke="#94a3b8" strokeWidth="1.5"/>
      </>
    ),
    servo_motor: (
      <>
        <rect x="6" y="10" width="26" height="24" rx="3" fill="#475569" stroke="#334155" strokeWidth="1.5"/>
        <rect x="32" y="12" width="8" height="20" rx="2" fill="#334155"/>
        <circle cx="36" cy="22" r="5" fill="#64748b"/>
        <line x1="36" y1="22" x2="40" y2="18" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="10" y1="10" x2="10" y2="6" stroke="#ef4444" strokeWidth="1.5"/>
        <line x1="16" y1="10" x2="16" y2="6" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="22" y1="10" x2="22" y2="6" stroke="#1e293b" strokeWidth="1.5"/>
      </>
    ),
    buzzer: (
      <>
        <circle cx="22" cy="22" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <circle cx="22" cy="22" r="8" fill="#0f172a"/>
        <path d="M30 14 Q38 22 30 30" stroke="#22d3ee" strokeWidth="1.5" fill="none"/>
        <path d="M33 11 Q44 22 33 33" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.5"/>
      </>
    ),
    seven_segment: (
      <>
        <rect x="6" y="4" width="32" height="36" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
        <rect x="12" y="7" width="16" height="4" rx="1" fill="#22c55e"/>
        <rect x="8" y="9" width="4" height="13" rx="1" fill="#22c55e"/>
        <rect x="28" y="9" width="4" height="13" rx="1" fill="#22c55e"/>
        <rect x="12" y="20" width="16" height="4" rx="1" fill="#22c55e"/>
        <rect x="8" y="24" width="4" height="13" rx="1" fill="#22c55e"/>
        <rect x="28" y="24" width="4" height="13" rx="1" fill="#22c55e"/>
        <rect x="12" y="35" width="16" height="4" rx="1" fill="#22c55e"/>
      </>
    ),
    light_bulb: (
      <>
        <path d="M22 6 Q32 6 32 18 Q32 26 22 30 Q12 26 12 18 Q12 6 22 6" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" opacity="0.9"/>
        <rect x="17" y="30" width="10" height="8" rx="1" fill="#94a3b8" stroke="#64748b" strokeWidth="1"/>
      </>
    ),
    // ── Logic Gates ───────────────────────────────────────────────────
    gate_and: (
      <>
        <path d="M10 10 L10 34 L22 34 Q36 34 36 22 Q36 10 22 10 Z" fill="#1e293b" stroke="#6366f1" strokeWidth="2"/>
        <line x1="2" y1="16" x2="10" y2="16" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="2" y1="28" x2="10" y2="28" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="36" y1="22" x2="42" y2="22" stroke="#94a3b8" strokeWidth="2"/>
      </>
    ),
    gate_or: (
      <>
        <path d="M8 10 Q14 22 8 34 Q18 34 26 28 Q36 22 26 16 Q18 10 8 10 Z" fill="#1e293b" stroke="#6366f1" strokeWidth="2"/>
        <line x1="2" y1="16" x2="12" y2="16" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="2" y1="28" x2="12" y2="28" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="36" y1="22" x2="42" y2="22" stroke="#94a3b8" strokeWidth="2"/>
      </>
    ),
    gate_not: (
      <>
        <polygon points="10,10 10,34 34,22" fill="#1e293b" stroke="#6366f1" strokeWidth="2"/>
        <circle cx="36" cy="22" r="3" fill="#1e293b" stroke="#6366f1" strokeWidth="2"/>
        <line x1="2" y1="22" x2="10" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="39" y1="22" x2="44" y2="22" stroke="#94a3b8" strokeWidth="2"/>
      </>
    ),
    // ── Input ─────────────────────────────────────────────────────────
    push_button: (
      <>
        <line x1="12" y1="22" x2="18" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="26" y1="22" x2="32" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="18" y1="14" x2="18" y2="30" stroke="#94a3b8" strokeWidth="2.5"/>
        <line x1="26" y1="14" x2="26" y2="30" stroke="#94a3b8" strokeWidth="2.5"/>
        <circle cx="22" cy="18" r="5" fill="#334155" stroke="#64748b" strokeWidth="1.5"/>
      </>
    ),
    toggle_switch: (
      <>
        <rect x="6" y="16" width="32" height="12" rx="6" fill="#334155" stroke="#475569" strokeWidth="1.5"/>
        <circle cx="30" cy="22" r="7" fill="#22c55e"/>
        <line x1="2" y1="22" x2="6" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="38" y1="22" x2="42" y2="22" stroke="#94a3b8" strokeWidth="2"/>
      </>
    ),
    relay: (
      <>
        <rect x="6" y="8" width="32" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <rect x="10" y="12" width="14" height="10" rx="1" fill="#0f172a"/>
        <line x1="14" y1="26" x2="26" y2="20" stroke="#fbbf24" strokeWidth="2"/>
        <line x1="26" y1="20" x2="36" y2="20" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="26" y1="28" x2="36" y2="28" stroke="#94a3b8" strokeWidth="2"/>
      </>
    ),
    rotary_encoder: (
      <>
        <circle cx="22" cy="22" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <circle cx="22" cy="22" r="7" fill="#334155"/>
        <line x1="22" y1="8" x2="22" y2="2" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="30" y1="30" x2="36" y2="34" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="14" y1="30" x2="8" y2="34" stroke="#94a3b8" strokeWidth="1.5"/>
      </>
    ),
    joystick_module: (
      <>
        <rect x="4" y="8" width="36" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <circle cx="22" cy="22" r="8" fill="#334155" stroke="#64748b"/>
        <circle cx="22" cy="22" r="4" fill="#94a3b8"/>
        <line x1="22" y1="14" x2="22" y2="8" stroke="#64748b" strokeWidth="2"/>
      </>
    ),
    // ── Displays ─────────────────────────────────────────────────────
    oled_ssd1306: (
      <>
        <rect x="4" y="8" width="36" height="28" rx="3" fill="#0f172a" stroke="#3b82f6" strokeWidth="2"/>
        <rect x="7" y="11" width="30" height="19" rx="2" fill="#020617"/>
        <text x="22" y="22" fill="#3b82f6" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">OLED</text>
        <text x="22" y="28" fill="#1e40af" fontSize="4" textAnchor="middle" fontFamily="monospace">0.96"</text>
        {[8,14,20,26].map(x => <circle key={x} cx={x} cy={36} r="1.5" fill="#334155"/>)}
      </>
    ),
    lcd_1602_i2c: (
      <>
        <rect x="2" y="8" width="40" height="28" rx="3" fill="#1a4a1a" stroke="#22c55e" strokeWidth="1.5"/>
        <rect x="4" y="11" width="36" height="10" rx="1" fill="#1a2a1a"/>
        <rect x="4" y="23" width="36" height="10" rx="1" fill="#1a2a1a"/>
        {[7,12,17,22,27,32].map(x => <rect key={x} x={x} y="13" width="3" height="6" rx="0.5" fill="#22c55e" opacity="0.7"/>)}
        {[7,12,17].map(x => <rect key={x} x={x} y="25" width="3" height="6" rx="0.5" fill="#22c55e" opacity="0.5"/>)}
      </>
    ),
    // ── Power Modules ─────────────────────────────────────────────────
    tp4056_charger: (
      <>
        <rect x="4" y="8" width="36" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <rect x="8" y="12" width="20" height="14" rx="2" fill="#0f172a"/>
        <text x="18" y="20" fill="#3b82f6" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TP4056</text>
        <rect x="30" y="14" width="8" height="6" rx="1" fill="#2563eb"/>
      </>
    ),
    lm2596_buck: (
      <>
        <rect x="4" y="8" width="36" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <rect x="8" y="12" width="18" height="12" rx="2" fill="#0f172a"/>
        <text x="17" y="20" fill="#22d3ee" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BUCK</text>
        <path d="M30 12 Q36 12 36 18" stroke="#22d3ee" strokeWidth="2" fill="none"/>
        <circle cx="30" cy="22" r="4" fill="#334155" stroke="#475569"/>
      </>
    ),
    // ── Motor Drivers ─────────────────────────────────────────────────
    l298n: (
      <>
        <rect x="4" y="4" width="36" height="36" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <rect x="8" y="10" width="28" height="20" rx="2" fill="#0f172a"/>
        <text x="22" y="21" fill="#38bdf8" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">L298N</text>
        {[8,14,20,26,32,38].map(x => <circle key={x} cx={x} cy={6} r="1.5" fill="#fbbf24"/>)}
        {[8,14,20,26,32,38].map(x => <circle key={x} cx={x} cy={38} r="1.5" fill="#fbbf24"/>)}
      </>
    ),
    tb6612fng: (
      <>
        <rect x="8" y="8" width="28" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <rect x="11" y="11" width="22" height="16" rx="1" fill="#0f172a"/>
        <text x="22" y="21" fill="#38bdf8" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TB6612</text>
        {[10,15,20,25,30,34].map(x => <circle key={x} cx={x} cy={36} r="1.2" fill="#fbbf24"/>)}
      </>
    ),
    a4988: (
      <>
        <rect x="8" y="8" width="28" height="28" rx="2" fill="#2d1b69" stroke="#6d28d9" strokeWidth="1.5"/>
        <rect x="11" y="11" width="22" height="14" rx="1" fill="#1e0f4a"/>
        <text x="22" y="20" fill="#a78bfa" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">A4988</text>
        {[10,15,20,25,30,34].map(x => <circle key={x} cx={x} cy={8} r="1.2" fill="#c4b5fd"/>)}
        {[10,15,20,25,30,34].map(x => <circle key={x} cx={x} cy={36} r="1.2" fill="#c4b5fd"/>)}
      </>
    ),
    // ── Instruments ───────────────────────────────────────────────────
    multimeter: (
      <>
        <rect x="8" y="4" width="28" height="36" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <rect x="11" y="8" width="22" height="14" rx="2" fill="#0f172a"/>
        <text x="22" y="17" fill="#22c55e" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">12.5</text>
        <circle cx="22" cy="30" r="5" fill="#0f172a" stroke="#475569"/>
        <line x1="22" y1="25" x2="22" y2="28" stroke="#ef4444" strokeWidth="2"/>
      </>
    ),
    oscilloscope: (
      <>
        <rect x="4" y="6" width="36" height="28" rx="3" fill="#0f172a" stroke="#1e3a5f" strokeWidth="1.5"/>
        <rect x="7" y="9" width="24" height="14" rx="1" fill="#020617"/>
        <path d="M8 16 Q12 10 16 16 Q20 22 24 16 Q28 10 30 16" stroke="#22c55e" strokeWidth="1.5" fill="none"/>
        <circle cx="36" cy="14" r="4" fill="#1e293b" stroke="#475569"/>
        <circle cx="36" cy="26" r="4" fill="#1e293b" stroke="#475569"/>
      </>
    ),
    // ── Modules ───────────────────────────────────────────────────────
    opamp: (
      <>
        <polygon points="8,8 8,36 36,22" fill="#1e293b" stroke="#6366f1" strokeWidth="2"/>
        <line x1="2" y1="14" x2="8" y2="14" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="2" y1="30" x2="8" y2="30" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="36" y1="22" x2="42" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <text x="17" y="19" fill="#6366f1" fontSize="8">+</text>
        <text x="17" y="30" fill="#6366f1" fontSize="8">-</text>
      </>
    ),
    timer_555: (
      <>
        <rect x="8" y="8" width="28" height="28" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <rect x="11" y="11" width="22" height="16" rx="1" fill="#0f172a"/>
        <text x="22" y="21" fill="#fbbf24" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">555</text>
        {[10,16,22,28].map(x => <circle key={x} cx={x} cy={8} r="1.5" fill="#fbbf24"/>)}
        {[10,16,22,28].map(x => <circle key={x} cx={x} cy={36} r="1.5" fill="#fbbf24"/>)}
      </>
    ),
    breadboard_mini: (
      <>
        <rect x="4" y="8" width="36" height="28" rx="2" fill="#d4c7a0" stroke="#c2a656" strokeWidth="1.5"/>
        {[8,12,16,20,24,28,32,36,40].map(x =>
          [12,16,20,24,28,32].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#8b6914"/>)
        )}
      </>
    ),
    matrix_8x8: (
      <>
        <rect x="2" y="6" width="40" height="32" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1.5"/>
        {[6,10,14,18,22,26,30,34,38].map(x =>
          [10,14,18,22,26,30].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="#ef4444" opacity="0.6"/>)
        )}
      </>
    ),
    keypad_4x4: (
      <>
        <rect x="6" y="4" width="32" height="36" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        {[12,18,24,30].map(x =>
          [10,17,24,31].map(y => <rect key={`${x}-${y}`} x={x-4} y={y-4} width="7" height="6" rx="1" fill="#334155" stroke="#475569" strokeWidth="0.5"/>)
        )}
      </>
    ),
    vibration_motor: (
      <>
        <rect x="8" y="14" width="22" height="16" rx="4" fill="#94a3b8" stroke="#475569" strokeWidth="1.5"/>
        <circle cx="30" cy="22" r="5" fill="#475569"/>
        <line x1="2" y1="19" x2="8" y2="19" stroke="#ef4444" strokeWidth="2"/>
        <line x1="2" y1="25" x2="8" y2="25" stroke="#1e293b" strokeWidth="2"/>
      </>
    ),
    solenoid: (
      <>
        <rect x="4" y="12" width="30" height="20" rx="3" fill="#334155" stroke="#475569" strokeWidth="1.5"/>
        {[8,12,16,20,24,28].map(x => <line key={x} x1={x} y1="12" x2={x} y2="32" stroke="#94a3b8" strokeWidth="1" opacity="0.5"/>)}
        <rect x="34" y="18" width="8" height="8" rx="1" fill="#64748b"/>
        <line x1="2" y1="18" x2="4" y2="18" stroke="#ef4444" strokeWidth="2"/>
        <line x1="2" y1="26" x2="4" y2="26" stroke="#1e293b" strokeWidth="2"/>
      </>
    ),
    led_rgb: (
      <>
        <polygon points="8,14 8,30 22,22" fill="#1e293b" stroke="#94a3b8" strokeWidth="1"/>
        <line x1="22" y1="14" x2="22" y2="30" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="2" y1="22" x2="8" y2="22" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="22" y1="22" x2="36" y2="22" stroke="#94a3b8" strokeWidth="1.5"/>
        <line x1="30" y1="12" x2="34" y2="8" stroke="#ef4444" strokeWidth="1.5"/>
        <line x1="34" y1="14" x2="38" y2="10" stroke="#22c55e" strokeWidth="1.5"/>
        <line x1="30" y1="10" x2="34" y2="6" stroke="#3b82f6" strokeWidth="1.5"/>
      </>
    ),
    mosfet_n: (
      <>
        <line x1="2" y1="22" x2="16" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="16" y1="12" x2="16" y2="32" stroke="#94a3b8" strokeWidth="3"/>
        <line x1="20" y1="14" x2="20" y2="20" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="20" y1="24" x2="20" y2="30" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="20" y1="17" x2="32" y2="11" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="20" y1="27" x2="32" y2="33" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="20" y1="22" x2="32" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <polygon points="26,22 30,20 30,24" fill="#94a3b8"/>
      </>
    ),
    ac_source: (
      <>
        <circle cx="22" cy="22" r="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <path d="M12 22 Q15 14 18 22 Q21 30 24 22 Q27 14 30 22" fill="none" stroke="#fbbf24" strokeWidth="2"/>
        <line x1="2" y1="22" x2="8" y2="22" stroke="#94a3b8" strokeWidth="2"/>
        <line x1="36" y1="22" x2="42" y2="22" stroke="#94a3b8" strokeWidth="2"/>
      </>
    ),
  };

  const svgContent = thumbs[type];

  // Fallback: generic chip thumbnail
  const fallback = (
    <>
      <rect x="8" y="8" width="28" height="28" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
      {[12,18,24,30].map(x => <circle key={`t${x}`} cx={x} cy="8" r="1.5" fill="#94a3b8"/>)}
      {[12,18,24,30].map(x => <circle key={`b${x}`} cx={x} cy="36" r="1.5" fill="#94a3b8"/>)}
      <rect x="12" y="13" width="20" height="18" rx="1" fill="#0f172a"/>
      <text x="22" y="25" fill="#475569" fontSize="5" textAnchor="middle" fontFamily="monospace">IC</text>
    </>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {svgContent ?? fallback}
    </svg>
  );
}

export const Sidebar: React.FC<Props> = ({
  onAddComponent,
  onLoadExample,
  onSynthesizeAi,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'parts' | 'starters'>('parts');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { name: 'All', icon: Zap },
    { name: 'Microcontrollers', icon: Bot },
    { name: 'Modules', icon: Layers },
    { name: 'Sensors', icon: Activity },
    { name: 'Displays', icon: Tv },
    { name: 'Power', icon: Zap },
    { name: 'Passive', icon: Sliders },
    { name: 'Semiconductors', icon: Cpu },
    { name: 'Logic Gates', icon: Binary },
    { name: 'Input', icon: ToggleLeft },
    { name: 'Output', icon: Lightbulb },
    { name: 'Motors', icon: Wind },
    { name: 'Instruments', icon: Gauge },
  ];

  const templates = Object.values(COMPONENT_TEMPLATES).filter((tmpl) => {
    const matchesSearch =
      tmpl.title.toLowerCase().includes(search.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(search.toLowerCase()) ||
      tmpl.type.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || tmpl.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
      {/* Sleek Compact Floating Dock */}
      <div className="pointer-events-auto absolute top-4 left-4 flex flex-col items-center bg-[#070b14]/90 border border-slate-800/90 rounded-2xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.7)] backdrop-blur-md space-y-1.5 transition-all">
        <button
          onClick={() => {
            if (isOpen && activeTab === 'parts') {
              setIsOpen(false);
            } else {
              setActiveTab('parts');
              setIsOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${
            isOpen && activeTab === 'parts'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
          }`}
          title="Component Parts Library"
        >
          <Package className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1 tracking-tight">Parts</span>
        </button>

        <div className="w-7 h-px bg-slate-800/80" />

        <button
          onClick={() => {
            if (isOpen && activeTab === 'starters') {
              setIsOpen(false);
            } else {
              setActiveTab('starters');
              setIsOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all cursor-pointer ${
            isOpen && activeTab === 'starters'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
          }`}
          title="Starter Circuits & Examples"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1 tracking-tight">Examples</span>
        </button>
      </div>

      {/* Slide-out Floating Drawer Panel */}
      {isOpen && (
        <aside className="pointer-events-auto absolute top-4 left-20 bottom-4 w-80 bg-[#0a0f1d]/95 border border-slate-800/90 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.85)] backdrop-blur-xl flex flex-col z-30 animate-in slide-in-from-left-4 fade-in duration-200 overflow-hidden">
          {/* Header with Title and Close button */}
          <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
              {activeTab === 'parts' ? 'Component Library' : 'Starter Examples'}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {activeTab === 'parts' ? (
            <>
              {/* Search Bar */}
              <div className="p-3 border-b border-slate-800/80">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search parts (e.g. TB6612, ESP32, N20)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-medium"
                    autoFocus
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-1.5 p-2 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Component Item Cards with Thumbnails */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                <div className="text-[10px] text-slate-500 px-1 pt-1 font-mono uppercase tracking-wider flex justify-between">
                  <span>{templates.length} PARTS</span>
                  <span>CLICK TO ADD</span>
                </div>

                {templates.map((tmpl) => (
                  <div
                    key={tmpl.type}
                    onClick={() => {
                      onAddComponent(tmpl.type);
                    }}
                    className="group flex items-center gap-3 p-2 bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800/80 hover:border-cyan-500/50 rounded-xl cursor-pointer transition-all shadow-sm"
                  >
                    {/* SVG Thumbnail */}
                    <div className="w-11 h-11 shrink-0 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/30 transition-colors">
                      <ComponentThumbnail type={tmpl.type} />
                    </div>

                    {/* Text Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                          {tmpl.title}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{tmpl.category}</div>
                      <div className="text-[10px] text-slate-600 line-clamp-1 mt-0.5">{tmpl.description}</div>
                    </div>

                    <button className="text-xs px-2 py-1 bg-slate-800/80 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-300 rounded-lg font-bold transition-all shrink-0">
                      +
                    </button>
                  </div>
                ))}

                {/* AI SYNTHESIS TRIGGER */}
                {templates.length === 0 && search.trim().length > 0 && (
                  <div className="p-4 bg-slate-900/90 border border-cyan-500/40 rounded-2xl text-center space-y-3 m-1 shadow-lg animate-in fade-in zoom-in-95">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-cyan-400">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">No built-in part for "{search}"</div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                        Research & synthesize it automatically with AI with full pinouts
                      </div>
                    </div>
                    <button
                      onClick={() => onSynthesizeAi(search)}
                      className="w-full py-2 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Synthesize "{search}" with AI</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Starter Circuits List */
            <div className="p-3 space-y-2 flex-1 overflow-y-auto">
              <p className="text-xs text-slate-400 mb-3">Load pre-built starter schematics to test and learn:</p>
              <button
                onClick={() => {
                  onLoadExample('led_simple');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-slate-200 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-cyan-300">💡 LED & Current Limiting Resistor</div>
                <div className="text-[11px] text-slate-400">Basic DC circuit with 9V battery, 220Ω resistor, and LED</div>
              </button>

              <button
                onClick={() => {
                  onLoadExample('pot_dimmer');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-slate-200 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-cyan-300">🎚️ Potentiometer Dimmer</div>
                <div className="text-[11px] text-slate-400">Voltage divider with adjustable rotary potentiometer</div>
              </button>

              <button
                onClick={() => {
                  onLoadExample('transistor_switch');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-slate-200 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-cyan-300">🔌 Transistor BJT Switch</div>
                <div className="text-[11px] text-slate-400">NPN transistor driving a load from base switch</div>
              </button>

              <button
                onClick={() => {
                  onLoadExample('logic_and_demo');
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-slate-200 transition-all cursor-pointer space-y-1"
              >
                <div className="text-xs font-bold text-cyan-300">🔀 74HC08 Dual Input AND Gate</div>
                <div className="text-[11px] text-slate-400">Digital logic verification with tactile inputs</div>
              </button>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};
