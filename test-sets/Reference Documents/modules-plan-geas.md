# General Engineering & Applied Sciences (GEAS) — 1-to-1 Decoupled Master Learning Module Plan

## Architecture & Blueprint Overview

This document provides the exhaustive, 1-to-1 architectural master plan for all **General Engineering and Applied Sciences (GEAS / ESAS)** learning modules in the platform. Every module is grounded directly in the review center reference lecture notes (`test-sets/Reference Documents/GEAS/`), structured under the pedagogical guidelines defined in [`SKILL.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/.agents/skills/learning-module-authoring/SKILL.md) and [`MODULE_RESTRUCTURING_AND_PEDAGOGICAL_REFINEMENT_GUIDE.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/Reference%20Documents/MODULE_RESTRUCTURING_AND_PEDAGOGICAL_REFINEMENT_GUIDE.md).

### Decoupling & Mastery Challenge Structure
1. **Decoupled Architecture**: Learning modules are independent, deep-dive didactic instructional units (`/learn/[moduleId]`), decoupled from the 190 syllabus practice question sets in the `/quizzes` library.
2. **Module-Exclusive Mastery Challenge Sets**: Each module is paired with a dedicated, exclusive companion mastery test set accessible directly from the module view.
3. **Micro-Reinforcement Cycle**:
   $$\text{Prerequisite Bridge} \longrightarrow \text{Atomic Definitions} \longrightarrow \text{Lesson Proper Block} \longrightarrow \text{In-Line Concept Checks (5–10 MCQs)} \longrightarrow \text{Dual-Method Sample} \longrightarrow \text{Calculator Technique} \longrightarrow \text{Exclusive Mastery Challenge}$$
4. **Calculator Model Coverage**: Karce KC-S991 & Canon F-789SGA keystroke workflows (scientific constants `CONST`, financial annuities `CMPD`, physical conversions `CONV`).

---

## Unit 1: General Chemistry & Atomic Theory

### Module GEAS-01: Chemistry Foundations, Scientific Method, Matter & SI Units
- **Source Reference**: `Notes - Chemistry 1.pdf`, `Notes - Chemistry 2.pdf`
- **Prerequisite Bridge**: Foundational physical science principles. Connects physical measurement accuracy to engineering experimental design.
- **Atomic Definitions**:
  - **Chemistry**: Science of matter, its properties, structure, composition, and changes it undergoes (derived from Arabic *al-kīmiyā* / Egyptian *kēme*).
  - **Branches**: Organic (carbon compounds), Inorganic, Physical (thermodynamics & quantum), Analytical (qualitative/quantitative), Biochemistry.
  - **Scientific Method**: Observation $\to$ Hypothesis $\to$ Experiment $\to$ Law (concise mathematical statement of behavior) $\to$ Theory / Model (unifying explanation).
  - **Classification of Matter**:
    - **Pure Substances**: Elements (cannot be broken down chemically) and Compounds (fixed chemical ratio of elements).
    - **Mixtures**: Homogeneous (single phase / Solutions) vs Heterogeneous (distinct phases).
  - **States of Matter**:
    - Solid (definite shape/volume), Liquid (definite volume, assumes container shape), Gas (assumes shape and volume of container).
    - **Plasma**: Ionized gas consisting of free electrons and positive ions (e.g., stars, neon signs, lightning).
    - **Bose-Einstein Condensate (BEC)**: Dilute gas of bosons cooled to near absolute zero ($0\text{ K}$), where atoms coalesce into single quantum state (Cornell, Wieman & Ketterle 1995 / predicted by Bose & Einstein 1924).
  - **Properties of Matter**:
    - **Intensive**: Independent of sample size (e.g., density, boiling point, color, refractive index, temperature).
    - **Extensive**: Dependent on sample size (e.g., mass, volume, length, internal energy, entropy).
  - **Separation Techniques**: Filtration, Distillation (simple vs fractional vs steam), Centrifugation, Chromatography, Decantation, Amalgamation, Cyanidation.
  - **SI Base Units (7 Base Quantities)**: Mass ($\text{kg}$), Length ($\text{m}$), Time ($\text{s}$), Temperature ($\text{K}$), Electric Current ($\text{A}$), Amount of Substance ($\text{mol}$), Luminous Intensity ($\text{cd}$).
  - **Measurement Metrics**:
    - Accuracy (closeness to accepted value) vs Precision (reproducibility).
    - Error & Percent Error: $\%\text{ Error} = \frac{|\text{Experimental} - \text{Accepted}|}{\text{Accepted}} \times 100\%$.
- **In-Line Concept Checks**: 8 MCQs on intensive vs extensive properties, identifying separation methods, significant figure rules, and SI base unit definitions.
- **Sample Problems**:
  - *Problem*: Classify the following properties as intensive or extensive: Density, Volume, Heat Capacity, Specific Heat, Melting Point.
  - *⚡ Board Exam Shortcut*: Specific quantities (per unit mass) and intrinsic properties (density, MP) are Intensive; total quantities (volume, heat capacity) are Extensive.
- **Calculator Technique**: Built-in SI prefixes and constant lookups (`CONST` menu).
- **Exclusive Mastery Challenge Set**: 25 questions testing matter classifications, state transitions, SI units, and error analysis.

---

### Module GEAS-02: Atomic Structure, Quantum Numbers & Historical Atomic Models
- **Source Reference**: `Notes - Chemistry 3.pdf`, `Notes - Chemistry 4.pdf`, `Notes - Chemistry 5.pdf`
- **Prerequisite Bridge**: Atomic physics foundations. Directly underpins semiconductor physics, band gaps (Electronics), and photoelectric effects.
- **Atomic Definitions**:
  - **Historical Evolution of Atomic Theory**:
    1. **Democritus (5th Century B.C.)**: *Atomos* (indivisible particle).
    2. **John Dalton (1803)**: Solid Sphere / Billiard Ball Model (Law of Multiple Proportions, Conservation of Mass).
    3. **J.J. Thomson (1897 / 1904)**: Plum Pudding Model; discovered the electron via cathode ray tube (Nobel 1906).
    4. **Ernest Rutherford (1911)**: Nuclear / Planetary Model; gold foil alpha scattering experiment; discovered positive nucleus and proton (Nobel 1908).
    5. **Niels Bohr (1913)**: Quantized Energy Level / Shell Model; electrons travel in discrete stationary orbits ($2n^2$ electrons per shell: $K=2, L=8, M=18, N=32$).
    6. **Erwin Schrödinger (1926)**: Quantum Mechanical / Electron Cloud Model; wave equation and probability orbitals.
    7. **James Chadwick (1932)**: Discovered neutral subatomic particle, the neutron (Nobel 1935).
  - **Subatomic Particles Table**:
    - Electron ($e^-$): Mass $m_e \approx 9.109 \times 10^{-31}\text{ kg} \approx 0.0005486\text{ u}$, Charge $-1.602 \times 10^{-19}\text{ C}$.
    - Proton ($p^+$): Mass $m_p \approx 1.673 \times 10^{-27}\text{ kg} \approx 1.007276\text{ u}$, Charge $+1.602 \times 10^{-19}\text{ C}$.
    - Neutron ($n^0$): Mass $m_n \approx 1.675 \times 10^{-27}\text{ kg} \approx 1.008665\text{ u}$, Charge $0$.
  - **The 4 Quantum Numbers**:
    1. **Principal Quantum Number ($n$)**: Main energy level / shell ($n = 1, 2, 3, \dots$). Maximum electrons $= 2n^2$.
    2. **Azimuthal / Angular Momentum Quantum Number ($l$)**: Subshell / shape ($l = 0, 1, \dots, n-1$).
       - $l=0 \implies s$ (spherical, 1 orbital, max 2 $e^-$).
       - $l=1 \implies p$ (dumbbell, 3 orbitals, max 6 $e^-$).
       - $l=2 \implies d$ (cloverleaf, 5 orbitals, max 10 $e^-$).
       - $l=3 \implies f$ (complex, 7 orbitals, max 14 $e^-$).
    3. **Magnetic Quantum Number ($m_l$)**: Spatial orientation of orbital ($m_l = -l, \dots, 0, \dots, +l$).
    4. **Spin Quantum Number ($m_s$)**: Intrinsic electron spin angular momentum ($m_s = +1/2$ [spin-up] or $-1/2$ [spin-down]).
  - **Quantum Rules**:
    - **Aufbau Principle**: Electrons fill lowest energy orbitals first ($1s < 2s < 2p < 3s < 3p < 4s < 3d \dots$).
    - **Pauli Exclusion Principle (Wolfgang Pauli 1925)**: No two electrons in an atom can have the exact same set of 4 quantum numbers.
    - **Hund's Rule of Maximum Multiplicity**: Orbitals of equal energy are each occupied by one electron before pairing occurs.
- **In-Line Concept Checks**: 8 MCQs on valid sets of quantum numbers, subshell electron capacities, and atomic model chronological order.
- **Sample Problems**:
  - *Problem*: What is the maximum number of electrons that can occupy the principal energy level $n=3$?
  - *⚡ Board Exam Shortcut*: $2n^2 = 2(3^2) = 2(9) = 18\text{ electrons}$.
- **Exclusive Mastery Challenge Set**: 25 questions testing atomic discoveries, quantum numbers, and electron configurations.

---

