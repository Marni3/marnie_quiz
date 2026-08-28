# Electronics (ELECS) — 1-to-1 Decoupled Master Learning Module Plan

## Architecture & Blueprint Overview

This document provides the exhaustive, 1-to-1 architectural master plan for all **Electronics (Circuits & Devices)** learning modules in the platform. Every module is grounded directly in the review center reference lecture notes (`test-sets/Reference Documents/Elecs/`), structured under the pedagogical guidelines defined in [`SKILL.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/.agents/skills/learning-module-authoring/SKILL.md) and [`MODULE_RESTRUCTURING_AND_PEDAGOGICAL_REFINEMENT_GUIDE.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/Reference%20Documents/MODULE_RESTRUCTURING_AND_PEDAGOGICAL_REFINEMENT_GUIDE.md).

### Decoupling & Mastery Challenge Structure
1. **Decoupled Architecture**: Learning modules are independent, deep-dive didactic instructional units (`/learn/[moduleId]`), decoupled from the 190 syllabus practice question sets in the `/quizzes` library.
2. **Module-Exclusive Mastery Challenge Sets**: Each module is paired with a dedicated, exclusive companion mastery test set accessible directly from the module view.
3. **Micro-Reinforcement Cycle**:
   $$\text{Prerequisite Bridge} \longrightarrow \text{Atomic Definitions} \longrightarrow \text{Lesson Proper Block} \longrightarrow \text{In-Line Concept Checks (5–10 MCQs)} \longrightarrow \text{Dual-Method Sample} \longrightarrow \text{Calculator Technique} \longrightarrow \text{Exclusive Mastery Challenge}$$
4. **Calculator Model Coverage**: Karce KC-S991 & Canon F-789SGA keystroke workflows (`CMPLX` mode, `EQN` matrices, parallel resistor shortcuts).

---

## Unit 1: DC Circuit Analysis & Network Theorems

### Module ELECS-01: DC Fundamentals, Ohm's Law & Resistance Physics
- **Source Reference**: `Notes - DC Circuit 1.pdf`
- **Prerequisite Bridge**: Connects atomic charge structure (GEAS Physics/Chemistry) to macroscopic current flow, voltage drop, and Joule heating in electronic components.
- **Atomic Definitions**:
  - **Electric Circuit**: A system of conductors providing a closed path for current flow upon application of voltage. Common conductors: silver, copper, aluminum.
  - **Types of Current**:
    - **Direct Current (DC / Continuous Current)**: Unidirectional energy transfer.
      - **Continuous DC**: Produced by chemical batteries/cells.
      - **Unidirectional DC**: Derived from DC generators (contains commutator ripple).
      - **Pulsating DC**: Produced by rectifier circuits (half-wave / full-wave).
    - **Alternating Current (AC)**: Periodically reverses direction and magnitude.
  - **Current Flow Conventions**:
    - **Conventional Current Flow**: Positive to negative ($+$ to $-$), from higher potential to lower potential (standard engineering convention).
    - **Electron Flow**: Negative to positive (actual physical drift of electrons).
  - **Ohm's Law (Georg Simon Ohm 1826)**:
    $$V = I R \iff I = \frac{V}{R} \iff R = \frac{V}{I}$$
    - Valid strictly when conductor temperature remains constant.
  - **Electrical Power & Joule's Law (James Prescott Joule 1818–1889)**:
    $$P = \frac{W}{t} = \frac{Q E}{t} = E I = I^2 R = \frac{E^2}{R}$$
    - Units: Watt ($\text{W} = 1\text{ J/s} = 1\text{ V}\cdot\text{A}$, named after James Watt 1736–1819). Horsepower: $1\text{ hp} = 746\text{ W}$.
    - Joule's Law Statement: "Electrical power dissipated in a resistor is directly proportional to the square of current and resistance ($P \propto I^2$)."
  - **Resistance ($R$) & Temperature Coefficient ($\alpha$)**:
    $$R = \rho \frac{L}{A}, \quad R_2 = R_1 [1 + \alpha_1 (T_2 - T_1)] = R_1 \left(\frac{T + T_2}{T + T_1}\right)$$
    where $T_{\text{copper}} = 234.5^\circ\text{C}, T_{\text{aluminum}} = 236^\circ\text{C}$. Circular Mil: $A_{\text{cmil}} = d_{\text{mils}}^2$.
  - **Battery Capacity & Ampacity**:
    - **Ampere-Hour (Ah)**: Product of current in amperes and discharge time in hours ($5\text{ A} \times 20\text{ h} = 100\text{ Ah}$).
    - **Ampacity**: Maximum continuous current a conductor can carry before progressive thermal deterioration.
