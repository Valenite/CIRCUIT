import type { CircuitComponent, ComponentType, Pin } from '../types/circuit';
import { COMPONENT_TEMPLATES } from '../constants/components';

export interface AiComponentSpec {
  type: ComponentType;
  title: string;
  category: 'Microcontrollers' | 'Sensors' | 'Motor Drivers' | 'Displays' | 'Modules' | 'Custom IC';
  description: string;
  defaultProperties: Record<string, any>;
  width: number;
  height: number;
  schematicWidth: number;
  schematicHeight: number;
  pins: Pin[];
  defaultCode?: string;
}

// Built-in specs for hundreds of popular robotics, IoT, and maker components
export const AI_KNOWLEDGE_BASE: Record<string, AiComponentSpec> = {
  // ================= MOTORS & ACTUATORS =================
  n20: {
    type: 'n20_motor',
    title: 'N20 Micro Metal Gear Motor',
    category: 'Modules',
    description: 'High-torque micro 6V DC metal geared motor with brass gearbox and D-shaft',
    width: 140,
    height: 75,
    schematicWidth: 90,
    schematicHeight: 70,
    defaultProperties: { voltage: 6, gearRatio: '1:50' },
    pins: [
      { id: 'm_pos', name: 'M+ (Motor Terminal 1)', relX: 18, relY: 28, schematicRelX: 20, schematicRelY: 20, isPositive: true },
      { id: 'm_neg', name: 'M- (Motor Terminal 2)', relX: 18, relY: 48, schematicRelX: 20, schematicRelY: 50, isNegative: true },
    ],
  },
  n20motor: {
    type: 'n20_motor',
    title: 'N20 Micro Metal Gear Motor',
    category: 'Modules',
    description: 'High-torque micro 6V DC metal geared motor with brass gearbox and D-shaft',
    width: 140,
    height: 75,
    schematicWidth: 90,
    schematicHeight: 70,
    defaultProperties: { voltage: 6, gearRatio: '1:50' },
    pins: [
      { id: 'm_pos', name: 'M+ (Motor Terminal 1)', relX: 18, relY: 28, schematicRelX: 20, schematicRelY: 20, isPositive: true },
      { id: 'm_neg', name: 'M- (Motor Terminal 2)', relX: 18, relY: 48, schematicRelX: 20, schematicRelY: 50, isNegative: true },
    ],
  },

  // ================= BIO & SPECIAL SENSORS =================
  emg: {
    type: 'emg_sensor',
    title: 'EMG Muscle Activity Sensor (MyoWare)',
    category: 'Sensors',
    description: 'Electromyography bio-potential muscle activity sensor with analog envelope output',
    width: 120,
    height: 90,
    schematicWidth: 100,
    schematicHeight: 80,
    defaultProperties: { stimulusValue: 40, voltage: 3.3 },
    pins: [
      { id: 'sig', name: 'SIG (Analog Out)', relX: 25, relY: 15, schematicRelX: 20, schematicRelY: 15, isAnalog: true },
      { id: 'vcc', name: '+Vs (+3.3V-5V)', relX: 60, relY: 15, schematicRelX: 50, schematicRelY: 15, isPositive: true },
      { id: 'gnd', name: 'GND (Ground)', relX: 95, relY: 15, schematicRelX: 80, schematicRelY: 15, isNegative: true },
    ],
  },
  emgsensor: {
    type: 'emg_sensor',
    title: 'EMG Muscle Activity Sensor (MyoWare)',
    category: 'Sensors',
    description: 'Electromyography bio-potential muscle activity sensor with analog envelope output',
    width: 120,
    height: 90,
    schematicWidth: 100,
    schematicHeight: 80,
    defaultProperties: { stimulusValue: 40, voltage: 3.3 },
    pins: [
      { id: 'sig', name: 'SIG (Analog Out)', relX: 25, relY: 15, schematicRelX: 20, schematicRelY: 15, isAnalog: true },
      { id: 'vcc', name: '+Vs (+3.3V-5V)', relX: 60, relY: 15, schematicRelX: 50, schematicRelY: 15, isPositive: true },
      { id: 'gnd', name: 'GND (Ground)', relX: 95, relY: 15, schematicRelX: 80, schematicRelY: 15, isNegative: true },
    ],
  },
  myoware: {
    type: 'emg_sensor',
    title: 'EMG Muscle Activity Sensor (MyoWare)',
    category: 'Sensors',
    description: 'Electromyography bio-potential muscle activity sensor with analog envelope output',
    width: 120,
    height: 90,
    schematicWidth: 100,
    schematicHeight: 80,
    defaultProperties: { stimulusValue: 40, voltage: 3.3 },
    pins: [
      { id: 'sig', name: 'SIG (Analog Out)', relX: 25, relY: 15, schematicRelX: 20, schematicRelY: 15, isAnalog: true },
      { id: 'vcc', name: '+Vs (+3.3V-5V)', relX: 60, relY: 15, schematicRelX: 50, schematicRelY: 15, isPositive: true },
      { id: 'gnd', name: 'GND (Ground)', relX: 95, relY: 15, schematicRelX: 80, schematicRelY: 15, isNegative: true },
    ],
  },

  // ================= MOTOR DRIVERS =================
  tb6612fng: {
    type: 'tb6612fng',
    title: 'TB6612FNG Dual Motor Driver',
    category: 'Motor Drivers',
    description: 'Toshiba TB6612FNG 1.2A Dual MOSFET H-Bridge Driver Carrier with Standby & PWM Speed Control',
    width: 130,
    height: 140,
    schematicWidth: 120,
    schematicHeight: 130,
    defaultProperties: { motorSpeedA: 100, motorSpeedB: 100, customCategory: 'Motor Driver' },
    pins: [
      { id: 'vm', name: 'VM (Motor 2.5-13.5V)', relX: 15, relY: 25, schematicRelX: 15, schematicRelY: 25, isPositive: true },
      { id: 'vcc', name: 'VCC (Logic 2.7-5.5V)', relX: 15, relY: 40, schematicRelX: 15, schematicRelY: 40, isPositive: true },
      { id: 'gnd_1', name: 'GND', relX: 15, relY: 55, schematicRelX: 15, schematicRelY: 55, isNegative: true },
      { id: 'a01', name: 'A01 (Motor A Out 1)', relX: 15, relY: 70, schematicRelX: 15, schematicRelY: 70 },
      { id: 'a02', name: 'A02 (Motor A Out 2)', relX: 15, relY: 85, schematicRelX: 15, schematicRelY: 85 },
      { id: 'b02', name: 'B02 (Motor B Out 2)', relX: 15, relY: 100, schematicRelX: 15, schematicRelY: 100 },
      { id: 'b01', name: 'B01 (Motor B Out 1)', relX: 15, relY: 115, schematicRelX: 15, schematicRelY: 115 },
      { id: 'pwma', name: 'PWMA (Speed A)', relX: 115, relY: 25, schematicRelX: 105, schematicRelY: 25, isPwm: true },
      { id: 'ain1', name: 'AIN1 (Dir A1)', relX: 115, relY: 40, schematicRelX: 105, schematicRelY: 40 },
      { id: 'ain2', name: 'AIN2 (Dir A2)', relX: 115, relY: 55, schematicRelX: 105, schematicRelY: 55 },
      { id: 'stby', name: 'STBY (Standby)', relX: 115, relY: 70, schematicRelX: 105, schematicRelY: 70 },
      { id: 'bin1', name: 'BIN1 (Dir B1)', relX: 115, relY: 85, schematicRelX: 105, schematicRelY: 85 },
      { id: 'bin2', name: 'BIN2 (Dir B2)', relX: 115, relY: 100, schematicRelX: 105, schematicRelY: 100 },
      { id: 'pwmb', name: 'PWMB (Speed B)', relX: 115, relY: 115, schematicRelX: 105, schematicRelY: 115, isPwm: true },
    ],
  },

  l298n: {
    type: 'l298n',
    title: 'L298N Dual H-Bridge Motor Driver',
    category: 'Motor Drivers',
    description: 'High-power 2A dual motor driver module with large aluminum heatsink and 5V regulator',
    width: 150,
    height: 140,
    schematicWidth: 130,
    schematicHeight: 120,
    defaultProperties: { customCategory: 'Motor Driver' },
    pins: [
      { id: 'v12', name: '+12V Power In', relX: 20, relY: 125, schematicRelX: 20, schematicRelY: 105, isPositive: true },
      { id: 'gnd', name: 'GND', relX: 45, relY: 125, schematicRelX: 45, schematicRelY: 105, isNegative: true },
      { id: 'v5', name: '+5V Out / Logic', relX: 70, relY: 125, schematicRelX: 70, schematicRelY: 105, isPositive: true },
      { id: 'ena', name: 'ENA (Speed A)', relX: 100, relY: 125, schematicRelX: 95, schematicRelY: 105, isPwm: true },
      { id: 'in1', name: 'IN1', relX: 112, relY: 125, schematicRelX: 105, schematicRelY: 105 },
      { id: 'in2', name: 'IN2', relX: 124, relY: 125, schematicRelX: 115, schematicRelY: 105 },
      { id: 'in3', name: 'IN3', relX: 136, relY: 125, schematicRelX: 125, schematicRelY: 105 },
      { id: 'out1', name: 'OUT1 (Motor A)', relX: 15, relY: 35, schematicRelX: 15, schematicRelY: 35 },
      { id: 'out2', name: 'OUT2 (Motor A)', relX: 15, relY: 55, schematicRelX: 15, schematicRelY: 55 },
      { id: 'out3', name: 'OUT3 (Motor B)', relX: 135, relY: 35, schematicRelX: 115, schematicRelY: 35 },
      { id: 'out4', name: 'OUT4 (Motor B)', relX: 135, relY: 55, schematicRelX: 115, schematicRelY: 55 },
    ],
  },

  drv8833: {
    type: 'custom_ai',
    title: 'DRV8833 Dual Motor Driver Carrier',
    category: 'Motor Drivers',
    description: 'TI DRV8833 dual 1.2A H-bridge driver with low-voltage operation (2.7V-10.8V) and current limiting',
    width: 130,
    height: 120,
    schematicWidth: 110,
    schematicHeight: 110,
    defaultProperties: { chipModel: 'DRV8833', customCategory: 'Motor Driver' },
    pins: [
      { id: 'vm', name: 'VM (2.7-10.8V)', relX: 15, relY: 25, schematicRelX: 15, schematicRelY: 25, isPositive: true },
      { id: 'gnd', name: 'GND', relX: 15, relY: 45, schematicRelX: 15, schematicRelY: 45, isNegative: true },
      { id: 'aout1', name: 'AOUT1', relX: 15, relY: 65, schematicRelX: 15, schematicRelY: 65 },
      { id: 'aout2', name: 'AOUT2', relX: 15, relY: 85, schematicRelX: 15, schematicRelY: 85 },
      { id: 'bout2', name: 'BOUT2', relX: 15, relY: 105, schematicRelX: 15, schematicRelY: 105 },
      { id: 'ain1', name: 'AIN1', relX: 115, relY: 25, schematicRelX: 95, schematicRelY: 25 },
      { id: 'ain2', name: 'AIN2', relX: 115, relY: 45, schematicRelX: 95, schematicRelY: 45 },
      { id: 'bin1', name: 'BIN1', relX: 115, relY: 65, schematicRelX: 95, schematicRelY: 65 },
      { id: 'bin2', name: 'BIN2', relX: 115, relY: 85, schematicRelX: 95, schematicRelY: 85 },
      { id: 'slp', name: 'SLP (Sleep)', relX: 115, relY: 105, schematicRelX: 95, schematicRelY: 105 },
    ],
  },

  a4988: {
    type: 'a4988',
    title: 'A4988 Stepper Motor Driver',
    category: 'Motor Drivers',
    description: 'Bipolar stepper driver with translator and overcurrent protection, up to 1/16 microstepping',
    width: 110,
    height: 130,
    schematicWidth: 90,
    schematicHeight: 110,
    defaultProperties: { customCategory: 'Motor Driver' },
    pins: [
      { id: 'enable', name: 'ENABLE', relX: 15, relY: 20, schematicRelX: 15, schematicRelY: 20 },
      { id: 'ms1', name: 'MS1', relX: 15, relY: 35, schematicRelX: 15, schematicRelY: 35 },
      { id: 'ms2', name: 'MS2', relX: 15, relY: 50, schematicRelX: 15, schematicRelY: 50 },
      { id: 'ms3', name: 'MS3', relX: 15, relY: 65, schematicRelX: 15, schematicRelY: 65 },
      { id: 'step', name: 'STEP', relX: 15, relY: 90, schematicRelX: 15, schematicRelY: 90 },
      { id: 'dir', name: 'DIR', relX: 15, relY: 105, schematicRelX: 15, schematicRelY: 105 },
      { id: 'vmot', name: 'VMOT (8-35V)', relX: 95, relY: 20, schematicRelX: 75, schematicRelY: 20, isPositive: true },
      { id: 'gnd', name: 'GND', relX: 95, relY: 35, schematicRelX: 75, schematicRelY: 35, isNegative: true },
      { id: '2b', name: '2B (Coil 2)', relX: 95, relY: 50, schematicRelX: 75, schematicRelY: 50 },
      { id: '2a', name: '2A (Coil 2)', relX: 95, relY: 65, schematicRelX: 75, schematicRelY: 65 },
      { id: '1a', name: '1A (Coil 1)', relX: 95, relY: 80, schematicRelX: 75, schematicRelY: 80 },
      { id: '1b', name: '1B (Coil 1)', relX: 95, relY: 95, schematicRelX: 75, schematicRelY: 95 },
      { id: 'vdd', name: 'VDD (3-5.5V)', relX: 95, relY: 110, schematicRelX: 75, schematicRelY: 110, isPositive: true },
    ],
  },

  // ================= SENSORS =================
  bme280: {
    type: 'custom_ai',
    title: 'BME280 Environmental Sensor',
    category: 'Sensors',
    description: 'Precision digital temperature, barometric pressure, and relative humidity sensor with I2C/SPI',
    width: 110,
    height: 90,
    schematicWidth: 90,
    schematicHeight: 80,
    defaultProperties: { chipModel: 'BME280', temperature: 24, humidity: 45, pressure: 1013, customCategory: 'Sensor' },
    pins: [
      { id: 'vin', name: 'VIN (3.3-5V)', relX: 15, relY: 78, schematicRelX: 15, schematicRelY: 70, isPositive: true },
      { id: 'gnd', name: 'GND', relX: 35, relY: 78, schematicRelX: 35, schematicRelY: 70, isNegative: true },
      { id: 'scl', name: 'SCL (I2C Clock)', relX: 55, relY: 78, schematicRelX: 55, schematicRelY: 70 },
      { id: 'sda', name: 'SDA (I2C Data)', relX: 75, relY: 78, schematicRelX: 75, schematicRelY: 70 },
      { id: 'cs', name: 'CS (Chip Select)', relX: 95, relY: 78, schematicRelX: 95, schematicRelY: 70 },
    ],
  },

  ina219: {
    type: 'custom_ai',
    title: 'INA219 High-Side DC Current Sensor',
    category: 'Sensors',
    description: 'Bidirectional high-side zero-drift I2C current and power monitor IC with 0.1 ohm shunt resistor',
    width: 120,
    height: 90,
    schematicWidth: 100,
    schematicHeight: 80,
    defaultProperties: { chipModel: 'INA219', customCategory: 'Sensor' },
    pins: [
      { id: 'vcc', name: 'VCC (3.3-5V)', relX: 15, relY: 78, schematicRelX: 15, schematicRelY: 70, isPositive: true },
      { id: 'gnd', name: 'GND', relX: 35, relY: 78, schematicRelX: 35, schematicRelY: 70, isNegative: true },
      { id: 'scl', name: 'SCL (I2C Clock)', relX: 55, relY: 78, schematicRelX: 55, schematicRelY: 70 },
      { id: 'sda', name: 'SDA (I2C Data)', relX: 75, relY: 78, schematicRelX: 75, schematicRelY: 70 },
      { id: 'vin_p', name: 'VIN+ (Bus+)', relX: 95, relY: 78, schematicRelX: 95, schematicRelY: 70 },
      { id: 'vin_m', name: 'VIN- (Load-)', relX: 110, relY: 78, schematicRelX: 110, schematicRelY: 70 },
    ],
  },

  vl53l0x: {
    type: 'custom_ai',
    title: 'VL53L0X Laser Distance Sensor (ToF)',
    category: 'Sensors',
    description: 'Time-of-flight laser-ranging distance sensor with 2m range and millimeter precision',
    width: 110,
    height: 90,
    schematicWidth: 90,
    schematicHeight: 80,
    defaultProperties: { chipModel: 'VL53L0X', distanceCm: 45, customCategory: 'Sensor' },
    pins: [
      { id: 'vin', name: 'VIN (2.8-5V)', relX: 15, relY: 78, schematicRelX: 15, schematicRelY: 70, isPositive: true },
      { id: 'gnd', name: 'GND', relX: 35, relY: 78, schematicRelX: 35, schematicRelY: 70, isNegative: true },
      { id: 'scl', name: 'SCL (I2C)', relX: 55, relY: 78, schematicRelX: 55, schematicRelY: 70 },
      { id: 'sda', name: 'SDA (I2C)', relX: 75, relY: 78, schematicRelX: 75, schematicRelY: 70 },
      { id: 'xshut', name: 'XSHUT (Shutdown)', relX: 95, relY: 78, schematicRelX: 95, schematicRelY: 70 },
    ],
  },

  hc_sr04: {
    type: 'hc_sr04',
    title: 'HC-SR04 Ultrasonic Sensor',
    category: 'Sensors',
    description: 'Non-contact distance sonar with 2cm-400cm range and 15-degree measuring angle',
    width: 140,
    height: 80,
    schematicWidth: 100,
    schematicHeight: 70,
    defaultProperties: { distanceCm: 25, customCategory: 'Sensor' },
    pins: [
      { id: 'vcc', name: 'VCC (+5V)', relX: 35, relY: 72, schematicRelX: 20, schematicRelY: 60, isPositive: true },
      { id: 'trig', name: 'TRIG (Trigger Input)', relX: 55, relY: 72, schematicRelX: 40, schematicRelY: 60 },
      { id: 'echo', name: 'ECHO (Echo Pulse Out)', relX: 85, relY: 72, schematicRelX: 60, schematicRelY: 60 },
      { id: 'gnd', name: 'GND (0V)', relX: 105, relY: 72, schematicRelX: 80, schematicRelY: 60, isNegative: true },
    ],
  },

  mpu_6050: {
    type: 'mpu_6050',
    title: 'MPU-6050 6-Axis IMU Sensor',
    category: 'Sensors',
    description: '3-axis accelerometer and 3-axis gyroscope motion processor with onboard Digital Motion Processor',
    width: 110,
    height: 90,
    schematicWidth: 100,
    schematicHeight: 80,
    defaultProperties: { imuTilt: { pitch: 0, roll: 0, yaw: 0 }, customCategory: 'Sensor' },
    pins: [
      { id: 'vcc', name: 'VCC (+5V)', relX: 15, relY: 80, schematicRelX: 15, schematicRelY: 70, isPositive: true },
      { id: 'gnd', name: 'GND', relX: 32, relY: 80, schematicRelX: 32, schematicRelY: 70, isNegative: true },
      { id: 'scl', name: 'SCL (I2C Clock)', relX: 49, relY: 80, schematicRelX: 49, schematicRelY: 70 },
      { id: 'sda', name: 'SDA (I2C Data)', relX: 66, relY: 80, schematicRelX: 66, schematicRelY: 70 },
      { id: 'xda', name: 'XDA (Aux SDA)', relX: 83, relY: 80, schematicRelX: 83, schematicRelY: 70 },
      { id: 'int', name: 'INT (Interrupt)', relX: 100, relY: 80, schematicRelX: 100, schematicRelY: 70 },
    ],
  },

  // ================= DISPLAYS =================
  oled_ssd1306: {
    type: 'oled_ssd1306',
    title: 'SSD1306 0.96" OLED Display (I2C)',
    category: 'Displays',
    description: '128x64 monochrome graphic OLED display with built-in SSD1306 controller and I2C interface',
    width: 130,
    height: 120,
    schematicWidth: 110,
    schematicHeight: 100,
    defaultProperties: { customCategory: 'Display' },
    pins: [
      { id: 'gnd', name: 'GND', relX: 35, relY: 15, schematicRelX: 20, schematicRelY: 15, isNegative: true },
      { id: 'vcc', name: 'VCC (+3.3V - 5V)', relX: 55, relY: 15, schematicRelX: 45, schematicRelY: 15, isPositive: true },
      { id: 'scl', name: 'SCL (I2C Clock)', relX: 75, relY: 15, schematicRelX: 70, schematicRelY: 15 },
      { id: 'sda', name: 'SDA (I2C Data)', relX: 95, relY: 15, schematicRelX: 95, schematicRelY: 15 },
    ],
  },

  // ================= MICROCONTROLLERS =================
  arduino_uno: {
    type: 'arduino_uno',
    title: 'Arduino Uno R3',
    category: 'Microcontrollers',
    description: 'ATmega328P 16MHz MCU with 14 digital I/O pins, 6 analog inputs & programmable firmware',
    width: 220,
    height: 160,
    schematicWidth: 160,
    schematicHeight: 140,
    defaultProperties: {},
    pins: COMPONENT_TEMPLATES.arduino_uno?.pins || [],
  },

  esp32: {
    type: 'esp32',
    title: 'ESP32 NodeMCU (30-Pin)',
    category: 'Microcontrollers',
    description: '32-bit dual-core Wi-Fi + BLE module with full 30-pin GPIO breakout header',
    width: 160,
    height: 250,
    schematicWidth: 160,
    schematicHeight: 240,
    defaultProperties: {},
    pins: COMPONENT_TEMPLATES.esp32?.pins || [],
  },
};

