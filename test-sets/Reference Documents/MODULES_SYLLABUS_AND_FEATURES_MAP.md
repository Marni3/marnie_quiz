# Master Syllabus & Interactive Learning Modules Architecture

> **Philippine Electronics Engineering (ECE) Licensure Examination**
> Single Source of Truth for all Interactive Learning Modules, Mental Anchors, Calculator Keystrokes, and Interactive Visualizers.
> Formatted according to `learning-module-authoring` skill standards.

---

# 1. MATHEMATICS (MATH 01 to MATH 13)

### MATH 01 — College Algebra
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 01-01` | **Number Theory & Real Numbers** | *"Prime factors are the atomic building blocks of numbers; GCF takes lowest exponents, LCM takes highest."* | **Karce**: `[FACT]` (`[SHIFT] [B]`) prime factorization.<br>**Canon**: Prime factorization via `[APPS]`. | Number line density explorer. | `ELEC-15` Digital binary arithmetic. |
| `MATH 01-02` | **Exponents, Radicals & Logarithms** | *"Logarithm is just the question: 'To what power must the base be raised?' Log of product is sum of logs."* | Direct log evaluation with arbitrary base `[log■(□)]`. | Logarithmic vs. Linear scale interactive slider. | `EST-01` Decibels ($dB, dBm$), `ELEC-14` Bode plots. |
| `MATH 01-03` | **Polynomials & Remainder Theorem** | *"Remainder of $P(x) \div (x - r)$ is just $P(r)$. If $P(r) = 0$, $r$ is a root."* | **Karce**: `[CALC]` button to evaluate $P(x)$ at test roots instantly. | Remainder theorem visual synthetic division stepper. | `MATH-10` Polynomial curve sketching. |
| `MATH 01-04` | **Quadratic & Higher Degree Equations** | *"Sum of roots is $-b/a$; Product of roots is $c/a$. Discriminant $b^2 - 4ac$ dictates nature of roots."* | **Karce**: `[MODE] [5] [3]` (Quad) / `[MODE] [5] [4]` (Cubic).<br>**Canon**: `[MODE] [EQN]` $	o$ Quad/Cubic. | Parabola root morpher ($b^2 - 4ac > 0, =0, <0$). | `ELEC-05` 2nd-order characteristic equation damping. |
| `MATH 01-05` | **Word Problems (Age, Mixture, Work, Motion)** | *"Rates add up in work problems ($1/t_1 + 1/t_2 = 1/T$); in mixture problems, total pure substance is conserved."* | Matrix equation solver `[MODE] [5] [1]` for simultaneous 2-variable systems. | Interactive fluid tank mixture balance slider. | `MATH-12` Mixing differential equations ($r_{in} - r_{out}$). |
| `MATH 01-06` | **Progressions & Financial Math** | *"Arithmetic adds a constant; Geometric multiplies by a constant; Infinite geometric sum exists only if $\|r\| < 1$."* | Sequence summation `[SHIFT] [log] (Σ)`. | Infinite series convergence visualizer ($\sum r^n$). | `GEAS-06` Engineering Economics annuities. |
| `MATH 01-07` | **Binomial Theorem & Partial Fractions** | *"Heaviside cover-up method finds distinct linear partial fraction constants in 3 seconds without simultaneous equations."* | Heaviside cover-up direct evaluation on screen. | Heaviside cover-up interactive stepper. | `MATH-12` Laplace inverse transform partial fractions. |

---

### MATH 02 — Probability
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 02-01` | **Counting & Permutations/Combinations** | *"Order matters $	o$ Permutation ($nPr$); Grouping only $	o$ Combination ($nCr$)."* | Direct key evaluation: `[nPr]` (`[SHIFT] [×]`), `[nCr]` (`[SHIFT] [÷]`). | Tree diagram and grouping combinatorial slider. | `EST-10` Packet framing and coding theory. |
| `MATH 02-02` | **Independent & Conditional Probability** | *"Bayes theorem updates initial belief based on new evidence: $P(A\|B) = rac{P(B\|A)P(A)}{P(B)}$."* | Fraction mode `[a b/c]` for exact rational probabilities. | Interactive Venn diagram & 2-stage probability tree. | `EST-09` Bit Error Rate (BER) and noisy channel decoding. |
| `MATH 02-03` | **Discrete Distributions (Binomial & Poisson)** | *"Binomial counts successes in fixed $n$ trials; Poisson counts random events occurring at average rate $\lambda$ over time."* | **Karce**: `[MODE] [3]` Distribution / `nCr 	imes p^x 	imes q^{n-x}` in `[CALC]`. | Binomial to Poisson distribution morphing curve. | `EST-08` Telephony traffic engineering (Erlang B/C). |
| `MATH 02-04` | **Normal (Gaussian) Distribution & Z-Scores** | *"68% within $\pm 1\sigma$, 95% within $\pm 2\sigma$, 99.7% within $\pm 3\sigma$."* | **Karce/Canon**: `[MODE] [3]` $	o$ `[AC]` $	o$ `[SHIFT] [1] [5]` (Distribution: $P, Q, R, t$). | Bell curve area shader with dynamic $Z$-score slider. | `EST-01` Gaussian White Noise and SNR. |

