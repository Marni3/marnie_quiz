# Detailed Interactive Learning Modules Syllabus: MATHEMATICS (MATH 01 to MATH 13)

> **Philippine ECE Licensure Examination • Mathematics Domain (20% Board Weight)**
> Formatted according to the `learning-module-authoring` skill standards.
> Reference Grounding: `Reference Documents/Math/Notes - Algebra 1–4.pdf`, `Trigonometry 1–4.pdf`, `Analytic Geometry 1–4.pdf`, `Calculus 1–4.pdf`, `DE 1–3.pdf`, `Advanced Math 1–7.pdf`.

---

## MATH 01: College Algebra (19 Subtopic Modules)

### Overview & Subject Links
- **Prerequisites**: Basic Arithmetic & Algebraic Manipulation.
- **Cross-Subject Bridges**:
  - Exponents & Logarithms $	o$ `EST 01` (Decibel calculations, $dB, dBm, dBW, dBu$) & `ELEC 14` (Bode plots).
  - Quadratic equations & Determinants $	o$ `ELEC 05` (RLC characteristic roots) & `MATH 12` (Auxiliary equations).
  - Partial Fractions $	o$ `MATH 12` (Inverse Laplace Transforms) & `ELEC 14` (Transfer function pole-zero decomposition).

---

### Granular Module Blueprints:

#### `MATH 01-01`: Real Numbers, Operations & Factoring
- **Scope & Concept**: Properties of real numbers, prime factorization, greatest common factor (GCF), least common multiple (LCM), factoring sum/difference of cubes, grouping.
- **Mental Anchor / Rule of Thumb**: *"Factoring transforms an addition problem into a multiplication problem; GCF takes lowest prime powers, LCM takes highest."*
- **Long Method vs. Speed Shortcut**:
  - *Long Method*: Expanding and manual prime factorization trees.
  - *⚡ Speed Shortcut*: **Karce**: `[FACT]` (`[SHIFT] [B]`) instantly breaks large 6-digit integers into prime bases.
- **Calculator Keystrokes (Karce KC-S991 / Canon F-789SGA)**:
  - Karce: Enter integer $	o$ `[=]` $	o$ `[SHIFT]` `[FACT]`.
  - Canon: `[APPS]` $	o$ Prime Factorization.
- **Interactive Visualizer**: Dynamic Venn diagram for GCF/LCM showing overlapping prime factor circles.
- **In-Line Practice Check**: 3 MCQs on high-degree polynomial grouping.
- **Paired Quiz Set**: `MATH 01-01 to 01-07 Diagnostic & Review`.

#### `MATH 01-02`: Exponents & Radicals
- **Scope & Concept**: Fractional exponents, rationalizing denominators, radical equations, nested square roots.
- **Mental Anchor / Rule of Thumb**: *"Roots are just fractional powers ($x^{1/n} = \sqrt[n]{x}$); for nested radicals $\sqrt{a \pm \sqrt{b}}$, convert inside to a perfect square binomial."*
- **Long Method vs. Speed Shortcut**:
  - *Long Method*: Setting up quadratic equations $x = \sqrt{a + \sqrt{a + \dots}}$ and solving.
  - *⚡ Speed Shortcut*: In nested radicals $\sqrt{6 + \sqrt{6 + \dots}}$, the positive integer root is simply consecutive factor $n(n+1) \implies 2 	imes 3 = 6 \implies 3$.
- **Calculator Keystrokes**:
  - Karce/Canon: `[CALC]` button to substitute arbitrary test values (e.g. $x = 3$) into radical identities to eliminate 3 wrong choices in 5 seconds.
- **Interactive Visualizer**: Radical graph zoom visualizer showing behavior at $x 	o 0$ vs. $x 	o \infty$.

#### `MATH 01-03`: Logarithms & Exponential Equations
- **Scope & Concept**: Natural and common logarithms, change-of-base formula, logarithmic inequalities, exponential growth.
- **Mental Anchor / Rule of Thumb**: *"A logarithm is literally just an exponent in disguise: $\log_b(x) = y \iff b^y = x$."*
- **Cross-Subject Callout**: Essential for `EST 01` (Link budget decibels: $dB = 10\log(P_2/P_1)$) and `EST 02` (Free Space Path Loss).
- **Calculator Keystrokes**:
  - Karce: Direct evaluation using arbitrary base `[log■(□)]`.