### Module GEAS-03: Periodic Table, Periodic Trends, Compounds & Nomenclature
- **Source Reference**: `Notes - Chemistry 6.pdf`, `Notes - Chemistry 7.pdf`
- **Prerequisite Bridge**: Chemical periodicity and valence bonding. Essential for material dopants in semiconductors (Elecs) and corrosion mechanics.
- **Atomic Definitions**:
  - **Development of the Periodic Table**:
    - John Newlands (1864): Law of Octaves (properties repeat every 8th element).
    - Dmitri Mendeleev (1869) & Lothar Meyer: Arranged by increasing atomic mass (Mendeleev predicted missing elements like Ga, Ge).
    - Henry Moseley (1913): Discovered atomic number ($Z$, number of protons) is the true organizing fundamental property.
  - **Periodic Law**: When elements are arranged in order of increasing atomic number, their physical and chemical properties exhibit periodic recurrence.
  - **Periodic Table Structure**:
    - **Periods**: 7 horizontal rows (represent principal energy level $n$).
    - **Groups / Families**: 18 vertical columns (elements have identical valence electron configurations):
      - Group 1A: Alkali Metals (except H; $ns^1$, highly reactive).
      - Group 2A: Alkaline Earth Metals ($ns^2$).
      - Group 3A–6A: Boron, Carbon, Nitrogen (Pnictogens), Chalcogens (Oxygen family).
      - Group 7A: Halogens ($ns^2 np^5$, salt formers).
      - Group 8A: Noble / Inert Gases ($ns^2 np^6$, full octet).
      - Transition Metals (d-block) & Inner Transition Metals (Lanthanides $Z=57\text{--}71$ and Actinides $Z=89\text{--}103$, radioactive).
  - **Periodic Trends**:
    - **Atomic Radius**: Increases down a group, decreases across a period (left to right).
    - **Ionization Energy & Electron Affinity**: Decreases down a group, increases across a period.
    - **Electronegativity (Linus Pauling Scale)**: Ability of an atom to attract shared electrons. Most electronegative: **Fluorine ($4.0$)**; least: **Francium ($0.7$) / Cesium**.
  - **Molecules vs Compounds**:
    - Molecule: Two or more atoms chemically combined (can be homonuclear $O_2, N_2, Cl_2$ or heteronuclear).
    - Compound: Two or more *different* elements in fixed stoichiometric ratio.
    - **Ionic Compounds**: Cation (+) + Anion (-); electrostatic attraction, high melting point, conductive when molten/aqueous.
    - **Covalent / Molecular Compounds**: Non-metal + Non-metal; shared electron pairs.
  - **Isotopes & Allotropes**:
    - **Isotopes**: Atoms of same element (same $Z$) with different mass numbers ($A$, different neutrons). Hydrogen isotopes: Protium ($^1_1\text{H}$), Deuterium ($^2_1\text{H}$), Tritium ($^3_1\text{H}$, radioactive).
    - **Allotropes**: Distinct structural forms of the same element in the same physical state (e.g., Carbon: Diamond, Graphite, Graphene, Fullerene; Oxygen: $O_2$ vs Ozone $O_3$).
- **In-Line Concept Checks**: 8 MCQs on electronegativity ordering, identifying group families, isotope mass numbers, and allotrope vs isotope distinction.
- **Sample Problems**:
  - *Problem*: Which element has the highest electronegativity on the Pauling scale?
  - *⚡ Board Exam Shortcut*: Fluorine ($F = 4.0$).
- **Exclusive Mastery Challenge Set**: 25 questions testing periodic trends, electron configurations, and chemical nomenclature.

---

