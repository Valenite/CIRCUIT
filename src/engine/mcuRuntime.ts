// Embedded Microcontroller Runtime Engine (Arduino Uno, ESP32, Nano, etc.)
// Simulates GPIO switching, PWM, I2C/SPI sensor reading, and real-time Serial output

import type { CircuitComponent } from '../types/circuit';

export interface SerialLogEntry {
  id: string;
  timestamp: string;
  text: string;
  type?: 'stdout' | 'system' | 'stdin' | 'error';
}

export interface McuRuntimeState {
  pinVoltages: Record<string, number>; // pinId -> voltage (0 to 5V)
  pinModes: Record<string, 'INPUT' | 'OUTPUT'>;
  serialLogs: SerialLogEntry[];
  baudRate: number;
}

export class McuRuntime {
  private activeState: McuRuntimeState = {
    pinVoltages: {},
    pinModes: {},
    serialLogs: [],
    baudRate: 9600,
  };

  private logs: SerialLogEntry[] = [];
  private lastEmitTime = 0;
  private isInitialized = false;
  private currentCodeHash = '';

  public clearLogs() {
    this.logs = [];
  }

  public addStdinLog(text: string) {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    this.logs.push({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      text: `> ${text}`,
      type: 'stdin',
    });
    if (this.logs.length > 500) {
      this.logs.splice(0, this.logs.length - 500);
    }
  }

