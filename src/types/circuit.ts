export type ComponentType =
  // Power Sources
  | 'battery_9v'
  | 'battery_aa'
  | 'battery_coin'
  | 'battery_dc'
  | 'battery_18650'
  | 'battery_lipo_3v7'
  | 'tp4056_charger'
  | 'lm2596_buck'
  | 'ground'
  | 'ac_source'
  // Passive Components
  | 'resistor'
  | 'potentiometer'
  | 'photoresistor'
  | 'thermistor'
  | 'capacitor'
  | 'inductor'
  | 'diode'
  | 'zener_diode'
  | 'fuse'
  // Active & Semiconductors
  | 'transistor_npn'
  | 'transistor_pnp'
  | 'mosfet_n'
  | 'opamp'
  | 'timer_555'
  // Digital Logic Gates
  | 'gate_and'
  | 'gate_or'
  | 'gate_not'
  | 'gate_nand'
  | 'gate_nor'
  | 'gate_xor'
  // Inputs & Switches
  | 'push_button'
  | 'toggle_switch'
  | 'dip_switch'
  | 'relay'
  | 'rotary_encoder'
  | 'keypad_4x4'
  | 'joystick_module'
  // Outputs & Indicators
  | 'led'
  | 'led_rgb'
  | 'seven_segment'
  | 'buzzer'
  | 'dc_motor'
  | 'n20_motor'
  | 'stepper_motor'
  | 'servo_motor'
  | 'vibration_motor'
  | 'solenoid'
  | 'light_bulb'
  // Microcontrollers & Compute
  | 'arduino_uno'
  | 'arduino_nano'
  | 'arduino_mega'
  | 'arduino_pro_mini'
  | 'arduino_due'
  | 'stm32_bluepill'
  | 'teensy_40'
  | 'attiny85'
  | 'esp32'
  | 'esp32_s3'
  | 'esp32_c3'
  | 'esp32_cam'
  | 'nodemcu_esp8266'
  | 'raspberry_pi_pico'
  | 'raspberry_pi_pico_w'
  | 'raspberry_pi_4'
  | 'raspberry_pi_zero_w'
  // Sensors & Modules
  | 'emg_sensor'
  | 'flex_sensor'
  | 'force_sensor'
  | 'heart_rate_max30102'
  | 'load_cell_hx711'
  | 'hc_sr04'
  | 'mpu_6050'
  | 'dht22'
  | 'pir_motion'
  | 'mq2_gas_sensor'
  | 'soil_moisture'
  | 'sound_sensor'
  | 'ir_sensor'
  | 'flame_sensor'
  | 'hall_effect'
  | 'water_level'
  | 'bmp280'
  // Motor Drivers & Displays
  | 'tb6612fng'
  | 'l298n'
  | 'a4988'
  | 'oled_ssd1306'
  | 'lcd_1602_i2c'
  | 'matrix_8x8'
  // Custom AI-Generated Component
  | 'custom_ai'
  // Instruments & Prototyping
  | 'multimeter'
  | 'oscilloscope'
  | 'breadboard_mini'
  | 'breadboard_half';

export type ViewMode = 'realistic' | 'schematic';
export type WireRoutingType = 'orthogonal' | 'curved';

export interface Pin {
  id: string;
  name: string;
  label?: string;
  relX: number;
  relY: number;
  schematicRelX: number;
  schematicRelY: number;
  isPositive?: boolean;
  isNegative?: boolean;
  isPwm?: boolean;
  isAnalog?: boolean;
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  name: string;
  x: number;
  y: number;
  rotation: number;
  properties: {
    resistance?: number;
    voltage?: number;
    frequency?: number;
    capacitance?: number;
    inductance?: number;
    ledColor?: string;
    state?: boolean;
    dipStates?: boolean[];
    potValue?: number;
    lightLevel?: number;
    temperature?: number;
    humidity?: number;
    distanceCm?: number;
    imuTilt?: { pitch: number; roll: number; yaw: number };
    currentRating?: number;
    servoAngle?: number;
    segments?: Record<string, boolean>;
    gain?: number;
    thresholdVoltage?: number;
    code?: string;
    serialLogs?: string[];
    aiPrompt?: string;
    chipModel?: string;
    packageType?: string;
    customDesc?: string;
    customCategory?: string;
    motorSpeedA?: number;
    motorSpeedB?: number;
    [key: string]: any;
  };
  pins: Pin[];
}

export interface Waypoint {
  x: number;
  y: number;
}

export interface Wire {
  id: string;
  fromComponentId: string;
  fromPinId: string;
  toComponentId: string;
  toPinId: string;
  color: string;
  routingType?: WireRoutingType; // 'orthogonal' (default) or 'curved'
  waypoints?: Waypoint[]; // Draggable corners / bend points
}

export interface SimulationResult {
  isRunning: boolean;
  timeMs?: number;
  nodeVoltages: Record<string, number>;
  branchCurrents: Record<string, number>;
  componentOutputs: Record<
    string,
    {
      powered: boolean;
      current: number;
      voltageDrop: number;
      burnedOut?: boolean;
      brightness?: number;
      rgbColor?: string;
      rpm?: number;
      servoAngle?: number;
      isBuzzing?: boolean;
      toneFreq?: number;
      logicOutput?: boolean;
      segmentsLit?: Record<string, boolean>;
      relayEngaged?: boolean;
      oscilloscopeWaveform?: number[];
      mcuPinStates?: Record<string, boolean>;
      sensorReading?: string | number;
      motorAActive?: boolean;
      motorBActive?: boolean;
      isCharging?: boolean;
      batteryVoltage?: number;
      outputVoltage?: number;
      [key: string]: any;
    }
  >;
  multimeterReading?: {
    voltage: number;
    current: number;
  };
}

export interface CircuitProject {
  name: string;
  version: string;
  components: CircuitComponent[];
  wires: Wire[];
}
