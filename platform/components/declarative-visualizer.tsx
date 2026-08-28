"use client";

import React, { useMemo } from "react";
import { DeclarativeVisualizerConfig, VisualizerControl } from "@/lib/modules";
import { Sliders, Sparkles, Activity, Layers, RotateCcw } from "lucide-react";

interface DeclarativeVisualizerProps {
  visualizer: DeclarativeVisualizerConfig;
  controls: Record<string, number>;
  onControlChange: (id: string, value: number) => void;
  onReset?: () => void;
}

export function DeclarativeVisualizer({
  visualizer,
  controls,
  onControlChange,
  onReset,
}: DeclarativeVisualizerProps) {
  const { archetype, title, description, config } = visualizer;
  const width = config.canvasWidth || 640;
  const height = config.canvasHeight || 320;

  // Render archetype-specific secure SVG visualization
  const renderGraphic = useMemo(() => {
    switch (archetype) {
      case "factor_tree": {
        const num = Math.round(controls.number ?? controls.n ?? 180);
        // Prime factorization calculation
        const getPrimeFactors = (n: number) => {
          const factors: Array<{ prime: number; count: number }> = [];
          let d = 2;
          let temp = n;
          while (temp >= 2) {
            if (temp % d === 0) {
              let count = 0;
              while (temp % d === 0) {
                count++;
                temp /= d;
              }
              factors.push({ prime: d, count });
            }
            d = d === 2 ? 3 : d + 2;
            if (d * d > temp && temp > 1) {
              factors.push({ prime: temp, count: 1 });
              break;
            }
          }
          return factors;
        };

        const factors = getPrimeFactors(num);
        const factorString = factors
          .map((f) => (f.count > 1 ? `${f.prime}^${f.count}` : `${f.prime}`))
          .join(" × ");

        // Build a 2-level branch diagram
        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            <defs>
              <linearGradient id="rootGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d97757" />
                <stop offset="100%" stopColor="#e8895a" />
              </linearGradient>
              <linearGradient id="primeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Background Grid */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" />
            </pattern>
            <rect width={width} height={height} fill="url(#grid)" />

            {/* Root Node */}
            <circle cx={width / 2} cy={55} r={32} fill="url(#rootGrad)" className="drop-shadow-md" />
            <text
              x={width / 2}
              y={62}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="18"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {num}
            </text>

            {/* Branches and Children Nodes */}
            {factors.map((f, idx) => {
              const total = factors.length;
              const spacing = (width - 120) / Math.max(1, total);
              const xPos = 60 + spacing * idx + spacing / 2;
              const yPos = 175;

              return (
                <g key={idx}>
                  {/* Line Branch */}
                  <line
                    x1={width / 2}
                    y1={87}
                    x2={xPos}
                    y2={yPos - 25}
                    stroke="currentColor"
                    strokeOpacity="0.3"
                    strokeWidth="2.5"
                    strokeDasharray="4,4"
                  />
                  {/* Prime Circle Node */}
                  <circle cx={xPos} cy={yPos} r={24} fill="url(#primeGrad)" className="drop-shadow-sm" />
                  <text
                    x={xPos}
                    y={yPos + 6}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="15"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {f.prime}
                  </text>
                  {/* Exponent Badge if > 1 */}
                  {f.count > 1 && (
                    <g transform={`translate(${xPos + 14}, ${yPos - 18})`}>
                      <circle cx="0" cy="0" r="10" fill="#f59e0b" />
                      <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                        {f.count}
                      </text>
                    </g>
                  )}
                  <text
                    x={xPos}
                    y={yPos + 38}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-[11px] fill-muted-foreground font-mono"
                  >
                    {f.count > 1 ? `${f.prime}^${f.count} = ${Math.pow(f.prime, f.count)}` : "Prime Factor"}
                  </text>
                </g>
              );
            })}

            {/* Bottom Canonical Summary Card */}
            <g transform={`translate(${width / 2}, ${height - 25})`}>
              <rect
                x="-160"
                y="-16"
                width="320"
                height="32"
                rx="8"
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth="1.2"
                className="drop-shadow-md"
              />
              <text x="0" y="4" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="500" fontFamily="monospace">
                Canonical Decomposition: <tspan fill="#fb923c" fontWeight="bold">{factorString || num}</tspan>
              </text>
            </g>
          </svg>
        );
      }

      case "cartesian_line":
      case "line_explorer": {
        const m = controls.slope ?? controls.m ?? 0.75;
        const b = controls.yIntercept ?? controls.b ?? 20;
        const px = controls.pointX ?? controls.px ?? 60;
        const py = controls.pointY ?? controls.py ?? -50;

        const cx = width / 2;
        const cy = height / 2;
        const scale = 1.6;

        // Line equation: y = m*x + b => m*x - y + b = 0 => A=m, B=-1, C=b
        // Point-to-line projection coordinates (foot of perpendicular)
        // x_proj = (x0 + m*(y0 - b)) / (1 + m^2)
        // y_proj = (m*x0 + m^2*y0 + b) / (1 + m^2)
        const A = m;
        const B = -1;
        const C = b;
        const dist = Math.abs(A * px + B * py + C) / Math.sqrt(A * A + B * B);
        const thetaDeg = (Math.atan(m) * 180) / Math.PI;

        const footX = (px + m * (py - b)) / (1 + m * m);
        const footY = m * footX + b;

        // SVG canvas screen coordinates: X_screen = cx + x*scale, Y_screen = cy - y*scale
        const toSvgX = (x: number) => cx + x * scale;
        const toSvgY = (y: number) => cy - y * scale;

        // Line endpoints extending across viewport
        const xMin = -160;
        const xMax = 160;
        const yAtMin = m * xMin + b;
        const yAtMax = m * xMax + b;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            <defs>
              <pattern id="cartesianGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Grid Background */}
            <rect width={width} height={height} fill="url(#cartesianGrid)" />

            {/* Coordinate Axes */}
            <line x1="20" y1={cy} x2={width - 20} y2={cy} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
            <line x1={cx} y1="20" x2={cx} y2={height - 50} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
            <text x={width - 15} y={cy - 6} fill="currentColor" opacity="0.6" fontSize="11" fontWeight="bold" fontFamily="monospace">
              +X
            </text>
            <text x={cx + 8} y="25" fill="currentColor" opacity="0.6" fontSize="11" fontWeight="bold" fontFamily="monospace">
              +Y
            </text>

            {/* Inclination Angle Arc */}
            <g opacity="0.7">
              <path
                d={`M ${toSvgX(-b / m) + 25} ${cy} A 25 25 0 0 0 ${toSvgX(-b / m) + 25 * Math.cos(Math.atan(m))} ${
                  cy - 25 * Math.sin(Math.atan(m))
                }`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text
                x={toSvgX(-b / m) + 32}
                y={cy - 8}
                fill="#38bdf8"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                θ={thetaDeg.toFixed(1)}°
              </text>
            </g>

            {/* Main Linear Function Line */}
            <line
              x1={toSvgX(xMin)}
              y1={toSvgY(yAtMin)}
              x2={toSvgX(xMax)}
              y2={toSvgY(yAtMax)}
              stroke="#d97757"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Perpendicular Normal Segment from P to Line */}
            <line
              x1={toSvgX(px)}
              y1={toSvgY(py)}
              x2={toSvgX(footX)}
              y2={toSvgY(footY)}
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />

            {/* Right Angle Indicator at Foot */}
            <circle cx={toSvgX(footX)} cy={toSvgY(footY)} r="3" fill="#f43f5e" />

            {/* Target Point P(px, py) */}
            <circle cx={toSvgX(px)} cy={toSvgY(py)} r="6" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" className="drop-shadow-md" />
            <text
              x={toSvgX(px) + 8}
              y={toSvgY(py) - 8}
              fill="#fbbf24"
              fontSize="11"
              fontWeight="bold"
              fontFamily="monospace"
            >
              P({Math.round(px)}, {Math.round(py)})
            </text>

            {/* Intercept Mark */}
            <circle cx={cx} cy={toSvgY(b)} r="4" fill="#34d399" />
            <text x={cx + 8} y={toSvgY(b) + 4} fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
              (0, {Math.round(b)})
            </text>

            {/* Bottom Live Calculation HUD */}
            <g transform={`translate(${width / 2}, ${height - 25})`}>
              <rect
                x="-260"
                y="-16"
                width="520"
                height="32"
                rx="8"
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth="1.2"
                className="drop-shadow-md"
              />
              <text x="0" y="4" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="500" fontFamily="monospace">
                Line: <tspan fill="#fb923c" fontWeight="bold">y = {m.toFixed(2)}x {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}</tspan> • Slope: <tspan fill="#38bdf8" fontWeight="bold">m = {m.toFixed(2)}</tspan> • Distance to P: <tspan fill="#fb7185" fontWeight="bold">d = {dist.toFixed(2)} u</tspan>
              </text>
            </g>
          </svg>
        );
      }

      case "polygon_shoelace":
      case "triangle_centroid": {
        const x1 = controls.x1 ?? 20;
        const y1 = controls.y1 ?? 70;
        const x2 = controls.x2 ?? 100;
        const y2 = controls.y2 ?? -30;
        const x3 = controls.x3 ?? -80;
        const y3 = controls.y3 ?? -50;

        const cx = width / 2;
        const cy = height / 2 - 10;
        const scale = 1.3;

        const toSvgX = (x: number) => cx + x * scale;
        const toSvgY = (y: number) => cy - y * scale;

        // Centroid G
        const gx = (x1 + x2 + x3) / 3;
        const gy = (y1 + y2 + y3) / 3;

        // Shoelace Area
        const area = 0.5 * Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {/* Grid */}
            <line x1="30" y1={cy} x2={width - 30} y2={cy} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
            <line x1={cx} y1="20" x2={cx} y2={height - 50} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />

            {/* Filled Polygon Area */}
            <polygon
              points={`${toSvgX(x1)},${toSvgY(y1)} ${toSvgX(x2)},${toSvgY(y2)} ${toSvgX(x3)},${toSvgY(y3)}`}
              fill="rgba(217, 119, 87, 0.15)"
              stroke="#d97757"
              strokeWidth="2.5"
            />

            {/* Medians */}
            <line x1={toSvgX(x1)} y1={toSvgY(y1)} x2={toSvgX((x2 + x3) / 2)} y2={toSvgY((y2 + y3) / 2)} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1={toSvgX(x2)} y1={toSvgY(y2)} x2={toSvgX((x1 + x3) / 2)} y2={toSvgY((y1 + y3) / 2)} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1={toSvgX(x3)} y1={toSvgY(y3)} x2={toSvgX((x1 + x2) / 2)} y2={toSvgY((y1 + y2) / 2)} stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Vertices */}
            <circle cx={toSvgX(x1)} cy={toSvgY(y1)} r="5" fill="#10b981" />
            <text x={toSvgX(x1) + 6} y={toSvgY(y1) - 6} fill="#10b981" fontSize="10" fontWeight="bold">A({Math.round(x1)},{Math.round(y1)})</text>
            <circle cx={toSvgX(x2)} cy={toSvgY(y2)} r="5" fill="#10b981" />
            <text x={toSvgX(x2) + 6} y={toSvgY(y2) + 12} fill="#10b981" fontSize="10" fontWeight="bold">B({Math.round(x2)},{Math.round(y2)})</text>
            <circle cx={toSvgX(x3)} cy={toSvgY(y3)} r="5" fill="#10b981" />
            <text x={toSvgX(x3) - 30} y={toSvgY(y3) + 12} fill="#10b981" fontSize="10" fontWeight="bold">C({Math.round(x3)},{Math.round(y3)})</text>

            {/* Centroid G */}
            <circle cx={toSvgX(gx)} cy={toSvgY(gy)} r="6" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
            <text x={toSvgX(gx) + 8} y={toSvgY(gy) + 4} fill="#fbbf24" fontSize="11" fontWeight="bold">G({gx.toFixed(1)}, {gy.toFixed(1)})</text>

            {/* Bottom HUD */}
            <g transform={`translate(${width / 2}, ${height - 25})`}>
              <rect x="-220" y="-16" width="440" height="32" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1.2" className="drop-shadow-md" />
              <text x="0" y="4" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="500" fontFamily="monospace">
                Shoelace Area: <tspan fill="#fb923c" fontWeight="bold">{area.toFixed(1)} sq units</tspan> • Centroid G: <tspan fill="#fbbf24" fontWeight="bold">({gx.toFixed(1)}, {gy.toFixed(1)})</tspan>
              </text>
            </g>
          </svg>
        );
      }

      case "conic_explorer": {
        const e = controls.eccentricity ?? controls.e ?? 0.8;
        const a = controls.semiMajor ?? controls.a ?? 100;
        const b = controls.semiMinor ?? controls.b ?? (e < 1 ? Math.sqrt(Math.max(1, a * a * (1 - e * e))) : 80);

        let conicType = "Circle";
        let formula = "x² + y² = r²";
        let strokeColor = "#3b82f6";

        if (e === 0) {
          conicType = "Circle (e = 0)";
          formula = `x² + y² = ${Math.round(a)}²`;
          strokeColor = "#10b981";
        } else if (e < 1) {
          conicType = `Ellipse (e = ${e.toFixed(2)} < 1)`;
          formula = `x²/${Math.round(a)}² + y²/${Math.round(b)}² = 1`;
          strokeColor = "#d97757";
        } else if (e === 1) {
          conicType = "Parabola (e = 1.0)";
          formula = `y² = 4ax (e = 1)`;
          strokeColor = "#f59e0b";
        } else {
          conicType = `Hyperbola (e = ${e.toFixed(2)} > 1)`;
          formula = `x²/${Math.round(a)}² - y²/${Math.round(b)}² = 1`;
          strokeColor = "#8b5cf6";
        }

        const cx = width / 2;
        const cy = height / 2 - 15;

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {/* Coordinate Axes */}
            <line x1="30" y1={cy} x2={width - 30} y2={cy} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
            <line x1={cx} y1="20" x2={cx} y2={height - 50} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />

            {/* Directrix Line */}
            {e > 0 && (
              <g>
                <line
                  x1={cx - a / Math.max(0.1, e)}
                  y1="25"
                  x2={cx - a / Math.max(0.1, e)}
                  y2={height - 55}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                <text
                  x={cx - a / Math.max(0.1, e) - 8}
                  y="40"
                  textAnchor="end"
                  fill="#ef4444"
                  fontSize="10"
                  fontWeight="bold"
                >
                  Directrix (d)
                </text>
              </g>
            )}

            {/* Conic Locus Path */}
            {e < 1 ? (
              <ellipse
                cx={cx}
                cy={cy}
                rx={Math.min(width / 2 - 40, a)}
                ry={Math.min(height / 2 - 40, b)}
                fill="none"
                stroke={strokeColor}
                strokeWidth="3"
              />
            ) : e === 1 ? (
              <path
                d={`M ${cx + 140} ${cy - 80} Q ${cx} ${cy} ${cx + 140} ${cy + 80}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth="3"
              />
            ) : (
              <g>
                {/* Hyperbola Left & Right Branches */}
                <path
                  d={`M ${cx - 130} ${cy - 75} Q ${cx - a * 0.5} ${cy} ${cx - 130} ${cy + 75}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="3"
                />
                <path
                  d={`M ${cx + 130} ${cy - 75} Q ${cx + a * 0.5} ${cy} ${cx + 130} ${cy + 75}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="3"
                />
              </g>
            )}

            {/* Focus Point */}
            {e > 0 && e < 1 && (
              <g>
                <circle cx={cx + a * e} cy={cy} r="4.5" fill="#d97757" />
                <circle cx={cx - a * e} cy={cy} r="4.5" fill="#d97757" />
                <text x={cx + a * e} y={cy - 10} textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">
                  F₂
                </text>
                <text x={cx - a * e} y={cy - 10} textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">
                  F₁
                </text>
              </g>
            )}

            {/* Bottom Status Banner */}
            <g transform={`translate(${width / 2}, ${height - 25})`}>
              <rect
                x="-200"
                y="-16"
                width="400"
                height="32"
                rx="8"
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth="1.2"
                className="drop-shadow-md"
              />
              <text x="0" y="4" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="500" fontFamily="monospace">
                Class: <tspan fill="#fb923c" fontWeight="bold">{conicType}</tspan> • Locus: <tspan fill="#38bdf8" fontWeight="bold">{formula}</tspan>
              </text>
            </g>
          </svg>
        );
      }

      case "rlc_resonance":
      case "circuit_phasor": {
        const R = controls.R ?? 50; // Ohms
        const L_mH = controls.L ?? 10; // mH
        const C_uF = controls.C ?? 5; // uF
        const f = controls.f ?? 500; // Hz

        const L = L_mH * 1e-3;
        const C = C_uF * 1e-6;
        const omega = 2 * Math.PI * f;
        const XL = omega * L;
        const XC = 1 / (omega * C);
        const X_net = XL - XC;
        const Z = Math.sqrt(R * R + X_net * X_net);
        const thetaRad = Math.atan2(X_net, R);
        const thetaDeg = (thetaRad * 180) / Math.PI;
        const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));

        const cx = 150;
        const cy = height / 2;
        const scale = 0.7;

        // Curve Points for Frequency Response
        const curvePoints: string[] = [];
        for (let x = 0; x <= 260; x += 5) {
          const testF = (x / 260) * 1500 + 50;
          const testOmega = 2 * Math.PI * testF;
          const testXL = testOmega * L;
          const testXC = 1 / (testOmega * C);
          const testZ = Math.sqrt(R * R + Math.pow(testXL - testXC, 2));
          const testI = (100 / testZ) * 60; // normalized current
          const plotY = height - 55 - Math.min(100, testI);
          curvePoints.push(`${340 + x},${plotY}`);
        }

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {/* Left Phasor Diagram Title */}
            <text x="30" y="28" fill="currentColor" fontSize="11" fontWeight="bold" className="fill-muted-foreground">
              IMPEDANCE PHASOR DIAGRAM
            </text>

            {/* Phasor Coordinate Grid */}
            <line x1="30" y1={cy} x2="270" y2={cy} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
            <line x1={cx} y1="35" x2={cx} y2={height - 45} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />

            {/* R Vector (Horizontal) */}
            <line x1={cx} y1={cy} x2={cx + R * scale} y2={cy} stroke="#10b981" strokeWidth="3" />
            <text x={cx + R * scale + 8} y={cy + 4} fill="#10b981" fontSize="11" fontWeight="bold">
              R ({Math.round(R)}Ω)
            </text>

            {/* XL and XC Vectors (Vertical) */}
            <line x1={cx} y1={cy} x2={cx} y2={cy - Math.min(70, XL * scale)} stroke="#3b82f6" strokeWidth="2.5" />
            <text x={cx + 6} y={cy - Math.min(70, XL * scale) + 4} fill="#3b82f6" fontSize="10">
              +jX_L ({Math.round(XL)}Ω)
            </text>

            <line x1={cx} y1={cy} x2={cx} y2={cy + Math.min(70, XC * scale)} stroke="#f59e0b" strokeWidth="2.5" />
            <text x={cx + 6} y={cy + Math.min(70, XC * scale) + 4} fill="#f59e0b" fontSize="10">
              -jX_C ({Math.round(XC)}Ω)
            </text>

            {/* Net Impedance Vector Z */}
            <line
              x1={cx}
              y1={cy}
              x2={cx + R * scale}
              y2={cy - X_net * scale}
              stroke="#d97757"
              strokeWidth="3.5"
              strokeDasharray={Math.abs(X_net) < 2 ? "none" : undefined}
            />
            <circle cx={cx + R * scale} cy={cy - X_net * scale} r="4" fill="#d97757" />

            {/* Right Frequency Response Plot */}
            <text x="340" y="28" fill="currentColor" fontSize="11" fontWeight="bold" className="fill-muted-foreground">
              RESONANCE FREQUENCY CURVE
            </text>
            <line x1="340" y1={height - 55} x2="600" y2={height - 55} stroke="currentColor" strokeOpacity="0.3" />
            <line x1="340" y1="45" x2="340" y2={height - 55} stroke="currentColor" strokeOpacity="0.3" />

            <polyline points={curvePoints.join(" ")} fill="none" stroke="#d97757" strokeWidth="2.5" />

            {/* Current Operating Point Marker */}
            {(() => {
              const currentX = 340 + ((f - 50) / 1500) * 260;
              const currentI = (100 / Z) * 60;
              const currentY = height - 55 - Math.min(100, currentI);
              return (
                <g>
                  <circle cx={currentX} cy={currentY} r="5" fill="#ef4444" className="animate-pulse" />
                  <line
                    x1={currentX}
                    y1={currentY}
                    x2={currentX}
                    y2={height - 55}
                    stroke="#ef4444"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                </g>
              );
            })()}

            {/* Bottom Metrics Bar */}
            <g transform={`translate(${width / 2}, ${height - 20})`}>
              <text x="0" y="0" textAnchor="middle" fill="currentColor" className="text-[11px] font-mono">
                Z = <tspan className="font-bold fill-primary">{Z.toFixed(1)}Ω</tspan> • θ ={" "}
                <tspan className="font-bold">{thetaDeg.toFixed(1)}°</tspan> • Resonance f₀ ={" "}
                <tspan className="font-bold fill-emerald-500">{Math.round(f0)} Hz</tspan>
              </text>
            </g>
          </svg>
        );
      }

      case "wave_interference":
      case "modulation": {
        const fc = controls.carrierFreq ?? controls.fc ?? 10;
        const modType = controls.modType ?? 0; // 0: ASK, 1: FSK, 2: BPSK
        const bits = [1, 0, 1, 1, 0, 1];

        // Draw 3 wave rows: Carrier, Binary Data, Modulated Signal
        const rowH = 65;
        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {/* Binary Bit Legend Header */}
            <g transform="translate(60, 20)">
              {bits.map((bit, idx) => (
                <g key={idx} transform={`translate(${idx * 90}, 0)`}>
                  <rect x="0" y="0" width="86" height="22" rx="4" fill="currentColor" className="fill-muted/40" />
                  <text x="43" y="15" textAnchor="middle" fill="currentColor" className="font-mono text-xs font-bold">
                    Bit {bit}
                  </text>
                </g>
              ))}
            </g>

            {/* Modulated Waveform Row */}
            <g transform="translate(60, 95)">
              <text x="-50" y="25" fill="currentColor" className="text-[10px] font-bold fill-muted-foreground">
                SIGNAL
              </text>
              <line x1="0" y1="20" x2="540" y2="20" stroke="currentColor" strokeOpacity="0.15" />

              {/* Bit Square Wave */}
              {bits.map((bit, idx) => (
                <path
                  key={idx}
                  d={`M ${idx * 90} ${bit === 1 ? 0 : 40} H ${(idx + 1) * 90} ${
                    idx < bits.length - 1 && bit !== bits[idx + 1] ? `V ${bits[idx + 1] === 1 ? 0 : 40}` : ""
                  }`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />
              ))}
            </g>

            {/* Modulated RF Output Row */}
            <g transform="translate(60, 190)">
              <text x="-50" y="25" fill="currentColor" className="text-[10px] font-bold fill-primary">
                OUTPUT
              </text>
              <line x1="0" y1="20" x2="540" y2="20" stroke="currentColor" strokeOpacity="0.15" />

              {/* Modulated Wave Path */}
              {bits.map((bit, idx) => {
                const startX = idx * 90;
                const points: string[] = [];
                for (let px = 0; px <= 90; px += 2) {
                  const x = startX + px;
                  let amp = 20;
                  let freq = fc;
                  let phase = 0;

                  if (modType === 0) {
                    // ASK: bit 0 has 0 or low amplitude
                    amp = bit === 1 ? 20 : 4;
                  } else if (modType === 1) {
                    // FSK: bit 1 high freq, bit 0 low freq
                    freq = bit === 1 ? fc * 1.5 : fc * 0.6;
                  } else {
                    // BPSK: bit 1 phase 0, bit 0 phase PI
                    phase = bit === 1 ? 0 : Math.PI;
                  }

                  const y = 20 + amp * Math.sin((px / 90) * freq * 2 * Math.PI + phase);
                  points.push(`${x},${y}`);
                }
                return <polyline key={idx} points={points.join(" ")} fill="none" stroke="#d97757" strokeWidth="2.5" />;
              })}
            </g>

            {/* Modulation Type Label */}
            <g transform={`translate(${width / 2}, ${height - 18})`}>
              <text x="0" y="0" textAnchor="middle" fill="currentColor" className="text-xs font-mono font-bold fill-primary">
                Modulation: {modType === 0 ? "ASK (Amplitude Shift Keying)" : modType === 1 ? "FSK (Frequency Shift Keying)" : "BPSK (Binary Phase Shift Keying)"}
              </text>
            </g>
          </svg>
        );
      }

      case "parameter_sweep":
      default: {
        // General Parametric Waveform Sweep
        const freq = controls.frequency ?? controls.f ?? 2;
        const amp = controls.amplitude ?? controls.A ?? 40;
        const damping = controls.damping ?? controls.alpha ?? 0.05;

        const points: string[] = [];
        for (let x = 0; x <= width - 80; x += 3) {
          const t = x / (width - 80);
          const env = Math.exp(-damping * 10 * t);
          const y = height / 2 + amp * env * Math.sin(freq * 2 * Math.PI * t);
          points.push(`${40 + x},${y}`);
        }

        return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            <line x1="30" y1={height / 2} x2={width - 30} y2={height / 2} stroke="currentColor" strokeOpacity="0.2" />
            <polyline points={points.join(" ")} fill="none" stroke="#d97757" strokeWidth="3" />
            <circle cx={40} cy={height / 2} r="4" fill="#d97757" />
          </svg>
        );
      }
    }
  }, [archetype, controls, width, height]);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            title="Reset to default parameters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full rounded-lg border border-border/70 bg-background/80 overflow-hidden flex items-center justify-center min-h-[260px] p-2">
        {renderGraphic}
      </div>

      {/* Interactive Sliders */}
      {config.controls && config.controls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {config.controls.map((ctrl) => {
            const currentVal = controls[ctrl.id] ?? ctrl.defaultValue;
            return (
              <div key={ctrl.id} className="space-y-1.5 bg-muted/30 rounded-lg p-2.5 border border-border/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{ctrl.label}</span>
                  <span className="font-mono font-bold text-primary">
                    {currentVal} {ctrl.unit || ""}
                  </span>
                </div>
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={currentVal}
                  onChange={(e) => onControlChange(ctrl.id, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>{ctrl.min}</span>
                  <span>{ctrl.max}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