- **Interactive Visualizer**: Logarithmic vs. Linear scale slider showing dynamic compression of wide numerical spans ($10^0$ to $10^6$).

#### `MATH 01-04`: Polynomials, Remainder & Factor Theorems
- **Scope & Concept**: Synthetic division, remainder theorem, rational root theorem, Descartes' rule of signs.
- **Mental Anchor / Rule of Thumb**: *"The remainder of dividing $P(x)$ by $(x - c)$ is strictly $P(c)$; if $P(c) = 0$, then $(x - c)$ is an exact factor."*
- **Long Method vs. Speed Shortcut**:
  - *Long Method*: Long algebraic polynomial division taking 2 minutes.
  - *⚡ Speed Shortcut*: Instant evaluation of $P(c)$ in 3 seconds using `[CALC]` button on calculator.
- **Calculator Keystrokes**:
  - Karce: Type polynomial $2X^4 - 3X^2 + 5X - 7$ $	o$ Press `[CALC]` $	o$ enter $c = 3$ $	o$ `[=]`.
- **Interactive Visualizer**: Interactive Synthetic Division step-by-step table generator with animated multiplier paths.

#### `MATH 01-05`: Quadratic Equations & Vieta's Formulas
- **Scope & Concept**: Standard form $ax^2 + bx + c = 0$, quadratic formula, discriminant $\Delta = b^2 - 4ac$, Vieta's sum ($-b/a$) and product ($c/a$).
- **Mental Anchor / Rule of Thumb**: *"Discriminant $b^2 - 4ac > 0 \implies 2$ real roots; $=0 \implies 1$ repeated root; $<0 \implies 2$ complex conjugate roots."*
- **Cross-Subject Callout**: Powers `ELEC 05` (Underdamped vs. Overdamped RLC circuits) and `MATH 12` (Auxiliary roots).
- **Calculator Keystrokes**:
  - Karce: `<kbd>MODE</kbd> <kbd>5</kbd> <kbd>3</kbd>` $	o$ enter coefficients $a, b, c$.
  - Canon: `<kbd>MODE</kbd> <kbd>EQN</kbd>` $	o$ Quadratic.
- **Interactive Visualizer**: Parabola discriminant slider morphing curve from 2 real intercepts $	o$ tangent $	o$ floating complex parabola.

#### `MATH 01-06`: Systems of Linear & Non-Linear Equations
- **Scope & Concept**: $2 	imes 2$ and $3 	imes 3$ linear systems, substitution, elimination, Cramer's rule.
- **Mental Anchor / Rule of Thumb**: *"If $\det(A) = 0$, lines are either parallel (no solution) or identical (infinite solutions)."*
- **Calculator Keystrokes**:
  - Karce: `<kbd>MODE</kbd> <kbd>5</kbd> <kbd>1</kbd>` ($2 	imes 2$) or `<kbd>MODE</kbd> <kbd>5</kbd> <kbd>2</kbd>` ($3 	imes 3$).
- **Interactive Visualizer**: 2D intersecting lines and 3D intersecting planes visualizer showing point of concurrency.

#### `MATH 01-07`: Partial Fractions & Heaviside Method
- **Scope & Concept**: Distinct linear factors, repeated linear factors, irreducible quadratic factors.
- **Mental Anchor / Rule of Thumb**: *"Heaviside Cover-Up: To find constant $A$ above $(x - r)$, cover $(x - r)$ in the original fraction and evaluate at $x = r$."*
- **Cross-Subject Callout**: Crucial for `MATH 12` (Inverse Laplace Transforms) and `ELEC 14` (Control Systems).
- **Calculator Keystrokes**:
  - Direct fraction evaluation at $x = r$ using `[CALC]`.
- **Interactive Visualizer**: Interactive Heaviside Cover-Up tool allowing students to click factor bubbles to reveal constants.

#### `MATH 01-08`: Word Problems — Number & Age
- **Scope & Concept**: Multi-variable age relations in past, present, and future.
- **Mental Anchor / Rule of Thumb**: *"The age difference between two people is invariant across all time: $\Delta 	ext{Age}(t) = 	ext{constant}$."*
- **Calculator Keystrokes**:
  - Setup simultaneous equations in `<kbd>MODE</kbd> <kbd>5</kbd> <kbd>1</kbd>`.