---

### MATH 03 — Statistics
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 03-01` | **Central Tendency & Dispersion** | *"Mean is balance point; Median resists extreme outliers; Variance is average squared distance from mean."* | **Karce**: `[MODE] [3] [1]` (1-VAR), enter data $	o$ `[AC]` $	o$ `[SHIFT] [1] [4]` for $ar{x}, \sigma_x, s_x$. | Outlier sensitivity slider (Mean vs. Median shift). | `ELEC-13` Instrumentation measurement error. |
| `MATH 03-02` | **Linear Regression & Correlation** | *"Correlation $r \in [-1, 1]$ measures linear strength; $r^2$ is coefficient of determination."* | **Karce**: `[MODE] [3] [2]` ($A+BX$), enter table $	o$ `[SHIFT] [1] [5]` for $A, B, r$. | Scatter plot with best-fit line live adjuster. | `GEAS-14` Market forecasting and trend analysis. |

---

### MATH 04 — Discrete Mathematics
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 04-01` | **Set Theory & Venn Operations** | *"Union is OR; Intersection is AND; Complement is NOT."* | Principle of Inclusion-Exclusion $n(A\cup B) = n(A)+n(B)-n(A\cap B)$. | 3-Set interactive Venn diagram region highlighter. | `ELEC-15` Digital logic Boolean sets. |
| `MATH 04-02` | **Propositional Logic & Truth Tables** | *"Implication $P \implies Q$ is false ONLY when truth leads to a lie ($T \implies F$)."* | Logic truth evaluation truth table generator. | Interactive Truth Table generator with live logic gates. | `ELEC-15` Karnaugh mapping and gate synthesis. |
| `MATH 04-03` | **Graph Theory & Trees** | *"In any graph, sum of degrees equals $2 	imes 	ext{edges}$ (Handshaking Lemma)."* | Euler circuit condition check ($	ext{all vertices have even degree}$). | Node-edge graph builder with shortest-path Dijkstra stepper. | `EST-10` Network packet routing and spanning trees. |

---

### MATH 05 — Trigonometry
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 05-01` | **Right Triangle & Unit Circle** | *"SOH-CAH-TOA; $\sin^2	heta + \cos^2	heta = 1$. Angle in standard position has coordinates $(\cos	heta, \sin	heta)$."* | Rectangular to Polar conversion `[Pol(x, y)]` (`[SHIFT] [+]`). | Unit Circle & Phasor Angle Explorer with live $(\cos, \sin, 	an)$. | `ELEC-04` AC circuit voltage/current phasors. |
| `MATH 05-02` | **Oblique Triangles (Sine & Cosine Laws)** | *"Use Sine Law when opposite pair is known; use Cosine Law for SAS or SSS."* | **Karce**: `[MODE] [7]` (Table) to test multiple unknown angles. | Dynamic Triangle deformer showing ambiguous SSA case. | `GEAS-02` Vector addition and force equilibrium. |
| `MATH 05-03` | **Spherical Trigonometry** | *"Right spherical triangles follow Napier's Rules: 'Sine of middle = product of tangents of adjacents = product of cosines of opposites'."* | Napier's wheel angle substitution. | 3D Interactive Napier's Wheel & Spherical globe visualizer. | `EST-02` Great circle path navigation & satellite look angles. |

---

### MATH 06 — Plane Geometry
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 06-01` | **Polygons & Interior/Exterior Angles** | *"Sum of interior angles is $(n - 2) 	imes 180^\circ$; number of diagonals is $rac{n(n-3)}{2}$."* | Fast linear solve for $n$. | Regular polygon vertex and diagonal generator. | `ELEC-12` Semiconductor crystal lattice geometries. |
| `MATH 06-02` | **Circles, Chords, Tangents & Power of a Point** | *"Intersecting Chords: $a \cdot b = c \cdot d$; Tangent-Secant: $T^2 = a(a + b)$."* | Direct power of point evaluation. | Interactive Power of a Point circle with draggable secants. | `EST-05` Antenna circular array layouts. |

