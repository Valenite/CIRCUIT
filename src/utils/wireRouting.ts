import type { Waypoint, WireRoutingType } from '../types/circuit';

export interface Point {
  x: number;
  y: number;
}

function distToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

export function findBestWaypointInsertIndex(
  posA: Point,
  posB: Point,
  waypoints: Waypoint[],
  clickPos: Point
): number {
  if (!waypoints || waypoints.length === 0) return 0;
  const pts: Point[] = [posA, ...waypoints, posB];
  let bestIndex = 0;
  let minDistance = Infinity;

  for (let i = 0; i < pts.length - 1; i++) {
    const dist = distToSegment(clickPos, pts[i], pts[i + 1]);
    if (dist < minDistance) {
      minDistance = dist;
      bestIndex = i;
    }
  }

  return bestIndex;
}

export function getClosestExistingWaypointIndex(
  waypoints: Waypoint[] = [],
  clickPos: Point,
  maxDistance = 16
): number {
  let closestIdx = -1;
  let minDist = maxDistance;

  waypoints.forEach((wp, idx) => {
    const dist = Math.hypot(wp.x - clickPos.x, wp.y - clickPos.y);
    if (dist < minDist) {
      minDist = dist;
      closestIdx = idx;
    }
  });

  return closestIdx;
}

export function generateWirePath(
  posA: Point,
  posB: Point,
  waypoints: Waypoint[] = [],
  routingType: WireRoutingType = 'orthogonal'
): string {
  // ================= CURVED WIRE ROUTING =================
  if (routingType === 'curved') {
    if (waypoints.length === 1) {
      // 1 Apex handle: Pure natural parabolic/quadratic curve passing directly through wp
      const wp = waypoints[0];
      const cpX = 2 * wp.x - 0.5 * posA.x - 0.5 * posB.x;
      const cpY = 2 * wp.y - 0.5 * posA.y - 0.5 * posB.y;
      return `M ${posA.x} ${posA.y} Q ${cpX.toFixed(1)} ${cpY.toFixed(1)}, ${posB.x} ${posB.y}`;
    }

    if (waypoints.length > 1) {
      // Multiple waypoints: Smooth continuous spline passing through all user handles
      const pts: Point[] = [posA, ...waypoints, posB];
      let d = `M ${pts[0].x} ${pts[0].y}`;

      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = i > 0 ? pts[i - 1] : pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i + 2 < pts.length ? pts[i + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) / 4;
        const cp1y = p1.y + (p2.y - p0.y) / 4;
        const cp2x = p2.x - (p3.x - p1.x) / 4;
        const cp2y = p2.y - (p3.y - p1.y) / 4;

        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x} ${p2.y}`;
      }
      return d;
    }

    // Default 0 waypoints: Clean, gentle S-curve or arc
    const dx = posB.x - posA.x;
    const dy = posB.y - posA.y;

    if (Math.abs(dx) >= Math.abs(dy)) {
      const offset = Math.min(Math.abs(dx) * 0.5, 80);
      return `M ${posA.x} ${posA.y} C ${posA.x + (dx > 0 ? offset : -offset)} ${posA.y}, ${posB.x - (dx > 0 ? offset : -offset)} ${posB.y}, ${posB.x} ${posB.y}`;
    }

    const offset = Math.min(Math.abs(dy) * 0.5, 80);
    return `M ${posA.x} ${posA.y} C ${posA.x} ${posA.y + (dy > 0 ? offset : -offset)}, ${posB.x} ${posB.y - (dy > 0 ? offset : -offset)}, ${posB.x} ${posB.y}`;
  }

  // ================= ORTHOGONAL STRAIGHT 90° ROUTING =================
  if (waypoints.length === 0) {
    const midX = Math.round((posA.x + posB.x) / 2);
    // Draw 3 orthogonal segments: posA -> (midX, posA.y) -> (midX, posB.y) -> posB
    return `M ${posA.x} ${posA.y} L ${midX} ${posA.y} L ${midX} ${posB.y} L ${posB.x} ${posB.y}`;
  }

  // User waypoints / 90° bend corners:
  // Each waypoint wp is a true 2D corner that controls horizontal and vertical steps!
  let d = `M ${posA.x} ${posA.y}`;
  let current = posA;

  for (const wp of waypoints) {
    // Horizontal step to wp.x, then vertical step to wp.y
    d += ` L ${wp.x} ${current.y} L ${wp.x} ${wp.y}`;
    current = wp;
  }

  // Connect from last waypoint to posB: horizontal step to posB.x, then vertical to posB.y
  d += ` L ${posB.x} ${current.y} L ${posB.x} ${posB.y}`;
  return d;
}

export function getOrthogonalSegments(
  posA: Point,
  posB: Point,
  waypoints: Waypoint[] = []
): Point[] {
  if (waypoints.length === 0) {
    const midX = Math.round((posA.x + posB.x) / 2);
    return [
      posA,
      { x: midX, y: posA.y },
      { x: midX, y: posB.y },
      posB,
    ];
  }

  const points: Point[] = [posA];
  let current = posA;

  for (const wp of waypoints) {
    points.push({ x: wp.x, y: current.y });
    points.push({ x: wp.x, y: wp.y });
    current = wp;
  }

  points.push({ x: posB.x, y: current.y });
  points.push({ x: posB.x, y: posB.y });
  return points;
}