  public executeCodeStep(
    componentId: string,
    code: string,
    timeMs: number,
    components: CircuitComponent[] = []
  ): McuRuntimeState {
    const result: McuRuntimeState = {
      pinVoltages: {},
      pinModes: {},
      serialLogs: this.logs,
      baudRate: this.activeState.baudRate,
    };

    if (!code) return result;

    // Detect code change or MCU change
    const codeHash = `${componentId}:${code.length}:${code.substring(0, 40)}`;
    if (codeHash !== this.currentCodeHash) {
      this.currentCodeHash = codeHash;
      this.isInitialized = false;
    }

    // 1. Detect Baud Rate from Serial.begin(...)
    const baudMatch = code.match(/Serial\.begin\s*\(\s*(\d+)\s*\)/i);
    let baud = this.activeState.baudRate || 9600;
    if (baudMatch && baudMatch[1]) {
      baud = parseInt(baudMatch[1], 10);
      result.baudRate = baud;
    }

    // Initial system announcement when sketch starts
    if (!this.isInitialized) {
      this.isInitialized = true;
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      this.logs.push({
        id: `sys_start_${Date.now()}`,
        timestamp: timeStr,
        text: `[SYSTEM] Firmware uploaded to ${componentId}. Serial port opened at ${baud} baud.`,
        type: 'system',
      });
    }

    // 2. Detect delay interval e.g. delay(200)
    let delayMs = 300;
    const delayMatch = code.match(/delay\s*\(\s*(\d+)\s*\)/i);
    if (delayMatch && delayMatch[1]) {
      delayMs = Math.max(80, Math.min(3000, parseInt(delayMatch[1], 10)));
    }

    // 3. Pin Output Toggle (like Blink)
    const period = delayMs * 2;
    const isHighPhase = (timeMs % period) < delayMs;

    let targetPin = 'd13';
    if (code.includes('pinMode(2') || code.includes('digitalWrite(2')) {
      targetPin = 'pin_g2';
    } else if (code.includes('pinMode(13') || code.includes('digitalWrite(13') || code.includes('ledPin')) {
      targetPin = 'd13';
    }

    result.pinVoltages[`${componentId}:${targetPin}`] = isHighPhase ? 5.0 : 0.0;
    result.pinVoltages[`${componentId}:v5`] = 5.0;
    result.pinVoltages[`${componentId}:v3_3`] = 3.3;
    result.pinVoltages[`${componentId}:pin_3v3`] = 3.3;
    result.pinVoltages[`${componentId}:pin_vin`] = 5.0;

    // 4. Find connected sensors on the canvas for live telemetry
    const imu = components.find((c) => c.type === 'mpu_6050');
    const ultrasonic = components.find((c) => c.type === 'hc_sr04');
    const dht = components.find((c) => c.type === 'dht22');
    const pir = components.find((c) => c.type === 'pir_motion');
    const pot = components.find((c) => c.type === 'potentiometer');

    // MPU-6050 data
    const pitch = imu?.properties.imuTilt?.pitch ?? 0;
    const roll = imu?.properties.imuTilt?.roll ?? 0;
    const yaw = imu?.properties.imuTilt?.yaw ?? 0;

    const radP = (pitch * Math.PI) / 180;
    const radR = (roll * Math.PI) / 180;
    // Calculate realistic acceleration components in g (1g gravity vector)
    const ax_g = Math.sin(radP);
    const ay_g = -Math.sin(radR);
    const az_g = Math.cos(radP) * Math.cos(radR);
    // Raw 16-bit accelerometer values (16384 LSB/g)
    const rawAx = Math.round(ax_g * 16384);
    const rawAy = Math.round(ay_g * 16384);
    const rawAz = Math.round(az_g * 16384);
    // Gyroscope angular rates
    const gx_dps = (roll * 1.5);
    const gy_dps = (pitch * 1.5);
    const gz_dps = (yaw * 0.8);
    const rawGx = Math.round(gx_dps * 131.0);
    const rawGy = Math.round(gy_dps * 131.0);
    const rawGz = Math.round(gz_dps * 131.0);
    const imuTemp = 24.5 + (Math.abs(pitch) + Math.abs(roll)) * 0.05;

    // Ultrasonic data
    const distCm = ultrasonic?.properties.distanceCm ?? 25;

    // DHT data
    const tempC = dht?.properties.temperature ?? 24;
    const humPct = dht?.properties.humidity ?? 55;

    // Potentiometer data
    const potVal = pot?.properties.potValue ?? 512;
    // PIR Motion data
    const motionActive = pir?.properties.motionDetected ?? false;

    // 5. Run Serial Print Generation at the delay interval
    if (timeMs - this.lastEmitTime >= delayMs) {
      this.lastEmitTime = timeMs;

      // Extract setup and loop blocks or scan all Serial.print/println statements
      const linesToEmit: string[] = [];

      // Check if code contains MPU6050 keywords
      const isMpuCode =
        /mpu/i.test(code) ||
        /imu/i.test(code) ||
        /gyro/i.test(code) ||
        /accel/i.test(code) ||
        /pitch/i.test(code);

      // Check if code contains ultrasonic / distance keywords
      const isDistanceCode = /distance|ultrasonic|ping|trig/i.test(code);

      // Check if code contains DHT keywords
      const isDhtCode = /dht|humidity|temperature/i.test(code);

      // Interpret explicit Serial.print / Serial.println in the code
      const serialRegex = /Serial\.(println|print)\s*\((.*?)\);/g;
      let match: RegExpExecArray | null;
      let lineAccumulator = '';
      let foundAnySerial = false;

      while ((match = serialRegex.exec(code)) !== null) {
        foundAnySerial = true;
        const isPrintln = match[1] === 'println';
        const rawArg = match[2].trim();

        let valStr = '';
        if (rawArg === '') {
          valStr = '';
        } else if (rawArg.startsWith('"') && rawArg.endsWith('"')) {
          valStr = rawArg.slice(1, -1);
        } else if (rawArg.startsWith("'") && rawArg.endsWith("'")) {
          valStr = rawArg.slice(1, -1);
        } else {
          // Dynamic variable evaluation
          valStr = this.evaluateSerialExpression(rawArg, {
            pitch,
            roll,
            yaw,
            ax: ax_g,
            ay: ay_g,
            az: az_g,
            rawAx,
            rawAy,
            rawAz,
            gx: gx_dps,
            gy: gy_dps,
            gz: gz_dps,
            rawGx,
            rawGy,
            rawGz,
            temp: imuTemp,
            distance: distCm,
            distCm,
            temperature: tempC,
            humidity: humPct,
            potVal,
            motionActive,
          });
        }

        lineAccumulator += valStr;
        if (isPrintln) {
          linesToEmit.push(lineAccumulator);
          lineAccumulator = '';
        }
      }

      if (lineAccumulator.length > 0) {
        linesToEmit.push(lineAccumulator);
      }

      // If no explicit Serial statements matched, provide smart contextual output
      if (!foundAnySerial) {
        if (isMpuCode) {
          linesToEmit.push(
            `[MPU-6050] Pitch: ${pitch}° | Roll: ${roll}° | Yaw: ${yaw}° | Ax: ${ax_g.toFixed(2)}g Ay: ${ay_g.toFixed(2)}g Az: ${az_g.toFixed(2)}g`
          );
        } else if (isDistanceCode) {
          linesToEmit.push(`[HC-SR04] Distance: ${distCm} cm | ToF: ${Math.round((distCm * 2) / 0.0343)} µs`);
        } else if (isDhtCode) {
          linesToEmit.push(`[DHT22] Temperature: ${tempC}°C | Humidity: ${humPct}% RH`);
        } else if (/pir|motion/i.test(code)) {
          linesToEmit.push(`[PIR] Motion: ${motionActive ? 'DETECTED (HIGH)' : 'IDLE (LOW)'}`);
        } else {
          // Standard blink heartbeat
          linesToEmit.push(`[PIN 13] State: ${isHighPhase ? 'HIGH (5V)' : 'LOW (0V)'} - Loop step @ ${timeMs % 10000}ms`);
        }
      }

      // Add to logs buffer
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      for (const line of linesToEmit) {
        this.logs.push({
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          timestamp: timeStr,
          text: line,
          type: 'stdout',
        });
      }

      // Cap at 300 entries to maintain smooth DOM performance
      if (this.logs.length > 300) {
        this.logs.splice(0, this.logs.length - 300);
      }
    }

    result.serialLogs = [...this.logs];
    this.activeState = result;
    return result;
  }