- **In-Line Concept Checks**: 8 MCQs on DC source types (continuous vs pulsating), electron flow direction, horsepower conversion, and Joule heating.
- **Sample Problems**:
  - *Problem*: A copper wire has a resistance of $5.0\,\Omega$ at $20^\circ\text{C}$. What is its resistance at $75^\circ\text{C}$? ($T = 234.5^\circ\text{C}$).
  - *Academic Derivation*: $R_{75} = 5.0 \times \left(\frac{234.5 + 75}{234.5 + 20}\right) = 5.0 \times \frac{309.5}{254.5} = 6.08\,\Omega$.
  - *⚡ Board Exam Shortcut*: Ratio method directly in calculator: $5 \times \frac{309.5}{254.5} = 6.08\,\Omega$.
- **Calculator Technique**: `CALC` mode for evaluating multi-temperature resistance ratios.
- **Exclusive Mastery Challenge Set**: 25 questions covering Ohm's law, wire sizing, resistivity, and temperature effects.

---

### Module ELECS-02: Series-Parallel Networks, Dividers & Circuit Topology
- **Source Reference**: `Notes - DC Circuit 2.pdf`
- **Prerequisite Bridge**: Extends fundamental component properties to multi-resistor network topologies, voltage division, and current splitting.
- **Atomic Definitions**:
  - **Series Resistors**: Connected end-to-end carrying identical current ($I_{\text{total}} = I_1 = I_2 = \dots$):
    $$R_{\text{eq}} = R_1 + R_2 + \dots + R_n, \quad E = V_1 + V_2 + \dots + V_n, \quad P_T = P_1 + P_2 + \dots + P_n$$
  - **Parallel Resistors**: Connected across same potential difference ($V_{\text{total}} = V_1 = V_2 = \dots$):
    $$\frac{1}{R_{\text{eq}}} = \frac{1}{R_1} + \frac{1}{R_2} + \dots + \frac{1}{R_n}, \quad I_T = I_1 + I_2 + \dots + I_n$$
  - **Voltage Divider Rule (VDR)**: Voltage across resistor $R_x$ in a series string:
    $$V_1 = E \left(\frac{R_1}{R_1 + R_2}\right), \quad V_2 = E \left(\frac{R_2}{R_1 + R_2}\right)$$
  - **Current Divider Rule (CDR)**: Current through branch $R_1$ in parallel with $R_2$:
    $$I_1 = I_T \left(\frac{R_2}{R_1 + R_2}\right), \quad I_2 = I_T \left(\frac{R_1}{R_1 + R_2}\right)$$
  - **Network Topology Terms**:
    - **Branch ($b$)**: A single element such as a voltage source or resistor.
    - **Node ($n$)**: Point of connection between two or more branches.
    - **Loop ($l$)**: Any closed path in a circuit.
    - **Mesh**: A loop that does not contain any other loops within it.
    - **Fundamental Theorem of Network Topology**:
      $$b = l + n - 1$$
- **In-Line Concept Checks**: 8 MCQs on CDR/VDR formulas, ladder network reduction, and graph topology equations ($b = l + n - 1$).
- **Sample Problems**:
  - *Problem*: Find the current in a $6\,\Omega$ resistor connected in parallel with a $12\,\Omega$ resistor, supplied by a $9\text{ A}$ source.
  - *⚡ Board Exam Shortcut*: $I_6 = 9 \times \frac{12}{6 + 12} = 9 \times \frac{12}{18} = 6\text{ A}$.
- **Calculator Technique**: Parallel resistor reciprocal shortcut `[R1^-1 + R2^-1]^-1`.
- **Exclusive Mastery Challenge Set**: 25 questions testing series-parallel reduction, bridge networks, and CDR/VDR calculations.

---

