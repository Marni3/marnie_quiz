---
description: Create a 15 to 20-item qualitative, conceptual reasoning and proportionality test set based on the 8 PRC Board Exam Cognitive Archetypes
---

# Conceptual Reasoning & Qualitative Drill Workflow (15–20 Items)

This workflow defines the procedure for creating a **Qualitative & Conceptual Reasoning Drill** (`conceptual_drill`) for the Philippine ECE Board Exam. These exams test deep physical intuition, dimensional analysis, scaling laws, asymptotic limits, and functional variation without relying on plug-and-chug numerical computation.

---

## 1. Objectives & Scope
- **Item Count**: 15 to 20 multiple-choice questions.
- **Pedagogical Tier**: `conceptual_drill` (or `drill` with qualitative focus).
- **Core Intent**: Test theoretical mechanics, proportionalities, boundary behavior, and counter-intuitive phenomena emphasized by PRC board examiners to assess true conceptual mastery.
- **Source of Truth**: Reference lecture notes in `Reference Documents/<Subject>/` and schema standards in [schema-output.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/schema-output.md).

---

## 2. The 8 Conceptual Reasoning Archetypes

Every conceptual exam must draw questions across these 8 distinct reasoning patterns:

### 1. Scaling Laws & Proportionality (Laws of Variation)
- **Pattern**: Dimensional scaling, inverse-square relationships, constant-volume deformation, power-law dependencies ($y \propto x^n$, $y \propto 1/\sqrt{x}$).
- **Example**: *"If the radius of a cylindrical conductor is halved while its length is stretched to keep volume constant, its resistance increases by a factor of:"* $\to$ **16** ($R \propto L/r^2 \propto 1/r^4$).

### 2. Boundary & Asymptotic Limiting Conditions
- **Pattern**: System response as parameters approach extreme limits ($f \to 0$ or $f \to \infty$, $R \to 0$ short vs $R \to \infty$ open, $t \to 0^+$ vs $t \to \infty$, temperature $T \to 0\text{ K}$).
- **Example**: *"In an ideal parallel LC tank circuit at resonant frequency, the net impedance presented to the driving source approaches:"* $\to$ **$\infty$ (Open Circuit)**.

### 3. Qualitative Phase, Directionality & Sign Relationships
- **Pattern**: Leading/lagging relationships, Lenz's law polarities, transistor phase inversions ($180^\circ$ CE vs $0^\circ$ CB/CC), root locus trajectory departures, signs of derivative/curvature ($f' > 0, f'' < 0$).
- **Example**: *"In a common-emitter BJT amplifier with an unbypassed emitter resistor, the voltage gain and phase shift between input and output are respectively:"* $\to$ **Decreased gain, $180^\circ$ phase inversion**.

### 4. Circuit & System Fault / Topology Modification Analysis
- **Pattern**: Predicting cascading voltage/current shifts when a component fails open, shorts, or when feedback topology changes (positive vs negative feedback).
- **Example**: *"In a standard voltage-divider BJT bias network, if the lower divider resistor $R_2$ opens, the transistor will most likely move into which operating region?"* $\to$ **Saturation ($V_B$ rises toward $V_{CC}$)**.

### 5. Thermodynamic, Material & Quantum Transitions
- **Pattern**: Doping concentration vs carrier mobility, Fermi level shifts with temperature, stress-strain elastic limit vs yield strength, magnetic hysteresis and saturation.
- **Example**: *"As the temperature of an intrinsic semiconductor increases, its electrical conductivity increases primarily because:"* $\to$ **Thermal generation of electron-hole pairs exponentially increases intrinsic carrier concentration $n_i$**.

### 6. Information Theory, Modulation & Protocol Trade-offs (EST)
- **Pattern**: Fundamental trade-offs (Shannon capacity: SNR vs Bandwidth, BER vs constellation order in M-QAM, optical dispersion vs fiber length).
- **Example**: *"In a communication channel with fixed capacity $C$, doubling the available bandwidth allows the required Signal-to-Noise Ratio (SNR) to be:"* $\to$ **Reduced exponentially according to $C = B \log_2(1 + \text{SNR})$**.

### 7. Theorem Invariants & Conservation Duality
- **Pattern**: Thevenin/Norton duality, Maximum Power Transfer condition efficiency ($50\%$), Conservation of Energy vs Charge distribution, Vector Calculus identities ($\nabla \times (\nabla \phi) = 0$).
- **Example**: *"When a linear circuit transfers maximum power to a resistive load $R_L = R_{TH}$, the operational efficiency of power transfer is exactly:"* $\to$ **50% (half dissipated internally in $R_{TH}$)**.

### 8. Counter-Intuitive Traps & Fallacy Dissection
- **Pattern**: Questions where common naive intuition fails due to overlooked non-linear or multi-variable constraints.
- **Example**: *"A capacitor $C$ is charged from a constant voltage source $V$ through a series resistor $R$. The percentage of total energy supplied by the source that is dissipated as heat in $R$ depends on:"* $\to$ **Neither $R$ nor $C$ (always exactly 50% dissipated regardless of resistance value)**.

---

## 3. Authoring Guidelines & Explanation Standards

1. **No Superfluous Computation**: Keep options symbolic, fractional, or qualitative (e.g., *"Doubled"*, *"Halved"*, *"Quadrupled"*, *"Remains unchanged"*).
2. **Derivation Shortcut in Explanations**:
   - Every explanation must start with the **Governing Physical Law / Equation**.
   - Show the **Ratio Method** (e.g. $\frac{R_2}{R_1} = \frac{L_2}{L_1} \cdot \frac{A_1}{A_2} = (2) \cdot (4) = 8$).
   - Explicitly call out the **PRC Trap**: Why common intuition leads to incorrect choices.
3. **Strict CSV Schema Compliance**:
   - Wrap all cells in double quotes.
   - Use `\n` for linebreaks in explanations.
   - Format all symbols and equations with standard LaTeX (`$R \propto 1/A$`, `$\omega_0 = 1/\sqrt{LC}$`).

---

## 4. File Naming Convention
Follow [naming_convention_specification.md](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/naming_convention_specification.md):
- Code: `<SUBJ> <TOPIC_NUM> - <Topic Name> • Conceptual Drill (Set <NUM>).csv`
- Example: `Elec 03 - DC Circuits • Conceptual Drill (Set 01).csv`
