# Final Audit Pass: Conceptual Shortcuts, Missing Mental Anchors & Board TOS Taxonomy Master Addendum

> **Complete Cross-Syllabus Audit & PRC Board Table of Specifications (TOS) Alignment — August 25, 2026**
> Formatted according to the `learning-module-authoring` skill standards.
> This comprehensive document integrates:
> 1. Board exam speed intuitions, mental anchors, and calculator bypass shortcuts for hard-intuition topics.
> 2. Cross-subject mathematical & physical bridges.
> 3. **The Complete PRC ECE Board Exam Table of Specifications (TOS) Identification, Classification & "Types of X" Master Guide** (covering all 4 subjects: Mathematics 20%, GEAS 20%, Electronics Engineering 30%, Electronics Systems and Technologies 30%).

---

## 1. MATHEMATICS (20% Board Weight) — TOS Shortcuts & Advanced Concepts

### 1.1 Differential Calculus & Parametric/Partial Differentiation

#### `MATH 10-01` Limits — The "Plug-and-Pray" Hierarchy & Calculator Evaluation
- **Mental Anchor**: *"Before applying any limit technique, always try direct substitution first. If it yields a real number, that IS the answer. If you get $0/0$ or $\infty/\infty$, test on calculator at $x = 0.00001$ (or $x = 99999$)."*
- **Degree Comparison Shortcut for Polynomial Fractions**:
  - Equal degrees ($n = m$): Answer $= a_n / b_m$.
  - Numerator higher ($n > m$): Answer $= \pm\infty$.
  - Denominator higher ($n < m$): Answer $= 0$.
- **Calculator Keystroke**: Karce/Canon: Type expression into `[CALC]` $\to$ enter $X = 0.00001$ $\to$ `[=]`.

#### `MATH 10-03` Derivatives — Reverse Multiple Choice Bypass
- **Board Speed Trick**: When asked *"Find $f'(x)$"*, calculate the numerical derivative $\left.\frac{d}{dx}[f(x)]\right|_{x=2}$ using `<kbd>SHIFT</kbd> <kbd>d/dx</kbd>`. Then evaluate the 4 answer choices at $x=2$ using `[CALC]`. The matching choice is the correct derivative in 15 seconds.

#### `MATH 10-04` Parametric & Implicit Derivatives
- **Mental Anchor**: *"For parametric curves $x = f(t), y = g(t)$, the first derivative is $\frac{dy}{dx} = \frac{dy/dt}{dx/dt}$. The second derivative requires dividing by $dx/dt$ again: $\frac{d^2y}{dx^2} = \frac{\frac{d}{dt}\left(\frac{dy}{dx}\right)}{\frac{dx}{dt}}$ (never differentiate numerator and denominator separately for 2nd derivative)."*

#### `MATH 10-11` Partial Derivatives & Power-Law Error Differential Shortcut
- **Speed Shortcut**: For physical equations of the form $z = k \cdot x^a y^b w^c$, the relative percentage error is strictly:
  $$\frac{dz}{z} = a\frac{dx}{x} + b\frac{dy}{y} + c\frac{dw}{w}$$
  *Example*: In kinetic energy $K = \frac{1}{2} m v^2$, a $2\%$ error in mass and $3\%$ error in velocity yields $\% \text{error} = 1(2\%) + 2(3\%) = 8\%$. No differentiation needed.

---

### 1.2 Integral Calculus & Multiple Integrals

#### `MATH 11-03` Integration by Parts — LIATE Rule & Tabular DI Method
- **Mental Anchor**: *"LIATE Priority for selecting $u$: **L**ogarithmic > **I**nverse Trig > **A**lgebraic > **T**rigonometric > **E**xponential."*
- **Tabular DI Shortcut**: Create column $D$ (differentiating $u$ down to $0$, alternating signs $+,-,+,\dots$) and column $I$ (integrating $dv$). Multiply diagonally to write out the antiderivative directly without repeating the integration by parts formula.

#### `MATH 11-09` Wallis' Definite Integral Formula
- **Master Formula**: $\int_0^{\pi/2} \sin^m x \cos^n x\,dx = \frac{[(m-1)(m-3)\dots][(n-1)(n-3)\dots]}{(m+n)(m+n-2)\dots} \cdot \alpha$
  - If **both** $m$ and $n$ are **even**, $\alpha = \frac{\pi}{2}$.
  - If **either** $m$ or $n$ is **odd**, $\alpha = 1$.
- **Mental Anchor**: *"Even-Even gets the $\frac{\pi}{2}$ bonus; anything odd gets 1."*

#### `MATH 11-12 to 11-14` Volumes of Revolution Decision Tree
- **Method Selector**:
  - Slice is **perpendicular** ($\perp$) to axis of revolution $\implies$ **Disk / Washer Method** ($V = \pi \int (R_{outer}^2 - r_{inner}^2)\,dx$).
  - Slice is **parallel** ($\parallel$) to axis of revolution $\implies$ **Cylindrical Shell Method** ($V = 2\pi \int (\text{radius})(\text{height})\,dx$).

#### `MATH 11-22` Multiple Integrals & Jacobians (TOS Addition)
- **Coordinate Transformations**:
  - **Cartesian to Polar (2D)**: $dx\,dy = r\,dr\,d\theta$ (Jacobian $J = r$).
  - **Cartesian to Cylindrical (3D)**: $dx\,dy\,dz = r\,dr\,d\theta\,dz$.
  - **Cartesian to Spherical (3D)**: $dx\,dy\,dz = \rho^2 \sin\phi\,d\rho\,d\phi\,d\theta$ (Jacobian $J = \rho^2 \sin\phi$).
- **Board Trap**: *"Forgetting the extra factor of $r$ in polar integration or $\rho^2 \sin\phi$ in spherical integration is the #1 multiple integral trap."*

---

### 1.3 Differential Equations & Laplace Transforms