### Module ELECS-03: Kirchhoff's Laws, Systematic Mesh/Nodal Analysis & Theorems
- **Source Reference**: `Notes - DC Circuit 2.pdf`, `Notes - DC Circuit 3.pdf`, `Notes - DC Circuit 4.pdf`
- **Prerequisite Bridge**: Matrix-based circuit equation formulation. Connects algebraic linear systems (MATH-21) to multi-loop electrical systems.
- **Atomic Definitions**:
  - **Kirchhoff's Current Law (KCL / Conservation of Charge, Gustav Kirchhoff 1845)**:
    $$\sum I = 0 \text{ at a junction} \iff \sum I_{\text{in}} = \sum I_{\text{out}}$$
  - **Kirchhoff's Voltage Law (KVL / Conservation of Energy)**:
    $$\sum IR + \sum \text{emf} = 0 \text{ round a mesh}$$
  - **Maxwell's Loop / Mesh Current Method (James Clerk Maxwell)**: Systematic KVL around independent meshes.
  - **Nodal Method**: Formulates $n-1$ independent KCL equations with respect to a single reference node.
  - **Superposition Theorem**: Total response in linear circuit equals algebraic sum of responses from each independent source acting alone (voltage source $\to$ short, current source $\to$ open).
  - **Thévenin's Theorem (M. Léon Thévenin 1883)**: Any two-terminal linear network is equivalent to open-circuit voltage $V_{\text{Th}}$ in series with $R_{\text{Th}}$ ($R_o$).
  - **Norton's Theorem (Edward Lawry Norton 1926)**: Any two-terminal linear network is equivalent to short-circuit current $I_{\text{sc}}$ in parallel with $R_o$.
    - Source Transformation: $I_{\text{sc}} = \frac{V_{\text{Th}}}{R_{\text{Th}}}, \quad V_{\text{Th}} = I_{\text{sc}} R_{\text{Th}}$.
  - **Millman's Theorem (Parallel Generator Theorem, Jacob Millman)**:
    $$V_{ab} = \frac{\sum \frac{E_i}{R_i}}{\sum \frac{1}{R_i}} = \frac{\sum I_{\text{sc}}}{\sum G}$$
  - **Maximum Power Transfer Theorem**: Maximum power is transferred to load when $R_L = R_{\text{Th}} = r$.
    - Maximum Power: $P_{\max} = \frac{V_{\text{Th}}^2}{4 R_{\text{Th}}}$. Efficiency $\eta = 50\%$.
  - **Reciprocity Theorem**: An EMF in branch A producing current in branch B produces the exact same current in branch A if moved to branch B.
  - **Compensation Theorem**: A resistance $R$ in a branch carrying current $I$ may be replaced by an opposing voltage source $V = IR$.
- **In-Line Concept Checks**: 10 MCQs on deactivating sources, Thévenin open-circuit calculations, Reciprocity theorem, and Millman voltage solutions.
- **Sample Problems**:
  - *Problem*: A circuit has $V_{\text{Th}} = 24\text{ V}$ and $R_{\text{Th}} = 6\,\Omega$. What is the maximum power that can be transferred to a variable load resistor $R_L$?
  - *⚡ Board Exam Shortcut*: $P_{\max} = \frac{V_{\text{Th}}^2}{4 R_{\text{Th}}} = \frac{24^2}{4 \times 6} = \frac{576}{24} = 24\text{ W}$ when $R_L = 6\,\Omega$.
- **Calculator Technique**: `MODE 5 -> 1` (2x2) and `MODE 5 -> 2` (3x3) Linear Equation Solvers for mesh/nodal matrices.
- **Exclusive Mastery Challenge Set**: 25 questions testing Thévenin/Norton equivalents, mesh/nodal matrix equations, and Millman's theorem.

---