- **Interactive Visualizer**: Age timeline slider showing parallel progression of ages over time.

#### `MATH 01-09`: Word Problems — Mixture & Solution
- **Scope & Concept**: Mixing liquids of differing concentrations, adding pure solvent or pure solute.
- **Mental Anchor / Rule of Thumb**: *"Total amount of pure active substance is strictly conserved: $C_1 V_1 + C_2 V_2 = C_{	ext{final}} V_{	ext{total}}$."*
- **Calculator Keystrokes**:
  - Single-variable linear equation solving via `<kbd>SHIFT</kbd> <kbd>SOLVE</kbd>`.
- **Interactive Visualizer**: Dual-beaker fluid mixing simulation showing real-time concentration blending.

#### `MATH 01-10`: Word Problems — Work & Rate
- **Scope & Concept**: Combined work, pipes filling and emptying tanks, workers leaving early.
- **Mental Anchor / Rule of Thumb**: *"Individual work rates add up linearly: $R_{	ext{total}} = rac{1}{t_1} + rac{1}{t_2} - rac{1}{t_{	ext{drain}}}$."*
- **Calculator Keystrokes**:
  - Reciprocal summation using `[x⁻¹]` key: `(12⁻¹ + 18⁻¹)⁻¹ = 7.2 hours`.
- **Interactive Visualizer**: Animated water tank with filling pipes and drain valve.

#### `MATH 01-11`: Word Problems — Motion & Kinematics
- **Scope & Concept**: Uniform motion $d = rt$, headwind/tailwind, river current, round trips.
- **Mental Anchor / Rule of Thumb**: *"Effective speed with current is $v + c$; against current is $v - c$; average speed for round trip is Harmonic Mean $rac{2v_1 v_2}{v_1 + v_2}$."*
- **Calculator Keystrokes**:
  - Harmonic mean shortcut evaluation.
- **Interactive Visualizer**: Two moving vehicles on track with distance-time graph.

#### `MATH 01-12`: Word Problems — Clock & Geometry
- **Scope & Concept**: Clock minute/hour hand overlap, right angles, opposite directions.
- **Mental Anchor / Rule of Thumb**: *"Minute hand moves at $1	ext{ space/min}$, hour hand moves at $rac{1}{12}	ext{ space/min}$; relative gain is $rac{11}{12}	ext{ spaces/min}$."*
- **Long Method vs. Speed Shortcut**:
  - *⚡ Speed Shortcut*: Time past hour $H$ for hands to coincide is simply $rac{60}{11} 	imes H$ minutes.
- **Interactive Visualizer**: Interactive Clock Face with dragging hands and angle readout.

#### `MATH 01-13`: Word Problems — Financial, Interest & Variation
- **Scope & Concept**: Simple interest $I = Prt$, compound interest $A = P(1 + r/m)^{mt}$, direct/inverse variation.
- **Mental Anchor / Rule of Thumb**: *"Compound interest exponential growth $e^{rt}$; doubling time Rule of 72: $t pprox 72 / r\%$."*
- **Cross-Subject Callout**: Direct bridge to `GEAS 06` (Engineering Economics).

#### `MATH 01-14`: Arithmetic & Geometric Progressions
- **Scope & Concept**: $n$-th term formulas, arithmetic series $S_n = rac{n}{2}(a_1 + a_n)$, geometric series $S_n = rac{a_1(1 - r^n)}{1 - r}$.
- **Mental Anchor / Rule of Thumb**: *"Arithmetic progressions add a common difference ($d$); Geometric progressions multiply by a common ratio ($r$)."*
- **Calculator Keystrokes**:
  - Karce: Summation key `<kbd>SHIFT</kbd> <kbd>log</kbd>` ($\Sigma$) with index $X = 1$ to $N$.
- **Interactive Visualizer**: Stacked bar chart showing linear slope vs. exponential compounding curve.

#### `MATH 01-15`: Infinite Geometric Series & Harmonic Progression
- **Scope & Concept**: Convergence condition $\|r\| < 1$, sum $S_\infty = rac{a_1}{1 - r}$, harmonic series ($1/a_n$).
- **Mental Anchor / Rule of Thumb**: *"An infinite geometric series converges if and only if $\|r\| < 1$; otherwise sum diverges to $\infty$."*
- **Calculator Keystrokes**:
  - Direct fraction evaluation of $rac{a}{1 - r}$.
