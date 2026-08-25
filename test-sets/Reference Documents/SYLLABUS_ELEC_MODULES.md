# Detailed Interactive Learning Modules Syllabus: ELECTRONICS ENGINEERING (ELEC 01 to ELEC 15)

> **Philippine ECE Licensure Examination • Electronics Engineering Domain (30% Board Weight)**
> Formatted according to the `learning-module-authoring` skill standards.
> Reference Grounding: `Reference Documents/Elecs/Notes - DC Circuit Part 1–4.pdf`, `Notes - AC Circuit Part 1–3.pdf`, `Elec 01-01 to 15-06 Questionnaires & Solutions`.

---

## ELEC 01: Electricity, Magnetism & Electric Charge (6 Subtopic Modules)
- **Overview & Subject Links**:
  - Grounding in electrostatics, Coulomb's Law, electric field intensity ($E$), electric flux density ($D$), Gauss's Law, capacitance, and magnetic field ($B, H$).
  - *Cross-Subject Connections*: Direct prerequisite for `GEAS 07` (Electromagnetics) and `EST 05` (Antennas & Radiation).

### Granular Module Blueprints:
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ELEC 01-01` | **Coulomb's Law & Point Charges** | *"Force is proportional to product of charges and inversely proportional to square of distance: $F = rac{k q_1 q_2}{r^2}$."* | Scientific constant: $k = rac{1}{4\piarepsilon_0} pprox 8.9875 	imes 10^9	ext{ N}\cdot	ext{m}^2/	ext{C}^2$. | 3D Interactive Point Charge Positioner with dynamic electric field lines. | `GEAS-07` Gauss Law in free space. |
| `ELEC 01-02` | **Electric Field ($E$) & Potential ($V$)** | *"Electric field points in direction of maximum potential drop ($E = -
abla V$); potential is work done per unit charge."* | Line and point charge potential superposition. | Equipotential surface and electric field vector field map. | `GEAS-07` Gradient of scalar potential. |
| `ELEC 01-03` | **Capacitance & Dielectrics** | *"Capacitors oppose sudden changes in voltage; adding a dielectric multiplies capacitance by $\kappa$ and reduces $E$."* | Parallel plate capacitance $C = rac{arepsilon_0 arepsilon_r A}{d}$. | Capacitor plate spacing & dielectric insertion slider. | `ELEC-05` RC Transient charging curves. |
| `ELEC 01-04` | **Magnetic Field ($B, H$) & Lorentz Force** | *"Charged particle in magnetic field experiences force perpendicular to velocity: $\mathbf{F} = q(\mathbf{E} + \mathbf{v} 	imes \mathbf{B})$."* | Right-hand rule vector cross product in `[MODE] [8]`. | Magnetic Lorentz force 3D helical particle path animator. | `GEAS-07` Maxwell's magnetic curl. |
| `ELEC 01-05` | **Inductance & Magnetic Circuits** | *"Inductors oppose sudden changes in current ($v = L rac{di}{dt}$); magnetic Ohm's law: $\mathcal{F} = \Phi \mathcal{R}$."* | Toroid / Solenoid inductance formula evaluation. | Core permeability and air gap reluctance slider. | `ELEC-04` Inductive reactance ($X_L = 2\pi f L$). |
| `ELEC 01-06` | **Electromagnetic Induction & Faraday's Law** | *"Lenz's Law: Induced EMF always opposes the change in magnetic flux that caused it ($e = -N rac{d\Phi}{dt}$)."* | Faraday induced voltage calculation in `[CALC]`. | Moving magnet through wire coil with galvanometer needle. | `ELEC-04` Transformer mutual inductance. |

---

## ELEC 02: DC Circuit Components & Basic Laws (3 Modules)
- **Key Modules**:
  - `ELEC 02-01` Conductors, Insulators & Temperature Coefficient of Resistance ($R_T = R_0[1 + lpha(T - T_0)]$).
  - `ELEC 02-02` Ohm's Law, Joule's Law & Power Dissipation ($P = VI = I^2 R = V^2/R$).
  - `ELEC 02-03` Series-Parallel Resistors, Voltage Divider & Current Divider Rules.
- **Mental Anchor**: *"Voltage divides in direct proportion to resistance ($V_x = V_s rac{R_x}{R_{eq}}$); Current divides in inverse proportion ($I_1 = I_T rac{R_2}{R_1 + R_2}$)."*
- **Notable Visualizer**: **Interactive Voltage/Current Divider Explorer** with draggable resistor values and live voltmeter/ammeter readouts.

---

## ELEC 03: DC Circuit Analysis & Network Theorems (6 Modules)
- **Key Modules**:
  - `ELEC 03-01` Kirchhoff's Current Law (KCL) & Nodal Analysis.
  - `ELEC 03-02` Kirchhoff's Voltage Law (KVL) & Mesh Analysis.
  - `ELEC 03-03` Superposition Theorem (Independent Voltage & Current Sources).
  - `ELEC 03-04` Thévenin's & Norton's Equivalent Circuits.
  - `ELEC 03-05` Maximum Power Transfer Theorem ($R_L = R_{th} \implies P_{\max} = rac{V_{th}^2}{4 R_{th}}$).
  - `ELEC 03-06` Delta-Wye ($\Delta$-Y) Conversions & Bridge Circuits.
- **Mental Anchor**: *"Thévenin replaces any linear circuit with an ideal voltage source in series with $R_{th}$; Norton replaces it with an ideal current source in parallel with $R_{N}$ ($V_{th} = I_N R_{th}$)."*
- **Speed Shortcut (Karce)**:
  - Solve 3-mesh or 3-node systems in 10 seconds using `<kbd>MODE</kbd> <kbd>5</kbd> <kbd>2</kbd>`.
- **Notable Visualizer**: **Interactive Thévenin Reduction Stepper** (Step 1: Open-circuit $V_{th}$, Step 2: Zero sources for $R_{th}$, Step 3: Load curve).

---

## ELEC 04: AC Circuit Fundamentals & Power Factor (4 Modules)
- **Key Modules**:
  - `ELEC 04-01` Sinusoidal Waveforms, Frequency, Period, RMS & Average Values ($V_{rms} = rac{V_m}{\sqrt{2}}$, $V_{avg} = rac{2V_m}{\pi}$).
  - `ELEC 04-02` Phasors, Complex Impedance ($Z = R + jX_L - jX_C$), Admittance ($Y = G + jB$).
  - `ELEC 04-03` Series & Parallel AC Circuits (RL, RC, RLC).
  - `ELEC 04-04` AC Power Triangle: Real ($P$), Reactive ($Q$), Apparent ($S$), Power Factor ($	ext{pf} = \cos	heta$) & Correction.
- **Mental Anchor**: *"CIVIL mnemonic: in a Capacitor, Current leads Voltage ($I$ leads $V$); in an Inductor, Voltage leads Current ($V$ leads $I$)."*
- **Calculator Keystrokes (Karce)**:
  - `<kbd>MODE</kbd> <kbd>2</kbd>` (CMPLX): Enter `100∠30° / (4 + 3i)` $	o$ Press `<kbd>SHIFT</kbd> <kbd>2</kbd> <kbd>3</kbd>` for polar form magnitude and phase angle.
- **Notable Visualizer**: **Interactive Power Triangle Visualizer**: Sliders for inductive load and parallel capacitor showing $Q_C$ canceling $Q_L$, rotating $S$ toward unity power factor ($	ext{pf} 	o 1.0$).

---

## ELEC 05: Transients & Resonant Circuits (5 Modules)
- **Key Modules**:
  - `ELEC 05-01` First-Order RC Transients ($v_C(t) = V_f + (V_i - V_f)e^{-t/	au}$, $	au = RC$).
  - `ELEC 05-02` First-Order RL Transients ($i_L(t) = I_f + (I_i - I_f)e^{-t/	au}$, $	au = L/R$).
  - `ELEC 05-03` Second-Order RLC Circuits (Overdamped, Critically Damped, Underdamped).
  - `ELEC 05-04` Series Resonance ($\omega_0 = rac{1}{\sqrt{LC}}$, $Z_{\min} = R$, $Q = rac{\omega_0 L}{R}$).
  - `ELEC 05-05` Parallel Resonance ($Z_{\max} = R_p$, Tank Circuit).
- **Mental Anchor**: *"Resonance occurs when inductive and capacitive reactances cancel exactly ($X_L = X_C$); at series resonance, impedance is at minimum ($R$); at parallel resonance, impedance is at maximum."*
- **Notable Visualizer**: **RLC Transient Damping Waveform Simulator**: Interactive sliders for $R, L, C$ live-morphing underdamped ringing oscillation $	o$ critically damped fastest rise $	o$ overdamped sluggish response.

---

## ELEC 06: Semiconductor Physics & Diodes (4 Modules)
- **Key Modules**:
  - `ELEC 06-01` P-N Junction Physics, Depletion Region, Barrier Potential (Si $0.7	ext{V}$, Ge $0.3	ext{V}$).
  - `ELEC 06-02` Diode Approximations, Shockley Equation ($I_D = I_S(e^{V_D/n V_T} - 1)$), Dynamic Resistance ($r_d = rac{26	ext{mV}}{I_D}$).
  - `ELEC 06-03` Rectifier Circuits: Half-Wave, Full-Wave Center-Tapped, Bridge Rectifier ($V_{dc}$, Ripple Factor, PIV).
  - `ELEC 06-04` Special Purpose Diodes: Zener Voltage Regulators, Schottky, Varactor, Photodiode, LED.
- **Mental Anchor**: *"A forward-biased silicon diode drops $0.7	ext{V}$; a Zener diode in reverse breakdown maintains a fixed voltage regardless of current."*
- **Notable Visualizer**: **Diode IV Curve Tracer & Clipper/Clamper Waveform Animator**.

---

## ELEC 07 & ELEC 08: Bipolar Junction Transistors (BJT) & Field Effect Transistors (FET)
- **Key Modules**:
  - `ELEC 07-01` BJT Construction, Modes (Cutoff, Active, Saturation), $lpha = rac{eta}{eta + 1}$.
  - `ELEC 07-02` BJT DC Biasing (Fixed, Voltage Divider Bias, Emitter Bias) & Q-Point Stability.
  - `ELEC 07-03` BJT AC Small-Signal Analysis (Common Emitter, Common Collector, Common Base).
  - `ELEC 08-01` JFET Characteristics & Shockley Equation ($I_D = I_{DSS}(1 - V_{GS}/V_P)^2$).
  - `ELEC 08-02` MOSFETs (Depletion vs. Enhancement Type, $I_D = k(V_{GS} - V_{Th})^2$).
  - `ELEC 08-03` FET Biasing (Self Bias, Voltage Divider Bias).
  - `ELEC 08-04` FET Small-Signal Amplifiers & Transconductance ($g_m$).
- **Mental Anchor**: *"BJT is a current-controlled device ($I_C = eta I_B$); FET is a voltage-controlled device with near-infinite input impedance ($I_G pprox 0$)."*
- **Notable Visualizers**:
  - **BJT DC Load Line & Q-Point Explorer**: Move $I_B$ and $R_C$ sliders to observe Q-point tracking along the load line between saturation and cutoff.
  - **JFET Transconductance Parabola Slider**: Interactive $V_{GS}$ vs $I_D$ curve demonstrating pinch-off voltage $V_P$.

---

## ELEC 09: Operational Amplifiers (Op-Amps) (3 Modules)
- **Key Modules**:
  - `ELEC 09-01` Ideal Op-Amp Characteristics ($A_{OL} = \infty, R_{in} = \infty, R_{out} = 0, 	ext{CMRR} = \infty$) & Virtual Ground.
  - `ELEC 09-02` Inverting ($A_v = -R_f/R_1$), Non-Inverting ($A_v = 1 + R_f/R_1$), Voltage Follower, Summing Amplifier.
  - `ELEC 09-03` Integrators, Differentiators, Comparators & Schmitt Triggers.
- **Mental Anchor**: *"The Golden Rules of Op-Amps: 1. No current enters the input terminals ($I_+ = I_- = 0$); 2. In negative feedback, the op-amp forces the inputs to have equal voltage ($V_+ = V_-$)."*
- **Notable Visualizer**: **Virtual Op-Amp Laboratory**: Drag resistor sliders to see live inverting/non-inverting waveforms with saturation clipping.

---

## ELEC 10 to ELEC 15: Specialized Electronics
- **Key Modules**:
  - `ELEC 10` Power Amplifiers (Class A, B, AB, C, D efficiency: Class A $\le 25\%/50\%$, Class B $\le 78.5\%$, Class C $> 90\%$).
  - `ELEC 11` Feedback & Oscillators (Barkhausen criterion: $Aeta = 1ngle 0^\circ$, RC Phase Shift, Wien Bridge, Hartley, Colpitts, Crystal).
  - `ELEC 12` Thyristors & Industrial Devices (SCR, TRIAC, DIAC, UJT, Optoisolators).
  - `ELEC 13` Electronic Instrumentation (D'Arsonval meter shunts, Voltmeter sensitivity $\Omega/	ext{V}$, Digital multimeters, Oscilloscopes).
  - `ELEC 14` Frequency Response & Filters (Bode plots, $-3	ext{dB}$ cutoff frequency, Butterworth/Chebyshev active filters).
  - `ELEC 15` Digital Electronics & Logic Gates (Boolean simplification, De Morgan's Laws, 4-variable Karnaugh Maps, Multiplexers, Flip-Flops, Counters).
- **Notable Visualizers**:
  - **4-Variable Karnaugh Map Loop Grouper**: Click minterms on a $4 	imes 4$ grid to see optimal rectangular grouping loops and minimal Boolean output.
  - **Bode Plot Gain & Phase Margin Explorer**: Real-time frequency response curve with adjustable poles and zeros.