#### `MATH 12-01` 5-Second ODE Classification
- **Classification Flowchart**:
  - $f(x)\,dx + g(y)\,dy = 0 \implies$ **Separable**.
  - $y' + P(x)y = Q(x) \implies$ **1st-Order Linear** (Integrating factor $\mu = e^{\int P(x)\,dx}$, solution $y \cdot \mu = \int Q(x)\mu\,dx + C$).
  - $y' + P(x)y = Q(x)y^n \implies$ **Bernoulli** (divide by $y^n$ and substitute $v = y^{1-n}$).
  - $M\,dx + N\,dy = 0$ with $\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x} \implies$ **Exact**.

#### `MATH 12-09` Higher-Order ODE Characteristic Roots to Physical Damping
- Auxiliary equation $a r^2 + b r + c = 0$:
  - Real distinct roots $r_1 \neq r_2 \implies y = C_1 e^{r_1 x} + C_2 e^{r_2 x}$ $\to$ **Overdamped RLC** ($\zeta > 1$).
  - Repeated root $r_1 = r_2 = r \implies y = (C_1 + C_2 x)e^{rx}$ $\to$ **Critically Damped RLC** ($\zeta = 1$, fastest settle without ringing).
  - Complex roots $\alpha \pm j\beta \implies y = e^{\alpha x}(C_1 \cos\beta x + C_2 \sin\beta x)$ $\to$ **Underdamped RLC** ($\zeta < 1$, decaying oscillation).

#### `MATH 12-10` Laplace Transform Core Table (TOS Standard)
| Time Domain $f(t)$ | Laplace Domain $F(s)$ | Physical Interpretation in Circuits |
| :--- | :--- | :--- |
| $\delta(t)$ (Unit Impulse) | $1$ | Infinite spike at $t=0$; system impulse response |
| $u(t)$ (Unit Step) | $\frac{1}{s}$ | DC voltage switch-on |
| $t^n$ (Ramp / Polynomial) | $\frac{n!}{s^{n+1}}$ | Constant ramp signal |
| $e^{at}$ (Exponential Growth/Decay) | $\frac{1}{s - a}$ | $RC/RL$ natural transient discharge ($a = -1/\tau$) |
| $\sin(\omega t)$ | $\frac{\omega}{s^2 + \omega^2}$ | Undamped AC sinusoidal oscillation |
| $\cos(\omega t)$ | $\frac{s}{s^2 + \omega^2}$ | Undamped AC co-sinusoidal oscillation |
| $e^{-at}\sin(\omega t)$ | $\frac{\omega}{(s+a)^2 + \omega^2}$ | Underdamped $RLC$ transient oscillation |
| $e^{-at}\cos(\omega t)$ | $\frac{s+a}{(s+a)^2 + \omega^2}$ | Underdamped $RLC$ transient oscillation |
| $\frac{df}{dt}$ | $s F(s) - f(0^-)$ | Inductor $v_L = L \frac{di}{dt} \implies s L I(s) - L i(0^-)$ |
| $\int_0^t f(\tau)\,d\tau$ | $\frac{F(s)}{s}$ | Capacitor $v_C = \frac{1}{C}\int i\,dt \implies \frac{I(s)}{sC} + \frac{v_C(0^-)}{s}$ |

---

### 1.4 Advanced Engineering Mathematics & Special Functions (TOS Addition)

#### `MATH 13-04` Special Functions: Bessel & Legendre
- **Bessel Functions ($J_n(x)$)**:
  - Solutions to Bessel's ODE: $x^2 y'' + x y' + (x^2 - n^2)y = 0$.
  - Models cylindrical wave harmonics, circular membrane vibrations, and **FM carrier/sideband amplitudes** ($J_n(\beta)$ in `EST 03`).
- **Legendre Polynomials ($P_n(x)$)**:
  - Solutions to Legendre's ODE: $(1 - x^2)y'' - 2x y' + n(n+1)y = 0$.
  - Orthogonal on $[-1, 1]$: $\int_{-1}^1 P_m(x) P_n(x)\,dx = \frac{2}{2n+1}\delta_{mn}$. Models spherical harmonics and 3D electrostatic potentials.

#### `MATH 13-06` Vector Analysis Identities & Integral Theorems
- **Del Operations**:
  - Gradient ($\nabla \phi$): Vector pointing in direction of maximum rate of increase of scalar $\phi$; magnitude is maximum rate of change.
  - Divergence ($\nabla \cdot \mathbf{A}$): Scalar representing net outward flux per unit volume (Divergence of solenoidal field $= 0$).
  - Curl ($\nabla \times \mathbf{A}$): Vector representing rotational circulation per unit area (Curl of irrotational/conservative field $= \mathbf{0}$).
- **Vector Identities**:
  - $\nabla \times (\nabla \phi) = \mathbf{0}$ (*The curl of any gradient is identically zero*).
  - $\nabla \cdot (\nabla \times \mathbf{A}) = 0$ (*The divergence of any curl is identically zero*).
  - $\nabla \times (\nabla \times \mathbf{A}) = \nabla(\nabla \cdot \mathbf{A}) - \nabla^2 \mathbf{A}$ (Vector wave equation foundation).
- **Integral Theorems**:
  - **Green's Lemma in Plane**: $\oint_C (M\,dx + N\,dy) = \iint_R \left(\frac{\partial N}{\partial x} - \frac{\partial M}{\partial y}\right)\,dx\,dy$.
  - **Divergence Theorem (Gauss)**: $\oiint_S \mathbf{A} \cdot d\mathbf{S} = \iiint_V (\nabla \cdot \mathbf{A})\,dV$ (Connects surface flux to volume source).
  - **Stokes' Theorem**: $\oint_C \mathbf{A} \cdot d\mathbf{r} = \iint_S (\nabla \times \mathbf{A}) \cdot d\mathbf{S}$ (Connects line circulation to surface curl).

#### `MATH 13-09` Signals, DSP & Control Systems Mathematics
- **Z-Transform**: $X(z) = \sum_{n=-\infty}^\infty x[n] z^{-n}$.
  - Mapping from s-plane to z-plane: $z = e^{sT}$.
  - Stability condition: All poles must lie strictly **inside the unit circle** ($|z| < 1$).
