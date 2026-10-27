import React, { useState, useRef, useEffect, useMemo } from 'react';
import type {
  CircuitComponent,
  Wire,
  SimulationResult,
  ViewMode,
  Pin,
  Waypoint,
  WireRoutingType,
} from '../types/circuit';
import { COMPONENT_TEMPLATES } from '../constants/components';
import { RealisticComponent } from './realistic/RealisticComponent';
import { SchematicComponent } from './schematic/SchematicComponent';
import { soundEngine } from '../engine/soundEngine';
import { getPinShortLabel } from '../utils/pinLabels';
import {
  generateWirePath,
  findBestWaypointInsertIndex,
  getClosestExistingWaypointIndex,
} from '../utils/wireRouting';
import {
  Tag,
} from 'lucide-react';

interface Props {
  components: CircuitComponent[];
  wires: Wire[];
  simResult: SimulationResult;
  viewMode: ViewMode;
  selectedComponentId: string | null;
  selectedWireId: string | null;
  onSelectComponent: (id: string | null) => void;
  onSelectWire: (id: string | null) => void;
  onUpdateComponentPosition: (id: string, x: number, y: number) => void;
  onUpdateComponentProperties: (id: string, props: Record<string, any>) => void;
  onRotateComponent: (id: string) => void;
  onAddWire: (wire: Omit<Wire, 'id'>) => void;
  onUpdateWireWaypoints: (wireId: string, waypoints: Waypoint[]) => void;
  onToggleWireRoutingType: (wireId: string) => void;
  onCleanAllWires: () => void;
  onDeleteSelected: () => void;
  defaultRoutingMode?: WireRoutingType;
  gridSnap?: boolean;
  /** Called when a component is clicked; passes screen-space center of the component */
  onComponentClickedScreen?: (id: string, screenX: number, screenY: number) => void;
}