- **Interactive Visualizer**: Infinite geometric square fractal area subdivider demonstrating $\sum (1/2)^n = 1$.

#### `MATH 01-16`: Binomial Theorem & Pascal's Triangle
- **Scope & Concept**: $(a + b)^n = \sum inom{n}{k} a^{n-k} b^k$, finding $r$-th term, sum of coefficients.
- **Mental Anchor / Rule of Thumb**: *"To find the sum of all coefficients in an expansion $(Ax + By)^n$, simply substitute $x = 1, y = 1$."*
- **Long Method vs. Speed Shortcut**:
  - *⚡ Speed Shortcut*: $(2x - 3y)^5$ coefficient sum $\implies (2(1) - 3(1))^5 = (-1)^5 = -1$ (solves in 2 seconds).
- **Calculator Keystrokes**:
  - Karce: Combination key `[nCr]` (`[SHIFT] [÷]`).
- **Interactive Visualizer**: Interactive Pascal's Triangle with row coefficient highlighting.

#### `MATH 01-17`: Mathematical Induction & Sequences
- **Scope & Concept**: Base case $n=1$, inductive step $P(k) \implies P(k+1)$, closed-form sequence discovery.
- **Mental Anchor / Rule of Thumb**: *"Induction is like knocking down dominos: prove the first falls, and that any falling domino knocks the next."*
- **Calculator Keystrokes**:
  - Evaluate formula at $n=1, 2, 3$ in `[TABLE]` mode (`[MODE] [7]`) to match choices.

#### `MATH 01-18`: Inequalities & Absolute Values
- **Scope & Concept**: Linear/quadratic inequalities, sign tables, interval notation, $\|x - a\| < \delta$.
- **Mental Anchor / Rule of Thumb**: *"Multiplying or dividing by a negative number strictly reverses the inequality sign."*
- **Interactive Visualizer**: Interactive 1D Number line inequality highlighter.

#### `MATH 01-19`: Complex Numbers in Algebra
- **Scope & Concept**: $i = \sqrt{-1}$, powers of $i$ (cycles in mod 4: $i, -1, -i, 1$), complex conjugates.
- **Mental Anchor / Rule of Thumb**: *"Powers of $i$ depend only on the remainder when exponent is divided by 4."*
- **Calculator Keystrokes**:
  - Karce: `<kbd>MODE</kbd> <kbd>2</kbd>` (CMPLX) $	o$ `i^15` $	o$ evaluate directly.
- **Cross-Subject Callout**: Connects directly to `MATH 13` (Advanced Math) and `ELEC 04` (AC Circuits).

---

## MATH 02: Probability (13 Subtopic Modules)
- **Key Modules**:
  - `MATH 02-01` Fundamental Counting Principle & Factorials.
  - `MATH 02-02` Permutations (Linear, Circular, with Repetition).
  - `MATH 02-03` Combinations & Handshake Problems.
  - `MATH 02-04` Classical Probability & Mutually Exclusive Events.
  - `MATH 02-05` Independent & Dependent Events.
  - `MATH 02-06` Conditional Probability & Bayes' Theorem.
  - `MATH 02-07` Discrete Random Variables & Expected Value $E(X)$.
  - `MATH 02-08` Binomial Distribution.
  - `MATH 02-09` Poisson Distribution.
  - `MATH 02-10` Hypergeometric Distribution.
  - `MATH 02-11` Normal Distribution & Z-Tables.
  - `MATH 02-12` Exponential & Continuous Distributions.
  - `MATH 02-13` Joint & Marginal Distributions.
- **Notable Interactive Visualizers**:
  - **Binomial $	o$ Poisson $	o$ Normal Distribution morphing curve**.
  - **Z-Score Area Shader**: Interactive slider adjusting $Z \in [-3.5, +3.5]$ and live-shading curve area with exact probability readout.
- **Calculator Keystrokes (Karce)**:
  - `<kbd>MODE</kbd> <kbd>3</kbd>` $	o$ `[AC]` $	o$ `<kbd>SHIFT</kbd> <kbd>1</kbd> <kbd>5</kbd>` (Distribution functions $P(t), Q(t), R(t)$).
