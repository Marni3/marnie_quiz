# Detailed Interactive Learning Modules Syllabus: GENERAL ENGINEERING & APPLIED SCIENCES (GEAS 01 to GEAS 12)

> **Philippine ECE Licensure Examination • GEAS Domain (20% Board Weight)**
> Formatted according to the `learning-module-authoring` skill standards.
> Reference Grounding: `Reference Documents/GEAS/Notes - Chemistry 1–10.pdf`, `Physics 1–6.pdf`, `Engineering Economics 1–2.pdf`, `Thermodynamics 1–5.pdf`, `Material Science 1–4.pdf`, `R.A. 9292 1–3.pdf`, `Technopreneurship 1–4.pdf`.

---

## GEAS 01: Chemistry for Engineers (13 Subtopic Modules)
- **Overview & Subject Links**:
  - Atomic structure, chemical bonding, stoichiometry, gas laws, thermochemistry, electrochemistry, and nuclear chemistry.
  - *Cross-Subject Connections*: Bridge to `GEAS 09` (Material Science) and `ELEC 06` (Semiconductor valence electrons).

### Granular Module Blueprints:
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GEAS 01-01` | **Matter, Atomic Structure & Periodic Table** | *"Atomic number $Z$ is proton count; valence electrons determine chemical reactivity; electronegativity increases up and right."* | Electron configuration orbital filling rules. | Interactive Periodic Table element inspector with electronegativity heat map. | `ELEC-06` Silicon & Germanium Group IV structure. |
| `GEAS 01-02` | **Chemical Formulas, Naming & Moles** | *"1 mole $= 6.022 	imes 10^{23}$ particles; molar mass in grams contains 1 mole of substance ($n = m/M$)."* | Molar mass accumulation in memory `[M+]`. | Mole-to-Gram interactive dimensional analysis stepper. | `GEAS-09` Crystal lattice density. |
| `GEAS 01-03` | **Stoichiometry & Limiting Reactants** | *"The limiting reactant is the one that produces the least amount of product; excess reactant is left over."* | Linear equation solve for stoichiometric proportions. | Dual-reactant balance slider showing remaining excess mass. | `GEAS-05` Combustion reactions. |
| `GEAS 01-04` | **Ideal Gas Laws & Real Gases** | *"Ideal Gas Law $PV = nRT$; pressure is force per area; absolute temperature in Kelvin MUST be used ($K = ^\circ	ext{C} + 273.15$)."* | Universal gas constant $R = 8.314	ext{ J/(mol}\cdot	ext{K)} = 0.08206	ext{ L}\cdot	ext{atm/(mol}\cdot	ext{K)}$. | Interactive P-V-T gas chamber piston with temperature flame. | `GEAS-05` Thermodynamic state equations. |
| `GEAS 01-05` | **Solutions, Concentration & Colligative Properties** | *"Molarity $M = 	ext{mol/L}$; Molality $m = 	ext{mol/kg}$; adding solute lowers vapor pressure and raises boiling point ($\Delta T_b = K_b m i$)."* | Colligative property van 't Hoff factor multiplier. | Freezing point depression / boiling point elevation slider. | `MATH-01` Mixture word problems. |
| `GEAS 01-06` | **Chemical Equilibrium & Le Chatelier's Principle** | *"Le Chatelier: If stress is applied to a system at equilibrium, the system shifts in direction that relieves the stress."* | Equilibrium constant $K_{eq} = rac{[C]^c [D]^d}{[A]^a [B]^b}$. | Dynamic Equilibrium reaction vessel with stress perturbators. | `ELEC-06` Dynamic charge equilibrium. |
| `GEAS 01-07` | **Acids, Bases, pH & Buffers** | *"$	ext{pH} = -\log[H^+]$; $	ext{pH} + 	ext{pOH} = 14$; strong acids dissociate 100%, weak acids reach equilibrium ($K_a$)."* | **Karce**: Direct evaluation of $-\log(x)$ using `[log]`. | Acid-base titration curve visualizer with equivalence point. | `MATH-01` Logarithmic applications. |
| `GEAS 01-08` | **Electrochemistry & Galvanic Cells** | *"AN OX / RED CAT: Oxidation occurs at Anode; Reduction occurs at Cathode; $E^\circ_{	ext{cell}} = E^\circ_{	ext{cat}} - E^\circ_{	ext{an}}$."* | Nernst equation calculation: $E = E^\circ - rac{0.0592}{n}\log Q$. | Interactive Galvanic Cell with live voltmeter and electron flow. | `ELEC-01` Battery internal EMF and charging. |
| `GEAS 01-09` | **Thermochemistry & Hess's Law** | *"Enthalpy $\Delta H < 0 \implies$ Exothermic (releases heat); $\Delta H > 0 \implies$ Endothermic (absorbs heat)."* | Hess's law linear equation summation. | Reaction enthalpy energy barrier diagram. | `GEAS-05` Heat engine enthalpy. |
| `GEAS 01-10` | **Chemical Kinetics & Rate Laws** | *"Reaction rate depends on activation energy $E_a$ and temperature (Arrhenius equation $k = A e^{-E_a/RT}$)."* | Arrhenius exponential ratio solver. | Reaction rate collision particle animator. | `MATH-12` Reaction rate differential equations. |
| `GEAS 01-11` | **Nuclear Chemistry & Radioactive Decay** | *"Half-life formula: $N(t) = N_0 (1/2)^{t/t_{1/2}} = N_0 e^{-\lambda t}$; alpha particle is $^4_2	ext{He}$, beta is $^0_{-1}e$."* | Half-life ratio shortcut in `[CALC]`. | Radioactive isotope decay half-life countdown clock. | `MATH-12` Exponential decay ODEs. |
| `GEAS 01-12` | **Organic Chemistry & Polymers** | *"Alkanes ($C_n H_{2n+2}$), Alkenes ($C_n H_{2n}$), Alkynes ($C_n H_{2n-2}$); functional groups dictate properties."* | Polymer monomer identification tables. | 3D molecular structure visualizer for hydrocarbons. | `GEAS-09` Dielectric polymer insulation. |
| `GEAS 01-13` | **Environmental Chemistry & Corrosion** | *"Corrosion is an electrochemical oxidation; sacrificial anodes (zinc) protect iron by corroding preferentially."* | Faraday's law of electrolysis $m = rac{I t M}{n F}$. | Sacrificial anode cathodic protection simulator. | `GEAS-11` Environmental pollution and corrosion. |

---

## GEAS 02: Physics 1 — Mechanics (14 Subtopic Modules)
- **Key Modules**:
  - `GEAS 02-01` Vectors, Components & Resultants ($\mathbf{R} = \sum \mathbf{F}$).
  - `GEAS 02-02` Statics of Particles & Coplanar Force Systems ($\sum F_x = 0, \sum F_y = 0$).
  - `GEAS 02-03` Moments, Torques & Varignon's Theorem ($\sum M_O = 0$).
  - `GEAS 02-04` Trusses: Method of Joints & Method of Sections.
  - `GEAS 02-05` Dry Friction & Angle of Repose ($F_f \le \mu_s N, 	an	heta_s = \mu_s$).
  - `GEAS 02-06` 1D Kinematics: Uniform Acceleration ($v = v_0 + at, s = v_0 t + rac{1}{2}at^2, v^2 = v_0^2 + 2as$).
  - `GEAS 02-07` 2D Projectile Motion (Trajectory, Max Height $H = rac{v_0^2\sin^2	heta}{2g}$, Range $R = rac{v_0^2\sin 2	heta}{g}$).
  - `GEAS 02-08` Newton's Laws of Motion & Free Body Diagrams ($\mathbf{F} = m\mathbf{a}$).
  - `GEAS 02-09` Work, Kinetic Energy & Conservation of Mechanical Energy ($W = \Delta KE$).
  - `GEAS 02-10` Impulse, Momentum & Elastic/Inelastic Collisions ($J = \Delta p, e = rac{v_2' - v_1'}{v_1 - v_2}$).
  - `GEAS 02-11` Uniform Circular Motion & Centripetal Force ($a_c = rac{v^2}{r}$, Banked curves $	an	heta = rac{v^2}{rg}$).
  - `GEAS 02-12` Rotational Kinematics & Moment of Inertia ($	au = Ilpha, KE_{rot} = rac{1}{2}I\omega^2$).
  - `GEAS 02-13` Simple Harmonic Motion (Mass-spring $T = 2\pi\sqrt{m/k}$, Pendulum $T = 2\pi\sqrt{L/g}$).
  - `GEAS 02-14` Universal Gravitation & Kepler's Laws ($F = Grac{m_1 m_2}{r^2}, T^2 \propto r^3$).
- **Notable Visualizers**:
  - **Interactive Projectile Motion Trajectory Simulator**: Adjust launch angle $	heta \in [0^\circ, 90^\circ]$ and initial velocity $v_0$ with live apex and range markers.
  - **Method of Joints Truss Analyzer**: Click nodes on a Pratt/Warren truss to highlight tension (blue) and compression (red) members.

---

## GEAS 03: Physics 2 — Waves, Thermal & Optics (13 Subtopic Modules)
- **Key Modules**:
  - `GEAS 03-01` Fluid Statics: Density, Specific Gravity & Hydrostatic Pressure ($P = ho g h$).
  - `GEAS 03-02` Archimedes' Principle & Buoyancy ($F_b = ho_{fluid} V_{disp} g$).
  - `GEAS 03-03` Fluid Dynamics: Continuity Equation ($A_1 v_1 = A_2 v_2$) & Bernoulli's Principle ($P + rac{1}{2}ho v^2 + ho gh = 	ext{const}$).
  - `GEAS 03-04` Thermal Expansion: Linear ($\Delta L = lpha L_0 \Delta T$), Area ($\Delta A = 2lpha A_0 \Delta T$), Volumetric ($\Delta V = 3lpha V_0 \Delta T$).
  - `GEAS 03-05` Calorimetry & Heat Transfer ($Q = mc\Delta T, Q_{latent} = mL$).
  - `GEAS 03-06` Heat Transfer Mechanisms: Conduction (Fourier's law $Q/t = kArac{\Delta T}{L}$), Convection, Radiation (Stefan-Boltzmann $P = arepsilon\sigma A T^4$).
  - `GEAS 03-07` Mechanical Waves & Sound Intensity ($v = f\lambda, eta = 10\log(I/I_0)	ext{ dB}$).
  - `GEAS 03-08` Doppler Effect for Sound ($f' = f rac{v \pm v_o}{v \mp v_s}$).
  - `GEAS 03-09` Geometric Optics: Reflection & Spherical Mirrors ($rac{1}{f} = rac{1}{d_o} + rac{1}{d_i}$).
  - `GEAS 03-10` Refraction & Snell's Law ($n_1 \sin	heta_1 = n_2 \sin	heta_2$, Critical angle $\sin	heta_c = n_2/n_1$).
  - `GEAS 03-11` Thin Lenses & Optical Instruments (Magnification $m = -d_i/d_o$).
  - `GEAS 03-12` Wave Optics: Interference (Young's double slit $d\sin	heta = m\lambda$) & Diffraction.
  - `GEAS 03-13` Polarization of Light & Brewster's Law ($	an	heta_p = n_2/n_1$).
- **Notable Visualizers**:
  - **Snell's Law & Total Internal Reflection Ray Tracer**: Drag incident ray angle to observe critical angle $	heta_c$ and transition into total internal reflection.
  - **Bernoulli Pipe Flow Simulator**: Constrict pipe neck to observe fluid velocity speed up and static pressure drop.

---

## GEAS 04: Strength of Materials & Mechanics of Deformable Bodies (17 Modules)
- **Key Modules**:
  - `GEAS 04-01` Simple Stress & Strain ($\sigma = P/A, arepsilon = \delta/L$).
  - `GEAS 04-02` Hooke's Law & Modulus of Elasticity ($E = \sigma/arepsilon$, Axial deformation $\delta = rac{PL}{AE}$).
  - `GEAS 04-03` Poisson's Ratio & Thermal Stresses ($\delta_T = lpha L \Delta T, \sigma_T = Elpha\Delta T$).
  - `GEAS 04-04` Shearing Stress & Bearing Stress ($	au = V/A$).
  - `GEAS 04-05` Thin-Walled Pressure Vessels: Cylindrical ($\sigma_t = rac{p D}{2t}$) & Spherical ($\sigma_s = rac{p D}{4t}$).
  - `GEAS 04-06` Torsion of Circular Shafts ($	au = rac{Tr}{J}$, Angle of twist $	heta = rac{TL}{JG}$).
  - `GEAS 04-07` Power Transmitted by Shafts ($P = 2\pi f T = \omega T$).
  - `GEAS 04-08` Shear & Bending Moment Equations in Beams.
  - `GEAS 04-09` Shear & Moment Diagrams ($V(x)$ and $M(x)$).
  - `GEAS 04-10` Flexural Stresses in Beams (Flexure formula $\sigma = rac{M y}{I} = rac{M}{S}$).
  - `GEAS 04-11` Horizontal Shearing Stresses in Beams ($	au = rac{V Q}{I b}$).
  - `GEAS 04-12` Deflection of Beams (Double Integration Method, Moment-Area Method).
  - `GEAS 04-13` Statically Indeterminate Beams.
  - `GEAS 04-14` Combined Axial & Bending Stresses ($\sigma = \pm rac{P}{A} \pm rac{M y}{I}$).
  - `GEAS 04-15` Mohr's Circle of Plane Stress (Principal stresses $\sigma_{1,2} = rac{\sigma_x + \sigma_y}{2} \pm \sqrt{(rac{\sigma_x - \sigma_y}{2})^2 + 	au_{xy}^2}$).
  - `GEAS 04-16` Maximum In-Plane Shearing Stress ($	au_{\max} = R = rac{\sigma_1 - \sigma_2}{2}$).
  - `GEAS 04-17` Columns & Euler's Critical Buckling Load ($P_{cr} = rac{\pi^2 E I}{(K L)^2}$).
- **Notable Visualizers**:
  - **Simply Supported Beam Shear & Moment ($V$-$M$) Visualizer**: Move point loads and distributed loads to see real-time shear and moment diagrams.
  - **Interactive Mohr's Circle of Stress**: Drag stress elements ($\sigma_x, \sigma_y, 	au_{xy}$) to see Mohr's circle rotate and identify principal planes.

---

## GEAS 05: Thermodynamics (7 Subtopic Modules)
- **Key Modules**:
  - `GEAS 05-01` Thermodynamic Properties & First Law of Thermodynamics ($Q = \Delta U + W$).
  - `GEAS 05-02` Work in Quasi-Static Processes ($W = \int P\,dV$).
  - `GEAS 05-03` Ideal Gas Processes: Isobaric ($P=C$), Isochoric ($V=C$), Isothermal ($T=C, W = P_1 V_1 \ln(V_2/V_1)$), Adiabatic ($P V^k = C, Q = 0$), Polytropic ($P V^n = C$).
  - `GEAS 05-04` Second Law of Thermodynamics & Entropy ($\Delta S = \int rac{dQ}{T}$).
  - `GEAS 05-05` Heat Engines & Carnot Cycle Efficiency ($\eta_{	ext{Carnot}} = 1 - rac{T_L}{T_H} = rac{T_H - T_L}{T_H}$).
  - `GEAS 05-06` Refrigerators & Heat Pumps (Coefficient of Performance: $	ext{COP}_R = rac{Q_L}{W_{in}}, 	ext{COP}_{HP} = rac{Q_H}{W_{in}} = 	ext{COP}_R + 1$).
  - `GEAS 05-07` Power Cycles: Otto, Diesel & Rankine Cycles.
- **Notable Visualizer**: **Carnot Cycle P-V & T-S Explorer**: Drag $T_H$ and $T_L$ sliders to observe the enclosed cycle area (work output) and thermal efficiency.

---

## GEAS 06: Engineering Economics (6 Subtopic Modules)
- **Key Modules**:
  - `GEAS 06-01` Time Value of Money & Cash Flow Diagrams ($F = P(1+i)^n, P = F(1+i)^{-n}$).
  - `GEAS 06-02` Nominal vs. Effective Interest Rates ($i_{eff} = (1 + r/m)^m - 1$).
  - `GEAS 06-03` Uniform Series Annuities: Ordinary Annuity, Annuity Due, Deferred Annuity, Perpetuity ($P = A/i$).
  - `GEAS 06-04` Gradient Series: Uniform Arithmetic Gradient ($G$) & Geometric Gradient.
  - `GEAS 06-05` Depreciation Methods: Straight Line, Sum-of-the-Years'-Digits (SYD), Declining Balance, Sinking Fund.
  - `GEAS 06-06` Project Evaluation: Present Worth, Annual Worth, Rate of Return (ROR), Benefit-Cost Ratio ($B/C$).
- **Notable Visualizer**: **Cash Flow Diagram Timeline Generator**: Input cash inflows and outflows to see discounted net present value ($NPV$) curve across interest rates.

---

## GEAS 07 to GEAS 12: Specialized Engineering & Applied Sciences
- **Key Modules**:
  - `GEAS 07` Electromagnetics (Maxwell's equations, Poynting vector, plane wave impedance $\eta_0 pprox 377\,\Omega$, skin depth $\delta$).
  - `GEAS 08` ECE Laws & Ethics (R.A. 9292, Scope of ECE/PECE/ECT, CPD Law, Code of Ethics, Penal provisions).
  - `GEAS 09` Material Science & Engineering (Atomic packing factor APF, crystal lattices BCC/FCC/HCP, Miller indices, phase diagrams, semiconductor doping).
  - `GEAS 10` Computer Programming & CS Fundamentals (C/C++ syntax, pointers, data structures, algorithm complexity $O(n)$, binary operations).
  - `GEAS 11` Environmental Science & Engineering (Ecosystems, biogeochemical cycles, air/water pollution, R.A. 9003, R.A. 8749, EIA/EIS).
  - `GEAS 12` Technopreneurship 101 (Lean canvas, customer discovery, intellectual property patents/trademarks, MVP, venture finance).