### Module ELECS-04: Delta-Wye Transformations & Bridge Networks
- **Source Reference**: `Notes - DC Circuit 4.pdf`
- **Prerequisite Bridge**: 3-terminal network equivalence. Essential for solving non-reducible bridge circuits, 3-phase power grids, and balanced/unbalanced loads.
- **Atomic Definitions**:
  - **Delta ($\Delta$ / $\Pi$) to Wye ($\text{Y}$ / $\text{T}$) Transformation**:
    $$R_Y = \frac{\text{Product of adjacent } R \text{ in } \Delta}{\sum \text{of all } R \text{ in } \Delta}$$
    $$x = \frac{AB}{A+B+C}, \quad y = \frac{BC}{A+B+C}, \quad z = \frac{AC}{A+B+C}$$
    - Balanced Case ($A=B=C=R_\Delta$): $R_Y = \frac{R_\Delta}{3}$.
  - **Wye ($\text{Y}$ / $\text{T}$) to Delta ($\Delta$ / $\Pi$) Transformation**:
    $$R_\Delta = \frac{\sum \text{of cross products in } Y}{\text{Opposite } R \text{ in } Y}$$
    $$A = \frac{xy+yz+xz}{y}, \quad B = \frac{xy+yz+xz}{z}, \quad C = \frac{xy+yz+xz}{x}$$
    - Balanced Case ($x=y=z=R_Y$): $R_\Delta = 3 R_Y$.
  - **Wheatstone Bridge Circuit**:
    - Balanced Condition (zero detector current): $R_1 R_4 = R_2 R_3 \iff \frac{R_1}{R_2} = \frac{R_3}{R_4}$.
    - Unknown Resistance: $R_x = R_3 \left(\frac{R_2}{R_1}\right)$.
- **In-Line Concept Checks**: 8 MCQs on Delta-Wye balanced scaling ($3\times$ vs $1/3$), bridge balance conditions, and converting bridge arms.
- **Sample Problems**:
  - *Problem*: Three identical $30\,\Omega$ resistors are connected in Delta. What is the equivalent resistance of each branch in Wye?
  - *⚡ Board Exam Shortcut*: $R_Y = \frac{R_\Delta}{3} = \frac{30}{3} = 10\,\Omega$.
- **Calculator Technique**: Storing intermediate numerator $\Sigma(R_i R_j)$ in calculator memory `M` for fast 3-arm Delta conversions.
- **Exclusive Mastery Challenge Set**: 25 questions testing Delta-Wye conversions, bridge balancing, and unbalanced network reduction.

---

## Unit 2: Single-Phase AC Circuits & Power Analysis

### Module ELECS-05: AC Waveforms, Phasors & Pure AC Loads
- **Source Reference**: `Notes - AC Circuit 1.pdf`
- **Prerequisite Bridge**: Sinusoidal functions (MATH-08) and complex phasors (MATH-20) applied to time-varying voltages and currents.
- **Atomic Definitions**:
  - **Alternating Current (AC)**: Electric current whose magnitude and direction vary cyclically over time.
  - **Sine Wave Equation & Parameters**:
    $$v(t) = V_m \sin(\omega t \pm \theta)$$
    - Peak Amplitude ($V_m$): Maximum instantaneous value reached during cycle.
    - Peak-to-Peak ($V_{p-p}$): $V_{p-p} = 2 V_m$.
    - Frequency ($f$): Cycles per second, measured in Hertz ($\text{Hz}$), $f = 1/T$.
    - Angular Frequency ($\omega$): $\omega = 2\pi f = \frac{2\pi}{T}$ ($\text{rad/s}$).
    - Phase Angle ($\theta$): Angular shift relative to time origin ($t=0$).
  - **Average Value ($V_{\text{avg}}$)**: Area under half-cycle divided by $\pi$:
    $$V_{\text{avg}} = \frac{1}{\pi}\int_0^\pi V_m \sin\theta d\theta = \frac{2}{\pi}V_m \approx 0.6366 V_m$$
  - **Effective / Root-Mean-Square (RMS) Value ($V_{\text{rms}}$)**: The equivalent DC voltage that produces identical average heating in a resistor:
    $$V_{\text{rms}} = \sqrt{\frac{1}{2\pi}\int_0^{2\pi} [V_m \sin\theta]^2 d\theta} = \frac{V_m}{\sqrt{2}} \approx 0.7071 V_m$$
  - **Waveform Factor Metrics**:
    - **Form Factor ($k_f$)**: Ratio of RMS value to average value:
      $$k_f = \frac{V_{\text{rms}}}{V_{\text{avg}}} = \frac{V_m/\sqrt{2}}{2V_m/\pi} = \frac{\pi}{2\sqrt{2}} \approx 1.1107 \quad (\text{for pure sine wave})$$
    - **Peak / Crest Factor ($k_p$)**: Ratio of peak value to RMS value:
      $$k_p = \frac{V_m}{V_{\text{rms}}} = \frac{V_m}{V_m/\sqrt{2}} = \sqrt{2} \approx 1.4142 \quad (\text{for pure sine wave})$$
  - **Passive Elements under Pure AC Excitation**:
    - **Pure Resistance ($R$)**: Voltage and current are strictly in phase ($\theta = 0^\circ$). Impedance $\mathbf{Z} = R\angle 0^\circ = R + j0$.
    - **Pure Inductance ($L$)**: Voltage leads current by $90^\circ$ ($\pi/2\text{ rad}$) — mnemonic **ELI**:
      $$\text{Inductive Reactance: } X_L = \omega L = 2\pi f L \quad (\Omega), \quad \mathbf{Z}_L = j X_L = X_L \angle 90^\circ$$
    - **Pure Capacitance ($C$)**: Current leads voltage by $90^\circ$ ($\pi/2\text{ rad}$) — mnemonic **ICE**:
      $$\text{Capacitive Reactance: } X_C = \frac{1}{\omega C} = \frac{1}{2\pi f C} \quad (\Omega), \quad \mathbf{Z}_C = -j X_C = X_C \angle -90^\circ$$
