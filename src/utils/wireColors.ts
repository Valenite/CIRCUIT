import type { Pin, Wire, CircuitComponent } from '../types/circuit';

// Vibrant clean signal wire palette
const SIGNAL_PALETTE = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#eab308', // Yellow
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

let signalColorIndex = 0;

export function getAutoWireColor(
  fromComp: CircuitComponent | undefined,
  fromPin: Pin | undefined,
  toComp: CircuitComponent | undefined,
  toPin: Pin | undefined,
  existingWires: Wire[]
): string {
  // 1. Check if either pin is Power Rail (VCC, VIN, 5V, 3V3, VM, positive)
  const isFromPower = isPowerPin(fromPin);
  const isToPower = isPowerPin(toPin);
  if (isFromPower || isToPower) {
    return '#ef4444'; // Red for VCC / Power Rail
  }

  // 2. Check if either pin is Ground Rail (GND, COM, negative)
  const isFromGnd = isGndPin(fromPin);
  const isToGnd = isGndPin(toPin);
  if (isFromGnd || isToGnd) {
    return '#475569'; // Slate-600 — visible dark grey for Ground Rail
  }

  // 3. Check if either pin is part of an existing wire / junction (Inherit rail / net color!)
  if (fromComp && fromPin) {
    const existing = existingWires.find(
      (w) =>
        (w.fromComponentId === fromComp.id && w.fromPinId === fromPin.id) ||
        (w.toComponentId === fromComp.id && w.toPinId === fromPin.id)
    );
    if (existing) {
      return existing.color;
    }
  }

  if (toComp && toPin) {
    const existing = existingWires.find(
      (w) =>
        (w.fromComponentId === toComp.id && w.fromPinId === toPin.id) ||
        (w.toComponentId === toComp.id && w.toPinId === toPin.id)
    );
    if (existing) {
      return existing.color;
    }
  }

  // 4. Otherwise, rotate to a fresh, distinct color for this new signal connection
  const color = SIGNAL_PALETTE[signalColorIndex % SIGNAL_PALETTE.length];
  signalColorIndex++;
  return color;
}

function isPowerPin(pin: Pin | undefined): boolean {
  if (!pin) return false;
  if (pin.isPositive) return true;
  const str = `${pin.id} ${pin.name}`.toLowerCase();
  return (
    str.includes('vcc') ||
    str.includes('vin') ||
    str.includes('5v') ||
    str.includes('3v3') ||
    str.includes('3.3v') ||
    str.includes('vm') ||
    str.includes('pos') ||
    str.includes('anode') ||
    str.includes('+')
  );
}

function isGndPin(pin: Pin | undefined): boolean {
  if (!pin) return false;
  if (pin.isNegative) return true;
  const str = `${pin.id} ${pin.name}`.toLowerCase();
  return (
    str.includes('gnd') ||
    str.includes('ground') ||
    str.includes('neg') ||
    str.includes('cathode') ||
    str.includes('com_gnd') ||
    str.includes('-')
  );
}