  private evaluateSerialExpression(expr: string, ctx: Record<string, any>): string {
    // Handle format specifiers like (val, 1) or (val, 2)
    const formatMatch = expr.match(/^([^,]+),\s*(\d+)$/);
    let target = expr;
    let decimals: number | null = null;
    if (formatMatch) {
      target = formatMatch[1].trim();
      decimals = parseInt(formatMatch[2], 10);
    }

    // Direct variable mapping
    const lower = target.toLowerCase();
    if (lower === 'pitch') return decimals !== null ? ctx.pitch.toFixed(decimals) : String(ctx.pitch);
    if (lower === 'roll') return decimals !== null ? ctx.roll.toFixed(decimals) : String(ctx.roll);
    if (lower === 'yaw') return decimals !== null ? ctx.yaw.toFixed(decimals) : String(ctx.yaw);
    if (lower === 'ax' || lower === 'a.acceleration.x') return decimals !== null ? ctx.ax.toFixed(decimals) : String(ctx.ax.toFixed(2));
    if (lower === 'ay' || lower === 'a.acceleration.y') return decimals !== null ? ctx.ay.toFixed(decimals) : String(ctx.ay.toFixed(2));
    if (lower === 'az' || lower === 'a.acceleration.z') return decimals !== null ? ctx.az.toFixed(decimals) : String(ctx.az.toFixed(2));
    if (lower.includes('ax / 16384') || lower.includes('ax/16384')) return decimals !== null ? ctx.ax.toFixed(decimals) : String(ctx.ax.toFixed(2));
    if (lower.includes('ay / 16384') || lower.includes('ay/16384')) return decimals !== null ? ctx.ay.toFixed(decimals) : String(ctx.ay.toFixed(2));
    if (lower.includes('az / 16384') || lower.includes('az/16384')) return decimals !== null ? ctx.az.toFixed(decimals) : String(ctx.az.toFixed(2));
    if (lower === 'gx' || lower === 'g.gyro.x') return decimals !== null ? ctx.gx.toFixed(decimals) : String(ctx.gx.toFixed(1));
    if (lower === 'gy' || lower === 'g.gyro.y') return decimals !== null ? ctx.gy.toFixed(decimals) : String(ctx.gy.toFixed(1));
    if (lower === 'gz' || lower === 'g.gyro.z') return decimals !== null ? ctx.gz.toFixed(decimals) : String(ctx.gz.toFixed(1));
    if (lower === 'temp' || lower === 'temperature') return decimals !== null ? ctx.temp.toFixed(decimals) : String(ctx.temp.toFixed(1));
    if (lower === 'distance' || lower === 'distcm') return String(ctx.distance);
    if (lower === 'humidity') return String(ctx.humidity);
    if (lower === 'potval' || lower === 'analogread(a0)' || lower === 'analogread(0)') return String(ctx.potVal);

    // If it's a numeric literal
    if (!isNaN(Number(target))) {
      return decimals !== null ? Number(target).toFixed(decimals) : target;
    }

    // Try evaluating standard simple math or fallback
    try {
      // Replace known identifiers
      const substituted = target
        .replace(/\bpitch\b/gi, String(ctx.pitch))
        .replace(/\broll\b/gi, String(ctx.roll))
        .replace(/\byaw\b/gi, String(ctx.yaw))
        .replace(/\bax\b/gi, String(ctx.rawAx))
        .replace(/\bay\b/gi, String(ctx.rawAy))
        .replace(/\baz\b/gi, String(ctx.rawAz))
        .replace(/\bgx\b/gi, String(ctx.rawGx))
        .replace(/\bgy\b/gi, String(ctx.rawGy))
        .replace(/\bgz\b/gi, String(ctx.rawGz))
        .replace(/\bdistance\b/gi, String(ctx.distance));

      // Check if safely evaluatable
      if (/^[0-9+\-*/. ()]+$/.test(substituted)) {
        // eslint-disable-next-line no-eval
        const calc = Function(`'use strict'; return (${substituted})`)();
        return decimals !== null ? Number(calc).toFixed(decimals) : String(calc);
      }
    } catch {
      // Fallback
    }

    return target;
  }

  public getActiveState(): McuRuntimeState {
    return this.activeState;
  }
}

export const mcuRuntime = new McuRuntime();