- **In-Line Concept Checks**: 8 MCQs on RMS/average calculations, Form/Peak factors for various waves, and ELI/ICE phase relationships.
- **Sample Problems**:
  - *Problem*: An AC voltage has an instantaneous equation $v(t) = 170\sin(377t - 30^\circ)\text{ V}$. Find its RMS voltage and frequency.
  - *⚡ Board Exam Shortcut*: $V_{\text{rms}} = \frac{170}{\sqrt{2}} = 120.2\text{ V}$, $f = \frac{377}{2\pi} \approx 60\text{ Hz}$.
- **Calculator Technique**: Polar form display setup (`SETUP -> Complex -> r∠θ`).
- **Exclusive Mastery Challenge Set**: 25 questions testing AC waveform parameters, RMS/average values, and pure load reactances.

---

### Module ELECS-06: Series & Parallel AC Circuits & Resonance
- **Source Reference**: `Notes - AC Circuit 2.pdf`
- **Prerequisite Bridge**: Extends complex phasor arithmetic to combined RLC networks, impedance triangles, admittance, and resonance phenomena.
- **Atomic Definitions**:
  - **Impedance ($\mathbf{Z}$)**: Total opposition to sinusoidal current flow:
    $$\mathbf{Z} = R + jX = |\mathbf{Z}|\angle\theta \quad (\Omega)$$
    where $|\mathbf{Z}| = \sqrt{R^2 + X^2}$ and $\theta = \arctan(X/R)$.
  - **Series AC Circuits**:
    - **Series RL**: $\mathbf{Z} = R + jX_L = \sqrt{R^2 + X_L^2}\angle\arctan(X_L/R)$. Current lags voltage.
    - **Series RC**: $\mathbf{Z} = R - jX_C = \sqrt{R^2 + X_C^2}\angle-\arctan(X_C/R)$. Current leads voltage.
    - **Series RLC**: $\mathbf{Z} = R + j(X_L - X_C) = \sqrt{R^2 + (X_L - X_C)^2}\angle\arctan\left(\frac{X_L - X_C}{R}\right)$.
  - **Series Resonance ($X_L = X_C$)**:
    - Resonant Frequency:
      $$f_0 = \frac{1}{2\pi\sqrt{LC}} \quad (\text{Hz}), \quad \omega_0 = \frac{1}{\sqrt{LC}} \quad (\text{rad/s})$$
    - At Resonance: Net reactance is zero ($X = 0$), impedance is at minimum ($\mathbf{Z}_{\min} = R$), circuit is purely resistive ($\text{PF} = 1.0$), current is at maximum ($I_{\max} = V/R$).
    - Quality Factor ($Q$): $Q = \frac{\omega_0 L}{R} = \frac{1}{\omega_0 C R} = \frac{1}{R}\sqrt{\frac{L}{C}} = \frac{V_L}{V_{\text{total}}} = \frac{V_C}{V_{\text{total}}}$.
    - Bandwidth ($\text{BW}$): $\text{BW} = \frac{f_0}{Q} = f_2 - f_1$ (half-power frequencies).
  - **Admittance ($\mathbf{Y}$) in Parallel AC Circuits**:
    $$\mathbf{Y} = \frac{1}{\mathbf{Z}} = G \pm jB \quad (\text{Siemens, S} = \Omega^{-1})$$
    - **Conductance ($G$)**: $G = \frac{R}{R^2 + X^2} = \frac{R}{|\mathbf{Z}|^2}$.
    - **Susceptance ($B$)**: $B = \frac{-X}{R^2 + X^2} = \frac{-X}{|\mathbf{Z}|^2}$ (inductive is $-jB_L$, capacitive is $+jB_C$).
    - Total Parallel Admittance: $\mathbf{Y}_{\text{total}} = \mathbf{Y}_1 + \mathbf{Y}_2 + \dots + \mathbf{Y}_n$.
