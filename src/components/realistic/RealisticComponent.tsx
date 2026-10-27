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

      case 'flex_sensor': {
        const stimulus = component.properties.stimulusValue ?? 0;
        return (
          <g>
            {/* Long black flexible polyimide substrate strip */}
            <rect x="6" y="5" width="18" height="150" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            {/* Carbon resistive ink segmented bars */}
            {[20, 32, 44, 56, 68, 80, 92, 104, 116, 128].map((y) => (
              <rect key={y} x="9" y={y} width="12" height="6" rx="1.5" fill="#475569" stroke="#64748b" strokeWidth="0.5" />
            ))}
            {/* Conductive silver trace lines running along edges */}
            <line x1="8" y1="15" x2="8" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="22" y1="15" x2="22" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Bend indicator */}
            <text x="15" y="8" fill="#38bdf8" fontSize="5" fontWeight="bold" textAnchor="middle">FLEX</text>
            <text x="15" y="148" fill="#f59e0b" fontSize="5" textAnchor="middle">{Math.round(stimulus)}°</text>
          </g>
        );
      }

      case 'force_sensor': {
        return (
          <g>
            {/* Circular active sensing head */}
            <circle cx="30" cy="35" r="25" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="30" cy="35" r="18" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="30" cy="35" r="10" fill="#334155" />
            <text x="30" y="38" fill="#e2e8f0" fontSize="7" fontWeight="bold" textAnchor="middle">FSR</text>
            {/* Flexible neck tail */}
            <rect x="22" y="60" width="16" height="70" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <line x1="26" y1="60" x2="26" y2="128" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="34" y1="60" x2="34" y2="128" stroke="#94a3b8" strokeWidth="1.5" />
          </g>
        );
      }

      case 'heart_rate_max30102': {
        const isPowered = output.powered;
        return (
          <g>
            {/* Dark green / purple PCB */}
            <rect x="5" y="5" width="55" height="55" rx="6" fill="#1e1b4b" stroke="#4338ca" strokeWidth="1.5" />
            {/* Optical sensor window with RED & IR LEDs */}
            <rect x="18" y="18" width="28" height="28" rx="3" fill="#020617" stroke="#6366f1" strokeWidth="1" />
            <circle cx="26" cy="32" r="4" fill={isPowered ? '#ef4444' : '#7f1d1d'} filter={isPowered ? 'drop-shadow(0 0 6px #ef4444)' : 'none'} />
            <circle cx="38" cy="32" r="4" fill={isPowered ? '#a855f7' : '#581c87'} filter={isPowered ? 'drop-shadow(0 0 6px #a855f7)' : 'none'} />
            <text x="32" y="14" fill="#a5b4fc" fontSize="6.5" fontWeight="bold" textAnchor="middle">MAX30102</text>
          </g>
        );
      }

      case 'stm32_bluepill': {
        return (
          <g>
            {/* Signature Royal Blue PCB */}
            <rect x="5" y="5" width="130" height="50" rx="4" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            {/* Micro-USB Port */}
            <rect x="2" y="18" width="16" height="14" rx="2" fill="#cbd5e1" stroke="#475569" />
            {/* STM32F103 MCU chip */}
            <rect x="50" y="14" width="24" height="24" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
            <text x="62" y="27" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">STM32</text>
            {/* Reset button */}
            <circle cx="28" cy="25" r="4" fill="#ef4444" />
            {/* 8MHz crystal can */}
            <rect x="85" y="20" width="18" height="10" rx="3" fill="#e2e8f0" stroke="#94a3b8" />
            <text x="94" y="27" fill="#1e293b" fontSize="4.5" textAnchor="middle">8MHz</text>
            <text x="115" y="14" fill="#bfdbfe" fontSize="6" fontWeight="bold">BluePill</text>
          </g>
        );
      }

      case 'attiny85': {
        return (
          <g>
            {/* DIP-8 IC Body */}
            <rect x="12" y="8" width="36" height="54" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            {/* Pin 1 orientation notch */}
            <path d="M 26 8 A 4 4 0 0 0 34 8" fill="#1e293b" stroke="#334155" />
            <circle cx="18" cy="16" r="2" fill="#475569" />
            {/* IC label */}
            <text x="30" y="34" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ATTINY</text>
            <text x="30" y="44" fill="#38bdf8" fontSize="6" textAnchor="middle" fontFamily="monospace">85-20PU</text>
            {/* 8 Silver Lead Legs */}
            {[15, 30, 45, 60].map((y) => (
              <React.Fragment key={y}>
                <rect x="4" y={y - 3} width="8" height="6" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
                <rect x="48" y={y - 3} width="8" height="6" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
              </React.Fragment>
            ))}
          </g>
        );
      }

      case 'esp32_cam': {
        return (
          <g>
            {/* Black PCB */}
            <rect x="5" y="5" width="80" height="100" rx="5" fill="#090d16" stroke="#1e293b" strokeWidth="2" />
            {/* Gold OV2640 Camera Lens Module */}
            <circle cx="45" cy="40" r="18" fill="#020617" stroke="#d97706" strokeWidth="2" />
            <circle cx="45" cy="40" r="10" fill="#0f172a" stroke="#2563eb" strokeWidth="1.5" />
            <circle cx="45" cy="40" r="5" fill="#000000" />
            {/* Bright High-Power Flash LED */}
            <rect x="38" y="68" width="14" height="14" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            {/* MicroSD card slot on back */}
            <rect x="25" y="88" width="40" height="10" rx="1" fill="#475569" stroke="#64748b" strokeWidth="1" />
            <text x="45" y="16" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle">ESP32-CAM</text>
          </g>
        );
      }

      // ================= EXPANDED POWER & CONVERSION =================
      case 'battery_lipo_3v7': {
        return (
          <g>
            {/* Pouch Crimp Edge Seal */}
            <rect x="6" y="24" width="78" height="110" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            {/* Silver/Gold Lithium Polymer Foil Pouch Body */}
            <rect x="9" y="28" width="72" height="102" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Kapton Tape Collar at Top Seal */}
            <rect x="12" y="22" width="66" height="12" rx="1" fill="#eab308" fillOpacity="0.75" stroke="#ca8a04" strokeWidth="0.8" />
            {/* Protection Circuit Board (PCM) */}
            <rect x="22" y="16" width="46" height="10" rx="1.5" fill="#15803d" stroke="#166534" strokeWidth="1" />
            <rect x="26" y="18" width="8" height="6" rx="0.5" fill="#0f172a" />
            <rect x="56" y="18" width="8" height="6" rx="0.5" fill="#0f172a" />
            {/* Red (+3.7V) and Black (GND) Silicone Leads */}
            <line x1="32" y1="16" x2="32" y2="10" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <line x1="58" y1="16" x2="58" y2="10" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            {/* White JST-PH 2.0 Connector Housing */}
            <rect x="26" y="2" width="38" height="9" rx="1" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <rect x="30" y="3" width="4" height="4" fill="#64748b" />
            <rect x="56" y="3" width="4" height="4" fill="#64748b" />
            {/* Printed LiPo Technical Specifications Label */}
            <text x="45" y="48" fill="#1e293b" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              Li-Po BATTERY
            </text>
            <text x="45" y="60" fill="#0369a1" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              3.7V 1200mAh
            </text>
            <text x="45" y="70" fill="#475569" fontSize="6" textAnchor="middle" fontFamily="monospace">
              4.44Wh 603450
            </text>
            <text x="45" y="82" fill="#ef4444" fontSize="7" fontWeight="bold" textAnchor="middle">
              + RED  |  - BLACK
            </text>
            <text x="45" y="94" fill="#dc2626" fontSize="5.5" textAnchor="middle">
              CAUTION: DO NOT PUNCTURE
            </text>
            <text x="45" y="104" fill="#475569" fontSize="5" textAnchor="middle">
              BUILT-IN PCM PROTECTION
            </text>
          </g>
        );
      }

      case 'tp4056_charger': {
        return (
          <g>
            {/* Blue Charger PCB */}
            <rect x="5" y="5" width="90" height="70" rx="4" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            {/* USB-C Receptacle */}
            <rect x="2" y="24" width="22" height="22" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <rect x="6" y="30" width="10" height="10" rx="2" fill="#0f172a" />
            {/* TP4056 Linear Charge Management IC */}
            <rect x="36" y="26" width="22" height="16" rx="1.5" fill="#0f172a" stroke="#1e293b" />
            <text x="47" y="37" fill="#94a3b8" fontSize="5" textAnchor="middle" fontFamily="monospace">TP4056</text>
            {/* DW01A Battery Protection IC & 8205A MOSFET */}
            <rect x="64" y="20" width="12" height="10" rx="1" fill="#0f172a" />
            <rect x="64" y="34" width="14" height="12" rx="1" fill="#0f172a" />
            {/* Dual Status LEDs: CHRG (Red) & STDBY (Blue) */}
            <circle cx="34" cy="54" r="3" fill={output.powered ? '#ef4444' : '#7f1d1d'} filter={output.powered ? 'drop-shadow(0 0 6px #ef4444)' : 'none'} />
            <text x="34" y="63" fill="#fca5a5" fontSize="4.5" textAnchor="middle">CHRG</text>
            <circle cx="48" cy="54" r="3" fill={output.powered ? '#3b82f6' : '#1e3a8a'} filter={output.powered ? 'drop-shadow(0 0 6px #3b82f6)' : 'none'} />
            <text x="48" y="63" fill="#93c5fd" fontSize="4.5" textAnchor="middle">STDBY</text>
            {/* Solder Pads */}
            <text x="15" y="16" fill="#f8fafc" fontSize="6" fontWeight="bold">IN+</text>
            <text x="15" y="66" fill="#f8fafc" fontSize="6" fontWeight="bold">IN-</text>
            <text x="82" y="16" fill="#f8fafc" fontSize="6" fontWeight="bold" textAnchor="end">OUT+</text>
            <text x="82" y="32" fill="#f8fafc" fontSize="6" fontWeight="bold" textAnchor="end">B+</text>
            <text x="82" y="48" fill="#f8fafc" fontSize="6" fontWeight="bold" textAnchor="end">B-</text>
            <text x="82" y="66" fill="#f8fafc" fontSize="6" fontWeight="bold" textAnchor="end">OUT-</text>
          </g>
        );
      }

      case 'lm2596_buck': {
        return (
          <g>
            {/* Blue Buck Converter PCB */}
            <rect x="5" y="5" width="110" height="70" rx="4" fill="#1e40af" stroke="#172554" strokeWidth="2" />
            {/* Large Toroidal Power Inductor with Copper Magnet Wire */}
            <circle cx="58" cy="40" r="16" fill="#1e293b" stroke="#78350f" strokeWidth="4" />
            <circle cx="58" cy="40" r="7" fill="#0f172a" />
            <circle cx="58" cy="40" r="13" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="3 3" />
            {/* Blue Multi-turn Trimmer Potentiometer with Brass Adjustment Screw */}
            <rect x="80" y="12" width="24" height="18" rx="2" fill="#2563eb" stroke="#1d4ed8" />
            <circle cx="92" cy="21" r="4.5" fill="#eab308" stroke="#ca8a04" />
            <line x1="90" y1="21" x2="94" y2="21" stroke="#854d0e" strokeWidth="1.2" />
            {/* LM2596 IC with Metal Heatsink Tab */}
            <rect x="22" y="15" width="22" height="20" rx="1" fill="#0f172a" />
            <rect x="20" y="11" width="26" height="5" rx="1" fill="#cbd5e1" />
            <text x="33" y="27" fill="#94a3b8" fontSize="5" fontWeight="bold" textAnchor="middle">LM2596</text>
            {/* Aluminum Electrolytic Capacitors */}
            <circle cx="16" cy="48" r="8" fill="#e2e8f0" stroke="#64748b" />
            <circle cx="102" cy="48" r="8" fill="#e2e8f0" stroke="#64748b" />
            {/* Power Status LED */}
            <circle cx="62" cy="16" r="2.5" fill={output.powered ? '#ef4444' : '#7f1d1d'} filter={output.powered ? 'drop-shadow(0 0 6px #ef4444)' : 'none'} />
            <text x="16" y="66" fill="#f8fafc" fontSize="5.5" fontWeight="bold" textAnchor="middle">IN</text>
            <text x="102" y="66" fill="#f8fafc" fontSize="5.5" fontWeight="bold" textAnchor="middle">OUT</text>
          </g>
        );
      }

      // ================= EXPANDED MICROCONTROLLERS =================
      case 'esp32_c3': {
        const isPowered = output.powered;
        return (
          <g>
            {/* Dark Blue/Black High-Tech Matte PCB */}
            <rect x="5" y="5" width="80" height="150" rx="6" fill="#0b1329" stroke="#1e293b" strokeWidth="2.5" />
            {/* Gold Meandering PCB Antenna at Top Edge */}
            <path
              d="M 20 18 L 20 10 L 26 10 L 26 18 L 32 18 L 32 10 L 38 10 L 38 18 L 44 18 L 44 10 L 50 10 L 50 18 L 56 18 L 56 10 L 62 10 L 62 18 L 68 18 L 68 10"
              stroke="#eab308"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="square"
            />
            {/* Silver Metal RF Shield Can covering ESP32-C3FN4 RISC-V SoC */}
            <rect x="16" y="24" width="58" height="54" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <rect x="18" y="26" width="54" height="50" rx="1.5" fill="#94a3b8" />
            <text x="45" y="42" fill="#0f172a" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              ESP-WROOM-02
            </text>
            <text x="45" y="54" fill="#1e293b" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              ESP32-C3
            </text>
            <text x="45" y="65" fill="#334155" fontSize="5.5" textAnchor="middle" fontFamily="monospace">
              RISC-V 160MHz
            </text>
            <text x="45" y="72" fill="#334155" fontSize="4.5" textAnchor="middle">
              Wi-Fi 4 + BLE 5.0
            </text>
            {/* RGB Status LED (WS2812B) */}
            <rect x="40" y="86" width="10" height="10" rx="1.5" fill="#f8fafc" stroke="#64748b" />
            <circle
              cx="45"
              cy="91"
              r="3.5"
              fill={isPowered ? '#06b6d4' : '#334155'}
              filter={isPowered ? 'drop-shadow(0 0 8px #06b6d4)' : 'none'}
            />
            {/* Tactile Buttons: Reset (RST) and Boot (BOOT) */}
            <rect x="16" y="106" width="12" height="10" rx="1.5" fill="#e2e8f0" stroke="#64748b" />
            <circle cx="22" cy="111" r="2.5" fill="#0f172a" />
            <text x="22" y="102" fill="#94a3b8" fontSize="4.5" fontWeight="bold" textAnchor="middle">RST</text>
            <rect x="62" y="106" width="12" height="10" rx="1.5" fill="#e2e8f0" stroke="#64748b" />
            <circle cx="68" cy="111" r="2.5" fill="#0f172a" />
            <text x="68" y="102" fill="#94a3b8" fontSize="4.5" fontWeight="bold" textAnchor="middle">BOOT</text>
            {/* Type-C USB Port at Bottom */}
            <rect x="30" y="132" width="30" height="22" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <rect x="36" y="138" width="18" height="10" rx="2" fill="#0f172a" />
            {/* Left Header Solder Pads & Silkscreen */}
            <text x="18" y="27" fill="#38bdf8" fontSize="5.5" fontWeight="bold">IO0</text>
            <text x="18" y="47" fill="#38bdf8" fontSize="5.5" fontWeight="bold">IO1</text>
            <text x="18" y="67" fill="#38bdf8" fontSize="5.5" fontWeight="bold">IO2</text>
            <text x="18" y="87" fill="#38bdf8" fontSize="5.5" fontWeight="bold">IO3</text>
            <text x="18" y="107" fill="#38bdf8" fontSize="5.5" fontWeight="bold">IO4</text>
            <text x="18" y="127" fill="#38bdf8" fontSize="5.5" fontWeight="bold">IO5</text>
            {/* Right Header Solder Pads & Silkscreen */}
            <text x="72" y="27" fill="#ef4444" fontSize="5.5" fontWeight="bold" textAnchor="end">3V3</text>
            <text x="72" y="47" fill="#94a3b8" fontSize="5.5" fontWeight="bold" textAnchor="end">GND</text>
            <text x="72" y="67" fill="#f59e0b" fontSize="5.5" fontWeight="bold" textAnchor="end">5V</text>
            <text x="72" y="87" fill="#38bdf8" fontSize="5.5" fontWeight="bold" textAnchor="end">IO6</text>
            <text x="72" y="107" fill="#38bdf8" fontSize="5.5" fontWeight="bold" textAnchor="end">IO7</text>
            <text x="72" y="127" fill="#38bdf8" fontSize="5.5" fontWeight="bold" textAnchor="end">IO8</text>
          </g>
        );
      }

      case 'arduino_mega': {
        const isPin13High = Boolean(output.mcuPinStates?.d13);
        return (
          <g>
            {/* Extended Teal Blue Arduino Mega PCB */}
            <rect x="5" y="5" width="240" height="140" rx="8" fill="#008184" stroke="#005d5f" strokeWidth="3" />
            {/* USB Type-B Port */}
            <rect x="2" y="22" width="34" height="28" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <rect x="2" y="29" width="12" height="14" fill="#1e293b" />
            {/* DC Barrel Jack */}
            <rect x="2" y="95" width="38" height="32" rx="3" fill="#0f172a" stroke="#1e293b" />
            <circle cx="20" cy="111" r="5" fill="#475569" />
            {/* ATmega2560 Square QFP-100 Microcontroller in 45° orientation */}
            <g transform="translate(105, 70) rotate(45)">
              <rect x="-18" y="-18" width="36" height="36" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="0" y="2" fill="#94a3b8" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">MEGA</text>
              <text x="0" y="8" fill="#64748b" fontSize="4.5" textAnchor="middle" fontFamily="monospace">2560</text>
            </g>
            {/* Arduino Brand Text */}
            <text x="145" y="35" fill="#ffffff" fontSize="12" fontWeight="bold">ARDUINO</text>
            <text x="145" y="47" fill="#a5f3fc" fontSize="9" fontWeight="bold">MEGA 2560</text>
            {/* Pin 13 LED */}
            <circle cx="45" cy="40" r="3.5" fill={isPin13High ? '#eab308' : '#475569'} filter={isPin13High ? 'drop-shadow(0 0 6px #facc15)' : 'none'} />
            <text x="45" y="34" fill="#facc15" fontSize="7" fontWeight="bold" textAnchor="middle">L</text>
            {/* Digital Header Strip across top */}
            <rect x="35" y="8" width="180" height="12" rx="2" fill="#0f172a" stroke="#334155" />
            {/* Double-row 36-pin header on right end */}
            <rect x="225" y="25" width="16" height="95" rx="2" fill="#0f172a" stroke="#334155" />
            {/* Bottom Analog/Power Headers */}
            <rect x="35" y="130" width="170" height="12" rx="2" fill="#0f172a" stroke="#334155" />
          </g>
        );
      }

      case 'arduino_pro_mini': {
        return (
          <g>
            {/* Compact Royal Blue PCB */}
            <rect x="5" y="5" width="70" height="130" rx="4" fill="#1e3a8a" stroke="#172554" strokeWidth="2" />
            {/* ATmega328P TQFP-32 Square IC in center */}
            <rect x="25" y="50" width="30" height="30" rx="1.5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <circle cx="28" cy="53" r="1.5" fill="#64748b" />
            <text x="40" y="67" fill="#94a3b8" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">MEGA</text>
            <text x="40" y="74" fill="#64748b" fontSize="4.5" textAnchor="middle" fontFamily="monospace">328P</text>
            {/* 16MHz Crystal Resonator */}
            <rect x="32" y="36" width="16" height="8" rx="2" fill="#cbd5e1" stroke="#64748b" />
            {/* 6-Pin FTDI Programming Header at Top */}
            <rect x="14" y="6" width="52" height="10" rx="1.5" fill="#0f172a" stroke="#334155" />
            <text x="40" y="23" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">PRO MINI</text>
            <text x="40" y="31" fill="#93c5fd" fontSize="5" textAnchor="middle">5V 16MHz</text>
            {/* Reset Button */}
            <circle cx="40" cy="95" r="4.5" fill="#e2e8f0" stroke="#64748b" />
            <circle cx="40" cy="95" r="2.5" fill="#dc2626" />
            {/* Power LED and Pin 13 LED */}
            <circle cx="20" cy="95" r="2" fill={output.powered ? '#ef4444' : '#450a0a'} />
            <circle cx="60" cy="95" r="2" fill={output.powered ? '#22c55e' : '#052e16'} />
            {/* Side header pin traces */}
            <rect x="6" y="24" width="8" height="96" fill="#0f172a" rx="1" />
            <rect x="66" y="24" width="8" height="96" fill="#0f172a" rx="1" />
          </g>
        );
      }

      case 'arduino_due': {
        return (
          <g>
            {/* Azure Blue Extended PCB */}
            <rect x="5" y="5" width="230" height="140" rx="8" fill="#005d5f" stroke="#003e40" strokeWidth="3" />
            {/* Dual Micro-USB Ports */}
            <rect x="2" y="20" width="22" height="20" rx="2" fill="#cbd5e1" stroke="#64748b" />
            <rect x="2" y="50" width="22" height="20" rx="2" fill="#cbd5e1" stroke="#64748b" />
            <text x="14" y="44" fill="#a5f3fc" fontSize="4.5" textAnchor="middle">DEBUG</text>
            <text x="14" y="74" fill="#a5f3fc" fontSize="4.5" textAnchor="middle">NATIVE</text>
            {/* DC Barrel Jack */}
            <rect x="2" y="95" width="34" height="28" rx="2" fill="#0f172a" />
            {/* SAM3X8E 32-bit Cortex-M3 Processor IC */}
            <rect x="90" y="50" width="40" height="40" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x="110" y="68" fill="#e2e8f0" fontSize="7" fontWeight="bold" textAnchor="middle">ATMEL</text>
            <text x="110" y="78" fill="#38bdf8" fontSize="6" textAnchor="middle">SAM3X8E</text>
            <text x="110" y="86" fill="#94a3b8" fontSize="5" textAnchor="middle">ARM Cortex-M3</text>
            {/* Branding */}
            <text x="165" y="35" fill="#ffffff" fontSize="12" fontWeight="bold">ARDUINO</text>
            <text x="165" y="47" fill="#a5f3fc" fontSize="9" fontWeight="bold">DUE 3.3V</text>
            {/* Header banks */}
            <rect x="35" y="8" width="170" height="10" rx="1.5" fill="#0f172a" />
            <rect x="35" y="132" width="170" height="10" rx="1.5" fill="#0f172a" />
            <rect x="215" y="25" width="14" height="95" rx="1.5" fill="#0f172a" />
          </g>
        );
      }

      case 'teensy_40': {
        return (
          <g>
            {/* Matte Black High-Density PCB with Gold Trim */}
            <rect x="5" y="5" width="110" height="45" rx="4" fill="#090d16" stroke="#f59e0b" strokeWidth="1.5" />
            {/* Micro-USB Port on Left */}
            <rect x="2" y="16" width="18" height="18" rx="2" fill="#cbd5e1" stroke="#64748b" />
            <rect x="4" y="20" width="6" height="10" fill="#0f172a" />
            {/* NXP i.MX RT1062 600MHz ARM Cortex-M7 Core */}
            <rect x="38" y="12" width="26" height="26" rx="2" fill="#0f172a" stroke="#334155" />
            <text x="51" y="23" fill="#e2e8f0" fontSize="5.5" fontWeight="bold" textAnchor="middle">NXP</text>
            <text x="51" y="30" fill="#f59e0b" fontSize="5" fontWeight="bold" textAnchor="middle">RT1062</text>
            <text x="51" y="36" fill="#94a3b8" fontSize="4" textAnchor="middle">600MHz M7</text>
            {/* Program Pushbutton in Orange */}
            <circle cx="78" cy="25" r="4.5" fill="#ea580c" stroke="#c2410c" />
            <circle cx="78" cy="25" r="2.5" fill="#fed7aa" />
            {/* Teensy 4.0 Gold Silk Text */}
            <text x="96" y="23" fill="#f59e0b" fontSize="6.5" fontWeight="bold" textAnchor="middle">TEENSY</text>
            <text x="96" y="31" fill="#fef08a" fontSize="5.5" fontWeight="bold" textAnchor="middle">4.0</text>
            {/* Gold Pin Pads row top and bottom */}
            <rect x="12" y="7" width="94" height="4" fill="#d97706" rx="1" />
            <rect x="12" y="39" width="94" height="4" fill="#d97706" rx="1" />
          </g>
        );
      }

      case 'nodemcu_esp8266': {
        return (
          <g>
            {/* Black NodeMCU Lolin/Amica PCB */}
            <rect x="5" y="5" width="120" height="170" rx="8" fill="#090d16" stroke="#1e293b" strokeWidth="2" />
            {/* Gold Meandering PCB Antenna on Top */}
            <path
              d="M 25 18 L 25 8 L 32 8 L 32 18 L 39 18 L 39 8 L 46 8 L 46 18 L 53 18 L 53 8 L 60 8 L 60 18 L 67 18 L 67 8 L 74 8 L 74 18 L 81 18 L 81 8 L 88 8 L 88 18 L 95 18 L 95 8"
              stroke="#eab308"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="square"
            />
            {/* Silver ESP-12E Metal Shield Can */}
            <rect x="22" y="24" width="76" height="66" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <rect x="25" y="27" width="70" height="60" rx="2" fill="#94a3b8" />
            <text x="60" y="46" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              ESP-12E
            </text>
            <text x="60" y="58" fill="#1e293b" fontSize="6.5" fontWeight="bold" textAnchor="middle">
              ESP8266MOD
            </text>
            <text x="60" y="68" fill="#334155" fontSize="5.5" textAnchor="middle">
              Wi-Fi 802.11 b/g/n
            </text>
            <text x="60" y="76" fill="#334155" fontSize="5" textAnchor="middle">
              FCC ID: 2AHMR-ESP12S
            </text>
            {/* CP2102 USB-to-UART Bridge IC */}
            <rect x="48" y="102" width="24" height="20" rx="1.5" fill="#0f172a" stroke="#334155" />
            <text x="60" y="114" fill="#94a3b8" fontSize="5" textAnchor="middle" fontFamily="monospace">CP2102</text>
            {/* Reset & Flash Tactile Micro Buttons */}
            <rect x="22" y="128" width="14" height="12" rx="1.5" fill="#e2e8f0" stroke="#64748b" />
            <circle cx="29" cy="134" r="3" fill="#0f172a" />
            <text x="29" y="124" fill="#94a3b8" fontSize="5" fontWeight="bold" textAnchor="middle">RST</text>
            <rect x="84" y="128" width="14" height="12" rx="1.5" fill="#e2e8f0" stroke="#64748b" />
            <circle cx="91" cy="134" r="3" fill="#0f172a" />
            <text x="91" y="124" fill="#94a3b8" fontSize="5" fontWeight="bold" textAnchor="middle">FLASH</text>
            {/* Micro-USB Port at Bottom */}
            <rect x="48" y="152" width="24" height="20" rx="2.5" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <rect x="52" y="158" width="16" height="8" rx="1" fill="#0f172a" />
            {/* Left and Right Header Pin Bars */}
            <rect x="8" y="20" width="10" height="135" rx="1.5" fill="#0f172a" stroke="#334155" />
            <rect x="102" y="20" width="10" height="135" rx="1.5" fill="#0f172a" stroke="#334155" />
          </g>
        );
      }

      case 'raspberry_pi_pico_w': {
        return (
          <g>
            {/* Raspberry Pi Green PCB */}
            <rect x="5" y="5" width="80" height="150" rx="5" fill="#15803d" stroke="#14532d" strokeWidth="2" />
            {/* Silver Metal Shield Can covering Infineon CYW43439 Wi-Fi Module with Raspberry Pi Logo */}
            <rect x="18" y="15" width="44" height="40" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="40" cy="30" r="7" fill="#dc2626" />
            <circle cx="36" cy="28" r="2.5" fill="#ffffff" />
            <circle cx="44" cy="28" r="2.5" fill="#ffffff" />
            <text x="40" y="47" fill="#0f172a" fontSize="5.5" fontWeight="bold" textAnchor="middle">CYW43439</text>
            {/* RP2040 Dual Core ARM Cortex-M0+ IC */}
            <rect x="25" y="65" width="30" height="30" rx="2" fill="#0f172a" stroke="#334155" />
            <text x="40" y="78" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" textAnchor="middle">RP2040</text>
            <text x="40" y="86" fill="#22c55e" fontSize="5" textAnchor="middle">Raspberry Pi</text>
            {/* BOOTSEL Button */}
            <circle cx="40" cy="108" r="4.5" fill="#f8fafc" stroke="#64748b" />
            <circle cx="40" cy="108" r="2.5" fill="#ffffff" />
            <text x="40" y="100" fill="#f8fafc" fontSize="4.5" fontWeight="bold" textAnchor="middle">BOOTSEL</text>
            {/* Micro-USB Port on Top */}
            <rect x="28" y="2" width="24" height="12" rx="2" fill="#cbd5e1" stroke="#64748b" />
            {/* Castellated Pin Pads on Left & Right */}
            <rect x="6" y="15" width="6" height="130" fill="#eab308" rx="1" />
            <rect x="68" y="15" width="6" height="130" fill="#eab308" rx="1" />
            <text x="40" y="138" fill="#f8fafc" fontSize="6.5" fontWeight="bold" textAnchor="middle">PICO W</text>
          </g>
        );
      }

      case 'raspberry_pi_4': {
        return (
          <g>
            {/* Signature Dark Green Single Board Computer PCB */}
            <rect x="5" y="5" width="210" height="110" rx="8" fill="#166534" stroke="#14532d" strokeWidth="2.5" />
            {/* Broadcom BCM2711 Quad Core 64-bit SoC with Silver Metal Heatspreader */}
            <rect x="75" y="32" width="36" height="36" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <text x="93" y="48" fill="#0f172a" fontSize="6" fontWeight="bold" textAnchor="middle">BROADCOM</text>
            <text x="93" y="56" fill="#1e293b" fontSize="5.5" textAnchor="middle">BCM2711</text>
            <text x="93" y="63" fill="#334155" fontSize="4.5" textAnchor="middle">Cortex-A72</text>
            {/* 40-Pin GPIO Expansion Header Strip along Top */}
            <rect x="20" y="8" width="165" height="14" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            {/* Gigabit Ethernet Jack on Right Edge */}
            <rect x="175" y="30" width="38" height="34" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
            <circle cx="205" cy="38" r="2" fill="#eab308" />
            <circle cx="205" cy="56" r="2" fill="#22c55e" />
            {/* 2x Blue USB 3.0 Ports */}
            <rect x="175" y="70" width="38" height="20" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            {/* 2x Black USB 2.0 Ports */}
            <rect x="175" y="94" width="38" height="20" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            {/* Dual Micro-HDMI Ports & USB-C Power on Bottom Edge */}
            <rect x="35" y="98" width="16" height="14" rx="2" fill="#cbd5e1" />
            <rect x="60" y="98" width="16" height="14" rx="2" fill="#cbd5e1" />
            <rect x="10" y="98" width="18" height="14" rx="2" fill="#94a3b8" />
            {/* Silk Logo and Text */}
            <text x="135" y="45" fill="#f8fafc" fontSize="10" fontWeight="bold">Raspberry Pi 4</text>
            <text x="135" y="57" fill="#86efac" fontSize="7">Model B 4GB</text>
          </g>
        );
      }

      case 'raspberry_pi_zero_w': {
        return (
          <g>
            {/* Compact Green PCB */}
            <rect x="5" y="5" width="130" height="60" rx="6" fill="#15803d" stroke="#14532d" strokeWidth="2" />
            {/* Broadcom SoC / Elpida RAM Chip */}
            <rect x="42" y="16" width="28" height="28" rx="2" fill="#0f172a" stroke="#334155" />
            <text x="56" y="29" fill="#e2e8f0" fontSize="5.5" fontWeight="bold" textAnchor="middle">ELPIDA</text>
            <text x="56" y="37" fill="#94a3b8" fontSize="4.5" textAnchor="middle">512MB RAM</text>
            {/* Silver Wi-Fi/Bluetooth RF Shield with Triangular PCB Antenna */}
            <rect x="14" y="16" width="22" height="22" rx="1.5" fill="#cbd5e1" stroke="#64748b" />
            {/* Dual Micro-USB Ports & Mini HDMI on Bottom Edge */}
            <rect x="80" y="48" width="16" height="12" rx="1.5" fill="#cbd5e1" />
            <rect x="104" y="48" width="16" height="12" rx="1.5" fill="#cbd5e1" />
            <rect x="14" y="48" width="18" height="12" rx="1.5" fill="#94a3b8" />
            {/* 40-Pin Unpopulated/Populated GPIO Header Pads across top */}
            <rect x="25" y="8" width="98" height="6" fill="#eab308" rx="1" />
            {/* Silk Label */}
            <text x="95" y="24" fill="#ffffff" fontSize="7" fontWeight="bold">Raspberry Pi</text>
            <text x="95" y="33" fill="#86efac" fontSize="6">Zero W</text>
          </g>
        );
      }

      // ================= EXPANDED ACTUATORS & MOTORS =================
      case 'stepper_motor': {
        const angle = ((output.rpm || 0) * 6) % 360;
        return (
          <g>
            {/* NEMA-style Square Aluminum Front Mounting Plate */}
            <rect x="6" y="6" width="108" height="108" rx="6" fill="#475569" stroke="#334155" strokeWidth="2.5" />
            {/* 4 Corner Screw Holes */}
            <circle cx="16" cy="16" r="3.5" fill="#1e293b" />
            <circle cx="104" cy="16" r="3.5" fill="#1e293b" />
            <circle cx="16" cy="104" r="3.5" fill="#1e293b" />
            <circle cx="104" cy="104" r="3.5" fill="#1e293b" />
            {/* Cylindrical Stepper Housing */}
            <circle cx="60" cy="60" r="42" fill="#0f172a" stroke="#1e293b" strokeWidth="3" />
            {/* Central Aluminum Bearing Hub */}
            <circle cx="60" cy="60" r="18" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="60" cy="60" r="10" fill="#94a3b8" />
            {/* Rotating D-Cut Motor Shaft */}
            <g transform={`rotate(${angle}, 60, 60)`}>
              <circle cx="60" cy="60" r="6" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
              <line x1="56" y1="55" x2="64" y2="55" stroke="#334155" strokeWidth="2.5" />
              <circle cx="60" cy="58" r="1.5" fill="#ef4444" />
            </g>
            {/* Lead Wire Cable Ribbon at Bottom */}
            <rect x="25" y="106" width="70" height="12" rx="2" fill="#1e293b" />
            <text x="60" y="85" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">28BYJ-48 STEPPER</text>
          </g>
        );
      }

      case 'servo_motor': {
        const servoAngle = component.properties.servoAngle ?? (output.powered ? 90 : 0);
        return (
          <g>
            {/* Translucent Blue / Dark SG90 Micro Servo Housing */}
            <rect x="15" y="25" width="70" height="55" rx="3" fill="#1d4ed8" fillOpacity="0.85" stroke="#1e40af" strokeWidth="2" />
            {/* Mounting Ears with Brass Eyelets */}
            <rect x="5" y="32" width="10" height="12" fill="#1d4ed8" rx="1" />
            <circle cx="9" cy="38" r="2.5" fill="#eab308" />
            <rect x="85" y="32" width="10" height="12" fill="#1d4ed8" rx="1" />
            <circle cx="91" cy="38" r="2.5" fill="#eab308" />
            {/* Internal Gears Chamber */}
            <circle cx="35" cy="45" r="14" fill="#172554" stroke="#1e3a8a" strokeWidth="1.5" />
            {/* Output Gear Spline with Rotating White Horn */}
            <g transform={`rotate(${servoAngle}, 35, 45)`}>
              <path d="M 35 32 L 30 45 L 30 75 A 5 5 0 0 0 40 75 L 40 45 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="35" cy="72" r="2" fill="#475569" />
              <circle cx="35" cy="62" r="2" fill="#475569" />
              <circle cx="35" cy="52" r="2" fill="#475569" />
              <circle cx="35" cy="45" r="7" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="35" cy="45" r="3.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
              <line x1="33" y1="45" x2="37" y2="45" stroke="#713f12" strokeWidth="1" />
            </g>
            {/* 3-Wire Ribbon Cable */}
            <line x1="25" y1="80" x2="25" y2="95" stroke="#854d0e" strokeWidth="3" />
            <line x1="50" y1="80" x2="50" y2="95" stroke="#ef4444" strokeWidth="3" />
            <line x1="75" y1="80" x2="75" y2="95" stroke="#f97316" strokeWidth="3" />
            <text x="50" y="20" fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle">SG90 SERVO</text>
          </g>
        );
      }

      case 'vibration_motor': {
        const isVibrating = output.powered;
        return (
          <g>
            {/* Vibration Waves Graphic when Energized */}
            {isVibrating && (
              <g stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.8">
                <path d="M 8 25 Q 5 35 8 45" />
                <path d="M 62 25 Q 65 35 62 45" />
              </g>
            )}
            {/* Round 10mm Silver Coin Pager Motor Body */}
            <circle cx="35" cy="35" r="25" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2.5" />
            <circle cx="35" cy="35" r="22" fill="#f1f5f9" />
            <circle cx="35" cy="35" r="16" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            <path d="M 15 15 L 25 10 L 20 22 Z" fill="#3b82f6" />
            <line x1="25" y1="58" x2="25" y2="65" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="45" y1="58" x2="45" y2="65" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
            <text x="35" y="38" fill="#475569" fontSize="6.5" fontWeight="bold" textAnchor="middle">HAPTIC</text>
          </g>
        );
      }

      case 'solenoid': {
        const isEnergized = output.powered;
        return (
          <g>
            {/* Metal Frame Box */}
            <rect x="15" y="15" width="85" height="40" rx="3" fill="#64748b" stroke="#334155" strokeWidth="2" />
            {/* Visible Copper Wire Solenoid Coil */}
            <rect x="25" y="20" width="65" height="30" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            <line x1="30" y1="20" x2="30" y2="50" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="45" y1="20" x2="45" y2="50" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="60" y1="20" x2="60" y2="50" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="75" y1="20" x2="75" y2="50" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
            {/* Steel Armature Plunger extending with spring */}
            <rect x={isEnergized ? "90" : "80"} y="27" width="30" height="16" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <circle cx={isEnergized ? "114" : "104"} cy="35" r="4" fill="#0f172a" />
            <text x="57" y="38" fill="#fef3c7" fontSize="7" fontWeight="bold" textAnchor="middle">SOLENOID</text>
          </g>
        );
      }

      case 'light_bulb': {
        const isLit = output.powered;
        const brightness = output.brightness || (isLit ? 1 : 0);
        return (
          <g>
            {/* Radiant Ambient Glow Halo when Energized */}
            {isLit && (
              <circle
                cx="35"
                cy="35"
                r="34"
                fill="#fde047"
                fillOpacity={0.25 * brightness}
                filter="drop-shadow(0 0 16px #facc15)"
              />
            )}
            {/* Clear/Frosted Glass Bulb Globe */}
            <circle cx="35" cy="35" r="25" fill={isLit ? "#fef08a" : "#f8fafc"} fillOpacity={isLit ? 0.9 : 0.6} stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="28" y1="52" x2="30" y2="35" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="42" y1="52" x2="40" y2="35" stroke="#94a3b8" strokeWidth="1.5" />
            <path
              d="M 30 35 Q 35 25 40 35"
              fill="none"
              stroke={isLit ? "#ea580c" : "#64748b"}
              strokeWidth={isLit ? "2.5" : "1.5"}
              filter={isLit ? "drop-shadow(0 0 8px #f97316)" : "none"}
            />
            {/* Brass Threaded Screw Base (E27) */}
            <rect x="25" y="60" width="20" height="15" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1" />
            <line x1="25" y1="64" x2="45" y2="64" stroke="#fde68a" strokeWidth="1.2" />
            <line x1="25" y1="69" x2="45" y2="69" stroke="#fde68a" strokeWidth="1.2" />
            {/* Bottom Solder Terminal Contact */}
            <rect x="28" y="75" width="14" height="4" fill="#0f172a" />
            <circle cx="35" cy="80" r="3" fill="#94a3b8" />
          </g>
        );
      }

      case 'relay': {
        const isEnergized = output.powered;
        return (
          <g>
            {/* Relay Module PCB Carrier */}
            <rect x="5" y="5" width="80" height="70" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            {/* Songle 5V Blue Relay Plastic Cube Body */}
            <rect x="25" y="10" width="55" height="45" rx="3" fill="#1d4ed8" stroke="#1e40af" strokeWidth="1.5" />
            <text x="52" y="24" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">SONGLE</text>
            <text x="52" y="32" fill="#93c5fd" fontSize="5" textAnchor="middle">5VDC RELAY</text>
            <text x="52" y="40" fill="#cbd5e1" fontSize="4.5" textAnchor="middle">10A 250VAC</text>
            {/* Status LED */}
            <circle cx="15" cy="20" r="3" fill={isEnergized ? '#22c55e' : '#14532d'} filter={isEnergized ? 'drop-shadow(0 0 6px #22c55e)' : 'none'} />
            <text x="15" y="28" fill="#86efac" fontSize="4.5" textAnchor="middle">ACT</text>
            {/* 3-Position Green Screw Terminal Block */}
            <rect x="25" y="58" width="55" height="14" rx="2" fill="#15803d" stroke="#14532d" />
            <circle cx="34" cy="65" r="3" fill="#cbd5e1" />
            <circle cx="52" cy="65" r="3" fill="#cbd5e1" />
            <circle cx="70" cy="65" r="3" fill="#cbd5e1" />
            <text x="34" y="56" fill="#86efac" fontSize="5" fontWeight="bold" textAnchor="middle">NO</text>
            <text x="52" y="56" fill="#86efac" fontSize="5" fontWeight="bold" textAnchor="middle">COM</text>
            <text x="70" y="56" fill="#86efac" fontSize="5" fontWeight="bold" textAnchor="middle">NC</text>
          </g>
        );
      }

      // ================= EXPANDED DISPLAYS & INPUTS =================
      case 'rotary_encoder': {
        return (
          <g>
            {/* Blue Module PCB */}
            <rect x="5" y="5" width="80" height="90" rx="4" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            {/* Round Metal Collar Base with Mounting Nut */}
            <circle cx="45" cy="40" r="26" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
            <circle cx="45" cy="40" r="22" fill="#94a3b8" />
            {/* Flatted Knurled Aluminum Shaft */}
            <circle cx="45" cy="40" r="14" fill="#475569" stroke="#334155" strokeWidth="2" />
            <path d="M 37 32 L 53 32 L 53 48 L 37 48 Z" fill="#64748b" />
            <circle cx="45" cy="40" r="5" fill="#1e293b" />
            <text x="45" y="70" fill="#f8fafc" fontSize="6.5" fontWeight="bold" textAnchor="middle">KY-040 ENCODER</text>
            <text x="15" y="82" fill="#93c5fd" fontSize="5" textAnchor="middle">CLK</text>
            <text x="32" y="82" fill="#93c5fd" fontSize="5" textAnchor="middle">DT</text>
            <text x="50" y="82" fill="#93c5fd" fontSize="5" textAnchor="middle">SW</text>
            <text x="68" y="82" fill="#ef4444" fontSize="5" textAnchor="middle">+</text>
            <text x="82" y="82" fill="#94a3b8" fontSize="5" textAnchor="middle">GND</text>
          </g>
        );
      }

      case 'keypad_4x4': {
        const keys = [
          ['1', '2', '3', 'A'],
          ['4', '5', '6', 'B'],
          ['7', '8', '9', 'C'],
          ['*', '0', '#', 'D'],
        ];
        return (
          <g>
            {/* Flexible Slate Membrane Matrix Overlay */}
            <rect x="5" y="5" width="130" height="130" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
            {keys.map((row, rIdx) =>
              row.map((k, cIdx) => {
                const bx = 16 + cIdx * 28;
                const by = 16 + rIdx * 26;
                const isAction = ['A', 'B', 'C', 'D'].includes(k);
                const isSpecial = ['*', '#'].includes(k);
                return (
                  <g key={k}>
                    <rect
                      x={bx}
                      y={by}
                      width="22"
                      height="20"
                      rx="3"
                      fill={isAction ? '#dc2626' : isSpecial ? '#2563eb' : '#1e293b'}
                      stroke="#475569"
                      strokeWidth="1.2"
                    />
                    <text
                      x={bx + 11}
                      y={by + 14}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {k}
                    </text>
                  </g>
                );
              })
            )}
            <rect x="20" y="132" width="100" height="12" fill="#334155" rx="1" />
            <text x="70" y="141" fill="#94a3b8" fontSize="5.5" fontWeight="bold" textAnchor="middle">8-PIN MEMBRANE BUS</text>
          </g>
        );
      }

      case 'joystick_module': {
        return (
          <g>
            {/* Blue Module Carrier PCB */}
            <rect x="5" y="5" width="90" height="90" rx="5" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            <rect x="8" y="32" width="10" height="26" rx="2" fill="#e2e8f0" stroke="#64748b" />
            <rect x="37" y="8" width="26" height="10" rx="2" fill="#e2e8f0" stroke="#64748b" />
            {/* Thumbstick Cap */}
            <circle cx="50" cy="50" r="30" fill="#0f172a" stroke="#1e293b" strokeWidth="3" />
            <circle cx="50" cy="50" r="22" fill="#1e293b" />
            <circle cx="50" cy="50" r="14" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <circle cx="45" cy="45" r="1.5" fill="#475569" />
            <circle cx="55" cy="45" r="1.5" fill="#475569" />
            <circle cx="45" cy="55" r="1.5" fill="#475569" />
            <circle cx="55" cy="55" r="1.5" fill="#475569" />
            <text x="50" y="86" fill="#f8fafc" fontSize="5.5" fontWeight="bold" textAnchor="middle">PS2 JOYSTICK</text>
          </g>
        );
      }

      case 'led_rgb': {
        const isPowered = output.powered;
        return (
          <g>
            {isPowered && (
              <circle cx="30" cy="28" r="24" fill="#ec4899" fillOpacity="0.3" filter="drop-shadow(0 0 12px #a855f7)" />
            )}
            <circle cx="30" cy="28" r="18" fill={isPowered ? "#f472b6" : "#f1f5f9"} fillOpacity={isPowered ? 0.95 : 0.75} stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="14" y="38" width="32" height="6" rx="1.5" fill={isPowered ? "#ec4899" : "#e2e8f0"} stroke="#cbd5e1" />
            <rect x="23" y="24" width="3" height="4" fill="#ef4444" />
            <rect x="28.5" y="22" width="3" height="4" fill="#22c55e" />
            <rect x="34" y="24" width="3" height="4" fill="#3b82f6" />
            <line x1="20" y1="44" x2="20" y2="75" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1="27" y1="44" x2="27" y2="78" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1="33" y1="44" x2="33" y2="72" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="44" x2="40" y2="69" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <text x="30" y="10" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">RGB LED</text>
          </g>
        );
      }

      case 'seven_segment': {
        const isPowered = output.powered;
        const color = isPowered ? '#ef4444' : '#334155';
        const glow = isPowered ? 'drop-shadow(0 0 6px #ef4444)' : 'none';
        return (
          <g>
            <rect x="5" y="5" width="60" height="80" rx="4" fill="#090d16" stroke="#1e293b" strokeWidth="2" />
            <rect x="20" y="14" width="26" height="5" rx="1" fill={color} filter={glow} />
            <rect x="44" y="18" width="5" height="20" rx="1" fill={color} filter={glow} />
            <rect x="44" y="40" width="5" height="20" rx="1" fill={color} filter={glow} />
            <rect x="20" y="58" width="26" height="5" rx="1" fill={color} filter={glow} />
            <rect x="17" y="40" width="5" height="20" rx="1" fill={color} filter={glow} />
            <rect x="17" y="18" width="5" height="20" rx="1" fill={color} filter={glow} />
            <rect x="20" y="36" width="26" height="5" rx="1" fill={color} filter={glow} />
            <circle cx="53" cy="61" r="3" fill={color} filter={glow} />
            <text x="35" y="76" fill="#64748b" fontSize="5.5" fontWeight="bold" textAnchor="middle">7-SEGMENT</text>
          </g>
        );
      }

      case 'lcd_1602_i2c': {
        const text = component.properties.text || 'CircuitCraft OK';
        return (
          <g>
            <rect x="5" y="5" width="170" height="90" rx="5" fill="#065f46" stroke="#047857" strokeWidth="2.5" />
            <circle cx="14" cy="14" r="3" fill="#eab308" />
            <circle cx="166" cy="14" r="3" fill="#eab308" />
            <circle cx="14" cy="86" r="3" fill="#eab308" />
            <circle cx="166" cy="86" r="3" fill="#eab308" />
            <rect x="20" y="14" width="140" height="56" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
            <rect x="26" y="20" width="128" height="44" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <text x="32" y="38" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
              {text.slice(0, 16)}
            </text>
            <text x="32" y="54" fill="#a5f3fc" fontSize="8" fontFamily="monospace" letterSpacing="1">
              STATUS: READY
            </text>
            <rect x="25" y="74" width="70" height="16" rx="2" fill="#0f172a" />
            <text x="35" y="85" fill="#94a3b8" fontSize="5" fontWeight="bold">GND</text>
            <text x="50" y="85" fill="#ef4444" fontSize="5" fontWeight="bold">VCC</text>
            <text x="65" y="85" fill="#38bdf8" fontSize="5" fontWeight="bold">SDA</text>
            <text x="80" y="85" fill="#facc15" fontSize="5" fontWeight="bold">SCL</text>
          </g>
        );
      }

      case 'matrix_8x8': {
        const isPowered = output.powered;
        const dotColor = isPowered ? '#ef4444' : '#450a0a';
        const dotGlow = isPowered ? 'drop-shadow(0 0 4px #ef4444)' : 'none';
        return (
          <g>
            <rect x="5" y="5" width="100" height="100" rx="5" fill="#15803d" stroke="#166534" strokeWidth="2" />
            <rect x="12" y="10" width="86" height="72" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            {Array.from({ length: 8 }).map((_, r) =>
              Array.from({ length: 8 }).map((_, c) => (
                <circle
                  key={`m_${r}_${c}`}
                  cx={20 + c * 10}
                  cy={18 + r * 8}
                  r="3"
                  fill={(r + c) % 2 === 0 ? dotColor : '#1e293b'}
                  filter={(r + c) % 2 === 0 ? dotGlow : 'none'}
                />
              ))
            )}
            <text x="55" y="93" fill="#f8fafc" fontSize="6.5" fontWeight="bold" textAnchor="middle">MAX7219 MATRIX</text>
          </g>
        );
      }

      // ================= EXPANDED SENSORS =================
      case 'mq2_gas_sensor': {
        return (
          <g>
            {/* Blue Carrier PCB */}
            <rect x="5" y="5" width="100" height="85" rx="5" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            {/* Stainless Steel Woven Mesh Gas Sensor Dome */}
            <circle cx="55" cy="40" r="28" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="55" cy="40" r="24" fill="#475569" />
            <circle cx="55" cy="40" r="18" fill="#334155" stroke="#64748b" strokeDasharray="2 2" strokeWidth="1.5" />
            <circle cx="55" cy="40" r="6" fill="#1e293b" />
            {/* Power & Digital Threshold LEDs */}
            <circle cx="18" cy="25" r="2.5" fill={output.powered ? '#ef4444' : '#7f1d1d'} />
            <circle cx="18" cy="45" r="2.5" fill={output.powered ? '#22c55e' : '#14532d'} />
            <text x="18" y="34" fill="#fca5a5" fontSize="4.5" textAnchor="middle">PWR</text>
            <text x="18" y="54" fill="#86efac" fontSize="4.5" textAnchor="middle">DO</text>
            <text x="55" y="78" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle">MQ-2 GAS/SMOKE</text>
          </g>
        );
      }

      case 'soil_moisture': {
        return (
          <g>
            {/* Upper Circuit Area */}
            <rect x="5" y="5" width="55" height="45" rx="3" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            <rect x="18" y="16" width="18" height="12" rx="1" fill="#0f172a" />
            <circle cx="44" cy="22" r="2.5" fill={output.powered ? '#ef4444' : '#7f1d1d'} />
            {/* Two Parallel Gold-Plated Sensing Prongs extending downwards */}
            <path d="M 12 50 L 12 130 A 6 6 0 0 0 24 130 L 24 50 Z" fill="#0f172a" stroke="#eab308" strokeWidth="2" />
            <path d="M 40 50 L 40 130 A 6 6 0 0 0 52 130 L 52 50 Z" fill="#0f172a" stroke="#eab308" strokeWidth="2" />
            <line x1="18" y1="60" x2="18" y2="120" stroke="#facc15" strokeWidth="2" />
            <line x1="46" y1="60" x2="46" y2="120" stroke="#facc15" strokeWidth="2" />
            <text x="32" y="42" fill="#f8fafc" fontSize="5.5" fontWeight="bold" textAnchor="middle">SOIL SENSOR</text>
          </g>
        );
      }

      case 'sound_sensor': {
        return (
          <g>
            {/* Blue Module PCB */}
            <rect x="5" y="5" width="95" height="75" rx="4" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            {/* Round Silver Electret Condenser Microphone Capsule */}
            <circle cx="32" cy="35" r="18" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="32" cy="35" r="14" fill="#0f172a" />
            <circle cx="32" cy="35" r="8" fill="#1e293b" />
            {/* LM393 Comparator IC */}
            <rect x="62" y="18" width="24" height="16" rx="1" fill="#0f172a" />
            <text x="74" y="28" fill="#94a3b8" fontSize="5" textAnchor="middle">LM393</text>
            {/* Trimmer Potentiometer */}
            <rect x="62" y="42" width="22" height="16" rx="1.5" fill="#2563eb" stroke="#1d4ed8" />
            <circle cx="73" cy="50" r="3.5" fill="#ca8a04" />
            <text x="50" y="68" fill="#f8fafc" fontSize="6.5" fontWeight="bold" textAnchor="middle">MIC SOUND</text>
          </g>
        );
      }

      case 'ir_sensor': {
        return (
          <g>
            {/* Blue PCB */}
            <rect x="5" y="5" width="80" height="65" rx="4" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            {/* Clear/Blue IR Emitter LED */}
            <rect x="20" y="2" width="12" height="20" rx="4" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1.2" />
            {/* Black IR Receiver Photodiode */}
            <rect x="48" y="2" width="12" height="20" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
            <rect x="25" y="26" width="30" height="14" rx="1" fill="#0f172a" />
            <rect x="28" y="44" width="24" height="14" rx="1" fill="#2563eb" />
            <text x="45" y="64" fill="#f8fafc" fontSize="6" fontWeight="bold" textAnchor="middle">IR BARRIER</text>
          </g>
        );
      }

      case 'flame_sensor': {
        return (
          <g>
            {/* Blue PCB */}
            <rect x="5" y="5" width="80" height="65" rx="4" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
            {/* Black High-Sensitivity Photodiode Tube pointing forward */}
            <circle cx="45" cy="14" r="9" fill="#090d16" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="45" cy="14" r="5" fill="#000000" />
            <path d="M 45 6 Q 49 11 47 16 Q 45 18 43 16 Q 41 12 45 6 Z" fill="#ef4444" />
            <rect x="28" y="28" width="24" height="14" rx="1" fill="#0f172a" />
            <text x="40" y="38" fill="#94a3b8" fontSize="5" textAnchor="middle">LM393</text>
            <text x="45" y="60" fill="#f8fafc" fontSize="6.5" fontWeight="bold" textAnchor="middle">FLAME DETECTOR</text>
          </g>
        );
      }

      case 'hall_effect': {
        return (
          <g>
            {/* Small Blue Carrier Board */}
            <rect x="5" y="5" width="60" height="50" rx="3" fill="#1d4ed8" stroke="#1e40af" strokeWidth="1.5" />
            {/* TO-92 Hall Magnetic Sensor Chip */}
            <path d="M 22 25 L 38 25 A 8 8 0 0 1 38 41 L 22 41 Z" fill="#0f172a" stroke="#334155" />
            <text x="30" y="34" fill="#94a3b8" fontSize="4.5" fontWeight="bold" textAnchor="middle">3144</text>
            <circle cx="50" cy="20" r="2.5" fill={output.powered ? '#22c55e' : '#14532d'} />
            <text x="35" y="48" fill="#f8fafc" fontSize="5" fontWeight="bold" textAnchor="middle">HALL SENSOR</text>
          </g>
        );
      }

      case 'water_level': {
        return (
          <g>
            {/* Tall Narrow Red/Blue Depth Sensor Board */}
            <rect x="4" y="4" width="32" height="112" rx="3" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
            <rect x="6" y="6" width="28" height="22" rx="2" fill="#0f172a" />
            <circle cx="20" cy="14" r="2.5" fill={output.powered ? '#22c55e' : '#14532d'} />
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1={8 + i * 3}
                y1="34"
                x2={8 + i * 3}
                y2="108"
                stroke="#facc15"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ))}
            <text x="20" y="24" fill="#f8fafc" fontSize="5" fontWeight="bold" textAnchor="middle">WATER</text>
          </g>
        );
      }

      case 'bmp280': {
        return (
          <g>
            {/* Miniature Purple Sensor Breakout Board */}
            <rect x="4" y="4" width="47" height="37" rx="3" fill="#7e22ce" stroke="#6b21a8" strokeWidth="1.5" />
            <rect x="14" y="10" width="22" height="16" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <circle cx="20" cy="18" r="1.5" fill="#0f172a" />
            <text x="25" y="21" fill="#334155" fontSize="4" fontWeight="bold" fontFamily="monospace">BMP280</text>
            <text x="27.5" y="32" fill="#f3e8ff" fontSize="5" fontWeight="bold" textAnchor="middle">BARO/ALT</text>
          </g>
        );
      }

      case 'load_cell_hx711': {
        return (
          <g>
            {/* Green Breakout PCB */}
            <rect x="5" y="5" width="100" height="60" rx="4" fill="#15803d" stroke="#166534" strokeWidth="2" />
            <rect x="36" y="18" width="28" height="20" rx="1.5" fill="#0f172a" stroke="#334155" />
            <text x="50" y="30" fill="#e2e8f0" fontSize="6" fontWeight="bold" textAnchor="middle">HX711</text>
            <text x="50" y="36" fill="#86efac" fontSize="4.5" textAnchor="middle">24-BIT ADC</text>
            <rect x="70" y="22" width="14" height="8" rx="2" fill="#cbd5e1" />
            <circle cx="15" cy="15" r="3" fill="#dc2626" />
            <text x="22" y="17" fill="#fca5a5" fontSize="5">E+</text>
            <circle cx="15" cy="25" r="3" fill="#0f172a" />
            <text x="22" y="27" fill="#cbd5e1" fontSize="5">E-</text>
            <circle cx="15" cy="35" r="3" fill="#ffffff" />
            <text x="22" y="37" fill="#f8fafc" fontSize="5">A-</text>
            <circle cx="15" cy="45" r="3" fill="#22c55e" />
            <text x="22" y="47" fill="#86efac" fontSize="5">A+</text>
            <text x="50" y="54" fill="#f8fafc" fontSize="6.5" fontWeight="bold" textAnchor="middle">WEIGHT / LOAD CELL</text>
          </g>
        );
      }

      // ================= EXPANDED PASSIVES, GATES & SEMICONDUCTORS =================
      case 'dip_switch': {
        const dipStates = component.properties.dipStates || [false, false, false, false];
        return (
          <g>
            {/* Bright Red DIP Switch Casing */}
            <rect x="5" y="5" width="80" height="60" rx="3" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
            <text x="12" y="16" fill="#ffffff" fontSize="6" fontWeight="bold">ON</text>
            {[0, 1, 2, 3].map((idx) => {
              const sx = 22 + idx * 16;
              const isUp = Boolean(dipStates[idx]);
              return (
                <g key={idx}>
                  <rect x={sx} y="18" width="10" height="30" rx="1.5" fill="#0f172a" />
                  <rect x={sx + 1} y={isUp ? 20 : 34} width="8" height="12" rx="1.5" fill="#f8fafc" stroke="#94a3b8" />
                  <text x={sx + 5} y="54" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">
                    {idx + 1}
                  </text>
                </g>
              );
            })}
          </g>
        );
      }

      case 'inductor': {
        return (
          <g>
            <circle cx="40" cy="22" r="16" fill="#1e293b" stroke="#78350f" strokeWidth="3" />
            <circle cx="40" cy="22" r="8" fill="#070a12" />
            <circle cx="40" cy="22" r="13" fill="none" stroke="#d97706" strokeWidth="2.5" strokeDasharray="3 2" />
            <line x1="5" y1="22" x2="24" y2="22" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="56" y1="22" x2="75" y2="22" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <text x="40" y="42" fill="#d97706" fontSize="6.5" fontWeight="bold" textAnchor="middle">
              {component.properties.inductance ? `${component.properties.inductance}H` : 'INDUCTOR'}
            </text>
          </g>
        );
      }

      case 'zener_diode': {
        return (
          <g>
            <line x1="5" y1="18" x2="20" y2="18" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="18" x2="65" y2="18" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <rect x="20" y="10" width="30" height="16" rx="4" fill="#ea580c" fillOpacity="0.8" stroke="#c2410c" strokeWidth="1.2" />
            <rect x="23" y="10" width="5" height="16" fill="#0f172a" />
            <circle cx="36" cy="18" r="2.5" fill="#fef08a" />
            <text x="35" y="32" fill="#fdba74" fontSize="6.5" fontWeight="bold" textAnchor="middle">ZENER</text>
          </g>
        );
      }

      case 'fuse': {
        return (
          <g>
            <line x1="5" y1="18" x2="16" y2="18" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="54" y1="18" x2="65" y2="18" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="16" y="10" width="38" height="16" rx="3" fill="#f8fafc" fillOpacity="0.4" stroke="#94a3b8" strokeWidth="1" />
            <rect x="14" y="9" width="8" height="18" rx="1.5" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <rect x="48" y="9" width="8" height="18" rx="1.5" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <path d="M 22 18 Q 30 14 35 18 T 48 18" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
            <text x="35" y="32" fill="#cbd5e1" fontSize="6" fontWeight="bold" textAnchor="middle">FUSE</text>
          </g>
        );
      }

      case 'mosfet_n': {
        return (
          <g>
            <rect x="12" y="8" width="36" height="20" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="30" cy="17" r="4.5" fill="#475569" stroke="#334155" />
            <rect x="10" y="24" width="40" height="26" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
            <text x="30" y="37" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" textAnchor="middle">IRF540N</text>
            <text x="30" y="45" fill="#38bdf8" fontSize="5" textAnchor="middle">N-MOSFET</text>
            <line x1="18" y1="50" x2="18" y2="75" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1="30" y1="50" x2="30" y2="75" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1="42" y1="50" x2="42" y2="75" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      }

      case 'opamp': {
        return (
          <g>
            <rect x="12" y="12" width="66" height="66" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
            <path d="M 40 12 A 6 6 0 0 0 50 12" fill="none" stroke="#334155" strokeWidth="1.5" />
            <circle cx="22" cy="22" r="2.5" fill="#334155" />
            <text x="45" y="44" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">LM358N</text>
            <text x="45" y="54" fill="#38bdf8" fontSize="6" textAnchor="middle">DUAL OP-AMP</text>
            {[24, 38, 52, 66].map((y) => (
              <React.Fragment key={y}>
                <rect x="4" y={y - 3} width="8" height="6" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
                <rect x="78" y={y - 3} width="8" height="6" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
              </React.Fragment>
            ))}
          </g>
        );
      }

      case 'timer_555': {
        return (
          <g>
            <rect x="16" y="12" width="68" height="96" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
            <path d="M 45 12 A 6 6 0 0 0 55 12" fill="none" stroke="#334155" strokeWidth="1.5" />
            <circle cx="26" cy="24" r="2.5" fill="#334155" />
            <text x="50" y="55" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">NE555P</text>
            <text x="50" y="67" fill="#38bdf8" fontSize="6" textAnchor="middle">PRECISION TIMER</text>
            {[25, 50, 75, 100].map((y) => (
              <React.Fragment key={y}>
                <rect x="6" y={y - 4} width="10" height="8" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
                <rect x="84" y={y - 4} width="10" height="8" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
              </React.Fragment>
            ))}
          </g>
        );
      }

      case 'multimeter': {
        const v = output.voltageDrop || 0;
        return (
          <g>
            <rect x="5" y="5" width="130" height="140" rx="12" fill="#eab308" stroke="#ca8a04" strokeWidth="3" />
            <rect x="12" y="12" width="116" height="126" rx="8" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="22" y="20" width="96" height="36" rx="3" fill="#99f6e4" stroke="#0f766e" strokeWidth="1.5" />
            <text x="110" y="46" fill="#134e4a" fontSize="18" fontWeight="bold" textAnchor="end" fontFamily="monospace">
              {v.toFixed(2)}V
            </text>
            <circle cx="70" cy="85" r="22" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            <line x1="70" y1="85" x2="70" y2="68" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <text x="70" y="115" fill="#94a3b8" fontSize="6" fontWeight="bold" textAnchor="middle">DIGITAL MULTIMETER</text>
            <circle cx="35" cy="125" r="5" fill="#ef4444" />
            <circle cx="70" cy="125" r="5" fill="#0f172a" />
            <circle cx="105" cy="125" r="5" fill="#ef4444" />
          </g>
        );
      }

      case 'oscilloscope': {
        return (
          <g>
            <rect x="5" y="5" width="170" height="120" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
            <rect x="14" y="14" width="105" height="92" rx="3" fill="#022c22" stroke="#065f46" strokeWidth="2" />
            <line x1="14" y1="60" x2="119" y2="60" stroke="#047857" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="66" y1="14" x2="66" y2="106" stroke="#047857" strokeWidth="0.8" strokeDasharray="2 2" />
            <path
              d="M 16 60 Q 30 30 45 60 T 75 60 T 105 60 T 117 60"
              fill="none"
              stroke="#4ade80"
              strokeWidth="2"
              filter="drop-shadow(0 0 6px #22c55e)"
            />
            <circle cx="140" cy="35" r="10" fill="#334155" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="140" y="52" fill="#94a3b8" fontSize="4.5" textAnchor="middle">V/DIV</text>
            <circle cx="140" cy="72" r="10" fill="#334155" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="140" y="89" fill="#94a3b8" fontSize="4.5" textAnchor="middle">TIME/DIV</text>
            <circle cx="140" cy="105" r="5" fill="#cbd5e1" />
            <text x="140" y="117" fill="#64748b" fontSize="4.5" textAnchor="middle">CH1</text>
          </g>
        );
      }

      case 'ground': {
        return (
          <g>
            <circle cx="20" cy="10" r="5" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
            <line x1="20" y1="15" x2="20" y2="24" stroke="#d97706" strokeWidth="3" />
            <line x1="8" y1="24" x2="32" y2="24" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
            <line x1="12" y1="29" x2="28" y2="29" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="34" x2="24" y2="34" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      }

      case 'ac_source': {
        return (
          <g>
            <circle cx="30" cy="30" r="26" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
            <path
              d="M 16 30 Q 23 16 30 30 T 44 30"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeLinecap="round"
              filter="drop-shadow(0 0 6px #38bdf8)"
            />
            <text x="30" y="50" fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle">AC SOURCE</text>
          </g>
        );
      }

      // ================= BREADBOARDS =================
      case 'breadboard_half': {
        const powerXs = [30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230];
        const terminalXs = [35, 55, 75, 95, 115, 135, 155, 175, 195, 215, 235];
        const topBankYs = [80, 92, 104, 116, 128];
        const botBankYs = [152, 164, 176, 188, 200];
        const topLetters = ['a', 'b', 'c', 'd', 'e'];
        const botLetters = ['f', 'g', 'h', 'i', 'j'];

        return (
          <g>
            {/* Interlocking tabs and notches on edges */}
            <rect x="2" y="115" width="4" height="40" rx="1.5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            <rect x="254" y="115" width="4" height="40" rx="1.5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            <rect x="105" y="2" width="50" height="4" rx="1.5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            <rect x="105" y="274" width="50" height="4" rx="1.5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />

            {/* Main Breadboard ABS Plastic Chassis with subtle drop shadow and glossy bevel */}
            <rect x="5" y="5" width="250" height="270" rx="10" fill="#fdfdfd" stroke="#cbd5e1" strokeWidth="2" filter="drop-shadow(0 4px 16px rgba(0,0,0,0.12))" />
            <rect x="8" y="8" width="244" height="264" rx="8" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />

            {/* TOP POWER RAILS */}
            {/* Positive (+) Red Line with crisp glow */}
            <line x1="20" y1="28" x2="240" y2="28" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <text x="13" y="32" fill="#ef4444" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>
            <text x="247" y="32" fill="#ef4444" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>

            {/* Negative (-) Blue Line with crisp tone */}
            <line x1="20" y1="52" x2="240" y2="52" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
            <text x="13" y="55" fill="#2563eb" fontSize="16" fontWeight="bold" textAnchor="middle">-</text>
            <text x="247" y="55" fill="#2563eb" fontSize="16" fontWeight="bold" textAnchor="middle">-</text>

            {/* Top Power Rail Beveled Contact Holes */}
            {powerXs.map((x) => (
              <React.Fragment key={`top_p_${x}`}>
                {/* Positive Hole */}
                <rect x={x - 2.8} y={25.2} width="5.6" height="5.6" rx="1.2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
                <rect x={x - 2} y={26} width="4" height="4" rx="0.8" fill="#0f172a" />
                <line x1={x - 1} y1={28} x2={x + 1} y2={28} stroke="#475569" strokeWidth="0.8" />

                {/* Negative Hole */}
                <rect x={x - 2.8} y={49.2} width="5.6" height="5.6" rx="1.2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
                <rect x={x - 2} y={50} width="4" height="4" rx="0.8" fill="#0f172a" />
                <line x1={x - 1} y1={52} x2={x + 1} y2={52} stroke="#475569" strokeWidth="0.8" />
              </React.Fragment>
            ))}

            {/* Column Indices at Top */}
            <text x="35" y="72" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">1</text>
            <text x="75" y="72" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">5</text>
            <text x="115" y="72" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">10</text>
            <text x="155" y="72" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">15</text>
            <text x="195" y="72" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">20</text>
            <text x="235" y="72" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">25</text>

            {/* TOP BANK TERMINAL SOCKETS (Rows a-e) */}
            {topBankYs.map((y, rowIdx) => (
              <React.Fragment key={`tb_row_${y}`}>
                <text x="15" y={y + 2.5} fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">{topLetters[rowIdx]}</text>
                <text x="245" y={y + 2.5} fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">{topLetters[rowIdx]}</text>
                {terminalXs.map((x) => (
                  <g key={`tb_hole_${x}_${y}`}>
                    <rect x={x - 2.8} y={y - 2.8} width="5.6" height="5.6" rx="1.2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
                    <rect x={x - 2} y={y - 2} width="4" height="4" rx="0.8" fill="#0f172a" />
                    <line x1={x - 1} y1={y} x2={x + 1} y2={y} stroke="#475569" strokeWidth="0.8" />
                  </g>
                ))}
              </React.Fragment>
            ))}

            {/* CENTER DIP IC DIVIDER TROUGH (Depressed Channel with 3D shadow) */}
            <rect x="12" y="136" width="236" height="9" rx="2.5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="14" y1="137" x2="246" y2="137" stroke="#94a3b8" strokeWidth="0.8" />
            <text x="130" y="142.5" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle" letterSpacing="2">
              CIRCUIT CRAFT 400
            </text>

            {/* BOTTOM BANK TERMINAL SOCKETS (Rows f-j) */}
            {botBankYs.map((y, rowIdx) => (
              <React.Fragment key={`bb_row_${y}`}>
                <text x="15" y={y + 2.5} fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">{botLetters[rowIdx]}</text>
                <text x="245" y={y + 2.5} fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">{botLetters[rowIdx]}</text>
                {terminalXs.map((x) => (
                  <g key={`bb_hole_${x}_${y}`}>
                    <rect x={x - 2.8} y={y - 2.8} width="5.6" height="5.6" rx="1.2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
                    <rect x={x - 2} y={y - 2} width="4" height="4" rx="0.8" fill="#0f172a" />
                    <line x1={x - 1} y1={y} x2={x + 1} y2={y} stroke="#475569" strokeWidth="0.8" />
                  </g>
                ))}
              </React.Fragment>
            ))}

            {/* Column Indices at Bottom */}
            <text x="35" y="212" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">1</text>
            <text x="75" y="212" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">5</text>
            <text x="115" y="212" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">10</text>
            <text x="155" y="212" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">15</text>
            <text x="195" y="212" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">20</text>
            <text x="235" y="212" fill="#64748b" fontSize="6.5" fontWeight="bold" textAnchor="middle">25</text>

            {/* BOTTOM POWER RAILS */}
            {/* Negative (-) Blue Line */}
            <line x1="20" y1="228" x2="240" y2="228" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
            <text x="13" y="231" fill="#2563eb" fontSize="16" fontWeight="bold" textAnchor="middle">-</text>
            <text x="247" y="231" fill="#2563eb" fontSize="16" fontWeight="bold" textAnchor="middle">-</text>

            {/* Positive (+) Red Line */}
            <line x1="20" y1="252" x2="240" y2="252" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <text x="13" y="256" fill="#ef4444" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>
            <text x="247" y="256" fill="#ef4444" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>

            {/* Bottom Power Rail Contact Holes */}
            {powerXs.map((x) => (
              <React.Fragment key={`bot_p_${x}`}>
                <rect x={x - 2.8} y={225.2} width="5.6" height="5.6" rx="1.2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
                <rect x={x - 2} y={226} width="4" height="4" rx="0.8" fill="#0f172a" />
                <line x1={x - 1} y1={228} x2={x + 1} y2={228} stroke="#475569" strokeWidth="0.8" />

                <rect x={x - 2.8} y={249.2} width="5.6" height="5.6" rx="1.2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5" />
                <rect x={x - 2} y={250} width="4" height="4" rx="0.8" fill="#0f172a" />
                <line x1={x - 1} y1={252} x2={x + 1} y2={252} stroke="#475569" strokeWidth="0.8" />
              </React.Fragment>
            ))}
          </g>
        );
      }

      case 'breadboard_mini': {
        const miniLeftXs = [25, 40, 55, 70];
        const miniRightXs = [110, 125, 140, 155];
        const miniYs = [45, 65, 85, 105, 125, 145, 165, 185, 205];

        return (
          <g>
            {/* Mini Breadboard Plastic Housing */}
            <rect x="6" y="6" width="168" height="228" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="10" y="10" width="160" height="220" rx="6" fill="none" stroke="#e2e8f0" strokeWidth="1" />

            {/* Top Power / GND Rail Label */}
            <text x="18" y="26" fill="#ef4444" fontSize="11" fontWeight="bold">+</text>
            <line x1="28" y1="22" x2="148" y2="22" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="162" y="26" fill="#3b82f6" fontSize="13" fontWeight="bold">-</text>

            {/* Vertical Center Divider Groove */}
            <rect x="88" y="38" width="4" height="172" rx="1" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.6" />

            {/* Socket Holes */}
            {miniYs.map((y, rowIdx) => (
              <React.Fragment key={`mini_row_${y}`}>
                <text x="12" y={y + 2.5} fill="#94a3b8" fontSize="5.5" fontWeight="bold" textAnchor="middle">{rowIdx + 1}</text>
                <text x="168" y={y + 2.5} fill="#94a3b8" fontSize="5.5" fontWeight="bold" textAnchor="middle">{rowIdx + 1}</text>
                {miniLeftXs.map((x) => (
                  <rect key={`ml_${x}_${y}`} x={x - 2.5} y={y - 2.5} width="5" height="5" rx="1" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.5" />
                ))}
                {miniRightXs.map((x) => (
                  <rect key={`mr_${x}_${y}`} x={x - 2.5} y={y - 2.5} width="5" height="5" rx="1" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.5" />
                ))}
              </React.Fragment>
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