---

### MATH 07 & 08 — Solid Geometry & Mensuration
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 07-01` | **Standard Solids (Prisms, Pyramids, Cones, Spheres)** | *"Pyramid/Cone volume is exactly $rac{1}{3}$ of matching Prism/Cylinder."* | Sphere volume $rac{4}{3}\pi r^3$, surface area $4\pi r^2$. | 3D Wireframe solid morpher with volume calculator. | `ELEC-01` Gaussian surface integration. |
| `MATH 08-01` | **Frustums & Prismoidal Formula** | *"Prismoidal formula $V = rac{L}{6}(A_1 + 4A_m + A_2)$ solves ANY solid with quadratic cross-sectional area."* | Midsection area computation $A_m 
eq rac{A_1 + A_2}{2}$. | Prismoidal slice animator with midsection area tracker. | `GEAS-04` Centroid and cross-sectional moment of inertia. |
| `MATH 08-02` | **Pappus Theorems & Solids of Revolution** | *"Pappus 1: Surface area $= 2\pi ar{y} L$; Pappus 2: Volume $= 2\pi ar{y} A$."* | Centroid distance $ar{y}$ multiplied by rotated path length. | 2D area revolving around axis creating 3D Torus in real time. | `MATH-11` Integral Calculus volume of revolution. |

---

### MATH 09 — Analytic Geometry
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 09-01` | **Lines, Slopes & Distances** | *"Perpendicular slopes multiply to $-1$ ($m_1 m_2 = -1$). Distance from $(x_1, y_1)$ to $Ax+By+C=0$ is $rac{\|Ax_1+By_1+C\|}{\sqrt{A^2+B^2}}$."* | Distance and angle between lines calculator. | Interactive parallel and perpendicular line slope rotator. | `GEAS-04` Engineering mechanics line of action of forces. |
| `MATH 09-02` | **Conic Sections & Eccentricity ($e$)** | *"Eccentricity is the measure of uncircleness: $e = 0$ (Circle), $0 < e < 1$ (Ellipse), $e = 1$ (Parabola), $e > 1$ (Hyperbola)."* | Conic classification via $B^2 - 4AC$ and focus-directrix ratio $e = c/a$. | **Eccentricity Morphing Visualizer**: Slider for $e \in [0, 3]$ live-morphing Circle $	o$ Ellipse $	o$ Parabola $	o$ Hyperbola. | `EST-05` Parabolic satellite dishes & Hyperbolic Cassegrain feeds. |
| `MATH 09-03` | **Polar Coordinates & Curves** | *"Cardioids: $r = a(1 \pm \cos	heta)$; Rose curves: $r = a\cos(n	heta)$ has $n$ petals if $n$ is odd, $2n$ petals if $n$ is even."* | **Karce**: `[MODE] [7]` (Table) with step $15^\circ$ to trace polar curves. | Polar coordinate curve animator (Cardioids & Rose curves). | `EST-05` Antenna azimuth radiation patterns. |

---

### MATH 10 — Differential Calculus
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 10-01` | **Limits & L'Hôpital's Rule** | *"When substitution yields $0/0$ or $\infty/\infty$, take derivative of top and bottom separately; or evaluate $x = 0.0001$."* | **Karce**: Type function in `[CALC]`, evaluate at $x = 0.00001$ for $x 	o 0$. | Limit zoom explorer approaching singularity. | `EST-01` Nyquist Shannon continuous bandwidth limits. |
| `MATH 10-02` | **Derivatives & Tangent/Normal Lines** | *"Derivative $f'(x)$ is slope of tangent line; slope of normal is $-1/f'(x)$."* | **Karce**: `[SHIFT] [d/dx]` numerical derivative at $x = x_0$ in 2 seconds. | Tangent line slider tracing slope along curve. | `GEAS-02` Kinematics ($v = ds/dt, a = dv/dt$). |
| `MATH 10-03` | **Optimization (Maxima & Minima)** | *"Critical points occur where $f'(x) = 0$; if $f''(x) < 0$ it is a local maximum (concave down)."* | Table search `[MODE] [7]` for local peaks and valleys. | Box folding & perimeter optimization area visualizer. | `ELEC-03` Maximum Power Transfer theorem ($R_L = R_{th}$). |
| `MATH 10-04` | **Related Rates of Change** | *"Differentiate governing geometric equation with respect to time $t$ using chain rule."* | Cone water draining / ladder sliding rate substitutions. | Animated draining conical tank with live $dh/dt$ velocity vector. | `GEAS-05` Thermodynamic expansion rates. |

---

### MATH 11 — Integral Calculus
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 11-01` | **Integration Techniques & Bypass** | *"To evaluate $\int f(x)\,dx$, take the derivative $rac{d}{dx}$ of the 4 answer choices at $x=2$ and match with $f(2)$."* | **Reverse Differentiation Bypass**: `[SHIFT] [d/dx]` on choices vs. $f(2)$. | Step-by-step Integration by Parts table visualizer. | `ELEC-04` AC average and RMS power integration. |
| `MATH 11-02` | **Plane Areas & Definite Integrals** | *"Area between curves is $\int (y_{	ext{upper}} - y_{	ext{lower}})\,dx$."* | **Karce/Canon**: Numerical definite integral button `[∫dx]` with limits. | Dynamic area shader between intersecting parabolas. | `GEAS-02` Work done as area under $F$-$x$ curve. |
| `MATH 11-03` | **Volumes of Revolution (Disk, Washer, Shell)** | *"Revolving around horizontal axis: Disk/Washer uses $dx$, Shell uses $dy$."* | Numerical integration of $\pi \int (R^2 - r^2)\,dx$. | 3D revolution solid slice generator. | `MATH-08` Mensuration comparison. |