- **Convolution**: $y[n] = x[n] * h[n] = \sum_{k=-\infty}^\infty x[k] h[n - k]$.
  - Time-domain convolution corresponds strictly to frequency-domain multiplication ($Y(z) = X(z)H(z)$).
- **Correlation**:
  - Auto-correlation ($R_{xx}(\tau) = \int x(t)x(t+\tau)\,dt$): Symmetrical about $\tau = 0$; maximum value at $\tau=0$ equals total signal energy ($E_x$).
  - Cross-correlation ($R_{xy}(\tau)$): Measures degree of similarity between two waveforms as a function of time lag $\tau$ (used in radar/sonar ranging).
- **Mason's Gain Formula for Feedback Signal Flow Graphs**:
  $$T = \frac{\sum_k P_k \Delta_k}{\Delta}$$
  - $\Delta = 1 - \sum L_1 + \sum L_2 - \sum L_3 + \dots$ ($L_1 = \text{single loop gains}$, $L_2 = \text{products of two non-touching loops}$).
- **Routh-Hurwitz Stability Criterion**:
  - Construct Routh array from characteristic polynomial $a_n s^n + a_{n-1}s^{n-1} + \dots + a_0 = 0$.
  - *Rule*: The system is stable if and only if all elements in the first column have the same sign. The number of sign changes in the first column equals the number of roots in the unstable Right-Half Plane (RHP).

---

### 1.5 Engineering Data Analysis & Design of Experiments (TOS Standard)

