import { useState, useMemo, useEffect, useRef } from 'react';
import type {
  CircuitComponent,
  Wire,
  ViewMode,
  ComponentType,
  Waypoint,
  WireRoutingType,
} from './types/circuit';
import { getAutoWireColor } from './utils/wireColors';
import { synthesizeAiComponent } from './engine/aiComponentEngine';
import { COMPONENT_TEMPLATES } from './constants/components';
import { getStarterExample } from './constants/examples';
import { solveCircuit } from './engine/circuitSolver';
import { mcuRuntime } from './engine/mcuRuntime';
import { autoWireCircuit } from './engine/autoWiring';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { BomModal } from './components/BomModal';
import { AiComponentModal } from './components/AiComponentModal';
import { CodeEditorModal } from './components/CodeEditorModal';
import { SensorStimulusPanel } from './components/SensorStimulusPanel';
import { PropertyPanel } from './components/PropertyPanel';

export function App() {
  const initial = useMemo(() => getStarterExample('led_simple'), []);
  const [components, setComponents] = useState<CircuitComponent[]>(initial.components);
  const [wires, setWires] = useState<Wire[]>(initial.wires);

  const [simRunning, setSimRunning] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('realistic');

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>('res_1');
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);

  // PropertyPanel state: tracks which component is open
  const [propPanelId, setPropPanelId] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Lifted from Canvas — controlled by Navbar
  const [defaultRoutingMode, setDefaultRoutingMode] = useState<WireRoutingType>('orthogonal');
  const [gridSnap, setGridSnap] = useState<boolean>(true);

  // Modals
  const [isBomOpen, setIsBomOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time ticker for dynamic AC sources & MCU cycles
  const [clockMs, setClockMs] = useState<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      if (simRunning && now - last > 50) {
        last = now;
        setClockMs(Date.now());
      }
      animationFrameRef.current = requestAnimationFrame(tick);
    };
    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [simRunning]);

  // Microcontroller runtime simulation step
  const mcuComponent = useMemo(
    () => components.find((c) => c.type === 'arduino_uno' || c.type === 'esp32') || null,
    [components]
  );

  // Solve circuit simulation
  const simResult = useMemo(() => {
    const res = solveCircuit(components, wires, simRunning, clockMs);
    // If MCU has code, execute pin overrides
    if (mcuComponent && mcuComponent.properties.code && simRunning) {
      const mcuState = mcuRuntime.executeCodeStep(
        mcuComponent.id,
        mcuComponent.properties.code,
        clockMs
      );
      Object.assign(res.nodeVoltages, mcuState.pinVoltages);
      if (!res.componentOutputs[mcuComponent.id]) {
        res.componentOutputs[mcuComponent.id] = {
          powered: true,
          current: 0.02,
          voltageDrop: 5.0,
        };
      }
      res.componentOutputs[mcuComponent.id].mcuPinStates = {
        d13: (mcuState.pinVoltages[`${mcuComponent.id}:d13`] || 0) >= 3.0,
      };
    }
    return res;
  }, [components, wires, simRunning, clockMs, mcuComponent]);

  // Add Component
  const handleAddComponent = (type: ComponentType) => {
    const tmpl = COMPONENT_TEMPLATES[type];
    const newId = `${type}_${Date.now().toString(36)}`;
    const newComp: CircuitComponent = {
      id: newId,
      type,
      name: `${tmpl?.title || type} ${components.filter((c) => c.type === type).length + 1}`,
      x: 350 + (Math.random() * 80 - 40),
      y: 200 + (Math.random() * 80 - 40),
      rotation: 0,
      properties: { ...(tmpl?.defaultProperties || {}) },
      pins: tmpl?.pins || [],
    };
    setComponents((prev) => [...prev, newComp]);
    setSelectedComponentId(newId);
    setSelectedWireId(null);
  };

  // Add Wire (auto-colored based on pin roles)
  const handleAddWire = (wireData: Omit<Wire, 'id'>) => {
    const exists = wires.some(
      (w) =>
        (w.fromComponentId === wireData.fromComponentId &&
          w.fromPinId === wireData.fromPinId &&
          w.toComponentId === wireData.toComponentId &&
          w.toPinId === wireData.toPinId) ||
        (w.fromComponentId === wireData.toComponentId &&
          w.fromPinId === wireData.toPinId &&
          w.toComponentId === wireData.fromComponentId &&
          w.toPinId === wireData.fromPinId)
    );
    if (exists) return;

    const fromComp = components.find((c) => c.id === wireData.fromComponentId);
    const toComp   = components.find((c) => c.id === wireData.toComponentId);
    const fromPin  = fromComp?.pins.find((p) => p.id === wireData.fromPinId);
    const toPin    = toComp?.pins.find((p) => p.id === wireData.toPinId);
    const autoColor = getAutoWireColor(fromComp, fromPin, toComp, toPin, wires);

    const newWire: Wire = {
      ...wireData,
      id: `w_${Date.now().toString(36)}`,
      color: autoColor,
    };
    setWires((prev) => [...prev, newWire]);
    setSelectedWireId(newWire.id);
    setSelectedComponentId(null);
  };

  // AI Auto-Wiring
  const handleAutoWire = () => {
    const res = autoWireCircuit(components, wires);
    setWires(res.wires);
    setToastMessage(res.summary);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Add Custom AI Component from Modal
  const handleCustomComponentCreated = (comp: CircuitComponent) => {
    setComponents((prev) => [...prev, comp]);
    setSelectedComponentId(comp.id);
    setSelectedWireId(null);
    setToastMessage(`Added AI Synthesized Component: ${comp.name}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Update position
  const handleUpdateComponentPosition = (id: string, x: number, y: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, x, y } : c))
    );
  };

  // Update properties
  const handleUpdateComponentProperties = (id: string, props: Record<string, any>) => {
    setComponents((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, properties: { ...c.properties, ...props } } : c
      )
    );
  };

  // Rotate component
  const handleRotateComponent = (id: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, rotation: (c.rotation + 90) % 360 } : c))
    );
  };

  // Update wire waypoints (draggable corners)
  const handleUpdateWireWaypoints = (wireId: string, waypoints: Waypoint[]) => {
    setWires((prev) =>
      prev.map((w) => (w.id === wireId ? { ...w, waypoints } : w))
    );
  };

  // Toggle wire routing geometry (orthogonal 90° vs curved)
  const handleToggleWireRoutingType = (wireId: string) => {
    setWires((prev) =>
      prev.map((w) => {
        if (w.id !== wireId) return w;
        const current = w.routingType || 'orthogonal';
        const next: WireRoutingType = current === 'orthogonal' ? 'curved' : 'orthogonal';
        return { ...w, routingType: next };
      })
    );
  };

  // Clean and straighten all wires
  const handleCleanAllWires = () => {
    setWires((prev) =>
      prev.map((w) => ({
        ...w,
        routingType: 'orthogonal',
        waypoints: [],
      }))
    );
    setToastMessage('Straightened all wires to clean 90° Manhattan grid lines');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Delete selected
  const handleDeleteSelected = () => {
    if (selectedComponentId) {
      setComponents((prev) => prev.filter((c) => c.id !== selectedComponentId));
      setWires((prev) =>
        prev.filter(
          (w) =>
            w.fromComponentId !== selectedComponentId &&
            w.toComponentId !== selectedComponentId
        )
      );
      setSelectedComponentId(null);
      if (propPanelId === selectedComponentId) setPropPanelId(null);
    } else if (selectedWireId) {
      setWires((prev) => prev.filter((w) => w.id !== selectedWireId));
      setSelectedWireId(null);
    }
  };

  // Clear circuit
  const handleClearCircuit = () => {
    if (window.confirm('Clear current circuit design?')) {
      setComponents([]);
      setWires([]);
      setSelectedComponentId(null);
      setSelectedWireId(null);
      setPropPanelId(null);
    }
  };

  // Load starter example
  const handleLoadExample = (key: string) => {
    const ex = getStarterExample(key);
    setComponents(ex.components);
    setWires(ex.wires);
    setSelectedComponentId(null);
    setSelectedWireId(null);
    setPropPanelId(null);
    setSimRunning(true);
  };

  // Export JSON
  const handleExportJson = () => {
    const project = {
      name: 'CircuitCraft Project',
      version: '2.0',
      timestamp: new Date().toISOString(),
      components,
      wires,
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuitcraft-design.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJson = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.components) && Array.isArray(data.wires)) {
        setComponents(data.components);
        setWires(data.wires);
        setSelectedComponentId(null);
        setSelectedWireId(null);
      } else {
        alert('Invalid circuit file structure.');
      }
    } catch (e) {
      alert('Failed to parse circuit file.');
    }
  };

  // Track last mouse-down position on the main canvas area
  const handleMainMouseDown = () => {
    // Keep for event capture if needed
  };

  // Get the component currently shown in the property panel
  const propPanelComponent = propPanelId
    ? components.find((c) => c.id === propPanelId) ?? null
    : null;

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#070a12] text-slate-100">
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        isRunning={simRunning}
        onToggleSimulation={() => setSimRunning((prev) => !prev)}
        onClearCircuit={handleClearCircuit}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onOpenBom={() => setIsBomOpen(true)}
        onAutoWire={handleAutoWire}
        onOpenCodeEditor={() => setIsCodeEditorOpen(true)}
        hasMcu={Boolean(mcuComponent)}
        onCleanAllWires={handleCleanAllWires}
        defaultRoutingMode={defaultRoutingMode}
        onToggleDefaultRoutingMode={() =>
          setDefaultRoutingMode((m) => (m === 'orthogonal' ? 'curved' : 'orthogonal'))
        }
        gridSnap={gridSnap}
        onToggleGridSnap={() => setGridSnap((g) => !g)}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gradient-to-r from-cyan-500/90 to-blue-600/90 border border-cyan-400 text-white text-xs font-bold rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.4)] backdrop-blur animate-in fade-in duration-200">
          ⚡ {toastMessage}
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          onAddComponent={handleAddComponent}
          onLoadExample={handleLoadExample}
          onSynthesizeAi={(prompt) => {
            const comp = synthesizeAiComponent(prompt);
            handleCustomComponentCreated(comp);
          }}
        />

        <main ref={mainRef} className="w-full h-full relative" onMouseDown={handleMainMouseDown}>
          <Canvas
            components={components}
            wires={wires}
            simResult={simResult}
            viewMode={viewMode}
            selectedComponentId={selectedComponentId}
            selectedWireId={selectedWireId}
            onSelectComponent={(id) => {
              setSelectedComponentId(id);
              if (id) {
                setSelectedWireId(null);
                setPropPanelId(id);
              } else {
                setPropPanelId(null);
              }
            }}
            onSelectWire={(id) => {
              setSelectedWireId(id);
              if (id) {
                setSelectedComponentId(null);
                setPropPanelId(null);
              }
            }}
            onUpdateComponentPosition={handleUpdateComponentPosition}
            onUpdateComponentProperties={handleUpdateComponentProperties}
            onRotateComponent={handleRotateComponent}
            onAddWire={handleAddWire}
            onUpdateWireWaypoints={handleUpdateWireWaypoints}
            onToggleWireRoutingType={handleToggleWireRoutingType}
            onCleanAllWires={handleCleanAllWires}
            onDeleteSelected={handleDeleteSelected}
            defaultRoutingMode={defaultRoutingMode}
            gridSnap={gridSnap}
          />

          {/* Floating Property Inspector Panel (Anchored to Right Side) */}
          {propPanelComponent && (
            <PropertyPanel
              component={propPanelComponent}
              simResult={simResult}
              onUpdateProperties={handleUpdateComponentProperties}
              onClose={() => setPropPanelId(null)}
            />
          )}

          {/* Floating Sensor Interactive Test Bench (Only visible when simulation is running) */}
          <SensorStimulusPanel
            components={components}
            isRunning={simRunning}
            onUpdateComponentProperties={handleUpdateComponentProperties}
          />
        </main>
      </div>

      {/* Modals */}
      <BomModal
        isOpen={isBomOpen}
        onClose={() => setIsBomOpen(false)}
        components={components}
      />

      <AiComponentModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onComponentCreated={handleCustomComponentCreated}
      />

      <CodeEditorModal
        isOpen={isCodeEditorOpen}
        onClose={() => setIsCodeEditorOpen(false)}
        component={mcuComponent}
        onSaveCode={(id, code) => handleUpdateComponentProperties(id, { code })}
      />
    </div>
  );
}

export default App;