---

### MATH 12 — Differential Equations
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 12-01` | **1st Order ODEs (Separable, Linear, Bernoulli)** | *"Linear 1st order has integrating factor $I = e^{\int P\,dx}$; solution is $y \cdot I = \int Q \cdot I\,dx + C$."* | Differential check via `[CALC]` by substituting $y$ and $y'$ into ODE. | Direction field (slope field) interactive visualizer. | `ELEC-05` 1st order RC/RL charge/discharge ($V_0 e^{-t/	au}$). |
| `MATH 12-02` | **Applications: Decay, Mixing & Cooling** | *"Newton's cooling: $rac{dT}{dt} = -k(T - T_m)$; Mixing: $rac{dQ}{dt} = 	ext{rate}_{	ext{in}} - 	ext{rate}_{	ext{out}}$."* | Exponential ratio shortcut: $T(t) - T_m = (T_0 - T_m)e^{-kt}$. | Mixing tank salt concentration curve over time. | `EST-02` Signal decay and atmospheric absorption. |
| `MATH 12-03` | **Laplace Transforms & Inverse** | *"Laplace transforms differentiation into multiplication by $s$: $\mathcal{L}\{f'(t)\} = sF(s) - f(0)$."* | Standard table lookup + Heaviside partial fraction cover-up. | $s$-plane pole-zero interactive map. | `ELEC-14` System transfer functions & stability. |

---

### MATH 13 — Advanced Engineering Mathematics
| Module ID | Module Title & Scope | Core Mental Anchor / Rule of Thumb | Calculator Technique & Speed Shortcut (Karce / Canon) | Interactive Visualizer / Feature | Cross-Subject Board Connection |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MATH 13-01` | **Complex Numbers & De Moivre's Theorem** | *"Multiplication multiplies magnitudes and adds angles: $(r_1ngle	heta_1)(r_2ngle	heta_2) = r_1 r_2 ngle(	heta_1+	heta_2)$."* | **Karce**: `[MODE] [2]` (CMPLX) $	o$ `[SHIFT] [2] [3]` for polar $rngle	heta$. | Complex plane phasor rotation & $n$-th roots on circle. | `ELEC-04` AC Phasor analysis, `EST-09` QAM Constellation. |
| `MATH 13-02` | **Matrices, Determinants & Eigenvalues** | *"A square matrix is invertible if and only if $\det(A) 
eq 0$; Eigenvalues satisfy $\det(A - \lambda I) = 0$."* | **Karce**: `[MODE] [6]` (MATRIX), enter matrix $	o$ `det(MatA)` and `MatA^{-1}` in 2 sec. | 2D matrix linear transformation grid deformer. | `ELEC-03` Multi-loop mesh/nodal matrix equations. |
| `MATH 13-03` | **Vector Calculus & Fourier Series** | *"Dot product gives scalar projection ($\mathbf{A}\cdot\mathbf{B} = AB\cos	heta$); Cross product gives perpendicular vector ($\mathbf{A}	imes\mathbf{B} = AB\sin	heta\mathbf{\hat{n}}$)."* | **Karce**: `[MODE] [8]` (VECTOR) for `DotP` and `CrossP`. | 3D interactive vector cross product & right-hand rule. | `GEAS-07` Maxwell's Equations ($
abla 	imes \mathbf{E}, 
abla \cdot \mathbf{B}$). |