- **Cross-Subject Connections**:
  - `EST 01` Gaussian Thermal Noise & Bit Error Rate (BER).
  - `EST 08` Erlang B/C Telephony Traffic Modeling.

---

## MATH 03 & MATH 04: Statistics & Discrete Mathematics
- **Key Modules**:
  - `MATH 03-01` Measures of Central Tendency (Mean, Median, Mode).
  - `MATH 03-02` Measures of Dispersion (Variance, Standard Deviation, Range, IQR).
  - `MATH 03-03` Linear Regression & Pearson's Correlation Coefficient ($r$).
  - `MATH 04-01` Set Theory & Venn Operations.
  - `MATH 04-02` Propositional Logic, Truth Tables & Logical Equivalence.
  - `MATH 04-03` Graph Theory, Euler Paths & Spanning Trees.
  - `MATH 04-04` Boolean Algebra & Karnaugh Mapping Fundamentals.
  - `MATH 04-05` Recurrence Relations & Combinatorics.
- **Notable Interactive Visualizers**:
  - **Interactive Scatter Plot with Best-Fit Regression Line Adjuster**.
  - **3-Set Venn Diagram Region Highlighter**.
- **Calculator Keystrokes (Karce)**:
  - Linear Regression: `<kbd>MODE</kbd> <kbd>3</kbd> <kbd>2</kbd>` ($A+BX$) $	o$ enter $X, Y$ table $	o$ `<kbd>SHIFT</kbd> <kbd>1</kbd> <kbd>5</kbd>` for $A, B, r$.

---

## MATH 05: Trigonometry (4 Comprehensive Modules)
- **Key Modules**:
  - `MATH 05-01` Angle Measurement, Right Triangles & Unit Circle Functions.
  - `MATH 05-02` Trigonometric Identities, Double/Half Angle Formulas.
  - `MATH 05-03` Oblique Triangles (Law of Sines, Law of Cosines, Ambiguous SSA Case).
  - `MATH 05-04` Spherical Trigonometry & Napier's Rules.
- **Notable Interactive Visualizers**:
  - **Unit Circle & Phasor Angle Explorer**: Real-time slider $	heta \in [0^\circ, 360^\circ]$ displaying $\sin, \cos, 	an$, reference triangles, and radian equivalents.
  - **3D Napier's Spherical Wheel & Globe**: Interactive spherical right triangle with Napier's circular rule equations live-updating.
- **Calculator Keystrokes (Karce)**:
  - Rectangular to Polar conversion: `[SHIFT] [+]` (`Pol(x, y)`).
- **Cross-Subject Connections**:
  - `ELEC 04` AC Phasor Impedance ($R + jX$).
  - `EST 02` Satellite Look Angles (Azimuth and Elevation).

---

## MATH 06: Plane Geometry (5 Modules)
- **Key Modules**:
  - `MATH 06-01` Triangles, Congruence, Similarity & Hero's Formula.
  - `MATH 06-02` Quadrilaterals & Cyclic Quadrilaterals (Brahmagupta's Formula, Ptolemy's Theorem).
  - `MATH 06-03` Regular Polygons, Apothem & Interior/Exterior Angles.
  - `MATH 06-04` Circles, Chords, Tangents, Secants & Power of a Point.
  - `MATH 06-05` Geometric Loci & Area Transformations.
- **Notable Interactive Visualizer**:
  - **Interactive Power of a Point Circle**: Draggable secants and tangents showing $a \cdot b = c \cdot d$ and $T^2 = a(a+b)$.

---

## MATH 07 & MATH 08: Solid Geometry & Mensuration
- **Key Modules**:
  - `MATH 07-01` Lines and Planes in Space, Dihedral Angles.
  - `MATH 07-02` Prisms, Cylinders & Similar Polyhedra.
  - `MATH 07-03` Pyramids, Cones & Frustums.
  - `MATH 07-04` Spheres, Spherical Zones, Segments & Sectors.
  - `MATH 08-01` Prismoidal Formula for General Solids.
  - `MATH 08-02` Theorems of Pappus (Surface Area & Volume of Revolution).
- **Notable Interactive Visualizer**:
  - **3D Pappus Revolution Torus Generator**: Drag 2D centroid around axis to create 3D volume in real time.

---