### Module GEAS-04: Mole Concept, Stoichiometry, Chemical Reactions & Gas Laws
- **Source Reference**: `Notes - Chemistry 8.pdf`, `Notes - Chemistry 9.pdf`
- **Prerequisite Bridge**: Quantitative mass-mole relationships and ideal gas behaviors. Bridges directly to thermodynamics and combustion engineering.
- **Atomic Definitions**:
  - **Mole ($\text{mol}$)**: Amount of substance containing as many elementary entities as atoms in exactly $12\text{ g}$ of pure Carbon-12:
    $$1\text{ mole} = N_A = 6.02214076 \times 10^{23}\text{ particles} \quad (\text{Avogadro's Number, Amedeo Avogadro})$$
  - **Molar Mass ($M$)**: Mass of 1 mole of a substance in $\text{g/mol}$. $1\text{ u} = 1\text{ amu} = 1\text{ Da} = 1\text{ g/mol} = 1.66054 \times 10^{-27}\text{ kg}$.
  - **Empirical vs Molecular Formula**:
    - Empirical Formula: Simplest whole-number ratio of atoms in compound.
    - Molecular Formula: Actual number of atoms: $\text{Molecular Formula} = (\text{Empirical Formula})_n$, $n = \frac{\text{Molar Mass}}{\text{Empirical Mass}}$.
  - **Percent Composition by Mass**:
    $$\% \text{ Element} = \frac{\text{Total mass of element in compound}}{\text{Molar mass of compound}} \times 100\%$$
  - **Fundamental Gas Laws**:
    - **Boyle's Law (Robert Boyle 1662)**: Constant $T \implies P_1 V_1 = P_2 V_2$.
    - **Charles's Law (Jacques Charles 1787)**: Constant $P \implies \frac{V_1}{T_1} = \frac{V_2}{T_2}$ ($T$ in Kelvin).
    - **Gay-Lussac's / Amontons' Law**: Constant $V \implies \frac{P_1}{T_1} = \frac{P_2}{T_2}$.
    - **Combined / General Gas Law**:
      $$\frac{P_1 V_1}{T_1} = \frac{P_2 V_2}{T_2}$$
    - **Ideal Gas Law**:
      $$P V = n R T = \frac{m}{\text{MW}} R T$$
      where $R = 0.08206\text{ L}\cdot\text{atm}/(\text{mol}\cdot\text{K}) = 8.314\text{ J}/(\text{mol}\cdot\text{K}) = 62.36\text{ L}\cdot\text{mmHg}/(\text{mol}\cdot\text{K})$.
    - **Dalton's Law of Partial Pressures (John Dalton)**: $P_{\text{total}} = P_1 + P_2 + \dots + P_n$, $P_i = X_i P_{\text{total}}$.
    - **Graham's Law of Effusion (Thomas Graham)**: $\frac{\text{Rate}_A}{\text{Rate}_B} = \sqrt{\frac{\text{MW}_B}{\text{MW}_A}}$.
    - **Henry's Law**: Gas solubility $S = k_H P$.
    - **Raoult's Law (François-Marie Raoult)**: Vapor pressure depression $P_{\text{soln}} = X_{\text{solvent}} P_{\text{solvent}}^\circ$.
    - **Le Chatelier's Principle**: When an external stress is applied to a system at equilibrium, the system adjusts to relieve the stress.
- **In-Line Concept Checks**: 10 MCQs on mole conversions, percent composition, ideal gas state calculations, and Graham's law effusion rates.
- **Sample Problems**:
  - *Problem*: Find the volume occupied by $2.0\text{ moles}$ of an ideal gas at STP ($0^\circ\text{C}, 1\text{ atm}$).
  - *⚡ Board Exam Shortcut*: Molar volume at STP is $22.4\text{ L/mol} \implies V = 2.0 \times 22.4 = 44.8\text{ L}$.
- **Calculator Technique**: Gas constant substitution and temperature conversions in Kelvin ($+273.15$).
- **Exclusive Mastery Challenge Set**: 25 questions testing stoichiometry, gas law calculations, partial pressures, and effusion.

---

### Module GEAS-05: Solutions, Concentration Units, Acids, Bases & Colloids
- **Source Reference**: `Notes - Chemistry 10.pdf`
- **Prerequisite Bridge**: Fluid mixtures, pH scales, and electrochemical electrolyte dissociation.
- **Atomic Definitions**:
  - **Solution**: Homogeneous mixture composed of a **Solute** (dissolved substance) and a **Solvent** (dissolving medium).
  - **Saturation States**:
    - Unsaturated: Contains less than maximum possible dissolved solute at given temperature.
    - Saturated: Contains maximum amount of dissolved solute in equilibrium with undissolved solute.
    - Supersaturated: Contains more dissolved solute than normal saturation (metastable state).
  - **Concentration Units**:
    - **Percent by Mass ($\% \text{ w/w}$)**: $\frac{\text{mass solute}}{\text{total solution mass}} \times 100\%$. Independent of temperature.
    - **Molarity ($M$)**: Number of moles of solute per liter of solution:
      $$M = \frac{\text{moles of solute}}{\text{liters of solution}} \quad (\text{mol/L})$$
    - **Molality ($m$)**: Number of moles of solute per kilogram of solvent:
      $$m = \frac{\text{moles of solute}}{\text{kg of solvent}} \quad (\text{mol/kg})$$
      Independent of temperature changes (mass does not expand with heat).
    - **Normality ($N$)**: Number of gram equivalents of solute per liter of solution:
      $$N = M \times n_{\text{eq}} = \frac{\text{equivalent weights}}{\text{liters of solution}}$$
  - **Dilution Formula**:
    $$M_1 V_1 = M_2 V_2 \iff C_1 V_1 = C_2 V_2$$
  - **Acids vs Bases**:
    - **Acids**: Sour taste, turns litmus red, reacts with metals to release $H_2$ gas, reacts with carbonates to release $CO_2$, produces $H^+$ / $H_3O^+$ in water. $\text{pH} < 7$.
    - **Bases**: Bitter taste, slippery feel, turns litmus blue, produces $OH^-$ in water. $\text{pH} > 7$.
    - Neutralization: $\text{Acid} + \text{Base} \to \text{Salt} + \text{Water}$.
    - $\text{pH}$ and $\text{pOH}$: $\text{pH} = -\log_{10}[H^+]$, $\text{pOH} = -\log_{10}[OH^-]$, $\text{pH} + \text{pOH} = 14$ (at $25^\circ\text{C}$).
  - **Tyndall Effect (John Tyndall)**: Scattering of a light beam as it passes through a **colloid** (particles large enough to scatter light, $1\text{--}1000\text{ nm}$), used to distinguish colloids from true solutions.
- **In-Line Concept Checks**: 8 MCQs on Molarity vs Molality temperature independence, dilution formula calculations, pH evaluation, and Tyndall effect identification.
- **Sample Problems**:
  - *Problem*: How many milliliters of $12\text{ M } HCl$ are needed to prepare $500\text{ mL}$ of $0.6\text{ M } HCl$?
  - *⚡ Board Exam Shortcut*: $V_1 = \frac{M_2 V_2}{M_1} = \frac{0.6 \times 500}{12} = \frac{300}{12} = 25\text{ mL}$.
- **Calculator Technique**: Logarithmic calculations for pH and dilution ratios.
- **Exclusive Mastery Challenge Set**: 25 questions testing concentration units, dilutions, pH/pOH, and colloids.

---

## Unit 2: Engineering Economics & Financial Mathematics

### Module GEAS-06: Time Value of Money, Interest Rates, Inflation & Discount
- **Source Reference**: `Notes - Engineering Economics 1.pdf`
- **Prerequisite Bridge**: Financial mathematics foundations for engineering project valuation, capital budgeting, and life-cycle cost analysis.
- **Atomic Definitions**:
  - **Engineering Economics**: Mathematical analysis and evaluation of monetary consequences of engineering applications, designs, and capital investments.
  - **Interest ($I$)**: Cost of borrowing capital or return earned on loaned funds.
  - **Simple Interest**: Computed strictly on original principal:
    $$I = P \cdot i \cdot n, \quad F = P(1 + i \cdot n)$$
    - **Ordinary Simple Interest**: Banker's year of $360\text{ days}$ ($12\text{ months} \times 30\text{ days}$): $n = \frac{d}{360}$.
    - **Exact Simple Interest**: Exact calendar days: $n = \frac{d}{365}$ (normal year) or $n = \frac{d}{366}$ (leap year).
  - **Compound Interest**: Interest is earned on both the principal and previously accumulated interest:
    $$F = P(1 + i)^n \iff P = \frac{F}{(1 + i)^n} = F(1 + i)^{-n}$$
    where nominal rate $\text{NR}$, compounding periods per year $m$, and $N$ years $\implies i = \frac{\text{NR}}{m}, n = m \cdot N$.
    - Compounding Modes: Annually ($m=1$), Semiannually ($m=2$), Quarterly ($m=4$), Bimonthly ($m=6$), Monthly ($m=12$), Semimonthly ($m=24$), Daily ($m=365$).
  - **Effective Rate of Interest ($\text{ER}$)**: Exact annualized return accounting for compounding frequency:
    $$\text{ER} = \left(1 + \frac{\text{NR}}{m}\right)^m - 1 = (1 + i)^m - 1$$
  - **Continuous Compounding**: Limit as compounding frequency approaches infinity ($m \to \infty$):
    $$F = P e^{r t}$$
  - **Inflation**: Rate of general increase in prices and corresponding loss of purchasing power:
    $$F = P \frac{(1 + i)^n}{(1 + f)^n}$$
  - **Rate of Discount ($d$)**: Proportion of future amount deducted as interest upfront:
    $$d = 1 - \frac{1}{1 + i} = \frac{i}{1 + i} \iff i = \frac{d}{1 - d}$$
- **In-Line Concept Checks**: 8 MCQs on ordinary vs exact simple interest, effective rate calculations, discount-to-interest conversion, and continuous growth.
- **Sample Problems**:
  - *Problem*: Find the effective rate corresponding to $12\%$ compounded quarterly.
  - *⚡ Board Exam Shortcut*: $\text{ER} = \left(1 + \frac{0.12}{4}\right)^4 - 1 = (1.03)^4 - 1 = 1.1255 - 1 = 12.55\%$.
- **Calculator Technique**: Financial interest evaluation using power functions `(1+i)^n` and `e^x`.
- **Exclusive Mastery Challenge Set**: 25 questions testing interest types, compounding frequencies, inflation adjustments, and discount rates.

---

### Module GEAS-07: Annuities, Perpetuities & Asset Depreciation Methods
- **Source Reference**: `Notes - Engineering Economics 2.pdf`
- **Prerequisite Bridge**: Cash flow modeling over multi-year asset lifespans. Foundation for engineering project feasibility and tax accounting.
- **Atomic Definitions**:
  - **Annuity**: Uniform series of equal periodic payments ($A$) made at regular intervals.
    1. **Ordinary Annuity**: Payments made at the **end** of each period:
       - Future Worth: $S = A \left[\frac{(1 + i)^n - 1}{i}\right]$.
       - Present Worth: $P = A \left[\frac{(1 + i)^n - 1}{i(1 + i)^n}\right] = A \left[\frac{1 - (1+i)^{-n}}{i}\right]$.
    2. **Annuity Due**: Payments made at the **beginning** of each period:
       $$P_{\text{due}} = P_{\text{ordinary}}(1 + i) = P + A$$
    3. **Deferred Annuity**: First payment deferred by $k$ periods:
       $$P_{\text{deferred}} = P_{\text{ordinary}} (1 + i)^{-k}$$
    4. **Perpetuity**: Uniform annuity continuing indefinitely ($n \to \infty$):
       $$P_{\text{perpetuity}} = \frac{A}{i}$$
  - **Depreciation**: Reduction in value of physical assets due to wear, tear, usage, and obsolescence over economic life $n$:
    - First Cost ($C_0$), Salvage / Scrap Value ($C_n$), Book Value at year $m$ ($C_m$), Total Depreciation ($C_0 - C_n$).
  - **Depreciation Methods**:
    1. **Straight Line Method (SLM)**: Constant annual depreciation:
       $$d = \frac{C_0 - C_n}{n}, \quad D_m = m \cdot d, \quad C_m = C_0 - D_m$$
    2. **Sinking Fund Method (SFM)**: Depreciation fund earns compound interest $i$:
       $$d = \frac{(C_0 - C_n)i}{(1 + i)^n - 1}, \quad D_m = d \left[\frac{(1 + i)^m - 1}{i}\right], \quad C_m = C_0 - D_m$$
    3. **Declining Balance Method (DBM / Matheson Formula)**: Constant annual percentage rate $k$:
       $$k = 1 - \sqrt[n]{\frac{C_n}{C_0}} = 1 - \sqrt[m]{\frac{C_m}{C_0}}, \quad C_m = C_0(1 - k)^m$$
       *(Note: Salvage value $C_n$ cannot be zero).*
    4. **Sum-of-Years Digit Method (SYD)**: Accelerated depreciation:
       $$\Sigma \text{years} = \frac{n(n + 1)}{2}, \quad d_m = (C_0 - C_n)\left(\frac{n - m + 1}{\Sigma \text{years}}\right)$$
- **In-Line Concept Checks**: 10 MCQs on ordinary vs annuity due conversions, perpetuity present worth, book value by SLM/SYD, and Matheson rate $k$.
- **Sample Problems**:
  - *Problem*: An equipment costs $\text{P}500,000$ with salvage value $\text{P}50,000$ after 5 years. Find the 2nd year depreciation by SYD method.
  - *Academic Derivation*: $\Sigma \text{years} = \frac{5(6)}{2} = 15$. Depreciation base $= 500,000 - 50,000 = 450,000$. $d_2 = 450,000 \times \frac{5 - 2 + 1}{15} = 450,000 \times \frac{4}{15} = \text{P}120,000$.
- **Calculator Technique**: Arithmetic sequence sum and SYD multiplier storage.
- **Exclusive Mastery Challenge Set**: 25 questions testing annuity types, sinking funds, perpetuities, and all four depreciation methods.

---

## Unit 3: Materials Science & Engineering (MSE)

### Module GEAS-08: Classification of Engineering Materials, Alloys & Mechanical Properties
- **Source Reference**: `Notes - Material Science and Engineering 1.pdf`, `Notes - MSE 2.pdf`
- **Prerequisite Bridge**: Atomic bonding to bulk macroscopic material behavior. Directly applies to structural design, chassis selection, and reliability under load.
- **Atomic Definitions**:
  - **Engineering Materials Classification**:
    - **Metals**: High electrical/thermal conductivity, ductility, malleability, metallic bonding (e.g., steel, aluminum, copper, titanium).
    - **Polymers**: Large chain molecules (macromolecules) of repeating monomer subunits. Lightweight, corrosion-resistant; Thermoplastics (meltable/recyclable) vs Thermosets (cross-linked, decompose on heating).
    - **Ceramics**: Inorganic, non-metallic compounds (oxides, nitrides, carbides). High hardness, high temperature resistance, brittle, electrical insulators.
    - **Composites**: Synergistic combination of two or more distinct materials (matrix + reinforcement fibers, e.g., CFRP carbon fiber, fiberglass).
    - **Semiconductors**: Electrical conductivity intermediate between conductors and insulators ($Si, GaAs$), adjustable by chemical doping.
    - **Biomaterials**: Biocompatible materials non-toxic to living tissue (prosthetics, implants, drug delivery).
  - **Common Engineering Alloys**:
    - **Steel**: Alloy of iron and carbon ($0.2\%\text{--}2.1\%\text{ C}$).
    - **Stainless Steel**: Iron alloy containing minimum $10.5\%\text{ Chromium}$ (forms self-healing passive $Cr_2O_3$ film), plus Nickel and Molybdenum.
    - **Bronze**: Copper alloy primarily with **Tin** ($Cu + Sn$).
    - **Brass**: Copper alloy primarily with **Zinc** ($Cu + Zn$).
  - **Mechanical Properties & Stress-Strain Curve**:
    - Stress ($\sigma = F/A$) vs Strain ($\epsilon = \Delta L / L_0$).
    - Hooke's Law: $\sigma = E \epsilon$ (Young's Modulus $E$ represents stiffness).
    - Key Points on Curve:
      - Point A: **Proportionality Limit** (linear Hooke's region ends).
      - Point B: **Elastic Limit** (maximum stress without permanent plastic deformation).
      - Point C: **Yield Point** (appreciable elongation occurs without load increase).
      - Point D: **Ultimate Strength / Tensile Strength** (maximum ordinate stress on curve).
      - Point E: **Rupture / Fracture Strength** (nominal stress at failure).
    - **Ductility**: Ability to undergo plastic deformation under tension before fracture (drawn into wires).
    - **Malleability**: Ability to deform under compressive stress (rolled/hammered into sheets).
    - **Toughness**: Total energy absorbed before fracture (area under complete stress-strain curve).
    - **Resilience**: Modulus of resilience (energy absorbed within elastic limit without permanent deformation).
    - **Hardness**: Resistance to localized surface indentation, scratching, or abrasion (Brinell, Rockwell, Vickers, Mohs scales).
    - **Creep Resistance**: Resistance to slow progressive deformation under sustained constant stress at elevated temperatures.
    - **Fatigue Resistance**: Ability to withstand cyclic, fluctuating, or repeated dynamic loading without catastrophic failure.
- **In-Line Concept Checks**: 8 MCQs on bronze vs brass alloy compositions, points on stress-strain diagram, thermoplastic vs thermoset, and toughness definition.
- **Sample Problems**:
  - *Problem*: Distinguish between bronze and brass by their primary alloying constituent.
  - *⚡ Board Exam Shortcut*: **Bronze** $= Cu + \text{Tin } (Sn)$; **Brass** $= Cu + \text{Zinc } (Zn)$.
- **Exclusive Mastery Challenge Set**: 25 questions testing material categories, alloy systems, and mechanical stress-strain parameters.

---

### Module GEAS-09: Magnetic, Optical, Electrical Properties & Crystallography
- **Source Reference**: `Notes - Material Science and Engineering 2.pdf`, `Notes - MSE 3.pdf`, `Notes - MSE 4.pdf`
- **Prerequisite Bridge**: Microscopic electromagnetic and optical interactions. Connects directly to inductors, transformers (Elecs), and optical fibers (EST).
- **Atomic Definitions**:
  - **Magnetic Classifications**:
    - **Diamagnetic**: Weakly repelled by magnetic field; negative magnetic susceptibility ($\chi_m < 0$, $\mu_r < 1$, e.g., copper, gold, bismuth, water).
    - **Paramagnetic**: Weakly attracted to magnetic field; small positive susceptibility ($\chi_m > 0$, $\mu_r > 1$, e.g., aluminum, platinum, oxygen).
    - **Ferromagnetic**: Strongly attracted; large positive susceptibility, spontaneous magnetic domains (e.g., iron, nickel, cobalt).
    - **Curie Temperature ($T_c$)**: Temperature above which a ferromagnetic material loses spontaneous magnetization and becomes **paramagnetic** ($T_c\text{ Fe} = 770^\circ\text{C}$).
    - **Magnetic Hysteresis**: Lagging of magnetic flux density ($B$) behind magnetic field intensity ($H$), causing energy loss proportional to hysteresis loop area.
    - **Magnetostriction**: Physical change in material dimensions when subjected to a magnetic field.
  - **Electrical Properties**:
    - Conductivity ($\sigma$) vs Resistivity ($\rho = 1/\sigma$).
    - Dielectric Constant ($\epsilon_r$ / Relative Permittivity): Measure of material's ability to store electrical energy via polarization.
    - **Piezoelectricity**: Generation of electric charge in response to applied mechanical stress, and vice versa (quartz, PZT ceramics).
  - **Optical Properties**:
    - Refractive Index ($n = c/v$), Dispersion, Absorption, Reflection, Scattering.
    - Luminescence: Light emission from non-thermal excitation (Fluorescence: instantaneous $< 10^{-8}\text{ s}$; Phosphorescence: delayed emission).
  - **Crystalline vs Amorphous Solids**:
    - **Crystalline**: Highly ordered, repeating 3D lattice, sharp well-defined melting point, anisotropic mechanical/optical properties.
    - **Amorphous**: Random disordered atomic network, lack long-range order, soften gradually over temperature range, isotropic properties.
  - **Cubic Crystal Lattice Structures & Atomic Packing Factor (APF)**:
    $$\text{APF} = \frac{\text{Volume of atoms in unit cell}}{\text{Total volume of unit cell}} = \frac{N_{\text{atoms}} \times \frac{4}{3}\pi R^3}{a^3}$$
    1. **Simple Cubic (SC)**:
       - Atoms at 8 corners: $N = 8 \times \frac{1}{8} = 1\text{ atom/cell}$.
       - Coordination Number $= 6$. Lattice relation $a = 2R$. $\text{APF} = \frac{\pi}{6} \approx \mathbf{52.4\%}$.
    2. **Body-Centered Cubic (BCC)**:
       - 8 corners $+ 1$ center: $N = 8 \times \frac{1}{8} + 1 = 2\text{ atoms/cell}$.
       - Coordination Number $= 8$. Lattice relation $a\sqrt{3} = 4R$. $\text{APF} = \frac{\pi\sqrt{3}}{8} \approx \mathbf{68.0\%}$ (e.g., Fe, Cr, W).
    3. **Face-Centered Cubic (FCC)**:
       - 8 corners $+ 6$ face centers: $N = 8 \times \frac{1}{8} + 6 \times \frac{1}{2} = 4\text{ atoms/cell}$.
       - Coordination Number $= 12$. Lattice relation $a\sqrt{2} = 4R$. $\text{APF} = \frac{\pi\sqrt{2}}{6} \approx \mathbf{74.0\%}$ (e.g., Cu, Al, Au, Ag).
- **In-Line Concept Checks**: 10 MCQs on Curie temperature transitions, piezoelectric effect, APF values ($52.4\%, 68\%, 74\%$), and coordination numbers.
- **Sample Problems**:
  - *Problem*: State the number of atoms per unit cell and the atomic packing factor for an FCC metal.
  - *⚡ Board Exam Shortcut*: FCC $\implies 4\text{ atoms/cell}$, Coordination Number $= 12$, $\text{APF} = 74\%$.
- **Exclusive Mastery Challenge Set**: 25 questions testing magnetic classifications, Curie transitions, APF derivations, and crystal lattices.

---

## Unit 4: Engineering Mechanics (Statics & Dynamics)

### Module GEAS-10: Statics of Rigid Bodies, Force Vectors & Equilibrium
- **Source Reference**: `Notes - Physics Mechanics 1.pdf`
- **Prerequisite Bridge**: Vector resolution (MATH-12) applied to balanced force systems and structural equilibrium.
- **Atomic Definitions**:
  - **Mechanics**: Physical science treating the state of rest or motion of bodies subjected to forces (Statics, Dynamics [Kinematics + Kinetics]).
  - **Idealized Assumptions**:
    - **Rigid Body**: Body where deformations are negligible compared to overall dimensions.
    - **Particle**: Body of negligible dimensions treated as point mass.
    - **Concentrated Force**: Loading assumed to act at a discrete point.
  - **Fundamental Principles**:
    - **Parallelogram Law of Addition**: Resultant of two concurrent forces forms the diagonal of a parallelogram.
    - **Principle of Transmissibility**: Point of application of a force on a rigid body can be moved anywhere along its line of action without altering external equilibrium effects.
    - **Resolution of Forces**: Expressing force as orthogonal components $F_x = F\cos\theta, F_y = F\sin\theta$.
  - **Conditions for Static Equilibrium of Coplanar Force Systems**:
    $$\sum F_x = 0, \quad \sum F_y = 0, \quad \sum M_O = 0$$
    - **Graphical Method**: Forces form a closed force polygon.
    - **Three-Force Principle**: If a rigid body in equilibrium is acted upon by three non-parallel coplanar forces, the forces must be **concurrent** (lines of action meet at one common point).
  - **Historical Milestones**: Aristotle (lever/center of gravity), Archimedes (buoyancy), Galileo (kinematic analysis), Kepler (planetary laws), Newton (universal gravitation), Bernoulli (virtual work), Euler (rigid body dynamics), D'Alembert (dynamic equilibrium).
- **In-Line Concept Checks**: 8 MCQs on three-force concurrency, transmissibility limits, force polygon closure, and static equilibrium equations.
- **Sample Problems**:
  - *Problem*: A $100\text{ N}$ weight is suspended by two symmetric cables inclined at $30^\circ$ to the horizontal. Find tension in each cable.
  - *⚡ Board Exam Shortcut*: $2 T \sin 30^\circ = 100 \implies 2 T (0.5) = 100 \implies T = 100\text{ N}$.
- **Calculator Technique**: System of linear equations in `MODE 5 -> 1` for solving 2D joint equilibrium.
- **Exclusive Mastery Challenge Set**: 25 questions testing concurrent force systems, moments, force polygons, and equilibrium.

---

### Module GEAS-11: Friction Mechanics, Centroids & Second Moment of Area
- **Source Reference**: `Notes - Physics Mechanics 2.pdf`
- **Prerequisite Bridge**: Contact friction and cross-sectional properties for structural resistance to bending and rotation.
- **Atomic Definitions**:
  - **Friction Force ($F$)**: Tangential force opposing impending relative motion between two contact surfaces:
    $$F_s \le \mu_s N, \quad F_k = \mu_k N$$
    where $\mu_s$ is coefficient of static friction, $\mu_k$ is kinetic friction ($\mu_k < \mu_s$), and $N$ is normal force.
    - **Angle of Friction ($\phi$)**:
      $$\tan\phi = \mu_s$$
    - Total Contact Resultant Force: $R = \sqrt{N^2 + F^2} = N\sqrt{1 + \mu_s^2}$.
  - **Second Moment of Area / Moment of Inertia ($I$)**:
    1. **Rectangle** (Base $b$, Height $h$):
       - Centroidal axis: $I_x = \frac{b h^3}{12}$, $I_y = \frac{h b^3}{12}$.
       - Base axis: $I_b = \frac{b h^3}{3}$.
    2. **Triangle** (Base $b$, Height $h$):
       - Centroidal axis: $I_x = \frac{b h^3}{36}$.
       - Base axis: $I_b = \frac{b h^3}{12}$.
    3. **Circle** (Radius $r$, Diameter $D$):
       - Centroidal axis: $I_x = I_y = \frac{\pi r^4}{4} = \frac{\pi D^4}{64}$.
    4. **Ellipse** (Semi-axes $a, b$):
       - Centroidal axis: $I_x = \frac{\pi a b^3}{4}$, $I_y = \frac{\pi a^3 b}{4}$.
  - **Parallel Axis Theorem (Transfer Formula)**:
    $$I = I_g + A d^2$$
    where $I_g$ is centroidal moment of inertia, $A$ is cross-sectional area, and $d$ is perpendicular distance between parallel axes.
- **In-Line Concept Checks**: 8 MCQs on angle of friction relations ($\tan\phi = \mu$), base vs centroid moment of inertia ratios ($3\times$ difference), and parallel axis transfer.
- **Sample Problems**:
  - *Problem*: A rectangular cross-section has base $b=6\text{ cm}$ and height $h=10\text{ cm}$. Find its moment of inertia about its centroidal x-axis and about its base.
  - *⚡ Board Exam Shortcut*: $I_g = \frac{6(10^3)}{12} = 500\text{ cm}^4$. $I_{\text{base}} = 3 \times I_g = 1500\text{ cm}^4$.
- **Exclusive Mastery Challenge Set**: 25 questions testing dry friction, angle of friction, centroidal moments of inertia, and parallel axis transfers.

---

### Module GEAS-12: Kinematics: Rectilinear Translation, Projectiles & Banking of Curves
- **Source Reference**: `Notes - Physics Mechanics 3.pdf`, `Notes - Physics Mechanics 4.pdf`
- **Prerequisite Bridge**: Equations of motion and 2D curvilinear trajectories under gravity and centripetal acceleration.
- **Atomic Definitions**:
  - **Rectilinear Motion with Constant Acceleration**:
    $$v = v_0 + a t, \quad s = v_0 t + \frac{1}{2}a t^2, \quad v^2 = v_0^2 + 2 a s$$
    - Free-Falling Bodies: $a = g = 9.81\text{ m/s}^2 = 32.2\text{ ft/s}^2$.
  - **Projectile Motion (Curvilinear Translation)**:
    - Horizontal Component: $v_x = v_0 \cos\theta$ (constant, $a_x = 0 \implies x = v_0 \cos\theta \cdot t$).
    - Vertical Component: $v_y = v_0 \sin\theta - g t$, $y = v_0 \sin\theta \cdot t - \frac{1}{2}g t^2$.
    - **General Parabolic Trajectory Equation**:
      $$y = x\tan\theta - \frac{g x^2}{2 v_0^2 \cos^2\theta}$$
    - **Maximum Height ($y_{\max}$)**:
      $$y_{\max} = \frac{(v_0 \sin\theta)^2}{2g}$$
    - **Total Time of Flight ($t_{\text{total}}$)**:
      $$t_{\text{total}} = \frac{2 v_0 \sin\theta}{g}$$
    - **Maximum Horizontal Range ($R$) on Level Ground**:
      $$R = \frac{v_0^2 \sin 2\theta}{g} \quad (\text{Maximum at } \theta = 45^\circ)$$
    - **Range on Inclined Plane (Angle $\beta$)**:
      - Up the incline: $R = \frac{2 v_0^2 \sin\theta \cos(\theta + \beta)}{g \cos^2\beta}$.
      - Down the incline: $R = \frac{2 v_0^2 \sin\theta \cos(\theta - \beta)}{g \cos^2\beta}$.
  - **Rotational Kinematics & Banking of Highway Curves**:
    - Linear vs Angular: $s = r\theta, v = r\omega, a = r\alpha$.
    - Centripetal Acceleration: $a_c = \frac{v^2}{r} = \omega^2 r$.
    - **Ideal Banking Angle ($\theta$) of Highway Curves (No Friction Required)**:
      $$\tan\theta = \frac{v^2}{g r}$$
    - **Maximum Velocity with Friction ($\mu = \tan\phi$)**:
      $$\tan(\theta + \phi) = \frac{v^2}{g r}$$
    - Superelevation ($e$): Rise of outer edge of roadway over road width $w$: $e = w\sin\theta \approx w\tan\theta$.
- **In-Line Concept Checks**: 10 MCQs on projectile maximum range at $45^\circ$, velocity at apex ($v_y=0$), ideal banking formula, and superelevation.
- **Sample Problems**:
  - *Problem*: A vehicle negotiates a highway curve of radius $200\text{ m}$ at $72\text{ km/h}$ ($20\text{ m/s}$). Find the ideal banking angle.
  - *⚡ Board Exam Shortcut*: $\tan\theta = \frac{v^2}{gr} = \frac{20^2}{9.81 \times 200} = \frac{400}{1962} \approx 0.20387 \implies \theta = \arctan(0.20387) \approx 11.52^\circ$.
- **Calculator Technique**: Storing $g=9.81$ in variable `G` and direct trigonometric equation solving.
- **Exclusive Mastery Challenge Set**: 25 questions testing rectilinear kinematics, projectile apex/range, and highway banking angles.

---

## Unit 5: General Physics, Waves, Sound & Optics

### Module GEAS-13: Newton's Laws, Universal Gravitation, Impulse & Restitution
- **Source Reference**: `Notes - Physics 1.pdf`, `Notes - Physics 2.pdf`
- **Prerequisite Bridge**: Force interactions, conservation of linear momentum, and mechanical energy collisions.
- **Atomic Definitions**:
  - **Newton's Three Laws of Motion (Sir Isaac Newton 1687, "Principia")**:
    1. **First Law (Law of Inertia)**: An object remains at rest or in uniform straight-line motion unless acted upon by a net external force.
    2. **Second Law (Law of Acceleration)**: Force equals rate of change of momentum: $F = m a$ (SI: $1\text{ N} = 1\text{ kg}\cdot\text{m/s}^2$; $1\text{ dyne} = 10^{-5}\text{ N}$; $1\text{ lbf} = 4.448\text{ N}$).
    3. **Third Law (Law of Interaction / Action-Reaction)**: For every action, there is an equal and opposite reaction.
  - **Newton's Law of Universal Gravitation**:
    $$F = G \frac{m_1 m_2}{d^2}$$
    where $G = 6.67430 \times 10^{-11}\text{ N}\cdot\text{m}^2/\text{kg}^2$.
  - **Work, Power & Kinetic Energy**:
    - Work: $W = F \cdot d \cos\theta$ (SI: $1\text{ J} = 1\text{ N}\cdot\text{m} = 10^7\text{ ergs} = 0.7376\text{ ft}\cdot\text{lbf}$).
    - Power: $P = \frac{W}{t} = F \cdot v$ ($1\text{ hp} = 746\text{ W} = 550\text{ ft}\cdot\text{lbf/s}$).
    - Translational KE: $\text{KE}_{\text{trans}} = \frac{1}{2}m v^2$. Rotational KE: $\text{KE}_{\text{rot}} = \frac{1}{2}I \omega^2$.
    - Gravitational Potential Energy: $\text{PE} = m g h$.
  - **Momentum ($p$) & Impulse ($J$)**:
    $$p = m v, \quad J = F \Delta t = \Delta p = m(v_f - v_i)$$
  - **Collisions & Coefficient of Restitution ($e$)**:
    - **Elastic Collision**: Total momentum AND total kinetic energy conserved ($e = 1$).
    - **Inelastic Collision**: Total momentum conserved; kinetic energy is converted to heat/deformation ($0 < e < 1$).
    - **Perfectly Inelastic Collision**: Bodies stick together after collision ($e = 0$, maximum kinetic energy loss).
    - **Coefficient of Restitution ($e$)**:
      $$e = -\frac{v_{2f} - v_{1f}}{v_{2i} - v_{1i}} = \sqrt{\frac{h_{\text{bounce}}}{h_{\text{initial}}}}$$
- **In-Line Concept Checks**: 8 MCQs on impulse-momentum theorem, bounce height restitution formula ($e = \sqrt{h_2/h_1}$), and horsepower conversions.
- **Sample Problems**:
  - *Problem*: A ball is dropped from height $16\text{ m}$ and bounces back to $9\text{ m}$. Find the coefficient of restitution.
  - *⚡ Board Exam Shortcut*: $e = \sqrt{\frac{h_{\text{bounce}}}{h_{\text{initial}}}} = \sqrt{\frac{9}{16}} = \frac{3}{4} = 0.75$.
- **Exclusive Mastery Challenge Set**: 25 questions testing Newton's laws, impulse-momentum, energy conservation, and collision types.

---

### Module GEAS-14: Periodic Motion, Simple Pendulums & Wave Mechanics
- **Source Reference**: `Notes - Physics 3.pdf`
- **Prerequisite Bridge**: Oscillatory dynamics and wave motion. Directly links to quartz resonators (Elecs) and electromagnetic radiation (EST).
- **Atomic Definitions**:
  - **Simple Harmonic Motion (SHM)**: Restoring force is directly proportional to displacement and directed toward equilibrium ($F = -kx \implies a = -\frac{k}{m}x = -\omega^2 x$).
  - **Spring-Mass Oscillator**:
    $$\omega = \sqrt{\frac{k}{m}}, \quad T = 2\pi\sqrt{\frac{m}{k}}, \quad f = \frac{1}{2\pi}\sqrt{\frac{k}{m}}$$
  - **Simple Pendulum (Point mass $m$ on string of length $L$)**:
    $$T = 2\pi\sqrt{\frac{L}{g}}, \quad \omega = \sqrt{\frac{g}{L}}, \quad f = \frac{1}{2\pi}\sqrt{\frac{g}{L}}$$
    *(Note: Period is completely independent of the mass of the bob).*
  - **Torsional Pendulum**:
    $$T = 2\pi\sqrt{\frac{I}{\kappa}}$$
    where $I$ is moment of inertia and $\kappa$ is torsional spring constant.
  - **Wave Classifications**:
    - **Mechanical Waves**: Require physical medium to propagate (e.g., sound, seismic, water).
    - **Electromagnetic Waves**: Do not require medium; propagate through vacuum at $c = 3 \times 10^8\text{ m/s}$.
    - **Transverse Waves**: Particle vibration is **perpendicular** to wave propagation (EM waves, vibrating strings).
    - **Longitudinal Waves**: Particle vibration is **parallel** to wave propagation (Sound waves, compression springs).
  - **Speed of Wave Propagation**:
    $$v = f \lambda$$
    - In Stretched String: $v = \sqrt{\frac{T}{\mu}}$ (Tension $T$, linear mass density $\mu$).
    - In Solid Rod: $v = \sqrt{\frac{E}{\rho}}$ (Young's modulus $E$, density $\rho$).
    - In Gas: $v = \sqrt{\frac{\gamma P}{\rho}} = \sqrt{\frac{\gamma R T}{M}}$.
- **In-Line Concept Checks**: 8 MCQs on pendulum period independence of mass, transverse vs longitudinal classification, and wave speed in strings.
- **Sample Problems**:
  - *Problem*: By what factor does the period of a simple pendulum change if its length is quadrupled?
  - *⚡ Board Exam Shortcut*: $T \propto \sqrt{L} \implies \sqrt{4} = 2$ (Period doubles).
- **Exclusive Mastery Challenge Set**: 25 questions testing SHM equations, spring-mass systems, pendulums, and wave speeds.

---

### Module GEAS-15: Acoustics, Sound Intensity, Decibels & Doppler Effect
- **Source Reference**: `Notes - Physics 4.pdf`, `Notes - Physics 5.pdf`
- **Prerequisite Bridge**: Acoustic wave properties and frequency shifting. Connects to audio engineering and radar Doppler shifts (EST).
- **Atomic Definitions**:
  - **Sound Wave**: Mechanical longitudinal compression wave in medium. Human audible range: $20\text{ Hz}$ to $20\text{ kHz}$ (Infrasound $< 20\text{ Hz}$, Ultrasound $> 20\text{ kHz}$).
  - **Speed of Sound in Air**:
    $$v \approx 331.4 + 0.6 T_C \quad (\text{m/s at } T_C^\circ\text{C}) \approx 331\text{ m/s at } 0^\circ\text{C} \approx 343\text{ m/s at } 20^\circ\text{C}$$
  - **Sound Intensity ($I$)**: Power transmitted per unit area perpendicular to wave direction:
    $$I = \frac{P}{A} = \frac{P}{4\pi r^2} \quad (\text{Unit: W/m}^2)$$
    - Threshold of Hearing: $I_0 = 10^{-12}\text{ W/m}^2$ ($0\text{ dB}$).
    - Threshold of Pain: $I_{\text{pain}} = 1\text{ W/m}^2$ ($120\text{ dB}$).
  - **Sound Intensity Level ($\beta$ in Decibels, dB)**:
    $$\beta = 10\log_{10}\left(\frac{I}{I_0}\right) = 10\log_{10}\left(\frac{I}{10^{-12}}\right)$$
  - **Doppler Effect (Christian Andreas Doppler 1842)**: Apparent frequency change due to relative motion between source ($s$) and observer ($o$):
    $$f_o = f_s \left(\frac{v \pm v_o}{v \mp v_s}\right)$$
    - Rule: Numerator $(+)$ when observer moves toward source; Denominator $(-)$ when source moves toward observer (both increase observed frequency $f_o$).
- **In-Line Concept Checks**: 8 MCQs on inverse-square law intensity scaling ($I \propto 1/r^2$), decibel addition (doubling intensity $= +3\text{ dB}$), and Doppler frequency shifts.
- **Sample Problems**:
  - *Problem*: Two identical sound sources each produce $70\text{ dB}$. What is the combined sound level when both operate together?
  - *⚡ Board Exam Shortcut*: Doubling power/intensity adds $+10\log_{10}(2) \approx +3.01\text{ dB} \implies 70 + 3 = 73\text{ dB}$.
- **Calculator Technique**: Logarithmic conversions for intensity decibels.
- **Exclusive Mastery Challenge Set**: 25 questions testing sound speeds, decibel calculations, inverse square laws, and Doppler shift problems.

---

### Module GEAS-16: Geometric Optics, Mirrors, Thin Lenses & Lensmaker's Formula
- **Source Reference**: `Notes - Physics 5.pdf`, `Notes - Physics 6.pdf`
- **Prerequisite Bridge**: Reflection and refraction at curved optical interfaces. Foundation for optical fiber ray tracing and parabolic antennas.
- **Atomic Definitions**:
  - **Light**: Electromagnetic radiation visible to human eye ($\approx 380\text{ nm}$ to $760\text{ nm}$). Speed in vacuum $c \approx 3 \times 10^8\text{ m/s}$.
  - **Laws of Optics**:
    - Law of Reflection: Angle of incidence equals angle of reflection ($\theta_i = \theta_r$).
    - Law of Refraction (Snell's Law): $n_1 \sin\theta_1 = n_2 \sin\theta_2$.
    - Huygens' Principle: Every point on a wavefront is a source of secondary wavelets.
  - **Spherical Mirrors & Thin Lenses**:
    - **Mirror Equation & Thin Lens Formula**:
      $$\frac{1}{p} + \frac{1}{q} = \frac{1}{f}$$
      where $p$ is object distance, $q$ is image distance, $f$ is focal length ($f = r/2$ for spherical mirrors).
    - **Linear Magnification ($M$)**:
      $$M = \frac{h_i}{h_o} = -\frac{q}{p}$$
    - **Sign Conventions**:
      - Real image: $q > 0$. Virtual image: $q < 0$.
      - Converging (Concave mirror / Convex lens): $f > 0$.
      - Diverging (Convex mirror / Concave lens): $f < 0$.
      - Upright image: $M > 0$. Inverted image: $M < 0$.
  - **Optical Power of Lens ($P$)**:
    $$P = \frac{1}{f \text{ (in meters)}} \quad (\text{Unit: Diopter, D} = \text{m}^{-1})$$
  - **Lensmaker's Equation**:
    - Thin Lens: $\frac{1}{f} = (n - 1)\left[\frac{1}{R_1} - \frac{1}{R_2}\right]$.
    - Thick Lens (Thickness $d$): $\frac{1}{f} = (n - 1)\left[\frac{1}{R_1} - \frac{1}{R_2} + \frac{(n - 1)d}{n R_1 R_2}\right]$.
  - **Optical Aberrations & Keywords**:
    - **Spherical Aberration**: Rays from outer edges focus closer than central rays.
    - **Chromatic Aberration**: Different wavelengths focus at different points due to dispersion. Corrected by an **Achromatic Doublet**.
    - **Coma**: Off-axis aberration producing comet-shaped flare.
    - **Astigmatism**: Horizontal and vertical planes focus at different depths.
    - **Airy Disk / Pattern**: Central diffraction disk produced by a circular aperture.
- **In-Line Concept Checks**: 10 MCQs on mirror/lens sign conventions, calculating diopter power ($P=1/f$), virtual image conditions, and Lensmaker's equation.
- **Sample Problems**:
  - *Problem*: An object is placed $20\text{ cm}$ in front of a converging lens with focal length $10\text{ cm}$. Find the image distance and magnification.
  - *⚡ Board Exam Shortcut*: $\frac{1}{q} = \frac{1}{10} - \frac{1}{20} = \frac{1}{20} \implies q = 20\text{ cm}$. $M = -\frac{20}{20} = -1.0$ (Real, inverted, same size).
- **Exclusive Mastery Challenge Set**: 25 questions testing Snell's law, spherical mirrors, thin lenses, diopters, and optical aberrations.

---

## Unit 6: Laws, Ethics & Engineering Professional Practice

### Module GEAS-17: R.A. No. 9292 — Electronics Engineering Act of 2004
- **Source Reference**: `Notes - R. A. No. 9292 1.pdf`, `Notes - R. A. 9292 2.pdf`, `Notes - R. A. 9292 3.pdf`
- **Prerequisite Bridge**: Professional regulatory mandate. Essential legal requirement for licensure, professional practice scope, and official document sealing.
- **Atomic Definitions**:
  - **Republic Act No. 9292**: "The Electronics Engineering Law of 2004" (approved April 17, 2004 by President Gloria Macapagal-Arroyo; repealed R.A. No. 5734).
  - **Structure**: 8 Articles, 43 Sections.
    - Article I: General Provisions (Sec 1–5).
    - Article II: Professional Regulatory Board of Electronics Engineering (Sec 6–12).
    - Article III: Examination, Registration and Licensure (Sec 13–26).
    - Article IV: Practice of PECE, ECE and ECT (Sec 27–30).
    - Article V: Sundry Provisions (Sec 31–34).
    - Article VI: Penal Provision & Law Enforcement (Sec 35–36).
    - Article VII: Transitory Provisions (Sec 37–39).
    - Article VIII: Final Provisions (Sec 40–43).
  - **Categories of Practice (Sec 4 & 5)**:
    1. **Professional Electronics Engineer (PECE)**: Full professional practice, consulting, sign & seal plans/designs.
    2. **Electronics Engineer (ECE)**: Engineering principles, supervision, maintenance, management, teaching.
    3. **Electronics Technician (ECT)**: Non-engineering technical work, installation, operation, testing.
  - **Board of Electronics Engineering (Sec 6–9)**:
    - Composed of a Chairman and 2 Members under PRC supervision.
    - Appointed by the President of the Philippines from 3 recommendees per position chosen by PRC from 5 nominees submitted by the APO (**IECEP**).
    - Term of Office: 3 years, with maximum aggregate tenure not exceeding 6 years.
  - **Licensure Examination Ratings (Sec 16)**:
    - **Passed**: General average $\ge 70\%$ with no subject below $70\%$.
    - **Conditioned**: Average $\ge 70\%$ but one subject below $70\%$ (must not be lower than $60\%$). Must re-examine in that subject within 2 years.
    - Results release: Within 15 days from examination.
  - **Qualifications for PECE Registration (Sec 18)**:
    - Valid ECE license, active IECEP membership.
    - Minimum **7 years** active self-practice or responsible engineering service (with minimum **2 years** significant engineering work).
    - Endorsed by 3 PECEs and pass oral interview by the Board.
  - **Official Seals Dimensions (Sec 29)**:
    - **PECE Dry Seal**: Two concentric circles: Outer diameter $= 48\text{ mm}$, Inner diameter $= 32\text{ mm}$. Upper portion bears "PROFESSIONAL ELECTRONICS ENGINEER", bottom bears "PHILIPPINES".
    - **Board Seal**: Outer diameter $= 48\text{ mm}$, Inner diameter $= 28\text{ mm}$.
  - **Penal Provision (Sec 35)**: Fine of not less than **P100,000** nor more than **P1,000,000**, or imprisonment from **6 months to 6 years**, or both.
- **In-Line Concept Checks**: 10 MCQs on passing/conditional grade thresholds ($70\% / 60\%$), seal dimensions ($48\text{ mm} / 32\text{ mm}$), PECE 7-year experience rule, and penal fines.
- **Sample Problems**:
  - *Problem*: What are the outer and inner circle diameters of the official PECE dry seal under Section 29 of RA 9292?
  - *⚡ Board Exam Shortcut*: Outer $= 48\text{ mm}$, Inner $= 32\text{ mm}$.
- **Exclusive Mastery Challenge Set**: 25 questions testing RA 9292 articles, sections, board composition, penalties, and professional scopes.

---

### Module GEAS-18: Technopreneurship, Business Model Canvas & IP Code (R.A. 8293)
- **Source Reference**: `Notes - Technopreneurship 101 1.pdf` to `4.pdf`
- **Prerequisite Bridge**: Technology startup formation, lean business validation, accounting statements, and intellectual property legal protection.
- **Atomic Definitions**:
  - **Technopreneurship**: Application of innovative technology-driven solutions to create, scale, and build sustainable business ventures.
  - **Business Life Cycle Stages**: Startup (Discovery/Resourcing) $\to$ Launch $\to$ Growth $\to$ Maturity $\to$ Harvest $\to$ Rebirth or Exit.
  - **Business Model Canvas (BMC - Osterwalder & Pigneur)**: 9 Building Blocks:
    1. Customer Segments, 2. Value Proposition, 3. Channels, 4. Customer Relationships, 5. Revenue Streams, 6. Key Resources, 7. Key Activities, 8. Key Partnerships, 9. Cost Structure.
  - **Lean Model Canvas (LMC - Ash Maurya)**: Startup-focused adaptation replacing 4 blocks with: **Problem**, **Solution**, **Key Metrics (KPIs)**, and **Unfair Advantage**.
  - **Financing Modes**:
    - Bootstrapping (self-funded), Debt Financing (loans/interest), Equity Financing (shares/investors/VC/angel), Grants, IPO (Initial Public Offering).
  - **Accounting Principles & Double-Entry Equation**:
    $$\text{Assets} = \text{Liabilities} + \text{Owner's Equity}$$
    - Income Statement (P&L): $\text{Net Income} = \text{Revenue} - \text{Expenses}$.
    - Balance Sheet: Snapshot of Assets, Liabilities, and Equity at a specific point in time.
    - Cash Flow Statement: Operating, Investing, and Financing cash flows.
    - Financial Metrics: Gross Profit, Net Income, Burn Rate (rate of spending cash reserves), Run Rate.
  - **Intellectual Property Code of the Philippines (Republic Act No. 8293)**:
    - Approved: June 6, 1997; Effective: January 1, 1998.
    - **Terms of IP Protection**:
      - **Invention Patent**: **20 years** from filing date (non-renewable).
      - **Utility Model**: **7 years** from filing date (non-renewable).
      - **Industrial Design**: **5 years**, renewable for up to 2 consecutive 5-year periods (maximum **15 years** total).
      - **Trademark**: **10 years**, renewable indefinitely for 10-year periods upon filing Declaration of Actual Use (DAU).
      - **Copyright**: **Lifetime of the author + 50 years** after death.
      - **Trade Secrets**: Protected indefinitely as long as confidentiality is maintained.
- **In-Line Concept Checks**: 10 MCQs on IP protection durations (Patent 20 yrs, UM 7 yrs, Copyright Life+50), accounting equation, and BMC vs Lean Canvas components.
- **Sample Problems**:
  - *Problem*: Under RA 8293, what is the term of protection for a registered Utility Model?
  - *⚡ Board Exam Shortcut*: Utility Model $= 7\text{ years}$ (non-renewable).
- **Exclusive Mastery Challenge Set**: 25 questions testing technopreneurship concepts, financial statements, BMC blocks, and RA 8293 IP terms.

---

## Unit 7: Engineering Thermodynamics

### Module GEAS-19: Thermodynamic Systems, Temperature Scales & Thermal Expansion
- **Source Reference**: `Notes - Thermodynamics 1.pdf`, `Notes - Thermodynamics 2.pdf`
- **Prerequisite Bridge**: Microscopic molecular thermal kinetic energy to macroscopic temperature and state variables.
- **Atomic Definitions**:
  - **Thermodynamics**: Derived from Greek *therme* (heat) and *dynamis* (power), term coined by James Prescott Joule (1849). Nicolas Sadi Carnot regarded as the "Father of Thermodynamics" (1824, *Reflections on the Motive Power of Fire*).
  - **Thermodynamic System & Boundaries**:
    - **Open System (Control Volume)**: Both mass and energy cross the boundary (e.g., turbine, compressor, nozzle).
    - **Closed System (Control Mass)**: Energy crosses boundary, but mass does NOT cross (e.g., piston-cylinder without valves).
    - **Isolated System**: Neither mass nor energy crosses boundary (e.g., rigid insulated thermos).
    - **Diathermic System**: Boundary allows heat energy transmission.
    - **Adiabatic System**: Boundary is thermally insulated; no heat enters or leaves ($Q = 0$).
  - **Temperature Scales & Fixed Points**:
    - Celsius ($^\circ\text{C}$): Anders Celsius; $0^\circ\text{C}$ freezing, $100^\circ\text{C}$ boiling.
    - Fahrenheit ($^\circ\text{F}$): Daniel Gabriel Fahrenheit; $32^\circ\text{F}$ freezing, $212^\circ\text{F}$ boiling.
    - Kelvin ($\text{K}$): Lord Kelvin (William Thomson); absolute scale: $T_K = T_C + 273.15$.
    - Rankine ($^\circ\text{Ra}$): William Rankine; absolute Fahrenheit scale: $T_{\text{Ra}} = T_F + 459.67 = 1.8 T_K$.
    - Conversions: $T_F = \frac{9}{5}T_C + 32$, $T_C = \frac{5}{9}(T_F - 32)$.
  - **Thermal Expansion**:
    - Linear Expansion: $\Delta L = \alpha L_0 \Delta T$.
    - Volume Expansion: $\Delta V = \beta V_0 \Delta T \approx 3\alpha V_0 \Delta T$.
  - **Heat & Sensible vs Latent Heat**:
    - Sensible Heat (temperature changes): $Q = m c \Delta T = C \Delta T$.
    - Latent Heat (phase change at constant $T$): $Q = \pm m L$.
      - Latent Heat of Fusion of Water: $L_f = 333.5\text{ kJ/kg} = 79.7\text{ cal/g} = 143.4\text{ BTU/lbm}$.
      - Latent Heat of Vaporization of Water: $L_v = 2256.7\text{ kJ/kg} = 539.1\text{ cal/g} = 970.3\text{ BTU/lbm}$.
- **In-Line Concept Checks**: 8 MCQs on open vs closed vs isolated systems, absolute temperature conversions, and latent vs sensible heat.
- **Sample Problems**:
  - *Problem*: At what temperature do the Celsius and Fahrenheit scales read the exact same numerical value?
  - *⚡ Board Exam Shortcut*: $X = \frac{9}{5}X + 32 \implies -\frac{4}{5}X = 32 \implies X = -40^\circ$.
- **Exclusive Mastery Challenge Set**: 25 questions testing thermodynamic system boundaries, temperature conversions, thermal expansion, and latent heat.

---

### Module GEAS-20: Heat Transfer Modes, Kinetic Gas Theory & Radiation Laws
- **Source Reference**: `Notes - Thermodynamics 3.pdf`, `Notes - Thermodynamics 4.pdf`
- **Prerequisite Bridge**: Heat conduction, convection, and electromagnetic Stefan-Boltzmann blackbody radiation.
- **Atomic Definitions**:
  - **Modes of Heat Transfer**:
    1. **Conduction (Fourier's Law, Jean-Baptiste Fourier)**: Molecular energy transfer through solid matter:
       $$\frac{Q}{t} = k A \frac{\Delta T}{L} = \frac{A \Delta T}{R_{\text{thermal}}}$$
       where $k$ is thermal conductivity ($\text{W}/(\text{m}\cdot\text{K})$) and thermal resistance $R_{\text{thermal}} = L/k$.
    2. **Convection (Newton's Law of Cooling)**: Bulk fluid motion carrying thermal energy:
       $$\frac{Q}{t} = h A \Delta T$$
       where $h$ is convective heat transfer coefficient ($\text{W}/(\text{m}^2\cdot\text{K})$).
    3. **Radiation (Stefan-Boltzmann Law)**: Electromagnetic radiation without requiring physical medium:
       $$\frac{Q}{t} = P = \sigma \epsilon A T^4, \quad P_{\text{net}} = \sigma \epsilon A (T_2^4 - T_1^4)$$
       where $\sigma = 5.670374 \times 10^{-8}\text{ W}/(\text{m}^2\cdot\text{K}^4)$ (Stefan-Boltzmann constant), $\epsilon$ is emissivity ($0 \le \epsilon \le 1$, $\epsilon = 1$ for perfect Blackbody, term coined by Gustav Kirchhoff 1860).
  - **Kinetic Molecular Theory of Gases**:
    - Gas consists of large number of tiny particles in continuous random motion undergoing elastic collisions.
    - Mean Translational Kinetic Energy: $\overline{\text{KE}} = \frac{1}{2}m v_{\text{rms}}^2 = \frac{3}{2}k_B T$.
    - RMS Velocity: $v_{\text{rms}} = \sqrt{\frac{3 k_B T}{m}} = \sqrt{\frac{3 R T}{M}}$.
    - Boltzmann Constant: $k_B = 1.380649 \times 10^{-23}\text{ J/K}$.
  - **Brownian Movement (Robert Brown 1827)**: Random microscopic zigzag movement of particles suspended in fluid.
- **In-Line Concept Checks**: 8 MCQs on Stefan-Boltzmann $T^4$ proportionality, thermal resistance formula ($L/k$), and RMS gas molecular speed equations.
- **Sample Problems**:
  - *Problem*: If the absolute temperature of a radiating blackbody is doubled, by what factor does its radiated power increase?
  - *⚡ Board Exam Shortcut*: $P \propto T^4 \implies 2^4 = 16\text{ times}$.
- **Exclusive Mastery Challenge Set**: 25 questions testing conduction, convection, Stefan-Boltzmann radiation, and kinetic molecular theory.

---

### Module GEAS-21: The Four Laws of Thermodynamics & Polytropic Gas Processes
- **Source Reference**: `Notes - Thermodynamics 4.pdf`, `Notes - Thermodynamics 5.pdf`
- **Prerequisite Bridge**: Macroscopic conservation of energy, entropy directionality, and ideal gas work integrals.
- **Atomic Definitions**:
  - **The Four Laws of Thermodynamics**:
    - **Zeroth Law (Thermal Equilibrium)**: If bodies A and B are each in thermal equilibrium with a third body C, then A and B are in thermal equilibrium with each other (defines Temperature).
    - **First Law (Conservation of Energy)**:
      $$\Delta U = Q - W \iff Q = \Delta U + W$$
    - **Second Law (Entropy & Direction of Spontaneous Processes)**: Total entropy of an isolated system always increases over time ($\Delta S \ge 0$).
      - Clausius Statement: Heat cannot spontaneously flow from cold to hot without external work.
      - Kelvin-Planck Statement: It is impossible to construct a heat engine operating in a cycle that produces net work while exchanging heat with only a single thermal reservoir.
    - **Third Law (Absolute Zero)**: The entropy of a pure, perfect crystalline substance approaches exactly zero as temperature approaches absolute zero ($0\text{ K}$).
  - **Polytropic Processes ($P V^n = C$)**:
    1. **Isobaric Process ($n = 0 \implies P = C$)**:
       $$W = P(V_2 - V_1), \quad Q = m c_p \Delta T = \Delta H$$
    2. **Isothermal Process ($n = 1 \implies T = C$)**:
       $$\Delta U = 0, \quad Q = W = P_1 V_1 \ln\left(\frac{V_2}{V_1}\right) = m R T \ln\left(\frac{P_1}{P_2}\right)$$
    3. **Isentropic / Reversible Adiabatic Process ($n = k = c_p/c_v \implies Q = 0$)**:
       $$\Delta U = -W, \quad P_1 V_1^k = P_2 V_2^k, \quad W = \frac{P_1 V_1 - P_2 V_2}{k - 1}$$
    4. **Isometric / Isochoric Process ($n = \infty \implies V = C$)**:
       $$W = 0, \quad Q = \Delta U = m c_v \Delta T$$
    5. **General Polytropic Process ($P V^n = C$)**:
       $$W = \frac{P_1 V_1 - P_2 V_2}{n - 1}, \quad c_n = c_v \left(\frac{n - k}{n - 1}\right), \quad Q = m c_n \Delta T$$
    6. **Throttling Process (Joule-Thomson)**: Adiabatic pressure drop at constant enthalpy ($\Delta H = 0$).
- **In-Line Concept Checks**: 10 MCQs on identifying polytropic exponent $n$, First Law energy balance ($Q = \Delta U + W$), and work in isochoric ($W=0$) vs isothermal processes.
- **Sample Problems**:
  - *Problem*: In an isochoric (constant volume) process, $500\text{ J}$ of heat is added to a closed gas system. How much work is done and what is the change in internal energy?
  - *⚡ Board Exam Shortcut*: $W = 0 \implies \Delta U = Q = +500\text{ J}$.
- **Calculator Technique**: Evaluating logarithmic and exponential ratios for polytropic work.
- **Exclusive Mastery Challenge Set**: 25 questions testing all four laws of thermodynamics, entropy, and polytropic process calculations.

---

## Complete GEAS Module Catalog

| Module Code | Topic Title | Source Note Reference | Companion Mastery Test ID |
| :--- | :--- | :--- | :--- |
| **GEAS-01** | Chemistry Foundations, Scientific Method, Matter & SI Units | `Notes - Chemistry 1, 2.pdf` | `mastery-geas-01-chemistry-foundations` |
| **GEAS-02** | Atomic Structure, Quantum Numbers & Historical Atomic Models | `Notes - Chemistry 3, 4, 5.pdf` | `mastery-geas-02-atomic-structure` |
| **GEAS-03** | Periodic Table, Periodic Trends, Compounds & Nomenclature | `Notes - Chemistry 6, 7.pdf` | `mastery-geas-03-periodic-table` |
| **GEAS-04** | Mole Concept, Stoichiometry, Chemical Reactions & Gas Laws | `Notes - Chemistry 8, 9.pdf` | `mastery-geas-04-stoichiometry-gases` |
| **GEAS-05** | Solutions, Concentration Units, Acids, Bases & Colloids | `Notes - Chemistry 10.pdf` | `mastery-geas-05-solutions-acids-bases` |
| **GEAS-06** | Time Value of Money, Interest Rates, Inflation & Discount | `Notes - Engineering Economics 1.pdf` | `mastery-geas-06-interest-time-value` |
| **GEAS-07** | Annuities, Perpetuities & Asset Depreciation Methods | `Notes - Engineering Economics 2.pdf` | `mastery-geas-07-annuities-depreciation` |
| **GEAS-08** | Engineering Materials, Alloys & Mechanical Properties | `Notes - MSE 1, 2.pdf` | `mastery-geas-08-mse-alloys-properties` |
| **GEAS-09** | Magnetic, Optical, Electrical Properties & Crystallography | `Notes - MSE 2, 3, 4.pdf` | `mastery-geas-09-mse-crystals-magnetic` |
| **GEAS-10** | Statics of Rigid Bodies, Force Vectors & Equilibrium | `Notes - Physics Mechanics 1.pdf` | `mastery-geas-10-statics-equilibrium` |
| **GEAS-11** | Friction Mechanics, Centroids & Second Moment of Area | `Notes - Physics Mechanics 2.pdf` | `mastery-geas-11-friction-inertia` |
| **GEAS-12** | Kinematics: Rectilinear Translation, Projectiles & Banking | `Notes - Physics Mechanics 3, 4.pdf` | `mastery-geas-12-kinematics-projectiles` |
| **GEAS-13** | Newton's Laws, Universal Gravitation, Impulse & Restitution | `Notes - Physics 1, 2.pdf` | `mastery-geas-13-newton-momentum` |
| **GEAS-14** | Periodic Motion, Simple Pendulums & Wave Mechanics | `Notes - Physics 3.pdf` | `mastery-geas-14-periodic-motion-waves` |
| **GEAS-15** | Acoustics, Sound Intensity, Decibels & Doppler Effect | `Notes - Physics 4, 5.pdf` | `mastery-geas-15-acoustics-sound-doppler` |
| **GEAS-16** | Geometric Optics, Mirrors, Thin Lenses & Lensmaker's Eq | `Notes - Physics 5, 6.pdf` | `mastery-geas-16-optics-mirrors-lenses` |
| **GEAS-17** | R.A. No. 9292 — Electronics Engineering Act of 2004 | `Notes - RA 9292 1, 2, 3.pdf` | `mastery-geas-17-ra-9292-law` |
| **GEAS-18** | Technopreneurship, Business Canvas & IP Code (RA 8293) | `Notes - Technopreneurship 1-4.pdf` | `mastery-geas-18-technopreneurship-ip` |
| **GEAS-19** | Thermodynamic Systems, Temperature Scales & Expansion | `Notes - Thermodynamics 1, 2.pdf` | `mastery-geas-19-thermo-systems-temp` |
| **GEAS-20** | Heat Transfer Modes, Kinetic Gas Theory & Radiation | `Notes - Thermodynamics 3, 4.pdf` | `mastery-geas-20-heat-transfer-kinetic` |
| **GEAS-21** | Laws of Thermodynamics & Polytropic Gas Processes | `Notes - Thermodynamics 4, 5.pdf` | `mastery-geas-21-thermo-laws-polytropic` |