- **In-Line Concept Checks**: 10 MCQs on series RLC impedance calculation, resonant frequency derivation, $Q$-factor voltage magnification, and parallel admittance conversion.
- **Sample Problems**:
  - *Problem*: A series circuit has $R=10\,\Omega, L=0.1\text{ H},$ and $C=10\,\mu\text{F}$. Find its resonant frequency and quality factor.
  - *Academic Derivation*: $f_0 = \frac{1}{2\pi\sqrt{0.1 \times 10 \times 10^{-6}}} = \frac{1}{2\pi\sqrt{10^{-6}}} = \frac{1000}{2\pi} \approx 159.15\text{ Hz}$.
    $Q = \frac{1}{R}\sqrt{\frac{L}{C}} = \frac{1}{10}\sqrt{\frac{0.1}{10^{-5}}} = \frac{1}{10}\sqrt{10000} = \frac{100}{10} = 10$.
- **Calculator Technique**: Complex vector arithmetic in `MODE 2` (CMPLX) `10 + 5i - 8i` -> `r∠θ`.
- **Exclusive Mastery Challenge Set**: 25 questions testing series/parallel RLC circuits, admittance conversions, and resonance bandwidth.

---

### Module ELECS-07: AC Power Triangle, Power Factor Correction & Non-Sinusoidal Waves
- **Source Reference**: `Notes - AC Circuit 3.pdf`
- **Prerequisite Bridge**: Vectorial energy balance in AC systems. Directly applies to electrical billing, transformer ratings, and power supply design.
- **Atomic Definitions**:
  - **Active / Real / True Power ($P$)**: Rate of energy dissipated in resistive elements:
    $$P = V_{\text{rms}} I_{\text{rms}} \cos\theta = I^2 R = \text{Re}(\mathbf{S}) \quad (\text{Unit: Watt, W / kW / MW})$$
  - **Reactive Power ($Q$)**: Rate of energy stored and returned by reactive elements:
    $$Q = V_{\text{rms}} I_{\text{rms}} \sin\theta = I^2 X = \text{Im}(\mathbf{S}) \quad (\text{Unit: Volt-Ampere Reactive, VAR / kVAR})$$
  - **Apparent Power ($S$)**: Total volt-ampere capacity delivered to the circuit:
    $$S = V_{\text{rms}} I_{\text{rms}} = \sqrt{P^2 + Q^2} = I^2 |\mathbf{Z}| \quad (\text{Unit: Volt-Ampere, VA / kVA})$$
  - **Complex Power ($\mathbf{S}$)**:
    $$\mathbf{S} = \mathbf{V}_{\text{rms}} \mathbf{I}_{\text{rms}}^* = P + jQ = S\angle\theta$$
  - **Power Factor ($\text{PF}$)**: Ratio of real power to apparent power:
    $$\text{PF} = \cos\theta = \frac{P}{S} = \frac{R}{|\mathbf{Z}|} \quad (0 \le \text{PF} \le 1)$$
    - **Lagging PF**: Current lags voltage ($\theta > 0$, Inductive load, $Q > 0$).
    - **Leading PF**: Current leads voltage ($\theta < 0$, Capacitive load, $Q < 0$).
  - **Reactive Factor ($\text{RF}$)**:
    $$\text{RF} = \sin\theta = \frac{Q}{S} = \frac{X}{|\mathbf{Z}|}$$
  - **Power Factor Correction**: Placing a parallel capacitor across inductive loads to raise $\text{PF}$ from $\cos\theta_1$ to $\cos\theta_2$:
    $$Q_C = P(\tan\theta_1 - \tan\theta_2) = \omega C V_{\text{rms}}^2 \implies C = \frac{P(\tan\theta_1 - \tan\theta_2)}{2\pi f V_{\text{rms}}^2}$$
  - **Non-Sinusoidal / Complex Waveforms (RMS & Average Formulas)**:
    - **Symmetrical Trapezoid**:
      $$V_{\text{rms}} = \frac{a + 0.577(b-a)}{b} V_p, \quad |V_{\text{avg}}| = \frac{a+b}{2b} V_p$$
    - **DC Pulse** (pulse width $a$, period $b$):
      $$|V_{\text{rms}}| = V_p \sqrt{\frac{a}{b}}, \quad |V_{\text{avg}}| = V_p \left(\frac{a}{b}\right)$$
    - **Triangular or Sawtooth Wave**:
      $$V_{\text{rms}} = \frac{V_p}{\sqrt{3}} \approx 0.577 V_p, \quad |V_{\text{avg}}| = 0.500 V_p$$
    - **Sine Wave on DC Level ($V_{\text{dc}} + V_p \sin\omega t$)**:
      $$V_{\text{rms}} = \sqrt{V_{\text{dc}}^2 + \frac{V_p^2}{2}}$$
    - **Square Wave**:
      $$V_{\text{rms}} = V_p, \quad |V_{\text{avg}}| = V_p$$
    - **White Noise**:
      $$V_{\text{rms}} \approx \frac{1}{4} V_p = 0.25 V_p$$
    - **General Harmonics Waveform**:
      $$V_{\text{total, rms}} = \sqrt{V_{\text{dc}}^2 + V_{1,\text{rms}}^2 + V_{2,\text{rms}}^2 + \dots + V_{n,\text{rms}}^2}$$
