import type { Pin } from '../types/circuit';

export function getPinShortLabel(pin: Pin): string {
  if (pin.label) return pin.label;

  const id = pin.id.toLowerCase();
  const name = pin.name.toLowerCase();

  if (id.includes('anode') || name.includes('anode')) return '+';
  if (id.includes('cathode') || name.includes('cathode')) return '-';
  if (id.includes('positive') || id === 'vin' || id.includes('pos')) return '+';
  if (id.includes('negative') || id.includes('neg') || id.includes('gnd')) return '-';
  if (id.includes('pin1a') || id.includes('terminal 1a')) return '1';
  if (id.includes('pin1b') || id.includes('terminal 1b')) return '1';
  if (id.includes('pin2a') || id.includes('terminal 2a')) return '2';
  if (id.includes('pin2b') || id.includes('terminal 2b')) return '2';
  if (id.includes('terminal1') || id === 'pin1') return '1';
  if (id.includes('terminal2') || id === 'pin2') return '2';
  if (id.includes('wiper') || name.includes('wiper')) return 'WIP';
  if (id.includes('collector') || name.includes('collector')) return 'C';
  if (id.includes('base') || name.includes('base')) return 'B';
  if (id.includes('emitter') || name.includes('emitter')) return 'E';
  if (id.includes('drain') || name.includes('drain')) return 'D';
  if (id.includes('gate') || name.includes('gate')) return 'G';
  if (id.includes('source') || name.includes('source')) return 'S';
  if (id.includes('trig') || name.includes('trig')) return 'TRIG';
  if (id.includes('echo') || name.includes('echo')) return 'ECHO';
  if (id.includes('sda') || name.includes('sda')) return 'SDA';
  if (id.includes('scl') || name.includes('scl')) return 'SCL';
  if (id.includes('data') || name.includes('data')) return 'DATA';
  if (id.includes('terminal1') || id.includes('pin1')) return 'T1';
  if (id.includes('terminal2') || id.includes('pin2')) return 'T2';

  // For Arduino pins: d0 - d13, a0 - a5
  const dMatch = id.match(/d(\d+)/);
  if (dMatch) return `D${dMatch[1]}`;
  const aMatch = id.match(/a(\d+)/);
  if (aMatch) return `A${aMatch[1]}`;

  // If short name already
  if (pin.name.length <= 6) return pin.name;

  return pin.name.split(/[\s(]/)[0].toUpperCase();
}

export function getPinBadgeColor(pin: Pin): { bg: string; text: string; border: string } {
  if (pin.isPositive || pin.id.includes('pos') || pin.id.includes('vcc')) {
    return { bg: '#450a0a', text: '#f87171', border: '#ef4444' };
  }
  if (pin.isNegative || pin.id.includes('neg') || pin.id.includes('gnd')) {
    return { bg: '#0f172a', text: '#94a3b8', border: '#475569' };
  }
  if (pin.isPwm || pin.id.includes('pwm')) {
    return { bg: '#172554', text: '#60a5fa', border: '#3b82f6' };
  }
  if (pin.isAnalog || pin.id.includes('analog') || pin.id.startsWith('a')) {
    return { bg: '#052e16', text: '#4ade80', border: '#22c55e' };
  }
  return { bg: '#1e1b4b', text: '#c084fc', border: '#8b5cf6' };
}