## MATH 09: Analytic Geometry (11 Subtopic Modules)
- **Key Modules**:
  - `MATH 09-01` Cartesian Coordinates, Distance, Midpoint & Slope.
  - `MATH 09-02` Lines in 2D (Standard, Slope-Intercept, Normal Form, Distance to Point).
  - `MATH 09-03` Circles (Standard Form, General Form, Tangents).
  - `MATH 09-04` Parabolas (Focus, Directrix, Latus Rectum, Vertex).
  - `MATH 09-05` Ellipses (Major/Minor axes, Foci, Eccentricity, Directrices).
  - `MATH 09-06` Hyperbolas (Transverse/Conjugate axes, Asymptotes, Eccentricity).
  - `MATH 09-07` General Second-Degree Equations & Discriminant ($B^2 - 4AC$).
  - `MATH 09-08` Translation & Rotation of Coordinate Axes.
  - `MATH 09-09` Polar Coordinate Curves (Cardioids, Limacons, Rose Curves).
  - `MATH 09-10` Parametric Equations.
  - `MATH 09-11` 3D Analytic Geometry (Lines, Planes, Quadric Surfaces in Space).
- **Notable Interactive Visualizer**:
  - **Eccentricity Morphing Visualizer**: Slider for $e \in [0, 3]$ showing Circle ($e=0$) $	o$ Ellipse ($0<e<1$) $	o$ Parabola ($e=1$) $	o$ Hyperbola ($e>1$).
- **Cross-Subject Connections**:
  - `EST 05` Parabolic Antenna Reflectors and Cassegrain Hyperbolic Sub-reflectors.

---

## MATH 10: Differential Calculus (11 Subtopic Modules)
- **Key Modules**:
  - `MATH 10-01` Limits, Continuity & Squeeze Theorem.
  - `MATH 10-02` L'Hôpital's Rule & Indeterminate Forms.
  - `MATH 10-03` Definition of Derivative & Differentiation Power/Product/Quotient Rules.
  - `MATH 10-04` Chain Rule & Implicit Differentiation.
  - `MATH 10-05` Derivatives of Trigonometric & Inverse Trig Functions.
  - `MATH 10-06` Derivatives of Exponential & Logarithmic Functions.
  - `MATH 10-07` Tangent Lines, Normal Lines & Subtangents.
  - `MATH 10-08` Optimization: Maxima, Minima & Points of Inflection.
  - `MATH 10-09` Related Rates of Change (Ladder, Conical Tank, Shadow Problems).
  - `MATH 10-10` Curve Sketching, Concavity & Asymptotes.
  - `MATH 10-11` Partial Derivatives & Error Differentials.
- **Notable Interactive Visualizers**:
  - **Dynamic Tangent Line Slope Slider**: Drag point $x$ along curve to see tangent line slope $f'(x)$ rotate and reflect first derivative.
  - **Draining Conical Tank Simulation**: Animated water cone with dynamic $dh/dt$ velocity vector.
- **Calculator Keystrokes (Karce)**:
  - Numerical Derivative: `<kbd>SHIFT</kbd> <kbd>d/dx</kbd>` at $x = x_0$.

---

## MATH 11: Integral Calculus (21 Subtopic Modules)
- **Key Modules**:
  - `MATH 11-01` Indefinite Integrals & Basic Integration Formulas.
  - `MATH 11-02` Integration by Substitution ($u$-sub).
  - `MATH 11-03` Integration by Parts (Tabular DI Method).
  - `MATH 11-04` Trigonometric Integrals ($\sin^m x \cos^n x$).
  - `MATH 11-05` Trigonometric Substitution ($x = a\sin	heta, a	an	heta, a\sec	heta$).
  - `MATH 11-06` Integration by Partial Fractions.
  - `MATH 11-07` Rational Substitutions & Weierstrass Half-Angle Substitution.
  - `MATH 11-08` Definite Integrals & Fundamental Theorem of Calculus.
  - `MATH 11-09` Walli's Formula for Definite Trig Integrals.
  - `MATH 11-10` Plane Area Under a Single Curve.
  - `MATH 11-11` Plane Area Between Intersecting Curves.
  - `MATH 11-12` Volumes of Solids of Revolution — Disk Method.
  - `MATH 11-13` Volumes of Solids of Revolution — Washer Method.
  - `MATH 11-14` Volumes of Solids of Revolution — Cylindrical Shell Method.
  - `MATH 11-15` Arc Length of Plane Curves.
  - `MATH 11-16` Surface Area of Revolution.
  - `MATH 11-17` Centroids of Plane Areas.
  - `MATH 11-18` Moments of Inertia of Plane Areas.
  - `MATH 11-19` Fluid Hydrostatic Pressure & Force.
  - `MATH 11-20` Work Done by Variable Force (Springs, Pumping Liquids).
  - `MATH 11-21` Improper Integrals.