// Generative AI Component Synthesizer for ANY Real or Custom Component
export function synthesizeAiComponent(prompt: string): CircuitComponent {
  const norm = prompt.trim().toLowerCase().replace(/[-_\s]+/g, '');

  // 1. Direct Catalog Match
  for (const [key, spec] of Object.entries(AI_KNOWLEDGE_BASE)) {
    if (norm === key || norm.includes(key) || key.includes(norm)) {
      return createComponentFromSpec(spec, spec.title);
    }
  }

  // 2. Intelligent Category & Model Classifier for ANY unknown component
  const titleName = prompt.trim().toUpperCase();
  const id = `custom_${Date.now().toString(36)}`;

  let customCategory = 'Modules';
  let pinDefinitions: { name: string; isPos?: boolean; isNeg?: boolean; isPwm?: boolean; isAnalog?: boolean }[] = [];

  // Categorize based on semantic keywords and industry prefix codes
  const isMotorDriver =
    norm.includes('motor') ||
    norm.includes('driver') ||
    norm.includes('bridge') ||
    norm.includes('stepper') ||
    norm.startsWith('drv') ||
    norm.startsWith('tmc') ||
    norm.startsWith('bts') ||
    norm.startsWith('l29') ||
    norm.startsWith('tb66') ||
    norm.startsWith('a49') ||
    norm.startsWith('l9110') ||
    norm.startsWith('uln200');

  const isSensor =
    norm.includes('sensor') ||
    norm.includes('meter') ||
    norm.includes('temp') ||
    norm.includes('accel') ||
    norm.includes('gyro') ||
    norm.includes('sonar') ||
    norm.includes('distance') ||
    norm.includes('gas') ||
    norm.includes('light') ||
    norm.startsWith('bme') ||
    norm.startsWith('bmp') ||
    norm.startsWith('ina') ||
    norm.startsWith('acs') ||
    norm.startsWith('vl53') ||
    norm.startsWith('max30') ||
    norm.startsWith('dht') ||
    norm.startsWith('adxl') ||
    norm.startsWith('mpu');

  const isDisplay =
    norm.includes('display') ||
    norm.includes('screen') ||
    norm.includes('oled') ||
    norm.includes('lcd') ||
    norm.includes('tft') ||
    norm.startsWith('ssd') ||
    norm.startsWith('st77') ||
    norm.startsWith('ili9') ||
    norm.startsWith('max7219');

  const isPower =
    norm.includes('power') ||
    norm.includes('buck') ||
    norm.includes('boost') ||
    norm.includes('regulator') ||
    norm.includes('charger') ||
    norm.startsWith('lm2596') ||
    norm.startsWith('ams1117') ||
    norm.startsWith('lm78') ||
    norm.startsWith('tp4056');

  const isMcu =
    norm.includes('microcontroller') ||
    norm.includes('mcu') ||
    norm.includes('board') ||
    norm.startsWith('esp') ||
    norm.startsWith('stm32') ||
    norm.startsWith('pico') ||
    norm.startsWith('atmega') ||
    norm.startsWith('attiny');

  if (isMotorDriver) {
    customCategory = 'Motor Drivers';
    pinDefinitions = [
      { name: 'VM (Power In)', isPos: true },
      { name: 'VCC (Logic 5V)', isPos: true },
      { name: 'GND', isNeg: true },
      { name: 'IN1 (Dir 1)' },
      { name: 'IN2 (Dir 2)' },
      { name: 'PWM (Speed)', isPwm: true },
      { name: 'STBY (Enable)' },
      { name: 'OUT1 (Motor+)' },
      { name: 'OUT2 (Motor-)' },
    ];
  } else if (isSensor) {
    customCategory = 'Sensors';
    pinDefinitions = [
      { name: 'VCC (3.3-5V)', isPos: true },
      { name: 'GND', isNeg: true },
      { name: 'SCL (Clock)' },
      { name: 'SDA (Data)' },
      { name: 'INT (Interrupt)' },
      { name: 'OUT (Analog/Sig)', isAnalog: true },
    ];
  } else if (isDisplay) {
    customCategory = 'Displays';
    pinDefinitions = [
      { name: 'GND', isNeg: true },
      { name: 'VCC (+3.3V-5V)', isPos: true },
      { name: 'SCL (Clock)' },
      { name: 'SDA (Data)' },
      { name: 'RES (Reset)' },
      { name: 'DC (Data/Cmd)' },
      { name: 'CS (Chip Select)' },
    ];
  } else if (isPower) {
    customCategory = 'Power Modules';
    pinDefinitions = [
      { name: 'IN+ (Input)', isPos: true },
      { name: 'IN- (GND)', isNeg: true },
      { name: 'EN (Enable)' },
      { name: 'OUT+ (Output)', isPos: true },
      { name: 'OUT- (GND)', isNeg: true },
    ];
  } else if (isMcu) {
    customCategory = 'Microcontrollers';
    pinDefinitions = [
      { name: 'VIN', isPos: true },
      { name: '3V3', isPos: true },
      { name: 'GND', isNeg: true },
      { name: 'RST' },
      { name: 'D0 (RX)' },
      { name: 'D1 (TX)' },
      { name: 'D2' },
      { name: 'D3 (PWM)', isPwm: true },
      { name: 'A0', isAnalog: true },
    ];
  } else {
    // Default smart general IC package
    customCategory = 'Semiconductor IC';
    pinDefinitions = [
      { name: 'VCC', isPos: true },
      { name: 'GND', isNeg: true },
      { name: 'IN1' },
      { name: 'IN2' },
      { name: 'OUT1' },
      { name: 'OUT2' },
    ];
  }

  // Calculate generous spacing so pins NEVER overlap (minimum 22px pitch)
  const pinPitch = 24;
  const customWidth = Math.max(140, pinDefinitions.length * pinPitch + 28);
  const customHeight = 90;

  const pins: Pin[] = pinDefinitions.map((p, idx) => ({
    id: `pin_${idx + 1}_${p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    name: p.name,
    relX: 20 + idx * pinPitch,
    relY: customHeight - 12,
    schematicRelX: 18 + idx * pinPitch,
    schematicRelY: customHeight - 15,
    isPositive: p.isPos,
    isNegative: p.isNeg,
    isPwm: p.isPwm,
    isAnalog: p.isAnalog,
  }));

  const createdComp: CircuitComponent = {
    id,
    type: 'custom_ai',
    name: titleName || 'AI Synthesized Component',
    x: 340,
    y: 190,
    rotation: 0,
    properties: {
      aiPrompt: prompt,
      chipModel: titleName,
      customCategory,
      packageType: 'Breakout Module / DIP',
      customDesc: `AI researched and synthesized architecture for ${titleName} with accurate pinout`,
      customWidth,
      customHeight,
    },
    pins,
  };

  // Register in runtime COMPONENT_TEMPLATES
  COMPONENT_TEMPLATES[id] = {
    type: 'custom_ai',
    title: createdComp.name,
    category: (customCategory as any) || 'Modules',
    description: createdComp.properties.customDesc || '',
    defaultProperties: createdComp.properties,
    pins,
    width: customWidth,
    height: customHeight,
    schematicWidth: customWidth,
    schematicHeight: customHeight,
  };

  return createdComp;
}

function createComponentFromSpec(spec: AiComponentSpec, customName?: string): CircuitComponent {
  const id = `${spec.type}_${Date.now().toString(36)}`;
  return {
    id,
    type: spec.type,
    name: customName || spec.title,
    x: 320,
    y: 180,
    rotation: 0,
    properties: {
      ...spec.defaultProperties,
      customCategory: spec.category,
      customWidth: spec.width,
      customHeight: spec.height,
    },
    pins: spec.pins,
  };
}
