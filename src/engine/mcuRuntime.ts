// Embedded Microcontroller Runtime Engine (Arduino Uno & ESP32)

export interface McuRuntimeState {
  pinVoltages: Record<string, number>; // pinId -> voltage (0 or 5V)
  pinModes: Record<string, 'INPUT' | 'OUTPUT'>;
  serialLogs: string[];
}

export class McuRuntime {
  private activeState: McuRuntimeState = {
    pinVoltages: {},
    pinModes: {},
    serialLogs: [],
  };

  public executeCodeStep(
    componentId: string,
    code: string,
    timeMs: number
  ): McuRuntimeState {
    const result: McuRuntimeState = {
      pinVoltages: {},
      pinModes: {},
      serialLogs: [],
    };

    if (!code) return result;

    // Detect delay time from code e.g. delay(500)
    let delayMs = 500;
    const delayMatch = code.match(/delay\((\d+)\)/);
    if (delayMatch && delayMatch[1]) {
      delayMs = Math.max(100, parseInt(delayMatch[1], 10));
    }

    // Toggle cycle based on simulation clock
    const period = delayMs * 2;
    const isHighPhase = timeMs % period < delayMs;

    // Detect target pin (default Pin 13 for Uno, Pin 2 for ESP32)
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

    this.activeState = result;
    return result;
  }

  public getActiveState(): McuRuntimeState {
    return this.activeState;
  }
}

export const mcuRuntime = new McuRuntime();