---

# 2. ELECTRONICS ENGINEERING (ELEC 01 to ELEC 15)

### Highlights of Key Modules & Specialized Visualizers:
- **`ELEC 01` Electricity & Magnetism**: Coulomb force 3D charge positioner & Gauss law flux sphere.
- **`ELEC 03` DC Circuits & Network Theorems**: Interactive Thevenin / Norton source conversion stepper & Maximum Power Transfer slider ($P$ peaks at $R_L = R_{th}$).
- **`ELEC 04` AC Circuits & Power Factor**: Interactive Power Triangle visualizer (Real $P$, Reactive $Q$, Apparent $S$, $	ext{pf} = \cos	heta$) with capacitor correction slider.
- **`ELEC 05` Transients & Resonance**: Interactive RLC Damping Waveform generator (Overdamped, Critically Damped, Underdamped) and Q-factor bandwidth slider.
- **`ELEC 06` Semiconductor Diodes**: Diode IV curve tracer with temperature coefficient slider and clipper/clamper waveform animator.
- **`ELEC 07 & 08` BJT & MOSFET Amplifiers**: Interactive DC Load Line with movable Q-point and AC small-signal transconductance explorer.
- **`ELEC 09` Operational Amplifiers**: Virtual Op-Amp laboratory with feedback resistor sliders for Inverting, Non-Inverting, Summing, and Active Filters.
- **`ELEC 15` Digital Electronics**: Interactive Logic Gate circuit builder and 4-variable Karnaugh Map loop grouper.

---

# 3. GENERAL ENGINEERING & APPLIED SCIENCES (GEAS 01 to GEAS 12)

### Highlights of Key Modules & Specialized Visualizers:
- **`GEAS 01` Chemistry for Engineers**: Chemical equation balancer & Galvanic cell electrochemical voltage calculator.
- **`GEAS 02` Physics 1 (Mechanics)**: Projectile motion trajectory simulator with launch angle and air drag sliders.
- **`GEAS 04` Engineering Mechanics & Strength**: Simply supported beam shear and moment diagram ($V$-$M$) visualizer with movable point/distributed loads.
- **`GEAS 05` Thermodynamics**: Interactive Carnot Cycle P-V and T-S 4-stage thermodynamic loop explorer.
- **`GEAS 06` Engineering Economics**: Cash flow diagram timeline generator with uniform gradient and sinking fund depreciation calculator.
- **`GEAS 07` Electromagnetics**: 3D Plane wave propagation visualizer showing orthogonal $\mathbf{E}$ and $\mathbf{H}$ fields with Poynting vector $\mathbf{S}$.
- **`GEAS 08` ECE Laws & Ethics**: R.A. 9292 compliance checklist & board qualification requirements matrix.

---

# 4. ELECTRONICS SYSTEMS & TECHNOLOGIES (EST 01 to EST 10)

### Highlights of Key Modules & Specialized Visualizers:
- **`EST 01` Fundamentals of Comms & Noise**: Thermal noise calculator ($V_n = \sqrt{4kTRB}$) and multi-stage Friis Noise Figure cascade simulator.
- **`EST 02` Radiowave Propagation**: Ionospheric layer refraction visualizer (D, E, F1, F2 layers) with MUF and critical frequency angle slider.
- **`EST 03` Analog Modulation (AM/FM)**: Time-domain envelope generator & frequency-domain Bessel sideband power distribution visualizer.
- **`EST 04` Transmission Lines & Smith Chart**: Interactive Smith Chart impedance matching tool showing VSWR circle and single-stub matching.
- **`EST 05` Antennas & Radiation**: 3D Antenna radiation pattern visualizer for Dipole, Yagi-Uda, and Parabolic Dish reflectors.
- **`EST 07` Optical Fiber Communications**: Total internal reflection ray tracer with acceptance angle and numerical aperture ($NA = \sqrt{n_1^2 - n_2^2}$) slider.
- **`EST 08` Telephony & Traffic Engineering**: Erlang B traffic loss probability calculator with trunk line capacity sliders.
- **`EST 09` Digital Communications**: Digital constellation diagram explorer (BPSK, QPSK, 8-PSK, 16-QAM) with Gaussian noise jitter and eye diagrams.
- **`EST 10` Data Communications & Networking**: Subnet mask & IP CIDR calculator with OSI 7-layer encapsulation visualizer.
