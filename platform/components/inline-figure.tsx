"use client";

import React from "react";

export interface DiagramElement {
  type:
    | "axes"
    | "grid"
    | "line"
    | "segment"
    | "arrow"
    | "point"
    | "arc"
    | "projection"
    | "polygon"
    | "text"
    | "right_angle";
  from?: [number, number];
  to?: [number, number];
  at?: [number, number];
  center?: [number, number];
  points?: Array<[number, number]>;
  radius?: number;
  startAngle?: number; // in degrees
  endAngle?: number; // in degrees
  label?: string;
  color?: string;
  fill?: string;
  stroke?: string;
  width?: number;
  dashed?: boolean;
  fontSize?: number;
  size?: number;
}

export interface InlineFigureConfig {
  caption?: string;
  width?: number;
  height?: number;
  xRange?: [number, number]; // e.g. [-2, 6]
  yRange?: [number, number]; // e.g. [-2, 5]
  elements: DiagramElement[];
}

export function InlineFigure({ config }: { config: InlineFigureConfig }) {
  const W = config.width || 440;
  const H = config.height || 220;
  const pad = 36;

  const [xMin, xMax] = config.xRange || [-5, 5];
  const [yMin, yMax] = config.yRange || [-5, 5];

  const dx = xMax - xMin || 1;
  const dy = yMax - yMin || 1;

  // Convert mathematical world coordinates to SVG screen coordinates
  const toSvgX = (x: number) => pad + ((x - xMin) / dx) * (W - 2 * pad);
  const toSvgY = (y: number) => H - pad - ((y - yMin) / dy) * (H - 2 * pad);

  const originX = toSvgX(0);
  const originY = toSvgY(0);

  return (
    <figure className="my-5 mx-auto max-w-lg rounded-2xl bg-[var(--surface2)] border border-[var(--border)] p-4 shadow-sm flex flex-col items-center">
      <div className="w-full overflow-hidden flex justify-center">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-[440px] h-auto select-none overflow-visible"
        >
          <defs>
            <marker
              id="arrowhead-accent"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#d97757" />
            </marker>
            <marker
              id="arrowhead-cyan"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#38bdf8" />
            </marker>
            <marker
              id="arrowhead-axis"
              markerWidth="7"
              markerHeight="5"
              refX="6"
              refY="2.5"
              orient="auto"
            >
              <polygon points="0 0, 7 2.5, 0 5" fill="currentColor" opacity="0.4" />
            </marker>
          </defs>

          {/* Render Elements by Layer */}
          {config.elements.map((el, idx) => {
            switch (el.type) {
              case "grid": {
                const gridLines: React.ReactNode[] = [];
                for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
                  gridLines.push(
                    <line
                      key={`gx-${x}`}
                      x1={toSvgX(x)}
                      y1={toSvgY(yMin)}
                      x2={toSvgX(x)}
                      y2={toSvgY(yMax)}
                      stroke="currentColor"
                      strokeOpacity="0.06"
                      strokeWidth="1"
                    />
                  );
                }
                for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
                  gridLines.push(
                    <line
                      key={`gy-${y}`}
                      x1={toSvgX(xMin)}
                      y1={toSvgY(y)}
                      x2={toSvgX(xMax)}
                      y2={toSvgY(y)}
                      stroke="currentColor"
                      strokeOpacity="0.06"
                      strokeWidth="1"
                    />
                  );
                }
                return <g key={`grid-${idx}`}>{gridLines}</g>;
              }

              case "axes": {
                return (
                  <g key={`axes-${idx}`} opacity="0.45">
                    {/* X Axis */}
                    <line
                      x1={toSvgX(xMin) - 10}
                      y1={originY}
                      x2={toSvgX(xMax) + 12}
                      y2={originY}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      markerEnd="url(#arrowhead-axis)"
                    />
                    <text
                      x={toSvgX(xMax) + 16}
                      y={originY + 4}
                      fill="currentColor"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      +X
                    </text>

                    {/* Y Axis */}
                    <line
                      x1={originX}
                      y1={toSvgY(yMin) + 10}
                      x2={originX}
                      y2={toSvgY(yMax) - 12}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      markerEnd="url(#arrowhead-axis)"
                    />
                    <text
                      x={originX + 5}
                      y={toSvgY(yMax) - 14}
                      fill="currentColor"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      +Y
                    </text>
                  </g>
                );
              }

              case "polygon": {
                if (!el.points || el.points.length < 3) return null;
                const pointsStr = el.points
                  .map(([px, py]) => `${toSvgX(px)},${toSvgY(py)}`)
                  .join(" ");
                return (
                  <polygon
                    key={`poly-${idx}`}
                    points={pointsStr}
                    fill={el.fill || "rgba(217, 119, 87, 0.15)"}
                    stroke={el.stroke || "#d97757"}
                    strokeWidth={el.width || 2}
                  />
                );
              }

              case "line": {
                if (!el.from || !el.to) return null;
                const [x1, y1] = el.from;
                const [x2, y2] = el.to;

                // Extend line across viewport bounds
                const slope = (y2 - y1) / (x2 - x1 || 1e-6);
                const intercept = y1 - slope * x1;
                const extX1 = xMin - 1;
                const extY1 = slope * extX1 + intercept;
                const extX2 = xMax + 1;
                const extY2 = slope * extX2 + intercept;

                return (
                  <line
                    key={`line-${idx}`}
                    x1={toSvgX(extX1)}
                    y1={toSvgY(extY1)}
                    x2={toSvgX(extX2)}
                    y2={toSvgY(extY2)}
                    stroke={el.color || "#d97757"}
                    strokeWidth={el.width || 2.5}
                    strokeLinecap="round"
                  />
                );
              }

              case "segment": {
                if (!el.from || !el.to) return null;
                const x1 = toSvgX(el.from[0]);
                const y1 = toSvgY(el.from[1]);
                const x2 = toSvgX(el.to[0]);
                const y2 = toSvgY(el.to[1]);
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;

                return (
                  <g key={`seg-${idx}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={el.color || "#38bdf8"}
                      strokeWidth={el.width || 2}
                      strokeDasharray={el.dashed ? "4,3" : undefined}
                      strokeLinecap="round"
                    />
                    {el.label && (
                      <text
                        x={midX}
                        y={midY - 6}
                        textAnchor="middle"
                        fill={el.color || "#38bdf8"}
                        fontSize={el.fontSize || 10}
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {el.label}
                      </text>
                    )}
                  </g>
                );
              }

              case "projection": {
                if (!el.from || !el.to) return null;
                const x1 = toSvgX(el.from[0]);
                const y1 = toSvgY(el.from[1]);
                const x2 = toSvgX(el.to[0]);
                const y2 = toSvgY(el.to[1]);
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;

                return (
                  <g key={`proj-${idx}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={el.color || "#f43f5e"}
                      strokeWidth={el.width || 1.5}
                      strokeDasharray="4,3"
                    />
                    {el.label && (
                      <text
                        x={midX + 8}
                        y={midY}
                        fill={el.color || "#f43f5e"}
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {el.label}
                      </text>
                    )}
                  </g>
                );
              }

              case "right_angle": {
                if (!el.at) return null;
                const cx = toSvgX(el.at[0]);
                const cy = toSvgY(el.at[1]);
                const s = el.size || 8;
                return (
                  <path
                    key={`ra-${idx}`}
                    d={`M ${cx - s} ${cy} L ${cx - s} ${cy - s} L ${cx} ${cy - s}`}
                    fill="none"
                    stroke={el.color || "#a1a1aa"}
                    strokeWidth="1.2"
                  />
                );
              }

              case "arc": {
                const center = el.center || [0, 0];
                const cx = toSvgX(center[0]);
                const cy = toSvgY(center[1]);
                const r = el.radius || 24;
                const startDeg = el.startAngle || 0;
                const endDeg = el.endAngle || 45;

                const startRad = (startDeg * Math.PI) / 180;
                const endRad = (endDeg * Math.PI) / 180;

                // In SVG Y is downwards
                const xStart = cx + r * Math.cos(startRad);
                const yStart = cy - r * Math.sin(startRad);
                const xEnd = cx + r * Math.cos(endRad);
                const yEnd = cy - r * Math.sin(endRad);

                const midAngle = ((startDeg + endDeg) / 2 * Math.PI) / 180;
                const labelX = cx + (r + 14) * Math.cos(midAngle);
                const labelY = cy - (r + 14) * Math.sin(midAngle);

                const arcD = `M ${xStart} ${yStart} A ${r} ${r} 0 0 0 ${xEnd} ${yEnd}`;

                return (
                  <g key={`arc-${idx}`}>
                    <path
                      d={arcD}
                      fill="none"
                      stroke={el.color || "#38bdf8"}
                      strokeWidth={el.width || 1.8}
                    />
                    {el.label && (
                      <text
                        x={labelX}
                        y={labelY + 3}
                        fill={el.color || "#38bdf8"}
                        fontSize={el.fontSize || 10}
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {el.label}
                      </text>
                    )}
                  </g>
                );
              }

              case "point": {
                if (!el.at) return null;
                const px = toSvgX(el.at[0]);
                const py = toSvgY(el.at[1]);
                return (
                  <g key={`pt-${idx}`}>
                    <circle
                      cx={px}
                      cy={py}
                      r={el.size || 4.5}
                      fill={el.color || "#fbbf24"}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    {el.label && (
                      <text
                        x={px + 7}
                        y={py - 6}
                        fill={el.color || "#fbbf24"}
                        fontSize={el.fontSize || 10}
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {el.label}
                      </text>
                    )}
                  </g>
                );
              }

              case "text": {
                if (!el.at) return null;
                const tx = toSvgX(el.at[0]);
                const ty = toSvgY(el.at[1]);
                return (
                  <text
                    key={`txt-${idx}`}
                    x={tx}
                    y={ty}
                    fill={el.color || "currentColor"}
                    fontSize={el.fontSize || 11}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {el.label}
                  </text>
                );
              }

              default:
                return null;
            }
          })}
        </svg>
      </div>

      {config.caption && (
        <figcaption className="mt-2.5 text-xs text-center text-[var(--text3)] font-medium leading-relaxed max-w-sm">
          {config.caption}
        </figcaption>
      )}
    </figure>
  );
}
