import React from 'react';
import type { CircuitComponent, SimulationResult } from '../../types/circuit';
import { getResistorBands } from '../../constants/components';

interface Props {
  component: CircuitComponent;
  simResult: SimulationResult;
  isSelected: boolean;
  onInteractiveClick?: (e: React.MouseEvent) => void;
}

export const RealisticComponent: React.FC<Props> = ({
  component,
  simResult,
  isSelected,
  onInteractiveClick,
}) => {
  const output = simResult.componentOutputs[component.id] || {
    powered: false,
    current: 0,
    voltageDrop: 0,
    brightness: 0,
    rpm: 0,
    isBuzzing: false,
  };

  const renderComponentBody = () => {
    switch (component.type) {
      // ================= MICROCONTROLLERS =================
      case 'arduino_uno': {
        const isPin13High = Boolean(output.mcuPinStates?.d13);
        return (
          <g>
            {/* Classic Teal Blue Arduino PCB */}
            <rect x="5" y="5" width="210" height="150" rx="8" fill="#008184" stroke="#005d5f" strokeWidth="3" />
            {/* Silver USB Type-B Port */}
            <rect x="2" y="25" width="34" height="28" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <rect x="2" y="32" width="12" height="14" fill="#1e293b" />
            {/* Black DC Barrel Power Jack */}
            <rect x="2" y="105" width="38" height="32" rx="3" fill="#0f172a" stroke="#1e293b" />
            <circle cx="20" cy="121" r="5" fill="#475569" />
            {/* ATmega328P DIP-28 Microcontroller IC */}
            <rect x="65" y="70" width="85" height="26" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <text x="107" y="87" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              ATMEGA328P
            </text>
            {/* 16MHz Crystal */}
            <rect x="75" y="42" width="18" height="10" rx="3" fill="#e2e8f0" stroke="#94a3b8" />
            {/* Arduino Brand Text */}
            <text x="140" y="45" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              ARDUINO
            </text>
            <text x="140" y="58" fill="#a5f3fc" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
              UNO R3
            </text>
            {/* Built-in 'L' (Pin 13) LED Indicator */}
            <circle
              cx="45"
              cy="48"
              r="4"
              fill={isPin13High ? '#eab308' : '#475569'}
              filter={isPin13High ? 'drop-shadow(0 0 6px #facc15)' : 'none'}
            />
            <text x="45" y="40" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">
              L
            </text>

            {/* Top Digital Header Strip */}
            <rect x="30" y="8" width="168" height="14" rx="2" fill="#0f172a" stroke="#334155" />
            {/* Top Silkscreen Pin Markings */}
            <text x="35" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">ARF</text>
            <text x="45" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">GND</text>
            <text x="55" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">13</text>
            <text x="65" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">12</text>
            <text x="75" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">~11</text>
            <text x="85" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">~10</text>
            <text x="95" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">~9</text>
            <text x="105" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">8</text>
            <text x="120" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">7</text>
            <text x="130" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">~6</text>
            <text x="140" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">~5</text>
            <text x="150" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">4</text>
            <text x="160" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">~3</text>
            <text x="170" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">2</text>
            <text x="180" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">TX</text>
            <text x="190" y="28" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">RX</text>

            {/* Bottom Power & Analog Header Strip */}
            <rect x="38" y="138" width="145" height="14" rx="2" fill="#0f172a" stroke="#334155" />
            {/* Bottom Silkscreen Pin Markings */}
            <text x="45" y="134" fill="#e2e8f0" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">IO</text>
            <text x="55" y="134" fill="#e2e8f0" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">RST</text>
            <text x="65" y="134" fill="#e2e8f0" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">3V3</text>
            <text x="75" y="134" fill="#e2e8f0" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">5V</text>
            <text x="85" y="134" fill="#e2e8f0" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">GND</text>
            <text x="95" y="134" fill="#e2e8f0" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">GND</text>
            <text x="105" y="134" fill="#e2e8f0" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">VIN</text>
            <text x="125" y="134" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A0</text>
            <text x="135" y="134" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A1</text>
            <text x="145" y="134" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A2</text>
            <text x="155" y="134" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A3</text>
            <text x="165" y="134" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A4</text>
            <text x="175" y="134" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">A5</text>
          </g>
        );
      }

      case 'esp32': {
        const isLedLit = output.mcuPinStates?.d2 || false;
        const leftLabels = ['EN', '36', '39', '34', '35', '32', '33', '25', '26', '27', '14', '12', '13', 'GND', 'VIN'];
        const rightLabels = ['23', '22', 'TX', 'RX', '21', '19', '18', 'D5', '17', '16', 'D4', 'D2', '15', 'GND', '3V3'];

        return (
          <g>
            {/* Black NodeMCU 30-Pin Matte PCB */}
            <rect x="4" y="4" width="162" height="267" rx="8" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="12" cy="12" r="3" fill="#1e293b" stroke="#334155" />
            <circle cx="158" cy="12" r="3" fill="#1e293b" stroke="#334155" />

            {/* Golden Trace Wi-Fi & Bluetooth Antenna */}
            <rect x="40" y="8" width="90" height="24" rx="2" fill="#0f172a" />
            <path d="M 48,13 H 122 V 18 H 58 V 23 H 122 V 28 H 48" fill="none" stroke="#eab308" strokeWidth="2" />

            {/* Silver Metal RF Shield Can */}
            <rect x="35" y="40" width="100" height="85" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <text x="85" y="74" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              ESP-WROOM-32
            </text>
            <text x="85" y="90" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">
              Wi-Fi + BLE Dual Core
            </text>
            <text x="85" y="104" fill="#64748b" fontSize="6.5" textAnchor="middle" fontFamily="monospace">
              FCC ID: 2AC7Z-ESPWROOM32
            </text>

            {/* Built-in Blue User LED (GPIO2) */}
            <circle
              cx="50"
              cy="142"
              r="3.5"
              fill={isLedLit ? '#38bdf8' : '#334155'}
              filter={isLedLit ? 'drop-shadow(0 0 6px #38bdf8)' : 'none'}
            />
            <text x="50" y="154" fill="#38bdf8" fontSize="6.5" fontWeight="bold" textAnchor="middle">
              D2
            </text>

            {/* Red Power LED */}
            <circle cx="120" cy="142" r="3.5" fill="#ef4444" filter="drop-shadow(0 0 4px #ef4444)" />
            <text x="120" y="154" fill="#ef4444" fontSize="6.5" fontWeight="bold" textAnchor="middle">
              PWR
            </text>

            {/* Tactile Buttons: EN (Reset) & BOOT */}
            <rect x="36" y="218" width="16" height="14" rx="2" fill="#334155" stroke="#475569" />
            <circle cx="44" cy="225" r="3" fill="#94a3b8" />
            <text x="44" y="242" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">EN</text>

            <rect x="118" y="218" width="16" height="14" rx="2" fill="#334155" stroke="#475569" />
            <circle cx="126" cy="225" r="3" fill="#94a3b8" />
            <text x="126" y="242" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">BOOT</text>

            {/* Micro USB Port at bottom */}
            <rect x="67" y="254" width="36" height="15" rx="2" fill="#94a3b8" stroke="#475569" />

            {/* Left Header Strip (15 pins with 15px pitch) */}
            <rect x="9" y="30" width="14" height="230" rx="2" fill="#0f172a" stroke="#334155" />
            {leftLabels.map((lbl, idx) => (
              <g key={`lbl_l_${idx}`}>
                <circle cx="16" cy={38 + idx * 15} r="3.5" fill="#090d16" stroke="#fbbf24" strokeWidth="1.2" />
                <text
                  x="28"
                  y={38 + idx * 15}
                  fill="#f8fafc"
                  fontSize="7.5"
                  fontWeight="700"
                  fontFamily="ui-monospace, monospace"
                  dominantBaseline="central"
                >
                  {lbl}
                </text>
              </g>
            ))}

            {/* Right Header Strip (15 pins with 15px pitch) */}
            <rect x="147" y="30" width="14" height="230" rx="2" fill="#0f172a" stroke="#334155" />
            {rightLabels.map((lbl, idx) => (
              <g key={`lbl_r_${idx}`}>
                <circle cx="154" cy={38 + idx * 15} r="3.5" fill="#090d16" stroke="#fbbf24" strokeWidth="1.2" />
                <text
                  x="142"
                  y={38 + idx * 15}
                  fill="#f8fafc"
                  fontSize="7.5"
                  fontWeight="700"
                  fontFamily="ui-monospace, monospace"
                  textAnchor="end"
                  dominantBaseline="central"
                >
                  {lbl}
                </text>
              </g>
            ))}
          </g>
        );
      }

      // ================= SENSORS =================
      case 'hc_sr04': {
        const dist = component.properties.distanceCm ?? 25;
        return (
          <g>
            {/* Blue breakout PCB */}
            <rect x="5" y="15" width="130" height="55" rx="6" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            {/* Left Ultrasonic Can (Transmitter 'T') */}
            <circle cx="35" cy="42" r="22" fill="#e2e8f0" stroke="#64748b" strokeWidth="2.5" />
            <circle cx="35" cy="42" r="14" fill="#cbd5e1" stroke="#94a3b8" />
            <text x="35" y="46" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">
              T
            </text>
            {/* Right Ultrasonic Can (Receiver 'R') */}
            <circle cx="105" cy="42" r="22" fill="#e2e8f0" stroke="#64748b" strokeWidth="2.5" />
            <circle cx="105" cy="42" r="14" fill="#cbd5e1" stroke="#94a3b8" />
            <text x="105" y="46" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">
              R
            </text>
            <text x="70" y="32" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              HC-SR04
            </text>
            <text x="70" y="60" fill="#bae6fd" fontSize="9" fontFamily="monospace" textAnchor="middle">
              {dist} cm
            </text>
          </g>
        );
      }

      case 'mpu_6050': {
        const pitch = component.properties.imuTilt?.pitch ?? 0;
        const roll = component.properties.imuTilt?.roll ?? 0;
        return (
          <g>
            {/* Blue breakout PCB */}
            <rect x="5" y="5" width="100" height="80" rx="6" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            {/* MPU-6050 QFN chip */}
            <rect x="35" y="18" width="30" height="30" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <circle cx="40" cy="23" r="2" fill="#e2e8f0" />
            <text x="50" y="35" fill="#f8fafc" fontSize="6" fontWeight="bold" textAnchor="middle">
              MPU
            </text>
            <text x="50" y="43" fill="#f8fafc" fontSize="6" fontWeight="bold" textAnchor="middle">
              6050
            </text>
            {/* Live Orientation Tag */}
            <text x="50" y="65" fill="#93c5fd" fontSize="8" fontFamily="monospace" textAnchor="middle">
              P:{pitch}° R:{roll}°
            </text>
          </g>
        );
      }

      case 'dht22': {
        return (
          <g>
            {/* White plastic grille casing */}
            <rect x="10" y="10" width="60" height="75" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            {/* Grille slots */}
            {[22, 32, 42, 52].map((y) => (
              <rect key={y} x="20" y={y} width="40" height="4" rx="2" fill="#94a3b8" />
            ))}
            <text x="40" y="70" fill="#0284c7" fontSize="8" fontWeight="bold" textAnchor="middle">
              AM2302
            </text>
          </g>
        );
      }

      case 'pir_motion': {
        const isMotion = Boolean(component.properties.motionDetected);
        return (
          <g>
            <rect x="10" y="10" width="80" height="70" rx="6" fill="#047857" stroke="#065f46" strokeWidth="2" />
            {/* White domed Fresnel lens */}
            <circle cx="50" cy="42" r="26" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="50" cy="42" r="18" fill="none" stroke="#94a3b8" strokeDasharray="3 3" />
            <circle cx="50" cy="42" r="8" fill="none" stroke="#94a3b8" strokeDasharray="2 2" />
            {isMotion && (
              <circle cx="50" cy="42" r="26" fill="#f59e0b" opacity="0.4" filter="blur(4px)" />
            )}
            <text x="50" y="75" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">
              HC-SR501
            </text>
          </g>
        );
      }

      // ================= MOTOR DRIVERS & MODULES =================
      case 'tb6612fng': {
        return (
          <g>
            {/* SparkFun-style Red Breakout PCB */}
            <rect x="5" y="5" width="120" height="130" rx="6" fill="#b91c1c" stroke="#991b1b" strokeWidth="2" />
            <rect x="8" y="8" width="114" height="124" rx="4" fill="#991b1b" opacity="0.4" />
            {/* Toshiba TB6612FNG SSOP-24 Surface-Mount IC */}
            <rect x="42" y="45" width="46" height="40" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="48" cy="52" r="1.5" fill="#e2e8f0" />
            <text x="65" y="62" fill="#e2e8f0" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              TOSHIBA
            </text>
            <text x="65" y="73" fill="#38bdf8" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              TB6612FNG
            </text>
            {/* Header pin labels */}
            <text x="65" y="24" fill="#fecaca" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              MOTOR DRIVER
            </text>
            <text x="65" y="112" fill="#fecaca" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              1.2A DUAL H-BRIDGE
            </text>
            {/* Solder eyelet pads on left and right */}
            {[25, 40, 55, 70, 85, 100, 115].map((y) => (
              <g key={y}>
                <circle cx="15" cy={y} r="4.5" fill="#0f172a" stroke="#eab308" strokeWidth="1.2" />
                <circle cx="115" cy={y} r="4.5" fill="#0f172a" stroke="#eab308" strokeWidth="1.2" />
              </g>
            ))}
          </g>
        );
      }

      case 'l298n': {
        return (
          <g>
            {/* Red PCB */}
            <rect x="5" y="5" width="140" height="130" rx="8" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="2.5" />
            {/* Big Black Aluminum Heatsink */}
            <rect x="25" y="20" width="100" height="50" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            {[35, 50, 65, 80, 95, 110].map((x) => (
              <line key={x} x1={x} y1="20" x2={x} y2="70" stroke="#334155" strokeWidth="2" />
            ))}
            <text x="75" y="48" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
              L298N
            </text>
            {/* Blue Terminal Blocks */}
            <rect x="10" y="80" width="30" height="24" rx="2" fill="#0284c7" stroke="#0369a1" />
            <rect x="110" y="80" width="30" height="24" rx="2" fill="#0284c7" stroke="#0369a1" />
          </g>
        );
      }

      case 'a4988': {
        return (
          <g>
            {/* Pololu style green board */}
            <rect x="5" y="5" width="90" height="110" rx="4" fill="#15803d" stroke="#166534" strokeWidth="2" />
            {/* Chip */}
            <rect x="30" y="40" width="30" height="30" rx="2" fill="#0f172a" />
            <text x="45" y="58" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
              A4988
            </text>
            {/* Trimmer pot */}
            <circle cx="45" cy="85" r="8" fill="#cbd5e1" stroke="#64748b" />
            <line x1="45" y1="80" x2="45" y2="90" stroke="#0f172a" strokeWidth="2" />
          </g>
        );
      }

      case 'oled_ssd1306': {
        return (
          <g>
            <rect x="5" y="5" width="110" height="90" rx="6" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            {/* Glass OLED Screen */}
            <rect x="12" y="25" width="96" height="58" rx="3" fill="#020617" stroke="#0ea5e9" strokeWidth="1.5" />
            <text x="60" y="50" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              CircuitCraft
            </text>
            <text x="60" y="65" fill="#22c55e" fontSize="8" textAnchor="middle" fontFamily="monospace">
              128x64 OLED
            </text>
          </g>
        );
      }

      // Custom AI Synthesized Component
      case 'custom_ai': {
        const model = component.properties.chipModel || 'AI COMPONENT';
        const pCount = component.pins.length;
        const width = Math.max(100, pCount * 22 + 20);
        return (
          <g>
            {/* Deep violet AI chip package with cyan neon accents */}
            <rect x="5" y="5" width={width - 10} height="70" rx="8" fill="#180e29" stroke="#8b5cf6" strokeWidth="2" />
            <rect x="12" y="12" width={width - 24} height="56" rx="6" fill="#0f071d" />
            {/* AI Chip Label */}
            <text x={width / 2} y="32" fill="#c084fc" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {model}
            </text>
            <text x={width / 2} y="46" fill="#06b6d4" fontSize="8" fontFamily="monospace" textAnchor="middle">
              AI SYNTHESIZED • {pCount} PINS
            </text>
            {/* Neon glowing indicator */}
            <circle cx="22" cy="22" r="3" fill="#00f0ff" filter="drop-shadow(0 0 4px #00f0ff)" />
          </g>
        );
      }

      // 9V Battery
      case 'battery_9v': {
        const v = component.properties.voltage || 9;
        return (
          <g>
            <rect x="5" y="18" width="80" height="115" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="5" y="18" width="80" height="35" rx="4" fill="#0f172a" />
            <rect x="8" y="55" width="74" height="74" rx="3" fill="#2563eb" />
            <text x="45" y="80" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
              9V POWER
            </text>
            <text x="45" y="96" fill="#93c5fd" fontSize="10" textAnchor="middle">
              ALKALINE {v}V
            </text>
            <rect x="18" y="112" width="54" height="4" rx="2" fill="#eab308" />
            <polygon points="28,2 34,5 37,11 34,17 28,20 22,17 19,11 22,5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="28" cy="11" r="3" fill="#94a3b8" />
            <circle cx="62" cy="11" r="8" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="62" cy="11" r="4.5" fill="#0f172a" />
          </g>
        );
      }

      // AA Battery (1.5V)
      case 'battery_aa': {
        return (
          <g>
            <rect x="19" y="4" width="12" height="8" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <rect x="8" y="12" width="34" height="88" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            <rect x="8" y="12" width="34" height="32" rx="2" fill="#d97706" />
            <text x="25" y="32" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              1.5V
            </text>
            <text x="25" y="70" fill="#94a3b8" fontSize="8" textAnchor="middle">
              AA
            </text>
            <rect x="10" y="96" width="30" height="6" fill="#cbd5e1" />
          </g>
        );
      }

      // Coin Cell (CR2032 3V)
      case 'battery_coin': {
        return (
          <g>
            <circle cx="32" cy="32" r="28" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2.5" />
            <circle cx="32" cy="32" r="23" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            <text x="32" y="28" fill="#334155" fontSize="10" fontWeight="bold" textAnchor="middle">
              CR2032
            </text>
            <text x="32" y="42" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">
              3V +
            </text>
          </g>
        );
      }

      // DC Bench Supply
      case 'battery_dc': {
        const v = component.properties.voltage || 5;
        return (
          <g>
            <rect x="5" y="5" width="90" height="60" rx="8" fill="#1e1e2f" stroke="#475569" strokeWidth="2" />
            <rect x="15" y="14" width="70" height="26" rx="4" fill="#0f172a" stroke="#334155" />
            <text x="50" y="32" fill="#38bdf8" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              {v.toFixed(1)} V
            </text>
            <circle cx="25" cy="55" r="7" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
            <circle cx="25" cy="55" r="3" fill="#ffffff" />
            <circle cx="75" cy="55" r="7" fill="#1e293b" stroke="#000000" strokeWidth="1.5" />
            <circle cx="75" cy="55" r="3" fill="#ffffff" />
          </g>
        );
      }

      // Resistor
      case 'resistor': {
        const r = component.properties.resistance || 220;
        const bands = getResistorBands(r);
        return (
          <g>
            <line x1="6" y1="18" x2="24" y2="18" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
            <line x1="76" y1="18" x2="94" y2="18" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
            <rect x="22" y="9" width="56" height="18" rx="6" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
            <rect x="30" y="9" width="5" height="18" fill={bands[0]} />
            <rect x="40" y="9" width="5" height="18" fill={bands[1]} />
            <rect x="50" y="9" width="5" height="18" fill={bands[2]} />
            <rect x="64" y="9" width="5" height="18" fill={bands[3]} />
            <text x="50" y="34" fill="#94a3b8" fontSize="10" textAnchor="middle">
              {r >= 1000 ? `${(r / 1000).toFixed(1)}kΩ` : `${r}Ω`}
            </text>
          </g>
        );
      }

      // Potentiometer
      case 'potentiometer': {
        const p = component.properties.potValue ?? 0.5;
        const angle = -135 + p * 270;
        return (
          <g>
            <rect x="10" y="10" width="70" height="65" rx="6" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            <circle cx="45" cy="40" r="26" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
            <circle cx="45" cy="40" r="18" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <g transform={`rotate(${angle}, 45, 40)`}>
              <line x1="45" y1="40" x2="45" y2="24" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            </g>
            <line x1="18" y1="75" x2="18" y2="85" stroke="#94a3b8" strokeWidth="3" />
            <line x1="45" y1="75" x2="45" y2="85" stroke="#94a3b8" strokeWidth="3" />
            <line x1="72" y1="75" x2="72" y2="85" stroke="#94a3b8" strokeWidth="3" />
            <text x="45" y="8" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">
              {Math.round(p * 100)}%
            </text>
          </g>
        );
      }

      // Photoresistor (LDR)
      case 'photoresistor': {
        const light = component.properties.lightLevel ?? 50;
        return (
          <g>
            <circle cx="35" cy="35" r="24" fill="#f87171" stroke="#b91c1c" strokeWidth="2" />
            <circle cx="35" cy="35" r="20" fill="#fef08a" />
            <path
              d="M 23,24 C 23,20 47,20 47,24 C 47,28 23,28 23,32 C 23,36 47,36 47,40 C 47,44 23,44 23,48"
              fill="none"
              stroke="#ea580c"
              strokeWidth="2.5"
            />
            <line x1="20" y1="55" x2="20" y2="66" stroke="#94a3b8" strokeWidth="3" />
            <line x1="50" y1="55" x2="50" y2="66" stroke="#94a3b8" strokeWidth="3" />
            <text x="35" y="8" fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">
              ☀️ {light}%
            </text>
          </g>
        );
      }

      // Thermistor
      case 'thermistor': {
        const temp = component.properties.temperature ?? 25;
        return (
          <g>
            <path d="M 35,16 C 22,24 22,46 35,46 C 48,46 48,24 35,16 Z" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" />
            <text x="35" y="36" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
              {temp}°C
            </text>
            <line x1="22" y1="46" x2="22" y2="66" stroke="#94a3b8" strokeWidth="3" />
            <line x1="48" y1="46" x2="48" y2="66" stroke="#94a3b8" strokeWidth="3" />
          </g>
        );
      }

      // Capacitor
      case 'capacitor': {
        return (
          <g>
            <rect x="14" y="10" width="32" height="52" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            <rect x="36" y="10" width="10" height="52" fill="#cbd5e1" />
            <text x="41" y="24" fill="#0284c7" fontSize="10" fontWeight="bold" textAnchor="middle">
              -
            </text>
            <text x="41" y="44" fill="#0284c7" fontSize="10" fontWeight="bold" textAnchor="middle">
              -
            </text>
            <line x1="20" y1="62" x2="20" y2="76" stroke="#cbd5e1" strokeWidth="3" />
            <line x1="40" y1="62" x2="40" y2="76" stroke="#cbd5e1" strokeWidth="3" />
            <text x="25" y="36" fill="#ffffff" fontSize="8" fontWeight="bold">
              {component.properties.capacitance || 100}uF
            </text>
          </g>
        );
      }

      // Diode
      case 'diode': {
        return (
          <g>
            <line x1="8" y1="17" x2="22" y2="17" stroke="#cbd5e1" strokeWidth="3" />
            <line x1="58" y1="17" x2="72" y2="17" stroke="#cbd5e1" strokeWidth="3" />
            <rect x="22" y="7" width="36" height="20" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <rect x="48" y="7" width="6" height="20" fill="#cbd5e1" />
            <text x="35" y="21" fill="#94a3b8" fontSize="8" textAnchor="middle">
              1N4007
            </text>
          </g>
        );
      }

      // Transistors
      case 'transistor_npn':
      case 'transistor_pnp': {
        const isNPN = component.type === 'transistor_npn';
        return (
          <g>
            <path d="M 18,12 L 52,12 A 20,20 0 0,1 52,52 L 18,52 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <text x="35" y="34" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
              {isNPN ? '2N2222' : '2N3906'}
            </text>
            <line x1="20" y1="52" x2="20" y2="76" stroke="#cbd5e1" strokeWidth="3" />
            <line x1="35" y1="52" x2="35" y2="76" stroke="#cbd5e1" strokeWidth="3" />
            <line x1="50" y1="52" x2="50" y2="76" stroke="#cbd5e1" strokeWidth="3" />
            <text x="20" y="70" fill="#64748b" fontSize="7" textAnchor="middle">
              {isNPN ? 'C' : 'E'}
            </text>
            <text x="35" y="70" fill="#64748b" fontSize="7" textAnchor="middle">
              B
            </text>
            <text x="50" y="70" fill="#64748b" fontSize="7" textAnchor="middle">
              {isNPN ? 'E' : 'C'}
            </text>
          </g>
        );
      }

      // Logic Gates
      case 'gate_and':
      case 'gate_or':
      case 'gate_not':
      case 'gate_nand':
      case 'gate_nor':
      case 'gate_xor': {
        const outHigh = Boolean(output.logicOutput);
        const nameMap: Record<string, string> = {
          gate_and: 'AND',
          gate_or: 'OR',
          gate_not: 'NOT',
          gate_nand: 'NAND',
          gate_nor: 'NOR',
          gate_xor: 'XOR',
        };
        return (
          <g>
            <rect x="15" y="10" width="50" height="40" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <text x="40" y="34" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
              {nameMap[component.type]}
            </text>
            <circle
              cx="58"
              cy="20"
              r="4"
              fill={outHigh ? '#22c55e' : '#334155'}
              stroke="#0f172a"
              filter={outHigh ? 'drop-shadow(0 0 4px #22c55e)' : 'none'}
            />
          </g>
        );
      }

      // LED
      case 'led': {
        const color = component.properties.ledColor || '#ef4444';
        const isLit = output.powered && !output.burnedOut;
        const isBurned = Boolean(output.burnedOut);
        const brightness = output.brightness || 0;

        // Dark realistic unpowered tint
        const offColor = color === '#ef4444' ? '#3d0c11' : color === '#22c55e' ? '#0c3d19' : color === '#3b82f6' ? '#0c1e3d' : '#2a2008';

        return (
          <g>
            <rect x="18" y="52" width="24" height="6" rx="2" fill="#475569" />
            <line x1="22" y1="58" x2="22" y2="76" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
            <line x1="38" y1="58" x2="38" y2="76" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />

            {/* Glowing Aura & Radiance when powered */}
            {isLit && (
              <g>
                {/* Big atmospheric bloom */}
                <circle
                  cx="30"
                  cy="32"
                  r={32 + brightness * 22}
                  fill={color}
                  opacity={0.4 + brightness * 0.35}
                  filter="blur(16px)"
                />
                {/* Intense core glow */}
                <circle
                  cx="30"
                  cy="32"
                  r={18 + brightness * 12}
                  fill={color}
                  opacity={0.8}
                  filter="blur(6px)"
                />
                {/* Center hot-spot white light */}
                <circle
                  cx="30"
                  cy="30"
                  r={6 + brightness * 5}
                  fill="#ffffff"
                  opacity={0.9}
                  filter="blur(2px)"
                />
              </g>
            )}

            {/* LED Epoxy Lens Body */}
            <path
              d="M 18,52 L 18,32 A 12,12 0 0,1 42,32 L 42,52 Z"
              fill={isBurned ? '#475569' : isLit ? color : offColor}
              opacity={isLit ? 1 : 0.8}
              stroke={isLit ? '#ffffff' : '#334155'}
              strokeWidth={isLit ? '2' : '1'}
              filter={isLit ? `drop-shadow(0 0 12px ${color})` : 'none'}
            />

            {/* Specular curved reflection on glass lens */}
            <path
              d="M 22,46 L 22,32 A 8,8 0 0,1 30,24"
              stroke="#ffffff"
              strokeWidth={isLit ? '2.5' : '1.2'}
              strokeLinecap="round"
              fill="none"
              opacity={isLit ? 0.95 : 0.3}
            />

            {isBurned && (
              <g>
                <text x="30" y="32" fill="#ef4444" fontSize="16" fontWeight="bold" textAnchor="middle">
                  💥
                </text>
                <text x="30" y="65" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">
                  BLOWN!
                </text>
              </g>
            )}
          </g>
        );
      }

      // Buzzer
      case 'buzzer': {
        const isBuzzing = output.isBuzzing;
        return (
          <g>
            <circle cx="35" cy="35" r="30" fill="#0f172a" stroke="#334155" strokeWidth="3" />
            <circle cx="35" cy="35" r="9" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <circle cx="35" cy="35" r="4" fill="#000000" />
            <text x="25" y="24" fill="#ef4444" fontSize="11" fontWeight="bold">
              +
            </text>
            <line x1="25" y1="60" x2="25" y2="68" stroke="#cbd5e1" strokeWidth="3" />
            <line x1="45" y1="60" x2="45" y2="68" stroke="#cbd5e1" strokeWidth="3" />

            {isBuzzing && (
              <g>
                <path d="M 5,20 A 25,25 0 0,0 5,50" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.8" />
                <path d="M 65,20 A 25,25 0 0,1 65,50" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.8" />
              </g>
            )}
          </g>
        );
      }

      // DC Motor
      case 'dc_motor': {
        const rpm = output.rpm || 0;
        const isSpinning = rpm > 0;
        return (
          <g>
            <rect x="20" y="15" width="50" height="60" rx="8" fill="#475569" stroke="#334155" strokeWidth="2" />
            <rect x="25" y="10" width="40" height="8" rx="2" fill="#64748b" />
            <rect x="42" y="2" width="6" height="10" fill="#94a3b8" />
            <g transform="translate(45, 5)">
              <g className={isSpinning ? 'animate-spin' : ''} style={{ transformOrigin: '0px 0px' }}>
                <ellipse cx="0" cy="-18" rx="5" ry="16" fill="#f97316" stroke="#ea580c" />
                <ellipse cx="0" cy="18" rx="5" ry="16" fill="#f97316" stroke="#ea580c" />
                <ellipse cx="-18" cy="0" rx="16" ry="5" fill="#f97316" stroke="#ea580c" />
                <ellipse cx="18" cy="0" rx="16" ry="5" fill="#f97316" stroke="#ea580c" />
                <circle cx="0" cy="0" r="4" fill="#0f172a" />
              </g>
            </g>
            <line x1="25" y1="75" x2="25" y2="84" stroke="#cbd5e1" strokeWidth="3" />
            <line x1="65" y1="75" x2="65" y2="84" stroke="#cbd5e1" strokeWidth="3" />
            <text x="45" y="52" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
              {isSpinning ? `${rpm} RPM` : 'MOTOR'}
            </text>
          </g>
        );
      }

      // Push button
      case 'push_button': {
        const isPressed = Boolean(component.properties.state);
        return (
          <g onClick={onInteractiveClick} style={{ cursor: 'pointer' }}>
            {/* Outer dark base */}
            <rect x="10" y="10" width="50" height="50" rx="8" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
            {/* Metal faceplate */}
            <rect x="14" y="14" width="42" height="42" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            {/* 4 Corner rivets */}
            <circle cx="18" cy="18" r="1.5" fill="#64748b" />
            <circle cx="52" cy="18" r="1.5" fill="#64748b" />
            <circle cx="18" cy="52" r="1.5" fill="#64748b" />
            <circle cx="52" cy="52" r="1.5" fill="#64748b" />

            {/* Recessed bezel ring */}
            <circle cx="35" cy="35" r="17" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />

            {/* Round Tactile Plunger Button (Visual depression when pressed) */}
            <circle
              cx="35"
              cy="35"
              r={isPressed ? 13 : 15}
              fill={isPressed ? '#15803d' : '#22c55e'}
              stroke={isPressed ? '#14532d' : '#16a34a'}
              strokeWidth={isPressed ? '2.5' : '1.5'}
              filter={isPressed ? 'drop-shadow(0 0 8px rgba(34,197,94,0.6))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'}
            />

            {/* Plunger Top Highlight */}
            <circle
              cx="33"
              cy="33"
              r={isPressed ? 6 : 9}
              fill="#ffffff"
              opacity={isPressed ? 0.15 : 0.35}
            />

            {/* Terminal Solder Legs */}
            <line x1="8" y1="22" x2="14" y2="22" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="8" y1="48" x2="14" y2="48" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="56" y1="22" x2="62" y2="22" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="56" y1="48" x2="62" y2="48" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        );
      }

      // ================= EXPANDED SENSORS & ACTUATORS =================
      case 'emg_sensor': {
        const isLit = output.powered;
        return (
          <g>
            {/* Red Medical Grade PCB */}
            <rect x="5" y="5" width="110" height="80" rx="8" fill="#881337" stroke="#be123c" strokeWidth="2" />
            {/* Gold Muscle Contact Electrodes (Snap connectors) */}
            <circle cx="28" cy="45" r="14" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="28" cy="45" r="7" fill="#78350f" />
            <circle cx="82" cy="45" r="14" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="82" cy="45" r="7" fill="#78350f" />
            {/* Analog Front-End IC (Instrumentation Amp) */}
            <rect x="47" y="35" width="16" height="20" rx="1.5" fill="#0f172a" stroke="#334155" />
            <circle cx="50" cy="39" r="1" fill="#94a3b8" />
            {/* Silkscreen Brand & Labels */}
            <text x="55" y="24" fill="#fecdd3" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              MYOWARE EMG
            </text>
            <text x="55" y="70" fill="#fda4af" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              MUSCLE SENSOR
            </text>
            {/* Live Flex Activity LED */}
            <circle
              cx="98"
              cy="22"
              r="3"
              fill={isLit ? '#22c55e' : '#475569'}
              filter={isLit ? 'drop-shadow(0 0 5px #22c55e)' : 'none'}
            />
            {/* Solder Header Pins at top */}
            <circle cx="25" cy="15" r="3.5" fill="#090d16" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="25" y="9" fill="#fecdd3" fontSize="6" fontWeight="bold" textAnchor="middle">SIG</text>
            <circle cx="60" cy="15" r="3.5" fill="#090d16" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="60" y="9" fill="#fecdd3" fontSize="6" fontWeight="bold" textAnchor="middle">+Vs</text>
            <circle cx="95" cy="15" r="3.5" fill="#090d16" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="95" y="9" fill="#fecdd3" fontSize="6" fontWeight="bold" textAnchor="middle">GND</text>
          </g>
        );
      }

      case 'n20_motor': {
        const isSpinning = output.powered && (output.rpm ?? 0) > 0;
        return (
          <g>
            {/* Cylindrical Silver DC Motor Body */}
            <rect x="5" y="18" width="60" height="38" rx="6" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
            {/* Rear Motor Cap & Solder Lugs */}
            <rect x="2" y="24" width="6" height="26" rx="2" fill="#334155" />
            <line x1="2" y1="28" x2="18" y2="28" stroke="#cbd5e1" strokeWidth="2.5" />
            <line x1="2" y1="48" x2="18" y2="48" stroke="#cbd5e1" strokeWidth="2.5" />
            {/* Metallic reflections */}
            <line x1="12" y1="23" x2="55" y2="23" stroke="#f1f5f9" strokeWidth="1.5" opacity="0.6" />
            <line x1="12" y1="49" x2="55" y2="49" stroke="#334155" strokeWidth="1.5" opacity="0.6" />
            {/* Brass Micro Gearbox */}
            <rect x="65" y="16" width="38" height="42" rx="3" fill="#ca8a04" stroke="#a16207" strokeWidth="1.5" />
            {/* Gearbox Screw Fasteners */}
            <circle cx="70" cy="22" r="1.5" fill="#713f12" />
            <circle cx="70" cy="52" r="1.5" fill="#713f12" />
            <circle cx="97" cy="22" r="1.5" fill="#713f12" />
            <circle cx="97" cy="52" r="1.5" fill="#713f12" />
            {/* Front Bearing Bushing */}
            <rect x="103" y="30" width="8" height="14" rx="2" fill="#e2e8f0" stroke="#94a3b8" />
            {/* Steel D-Shaft */}
            <rect x="111" y="32" width="22" height="10" rx="1.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
            {/* D-Shaft Flat Cutout */}
            <line x1="114" y1="34" x2="131" y2="34" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Rotation indicator or Motion Blur when spinning */}
            {isSpinning && (
              <g transform="translate(122, 37)">
                <circle cx="0" cy="0" r="12" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" className="animate-spin" />
              </g>
            )}
            <text x="35" y="41" fill="#1e293b" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              N20 6V
            </text>
            <text x="84" y="39" fill="#451a03" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              1:50
            </text>
          </g>
        );
      }

      case 'arduino_nano': {
        return (
          <g>
            {/* Navy Blue PCB */}
            <rect x="5" y="5" width="100" height="170" rx="6" fill="#005d5f" stroke="#003e40" strokeWidth="2" />
            {/* Mini-USB Port */}
            <rect x="36" y="2" width="28" height="22" rx="2" fill="#cbd5e1" stroke="#64748b" />
            <rect x="42" y="4" width="16" height="8" fill="#1e293b" />
            {/* Reset button */}
            <rect x="45" y="75" width="10" height="10" rx="2" fill="#475569" stroke="#64748b" />
            <circle cx="50" cy="80" r="2.5" fill="#f8fafc" />
            {/* ATmega328P TQFP square chip */}
            <rect x="38" y="98" width="24" height="24" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="42" cy="102" r="1" fill="#94a3b8" />
            {/* 16MHz Crystal */}
            <rect x="41" y="52" width="18" height="8" rx="2" fill="#e2e8f0" stroke="#94a3b8" />
            {/* Brand Text */}
            <text x="50" y="42" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">NANO</text>
            <text x="50" y="140" fill="#a5f3fc" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">V3.0</text>
            {/* Pin Header strips */}
            <rect x="10" y="20" width="10" height="150" rx="1.5" fill="#0f172a" />
            <rect x="90" y="20" width="10" height="150" rx="1.5" fill="#0f172a" />
          </g>
        );
      }

      case 'raspberry_pi_pico': {
        return (
          <g>
            {/* Raspberry Pi Green PCB */}
            <rect x="5" y="5" width="110" height="180" rx="6" fill="#15803d" stroke="#166534" strokeWidth="2" />
            {/* Micro-USB Port */}
            <rect x="42" y="2" width="26" height="18" rx="2" fill="#cbd5e1" stroke="#64748b" />
            {/* White BOOTSEL button */}
            <rect x="47" y="55" width="16" height="10" rx="2" fill="#f8fafc" stroke="#94a3b8" />
            <text x="55" y="63" fill="#166534" fontSize="5.5" fontWeight="bold" textAnchor="middle">BOOT</text>
            {/* RP2040 Chip */}
            <rect x="41" y="80" width="28" height="28" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x="55" y="96" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">RP2040</text>
            {/* Flash Memory Chip */}
            <rect x="43" y="125" width="24" height="16" rx="1.5" fill="#1e293b" />
            {/* Silkscreen text */}
            <text x="55" y="38" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Raspberry Pi</text>
            <text x="55" y="47" fill="#bbf7d0" fontSize="7" fontWeight="bold" textAnchor="middle">Pico</text>
            {/* Dual header strips */}
            <rect x="10" y="20" width="10" height="155" rx="1.5" fill="#0f172a" />
            <rect x="100" y="20" width="10" height="155" rx="1.5" fill="#0f172a" />
          </g>
        );
      }

      case 'esp32_s3': {
        return (
          <g>
            {/* Modern Matte Black PCB */}
            <rect x="5" y="5" width="130" height="180" rx="6" fill="#111827" stroke="#1f2937" strokeWidth="2" />
            {/* Serpentine PCB Antenna */}
            <path d="M 40 8 H 90 V 22 H 40 V 16 H 84 V 14 H 40 Z" fill="#ca8a04" />
            {/* Metal RF Shield */}
            <rect x="25" y="32" width="80" height="75" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="65" y="60" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">ESP32-S3</text>
            <text x="65" y="74" fill="#cbd5e1" fontSize="7.5" textAnchor="middle">Wi-Fi + BLE 5</text>
            <text x="65" y="86" fill="#93c5fd" fontSize="7" textAnchor="middle">Dual Xtensa LX7</text>
            {/* Dual USB-C Ports at bottom */}
            <rect x="25" y="165" width="26" height="12" rx="2" fill="#cbd5e1" stroke="#475569" />
            <text x="38" y="162" fill="#94a3b8" fontSize="5.5" textAnchor="middle">USB</text>
            <rect x="79" y="165" width="26" height="12" rx="2" fill="#cbd5e1" stroke="#475569" />
            <text x="92" y="162" fill="#94a3b8" fontSize="5.5" textAnchor="middle">UART</text>
            {/* Header pin strips */}
            <rect x="10" y="20" width="10" height="145" rx="1.5" fill="#0f172a" />
            <rect x="120" y="20" width="10" height="145" rx="1.5" fill="#0f172a" />
          </g>
        );
      }

      case 'battery_18650': {
        return (
          <g>
            {/* Cyan/Green 18650 Cell Body */}
            <rect x="8" y="16" width="44" height="114" rx="10" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
            {/* Top Positive Terminal Nub */}
            <rect x="20" y="8" width="20" height="9" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Flat Bottom Negative Base */}
            <rect x="16" y="128" width="28" height="6" rx="1.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Plastic Wrap Seam & Highlights */}
            <line x1="16" y1="20" x2="16" y2="124" stroke="#ffffff" strokeWidth="2" opacity="0.3" />
            <text x="30" y="60" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">18650</text>
            <text x="30" y="74" fill="#e0f2fe" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">3.7V</text>
            <text x="30" y="87" fill="#a5f3fc" fontSize="6.5" textAnchor="middle" fontFamily="monospace">2600mAh</text>
          </g>
        );
      }

      // Slide switch
      case 'toggle_switch': {
        const isOn = Boolean(component.properties.state);
        return (
          <g onClick={onInteractiveClick} style={{ cursor: 'pointer' }}>
            <rect x="10" y="12" width="60" height="26" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="2" />
            <rect x="18" y="18" width="44" height="14" rx="7" fill="#0f172a" />
            <rect
              x={isOn ? 42 : 18}
              y="16"
              width="20"
              height="18"
              rx="4"
              fill="#e2e8f0"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <line x1="20" y1="38" x2="20" y2="46" stroke="#94a3b8" strokeWidth="3" />
            <line x1="40" y1="38" x2="40" y2="46" stroke="#94a3b8" strokeWidth="3" />
            <line x1="60" y1="38" x2="60" y2="46" stroke="#94a3b8" strokeWidth="3" />
          </g>
        );
      }

      // Custom AI-Synthesized Component
      case 'custom_ai': {
        const customW = component.properties.customWidth || Math.max(130, component.pins.length * 20 + 20);
        const customH = component.properties.customHeight || 90;
        const cat = (component.properties.customCategory || '').toLowerCase();
        const pcbColor = cat.includes('motor')
          ? '#991b1b'
          : cat.includes('sensor')
          ? '#1e3a8a'
          : cat.includes('display')
          ? '#0f172a'
          : '#047857';
        const pcbBorder = cat.includes('motor')
          ? '#b91c1c'
          : cat.includes('sensor')
          ? '#3b82f6'
          : cat.includes('display')
          ? '#38bdf8'
          : '#10b981';

        return (
          <g>
            {/* PCB Carrier Board */}
            <rect x="5" y="5" width={customW} height={customH} rx="6" fill={pcbColor} stroke={pcbBorder} strokeWidth="2" />
            <rect x="8" y="8" width={customW - 6} height={customH - 6} rx="4" fill="#000000" opacity="0.3" />

            {/* Central IC Chip */}
            <rect
              x={customW / 2 - 32}
              y={customH / 2 - 20}
              width="64"
              height="28"
              rx="3"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.5"
            />
            <circle cx={customW / 2 - 25} cy={customH / 2 - 12} r="1.5" fill="#94a3b8" />
            <text
              x={customW / 2}
              y={customH / 2 - 3}
              fill="#f8fafc"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {component.properties.chipModel || component.name.slice(0, 10).toUpperCase()}
            </text>
            <text
              x={customW / 2}
              y={customH / 2 + 6}
              fill="#38bdf8"
              fontSize="6.5"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              {component.properties.customCategory || 'AI MODULE'}
            </text>

            {/* Green Power LED */}
            <circle cx={customW - 15} cy="16" r="3" fill="#22c55e" filter="drop-shadow(0 0 3px #22c55e)" />

            {/* Silkscreen Pin Labels printed right on the PCB */}
            {component.pins.map((pin) => (
              <g key={`silk_${pin.id}`}>
                <circle cx={pin.relX} cy={pin.relY} r="4" fill="#090d16" stroke="#fbbf24" strokeWidth="1.5" />
                <text
                  x={pin.relX}
                  y={pin.relY - 7}
                  fill="#f1f5f9"
                  fontSize="6.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {pin.name.split(/[\s(]/)[0]}
                </text>
              </g>
            ))}
          </g>
        );
      }

      default:
        return (
          <rect x="5" y="5" width="60" height="40" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
        );
    }
  };

  return (
    <g className={isSelected ? 'filter drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]' : ''}>
      {renderComponentBody()}
    </g>
  );
};
