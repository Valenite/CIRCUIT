import type { CircuitComponent, SimulationResult, Wire } from '../types/circuit';

export function solveCircuit(
  components: CircuitComponent[],
  wires: Wire[],
  isRunning: boolean,
  timeMs: number = Date.now()
): SimulationResult {
  const result: SimulationResult = {
    isRunning,
    timeMs,
    nodeVoltages: {},
    branchCurrents: {},
    componentOutputs: {},
  };

  if (!isRunning || components.length === 0) {
    for (const comp of components) {
      result.componentOutputs[comp.id] = {
        powered: false,
        current: 0,
        voltageDrop: 0,
        brightness: 0,
        rpm: 0,
        isBuzzing: false,
      };
      for (const pin of comp.pins) {
        result.nodeVoltages[`${comp.id}:${pin.id}`] = 0;
      }
    }
    return result;
  }

  // 1. Gather all pins
  const allPinKeys: string[] = [];
  for (const comp of components) {
    for (const pin of comp.pins) {
      allPinKeys.push(`${comp.id}:${pin.id}`);
    }
  }

  // Union-Find for Electrical Nets
  const parent: Record<string, string> = {};
  function find(x: string): string {
    if (!parent[x]) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a: string, b: string) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent[rootB] = rootA;
  }

  // Connect pins via wires
  for (const wire of wires) {
    const pinA = `${wire.fromComponentId}:${wire.fromPinId}`;
    const pinB = `${wire.toComponentId}:${wire.toPinId}`;
    if (allPinKeys.includes(pinA) && allPinKeys.includes(pinB)) {
      union(pinA, pinB);
    }
  }

  // Internal component connections (Breadboards, Push buttons, DIP switches, Relays)
  for (const comp of components) {
    if (comp.type === 'breadboard_mini') {
      // Connect all holes in each row on the left side, and each row on the right side
      for (let r = 1; r <= 9; r++) {
        const leftHoles = [0, 1, 2, 3].map((c) => (c === 1 && r <= 4 ? `bb_row${r}_a` : `mini_l_${r}_${c}`));
        for (let i = 1; i < leftHoles.length; i++) {
          union(`${comp.id}:${leftHoles[0]}`, `${comp.id}:${leftHoles[i]}`);
        }
        const rightHoles = [0, 1, 2, 3].map((c) => (c === 2 && r <= 4 ? `bb_row${r}_b` : `mini_r_${r}_${c}`));
        for (let i = 1; i < rightHoles.length; i++) {
          union(`${comp.id}:${rightHoles[0]}`, `${comp.id}:${rightHoles[i]}`);
        }
      }
      // Mini breadboard power rails
      union(`${comp.id}:bb_vcc`, `${comp.id}:mini_l_1_0`);
      union(`${comp.id}:bb_gnd`, `${comp.id}:mini_r_1_3`);
    } else if (comp.type === 'breadboard_half') {
      // Connect ALL holes along the top positive power rail
      const powerCount = 11;
      const topPosHoles = Array.from({ length: powerCount }, (_, i) =>
        i === 0 ? 'rail_pos_1' : i === powerCount - 1 ? 'rail_pos_top_r' : `rail_pos_top_${i}`
      );
      for (let i = 1; i < topPosHoles.length; i++) {
        union(`${comp.id}:${topPosHoles[0]}`, `${comp.id}:${topPosHoles[i]}`);
      }

      // Connect ALL holes along the top negative power rail
      const topNegHoles = Array.from({ length: powerCount }, (_, i) =>
        i === 0 ? 'rail_neg_1' : i === powerCount - 1 ? 'rail_neg_top_r' : `rail_neg_top_${i}`
      );
      for (let i = 1; i < topNegHoles.length; i++) {
        union(`${comp.id}:${topNegHoles[0]}`, `${comp.id}:${topNegHoles[i]}`);
      }

      // Connect ALL holes along the bottom negative power rail
      const botNegHoles = Array.from({ length: powerCount }, (_, i) =>
        i === 0 ? 'rail_neg_bot_l' : i === powerCount - 1 ? 'rail_neg_2' : `rail_neg_bot_${i}`
      );
      for (let i = 1; i < botNegHoles.length; i++) {
        union(`${comp.id}:${botNegHoles[0]}`, `${comp.id}:${botNegHoles[i]}`);
      }

      // Connect ALL holes along the bottom positive power rail
      const botPosHoles = Array.from({ length: powerCount }, (_, i) =>
        i === 0 ? 'rail_pos_bot_l' : i === powerCount - 1 ? 'rail_pos_2' : `rail_pos_bot_${i}`
      );
      for (let i = 1; i < botPosHoles.length; i++) {
        union(`${comp.id}:${botPosHoles[0]}`, `${comp.id}:${botPosHoles[i]}`);
      }

      // Connect top and bottom rails together for common breadboard rail distribution
      union(`${comp.id}:rail_pos_1`, `${comp.id}:rail_pos_2`);
      union(`${comp.id}:rail_neg_1`, `${comp.id}:rail_neg_2`);

      // Connect ALL 5 holes in each top bank column (rows a, b, c, d, e)
      const topLetters = ['a', 'b', 'c', 'd', 'e'];
      for (let col = 1; col <= 11; col++) {
        const colPins = topLetters.map((l, rIdx) => {
          if (rIdx === 2) {
            if (col === 2) return 'bb_r1';
            if (col === 4) return 'bb_r2';
            if (col === 6) return 'bb_r3';
            if (col === 8) return 'bb_r4';
            if (col === 10) return 'bb_r5';
          }
          return `c${col}_${l}`;
        });
        for (let i = 1; i < colPins.length; i++) {
          union(`${comp.id}:${colPins[0]}`, `${comp.id}:${colPins[i]}`);
        }
      }

      // Connect ALL 5 holes in each bottom bank column (rows f, g, h, i, j)
      const botLetters = ['f', 'g', 'h', 'i', 'j'];
      for (let col = 1; col <= 11; col++) {
        const colPins = botLetters.map((l, rIdx) => {
          if (rIdx === 2) {
            if (col === 2) return 'bb_r1_b';
            if (col === 4) return 'bb_r2_b';
            if (col === 6) return 'bb_r3_b';
            if (col === 8) return 'bb_r4_b';
            if (col === 10) return 'bb_r5_b';
          }
          return `c${col}_${l}`;
        });
        for (let i = 1; i < colPins.length; i++) {
          union(`${comp.id}:${colPins[0]}`, `${comp.id}:${colPins[i]}`);
        }
      }
    } else if (comp.type === 'push_button') {
      // Connect tactile switch pins only when the button is pressed (ON)
      // When pressed, all 4 pins connect together so any wiring orientation works
      if (comp.properties.state) {
        union(`${comp.id}:pin1a`, `${comp.id}:pin1b`);
        union(`${comp.id}:pin2a`, `${comp.id}:pin2b`);
        union(`${comp.id}:pin1a`, `${comp.id}:pin2a`);
      }
    } else if (comp.type === 'dip_switch') {
      const states = comp.properties.dipStates || [false, false, false, false];
      if (states[0]) union(`${comp.id}:sw1_a`, `${comp.id}:sw1_b`);
      if (states[1]) union(`${comp.id}:sw2_a`, `${comp.id}:sw2_b`);
      if (states[2]) union(`${comp.id}:sw3_a`, `${comp.id}:sw3_b`);
      if (states[3]) union(`${comp.id}:sw4_a`, `${comp.id}:sw4_b`);
    }
  }

  // 2. Map pins to distinct nets
  const nets = new Set<string>();
  for (const pinKey of allPinKeys) {
    nets.add(find(pinKey));
  }
  const netList = Array.from(nets);
  const netIndices: Record<string, number> = {};
  netList.forEach((net, idx) => {
    netIndices[net] = idx;
  });

  const numNets = netList.length;
  if (numNets === 0) return result;

  // 3. Ground reference net
  let groundNet = -1;
  for (const comp of components) {
    if (comp.type === 'ground') {
      groundNet = netIndices[find(`${comp.id}:gnd`)];
      break;
    }
  }

  if (groundNet === -1) {
    for (const comp of components) {
      if (
        comp.type === 'battery_9v' ||
        comp.type === 'battery_aa' ||
        comp.type === 'battery_coin' ||
        comp.type === 'battery_dc'
      ) {
        const negPin = `${comp.id}:negative`;
        if (allPinKeys.includes(negPin)) {
          groundNet = netIndices[find(negPin)];
          break;
        }
      }
    }
  }

  if (groundNet === -1) {
    groundNet = 0;
  }

  // 4. MNA formulation
  const vSources: { comp: CircuitComponent; vPosNet: number; vNegNet: number; voltage: number }[] = [];

  for (const comp of components) {
    if (
      comp.type === 'battery_9v' ||
      comp.type === 'battery_aa' ||
      comp.type === 'battery_coin' ||
      comp.type === 'battery_dc' ||
      comp.type === 'battery_18650'
    ) {
      const vPos = netIndices[find(`${comp.id}:positive`)];
      const vNeg = netIndices[find(`${comp.id}:negative`)];
      let voltage = comp.properties.voltage;
      if (voltage === undefined) {
        if (comp.type === 'battery_9v') voltage = 9;
        else if (comp.type === 'battery_aa') voltage = 1.5;
        else if (comp.type === 'battery_coin') voltage = 3;
        else if (comp.type === 'battery_18650') voltage = 3.7;
        else voltage = 5;
      }
      if (vPos !== undefined && vNeg !== undefined && vPos !== vNeg) {
        vSources.push({ comp, vPosNet: vPos, vNegNet: vNeg, voltage });
      }
    } else if (comp.type === 'ac_source') {
      const vLive = netIndices[find(`${comp.id}:live`)];
      const vNeutral = netIndices[find(`${comp.id}:neutral`)];
      const vPeak = comp.properties.voltage || 10;
      const freq = comp.properties.frequency || 50;
      const t = (timeMs % 1000000) / 1000;
      const voltage = vPeak * Math.sin(2 * Math.PI * freq * t);
      if (vLive !== undefined && vNeutral !== undefined && vLive !== vNeutral) {
        vSources.push({ comp, vPosNet: vLive, vNegNet: vNeutral, voltage });
      }
    }
  }

  const numVSources = vSources.length;
  const matrixSize = numNets + numVSources;
  const A: number[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(0));
  const Z: number[] = Array(matrixSize).fill(0);

  function addConductance(n1: number, n2: number, g: number) {
    if (n1 === undefined || n2 === undefined || n1 === n2) return;
    A[n1][n1] += g;
    A[n2][n2] += g;
    A[n1][n2] -= g;
    A[n2][n1] -= g;
  }

  // Stamp Conductances into Matrix
  for (const comp of components) {
    switch (comp.type) {
      case 'resistor': {
        const n1 = netIndices[find(`${comp.id}:pin1`)];
        const n2 = netIndices[find(`${comp.id}:pin2`)];
        const r = Math.max(0.1, comp.properties.resistance || 220);
        addConductance(n1, n2, 1 / r);
        break;
      }
      case 'potentiometer': {
        const n1 = netIndices[find(`${comp.id}:terminal1`)];
        const nWiper = netIndices[find(`${comp.id}:wiper`)];
        const n2 = netIndices[find(`${comp.id}:terminal2`)];
        const totalR = Math.max(10, comp.properties.resistance || 10000);
        const p = Math.min(0.99, Math.max(0.01, comp.properties.potValue ?? 0.5));
        const r1 = totalR * p;
        const r2 = totalR * (1 - p);
        addConductance(n1, nWiper, 1 / r1);
        addConductance(nWiper, n2, 1 / r2);
        break;
      }
      case 'photoresistor': {
        const n1 = netIndices[find(`${comp.id}:pin1`)];
        const n2 = netIndices[find(`${comp.id}:pin2`)];
        const light = Math.max(0, Math.min(100, comp.properties.lightLevel ?? 50));
        // Light 0% -> 500k, Light 100% -> 400 ohm
        const r = 400 + (500000 - 400) * Math.pow(1 - light / 100, 2);
        addConductance(n1, n2, 1 / r);
        break;
      }
      case 'thermistor': {
        const n1 = netIndices[find(`${comp.id}:pin1`)];
        const n2 = netIndices[find(`${comp.id}:pin2`)];
        const temp = comp.properties.temperature ?? 25;
        // NTC formula: R = 10000 * exp(-0.04 * (T - 25))
        const r = Math.max(50, 10000 * Math.exp(-0.04 * (temp - 25)));
        addConductance(n1, n2, 1 / r);
        break;
      }
      case 'capacitor': {
        const n1 = netIndices[find(`${comp.id}:anode`)];
        const n2 = netIndices[find(`${comp.id}:cathode`)];
        addConductance(n1, n2, 1 / 1e6); // 1M DC leakage
        break;
      }
      case 'inductor': {
        const n1 = netIndices[find(`${comp.id}:pin1`)];
        const n2 = netIndices[find(`${comp.id}:pin2`)];
        addConductance(n1, n2, 1 / 0.5); // 0.5 ohm DC coil resistance
        break;
      }
      case 'fuse': {
        const n1 = netIndices[find(`${comp.id}:pin1`)];
        const n2 = netIndices[find(`${comp.id}:pin2`)];
        const isBlown = Boolean(comp.properties.isBlown);
        addConductance(n1, n2, isBlown ? 1e-9 : 1 / 0.05);
        break;
      }
      case 'diode':
      case 'zener_diode': {
        const nA = netIndices[find(`${comp.id}:anode`)];
        const nK = netIndices[find(`${comp.id}:cathode`)];
        addConductance(nA, nK, 1 / 25);
        break;
      }
      case 'transistor_npn': {
        const nC = netIndices[find(`${comp.id}:collector`)];
        const nB = netIndices[find(`${comp.id}:base`)];
        const nE = netIndices[find(`${comp.id}:emitter`)];
        addConductance(nB, nE, 1 / 100);
        addConductance(nC, nE, 1 / 15);
        break;
      }
      case 'transistor_pnp': {
        const nE = netIndices[find(`${comp.id}:emitter`)];
        const nB = netIndices[find(`${comp.id}:base`)];
        const nC = netIndices[find(`${comp.id}:collector`)];
        addConductance(nE, nB, 1 / 100);
        addConductance(nE, nC, 1 / 15);
        break;
      }
      case 'mosfet_n': {
        const nG = netIndices[find(`${comp.id}:gate`)];
        const nD = netIndices[find(`${comp.id}:drain`)];
        const nS = netIndices[find(`${comp.id}:source`)];
        addConductance(nG, nS, 1 / 1e8);
        addConductance(nD, nS, 1 / 0.2);
        break;
      }
      case 'toggle_switch': {
        const nCom = netIndices[find(`${comp.id}:common`)];
        const n1 = netIndices[find(`${comp.id}:terminal1`)];
        const n2 = netIndices[find(`${comp.id}:terminal2`)];
        if (comp.properties.state) {
          addConductance(nCom, n2, 1 / 0.001);
          addConductance(nCom, n1, 1 / 1e8);
        } else {
          addConductance(nCom, n1, 1 / 0.001);
          addConductance(nCom, n2, 1 / 1e8);
        }
        break;
      }
      case 'relay': {
        const nCoilPos = netIndices[find(`${comp.id}:coil_pos`)];
        const nCoilNeg = netIndices[find(`${comp.id}:coil_neg`)];
        const nCom = netIndices[find(`${comp.id}:com`)];
        const nNO = netIndices[find(`${comp.id}:no`)];
        const nNC = netIndices[find(`${comp.id}:nc`)];
        addConductance(nCoilPos, nCoilNeg, 1 / 70); // 70 ohm relay coil

        const isEnergized = Boolean(comp.properties.state);
        if (isEnergized) {
          addConductance(nCom, nNO, 1 / 0.001);
          addConductance(nCom, nNC, 1 / 1e8);
        } else {
          addConductance(nCom, nNC, 1 / 0.001);
          addConductance(nCom, nNO, 1 / 1e8);
        }
        break;
      }
      case 'led': {
        const nA = netIndices[find(`${comp.id}:anode`)];
        const nK = netIndices[find(`${comp.id}:cathode`)];
        addConductance(nA, nK, 1 / 30);
        break;
      }
      case 'led_rgb': {
        const nGnd = netIndices[find(`${comp.id}:pin_gnd`)];
        const nR = netIndices[find(`${comp.id}:pin_r`)];
        const nG = netIndices[find(`${comp.id}:pin_g`)];
        const nB = netIndices[find(`${comp.id}:pin_b`)];
        addConductance(nR, nGnd, 1 / 35);
        addConductance(nG, nGnd, 1 / 35);
        addConductance(nB, nGnd, 1 / 35);
        break;
      }
      case 'seven_segment': {
        const nGnd = netIndices[find(`${comp.id}:com_gnd`)];
        ['seg_a', 'seg_b', 'seg_c', 'seg_d', 'seg_e', 'seg_f', 'seg_g'].forEach((seg) => {
          const nSeg = netIndices[find(`${comp.id}:${seg}`)];
          addConductance(nSeg, nGnd, 1 / 40);
        });
        break;
      }
      case 'buzzer': {
        const n1 = netIndices[find(`${comp.id}:positive`)];
        const n2 = netIndices[find(`${comp.id}:negative`)];
        addConductance(n1, n2, 1 / 100);
        break;
      }
      case 'dc_motor': {
        const n1 = netIndices[find(`${comp.id}:terminal1`)];
        const n2 = netIndices[find(`${comp.id}:terminal2`)];
        addConductance(n1, n2, 1 / 25);
        break;
      }
      case 'n20_motor': {
        const n1 = netIndices[find(`${comp.id}:m_pos`)];
        const n2 = netIndices[find(`${comp.id}:m_neg`)];
        addConductance(n1, n2, 1 / 30);
        break;
      }
      case 'vibration_motor':
      case 'solenoid': {
        const n1 = netIndices[find(`${comp.id}:pos`)];
        const n2 = netIndices[find(`${comp.id}:neg`)];
        addConductance(n1, n2, 1 / 35);
        break;
      }
      case 'servo_motor': {
        const nVcc = netIndices[find(`${comp.id}:vcc`)];
        const nGnd = netIndices[find(`${comp.id}:gnd`)];
        const nSig = netIndices[find(`${comp.id}:signal`)];
        addConductance(nVcc, nGnd, 1 / 50);
        addConductance(nSig, nGnd, 1 / 100000);
        break;
      }
      case 'light_bulb': {
        const n1 = netIndices[find(`${comp.id}:terminal1`)];
        const n2 = netIndices[find(`${comp.id}:terminal2`)];
        const r = comp.properties.resistance || 50;
        addConductance(n1, n2, 1 / r);
        break;
      }
      case 'multimeter': {
        const n1 = netIndices[find(`${comp.id}:probe_pos`)];
        const n2 = netIndices[find(`${comp.id}:probe_neg`)];
        addConductance(n1, n2, 1 / 1e7);
        break;
      }
      case 'oscilloscope': {
        const nGnd = netIndices[find(`${comp.id}:gnd`)];
        const nCh1 = netIndices[find(`${comp.id}:ch1`)];
        const nCh2 = netIndices[find(`${comp.id}:ch2`)];
        addConductance(nCh1, nGnd, 1 / 1e6);
        addConductance(nCh2, nGnd, 1 / 1e6);
        break;
      }
      default:
        break;
    }
  }

  // Stamp Voltage Sources
  vSources.forEach((vSrc, idx) => {
    const k = numNets + idx;
    const nPos = vSrc.vPosNet;
    const nNeg = vSrc.vNegNet;

    A[nPos][k] += 1;
    A[nNeg][k] -= 1;
    A[k][nPos] += 1;
    A[k][nNeg] -= 1;
    Z[k] = vSrc.voltage;
  });

  // Enforce ground reference
  for (let c = 0; c < matrixSize; c++) {
    A[groundNet][c] = 0;
  }
  A[groundNet][groundNet] = 1;
  Z[groundNet] = 0;

  // Small diagonal damper to avoid singular floating sub-networks
  for (let i = 0; i < numNets; i++) {
    if (i !== groundNet) {
      A[i][i] += 1e-9;
    }
  }

  // Gaussian elimination with partial pivoting
  const X = solveLinearSystem(A, Z);

  // 5. Solution -> pin voltages
  for (const pinKey of allPinKeys) {
    const net = netIndices[find(pinKey)];
    result.nodeVoltages[pinKey] = X && !isNaN(X[net]) ? Number(X[net].toFixed(3)) : 0;
  }

  // 6. Logic Gates and Digital Evaluation
  for (const comp of components) {
    if (comp.type.startsWith('gate_')) {
      const vA = result.nodeVoltages[`${comp.id}:in_a`] || 0;
      const vB = result.nodeVoltages[`${comp.id}:in_b`] || 0;
      const inA = vA >= 2.0;
      const inB = vB >= 2.0;
      let outVal = false;

      switch (comp.type) {
        case 'gate_and':
          outVal = inA && inB;
          break;
        case 'gate_or':
          outVal = inA || inB;
          break;
        case 'gate_not':
          outVal = !inA;
          break;
        case 'gate_nand':
          outVal = !(inA && inB);
          break;
        case 'gate_nor':
          outVal = !(inA || inB);
          break;
        case 'gate_xor':
          outVal = inA !== inB;
          break;
      }

      const outPin = `${comp.id}:out`;
      result.nodeVoltages[outPin] = outVal ? 5.0 : 0.0;
      result.componentOutputs[comp.id] = {
        powered: true,
        current: outVal ? 0.01 : 0,
        voltageDrop: outVal ? 5.0 : 0.0,
        logicOutput: outVal,
      };
    }
  }

  // 7. Component outputs and metrics
  for (const comp of components) {
    switch (comp.type) {
      case 'led': {
        const vA = result.nodeVoltages[`${comp.id}:anode`] || 0;
        const vK = result.nodeVoltages[`${comp.id}:cathode`] || 0;
        const vDiff = vA - vK;
        const current = Math.max(0, vDiff / 30);
        const maxCurrent = comp.properties.currentRating || 0.12; // 120mA limit before pop
        const burnedOut = current > maxCurrent;
        // LED is forward biased and conducts if current is above 0.5mA
        const powered = current > 0.0005 && !burnedOut;
        const brightness = powered ? Math.min(1.0, Math.max(0.3, current / 0.015)) : 0;

        result.componentOutputs[comp.id] = {
          powered,
          current,
          voltageDrop: vDiff > 0 ? Math.min(vDiff, 2.1) : 0,
          burnedOut,
          brightness,
        };
        break;
      }
      case 'led_rgb': {
        const vGnd = result.nodeVoltages[`${comp.id}:pin_gnd`] || 0;
        const vR = (result.nodeVoltages[`${comp.id}:pin_r`] || 0) - vGnd;
        const vG = (result.nodeVoltages[`${comp.id}:pin_g`] || 0) - vGnd;
        const vB = (result.nodeVoltages[`${comp.id}:pin_b`] || 0) - vGnd;

        const curR = Math.max(0, vR / 35);
        const curG = Math.max(0, vG / 35);
        const curB = Math.max(0, vB / 35);

        const rVal = Math.min(255, Math.round((curR / 0.015) * 255));
        const gVal = Math.min(255, Math.round((curG / 0.015) * 255));
        const bVal = Math.min(255, Math.round((curB / 0.015) * 255));

        const powered = curR > 0.0005 || curG > 0.0005 || curB > 0.0005;
        const rgbColor = `rgb(${rVal}, ${gVal}, ${bVal})`;

        result.componentOutputs[comp.id] = {
          powered,
          current: curR + curG + curB,
          voltageDrop: Math.max(vR, vG, vB),
          rgbColor,
          brightness: powered ? 0.95 : 0,
        };
        break;
      }
      case 'seven_segment': {
        const vGnd = result.nodeVoltages[`${comp.id}:com_gnd`] || 0;
        const segmentsLit: Record<string, boolean> = {};
        let powered = false;

        ['seg_a', 'seg_b', 'seg_c', 'seg_d', 'seg_e', 'seg_f', 'seg_g'].forEach((seg) => {
          const vSeg = (result.nodeVoltages[`${comp.id}:${seg}`] || 0) - vGnd;
          const isLit = vSeg >= 1.6;
          segmentsLit[seg] = isLit;
          if (isLit) powered = true;
        });

        result.componentOutputs[comp.id] = {
          powered,
          current: powered ? 0.015 : 0,
          voltageDrop: 2.0,
          segmentsLit,
        };
        break;
      }
      case 'buzzer': {
        const vPos = result.nodeVoltages[`${comp.id}:positive`] || 0;
        const vNeg = result.nodeVoltages[`${comp.id}:negative`] || 0;
        const vDrop = Math.max(0, vPos - vNeg);
        const current = vDrop / 100;
        const isBuzzing = vDrop >= 1.8;
        result.componentOutputs[comp.id] = {
          powered: isBuzzing,
          current,
          voltageDrop: vDrop,
          isBuzzing,
          toneFreq: 2400,
        };
        break;
      }
      case 'dc_motor': {
        const v1 = result.nodeVoltages[`${comp.id}:terminal1`] || 0;
        const v2 = result.nodeVoltages[`${comp.id}:terminal2`] || 0;
        const vDrop = Math.abs(v1 - v2);
        const current = vDrop / 25;
        const powered = vDrop >= 1.0;
        const rpm = powered ? Math.round(Math.min(3000, (vDrop / 9) * 2800)) : 0;
        result.componentOutputs[comp.id] = {
          powered,
          current,
          voltageDrop: vDrop,
          rpm,
        };
        break;
      }
      case 'n20_motor': {
        const v1 = result.nodeVoltages[`${comp.id}:m_pos`] || 0;
        const v2 = result.nodeVoltages[`${comp.id}:m_neg`] || 0;
        const vDrop = Math.abs(v1 - v2);
        const current = vDrop / 30;
        const powered = vDrop >= 0.8;
        const rpm = powered ? Math.round(Math.min(600, (vDrop / 6) * 300)) : 0;
        result.componentOutputs[comp.id] = {
          powered,
          current,
          voltageDrop: vDrop,
          rpm,
        };
        break;
      }
      case 'emg_sensor': {
        const vcc = result.nodeVoltages[`${comp.id}:vcc`] || 0;
        const gnd = result.nodeVoltages[`${comp.id}:gnd`] || 0;
        const powered = vcc - gnd >= 2.5;
        const flexPercent = comp.properties.stimulusValue ?? 40;
        const sigV = powered ? Number(((vcc - gnd) * (flexPercent / 100)).toFixed(2)) : 0;
        result.nodeVoltages[`${comp.id}:sig`] = sigV;
        result.componentOutputs[comp.id] = {
          powered,
          current: powered ? 0.008 : 0,
          voltageDrop: vcc - gnd,
          sensorReading: `${flexPercent}% Flex (${sigV}V)`,
        };
        break;
      }
      case 'servo_motor': {
        const vcc = result.nodeVoltages[`${comp.id}:vcc`] || 0;
        const gnd = result.nodeVoltages[`${comp.id}:gnd`] || 0;
        const powered = vcc - gnd >= 4.0;
        result.componentOutputs[comp.id] = {
          powered,
          current: powered ? 0.05 : 0,
          voltageDrop: vcc - gnd,
          servoAngle: comp.properties.servoAngle ?? 90,
        };
        break;
      }
      case 'relay': {
        const vCoilPos = result.nodeVoltages[`${comp.id}:coil_pos`] || 0;
        const vCoilNeg = result.nodeVoltages[`${comp.id}:coil_neg`] || 0;
        const coilDrop = Math.abs(vCoilPos - vCoilNeg);
        const relayEngaged = coilDrop >= 3.5;
        result.componentOutputs[comp.id] = {
          powered: relayEngaged,
          current: coilDrop / 70,
          voltageDrop: coilDrop,
          relayEngaged,
        };
        break;
      }
      case 'oscilloscope': {
        const vGnd = result.nodeVoltages[`${comp.id}:gnd`] || 0;
        const vCh1 = (result.nodeVoltages[`${comp.id}:ch1`] || 0) - vGnd;
        // Generate a 20-point live waveform
        const points: number[] = [];
        const t = (timeMs % 10000) / 1000;
        for (let i = 0; i < 24; i++) {
          const sample = vCh1 * Math.sin(i * 0.35 + t * 4);
          points.push(Number(sample.toFixed(2)));
        }
        result.componentOutputs[comp.id] = {
          powered: true,
          current: 0.001,
          voltageDrop: vCh1,
          oscilloscopeWaveform: points,
        };
        break;
      }
      case 'multimeter': {
        const vPos = result.nodeVoltages[`${comp.id}:probe_pos`] || 0;
        const vNeg = result.nodeVoltages[`${comp.id}:probe_neg`] || 0;
        const vDrop = vPos - vNeg;
        result.componentOutputs[comp.id] = {
          powered: true,
          current: 0,
          voltageDrop: vDrop,
        };
        result.multimeterReading = {
          voltage: vDrop,
          current: 0,
        };
        break;
      }
      default: {
        if (!result.componentOutputs[comp.id]) {
          result.componentOutputs[comp.id] = {
            powered: false,
            current: 0,
            voltageDrop: 0,
          };
        }
      }
    }
  }

  // 8. Wire current animations
  for (const wire of wires) {
    const vA = result.nodeVoltages[`${wire.fromComponentId}:${wire.fromPinId}`] || 0;
    const vB = result.nodeVoltages[`${wire.toComponentId}:${wire.toPinId}`] || 0;
    result.branchCurrents[wire.id] = vA - vB;
  }

  return result;
}

function solveLinearSystem(A: number[][], B: number[]): number[] {
  const n = B.length;
  const a = A.map((row) => [...row]);
  const b = [...B];

  for (let p = 0; p < n; p++) {
    let maxRow = p;
    for (let i = p + 1; i < n; i++) {
      if (Math.abs(a[i][p]) > Math.abs(a[maxRow][p])) {
        maxRow = i;
      }
    }

    const tempRow = a[p];
    a[p] = a[maxRow];
    a[maxRow] = tempRow;

    const tempB = b[p];
    b[p] = b[maxRow];
    b[maxRow] = tempB;

    if (Math.abs(a[p][p]) <= 1e-12) continue;

    for (let i = p + 1; i < n; i++) {
      const alpha = a[i][p] / a[p][p];
      b[i] -= alpha * b[p];
      for (let j = p; j < n; j++) {
        a[i][j] -= alpha * a[p][j];
      }
    }
  }

  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += a[i][j] * x[j];
    }
    if (Math.abs(a[i][i]) > 1e-12) {
      x[i] = (b[i] - sum) / a[i][i];
    } else {
      x[i] = 0;
    }
  }

  return x;
}
