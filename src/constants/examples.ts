import type { CircuitComponent, Wire } from '../types/circuit';
import { COMPONENT_TEMPLATES } from './components';

export function getStarterExample(key: string): {
  components: CircuitComponent[];
  wires: Wire[];
} {
  switch (key) {
    case 'led_simple': {
      const bat: CircuitComponent = {
        id: 'bat_1',
        type: 'battery_9v',
        name: '9V Battery',
        x: 100,
        y: 120,
        rotation: 0,
        properties: { voltage: 9 },
        pins: COMPONENT_TEMPLATES.battery_9v.pins,
      };

      const btn: CircuitComponent = {
        id: 'btn_1',
        type: 'push_button',
        name: 'Tactile Switch',
        x: 260,
        y: 80,
        rotation: 0,
        properties: { state: true },
        pins: COMPONENT_TEMPLATES.push_button.pins,
      };

      const res: CircuitComponent = {
        id: 'res_1',
        type: 'resistor',
        name: '220Ω Resistor',
        x: 390,
        y: 90,
        rotation: 0,
        properties: { resistance: 220 },
        pins: COMPONENT_TEMPLATES.resistor.pins,
      };

      const led: CircuitComponent = {
        id: 'led_1',
        type: 'led',
        name: 'Red LED',
        x: 540,
        y: 150,
        rotation: 0,
        properties: { ledColor: '#ef4444', currentRating: 0.035 },
        pins: COMPONENT_TEMPLATES.led.pins,
      };

      const wires: Wire[] = [
        {
          id: 'w1',
          fromComponentId: 'bat_1',
          fromPinId: 'positive',
          toComponentId: 'btn_1',
          toPinId: 'pin1a',
          color: '#ef4444',
        },
        {
          id: 'w2',
          fromComponentId: 'btn_1',
          fromPinId: 'pin2a',
          toComponentId: 'res_1',
          toPinId: 'pin1',
          color: '#ef4444',
        },
        {
          id: 'w3',
          fromComponentId: 'res_1',
          fromPinId: 'pin2',
          toComponentId: 'led_1',
          toPinId: 'anode',
          color: '#ef4444',
        },
        {
          id: 'w4',
          fromComponentId: 'led_1',
          fromPinId: 'cathode',
          toComponentId: 'bat_1',
          toPinId: 'negative',
          color: '#1e293b',
        },
      ];

      return { components: [bat, btn, res, led], wires };
    }

    case 'pot_dimmer': {
      const bat: CircuitComponent = {
        id: 'bat_1',
        type: 'battery_9v',
        name: '9V Battery',
        x: 80,
        y: 120,
        rotation: 0,
        properties: { voltage: 9 },
        pins: COMPONENT_TEMPLATES.battery_9v.pins,
      };

      const pot: CircuitComponent = {
        id: 'pot_1',
        type: 'potentiometer',
        name: '10kΩ Potentiometer',
        x: 240,
        y: 100,
        rotation: 0,
        properties: { resistance: 10000, potValue: 0.6 },
        pins: COMPONENT_TEMPLATES.potentiometer.pins,
      };

      const res: CircuitComponent = {
        id: 'res_1',
        type: 'resistor',
        name: '100Ω Protection Resistor',
        x: 400,
        y: 160,
        rotation: 0,
        properties: { resistance: 100 },
        pins: COMPONENT_TEMPLATES.resistor.pins,
      };

      const led: CircuitComponent = {
        id: 'led_1',
        type: 'led',
        name: 'Blue LED',
        x: 540,
        y: 150,
        rotation: 0,
        properties: { ledColor: '#3b82f6', currentRating: 0.035 },
        pins: COMPONENT_TEMPLATES.led.pins,
      };

      const wires: Wire[] = [
        {
          id: 'w1',
          fromComponentId: 'bat_1',
          fromPinId: 'positive',
          toComponentId: 'pot_1',
          toPinId: 'terminal1',
          color: '#ef4444',
        },
        {
          id: 'w2',
          fromComponentId: 'pot_1',
          fromPinId: 'wiper',
          toComponentId: 'res_1',
          toPinId: 'pin1',
          color: '#3b82f6',
        },
        {
          id: 'w3',
          fromComponentId: 'res_1',
          fromPinId: 'pin2',
          toComponentId: 'led_1',
          toPinId: 'anode',
          color: '#3b82f6',
        },
        {
          id: 'w4',
          fromComponentId: 'led_1',
          fromPinId: 'cathode',
          toComponentId: 'bat_1',
          toPinId: 'negative',
          color: '#1e293b',
        },
      ];

      return { components: [bat, pot, res, led], wires };
    }

    case 'transistor_switch': {
      const bat: CircuitComponent = {
        id: 'bat_1',
        type: 'battery_9v',
        name: '9V Battery',
        x: 80,
        y: 140,
        rotation: 0,
        properties: { voltage: 9 },
        pins: COMPONENT_TEMPLATES.battery_9v.pins,
      };

      const btn: CircuitComponent = {
        id: 'btn_1',
        type: 'push_button',
        name: 'Control Button',
        x: 230,
        y: 60,
        rotation: 0,
        properties: { state: true },
        pins: COMPONENT_TEMPLATES.push_button.pins,
      };

      const rBase: CircuitComponent = {
        id: 'r_base',
        type: 'resistor',
        name: '1kΩ Base Resistor',
        x: 350,
        y: 70,
        rotation: 0,
        properties: { resistance: 1000 },
        pins: COMPONENT_TEMPLATES.resistor.pins,
      };

      const bjt: CircuitComponent = {
        id: 'q_1',
        type: 'transistor_npn',
        name: 'NPN Transistor (2N2222)',
        x: 500,
        y: 120,
        rotation: 0,
        properties: { gain: 100 },
        pins: COMPONENT_TEMPLATES.transistor_npn.pins,
      };

      const rLoad: CircuitComponent = {
        id: 'r_load',
        type: 'resistor',
        name: '330Ω Load Resistor',
        x: 350,
        y: 200,
        rotation: 0,
        properties: { resistance: 330 },
        pins: COMPONENT_TEMPLATES.resistor.pins,
      };

      const led: CircuitComponent = {
        id: 'led_1',
        type: 'led',
        name: 'Green LED',
        x: 500,
        y: 220,
        rotation: 0,
        properties: { ledColor: '#22c55e', currentRating: 0.035 },
        pins: COMPONENT_TEMPLATES.led.pins,
      };

      const wires: Wire[] = [
        { id: 'w1', fromComponentId: 'bat_1', fromPinId: 'positive', toComponentId: 'btn_1', toPinId: 'pin1a', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'bat_1', fromPinId: 'positive', toComponentId: 'r_load', toPinId: 'pin1', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'btn_1', fromPinId: 'pin2a', toComponentId: 'r_base', toPinId: 'pin1', color: '#eab308' },
        { id: 'w4', fromComponentId: 'r_base', fromPinId: 'pin2', toComponentId: 'q_1', toPinId: 'base', color: '#eab308' },
        { id: 'w5', fromComponentId: 'r_load', fromPinId: 'pin2', toComponentId: 'led_1', toPinId: 'anode', color: '#22c55e' },
        { id: 'w6', fromComponentId: 'led_1', fromPinId: 'cathode', toComponentId: 'q_1', toPinId: 'collector', color: '#22c55e' },
        { id: 'w7', fromComponentId: 'q_1', fromPinId: 'emitter', toComponentId: 'bat_1', toPinId: 'negative', color: '#1e293b' },
      ];

      return { components: [bat, btn, rBase, bjt, rLoad, led], wires };
    }

    case 'logic_and_demo': {
      const pwr: CircuitComponent = {
        id: 'pwr_1',
        type: 'battery_dc',
        name: '5V Logic Supply',
        x: 80,
        y: 120,
        rotation: 0,
        properties: { voltage: 5 },
        pins: COMPONENT_TEMPLATES.battery_dc.pins,
      };

      const swA: CircuitComponent = {
        id: 'sw_a',
        type: 'toggle_switch',
        name: 'Input A',
        x: 240,
        y: 70,
        rotation: 0,
        properties: { state: true },
        pins: COMPONENT_TEMPLATES.toggle_switch.pins,
      };

      const swB: CircuitComponent = {
        id: 'sw_b',
        type: 'toggle_switch',
        name: 'Input B',
        x: 240,
        y: 170,
        rotation: 0,
        properties: { state: true },
        pins: COMPONENT_TEMPLATES.toggle_switch.pins,
      };

      const gate: CircuitComponent = {
        id: 'and_1',
        type: 'gate_and',
        name: '74HC08 AND Gate',
        x: 390,
        y: 110,
        rotation: 0,
        properties: {},
        pins: COMPONENT_TEMPLATES.gate_and.pins,
      };

      const res: CircuitComponent = {
        id: 'r_1',
        type: 'resistor',
        name: '220Ω Resistor',
        x: 520,
        y: 110,
        rotation: 0,
        properties: { resistance: 220 },
        pins: COMPONENT_TEMPLATES.resistor.pins,
      };

      const led: CircuitComponent = {
        id: 'led_1',
        type: 'led',
        name: 'Yellow LED',
        x: 660,
        y: 110,
        rotation: 0,
        properties: { ledColor: '#eab308', currentRating: 0.035 },
        pins: COMPONENT_TEMPLATES.led.pins,
      };

      const wires: Wire[] = [
        { id: 'w1', fromComponentId: 'pwr_1', fromPinId: 'positive', toComponentId: 'sw_a', toPinId: 'common', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'pwr_1', fromPinId: 'positive', toComponentId: 'sw_b', toPinId: 'common', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'sw_a', fromPinId: 'terminal2', toComponentId: 'and_1', toPinId: 'in_a', color: '#3b82f6' },
        { id: 'w4', fromComponentId: 'sw_b', fromPinId: 'terminal2', toComponentId: 'and_1', toPinId: 'in_b', color: '#3b82f6' },
        { id: 'w5', fromComponentId: 'and_1', fromPinId: 'out', toComponentId: 'r_1', toPinId: 'pin1', color: '#eab308' },
        { id: 'w6', fromComponentId: 'r_1', fromPinId: 'pin2', toComponentId: 'led_1', toPinId: 'anode', color: '#eab308' },
        { id: 'w7', fromComponentId: 'led_1', fromPinId: 'cathode', toComponentId: 'pwr_1', toPinId: 'negative', color: '#1e293b' },
      ];

      return { components: [pwr, swA, swB, gate, res, led], wires };
    }

    case 'buzzer_alarm': {
      const bat: CircuitComponent = {
        id: 'bat_1',
        type: 'battery_9v',
        name: '9V Battery',
        x: 100,
        y: 120,
        rotation: 0,
        properties: { voltage: 9 },
        pins: COMPONENT_TEMPLATES.battery_9v.pins,
      };

      const sw: CircuitComponent = {
        id: 'sw_1',
        type: 'toggle_switch',
        name: 'Slide Switch',
        x: 270,
        y: 140,
        rotation: 0,
        properties: { state: true },
        pins: COMPONENT_TEMPLATES.toggle_switch.pins,
      };

      const buzz: CircuitComponent = {
        id: 'buzz_1',
        type: 'buzzer',
        name: 'Piezo Alarm',
        x: 440,
        y: 130,
        rotation: 0,
        properties: {},
        pins: COMPONENT_TEMPLATES.buzzer.pins,
      };

      const wires: Wire[] = [
        { id: 'w1', fromComponentId: 'bat_1', fromPinId: 'positive', toComponentId: 'sw_1', toPinId: 'common', color: '#ef4444' },
        { id: 'w2', fromComponentId: 'sw_1', fromPinId: 'terminal2', toComponentId: 'buzz_1', toPinId: 'positive', color: '#ef4444' },
        { id: 'w3', fromComponentId: 'buzz_1', fromPinId: 'negative', toComponentId: 'bat_1', toPinId: 'negative', color: '#1e293b' },
      ];

      return { components: [bat, sw, buzz], wires };
    }

    default:
      return { components: [], wires: [] };
  }
}