- **Notable Speed Techniques**:
  - **Reverse Differentiation Bypass**: Test the 4 choices using `[SHIFT] [d/dx]` at $x=2$ and match with integrand value $f(2)$.
  - **Walli's Formula Shortcut**: Instant evaluation of $\int_0^{\pi/2} \sin^m x \cos^n x\,dx$.
- **Calculator Keystrokes (Karce)**:
  - Definite Integral: `<kbd>∫dx</kbd>` button with limits $a$ and $b$.

---

## MATH 12: Differential Equations (10 Subtopic Modules)
- **Key Modules**:
  - `MATH 12-01` Order, Degree, Linearity & General vs. Particular Solutions.
  - `MATH 12-02` First-Order Separable Differential Equations.
  - `MATH 12-03` Homogeneous First-Order Equations ($y = vx$).
  - `MATH 12-04` Exact Differential Equations & Integrating Factors.
  - `MATH 12-05` First-Order Linear Equations (Integrating Factor $e^{\int P\,dx}$).
  - `MATH 12-06` Bernoulli Differential Equations ($y' + Py = Qy^n$).
  - `MATH 12-07` Applications: Exponential Growth/Decay, Newton's Law of Cooling.
  - `MATH 12-08` Applications: Mixing Fluid Problems & Orthogonal Trajectories.
  - `MATH 12-09` Higher-Order Linear Homogeneous ODEs with Constant Coefficients.
  - `MATH 12-10` Laplace Transforms, Inverse Laplace & Solving Initial Value Problems.
- **Notable Interactive Visualizers**:
  - **Direction / Slope Field Interactive Map**: Displays vector arrows for $dy/dx = f(x, y)$ with draggable trajectory particle.
- **Cross-Subject Connections**:
  - `ELEC 05` RC/RL/RLC Transient step responses ($v(t) = V_f + (V_i - V_f)e^{-t/	au}$).

---

## MATH 13: Advanced Engineering Mathematics (10 Subtopic Modules)
- **Key Modules**:
  - `MATH 13-01` Complex Numbers in Polar & Exponential Forms ($r e^{j	heta}$).
  - `MATH 13-02` De Moivre's Theorem & $n$-th Roots of Complex Numbers.
  - `MATH 13-03` Matrix Algebra: Addition, Multiplication, Transpose & Inversion.
  - `MATH 13-04` Determinants & Properties ($3 	imes 3$ and $4 	imes 4$).
  - `MATH 13-05` Eigenvalues, Eigenvectors & Diagonalization.
  - `MATH 13-06` Vector Operations: Dot Product, Cross Product & Scalar Triple Product.
  - `MATH 13-07` Vector Differential Calculus: Gradient ($
abla$), Divergence ($
abla \cdot$), Curl ($
abla 	imes$).
  - `MATH 13-08` Line & Surface Integrals (Green's Theorem, Divergence Theorem, Stokes' Theorem).
  - `MATH 13-09` Fourier Series: Trigonometric & Exponential Forms.
  - `MATH 13-10` Partial Differential Equations (Wave, Heat, Laplace Equations).
- **Notable Interactive Visualizers**:
  - **3D Vector Cross Product & Right-Hand Rule Visualizer**: Drag vectors $\mathbf{A}$ and $\mathbf{B}$ to see orthogonal cross product $\mathbf{A} 	imes \mathbf{B}$ rotate in 3D.
  - **2D Matrix Linear Transformation Grid Deformer**: Modify matrix entries $egin{pmatrix}a & b \ c & d\end{pmatrix}$ to see unit grid shear, rotate, and scale.
- **Calculator Keystrokes (Karce)**:
  - Vector Mode: `<kbd>MODE</kbd> <kbd>8</kbd>` $	o$ `DotP`, `CrossP`.
  - Matrix Mode: `<kbd>MODE</kbd> <kbd>6</kbd>` $	o$ `det(MatA)`, `MatA⁻¹`.