| EDA / Statistics Concept | Governing Formula / Definition | Board Exam Key Characteristics & Trap Notes |
| :--- | :--- | :--- |
| **Point Estimators** | Sample Mean $\bar{X} = \frac{\sum X_i}{n}$, Sample Variance $s^2 = \frac{\sum (X_i - \bar{X})^2}{n - 1}$ | Dividing by $n-1$ (Bessel's correction) makes $s^2$ an **unbiased estimator** of population variance $\sigma^2$. |
| **Z-Test vs. t-Test** | $Z = \frac{\bar{X} - \mu_0}{\sigma / \sqrt{n}}$ vs. $t = \frac{\bar{X} - \mu_0}{s / \sqrt{n}}$ with $df = n - 1$ | Use **Z-test** when population variance $\sigma^2$ is *known* or sample size is large ($n \ge 30$). Use **t-test** when $\sigma^2$ is *unknown* and $n < 30$. |
| **Confidence Intervals** | $\text{CI} = \bar{X} \pm Z_{\alpha/2} \left(\frac{\sigma}{\sqrt{n}}\right)$ | Standard critical values: $90\% \implies Z = 1.645$, $95\% \implies Z = 1.96$, $99\% \implies Z = 2.576$. |
| **Linear Regression & Correlation ($r$)** | $r = \frac{n\sum XY - (\sum X)(\sum Y)}{\sqrt{[n\sum X^2 - (\sum X)^2][n\sum Y^2 - (\sum Y)^2]}}$ | $r \in [-1, +1]$. $r = +1$ (perfect positive linear), $r = 0$ (no linear correlation). Coefficient of determination $R^2 = r^2$ ($=\%$ of variance explained by $X$). |
| **ANOVA (Analysis of Variance)** | $F = \frac{\text{Mean Square Between (MSB)}}{\text{Mean Square Within (MSW)}} = \frac{s_{between}^2}{s_{within}^2}$ | Used to test whether means of **three or more independent groups** are statistically equal (F-distribution). |

---

## 2. GENERAL ENGINEERING & APPLIED SCIENCES (20% Board Weight)

### 2.1 Physics 1 & 2 (Mechanics, Waves, Thermodynamics & Optics)

| Physics Domain | Key Governing Laws & Formulas | Definitive Board Exam Key Insights |
| :--- | :--- | :--- |
| **Work, Energy & Momentum** | Work $W = \int \mathbf{F} \cdot d\mathbf{r}$, Impulse $\mathbf{J} = \int \mathbf{F}\,dt = \Delta \mathbf{p}$, Conservation of Momentum | In **elastic collisions**, both momentum AND kinetic energy are conserved ($e = 1$). In **inelastic collisions**, only momentum is conserved ($0 \le e < 1$). In **perfectly inelastic**, objects stick together ($e = 0$, maximum kinetic energy lost to deformation/heat). |
| **Rotational Dynamics & Moments of Inertia** | $\tau = I \alpha$, $L = I \omega$, $K_{rot} = \frac{1}{2}I\omega^2$<br>- Solid Cylinder/Disk: $I = \frac{1}{2}MR^2$<br>- Thin Hoop/Ring: $I = MR^2$<br>- Solid Sphere: $I = \frac{2}{5}MR^2$<br>- Thin Rod (center): $I = \frac{1}{12}ML^2$, (end): $I = \frac{1}{3}ML^2$ | Parallel Axis Theorem: $I = I_{cm} + M d^2$. A solid sphere rolls down an incline faster than a solid cylinder, which rolls faster than a hollow hoop (smallest fraction of $MR^2$ wins). |
| **Elasticity Moduli** | Young's Modulus $E = \frac{\sigma}{\epsilon}$, Shear Modulus $G = \frac{\tau}{\gamma}$, Bulk Modulus $K = -\frac{\Delta P}{\Delta V / V}$, Poisson's Ratio $\nu = -\frac{\epsilon_{trans}}{\epsilon_{axial}}$ | Elastic relation: $E = 2G(1 + \nu) = 3K(1 - 2\nu)$. Typical Poisson's ratio for engineering metals $\approx 0.25 - 0.35$. Rubber $\approx 0.5$ (incompressible). |
| **Heat Transfer Modes** | **Conduction**: $q = -k A \frac{dT}{dx}$ (Fourier's Law)<br>**Convection**: $q = h A (T_s - T_\infty)$ (Newton's Law of Cooling)<br>**Radiation**: $E = \epsilon \sigma A T^4$ ($\sigma = 5.67 \times 10^{-8}\text{ W/m}^2\text{K}^4$) | Radiation heat transfer is proportional to the **fourth power of absolute temperature** in Kelvin ($T^4$). If absolute temperature doubles, radiated heat increases by $2^4 = 16$ times. |
| **Optics & Refraction** | Snell's Law $n_1 \sin\theta_1 = n_2 \sin\theta_2$, Critical Angle $\sin\theta_c = \frac{n_2}{n_1}$, Lensmaker's Equation $\frac{1}{f} = (n - 1)\left(\frac{1}{R_1} - \frac{1}{R_2}\right)$ | Total Internal Reflection (TIR) occurs only when light travels from a **denser medium to a rarer medium** ($n_1 > n_2$) at an incident angle $\theta_i > \theta_c$. Basis of optical fibers (`EST 07`). |

---

### 2.2 Chemistry for Engineers, Nanomaterials & Environmental Science (TOS Standard)

| Domain | Key Classification / Concept | Definitive Board Exam Key Insights |
| :--- | :--- | :--- |
| **Chemistry of Nanomaterials** | **Fullerenes ($C_{60}$ / Buckyballs)**: Spherical carbon cage structure consisting of 12 pentagons and 20 hexagons.<br>**Carbon Nanotubes (CNTs)**: Cylindrical rolled graphene sheets; Single-Walled (SWCNT) vs Multi-Walled (MWCNT); armchair (metallic), zigzag/chiral (semiconducting); tensile strength $\approx 100\times$ steel.<br>**Graphene**: Single 2D layer of carbon atoms in a hexagonal honeycomb lattice; $sp^2$ hybridization; ballistic electron mobility $>200,000\text{ cm}^2/\text{V}\cdot\text{s}$. | Question: *"A 2D single-atom-thick sheet of carbon atoms bonded in a honeycomb crystal lattice is known as:"* $\to$ **Graphene**. |
| **Environmental Crises & Atmospheric Chemistry** | **Ozone Depletion**: Chlorofluorocarbons (CFCs) release chlorine free radicals ($Cl\cdot$) under solar UV radiation, catalytically destroying stratospheric ozone: $Cl\cdot + O_3 \to ClO\cdot + O_2$.<br>**Greenhouse Effect**: Trapping of terrestrial infrared radiation by greenhouse gases ($CO_2, CH_4, N_2O, CFCs, SF_6, H_2O\text{ vapor}$). $SF_6$ has the highest Global Warming Potential (GWP $\approx 23,500\times CO_2$).<br>**Acid Rain**: Caused by atmospheric sulfur dioxide ($SO_2$) and nitrogen oxides ($NO_x$) forming $H_2SO_4$ and $HNO_3$; rain with $pH < 5.6$.<br>**EIA / ECC**: Environmental Impact Assessment (EIA) under PD 1586; Environmental Compliance Certificate (ECC) issued by DENR-EMB. | Question: *"Which industrial insulating gas utilized in high-voltage circuit breakers possesses the highest global warming potential?"* $\to$ **Sulfur Hexafluoride ($SF_6$)**. |

---

### 2.3 Materials Science, Ceramics, Polymers & Composites (TOS Standard)

| Material Class | Microstructure & Properties | Definitive Board Exam Key Insights |
| :--- | :--- | :--- |
| **Ceramics** | Inorganic, non-metallic compounds of metallic and non-metallic elements formed by ionic/covalent bonds; high melting temperatures, high hardness, high compressive strength, low electrical and thermal conductivity, brittle.<br>**Piezoelectric Ceramics**: Barium Titanate ($BaTiO_3$), Lead Zirconate Titanate (PZT); generates voltage under mechanical stress. | Question: *"What ceramic material is widely used as a piezoelectric transducer for converting mechanical pressure into electrical signals?"* $\to$ **PZT (Lead Zirconate Titanate)**. |
| **Polymers** | Long-chain organic molecules synthesized from monomer repeat units via addition or condensation polymerization.<br>**Thermoplastics**: Linear or branched polymer chains held by weak Van der Waals forces; soften when heated and harden when cooled; **recyclable** (e.g., Polyethylene, PVC, PTFE/Teflon, Polystyrene).<br>**Thermosetting Polymers**: Highly cross-linked 3D covalent network; permanently harden upon initial curing; do NOT melt upon heating (char and decompose); **non-recyclable** (e.g., Epoxy, Bakelite, Phenolic resins).<br>**Elastomers**: Coiled polymer chains with light cross-linking exhibiting large reversible elastic deformation (e.g., Natural rubber, Neoprene, Silicone). | Question: *"Polymers that soften reversibly upon heating and can be repeatedly reshaped and recycled are classified as:"* $\to$ **Thermoplastics**. |
| **Composites** | Multi-phase materials consisting of a continuous **Matrix** (polymer, metal, or ceramic) and a dispersed **Reinforcement** (fibers or particles) providing superior strength-to-weight ratio.<br>- **CFRP**: Carbon Fiber Reinforced Polymer (aerospace, high stiffness).<br>- **GFRP**: Glass Fiber Reinforced Polymer / Fiberglass (electrical enclosures, radomes). | Reinforcing fibers carry the primary load; the matrix phase transfers the load to the fibers and protects them from environmental degradation. |

---

### 2.4 Computer Programming, OOP, UML & CAD (TOS Standard)

| Domain | Key Classification / Concept | Definitive Board Exam Key Characteristics |
| :--- | :--- | :--- |
| **4 Pillars of Object-Oriented Programming** | **Encapsulation**: Bundling data (attributes) and methods that operate on that data into a single unit (class) while restricting direct access via access modifiers (`private`, `protected`, `public`).<br>**Abstraction**: Hiding internal implementation details and exposing only the essential interface to the user.<br>**Inheritance**: Mechanism where a child/derived class inherits attributes and behaviors from a parent/base class (`extends`).<br>**Polymorphism**: Ability of a message or function call to be processed in more than one form:<br>- *Compile-time (Static)*: Method Overloading (same name, different parameter signature).<br>- *Runtime (Dynamic)*: Method Overriding (subclass provides specific implementation of parent virtual method). | Questions testing definitions of the 4 OOP pillars are standard in `GEAS 10`. |
| **UML Diagrams (Unified Modeling Language)** | **Structural Diagrams**: Class Diagram (classes, attributes, operations, relationships), Object Diagram, Component Diagram, Deployment Diagram.<br>**Behavioral Diagrams**: Use Case Diagram (actors and system interactions), Sequence Diagram (time-ordered message exchanges between objects), Activity Diagram (flowchart of business/control flow), State Machine Diagram (states and transitions). | Question: *"Which UML diagram shows the time sequence of messages exchanged between objects to carry out a specific functionality?"* $\to$ **Sequence Diagram**. |
| **CAD Drawing Environments & Object Snaps** | **Coordinate Systems**: Absolute Cartesian ($X, Y$), Relative Cartesian ($@\Delta X, \Delta Y$), Relative Polar ($@R < \theta$).<br>**Osnap Modes**: Endpoint, Midpoint, Center, Intersection, Node, Perpendicular, Tangent, Quadrant.<br>**Dimensioning & Plotting**: Model Space ($1:1$ true geometry) vs Paper Space / Layout (scaled viewports and title blocks for printing). | Question: *"In AutoCAD, entering coordinate `@5<45` represents:"* $\to$ **Relative Polar Coordinate (distance 5 units at an angle of 45 degrees from last point)**. |

---

### 2.5 Engineering Management, Technopreneurship 101 & Professional Ethics (TOS Standard)

| Domain | Classification / Functions | Definitive Board Exam Key Insights |
| :--- | :--- | :--- |
| **Functions of Management (POLC)** | **Planning**: Setting goals, establishing strategies, and developing action plans.<br>**Organizing**: Allocating resources, defining organizational structure, assigning tasks, and establishing reporting hierarchy.<br>**Leading / Directing**: Motivating employees, guiding communication, and resolving conflicts.<br>**Controlling**: Monitoring performance, comparing against standards, and taking corrective actions. | Classical Management: **Henri Fayol** (14 Principles of Management, Administrative Theory); **Frederick W. Taylor** (Father of Scientific Management, time-and-motion studies); **Max Weber** (Bureaucratic Management). |
| **Technopreneurship 101 & Business Model Canvas** | **Value Proposition**: The unique bundle of products/services that creates value for a specific customer segment.<br>**Business Model Canvas (9 Blocks by Osterwalder)**: Value Propositions, Customer Segments, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure.<br>**Intellectual Property (IP) Protection in Philippines (RA 8293)**:<br>- **Patents**: Exclusive rights for new, inventive, and industrially applicable technical solutions (valid for **20 years** from filing date; non-renewable).<br>- **Utility Models**: "Petty patents" for technical innovations (valid for **7 years**; non-renewable).<br>- **Industrial Design**: Aesthetic shape/pattern (valid for **5 years**, renewable for 2 consecutive 5-year terms $\implies 15\text{ years}$ max).<br>- **Trademarks**: Distinctive signs/logos (valid for **10 years**, renewable indefinitely).<br>- **Copyright**: Literary/artistic/software works (valid for **Lifetime of author + 50 years** after death). | Question: *"What is the term of protection of a patent in the Philippines under the IP Code (RA 8293)?"* $\to$ **20 years from filing date (non-renewable)**.<br>*"What is the term of protection of a trademark?"* $\to$ **10 years, renewable indefinitely**. |

---

## 3. ELECTRONICS ENGINEERING (30% Board Weight) — TOS Detailed Circuitry

### 3.1 Two-Port Networks & Small-Signal Parameters

| Parameter Set | Governing Matrix Equation | Condition for Reciprocity & Symmetry |
| :--- | :--- | :--- |
| **Impedance ($Z$-parameters)** | $\begin{pmatrix}V_1 \\ V_2\end{pmatrix} = \begin{pmatrix}z_{11} & z_{12} \\ z_{21} & z_{22}\end{pmatrix} \begin{pmatrix}I_1 \\ I_2\end{pmatrix}$ | Reciprocal: $z_{12} = z_{21}$<br>Symmetrical: $z_{11} = z_{22}$ |
| **Admittance ($Y$-parameters)** | $\begin{pmatrix}I_1 \\ I_2\end{pmatrix} = \begin{pmatrix}y_{11} & y_{12} \\ y_{21} & y_{22}\end{pmatrix} \begin{pmatrix}V_1 \\ V_2\end{pmatrix}$ | Reciprocal: $y_{12} = y_{21}$<br>Symmetrical: $y_{11} = y_{22}$ |
| **Hybrid ($h$-parameters)** | $\begin{pmatrix}V_1 \\ I_2\end{pmatrix} = \begin{pmatrix}h_{11} & h_{12} \\ h_{21} & h_{22}\end{pmatrix} \begin{pmatrix}I_1 \\ V_2\end{pmatrix} = \begin{pmatrix}h_i & h_r \\ h_f & h_o\end{pmatrix} \begin{pmatrix}I_b \\ V_{ce}\end{pmatrix}$ | Reciprocal: $h_{12} = -h_{21}$<br>Symmetrical: $\det(h) = 1$<br>$h_i = \text{input } Z$, $h_r = \text{reverse } V\text{ gain}$, $h_f = \text{forward } I\text{ gain } (\beta)$, $h_o = \text{output } Y$. |
| **Transmission ($ABCD$-parameters)** | $\begin{pmatrix}V_1 \\ I_1\end{pmatrix} = \begin{pmatrix}A & B \\ C & D\end{pmatrix} \begin{pmatrix}V_2 \\ -I_2\end{pmatrix}$ | Reciprocal: $AD - BC = 1$<br>Symmetrical: $A = D$<br>Ideal for cascaded network multiplication: $[T_{total}] = [T_1][T_2]$. |

---

### 3.2 Advanced Analog Circuits, Current Mirrors & Op-Amp Non-Idealities

| Circuit / Parameter | Governing Formulas | Definitive Board Exam Key Insights |
| :--- | :--- | :--- |
| **Cascode Amplifier** | Cascade of **Common Emitter (CE)** stage driving a **Common Base (CB)** stage | Combines the high input impedance of CE with the wide bandwidth and elimination of the **Miller Effect** capacitance from CB. Yields extremely high bandwidth and high output impedance. |
| **Current Mirrors** | **Basic BJT**: $I_C = I_{REF}\left(\frac{1}{1 + 2/\beta}\right)$<br>**Wilson Current Mirror**: Output impedance $R_o \approx \beta r_o / 2$; drastically minimizes $\beta$ dependence.<br>**Widlar Current Source**: Uses emitter resistor $R_E$ to generate stable micro-amp ($<10\,\mu\text{A}$) currents without massive resistors. | Question: *"Which current mirror circuit provides the highest output resistance and lowest sensitivity to transistor beta variations?"* $\to$ **Wilson Current Mirror**. |
| **Differential Amplifier & CMRR** | $V_o = A_d(V_1 - V_2) + A_{cm}\left(\frac{V_1 + V_2}{2}\right)$<br>$\text{CMRR} = \left|\frac{A_d}{A_{cm}}\right|$, $\text{CMRR}_{dB} = 20\log_{10}\left|\frac{A_d}{A_{cm}}\right|$ | An ideal op-amp has **infinite CMRR** ($A_{cm} = 0$), completely rejecting common-mode noise induced on both input leads. |
| **Op-Amp Slew Rate ($SR$)** | $SR = \left.\frac{dV_o}{dt}\right|_{\max} = 2\pi f_{\max} V_p$ | Maximum rate of change of output voltage (in $\text{V}/\mu\text{s}$). If input signal frequency exceeds full-power bandwidth $f_{\max} = \frac{SR}{2\pi V_p}$, the output sine wave distorts into a triangular wave. |
| **Instrumentation Amplifier** | $V_o = \left(1 + \frac{2R_1}{R_G}\right)\left(\frac{R_3}{R_2}\right)(V_2 - V_1)$ | 3-op-amp topology with ultra-high input impedance, high precision, and gain set by a **single external resistor** $R_G$. |

---

### 3.3 Transducers, Industrial Sensors & Building Management Systems (TOS Standard)

| Transducer / Sensor | Physical Operating Principle | Key Board Applications |
| :--- | :--- | :--- |
| **LVDT (Linear Variable Differential Transformer)** | AC inductive transformer with 1 primary and 2 symmetrical secondary coils connected in **series opposition** ($V_o = V_{s1} - V_{s2}$); core displacement produces differential amplitude with $180^\circ$ phase reversal. | Contact displacement sensor; frictionless, infinite resolution, zero null voltage when core is centered. |
| **Strain Gauge** | Piezoresistive effect; fractional change in electrical resistance is proportional to mechanical strain: $\frac{\Delta R}{R} = GF \cdot \epsilon$ where $GF$ is Gauge Factor ($GF \approx 2.0$ for metallic foil, $GF \approx 100-150$ for semiconductor silicon). | Interfaced using a **Wheatstone Bridge** circuit to measure microscopic micro-strain $\mu\epsilon$. |
| **Thermocouple** | **Seebeck Effect**: Temperature gradient across junctions of two dissimilar metals generates an open-circuit EMF ($V = \alpha \Delta T$).<br>- **Peltier Effect**: Passing current through junction produces heating or cooling.<br>- **Thomson Effect**: Heat absorption/evolution along a single conductor with temperature gradient. | Standard Types: Type K (Chromel-Alumel, general use $-200^\circ\text{C}$ to $+1250^\circ\text{C}$), Type J (Iron-Constantan), Type T (Copper-Constantan), Type S/R (Platinum-Rhodium, high temperature). |
| **RTD vs. Thermistor** | **RTD (Pt100)**: Platinum wire with linear **Positive Temperature Coefficient (PTC)** ($R_T = R_0[1 + \alpha T]$); high accuracy, wide range ($-200^\circ\text{C}$ to $+850^\circ\text{C}$).<br>**Thermistor**: Metal-oxide semiconductor with exponential **Negative Temperature Coefficient (NTC)** ($R = R_0 e^{\beta(1/T - 1/T_0)}$); extremely sensitive over narrow range. | Question: *"A temperature sensor made of pure platinum wire that exhibits a highly linear positive temperature coefficient is a(n):"* $\to$ **RTD (Resistance Temperature Detector)**. |
| **PLC & Building Automation (BMS/SCADA)** | **PLC Hardware**: CPU, I/O modules, power supply, programming memory. Programming follows IEC 61131-3 (Ladder Diagram LD, Function Block FBD, Structured Text ST).<br>**SCADA**: Supervisory Control and Data Acquisition for large-scale distributed monitoring.<br>**BMS / DDC Protocols**: **BACnet** (ASHRAE 135 standard building automation protocol), **Modbus** (RS-485 master-slave industrial protocol), **LonWorks**; integrates HVAC, Fire Alarm (FACP), CCTV, and Access Control. | Questions on Ladder logic normally-open `--[ ]--` vs normally-closed `--[/]--` rungs and BACnet protocols. |

---

### 3.4 Microprocessors, Microcontrollers & Sequential Logic (TOS Standard)

| Domain | Architectural Types & Characteristics | Definitive Board Exam Key Insights |
| :--- | :--- | :--- |
| **Microprocessor Architectures** | **Von Neumann Architecture**: Single shared memory and shared bus for both program instructions and data (subject to Von Neumann memory bottleneck).<br>**Harvard Architecture**: Physically separate memory blocks and separate buses for program code and data; allows simultaneous instruction fetch and data read/write (used in modern DSPs and microcontrollers).<br>**RISC vs CISC**:<br>- **RISC**: Reduced Instruction Set Computer; simple single-cycle fixed-length instructions; load/store architecture; large register file (e.g., ARM, MIPS, RISC-V).<br>- **CISC**: Complex Instruction Set Computer; variable-length multi-cycle instructions; complex addressing modes (e.g., x86). | Question: *"An architecture that features physically separate memories and buses for program instructions and data is known as:"* $\to$ **Harvard Architecture**. |
| **Serial Bus Protocols** | **UART**: Asynchronous, full-duplex, 2 wires (TX, RX), no clock line.<br>**SPI (Serial Peripheral Interface)**: Synchronous, full-duplex, 4 wires (**MOSI**, **MISO**, **SCK**, **SS/CS**); master-slave; high speed ($>10\text{Mbps}$).<br>**I2C (Inter-Integrated Circuit)**: Synchronous, half-duplex, 2 wires (**SDA** serial data, **SCL** serial clock); multi-master, multi-slave with 7-bit addressing; open-drain lines requiring external pull-up resistors. | Question: *"Which synchronous serial protocol utilizes only two open-drain bidirectional wires named SDA and SCL?"* $\to$ **I2C**. |
| **Asynchronous Logic Hazards** | **Static-1 Hazard**: Output momentarily drops to 0 when it should remain 1.<br>**Static-0 Hazard**: Output momentarily spikes to 1 when it should remain 0.<br>**Dynamic Hazard**: Output transitions multiple times ($0 \to 1 \to 0 \to 1$) during a single change.<br>**Solution**: Add **redundant consensus prime implicant loops** in Karnaugh Map to cover adjacent group transitions. | Question: *"How are static hazards in combinational logic circuits completely eliminated?"* $\to$ **By including redundant prime implicant gates in the circuit design**. |

---

## 4. ELECTRONICS SYSTEMS & TECHNOLOGIES (30% Board Weight) — TOS Communications & Data Comms

### 4.1 Digital Signal Processing (DSP) & Filter Archetypes

| DSP Concept | Governing Formulas & Definitions | Definitive Board Exam Key Insights |
| :--- | :--- | :--- |
| **Nyquist Sampling & Aliasing** | $f_s \ge 2 f_{\max}$ (Nyquist Rate), Nyquist Frequency $= f_s / 2$ | If $f_s < 2 f_{\max}$, high frequencies fold back into the baseband creating **Aliasing distortion**. Prevented using an analog **Anti-Aliasing Low-Pass Filter** before the ADC. |
| **FIR vs. IIR Filters** | **FIR (Finite Impulse Response)**: Non-recursive (no feedback); $y[n] = \sum_{k=0}^{M} b_k x[n-k]$; all poles at $z = 0$; **always unconditionally stable**; can achieve **exact linear phase** (no group delay distortion).<br>**IIR (Infinite Impulse Response)**: Recursive (feedback); $y[n] = \sum b_k x[n-k] - \sum a_k y[n-k]$; has both poles and zeros; can become unstable if poles drift outside unit circle; matches analog filter prototypes (Butterworth, Chebyshev) with much lower filter order. | Question: *"Which digital filter architecture is guaranteed to be unconditionally stable and can easily achieve exact linear phase?"* $\to$ **FIR Filter**. |
| **Bilinear Transform** | $s = \frac{2}{T}\left(\frac{z - 1}{z + 1}\right)$, Pre-warping: $\omega_a = \frac{2}{T}\tan\left(\frac{\omega_d T}{2}\right)$ | Maps entire left-half s-plane into inside of unit circle in z-plane. Non-linear frequency compression requires **frequency pre-warping**. |

---

### 4.2 Superheterodyne Receivers, Mixing & Image Frequencies

| Receiver Parameter | Governing Formula | Board Exam Speed Shortcut |
| :--- | :--- | :--- |
| **Local Oscillator ($f_{LO}$)** | $f_{LO} = f_{RF} + f_{IF}$ (High-Side Injection) | Standard AM $f_{IF} = 455\text{kHz}$; Standard FM $f_{IF} = 10.7\text{MHz}$. |
| **Image Frequency ($f_{image}$)** | $f_{image} = f_{RF} + 2 f_{IF}$ (for high-side injection) | The image frequency is always separated from the desired station by exactly **twice the Intermediate Frequency ($2f_{IF}$)**. |
| **Image Rejection Ratio (IFRR)** | $\text{IFRR} = \sqrt{1 + Q^2 \rho^2}$ where $\rho = \frac{f_{image}}{f_{RF}} - \frac{f_{RF}}{f_{image}}$ | Image rejection is determined strictly by the **selectivity of the RF preselector stage prior to the mixer** (the IF stage cannot filter out image noise once mixed). |
| **Double Spotting** | Occurs when receiver picks up same strong station at two dial settings separated by $2f_{IF}$ | Caused by poor front-end RF selectivity. |

---

### 4.3 Information Theory, Error Control & Data Communications Protocols

| Topic | Formulas & Standards | Definitive Board Exam Key Insights |
| :--- | :--- | :--- |
| **Shannon Channel Capacity** | $C = B \log_2\left(1 + \frac{S}{N}\right) = 3.32 B \log_{10}(1 + \text{SNR})$ (bps) | Fundamental upper limit of error-free data transmission over a Gaussian noisy channel. If SNR is given in dB, convert to linear power ratio first: $\text{SNR} = 10^{\text{SNR}_{dB}/10}$. |
| **Hartley's Law & Nyquist Baud Rate** | $C = 2 B \log_2 M$ (bps), Max Baud Rate $= 2 B$ (symbols/sec) | $M$ is the number of discrete signaling levels or constellation points. |
| **Hamming Distance & Error Correction** | Minimum Hamming Distance $d_{\min}$:<br>- Detects up to: $e_{detect} = d_{\min} - 1$ errors.<br>- Corrects up to: $t_{correct} = \left\lfloor\frac{d_{\min} - 1}{2}\right\rfloor$ errors. | Hamming parity bits are placed at bit positions that are powers of 2 ($1, 2, 4, 8, 16\dots$). |
| **Transmission Modes** | **Simplex**: Unidirectional one-way only (e.g., Commercial FM broadcast, pager).<br>**Half-Duplex**: Bidirectional both ways, but **only one direction at a time** (e.g., Walkie-talkie / push-to-talk).<br>**Full-Duplex**: Simultaneous bidirectional communication in both directions (e.g., Telephone, full-duplex Ethernet). | Question: *"A communication system where transmission can occur in both directions simultaneously is classified as:"* $\to$ **Full-Duplex**. |
| **Serial Physical Interfaces** | **RS-232C (EIA-232)**: Single-ended; $\pm 3\text{V}$ to $\pm 15\text{V}$ (Logic 0 / SPACE $= +3\text{V}$ to $+15\text{V}$, Logic 1 / MARK $= -3\text{V}$ to $-15\text{V}$); max length $50\text{ ft}$; DB-25 or DE-9 connectors.<br>**RS-422**: Balanced differential; 1 driver to 10 receivers; up to $10\text{Mbps}$ and $4000\text{ ft}$.<br>**RS-485**: Balanced differential **multi-point bus**; up to 32 drivers and 32 receivers on a single 2-wire bus. | Question: *"In RS-232C standard, a binary 1 (MARK condition) is represented by what voltage level?"* $\to$ **Negative voltage (between $-3\text{V}$ and $-15\text{V}$)**. |
| **Data Link Protocols: Character vs. Bit-Oriented** | **Character-Oriented Protocols (e.g. IBM BSC / Bisync)**: Uses standard ASCII control characters (**SOH**, **STX**, **ETX**, **EOT**, **SYN**, **DLE**, **ACK**, **NAK**). Uses **Character / Byte Stuffing** (inserting extra `DLE` before literal data) for data transparency.<br>**Bit-Oriented Protocols (e.g. HDLC, SDLC)**: Uses uniform 8-bit frame flag delimiter `01111110` ($0x7E$). Uses **Bit Stuffing (Zero-Bit Insertion)**: transmitter automatically inserts a `0` after any five consecutive `1`s to avoid false flag delimiters. | Question: *"In HDLC, how does the transmitter prevent data patterns from being mistaken as frame delimiter flags (`01111110`)?"* $\to$ **Bit Stuffing (inserts a '0' bit after every five consecutive '1' bits)**. |
| **ISDN & Broadband ISDN** | **ISDN BRI (Basic Rate Interface)**: $2B + D = 2(64\text{kbps}) + 16\text{kbps} = 144\text{kbps}$ (Total line rate with framing $= 192\text{kbps}$).<br>**ISDN PRI (Primary Rate Interface)**:<br>- North America/Japan (T1 standard): $23B + D = 23(64) + 64 = 1.544\text{Mbps}$.<br>- Europe/PH (E1 standard): $30B + 2D = 30(64) + 2(64) = 2.048\text{Mbps}$.<br>**B-ISDN & ATM**: Asynchronous Transfer Mode; utilizes fixed-length **53-byte cells** ($5\text{ bytes header} + 48\text{ bytes payload}$). | Memorize BRI ($2B+D = 144\text{kbps}$) and ATM 53-byte cell breakdown ($5+48$) cold. |

---

## 5. Comprehensive Cross-Subject Linkage Matrix (Final Audit)

| Source Module | Target Module | Cross-Subject Physical & Mathematical Connection |
| :--- | :--- | :--- |
| `MATH 01-05` Vieta's Quadratic Roots | `ELEC 05-03` RLC Damping | Roots sum $-b/a = -R/L$ (damping rate $2\alpha$), product $c/a = 1/LC$ (undamped natural frequency $\omega_0^2$). |
| `MATH 01-07` Partial Fractions | `ELEC 14` Control System Transfer Functions | Decomposition of $H(s)$ into individual first-order and second-order pole sections for Bode magnitude and phase summation. |
| `MATH 01-11` Harmonic Mean | `ELEC 02-03` Parallel Resistors | Round-trip velocity $v_{avg} = \frac{2v_1 v_2}{v_1+v_2}$ and equivalent parallel resistance $R_{eq} = \frac{R_1 R_2}{R_1+R_2}$ share exact same harmonic formulation. |
| `MATH 01-15` Infinite Geometric Series | `ELEC 11` Feedback Amplifier Gain | Closed-loop gain $A_f = \frac{A}{1 + A\beta} = A[1 - A\beta + (A\beta)^2 - (A\beta)^3 \dots]$ derived from infinite feedback reflections. |
| `MATH 01-16` Binomial Approximation | `MATH 10-11` Error Differentials | Linearized Taylor series $(1+x)^n \approx 1 + nx$ provides the mathematical basis for all differential error percentage formulas. |
| `MATH 09-04` Parabolic Conics | `EST 05` Satellite Parabolic Dishes | Geometric property that all parallel rays reflect to a single focal point powers satellite TV reflector antennas. |
| `MATH 11-09` Wallis' Formula | `ELEC 04-01` AC Sinusoidal RMS Values | $V_{rms} = \sqrt{\frac{1}{T}\int_0^T V_m^2 \sin^2(\omega t)\,dt} = \frac{V_m}{\sqrt{2}}$ is mathematically identical to Wallis' $\int_0^{\pi/2}\sin^2 x\,dx = \frac{1}{2}\cdot\frac{\pi}{2}$. |
| `MATH 12-07` Exponential Decay ODEs | `GEAS 01-11` & `ELEC 05-01` | Radioactive half-life $N(t) = N_0 e^{-\lambda t}$, Newton's cooling $T(t) = T_m + (T_0-T_m)e^{-kt}$, and capacitor discharge $v(t) = V_0 e^{-t/RC}$ share identical ODE $y' + ky = 0$. |
| `MATH 13-04` Bessel Functions | `EST 03` FM Modulation Spectra | Bessel coefficients $J_n(\beta)$ govern the amplitudes of FM carrier and discrete sideband pairs at frequency offsets $f_c \pm n f_m$. |
| `MATH 13-09` Z-Transforms | `EST 09` Digital Signal Processing | Mapping s-plane continuous filters to discrete time FIR/IIR digital filters via bilinear transform $z = e^{sT}$. |