- **In-Line Concept Checks**: 8 MCQs on power triangle relationships, calculating capacitor kVAR for unity power factor, and complex harmonic RMS evaluation.
- **Sample Problems**:
  - *Problem*: A single-phase motor draws $5\text{ kW}$ at a lagging power factor of $0.8$ from a $220\text{ V}, 60\text{ Hz}$ supply. Find the reactive power and apparent power.
  - *⚡ Board Exam Shortcut*: $\theta = \arccos(0.8) \approx 36.87^\circ$.
    $S = \frac{P}{\text{PF}} = \frac{5}{0.8} = 6.25\text{ kVA}$.
    $Q = S\sin\theta = 6.25 \times 0.6 = 3.75\text{ kVAR}$.
- **Calculator Technique**: Fast complex power multiplication `V * Conj(I)` in `MODE 2`.
- **Exclusive Mastery Challenge Set**: 25 questions testing power triangle calculations, power factor correction sizing, and harmonic RMS values.

---

## Complete Electronics Module Catalog

| Module Code | Topic Title | Source Note Reference | Companion Mastery Test ID |
| :--- | :--- | :--- | :--- |
| **ELECS-01** | DC Fundamentals, Ohm's Law & Resistance Physics | `Notes - DC Circuit 1.pdf` | `mastery-elecs-01-dc-fundamentals` |
| **ELECS-02** | Series-Parallel Networks, Dividers & Circuit Topology | `Notes - DC Circuit 2.pdf` | `mastery-elecs-02-series-parallel` |
| **ELECS-03** | Kirchhoff's Laws, Systematic Analysis & Theorems | `Notes - DC Circuit 3.pdf` | `mastery-elecs-03-theorems` |
| **ELECS-04** | Delta-Wye Transformations & Bridge Networks | `Notes - DC Circuit 4.pdf` | `mastery-elecs-04-delta-wye` |
| **ELECS-05** | AC Waveforms, Phasors & Pure AC Loads | `Notes - AC Circuit 1.pdf` | `mastery-elecs-05-ac-waveforms` |
| **ELECS-06** | Series & Parallel AC Circuits & Resonance | `Notes - AC Circuit 2.pdf` | `mastery-elecs-06-ac-resonance` |
| **ELECS-07** | AC Power Triangle, PF Correction & Harmonics | `Notes - AC Circuit 3.pdf` | `mastery-elecs-07-ac-power` |
