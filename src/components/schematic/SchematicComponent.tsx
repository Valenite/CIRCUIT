import React from 'react';
import type { CircuitComponent, SimulationResult } from '../../types/circuit';

interface Props {
  component: CircuitComponent;
  simResult: SimulationResult;
  isSelected: boolean;
  onInteractiveClick?: (e: React.MouseEvent) => void;
}

export const SchematicComponent: React.FC<Props> = ({
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

  const renderSchematicSymbol = () => {
    switch (component.type) {
      // Push button / Tactile Switch (SPST Normally Open)
      case 'push_button': {
        const isClosed = Boolean(component.properties.state);
        return (
          <g onClick={onInteractiveClick} style={{ cursor: 'pointer' }}>
            {/* Terminal leads */}
            <line x1="10" y1="25" x2="22" y2="25" stroke="#f8fafc" strokeWidth="2" />
            <line x1="48" y1="25" x2="60" y2="25" stroke="#f8fafc" strokeWidth="2" />
            {/* Contact circular terminal pads */}
            <circle cx="22" cy="25" r="3" fill="#090d16" stroke={isClosed ? '#22c55e' : '#f8fafc'} strokeWidth="2" />
            <circle cx="48" cy="25" r="3" fill="#090d16" stroke={isClosed ? '#22c55e' : '#f8fafc'} strokeWidth="2" />
            {/* Switch Blade Contact */}
            {isClosed ? (
              <g>
                <line x1="22" y1="25" x2="48" y2="25" stroke="#22c55e" strokeWidth="3.5" filter="drop-shadow(0 0 6px #22c55e)" />
                <line x1="35" y1="25" x2="35" y2="10" stroke="#22c55e" strokeWidth="2" />
                <rect x="25" y="7" width="20" height="4" rx="1.5" fill="#22c55e" />
              </g>
            ) : (
              <g>
                <line x1="22" y1="25" x2="44" y2="13" stroke="#f8fafc" strokeWidth="2.5" />
                <line x1="33" y1="19" x2="33" y2="7" stroke="#94a3b8" strokeWidth="2" />
                <rect x="23" y="4" width="20" height="4" rx="1.5" fill="#94a3b8" />
              </g>
            )}
            <text
              x="35"
              y="44"
              fill={isClosed ? '#22c55e' : '#94a3b8'}
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              {isClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
            </text>
          </g>
        );
      }

      // Slide / Toggle Switch (SPDT)
      case 'toggle_switch': {
        const isOn = Boolean(component.properties.state);
        return (
          <g onClick={onInteractiveClick} style={{ cursor: 'pointer' }}>
            <line x1="10" y1="25" x2="22" y2="25" stroke="#f8fafc" strokeWidth="2" />
            <line x1="48" y1="15" x2="60" y2="15" stroke="#f8fafc" strokeWidth="2" />
            <line x1="48" y1="35" x2="60" y2="35" stroke="#f8fafc" strokeWidth="2" />
            <circle cx="22" cy="25" r="3" fill="#090d16" stroke="#f8fafc" strokeWidth="2" />
            <circle cx="48" cy="15" r="3" fill="#090d16" stroke={isOn ? '#38bdf8' : '#f8fafc'} strokeWidth="2" />
            <circle cx="48" cy="35" r="3" fill="#090d16" stroke={!isOn ? '#38bdf8' : '#f8fafc'} strokeWidth="2" />
            <line x1="22" y1="25" x2="48" y2={isOn ? 15 : 35} stroke="#38bdf8" strokeWidth="3" />
            <text x="35" y="49" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
              {isOn ? 'POS 2 (ON)' : 'POS 1 (OFF)'}
            </text>
          </g>
        );
      }
      // Battery / DC Source
      case 'battery_9v':
      case 'battery_aa':
      case 'battery_coin':
      case 'battery_dc':
      case 'battery_18650':
      case 'battery_lipo_3v7': {
        const v = component.properties.voltage || (component.type === 'battery_9v' ? 9 : component.type === 'battery_aa' ? 1.5 : (component.type === 'battery_18650' || component.type === 'battery_lipo_3v7') ? 3.7 : 5);
        return (
          <g>
            <line x1="30" y1="10" x2="30" y2="30" stroke="#f8fafc" strokeWidth="2" />
            <line x1="12" y1="30" x2="48" y2="30" stroke="#f8fafc" strokeWidth="3" />
            <text x="52" y="28" fill="#ef4444" fontSize="12" fontWeight="bold">
              +
            </text>
            <line x1="20" y1="38" x2="40" y2="38" stroke="#f8fafc" strokeWidth="4" />
            <line x1="12" y1="46" x2="48" y2="46" stroke="#f8fafc" strokeWidth="3" />
            <line x1="20" y1="54" x2="40" y2="54" stroke="#f8fafc" strokeWidth="4" />
            <text x="52" y="58" fill="#94a3b8" fontSize="14" fontWeight="bold">
              -
            </text>
            <line x1="30" y1="54" x2="30" y2="70" stroke="#f8fafc" strokeWidth="2" />
            <text x="6" y="44" fill="#38bdf8" fontSize="11" textAnchor="end" fontFamily="monospace">
              {v}V
            </text>
          </g>
        );
      }

      // AC Generator
      case 'ac_source': {
        return (
          <g>
            <line x1="30" y1="10" x2="30" y2="20" stroke="#f8fafc" strokeWidth="2" />
            <line x1="30" y1="50" x2="30" y2="60" stroke="#f8fafc" strokeWidth="2" />
            <circle cx="30" cy="35" r="15" fill="none" stroke="#f8fafc" strokeWidth="2" />
            <path d="M 22,35 Q 26,27 30,35 T 38,35" fill="none" stroke="#38bdf8" strokeWidth="2" />
          </g>
        );
      }

      // Ground
      case 'ground': {
        return (
          <g>
            <line x1="20" y1="10" x2="20" y2="22" stroke="#f8fafc" strokeWidth="2" />
            <line x1="6" y1="22" x2="34" y2="22" stroke="#f8fafc" strokeWidth="3" />
            <line x1="11" y1="28" x2="29" y2="28" stroke="#f8fafc" strokeWidth="2.5" />
            <line x1="16" y1="34" x2="24" y2="34" stroke="#f8fafc" strokeWidth="2" />
          </g>
        );
      }

      // Resistor
      case 'resistor': {
        const r = component.properties.resistance || 220;
        return (
          <g>
            <line x1="5" y1="18" x2="20" y2="18" stroke="#f8fafc" strokeWidth="2" />
            <line x1="70" y1="18" x2="85" y2="18" stroke="#f8fafc" strokeWidth="2" />
            <polyline
              points="20,18 24,10 32,26 40,10 48,26 56,10 64,26 68,18 70,18"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <text x="45" y="4" fill="#38bdf8" fontSize="11" textAnchor="middle" fontFamily="monospace">
              {r >= 1000 ? `${(r / 1000).toFixed(1)}kΩ` : `${r}Ω`}
            </text>
          </g>
        );
      }

      // Photoresistor (LDR)
      case 'photoresistor': {
        return (
          <g>
            <line x1="10" y1="25" x2="25" y2="25" stroke="#f8fafc" strokeWidth="2" />
            <line x1="55" y1="25" x2="70" y2="25" stroke="#f8fafc" strokeWidth="2" />
            <rect x="25" y="17" width="30" height="16" fill="none" stroke="#f8fafc" strokeWidth="2" />
            {/* Arrows incoming */}
            <line x1="28" y1="6" x2="38" y2="14" stroke="#fbbf24" strokeWidth="1.5" />
            <polygon points="38,14 32,13 36,9" fill="#fbbf24" />
            <line x1="38" y1="6" x2="48" y2="14" stroke="#fbbf24" strokeWidth="1.5" />
            <polygon points="48,14 42,13 46,9" fill="#fbbf24" />
          </g>
        );
      }

      // Thermistor
      case 'thermistor': {
        return (
          <g>
            <line x1="10" y1="25" x2="25" y2="25" stroke="#f8fafc" strokeWidth="2" />
            <line x1="55" y1="25" x2="70" y2="25" stroke="#f8fafc" strokeWidth="2" />
            <rect x="25" y="17" width="30" height="16" fill="none" stroke="#f8fafc" strokeWidth="2" />
            <line x1="20" y1="36" x2="30" y2="36" stroke="#38bdf8" strokeWidth="2" />
            <line x1="30" y1="36" x2="58" y2="10" stroke="#38bdf8" strokeWidth="2" />
            <text x="66" y="14" fill="#38bdf8" fontSize="8" fontWeight="bold">
              -t°
            </text>
          </g>
        );
      }

      // Capacitor
      case 'capacitor': {
        return (
          <g>
            <line x1="30" y1="10" x2="30" y2="30" stroke="#f8fafc" strokeWidth="2" />
            <line x1="30" y1="40" x2="30" y2="60" stroke="#f8fafc" strokeWidth="2" />
            {/* Flat plate (+) */}
            <line x1="15" y1="30" x2="45" y2="30" stroke="#f8fafc" strokeWidth="3" />
            {/* Curved plate (-) */}
            <path d="M 15,40 Q 30,44 45,40" fill="none" stroke="#f8fafc" strokeWidth="3" />
            <text x="48" y="28" fill="#ef4444" fontSize="10" fontWeight="bold">
              +
            </text>
          </g>
        );
      }

      // Inductor
      case 'inductor': {
        return (
          <g>
            <line x1="8" y1="20" x2="20" y2="20" stroke="#f8fafc" strokeWidth="2" />
            <line x1="70" y1="20" x2="82" y2="20" stroke="#f8fafc" strokeWidth="2" />
            <path d="M 20,20 A 6,8 0 0,1 32,20" fill="none" stroke="#f8fafc" strokeWidth="2.5" />
            <path d="M 32,20 A 6,8 0 0,1 44,20" fill="none" stroke="#f8fafc" strokeWidth="2.5" />
            <path d="M 44,20 A 6,8 0 0,1 56,20" fill="none" stroke="#f8fafc" strokeWidth="2.5" />
            <path d="M 56,20 A 6,8 0 0,1 68,20" fill="none" stroke="#f8fafc" strokeWidth="2.5" />
          </g>
        );
      }

      // Diode
      case 'diode':
      case 'zener_diode': {
        const isZener = component.type === 'zener_diode';
        return (
          <g>
            <line x1="10" y1="20" x2="25" y2="20" stroke="#f8fafc" strokeWidth="2" />
            <line x1="45" y1="20" x2="60" y2="20" stroke="#f8fafc" strokeWidth="2" />
            {/* Diode triangle */}
            <polygon points="25,10 45,20 25,30" fill="none" stroke="#f8fafc" strokeWidth="2" />
            {/* Cathode bar (with zener bent flags if zener) */}
            {isZener ? (
              <polyline points="42,10 45,10 45,30 48,30" fill="none" stroke="#f8fafc" strokeWidth="2" />
            ) : (
              <line x1="45" y1="10" x2="45" y2="30" stroke="#f8fafc" strokeWidth="2.5" />
            )}
          </g>
        );
      }

      // Fuse
      case 'fuse': {
        return (
          <g>
            <line x1="10" y1="15" x2="20" y2="15" stroke="#f8fafc" strokeWidth="2" />
            <line x1="50" y1="15" x2="60" y2="15" stroke="#f8fafc" strokeWidth="2" />
            <rect x="20" y="8" width="30" height="14" fill="none" stroke="#f8fafc" strokeWidth="2" />
            <line x1="10" y1="15" x2="60" y2="15" stroke="#f8fafc" strokeWidth="1.5" />
          </g>
        );
      }

      // NPN / PNP BJT Transistor
      case 'transistor_npn':
      case 'transistor_pnp': {
        const isNPN = component.type === 'transistor_npn';
        return (
          <g>
            {/* Base Lead */}
            <line x1="15" y1="35" x2="35" y2="35" stroke="#f8fafc" strokeWidth="2" />
            {/* Base Bar */}
            <line x1="35" y1="20" x2="35" y2="50" stroke="#f8fafc" strokeWidth="3" />
            {/* Collector */}
            <line x1="35" y1="25" x2="55" y2="12" stroke="#f8fafc" strokeWidth="2" />
            {/* Emitter */}
            <line x1="35" y1="45" x2="55" y2="58" stroke="#f8fafc" strokeWidth="2" />
            {/* Emitter arrow */}
            {isNPN ? (
              <polygon points="45,51 52,55 45,58" fill="#f8fafc" />
            ) : (
              <polygon points="45,45 38,41 45,37" fill="#f8fafc" />
            )}
            <circle cx="42" cy="35" r="22" fill="none" stroke="#475569" strokeWidth="1.5" />
          </g>
        );
      }

      // N-MOSFET
      case 'mosfet_n': {
        return (
          <g>
            <line x1="15" y1="35" x2="28" y2="35" stroke="#f8fafc" strokeWidth="2" />
            <line x1="28" y1="18" x2="28" y2="52" stroke="#f8fafc" strokeWidth="3" />
            {/* Channel segments */}
            <line x1="34" y1="14" x2="34" y2="24" stroke="#f8fafc" strokeWidth="3" />
            <line x1="34" y1="30" x2="34" y2="40" stroke="#f8fafc" strokeWidth="3" />
            <line x1="34" y1="46" x2="34" y2="56" stroke="#f8fafc" strokeWidth="3" />
            {/* Drain & Source leads */}
            <line x1="34" y1="18" x2="55" y2="12" stroke="#f8fafc" strokeWidth="2" />
            <line x1="34" y1="52" x2="55" y2="58" stroke="#f8fafc" strokeWidth="2" />
            <polygon points="34,35 44,30 44,40" fill="#f8fafc" />
            <line x1="44" y1="35" x2="44" y2="52" stroke="#f8fafc" strokeWidth="2" />
          </g>
        );
      }

      // Op-Amp
      case 'opamp': {
        return (
          <g>
            {/* Triangular body */}
            <polygon points="25,15 75,40 25,65" fill="none" stroke="#f8fafc" strokeWidth="2" />
            {/* Inverting (-) and Non-Inverting (+) */}
            <line x1="15" y1="25" x2="25" y2="25" stroke="#f8fafc" strokeWidth="2" />
            <text x="30" y="29" fill="#f8fafc" fontSize="12" fontWeight="bold">
              -
            </text>
            <line x1="15" y1="55" x2="25" y2="55" stroke="#f8fafc" strokeWidth="2" />
            <text x="30" y="58" fill="#f8fafc" fontSize="12" fontWeight="bold">
              +
            </text>
            {/* Output */}
            <line x1="75" y1="40" x2="85" y2="40" stroke="#f8fafc" strokeWidth="2" />
          </g>
        );
      }

      // Logic Gates
      case 'gate_and':
      case 'gate_nand': {
        const isNand = component.type === 'gate_nand';
        return (
          <g>
            <line x1="10" y1="20" x2="25" y2="20" stroke="#f8fafc" strokeWidth="2" />
            <line x1="10" y1="40" x2="25" y2="40" stroke="#f8fafc" strokeWidth="2" />
            <path d="M 25,12 L 45,12 A 18,18 0 0,1 45,48 L 25,48 Z" fill="none" stroke="#f8fafc" strokeWidth="2" />
            {isNand && <circle cx="67" cy="30" r="3.5" fill="none" stroke="#f8fafc" strokeWidth="2" />}
            <line x1={isNand ? '71' : '63'} y1="30" x2="75" y2="30" stroke="#f8fafc" strokeWidth="2" />
          </g>
        );
      }

      case 'gate_or':
      case 'gate_nor': {
        const isNor = component.type === 'gate_nor';
        return (
          <g>
            <line x1="10" y1="20" x2="28" y2="20" stroke="#f8fafc" strokeWidth="2" />
            <line x1="10" y1="40" x2="28" y2="40" stroke="#f8fafc" strokeWidth="2" />
            <path d="M 25,12 Q 40,30 25,48 Q 50,48 64,30 Q 50,12 25,12 Z" fill="none" stroke="#f8fafc" strokeWidth="2" />
            {isNor && <circle cx="68" cy="30" r="3.5" fill="none" stroke="#f8fafc" strokeWidth="2" />}
            <line x1={isNor ? '72' : '64'} y1="30" x2="75" y2="30" stroke="#f8fafc" strokeWidth="2" />
          </g>
        );
      }

      case 'gate_not': {
        return (
          <g>
            <line x1="10" y1="25" x2="28" y2="25" stroke="#f8fafc" strokeWidth="2" />
            <polygon points="28,12 52,25 28,38" fill="none" stroke="#f8fafc" strokeWidth="2" />
            <circle cx="56" cy="25" r="3.5" fill="none" stroke="#f8fafc" strokeWidth="2" />
            <line x1="60" y1="25" x2="70" y2="25" stroke="#f8fafc" strokeWidth="2" />
          </g>
        );
      }

      case 'gate_xor': {
        return (
          <g>
            <line x1="10" y1="20" x2="24" y2="20" stroke="#f8fafc" strokeWidth="2" />
            <line x1="10" y1="40" x2="24" y2="40" stroke="#f8fafc" strokeWidth="2" />
            <path d="M 18,12 Q 30,30 18,48" fill="none" stroke="#f8fafc" strokeWidth="2" />
            <path d="M 25,12 Q 38,30 25,48 Q 50,48 64,30 Q 50,12 25,12 Z" fill="none" stroke="#f8fafc" strokeWidth="2" />
            <line x1="64" y1="30" x2="75" y2="30" stroke="#f8fafc" strokeWidth="2" />
          </g>
        );
      }

      // LED
      case 'led': {
        const isLit = output.powered && !output.burnedOut;
        const color = component.properties.ledColor || '#ef4444';
        return (
          <g>
            <line x1="30" y1="10" x2="30" y2="30" stroke="#f8fafc" strokeWidth="2" />
            <line x1="30" y1="50" x2="30" y2="70" stroke="#f8fafc" strokeWidth="2" />

            {/* Glowing Aura when powered in schematic */}
            {isLit && (
              <circle
                cx="30"
                cy="42"
                r="24"
                fill={color}
                opacity="0.35"
                filter="blur(10px)"
              />
            )}

            <polygon
              points="14,30 46,30 30,50"
              fill={isLit ? color : 'none'}
              stroke={isLit ? color : '#f8fafc'}
              strokeWidth="2.5"
              filter={isLit ? `drop-shadow(0 0 6px ${color})` : 'none'}
            />
            <line x1="14" y1="50" x2="46" y2="50" stroke={isLit ? color : '#f8fafc'} strokeWidth="3" />
            {/* Light emission arrows */}
            <g stroke={isLit ? '#fef08a' : '#94a3b8'} strokeWidth={isLit ? '2' : '1.5'} filter={isLit ? 'drop-shadow(0 0 4px #facc15)' : 'none'}>
              <line x1="44" y1="36" x2="55" y2="27" />
              <polygon points="56,25 50,27 55,32" fill={isLit ? '#fef08a' : '#94a3b8'} />
              <line x1="44" y1="46" x2="55" y2="37" />
              <polygon points="56,35 50,37 55,42" fill={isLit ? '#fef08a' : '#94a3b8'} />
            </g>
          </g>
        );
      }

      case 'arduino_uno': {
        const leftPins = ['AREF', 'GND', 'IO', 'RST', '3V3', '5V', 'GND', 'GND', 'VIN'];
        const rightPins = ['D13', 'D12', 'D11', 'D10', 'D9', 'D8', 'D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'TX', 'RX'];
        return (
          <g>
            <rect x="10" y="10" width="140" height="120" rx="4" fill="#090d16" stroke="#38bdf8" strokeWidth="2" />
            <text x="80" y="45" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              ARDUINO UNO
            </text>
            <text x="80" y="58" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
              ATmega328P
            </text>
            {/* Left Header pin labels */}
            {leftPins.map((p, idx) => (
              <text
                key={`uno_l_${idx}`}
                x="16"
                y={20 + idx * 10}
                fill="#94a3b8"
                fontSize="6.5"
                fontFamily="ui-monospace, monospace"
                dominantBaseline="central"
              >
                {p}
              </text>
            ))}
            {/* Right Header pin labels */}
            {rightPins.map((p, idx) => (
              <text
                key={`uno_r_${idx}`}
                x="144"
                y={20 + idx * 10}
                fill="#94a3b8"
                fontSize="6.5"
                fontFamily="ui-monospace, monospace"
                textAnchor="end"
                dominantBaseline="central"
              >
                {p}
              </text>
            ))}
          </g>
        );
      }

      case 'tb6612fng': {
        const leftPins = ['VM', 'VCC', 'GND', 'A01', 'A02', 'B02', 'B01'];
        const rightPins = ['PWMA', 'AIN1', 'AIN2', 'STBY', 'BIN1', 'BIN2', 'PWMB'];
        return (
          <g>
            <rect x="15" y="15" width="90" height="100" rx="4" fill="#090d16" stroke="#38bdf8" strokeWidth="2" />
            <text x="60" y="45" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
              TB6612FNG
            </text>
            <text x="60" y="57" fill="#64748b" fontSize="7" textAnchor="middle">
              MOTOR DRIVER
            </text>
            {leftPins.map((p, idx) => (
              <text
                key={`tb_l_${idx}`}
                x="20"
                y={25 + idx * 15}
                fill="#94a3b8"
                fontSize="7"
                fontFamily="ui-monospace, monospace"
                dominantBaseline="central"
              >
                {p}
              </text>
            ))}
            {rightPins.map((p, idx) => (
              <text
                key={`tb_r_${idx}`}
                x="100"
                y={25 + idx * 15}
                fill="#94a3b8"
                fontSize="7"
                fontFamily="ui-monospace, monospace"
                textAnchor="end"
                dominantBaseline="central"
              >
                {p}
              </text>
            ))}
          </g>
        );
      }

      case 'esp32': {
        const leftPins = ['EN', 'VP', 'VN', '34', '35', '32', '33', '25', '26', '27', '14', '12', '13', 'GND', 'VIN'];
        const rightPins = ['23', '22', 'TX0', 'RX0', '21', '19', '18', 'D5', 'TX2', 'RX2', 'D4', 'D2', '15', 'GND', '3V3'];
        return (
          <g>
            <rect x="15" y="15" width="130" height="220" rx="4" fill="#090d16" stroke="#38bdf8" strokeWidth="2" />
            <text x="80" y="110" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
              ESP32
            </text>
            <text x="80" y="125" fill="#64748b" fontSize="8" textAnchor="middle">
              NODEMCU 30P
            </text>
            {leftPins.map((p, idx) => (
              <text
                key={`esp_l_${idx}`}
                x="22"
                y={25 + idx * 14}
                fill="#94a3b8"
                fontSize="7"
                fontFamily="ui-monospace, monospace"
                dominantBaseline="central"
              >
                {p}
              </text>
            ))}
            {rightPins.map((p, idx) => (
              <text
                key={`esp_r_${idx}`}
                x="138"
                y={25 + idx * 14}
                fill="#94a3b8"
                fontSize="7"
                fontFamily="ui-monospace, monospace"
                textAnchor="end"
                dominantBaseline="central"
              >
                {p}
              </text>
            ))}
          </g>
        );
      }

      case 'emg_sensor': {
        return (
          <g>
            <rect x="5" y="5" width="90" height="70" rx="4" fill="#090d16" stroke="#f43f5e" strokeWidth="2" />
            <polygon points="25,25 25,55 55,40" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="35" y="43" fill="#f43f5e" fontSize="8" fontWeight="bold">EMG</text>
            <text x="50" y="66" fill="#fda4af" fontSize="7" fontWeight="bold" textAnchor="middle">MyoWare</text>
          </g>
        );
      }

      case 'n20_motor': {
        return (
          <g>
            <circle cx="45" cy="35" r="22" fill="#090d16" stroke="#38bdf8" strokeWidth="2" />
            <text x="45" y="40" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">M</text>
            <text x="45" y="52" fill="#94a3b8" fontSize="6.5" textAnchor="middle">N20</text>
          </g>
        );
      }

      case 'custom_ai': {
        const sw = component.properties.customWidth || 120;
        const sh = component.properties.customHeight || 80;
        return (
          <g>
            <rect x="10" y="10" width={sw - 10} height={sh - 10} rx="4" fill="#090d16" stroke="#38bdf8" strokeWidth="2" />
            <text x={sw / 2} y={sh / 2} fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
              {component.name.slice(0, 14)}
            </text>
          </g>
        );
      }

      case 'breadboard_half': {
        return (
          <g>
            <rect x="10" y="10" width="140" height="120" rx="4" fill="#090d16" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="10" y1="30" x2="150" y2="30" stroke="#ef4444" strokeWidth="1.5" />
            <line x1="10" y1="110" x2="150" y2="110" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="80" y="65" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
              BREADBOARD
            </text>
            <text x="80" y="80" fill="#94a3b8" fontSize="8" textAnchor="middle">
              400 TIE-POINTS
            </text>
          </g>
        );
      }

      case 'breadboard_mini': {
        return (
          <g>
            <rect x="10" y="10" width="100" height="100" rx="4" fill="#090d16" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="10" y1="25" x2="110" y2="25" stroke="#ef4444" strokeWidth="1.5" />
            <text x="60" y="55" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
              MINI BB
            </text>
            <text x="60" y="70" fill="#94a3b8" fontSize="7.5" textAnchor="middle">
              170 TIE-POINTS
            </text>
          </g>
        );
      }

      // Default box
      default:
        return (
          <g>
            <rect x="10" y="10" width="50" height="40" rx="4" fill="none" stroke="#f8fafc" strokeWidth="2" />
            <text x="35" y="34" fill="#38bdf8" fontSize="10" textAnchor="middle">
              {component.type.slice(0, 5).toUpperCase()}
            </text>
          </g>
        );
    }
  };

  return (
    <g className={isSelected ? 'filter drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : ''}>
      {renderSchematicSymbol()}
    </g>
  );
};
