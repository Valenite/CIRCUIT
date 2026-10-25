import type { CircuitComponent, Wire } from '../types/circuit';

export interface AutoWireResult {
  wires: Wire[];
  connectionsCount: number;
  summary: string;
}

export function autoWireCircuit(components: CircuitComponent[], existingWires: Wire[] = []): AutoWireResult {
  if (components.length < 2) {
    return {
      wires: existingWires,
      connectionsCount: 0,
      summary: 'Add at least 2 components to auto-wire (e.g. a Power Source and a Load or Sensor).',
    };
  }

  const newWires: Wire[] = [...existingWires];
  let count = 0;

  // Helper to add wire if not already connected
  function connect(fromCompId: string, fromPinId: string, toCompId: string, toPinId: string, color: string) {
    const alreadyConnected = newWires.some(
      (w) =>
        (w.fromComponentId === fromCompId && w.fromPinId === fromPinId && w.toComponentId === toCompId && w.toPinId === toPinId) ||
        (w.fromComponentId === toCompId && w.fromPinId === toPinId && w.toComponentId === fromCompId && w.toPinId === fromPinId)
    );
    if (!alreadyConnected && fromCompId !== toCompId) {
      newWires.push({
        id: `auto_w_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
        fromComponentId: fromCompId,
        fromPinId: fromPinId,
        toComponentId: toCompId,
        toPinId: toPinId,
        color,
      });
      count++;
    }
  }

  // 1. Locate Power Provider (Arduino Uno, 9V Battery, or DC Supply)
  const mcu = components.find((c) => c.type === 'arduino_uno' || c.type === 'esp32');
  const battery = components.find((c) => c.type.startsWith('battery_'));

  // 2. Auto-wire Microcontroller with Sensors & Modules
  if (mcu) {
    for (const comp of components) {
      if (comp.id === mcu.id) continue;

      // Ultrasonic Sensor HC-SR04 -> Arduino Uno
      if (comp.type === 'hc_sr04') {
        const vccPin = mcu.type === 'arduino_uno' ? 'v5' : 'pin_vin';
        const gndPin = mcu.type === 'arduino_uno' ? 'gnd_1' : 'pin_gnd';
        connect(mcu.id, vccPin, comp.id, 'vcc', '#ef4444');
        connect(mcu.id, gndPin, comp.id, 'gnd', '#1e293b');
        if (mcu.type === 'arduino_uno') {
          connect(mcu.id, 'd9', comp.id, 'trig', '#3b82f6');
          connect(mcu.id, 'd10', comp.id, 'echo', '#eab308');
        }
      }

      // MPU-6050 IMU -> Arduino Uno I2C
      else if (comp.type === 'mpu_6050') {
        const vccPin = mcu.type === 'arduino_uno' ? 'v5' : 'pin_3v3';
        const gndPin = mcu.type === 'arduino_uno' ? 'gnd_1' : 'pin_gnd';
        connect(mcu.id, vccPin, comp.id, 'vcc', '#ef4444');
        connect(mcu.id, gndPin, comp.id, 'gnd', '#1e293b');
        if (mcu.type === 'arduino_uno') {
          connect(mcu.id, 'a4', comp.id, 'sda', '#3b82f6');
          connect(mcu.id, 'a5', comp.id, 'scl', '#10b981');
        }
      }

      // DHT22 Temp & Humidity -> Arduino
      else if (comp.type === 'dht22') {
        connect(mcu.id, 'v5', comp.id, 'vcc', '#ef4444');
        connect(mcu.id, 'gnd_1', comp.id, 'gnd', '#1e293b');
        connect(mcu.id, 'd2', comp.id, 'data', '#eab308');
      }

      // Servo Motor -> Arduino
      else if (comp.type === 'servo_motor') {
        connect(mcu.id, 'v5', comp.id, 'vcc', '#ef4444');
        connect(mcu.id, 'gnd_1', comp.id, 'gnd', '#1e293b');
        connect(mcu.id, 'd9', comp.id, 'signal', '#f97316');
      }
    }
  }

  // 3. Auto-wire Classic Battery DC Circuits (LED + Resistor, Buzzer, Motor)
  if (battery) {
    const resistors = components.filter((c) => c.type === 'resistor');
    const leds = components.filter((c) => c.type === 'led');
    const buzzers = components.filter((c) => c.type === 'buzzer');
    const motors = components.filter((c) => c.type === 'dc_motor');

    // LED with current-limiting resistor
    if (leds.length > 0 && resistors.length > 0) {
      const r = resistors[0];
      const l = leds[0];
      connect(battery.id, 'positive', r.id, 'pin1', '#ef4444');
      connect(r.id, 'pin2', l.id, 'anode', '#ef4444');
      connect(l.id, 'cathode', battery.id, 'negative', '#1e293b');
    }

    // Buzzer
    if (buzzers.length > 0) {
      const b = buzzers[0];
      connect(battery.id, 'positive', b.id, 'positive', '#ef4444');
      connect(b.id, 'negative', battery.id, 'negative', '#1e293b');
    }

    // DC Motor
    if (motors.length > 0) {
      const m = motors[0];
      connect(battery.id, 'positive', m.id, 'terminal1', '#ef4444');
      connect(m.id, 'terminal2', battery.id, 'negative', '#1e293b');
    }
  }

  return {
    wires: newWires,
    connectionsCount: count,
    summary:
      count > 0
        ? `Successfully auto-routed ${count} electrical connections with standardized polarities and signal nets!`
        : 'Circuit is already wired or connections are up to date.',
  };
}