export const Canvas: React.FC<Props> = ({
  components,
  wires,
  simResult,
  viewMode,
  selectedComponentId,
  selectedWireId,
  onSelectComponent,
  onSelectWire,
  onUpdateComponentPosition,
  onUpdateComponentProperties,
  onRotateComponent,
  onAddWire,
  onUpdateWireWaypoints,
  onCleanAllWires: _onCleanAllWires, // Handled by Navbar; kept for API compatibility
  onDeleteSelected,
  defaultRoutingMode = 'orthogonal',
  gridSnap = true,
}) => {
  const containerRef = useRef<SVGSVGElement | null>(null);

  // Pan and Zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 180, y: 120 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Canvas Mode & Preferences
  const [activeTool, setActiveTool] = useState<'select' | 'wire'>('select');
  const [showPinLabels, setShowPinLabels] = useState(false);

  // Dragging States
  const [draggedCompId, setDraggedCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number } | null>(null);

  // Waypoint Dragging State
  const [draggedWaypoint, setDraggedWaypoint] = useState<{
    wireId: string;
    index: number;
    liveWaypoints: Waypoint[];
    isNew?: boolean;
    startPos?: { x: number; y: number };
  } | null>(null);

  // Wiring State
  const [wiringStart, setWiringStart] = useState<{
    componentId: string;
    pinId: string;
    startX: number;
    startY: number;
  } | null>(null);
  const [wiringCurrent, setWiringCurrent] = useState<{ x: number; y: number } | null>(null);
  const [hoveredPin, setHoveredPin] = useState<{
    componentId: string;
    pin: Pin;
    compName: string;
    x: number;
    y: number;
  } | null>(null);

  // Hovered Wire for interactive handles
  const [hoveredWireId, setHoveredWireId] = useState<string | null>(null);

  // Sound Engine sync for Buzzer
  useEffect(() => {
    let hasBuzzing = false;
    for (const comp of components) {
      if (comp.type === 'buzzer') {
        const out = simResult.componentOutputs[comp.id];
        if (out && out.isBuzzing) {
          hasBuzzing = true;
          break;
        }
      }
    }
    if (hasBuzzing && simResult.isRunning) {
      soundEngine.playBuzzer(2400);
    } else {
      soundEngine.stopBuzzer();
    }
  }, [simResult, components]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        onDeleteSelected();
      } else if (e.key === 'r' || e.key === 'R') {
        if (selectedComponentId) {
          onRotateComponent(selectedComponentId);
        }
      } else if (e.key === 'v' || e.key === 'V') {
        setActiveTool('select');
      } else if (e.key === 'w' || e.key === 'W') {
        setActiveTool('wire');
      } else if (e.key === 'Escape') {
        setWiringStart(null);
        setWiringCurrent(null);
        onSelectComponent(null);
        onSelectWire(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDeleteSelected, onRotateComponent, selectedComponentId, onSelectComponent, onSelectWire]);

  // Convert screen coordinates to canvas coordinates
  const getCanvasCoords = (e: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    return {
      x: (screenX - pan.x) / zoom,
      y: (screenY - pan.y) / zoom,
    };
  };

  // Get absolute pin position
  const getPinPos = (component: CircuitComponent, pin: Pin) => {
    const template = COMPONENT_TEMPLATES[component.type];
    const relX = viewMode === 'realistic' ? pin.relX : pin.schematicRelX;
    const relY = viewMode === 'realistic' ? pin.relY : pin.schematicRelY;

    if (component.rotation === 0) {
      return { x: component.x + relX, y: component.y + relY };
    }

    const w = viewMode === 'realistic' ? (template?.width || 100) : (template?.schematicWidth || 80);
    const h = viewMode === 'realistic' ? (template?.height || 80) : (template?.schematicHeight || 60);
    const cx = component.x + w / 2;
    const cy = component.y + h / 2;
    const rad = (component.rotation * Math.PI) / 180;
    const px = component.x + relX - cx;
    const py = component.y + relY - cy;

    return {
      x: cx + px * Math.cos(rad) - py * Math.sin(rad),
      y: cy + px * Math.sin(rad) + py * Math.cos(rad),
    };
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(2.5, Math.max(0.4, zoom * zoomFactor));

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setPan({
      x: mouseX - (mouseX - pan.x) * (newZoom / zoom),
      y: mouseY - (mouseY - pan.y) * (newZoom / zoom),
    });
    setZoom(newZoom);
  };

  // Canvas Mouse Down - Right Click or Middle Click PANS from anywhere!
  const handleMouseDown = (e: React.MouseEvent) => {
    // If currently routing a wire and clicked on empty canvas, cancel the active wire
    if (wiringStart) {
      setWiringStart(null);
      setWiringCurrent(null);
      return;
    }

    // Right click (button === 2) or middle click (button === 1) starts panning from anywhere!
    if (e.button === 2 || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    // Left click on empty canvas
    if (e.button === 0 && (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).tagName === 'rect')) {
      onSelectComponent(null);
      onSelectWire(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  // Canvas Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    const coords = getCanvasCoords(e);
    const snap = gridSnap ? 10 : 1;

    // Moving component
    if (draggedCompId) {
      const rawX = coords.x - dragOffset.x;
      const rawY = coords.y - dragOffset.y;
      const snappedX = Math.round(rawX / snap) * snap;
      const snappedY = Math.round(rawY / snap) * snap;
      onUpdateComponentPosition(draggedCompId, snappedX, snappedY);
    }

    // Moving wire waypoint / corner with instant live visual response
    if (draggedWaypoint) {
      const snappedX = Math.round(coords.x / snap) * snap;
      const snappedY = Math.round(coords.y / snap) * snap;
      const updatedWaypoints = [...draggedWaypoint.liveWaypoints];
      if (updatedWaypoints[draggedWaypoint.index]) {
        updatedWaypoints[draggedWaypoint.index] = { x: snappedX, y: snappedY };

        let isStillNew = draggedWaypoint.isNew;
        if (isStillNew && draggedWaypoint.startPos) {
          const dist = Math.hypot(coords.x - draggedWaypoint.startPos.x, coords.y - draggedWaypoint.startPos.y);
          if (dist > 4) {
            isStillNew = false;
          }
        }

        setDraggedWaypoint({
          ...draggedWaypoint,
          liveWaypoints: updatedWaypoints,
          isNew: isStillNew,
        });

        onUpdateWireWaypoints(draggedWaypoint.wireId, updatedWaypoints);
      }
    }

    if (wiringStart) {
      setWiringCurrent(coords);
    }
  };

  // Canvas Mouse Up
  const handleMouseUp = (e: React.MouseEvent) => {
    // If user was dragging a wire from pin A and released over hoveredPin, complete connection immediately!
    if (wiringStart && hoveredPin) {
      if (wiringStart.componentId !== hoveredPin.componentId || wiringStart.pinId !== hoveredPin.pin.id) {
        onAddWire({
          fromComponentId: wiringStart.componentId,
          fromPinId: wiringStart.pinId,
          toComponentId: hoveredPin.componentId,
          toPinId: hoveredPin.pin.id,
          color: '#94a3b8',
          routingType: defaultRoutingMode,
        });
        soundEngine.playClick();
      }
      setWiringStart(null);
      setWiringCurrent(null);
      setIsPanning(false);
      setDraggedCompId(null);
      setMouseDownPos(null);
      return;
    }

    // If user was dragging a wire waypoint
    if (draggedWaypoint) {
      if (draggedWaypoint.isNew) {
        // Simple click without dragging (> 4px): remove candidate waypoint so no unwanted kink remains
        const cleaned = draggedWaypoint.liveWaypoints.filter((_, i) => i !== draggedWaypoint.index);
        onUpdateWireWaypoints(draggedWaypoint.wireId, cleaned);
      } else {
        // Final position committed
        onUpdateWireWaypoints(draggedWaypoint.wireId, draggedWaypoint.liveWaypoints);
      }
      setDraggedWaypoint(null);
    }

    // If user clicked a switch/button without dragging, toggle its state!
    if (draggedCompId && mouseDownPos) {
      const dist = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
      if (dist < 4) {
        const comp = components.find((c) => c.id === draggedCompId);
        if (comp && (comp.type === 'push_button' || comp.type === 'toggle_switch')) {
          handleInteractiveClick(comp);
        }
      }
    }

    setIsPanning(false);
    setDraggedCompId(null);
    setMouseDownPos(null);
  };

  // Pin click -> Start or Complete Wire IMMEDIATELY (no annoying popup menu!)
  const handlePinClick = (e: React.MouseEvent, comp: CircuitComponent, pin: Pin) => {
    e.stopPropagation();
    soundEngine.playClick();
    const pinPos = getPinPos(comp, pin);

    // If currently wiring, complete connection to this target pin
    if (wiringStart) {
      if (wiringStart.componentId !== comp.id || wiringStart.pinId !== pin.id) {
        onAddWire({
          fromComponentId: wiringStart.componentId,
          fromPinId: wiringStart.pinId,
          toComponentId: comp.id,
          toPinId: pin.id,
          color: '#94a3b8',
          routingType: defaultRoutingMode,
        });
      }
      setWiringStart(null);
      setWiringCurrent(null);
      return;
    }

    // Start wire from this pin immediately!
    setWiringStart({
      componentId: comp.id,
      pinId: pin.id,
      startX: pinPos.x,
      startY: pinPos.y,
    });
    setWiringCurrent(pinPos);
  };

  // Adding a corner waypoint to an existing wire on click
  const handleWireClick = (e: React.MouseEvent, wire: Wire) => {
    e.stopPropagation();
    onSelectWire(wire.id);
    onSelectComponent(null);

    // If Alt or Shift is held, or double click, add waypoint
    if (e.altKey || e.shiftKey) {
      const coords = getCanvasCoords(e);
      const snap = gridSnap ? 10 : 1;
      const newWp: Waypoint = {
        x: Math.round(coords.x / snap) * snap,
        y: Math.round(coords.y / snap) * snap,
      };
      const existing = wire.waypoints ? [...wire.waypoints] : [];
      existing.push(newWp);
      onUpdateWireWaypoints(wire.id, existing);
    }
  };

  // Adding a corner waypoint from segment midpoint
  const handleAddMidpointBend = (wire: Wire, defaultMidX: number, defaultMidY: number) => {
    const snap = gridSnap ? 10 : 1;
    const newWp: Waypoint = {
      x: Math.round(defaultMidX / snap) * snap,
      y: Math.round(defaultMidY / snap) * snap,
    };
    const existing = wire.waypoints ? [...wire.waypoints] : [];
    existing.push(newWp);
    onUpdateWireWaypoints(wire.id, existing);
    setDraggedWaypoint({
      wireId: wire.id,
      index: existing.length - 1,
      liveWaypoints: existing,
      isNew: false,
    });
  };

  // Double click waypoint to remove it
  const handleRemoveWaypoint = (e: React.MouseEvent, wireId: string, index: number) => {
    e.stopPropagation();
    const targetWire = wires.find((w) => w.id === wireId);
    if (!targetWire || !targetWire.waypoints) return;
    const updated = targetWire.waypoints.filter((_, i) => i !== index);
    onUpdateWireWaypoints(wireId, updated);
  };

  // Interactive component toggles
  const handleInteractiveClick = (comp: CircuitComponent) => {
    soundEngine.playClick();
    if (comp.type === 'push_button' || comp.type === 'toggle_switch') {
      const currentState = Boolean(comp.properties.state);
      onUpdateComponentProperties(comp.id, {
        state: !currentState,
      });
    }
  };

  // Track wire counts per pin for rendering multi-wire junction dots
  const pinWireCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const w of wires) {
      const keyA = `${w.fromComponentId}:${w.fromPinId}`;
      const keyB = `${w.toComponentId}:${w.toPinId}`;
      counts[keyA] = (counts[keyA] || 0) + 1;
      counts[keyB] = (counts[keyB] || 0) + 1;
    }
    return counts;
  }, [wires]);

  const isBreadboardType = (type: string) =>
    type === 'breadboard_half' || type === 'breadboard_mini';

  // Render a component with realistic body, name badge, and clean interactive pins
  const renderComponent = (comp: CircuitComponent) => {
    const template = COMPONENT_TEMPLATES[comp.type];
    const isSelected = selectedComponentId === comp.id;
    const w = viewMode === 'realistic' ? (template?.width || 100) : (template?.schematicWidth || 80);
    const h = viewMode === 'realistic' ? (template?.height || 80) : (template?.schematicHeight || 60);

    return (
      <g
        key={comp.id}
        transform={`translate(${comp.x}, ${comp.y}) rotate(${comp.rotation}, ${w / 2}, ${h / 2})`}
        onMouseDown={(e) => {
          e.stopPropagation();
          onSelectComponent(comp.id);
          onSelectWire(null);
          const coords = getCanvasCoords(e);
          setDraggedCompId(comp.id);
          setMouseDownPos({ x: e.clientX, y: e.clientY });
          setDragOffset({
            x: coords.x - comp.x,
            y: coords.y - comp.y,
          });
        }}
        className="cursor-move"
      >
        {/* Visual Body */}
        {viewMode === 'realistic' ? (
          <RealisticComponent
            component={comp}
            simResult={simResult}
            isSelected={isSelected}
            onInteractiveClick={() => handleInteractiveClick(comp)}
          />
        ) : (
          <SchematicComponent
            component={comp}
            simResult={simResult}
            isSelected={isSelected}
            onInteractiveClick={() => handleInteractiveClick(comp)}
          />
        )}

        {/* Component Name Badge with Dark Backdrop to Prevent Wire Clutter */}
        <g transform={`translate(${w / 2}, ${h + 18})`} className="pointer-events-none select-none">
          <rect
            x={-Math.max(40, (comp.name || template?.title || '').length * 3.8) - 6}
            y="-9"
            width={Math.max(80, (comp.name || template?.title || '').length * 7.6) + 12}
            height="18"
            rx="5"
            fill="#070a12"
            fillOpacity="0.88"
            stroke="#1e293b"
            strokeWidth="1"
          />
          <text
            x="0"
            y="1"
            fill="#94a3b8"
            fontSize="10.5"
            fontWeight="bold"
            fontFamily="sans-serif"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {comp.name || template?.title}
          </text>
        </g>

        {/* Pins and Terminal Snaps */}
        {comp.pins.map((pin) => {
          const px = viewMode === 'realistic' ? pin.relX : pin.schematicRelX;
          const py = viewMode === 'realistic' ? pin.relY : pin.schematicRelY;
          const isHovered =
            hoveredPin?.componentId === comp.id && hoveredPin?.pin.id === pin.id;
          const isWiringSource =
            wiringStart?.componentId === comp.id && wiringStart?.pinId === pin.id;

          const shortLabel = getPinShortLabel(pin);
          const hasBuiltinSilkscreen =
            viewMode === 'realistic' &&
            (comp.type === 'esp32' || comp.type === 'arduino_uno');

          let labelOffsetX = 0;
          let labelOffsetY = 0;
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';

          const distFromLeft = px;
          const distFromRight = w - px;
          const distFromTop = py;
          const distFromBottom = h - py;
          const minDist = Math.min(distFromLeft, distFromRight, distFromTop, distFromBottom);

          if (minDist === distFromTop) {
            labelOffsetX = 0;
            labelOffsetY = -14;
            textAnchor = 'middle';
          } else if (minDist === distFromBottom) {
            labelOffsetX = 0;
            labelOffsetY = 14;
            textAnchor = 'middle';
          } else if (minDist === distFromLeft) {
            labelOffsetX = -13;
            labelOffsetY = 0;
            textAnchor = 'end';
          } else {
            labelOffsetX = 13;
            labelOffsetY = 0;
            textAnchor = 'start';
          }

          const isBreadboard = isBreadboardType(comp.type);

          return (
            <g
              key={pin.id}
              transform={`translate(${px}, ${py})`}
              onMouseDown={(e) => {
                e.stopPropagation();
                handlePinClick(e, comp, pin);
              }}
              onMouseUp={(e) => {
                if (wiringStart && (wiringStart.componentId !== comp.id || wiringStart.pinId !== pin.id)) {
                  e.stopPropagation();
                  handlePinClick(e, comp, pin);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePinClick(e, comp, pin);
              }}
              onMouseEnter={() =>
                setHoveredPin({
                  componentId: comp.id,
                  pin,
                  compName: comp.name || template?.title || comp.type,
                  x: comp.x + px,
                  y: comp.y + py,
                })
              }
              onMouseLeave={() => setHoveredPin(null)}
              className="cursor-pointer"
            >
              {/* Invisible generous hit target for responsive clicking */}
              <circle cx="0" cy="0" r={isBreadboard ? 7 : 14} fill="transparent" />

              {/* Always-Present Realistic Pin Terminal Pad (For all components except breadboard sockets) */}
              {!isBreadboard && (
                <g style={{ pointerEvents: 'none' }}>
                  {/* Outer plated through-hole (PTH) eyelet with polarity coding */}
                  <circle
                    cx="0"
                    cy="0"
                    r="4.2"
                    fill={
                      pin.isPositive
                        ? '#ef4444'
                        : pin.isNegative
                        ? '#0f172a'
                        : '#ca8a04'
                    }
                    stroke={
                      pin.isPositive
                        ? '#fca5a5'
                        : pin.isNegative
                        ? '#475569'
                        : '#fde047'
                    }
                    strokeWidth="1.2"
                    opacity="0.95"
                  />
                  {/* Inner drill hole / pin socket */}
                  <circle cx="0" cy="0" r="1.8" fill="#070a12" />
                </g>
              )}

              {/* Snap Indicator Ring — Lights up with cyan glow when hovered or actively wiring */}
              {(isHovered || isWiringSource) && (
                <circle
                  cx="0"
                  cy="0"
                  r={isBreadboard ? 5.5 : 7.5}
                  fill={isWiringSource ? '#00f0ff' : '#38bdf8'}
                  fillOpacity="0.35"
                  stroke="#ffffff"
                  strokeWidth={isBreadboard ? 2 : 2.5}
                  filter="drop-shadow(0 0 6px #00f0ff)"
                  className="transition-all animate-pulse"
                />
              )}

              {/* Pin Labels (Toggleable) */}
              {showPinLabels && !hasBuiltinSilkscreen && !isBreadboard && (
                <g transform={`translate(${labelOffsetX}, ${labelOffsetY})`} className="pointer-events-none select-none">
                  <rect
                    x={textAnchor === 'middle' ? -9 : textAnchor === 'end' ? -18 : 0}
                    y="-6.5"
                    width="18"
                    height="13"
                    rx="3.5"
                    fill="#070a12"
                    fillOpacity="0.94"
                    stroke={pin.isPositive ? '#ef4444' : pin.isNegative ? '#64748b' : '#00f0ff'}
                    strokeWidth="1"
                  />
                  <text
                    x={textAnchor === 'middle' ? 0 : textAnchor === 'end' ? -9 : 9}
                    y="0.5"
                    fill={pin.isPositive ? '#ef4444' : pin.isNegative ? '#cbd5e1' : '#38bdf8'}
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="ui-monospace, monospace"
                  >
                    {shortLabel}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#070a12] select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* ================= BOTTOM VIEWPORT CONTROLS ================= */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2 bg-slate-900/95 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <button
          onClick={() => setShowPinLabels(!showPinLabels)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            showPinLabels
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Always-Visible Pin Labels"
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Pin Labels: {showPinLabels ? 'ON' : 'OFF'}</span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
          className="text-slate-300 hover:text-white px-2 py-0.5 rounded font-bold"
        >
          +
        </button>
        <span className="text-xs text-slate-400 font-mono">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}
          className="text-slate-300 hover:text-white px-2 py-0.5 rounded font-bold"
        >
          -
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 180, y: 120 });
          }}
          className="text-xs text-cyan-400 hover:underline ml-1 font-semibold"
        >
          Reset
        </button>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={containerRef}
        className={`w-full h-full ${
          isPanning
            ? 'cursor-grabbing'
            : activeTool === 'wire'
            ? 'cursor-crosshair'
            : 'cursor-default'
        }`}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <defs>
          <pattern id="grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="#1e293b" opacity="0.9" />
          </pattern>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#grid-dots)" />

          {/* ================= 1. ALL COMPONENTS (Rendered First: Canvas Floor) ================= */}
          {components.map(renderComponent)}

          {/* ================= WIRES (Rendered ON TOP of Components for Perfect Cirkit-Style Visibility) ================= */}
          {wires.map((wire) => {
            const fromComp = components.find((c) => c.id === wire.fromComponentId);
            const toComp = components.find((c) => c.id === wire.toComponentId);
            if (!fromComp || !toComp) return null;

            const fromPin = fromComp.pins.find((p) => p.id === wire.fromPinId);
            const toPin = toComp.pins.find((p) => p.id === wire.toPinId);
            if (!fromPin || !toPin) return null;

            const posA = getPinPos(fromComp, fromPin);
            const posB = getPinPos(toComp, toPin);

            const isSelected = selectedWireId === wire.id;
            const isHovered = hoveredWireId === wire.id;
            const routingMode = wire.routingType || defaultRoutingMode;
            // Always use instant live waypoints if this wire is currently being dragged
            const waypoints =
              draggedWaypoint && draggedWaypoint.wireId === wire.id
                ? draggedWaypoint.liveWaypoints
                : wire.waypoints || [];

            // Generate straight orthogonal 90° or curved path
            const pathData = generateWirePath(posA, posB, waypoints, routingMode);

            const currentFlow = simResult.branchCurrents[wire.id] || 0;
            const isEnergized = simResult.isRunning && Math.abs(currentFlow) > 0.0001;
            const isReverse = currentFlow < 0;

            const midX = Math.round((posA.x + posB.x) / 2);
            const midY = Math.round((posA.y + posB.y) / 2);

            const isMultiA = (pinWireCounts[`${fromComp.id}:${fromPin.id}`] || 0) > 1;
            const isMultiB = (pinWireCounts[`${toComp.id}:${toPin.id}`] || 0) > 1;
            const isFromBreadboard = isBreadboardType(fromComp.type);
            const isToBreadboard = isBreadboardType(toComp.type);

            return (
              <g
                key={wire.id}
                onMouseEnter={() => setHoveredWireId(wire.id)}
                onMouseLeave={() => setHoveredWireId(null)}
                onClick={(e) => handleWireClick(e, wire)}
                className="cursor-pointer"
                style={{ pointerEvents: wiringStart ? 'none' : 'auto' }}
              >
                {/* Invisible click/drag selection buffer — 12px wide for clean selection without masking pins */}
                <path
                  d={pathData}
                  stroke="transparent"
                  strokeWidth="12"
                  fill="none"
                  onMouseDown={(e) => {
                    const coords = getCanvasCoords(e);
                    // If clicked near posA or posB (within 10px), allow pin click to pass through
                    const distA = Math.hypot(coords.x - posA.x, coords.y - posA.y);
                    const distB = Math.hypot(coords.x - posB.x, coords.y - posB.y);
                    if (distA <= 10 || distB <= 10) {
                      return;
                    }

                    e.stopPropagation();
                    onSelectWire(wire.id);
                    onSelectComponent(null);

                    // Click & drag ANY wire at ANY point to immediately bend it!
                    const snap = gridSnap ? 10 : 1;
                    const snappedX = Math.round(coords.x / snap) * snap;
                    const snappedY = Math.round(coords.y / snap) * snap;

                    const existing = wire.waypoints ? [...wire.waypoints] : [];

                    // 1. If clicked near an existing waypoint, drag that existing waypoint
                    const closeIdx = getClosestExistingWaypointIndex(existing, coords, 18);
                    if (closeIdx !== -1) {
                      setDraggedWaypoint({
                        wireId: wire.id,
                        index: closeIdx,
                        liveWaypoints: existing,
                        isNew: false,
                      });
                      return;
                    }

                    // 2. Clicked anywhere along the wire: insert at exact segment and drag from that point!
                    const insertIdx = findBestWaypointInsertIndex(posA, posB, existing, coords);
                    const nextWaypoints = [...existing];
                    nextWaypoints.splice(insertIdx, 0, { x: snappedX, y: snappedY });

                    setDraggedWaypoint({
                      wireId: wire.id,
                      index: insertIdx,
                      liveWaypoints: nextWaypoints,
                      isNew: true,
                      startPos: { x: coords.x, y: coords.y },
                    });
                    onUpdateWireWaypoints(wire.id, nextWaypoints);
                  }}
                  className="cursor-grab active:cursor-grabbing"
                />

                {/* Outer Glow / Dark Contour for Cirkit-Style Clear Contrast */}
                <path
                  d={pathData}
                  stroke={isSelected ? '#00f0ff' : isEnergized ? '#fef08a' : isHovered ? '#38bdf8' : '#070b14'}
                  strokeWidth={isSelected ? '7' : isEnergized ? '5' : isHovered ? '5' : '4.6'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={isSelected ? 0.95 : isEnergized ? 0.45 : isHovered ? 0.45 : 0.85}
                  style={{ pointerEvents: 'none' }}
                />

                {/* Main Solid Wire Core */}
                <path
                  d={pathData}
                  stroke={wire.color || '#3b82f6'}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Animated Electron Current Flow */}
                {isEnergized && (
                  <path
                    d={pathData}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className={isReverse ? 'wire-animated-reverse' : 'wire-animated'}
                    opacity="0.95"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* ── Multi-Wire Junction Dots / Breadboard Connection Dots ── */}
                <g style={{ pointerEvents: 'none' }}>
                  {(isMultiA || isFromBreadboard) && (
                    <circle
                      cx={posA.x}
                      cy={posA.y}
                      r={isFromBreadboard ? 3.2 : 3.8}
                      fill={wire.color || '#3b82f6'}
                      stroke="#070b14"
                      strokeWidth="1.2"
                    />
                  )}
                  {(isMultiB || isToBreadboard) && (
                    <circle
                      cx={posB.x}
                      cy={posB.y}
                      r={isToBreadboard ? 3.2 : 3.8}
                      fill={wire.color || '#3b82f6'}
                      stroke="#070b14"
                      strokeWidth="1.2"
                    />
                  )}
                </g>

                {/* ================= DRAGGABLE WAYPOINT BEND HANDLES ================= */}
                {(isSelected || isHovered) && (
                  <g>
                    {/* Existing user draggable waypoints */}
                    {waypoints.map((wp, idx) => (
                      <g
                        key={idx}
                        transform={`translate(${wp.x}, ${wp.y})`}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setDraggedWaypoint({
                            wireId: wire.id,
                            index: idx,
                            liveWaypoints: waypoints,
                            isNew: false,
                          });
                        }}
                        onDoubleClick={(e) => handleRemoveWaypoint(e, wire.id, idx)}
                        className="cursor-move"
                      >
                        <circle cx="0" cy="0" r="10" fill="transparent" />
                        <circle
                          cx="0"
                          cy="0"
                          r="5.5"
                          fill="#00f0ff"
                          stroke="#ffffff"
                          strokeWidth="2"
                          filter="drop-shadow(0 0 5px #00f0ff)"
                        />
                      </g>
                    ))}

                    {/* Virtual Midpoint Add Bend handle for ANY wire (curved or orthogonal) */}
                    {waypoints.length === 0 && (
                      <g
                        transform={`translate(${midX}, ${midY})`}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleAddMidpointBend(wire, midX, midY);
                        }}
                        className="cursor-pointer group"
                      >
                        <title>Drag to bend this wire (Curved arc or 90° corner)</title>
                        <circle cx="0" cy="0" r="14" fill="transparent" />
                        <circle
                          cx="0"
                          cy="0"
                          r="6.5"
                          fill="#00f0ff"
                          stroke="#ffffff"
                          strokeWidth="2"
                          filter="drop-shadow(0 0 6px #00f0ff)"
                          className="transition-transform group-hover:scale-125"
                        />
                        <circle cx="0" cy="0" r="2" fill="#070b14" />
                      </g>
                    )}
                  </g>
                )}
              </g>
            );
          })}

          {/* Wiring Preview */}
          {wiringStart && wiringCurrent && (
            <g>
              <line
                x1={wiringStart.startX}
                y1={wiringStart.startY}
                x2={wiringCurrent.x}
                y2={wiringCurrent.y}
                stroke="#00f0ff"
                strokeWidth="3"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              <circle cx={wiringCurrent.x} cy={wiringCurrent.y} r="6" fill="#00f0ff" />
            </g>
          )}

          {/* HOVER PIN INSPECTION TOOLTIP */}
          {hoveredPin && (
            <g
              transform={`translate(${hoveredPin.x}, ${hoveredPin.y - 36})`}
              className="pointer-events-none z-50 animate-in fade-in duration-100"
            >
              {(() => {
                const pin = hoveredPin.pin;
                const v = simResult.nodeVoltages[`${hoveredPin.componentId}:${pin.id}`];
                const vStr = v !== undefined && simResult.isRunning ? `${v.toFixed(2)}V` : null;
                const titleText = `${hoveredPin.compName}: ${pin.name}`;
                const boxW = Math.max(140, titleText.length * 6.5 + 24);

                return (
                  <g>
                    <rect
                      x={-boxW / 2}
                      y="-24"
                      width={boxW}
                      height="38"
                      rx="6"
                      fill="#070b14"
                      stroke="#00f0ff"
                      strokeWidth="1.5"
                      filter="drop-shadow(0 0 12px rgba(0,240,255,0.4))"
                    />
                    <text
                      x="0"
                      y="-10"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {titleText}
                    </text>
                    <text
                      x="0"
                      y="6"
                      fill={vStr ? '#00f0ff' : '#94a3b8'}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {vStr ? `⚡ Potential: ${vStr}` : '👉 Click to start wire'}
                    </text>
                  </g>
                );
              })()}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
