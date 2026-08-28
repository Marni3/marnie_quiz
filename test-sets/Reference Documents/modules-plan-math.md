# Mathematics (MATH) — 1-to-1 Decoupled Master Learning Module Plan

## Architecture & Blueprint Overview

This document provides the exhaustive, 1-to-1 architectural master plan for all **Mathematics** learning modules in the platform. Every module is grounded directly in the review center reference lecture notes (`test-sets/Reference Documents/Math/`), structured under the pedagogical guidelines defined in [`SKILL.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/.agents/skills/learning-module-authoring/SKILL.md) and [`MODULE_RESTRUCTURING_AND_PEDAGOGICAL_REFINEMENT_GUIDE.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/Reference%20Documents/MODULE_RESTRUCTURING_AND_PEDAGOGICAL_REFINEMENT_GUIDE.md).

### Decoupling & Mastery Challenge Structure
1. **Decoupled Architecture**: Learning modules are independent, deep-dive didactic instructional units (`/learn/[moduleId]`), decoupled from the 190 syllabus practice question sets in the `/quizzes` library.
2. **Module-Exclusive Mastery Challenge Sets**: Each module is paired with a dedicated, exclusive companion mastery test set accessible directly from the module view.
3. **Micro-Reinforcement Cycle**:
   $$\text{Prerequisite Bridge} \longrightarrow \text{Atomic Definitions} \longrightarrow \text{Lesson Proper Block} \longrightarrow \text{In-Line Concept Checks (5–10 MCQs)} \longrightarrow \text{Dual-Method Sample} \longrightarrow \text{Calculator Technique} \longrightarrow \text{Exclusive Mastery Challenge}$$
4. **Calculator Model Coverage**: Karce KC-S991 & Canon F-789SGA keystroke workflows.

---

## Unit 1: College Algebra

### Module MATH-01: Number Systems, Properties, and Roman Numerals
- **Source Reference**: `Notes - Algebra 1.pdf`
- **Prerequisite Bridge**: Foundational entry point for all engineering calculations. Connects arithmetic operations to algebraic manipulations across GEAS and Electronics.
- **Atomic Definitions**:
  - **Natural Numbers ($\mathbb{N}$)**: Counting numbers starting from 1 ($1, 2, 3, \dots$).
  - **Whole Numbers ($\mathbb{W}$)**: Natural numbers including zero ($0, 1, 2, \dots$).
  - **Integers ($\mathbb{Z}$)**: Positive and negative whole numbers and zero ($\dots, -2, -1, 0, 1, 2, \dots$).
  - **Rational Numbers ($\mathbb{Q}$)**: Numbers expressible as $p/q$ where $p, q \in \mathbb{Z}, q \neq 0$. Repeating or terminating decimals.
  - **Irrational Numbers ($\mathbb{Q}'$)**: Non-repeating, non-terminating decimals (e.g., $\pi, e, \sqrt{2}$).
  - **Real Numbers ($\mathbb{R}$)**: Union of rational and irrational numbers ($\mathbb{Q} \cup \mathbb{Q}'$).
  - **Imaginary Numbers**: Numbers involving $i = \sqrt{-1}$, where $i^2 = -1$.
  - **Complex Numbers ($\mathbb{C}$)**: Numbers in the form $a + bi$, where $a, b \in \mathbb{R}$.
  - **Cardinal Numbers**: Words/symbols denoting quantity (e.g., one, two, 3).
  - **Ordinal Numbers**: Words/symbols denoting order or rank (e.g., 1st, 2nd, third).
  - **Nominal Numbers**: Numbers used only as labels or identifiers (e.g., postal codes, jersey numbers).
- **Roman Numerals System**:
  - Base Values: $I=1, V=5, X=10, L=50, C=100, D=500, M=1000$.
  - Large Number Multiplier Notations:
    - **Bracket ($|X|$)**: Multiplies value by **100 times** (e.g., $|V| = 5 \times 100 = 500$, $|X| = 1,000$).
    - **Vinculum ($\overline{X}$)**: Horizontal bar above letter, multiplies value by **1,000 times** (e.g., $\overline{V} = 5,000$, $\overline{X} = 10,000$).
    - **Doorframe ($|\overline{X}|$ / Bracket with Vinculum)**: Multiplies value by **1,000,000 times** (e.g., $|\overline{V}| = 5,000,000$).
  - Digit: A symbol or combination used alone or together to denote a number (e.g., 21 has digits 2 and 1; Roman IX has digits I and X to denote 9).
- **System of Numbers & Decimals**:
  - Real Numbers ($\mathbb{R}$) vs Imaginary Numbers ($i = \sqrt{-1}$).
  - Rational ($\mathbb{Q}$) vs Irrational ($\mathbb{Q}'$):
    - **Non-terminating Repeating Decimals** (e.g., $0.3333\dots = 1/3$) $\implies$ **Rational**.
    - **Non-terminating Non-repeating Decimals** (e.g., $\pi = 3.14159\dots, e = 2.71828\dots, \sqrt{2} = 1.41421\dots$) $\implies$ **Irrational**.
  - Complex Numbers ($a + bi$):
    - If $a = 0 \implies$ Pure Imaginary Number.
    - If $b = 0 \implies$ Real Number.
    - Cyclic Powers of $i$: $i = \sqrt{-1}, \quad i^2 = -1, \quad i^3 = -i = -\sqrt{-1}, \quad i^4 = 1$.
- **Field & Integer Operation Properties**:
  - Addition Properties: Closure ($a+b \in \mathbb{Z}$), Commutative ($a+b=b+a$), Associative ($(a+b)+c=a+(b+c)$), Identity ($a+0=a$, $0$ is additive identity), Inverse ($a+(-a)=0$, $-a$ is additive inverse), Distributive ($a(b+c)=ab+ac$).
  - Multiplication Properties: Closure ($ab \in \mathbb{Z}$), Commutative ($ab=ba$), Associative ($(ab)c=a(bc)$), Identity ($a \cdot 1 = a$, $1$ is multiplicative identity), Inverse ($a(1/a)=1, a \neq 0$, $1/a$ is multiplicative inverse), Distributive ($a(b+c)=ab+ac$), Multiplication Property of Zero ($a \cdot 0 = 0$).
- **Properties of Equality**:
  - Reflexive: $a = a$.
  - Symmetric: If $a = b \implies b = a$.
  - Transitive: If $a = b$ and $b = c \implies a = c$.
  - Substitution: If $a = b$, then $a$ can be replaced by $b$ in any expression involving $a$.
  - Addition / Subtraction Property: If $a = b \implies a + c = b + c$ and $a - c = b - c$.
  - Multiplication / Division Property: If $a = b \implies ac = bc$ and $a/c = b/c$ ($c \neq 0$).
  - Cancellation Property: If $a + c = b + c \implies a = b$; if $ac = bc$ and $c \neq 0 \implies a = b$.
- **In-Line Concept Checks**: 6 MCQs covering classification of numbers (e.g., $0.333\dots$, $\sqrt{7}$, $0$), Roman multiplier calculations ($|V|=500, \overline{V}=5000, |\overline{V}|=5000000$), powers of $i$, and identifying algebraic axioms.
- **Sample Problems**:
  - *Problem 1*: Evaluation of complex Roman notation $[L]\overline{IV}CDXXIX$.
  - *Board Shortcut*: Split thousands, hundreds, tens, and units into additive chunks.
- **Calculator Technique**: Base-N conversion and radical simplification on Canon F-789SGA.
- **Exclusive Mastery Challenge Set**: 25 questions testing number classifications, axioms, and Roman numeral decoding.

---

### Module MATH-02: Algebraic Operations, Special Products, Factoring & Logarithms
- **Source Reference**: `Notes - Algebra 2.pdf`
- **Prerequisite Bridge**: Builds upon algebraic properties to solve polynomial expressions and logarithmic equations occurring in signal decibels (EST) and pH calculations (GEAS).
- **Atomic Definitions & Special Products**:
  - **Polynomial**: Algebraic expression combining variables and coefficients via addition, subtraction, multiplication, and non-negative integer exponents.
  - **Special Products**:
    1. Difference of Two Squares: $(x+y)(x-y) = x^2 - y^2$.
    2. Square of a Binomial: $(x+y)^2 = x^2 + 2xy + y^2, \quad (x-y)^2 = x^2 - 2xy + y^2$.
    3. Cube of a Binomial: $(x+y)^3 = x^3 + 3x^2y + 3xy^2 + y^3, \quad (x-y)^3 = x^3 - 3x^2y + 3xy^2 - y^3$.
    4. Difference of Two Cubes: $x^3 - y^3 = (x-y)(x^2 + xy + y^2)$.
    5. Sum of Two Cubes: $x^3 + y^3 = (x+y)(x^2 - xy + y^2)$.
    6. Square of a Trinomial: $(x+y+z)^2 = x^2 + y^2 + z^2 + 2xy + 2xz + 2yz$.
- **Remainder & Factor Theorems (Étienne Bézout 1730–1783)**:
  - **Remainder Theorem**: When a polynomial $P(x)$ is divided by $(x-k)$, the remainder is $R = P(k)$.
  - **Factor Theorem**: If $P(k) = 0$, then $(x-k)$ is an exact factor of $P(x)$.
- **Exponents & Prime Factoring (LCD, LCM, GCF)**:
  - Base vs Exponent vs Power: In $3^2 = 9$, $3$ is the base, $2$ is the exponent, and $9$ is the power.
  - Exponent Rules: $a^1=a, a^0=1, a^{-m}=\frac{1}{a^m}, a^m a^n=a^{m+n}, \frac{a^m}{a^n}=a^{m-n}, (ab)^m=a^m b^m, \left(\frac{a}{b}\right)^m=\frac{a^m}{b^m}, (a^m)^n=a^{mn}, a^{m/n}=\sqrt[n]{a^m}$.
  - **Least Common Denominator (LCD)**: Product of prime factors occurring in denominators, each taken with its greatest multiplicity.
  - **Least Common Multiple (LCM)**: Lowest integer that is a multiple of two or more numbers (e.g., for $15=3\cdot 5, 18=3^2\cdot 2 \implies \text{LCM} = 3^2 \cdot 5 \cdot 2 = 90$).
  - **Greatest Common Factor (GCF / GCD)**: Largest integer that divides two or more numbers without remainder (e.g., for $70=2\cdot 5\cdot 7, 112=2^4\cdot 7 \implies \text{GCF} = 2\cdot 7 = 14$).
- **Logarithms & Modulus of Logarithms**:
  - Etymology: Greek *logos* (ratio) + *arithmus* (number). $\log_b x = y \iff b^y = x$.
  - **Natural / Napierean Logarithm ($\ln x$)**: Base $e \approx 2.718281828$, invented by Scottish mathematician **John Napier (1550–1617)** in 1614.
  - **Common / Briggsian Logarithm ($\log x$)**: Base $10$, developed by **Henry Briggs (1561–1630)** in 1616 (Professor of Geometry at Gresham College).
  - **Modulus of Logarithm & Conversion Constants**:
    $$\log x = 0.4343 \ln x \quad (\text{where } \log_{10} e \approx 0.434294)$$
    $$\ln x = 2.3026 \log x \quad (\text{where } \ln 10 \approx 2.302585)$$
  - Standard Rules: $\log(xy)=\log x + \log y, \log(x/y)=\log x - \log y, \log(x^n)=n\log x, \log_a x = \frac{\log_b x}{\log_b a}, \log_a a = 1$.
- **In-Line Concept Checks**: 8 MCQs covering remainder evaluation $P(r)$, logarithmic transformations, square of trinomial expansions, and GCD/LCM factoring.
- **Sample Problems**:
  - *Problem*: Find the remainder when $2x^4 - 3x^3 + 5x - 7$ is divided by $(x+2)$.
  - *Academic Derivation*: Synthetic division table setup.
  - *⚡ Board Exam Shortcut*: Direct functional evaluation $P(-2) = 2(-2)^4 - 3(-2)^3 + 5(-2) - 7 = 32 + 24 - 10 - 7 = 39$.
- **Calculator Technique**: `CALC` evaluation mode for $P(x)$, arbitrary base logarithm entry `[log_a(b)]`, and `GCD`/`LCM` functions.
- **Exclusive Mastery Challenge Set**: 25 questions covering polynomial factoring, remainder theorems, logarithmic equations, and GCD/LCM problems.

---

### Module MATH-03: Quadratic Equations, Roots Relations & Binomial Theorem
- **Source Reference**: `Notes - Algebra 3.pdf`
- **Prerequisite Bridge**: Extends polynomial algebra to second-degree equation analysis and combinatorial series expansions.
- **Atomic Definitions**:
  - **Quadratic Equation**: Standard second-degree form $Ax^2 + Bx + C = 0$ ($A, B, C \in \mathbb{R}, A \neq 0$).
  - **Pure Quadratic Equation**: Quadratic equation without linear first-degree term ($B = 0 \implies Ax^2 + C = 0$).
  - **Quadratic Formula & Discriminant ($\Delta = B^2 - 4AC$ or $\sqrt{B^2 - 4AC}$)**:
    $$x = \frac{-B \pm \sqrt{B^2 - 4AC}}{2A}$$
    - Discriminant $\Delta = 0 \implies$ Only one root (Real and equal).
    - Discriminant $\Delta > 0 \implies$ Real and unequal roots (rational if perfect square, irrational if non-square).
    - Discriminant $\Delta < 0 \implies$ Imaginary and unequal roots ($p \pm qi$).
  - **Sum and Product of Roots (Vieta's Relations)**:
    - Sum of roots: $r_1 + r_2 = -\frac{B}{A}$.
    - Product of roots: $r_1 \cdot r_2 = \frac{C}{A}$.
  - **Binomial Theorem & Expansion of $(x+y)^n$**:
    $$(x+y)^n = x^n + n x^{n-1}y + \frac{n(n-1)}{2!}x^{n-2}y^2 + \dots + n x y^{n-1} + y^n$$
    - **Total Number of Terms**: $n + 1$.
    - **$r^{\text{th}}$ Term Formula**:
      $$r^{\text{th}}\text{ term} = \frac{n(n-1)(n-2)\dots(n-r+2)}{(r-1)!}x^{(n-r+1)}y^{r-1} = {}_n C_{r-1} x^{(n-r+1)} y^{r-1}$$
    - **Term with Specific Exponent $y^r$**:
      $$y^r = \frac{n(n-1)(n-2)\dots(n-r+1)}{r!}x^{n-r}y^r$$
    - **Sum of Coefficients**: In $(ax + by)^n \implies \text{Sum} = (a + b)^n$ (evaluate with variables set to 1; subtract constant if pure numerical constant is present).
    - **Sum of Exponents**: In standard expansion $(x+y)^n \implies \text{Sum} = n(n+1)$. For $(Ax^p + By^q)^n \implies \text{Sum} = \frac{(p+q)n(n+1)}{2}$.
    - **Properties of Expansion**: Exponent of $x$ decreases by 1 while $y$ increases by 1; sum of exponents in each term equals $n$; symmetric coefficient pattern.
  - **Pascal's Triangle & Historical Names**:
    - Named after French mathematician **Blaise Pascal (1623–1662)**.
    - In Italy, known as **Tartaglia's triangle** (Niccolò Tartaglia).
    - In Asia (China), referred to as **Yang Hui's triangle**.
    - Recursive coefficient of any term from previous term (PT):
      $$C = \frac{(\text{Coeff of PT})(\text{Exponent of } x \text{ of PT})}{\text{Exponent of } y \text{ of PT} + 1}$$
- **In-Line Concept Checks**: 7 MCQs on discriminant interpretation, finding $k$ for equal roots, sum of exponents, and finding specific binomial terms.
- **Sample Problems**:
  - *Problem*: Find the 6th term in the expansion of $(2x - y^2)^8$.
  - *Academic Derivation*: Apply $T_6 = \binom{8}{5}(2x)^{8-5}(-y^2)^5$.
  - *⚡ Board Exam Shortcut*: Coefficient calculation $\binom{8}{5} \times 2^3 \times (-1)^5 = 56 \times 8 \times (-1) = -448$.
- **Calculator Technique**: `MODE 5 -> 3` (Equation solver) and `nCr` for combinatorial coefficients.
- **Exclusive Mastery Challenge Set**: 25 questions testing root relationships, discriminant analysis, and binomial expansions.

---

### Module MATH-04: Progressions, Series & Figurate Numbers
- **Source Reference**: `Notes - Algebra 4.pdf`
- **Prerequisite Bridge**: Sequences and discrete growth patterns. Foundation for discrete mathematics, numerical analysis, and engineering financial calculations.
- **Atomic Definitions**:
  - **Sequence vs Series**:
    - **Sequence**: Ordered collection of numbers where each preceding and succeeding term is completely specified (finite vs infinite).
    - **Series**: The algebraic sum of the terms of a sequence.
    - **Alternating Series**: Series with alternating positive and negative terms.
    - **Convergence vs Divergence**: Convergent series has a finite limiting sum; divergent series has no finite sum.
  - **Arithmetic Progression (AP)**: Sequence with constant common difference $d = a_n - a_{n-1}$.
    - $n$-th term: $a_n = a_1 + (n-1)d$.
    - Arithmetic Mean: $A = \frac{a+b}{2}$.
    - Sum of $n$ terms: $S_n = \frac{n}{2}[2a_1 + (n-1)d] = \frac{n}{2}(a_1 + a_n)$.
  - **Geometric Progression (GP)**: Sequence with constant common ratio $r = \frac{a_n}{a_{n-1}}$.
    - $n$-th term: $a_n = a_1 r^{n-1}$.
    - Geometric Mean: $G = \sqrt{ab}$.
    - Sum of finite GP: $S_n = \frac{a_1(r^n - 1)}{r-1} = \frac{a_1(1-r^n)}{1-r}$ ($r \neq 1$).
    - Sum of Infinite GP ($|r| < 1$): $S_\infty = \frac{a_1}{1-r}$ (if $r \ge 1$, sum is infinite / divergent).
  - **Harmonic Progression (HP)**: Sequence whose reciprocals form an AP.
    - Harmonic Mean: $H = \frac{2ab}{a+b}$.
    - Means Relation: $G^2 = A \cdot H \implies A \ge G \ge H$.
  - **Fibonacci & Lucas Sequences**:
    - **Fibonacci Sequence**: Named after Italian merchant and mathematician **Leonardo di Pisa / Fibonacci** (*Figlio dei Bonacci*, "Son of the Bonaccis"): $1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, \dots$ ($F_n = F_{n-1} + F_{n-2}$).
    - **Lucas Sequence**: Named after French mathematician **Édouard Lucas (1841–1891)**: $1, 3, 4, 7, 11, 18, 29, 47, 76, 123, \dots$ ($L_n = L_{n-1} + L_{n-2}$ with $L_1=1, L_2=3$).
  - **Figurate Numbers (Geometric Dot Patterns)**:
    - **Triangular Numbers**: $T_n = \frac{n(n+1)}{2} \implies 1, 3, 6, 10, 15, 21, \dots$
    - **Square Numbers**: $S_n = n^2 \implies 1, 4, 9, 16, 25, 36, \dots$
    - **Gnomons**: Numbers drawn as dots on equally long legs of a right angle ($2n-1 \implies 1, 3, 5, 7, 9, 11, \dots$).
    - **Oblong / Pronic Numbers**: Numbers drawn as dots in rectangular array ($n(n+1) \implies 2, 6, 12, 20, 30, \dots$).
    - **Pentagonal Numbers**: $\text{Pen}_n = \frac{n(3n-1)}{2} \implies 1, 5, 12, 22, 35, \dots$
    - **Cubic Numbers**: $C_n = n^3 \implies 1, 8, 27, 64, \dots$
    - **Tetrahedral Numbers (Triangular Pyramids)**: $\text{Tet}_n = \frac{n(n+1)(n+2)}{6} \implies 1, 4, 10, 20, \dots$
    - **Square Pyramidal Numbers**: $\text{Pyr}_n = \frac{n(n+1)(2n+1)}{6} \implies 1, 5, 14, 30, 55, \dots$
    - **Four-Dimensional / Pentatope Numbers**: Formed by piling tetrahedral numbers $\implies 1, 5, 15, 35, 70, \dots \left[\frac{n(n+1)(n+2)(n+3)}{24}\right]$.
- **In-Line Concept Checks**: 8 MCQs covering AP/GP term derivation, infinite repeating decimals to fractions using $S_\infty$, Fibonacci/Lucas sequence terms, and figurate number formulas.
- **Sample Problems**:
  - *Problem*: Convert the recurring decimal $0.2181818\dots$ to an exact fraction.
  - *Academic Derivation*: $0.2 + \frac{0.018}{1 - 0.01} = \frac{2}{10} + \frac{18}{990} = \frac{12}{55}$.
  - *⚡ Board Exam Shortcut*: Direct calculator input $0.21818181818 = \frac{12}{55}$.
- **Calculator Technique**: `MODE 3 -> 2` (Linear Regression for AP) and `MODE 3 -> 6` (Exponential Regression for GP).
- **Exclusive Mastery Challenge Set**: 25 questions testing AP/GP/HP, infinite series, Lucas sequences, and figurate number formulas.

---

## Unit 2: Advanced Counting, Probability & Statistics

### Module MATH-05: Permutations, Combinations & Counting Principles
- **Source Reference**: `Notes - Probability 1.pdf`
- **Prerequisite Bridge**: Combinatorial counting foundations. Direct linkage to digital communications bit error rates (EST) and reliability engineering (GEAS).
- **Atomic Definitions**:
  - **Fundamental Counting Principle (Multiplication Rule)**: If an operation can be performed in $m$ ways, and a second in $n$ ways, total ways $= m \times n$.
  - **Permutations**: Ordered arrangement of elements where sequence matters.
    - Linear Permutation of $n$ distinct objects taken $r$ at a time:
      $${}_n P_r = \frac{n!}{(n-r)!}, \quad {}_n P_n = n!$$
    - Cyclic / Circular Permutation: Shifting order forward/backward where first takes position of last:
      $${}_n P_n = (n-1)!$$
      If reflective/keyring symmetry applies: $P = \frac{(n-1)!}{2}$.
    - Permutations with Identical Elements:
      $$P = \frac{n!}{p!\, q!\, s!\dots}$$
  - **Inversions & Parity of Permutations**:
    - **Inversion**: Occurs when two elements in a permutation are in reverse order relative to their natural order.
    - **Even Permutation**: Contains an even number of total inversions.
    - **Odd Permutation**: Contains an odd number of total inversions.
    - Determines the number of transpositions required to return elements to their natural sorted order.
  - **Assortment**:
    - Group of objects selected from a larger set where an element can be chosen more than once (sampling with replacement):
      $$\text{Assortments} = (\text{choices for 1st}) \times (\text{choices for 2nd}) \dots = m^n$$
  - **Combinations**:
    - Selection of objects regardless of order:
      $${}_n C_r = \binom{n}{r} = \frac{n!}{(n-r)! r!}, \quad {}_n C_n = 1$$
    - **Relation between Permutation and Combination**:
      $${}_n C_r = \frac{{}_n P_r}{r!} \iff {}_n P_r = r! \cdot {}_n C_r$$
  - **Probability Foundations & Historical Treatise**:
    - Probability of Event $E$: $P(E) = \frac{\text{favorable outcomes}}{\text{total outcomes}}$, $P(\text{not } E) = 1 - P(E)$.
    - Historical Origin: 16th-century Italian mathematician and physician **Gerolamo Cardano (1501–1576)** authored *"On Casting the Die"* (*Liber de Ludo Aleae*), defining probability and earning the title **"Father of the Theory of Probability"**.
- **In-Line Concept Checks**: 8 MCQs on round-table seating, anagram permutations (e.g., MATHEMATICS), counting inversions in a sequence, and Cardano's historical probability definition.
- **Sample Problems**:
  - *Problem*: In how many ways can 6 people be seated at a round table if 2 specific persons must sit together?
  - *⚡ Board Exam Shortcut*: Treat the pair as 1 entity: $(5-1)! \times 2! = 24 \times 2 = 48$.
- **Calculator Technique**: Keystrokes for `nPr` and `nCr` functions in multi-step permutations.
- **Exclusive Mastery Challenge Set**: 25 questions covering constrained permutations, ring permutations, inversions, and combinatorial selections.

---

### Module MATH-06: Probability Theory, Distributions & Games of Chance
- **Source Reference**: `Notes - Probability 2.pdf`, `Notes - Probability 3.pdf`
- **Prerequisite Bridge**: Mathematical modeling of uncertainty. Foundation for noise in communication channels (EST) and quality control (GEAS).
- **Atomic Definitions**:
  - **Terms in Probability**:
    - **Experiment**: Controlled study whose outcome is uncertain but not entirely unknown.
    - **Trial**: Single recorded execution of an experiment.
    - **Outcome**: Possible elementary result from a trial (e.g., heads, tails).
    - **Event ($E$)**: Subset/combination of possible outcomes (e.g., rolling a prime, drawing a heart).
    - **Frequency & Relative Frequency (RF)**: $\text{RF} = \frac{\text{no. of occurrences}}{\text{no. of trials}}$.
  - **Probability Laws**:
    - Basic Probability: $P(E) = \frac{n(E)}{n(S)}$, where $0 \le P(E) \le 1$.
    - Complementary Event: $P(E') = P(\text{not } E) = 1 - P(E)$.
    - **Mutually Exclusive Events**: Cannot occur simultaneously ($P(A \cap B) = 0 \implies P(A \cup B) = P(A) + P(B)$).
    - **Independent Events**: Occurrence does not affect the other ($P(A \cap B) = P(A) \cdot P(B)$).
    - **Conditional Probability**: $P(A|B) = \frac{P(A \cap B)}{P(B)}$.
  - **Binomial Probability Distribution (Repeated Bernoulli Trials)**:
    $$P(X = r) = {}_n C_r p^r q^{n-r}, \quad q = 1 - p$$
  - **Odds (True Odds vs Payoff Odds)**:
    - **Odds For an Event $E$**:
      $$\text{Odds For } E = \frac{P(E)}{1 - P(E)} = \frac{a}{b} \implies P(E) = \frac{a}{a + b}$$
    - **Odds Against an Event $E$**: Reciprocal of odds for ($\text{Odds Against} = \frac{b}{a}$).
  - **Mathematical Expectation**:
    $$E(X) = \sum (\text{Payoff}_i \times P_i)$$
    - If $E > 0 \implies$ Player wins in the long run.
    - If $E < 0 \implies$ Player loses in the long run.
    - If $E = 0 \implies$ Fair game.
  - **Standard Card Deck Calendar Symbolism & King Lore**:
    - 52 cards in a deck $= 52$ weeks in a year.
    - 4 suits (Spades, Hearts, Diamonds, Clubs) $= 4$ seasons of the year.
    - 12 face cards (4 Kings, 4 Queens, 4 Jacks) $= 12$ months of the year.
    - **Historical Figures Represented by the Four Kings**:
      - **King of Hearts**: **Charlemagne**
      - **King of Clubs**: **Alexander the Great**
      - **King of Diamonds**: **Julius Caesar**
      - **King of Spades**: **King David**
  - **Dice Mechanics & Properties**:
    - First used by the Chinese for gaming.
    - **Sum of opposite faces** of a standard die is always equal to **7**.
    - **Sum of all four vertical side faces** of a die is always equal to **14**.
    - Rolling a pair of 1s on two dice is termed **"snake's eyes"**.
    - Two-Dice Sum Probability Distribution ($n(S) = 36$):
      - Sum $2$ ($1/36$), Sum $3$ ($2/36$), Sum $4$ ($3/36$), Sum $5$ ($4/36$), Sum $6$ ($5/36$), Sum $7$ ($6/36 = 1/6$, mode), Sum $8$ ($5/36$), Sum $9$ ($4/36$), Sum $10$ ($3/36$), Sum $11$ ($2/36$), Sum $12$ ($1/36$).
  - **Poker Hand Combinations & Probabilities (52-card deck, $\binom{52}{5} = 2,598,960$)**:
    - **Royal Flush**: $4$ ways ($P = 0.00000154$, 1 in 649,740 hands).
    - **Straight Flush**: $36$ ways ($P = 0.00001385$, 1 in 72,192 hands).
    - **Four of a Kind**: $624$ ways ($P = 0.0002401$, 1 in 4,165 hands).
    - **Full House**: $3,744$ ways ($P = 0.0014406$, 1 in 694 hands).
    - **Flush**: $5,108$ ways ($P = 0.0019654$, 1 in 509 hands).
    - **Straight**: $10,200$ ways ($P = 0.0039246$, 1 in 255 hands).
    - **Three of a Kind**: $54,912$ ways ($P = 0.0211285$, 1 in 47.33 hands).
    - **Two Pair**: $123,552$ ways ($P = 0.0475390$, 1 in 21 hands).
    - **One Pair**: $1,098,240$ ways ($P = 0.4225690$, 1 in 2.37 hands).
    - **High Card / None**: $1,302,540$ ways ($P = 0.5011774$, 1 in 2 hands).
- **In-Line Concept Checks**: 10 MCQs on dice face sums (opposite=7, vertical=14), odds-to-probability conversions, roulette expectation, King history names, and binomial probabilities.
- **Sample Problems**:
  - *Problem*: Find the odds for throwing a total of 5 or 10 in rolling two dice.
  - *Academic Derivation*: $P(5) = \frac{4}{36}$, $P(10) = \frac{3}{36} \implies P(5 \text{ or } 10) = \frac{7}{36}$. $\text{Odds} = \frac{7/36}{1 - 7/36} = \frac{7}{29}$ ($7\text{ to }29$).
  - *⚡ Board Exam Shortcut*: $\text{Favorable} = 4 + 3 = 7$; $\text{Unfavorable} = 36 - 7 = 29 \implies 7\text{-to-}29\text{ odds}$.
- **Calculator Technique**: `MODE 3` (Stats / Distribution) binomial distribution evaluation.
- **Exclusive Mastery Challenge Set**: 25 questions covering probability rules, conditional events, expectation, and poker distributions.

---

## Unit 3: Discrete Mathematics & Propositional Logic

### Module MATH-07: Set Theory, Relations, Functions & Propositional Logic
- **Source Reference**: `Notes - Discrete Math 1.pdf`, `Notes - Discrete Math 2.pdf`, `Notes - Discrete Math 3.pdf`
- **Prerequisite Bridge**: Rigorous mathematical logic and relational structures. Direct bridge to digital logic gates, computer architecture, and database relational algebra.
- **Atomic Definitions**:
  - **Discrete Mathematics & Combinatorics**: Study of mathematical structures that are fundamentally discrete rather than continuous. Combinatorics studies how discrete objects combine.
  - **Set Theory (Georg Cantor 1845–1918)**:
    - **Set ($\mathcal{S}$)**: Unordered collection of distinct elements/members.
    - Set Builder / Comprehension: $\{x \mid P(x)\}$. Listing / Roster method: $\{1, 2, 3\}$.
    - **Universal Set ($\mathbf{U}$)**: Set of all objects under consideration.
    - **Empty / Null Set ($\emptyset$ or $\{\}$)**: Contains no elements. ($\emptyset \subseteq \mathcal{S}$ for every set $\mathcal{S}$).
    - **Subset ($\subseteq$) vs Proper Subset ($\subset$)**: $A \subseteq B$ if $\forall x \in A, x \in B$. $A \subset B$ if $A \subseteq B$ and $\exists y \in B$ with $y \notin A$.
    - **Superset ($\supseteq$) vs Proper Superset ($\supset$)**: $A \supset B$ if $A$ contains all elements of $B$ plus more.
    - **Disjoint Sets**: $A \cap B = \emptyset$.
    - **Venn Diagram (John Venn 1880)**: Visualizing set relationships with overlapping geometric shapes inside universal rectangle $\mathbf{U}$.
    - **Order / Cardinality ($|A|$)**: Number of distinct elements in $A$.
    - **Power Set ($\mathcal{P}(A)$)**: Set of all subsets of $A$. $|\mathcal{P}(A)| = 2^{|A|} = 2^k$.
  - **Set Operations**:
    - Union: $A \cup B = \{x \mid x \in A \lor x \in B\}$.
    - Intersection: $A \cap B = \{x \mid x \in A \land x \in B\}$.
    - Relative Complement / Difference: $A \setminus B = A - B = \{x \mid x \in A \land x \notin B\}$.
    - Absolute Complement: $A^c = A' = \mathbf{U} - A$.
    - Cartesian Product: $A \times B = \{(a, b) \mid a \in A \land b \in B\}$. ($A \times B \neq B \times A$).
  - **Relations on Set $A$ ($R \subseteq A \times B$)**:
    - **Domain**: Set of inputs. **Codomain**: Target set of possible outputs. **Range**: Actual set of outputs.
    - **Properties of Relations**:
      - Reflexive: $\forall a \in A, (a, a) \in R \iff D(A) \subseteq R$.
      - Irreflexive: $\forall a \in A, (a, a) \notin R$.
      - Symmetric: $(a, b) \in R \implies (b, a) \in R \iff R^{-1} \subseteq R$.
      - Antisymmetric: $(a, b) \in R \land (b, a) \in R \implies a = b \iff R \cap R^{-1} \subseteq D(A)$.
      - Asymmetric: $R \cap R^{-1} = \emptyset$.
      - Transitive: $(a, b) \in R \land (b, c) \in R \implies (a, c) \in R \iff R \circ R \subseteq R$.
      - **Equivalence Relation**: Relation that is Reflexive, Symmetric, and Transitive ($x \sim y$).
      - **Trichotomy**: For all $a, b \in A$, exactly one or at least one of $aRb$ or $bRa$ holds (e.g., $\ge$).
  - **Functions & Composition**:
    - Function: Relation where each domain input maps to exactly one codomain element ($R^{-1} \circ R \subseteq D(B)$).
    - **Injective (One-to-One)**: $f(a) = f(b) \implies a = b \iff R \circ R^{-1} \subseteq D(A)$.
    - **Surjective (Onto)**: $\forall b \in B, \exists a \in A$ such that $f(a) = b$.
    - **Bijective (One-to-One Correspondence)**: Both injective and surjective.
    - **Composition of Functions**: $(f \circ g)(x) = f(g(x))$. Inverse function: $f(f^{-1}(x)) = x$.
  - **Propositional Logic & Connectives**:
    - Proposition: Declarative statement that is strictly True ($T$) or False ($F$).
    - Connectives: Negation ($\neg P$), Conjunction ($P \land Q$), Disjunction ($P \lor Q$), Exclusive OR ($P \oplus Q$), Implication ($P \to Q$), Biconditional ($P \leftrightarrow Q$).
    - Implication Variations:
      - Direct: $P \to Q$.
      - Inverse: $\neg P \to \neg Q$.
      - Converse: $Q \to P$.
      - Contrapositive: $\neg Q \to \neg P$ (logically equivalent to $P \to Q$).
- **In-Line Concept Checks**: 8 MCQs on Venn diagram region counts, relation property algebraic conditions ($R \circ R \subseteq R$), and contrapositive logical equivalence.
- **Sample Problems**:
  - *Problem*: Given a set with 5 elements, how many non-empty proper subsets does it possess?
  - *Academic Derivation*: Total subsets $= 2^5 = 32$. Subtract empty set ($1$) and improper full set ($1$) $= 32 - 2 = 30$.
- **Exclusive Mastery Challenge Set**: 25 questions testing logic tables, set algebra, and relational properties.

---

## Unit 4: Plane & Spherical Trigonometry

### Module MATH-08: Trigonometric Identities, Ratios & Oblique Triangle Laws
- **Source Reference**: `Notes - Trigonometry 1.pdf`, `Notes - Trigonometry 2.pdf`
- **Prerequisite Bridge**: Foundational geometry of angles and waves. Connects to AC circuits phasor analysis (Electronics) and wave propagation (EST).
- **Atomic Definitions**:
  - **Trigonometry**: Derived from Greek *trigonon* (triangle) and *metria* (measurement). Plane Trigonometry (2D) vs Spherical Trigonometry (sphere surface).
  - **Triangles Classification**: Right triangle ($90^\circ$), Oblique triangle (Acute / Obtuse), Isosceles triangle.
  - **Special Triangles**:
    - **Egyptian Triangle**: $3-4-5$ Right Triangle.
    - **Isosceles Right Triangle ($45^\circ-45^\circ-90^\circ$)**: Side ratio $1 : 1 : \sqrt{2}$.
    - **$30^\circ-60^\circ-90^\circ$ Right Triangle**: Side ratio $1 : \sqrt{3} : 2$.
  - **Pythagorean Theorem**: $a^2 + b^2 = c^2$. Formulated by **Pythagoras (c. 580–500 B.C.)**, considered the most proved theorem in mathematics.
  - **Complete Trigonometric Identities List**:
    - **Reciprocal**: $\sin\theta = \frac{1}{\csc\theta}, \cos\theta = \frac{1}{\sec\theta}, \tan\theta = \frac{1}{\cot\theta}, \cot\theta = \frac{1}{\tan\theta}, \sec\theta = \frac{1}{\cos\theta}, \csc\theta = \frac{1}{\sin\theta}$.
    - **Even-Odd**: $\sin(-\theta) = -\sin\theta, \cos(-\theta) = \cos\theta, \tan(-\theta) = -\tan\theta, \cot(-\theta) = -\cot\theta, \sec(-\theta) = \sec\theta, \csc(-\theta) = -\csc\theta$.
    - **Co-function**: $\sin\theta = \cos(90^\circ - \theta), \cos\theta = \sin(90^\circ - \theta), \tan\theta = \cot(90^\circ - \theta), \cot\theta = \tan(90^\circ - \theta), \sec\theta = \csc(90^\circ - \theta), \csc\theta = \sec(90^\circ - \theta)$.
    - **Pythagorean**: $\sin^2\theta + \cos^2\theta = 1, \quad 1 + \tan^2\theta = \sec^2\theta, \quad 1 + \cot^2\theta = \csc^2\theta$.
    - **Sum & Difference of Angles**:
      $$\sin(\theta \pm \alpha) = \sin\theta\cos\alpha \pm \cos\theta\sin\alpha$$
      $$\cos(\theta \pm \alpha) = \cos\theta\cos\alpha \mp \sin\theta\sin\alpha$$
      $$\tan(\theta \pm \alpha) = \frac{\tan\theta \pm \tan\alpha}{1 \mp \tan\theta\tan\alpha}$$
    - **Double Angle**: $\sin 2\theta = 2\sin\theta\cos\theta, \quad \cos 2\theta = \cos^2\theta - \sin^2\theta = 2\cos^2\theta - 1 = 1 - 2\sin^2\theta, \quad \tan 2\theta = \frac{2\tan\theta}{1 - \tan^2\theta}$.
    - **Power Reduction / Half-Angle Powers**:
      $$\sin^2\theta = \frac{1 - \cos 2\theta}{2}, \quad \cos^2\theta = \frac{1 + \cos 2\theta}{2}, \quad \tan^2\theta = \frac{1 - \cos 2\theta}{1 + \cos 2\theta}$$
    - **Half-Angle Formulas**: $\sin\frac{\theta}{2} = \pm\sqrt{\frac{1-\cos\theta}{2}}, \cos\frac{\theta}{2} = \pm\sqrt{\frac{1+\cos\theta}{2}}, \tan\frac{\theta}{2} = \frac{1-\cos\theta}{\sin\theta} = \frac{\sin\theta}{1+\cos\theta}$.
    - **Sum & Difference of Two Functions (Sum-to-Product)**:
      $$\sin\theta \pm \sin\alpha = 2\sin\frac{\theta \pm \alpha}{2}\cos\frac{\theta \mp \alpha}{2}$$
      $$\cos\theta + \cos\alpha = 2\cos\frac{\theta + \alpha}{2}\cos\frac{\theta - \alpha}{2}, \quad \cos\theta - \cos\alpha = -2\sin\frac{\theta + \alpha}{2}\sin\frac{\theta - \alpha}{2}$$
      $$\tan\theta \pm \tan\alpha = \frac{\sin(\theta \pm \alpha)}{\cos\theta\cos\alpha}$$
    - **Product of Two Functions (Product-to-Sum)**:
      $$2\sin\theta\sin\alpha = \cos(\theta - \alpha) - \cos(\theta + \alpha)$$
      $$2\sin\theta\cos\alpha = \sin(\theta + \alpha) + \sin(\theta - \alpha)$$
      $$2\cos\theta\cos\alpha = \cos(\theta + \alpha) + \cos(\theta - \alpha)$$
    - **Exponential Forms (Euler)**:
      $$\sin x = \frac{e^{ix} - e^{-ix}}{2i}, \quad \cos x = \frac{e^{ix} + e^{-ix}}{2}, \quad \tan x = \frac{-i(e^{ix} - e^{-ix})}{e^{ix} + e^{-ix}}, \quad \cot x = \frac{i(e^{ix} + e^{-ix})}{e^{ix} - e^{-ix}}$$
  - **Laws of Oblique Triangles & Historical Demonstrators**:
    - **Law of Sines (Demonstrated by Ptolemy of Alexandria 150 A.D.)**:
      $$\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R$$
      Used for AAS, ASA, and SSA.
    - **Law of Cosines (Demonstrated by François Viète 1540–1603)**:
      $$a^2 = b^2 + c^2 - 2bc\cos A$$
      Used for SAS and SSS.
    - **Law of Tangents (Thomas Fincke 1583 / François Viète)**:
      $$\frac{a-b}{a+b} = \frac{\tan\frac{1}{2}(A-B)}{\tan\frac{1}{2}(A+B)}$$
    - **Ambiguous Case (SSA)**: When solving oblique triangles with given sides $a, b$ and non-included angle $A$:
      - $\sin B = \frac{b\sin A}{a}$. Since $\sin B = \sin(180^\circ - B)$, two angle solutions $B$ and $180^\circ - B$ exist if $b\sin A < a < b$.
- **In-Line Concept Checks**: 10 MCQs on identity transformations, even-odd symmetries ($\cos(-\theta)=\cos\theta$), sum-to-product expansions, Law of Sines ambiguous case criteria, and Euler exponential conversions.
- **Sample Problems**:
  - *Problem*: In triangle $ABC$, $a = 10, b = 15, A = 30^\circ$. How many triangles can be constructed?
  - *Academic Derivation*: Altitude $h = b\sin A = 15\sin 30^\circ = 7.5$. Since $h < a < b$ ($7.5 < 10 < 15$), exactly 2 triangles exist.
- **Calculator Technique**: Direct angle mode verification, polar-rectangular conversions (`Pol` / `Rec`), and complex mode Euler exponential evaluations.
- **Exclusive Mastery Challenge Set**: 25 questions testing identities, sum/product transforms, oblique triangle solutions, and ambiguous cases.

---

### Module MATH-09: Triangle Centers, Inscribed/Circumscribed Circles & Quadrilaterals
- **Source Reference**: `Notes - Trigonometry 3.pdf`, `Notes - Trigonometry 4.pdf`
- **Prerequisite Bridge**: Connects triangle properties with circle theorems and quadrilateral geometry.
- **Atomic Definitions**:
  - **Special Lines in Triangle**:
    - Altitude: Line segment from vertex perpendicular to opposite side. Height $h_c = \frac{2\sqrt{s(s-a)(s-b)(s-c)}}{c}$. Altitudes concur at the **Orthocenter**.
    - Median: Line segment connecting vertex to midpoint of opposite side. Length $m_c = \frac{1}{2}\sqrt{2a^2 + 2b^2 - c^2}$. Medians concur at the **Centroid** (located at $2/3$ distance from vertex to midpoint).
    - Angle Bisector: Line bisecting vertex angle. Length $t_c = \sqrt{ab\left[1 - \left(\frac{c}{a+b}\right)^2\right]}$. Bisectors concur at the **Incenter** (center of inscribed circle).
    - Perpendicular Bisector: Concur at the **Circumcenter** (center of circumscribing circle). In a right triangle, circumcenter is the midpoint of the hypotenuse ($R = c/2$).
  - **Area of Triangles**:
    - Base and Altitude: $A = \frac{1}{2}bh$.
    - SAS Formula: $A = \frac{1}{2}ab\sin\theta$.
    - Heron's Formula (Heron of Alexandria, 1st Century A.D.): $A = \sqrt{s(s-a)(s-b)(s-c)}$, where semi-perimeter $s = \frac{a+b+c}{2}$.
    - Inscribed Circle: $A = rs \implies r = \frac{A}{s}$.
    - Circumscribed Circle: $A = \frac{abc}{4R} \implies R = \frac{abc}{4A}$.
    - Escribed Circle (tangent to side $b$): $A = r_b(s-b) \implies r_b = \frac{A}{s-b}$.
    - Equilateral Triangle: $r = \frac{a\sqrt{3}}{6}$, $R = \frac{a\sqrt{3}}{3}$, $A = \frac{a^2\sqrt{3}}{4}$.
  - **Quadrilaterals & Cyclic Properties**:
    - General Quadrilateral with Diagonals $d_1, d_2$ and included angle $\theta$: $A = \frac{1}{2}d_1 d_2 \sin\theta$.
    - General Quadrilateral given 4 sides and 2 opposite angles (**Bretschneider's Formula**):
      $$A = \sqrt{(s-a)(s-b)(s-c)(s-d) - abcd\cos^2\theta}, \quad s = \frac{a+b+c+d}{2}, \quad \theta = \frac{A+C}{2} = \frac{B+D}{2}$$
    - Parallelogram: $A = bh = ab\sin\theta = \frac{1}{2}d_1 d_2 \sin\theta$.
    - Rhombus: Diagonals are perpendicular bisectors ($A = \frac{1}{2}d_1 d_2 = a^2\sin\theta$).
    - Trapezoid: $A = \frac{1}{2}(a+b)h$.
    - Cyclic Quadrilateral (vertices lie on circle, $A+C = B+D = 180^\circ \implies \theta = 90^\circ, \cos\theta = 0$):
      - Brahmagupta's Formula: $A = \sqrt{(s-a)(s-b)(s-c)(s-d)}$, where $s = \frac{a+b+c+d}{2}$.
      - Circumradius (Parameshvara's Formula, 15th Century):
        $$R = \frac{1}{4}\sqrt{\frac{(ab+cd)(ac+bd)(ad+bc)}{(s-a)(s-b)(s-c)(s-d)}} = \frac{\sqrt{(ab+cd)(ac+bd)(ad+bc)}}{4A}$$
      - Ptolemy's Theorem (Claudius Ptolemaeus c. 100–168 A.D.):
        $$ac + bd = d_1 d_2$$
- **In-Line Concept Checks**: 8 MCQs on centroid coordinate ratio, Heron's calculation, Bretschneider's formula, and Ptolemy's theorem diagonal solutions.
- **Sample Problems**:
  - *Problem*: A cyclic quadrilateral has sides $a=2, b=3, c=4, d=5$. Find its area.
  - *Academic Derivation*: $s = \frac{2+3+4+5}{2} = 7$. $A = \sqrt{(7-2)(7-3)(7-4)(7-5)} = \sqrt{5 \times 4 \times 3 \times 2} = \sqrt{120} \approx 10.954$.
- **Calculator Technique**: Formula storage in variables `A, B, C, D, S` for multi-step area calculations.
- **Exclusive Mastery Challenge Set**: 25 questions on triangle centers, cyclic quadrilaterals, Bretschneider equations, and circumcircle theorems.

---

## Unit 5: Plane & Solid Geometry

### Module MATH-10: Plane Geometry, Polygons & Circle Geometry Theorems
- **Source Reference**: `Notes - Plane Geometry 1.pdf` to `5.pdf`
- **Prerequisite Bridge**: Axiomatic planar relationships, Euclidean foundations, and geometric properties of regular shapes and circles.
- **Atomic Definitions**:
  - **Euclidean Geometry Foundations (Euclid c. 300 B.C., "Elements" in 13 volumes)**:
    1. A straight line can be drawn between any two points.
    2. A line segment can be extended indefinitely.
    3. A circle can be drawn with any center and radius.
    4. All right angles are equal.
    5. **Parallel Postulate**: Given a line and a point not on it, exactly one line can be drawn parallel to the given line.
  - **Branches of Geometry**: Plane, Solid, Euclidean, Non-Euclidean, Projective, Trigonometry, Analytic (René Descartes), Differential Geometry.
  - **Types of Angles**:
    - Null/Zero ($0^\circ$), Acute ($0 < \theta < 90^\circ$), Right ($90^\circ$ or $\pi/2$), Obtuse ($90^\circ < \theta < 180^\circ$), Straight ($180^\circ$ or $\pi$), Reflex ($180^\circ < \theta < 360^\circ$), Perigon / Full ($360^\circ$ or $2\pi$).
    - Adjacent Angles, Vertical Angles (opposite and equal), Complementary ($\Sigma = 90^\circ$), Supplementary ($\Sigma = 180^\circ$), Explementary / Conjugate ($\Sigma = 360^\circ$).
  - **Angle Units Conversion (1 Revolution)**:
    $$1\text{ rev} = 360^\circ = 2\pi\text{ rad} = 400\text{ gon (grad/grade)} = 6400\text{ mils}$$
    - Degree: Non-SI unit, Babylonians ($4000\text{ yrs ago}$), $1^\circ = 60', 1' = 60''$.
    - Gon / Centesimal Degree: $1/400\text{ circle} = 100\text{ centesimal minutes} = 10,000\text{ centesimal seconds}$.
    - Mil: $1/6400\text{ circle}$ ($1\text{ right angle} = 1600\text{ mils}$).
  - **Polygon Classifications & Angle Properties**:
    - Names: Triangle ($3$), Quadrilateral/Tetragon ($4$), Pentagon ($5$), Hexagon ($6$), Heptagon ($7$), Octagon ($8$), Nonagon ($9$), Decagon ($10$), Undecagon ($11$), Dodecagon ($12$), Hectagon ($100$), Megagon ($10^6$), Googolgon ($10^{100}$).
    - Convex (all interior angles $< 180^\circ$) vs Concave (contains **Reentrant angle** $> 180^\circ$; non-reentrant are **Salient angles**).
    - Sum of interior angles: $\Sigma_{\text{int}} = (n-2)180^\circ = (n-2)\pi$.
    - Each interior angle of regular polygon: $\theta_{\text{int}} = \frac{(n-2)180^\circ}{n}$.
    - Sum of exterior angles: $\Sigma_{\text{ext}} = 360^\circ$.
    - Number of diagonals: $D = \frac{n(n-3)}{2}$.
  - **Regular Polygon Area & Perimeter Formulas**:
    - Given side $a$: $A = \frac{1}{4}n a^2 \cot\left(\frac{180^\circ}{n}\right), \quad P = na$.
    - Circumscribing circle of radius $r$: $A = n r^2 \tan\left(\frac{180^\circ}{n}\right), \quad P = 2nr\tan\left(\frac{180^\circ}{n}\right)$.
    - Inscribed in circle of radius $r$: $A = \frac{1}{2}n r^2 \sin\left(\frac{360^\circ}{n}\right), \quad P = 2nr\sin\left(\frac{180^\circ}{n}\right)$.
  - **Special Quadrilaterals**:
    - **Square** ($A=a^2$), **Rectangle** ($A=ab$), **Rhombus** ($A=bh=\frac{1}{2}d_1 d_2=a^2\sin\theta$).
    - **Parallelogram / Rhomboid** ($A=bh=ab\sin\theta=\frac{1}{2}d_1 d_2 \sin\theta$).
    - **Trapezoid** ($A=\frac{1}{2}(a+b)h$), **Trapezium** (general quadrilateral with no parallel sides).
    - **Kite** (convex quadrilateral with two pairs of equal adjacent sides) vs **Deltoid** (concave quadrilateral with two pairs of equal adjacent sides).
    - **Quadrilateral Circumscribing a Circle (Tangential Quadrilateral)**:
      $$A = Rs = \sqrt{abcd} \quad (\text{where } s = (a+b+c+d)/2)$$
    - **Brahmagupta's Theorem on Perpendicular Diagonals**:
      "In a cyclic quadrilateral having perpendicular diagonals, the perpendicular to a side from the intersection of diagonals always bisects the opposite side."
  - **Circle Geometry Theorems**:
    - Central Angle Theorem: $\theta_{\text{central}} = 2\theta_{\text{inscribed}}$.
    - Inscribed angles subtending same arc are equal.
    - Thales's Theorem: Angle inscribed in a semicircle is a right angle ($90^\circ$).
    - Intersecting Chords Theorem: $a \cdot b = c \cdot d$.
    - Secant Theorem: $a(a+b) = c(c+d)$.
    - Tangent-Secant Theorem: $t^2 = a(a+b)$.
    - Sector Area: $A = \frac{1}{2}r c = \frac{1}{2}r^2\theta = \frac{\pi r^2 \theta}{360^\circ}$. Segment Area $= A_{\text{sector}} - A_{\text{triangle}}$.
  - **Ellipse & Annulus**:
    - Ellipse: $A = \pi ab, \quad P \approx 2\pi\sqrt{\frac{a^2+b^2}{2}}$.
    - Annulus: $A = \pi(R^2 - r^2) = \frac{\pi x^2}{4}$ (where $x$ is length of tangent chord).
- **In-Line Concept Checks**: 10 MCQs on angle conversions in mils/grads, polygon diagonal counts, Tangential quadrilateral area ($A=\sqrt{abcd}$), and circle chord theorems.
- **Sample Problems**:
  - *Problem*: How many diagonals does a regular decagon have?
  - *⚡ Board Exam Shortcut*: $\frac{10(10-3)}{2} = \frac{10 \times 7}{2} = 35$.
- **Calculator Technique**: Unit conversions for angle modes (DRG menu) and regular polygon area functions.
- **Exclusive Mastery Challenge Set**: 25 questions testing polygon formulas, circle theorems, planar areas, and Brahmagupta's theorems.

---

### Module MATH-11: Solid Geometry, Polyhedrons & Platonic Solids
- **Source Reference**: `Notes - Solid Geometry 1.pdf`, `Notes - Solid Geometry 2.pdf`, `Notes - Solid Geometry 3.pdf`
- **Prerequisite Bridge**: 3D spatial calculations. Direct application in antenna structures, electromagnetic volume integrations, and material densities.
- **Atomic Definitions**:
  - **Prisms**: Polyhedron comprising an $n$-sided polygonal base, a second congruent parallel base that is a translated copy, and $n$ parallelogram lateral faces joining corresponding sides:
    - **Cube (Regular Hexahedron)**: $V = a^3$, Total Surface Area $A_s = 6a^2$, Space Diagonal $d = a\sqrt{3}$. (One of the 5 Platonic solids).
    - **Rectangular Parallelepiped**: 6 rectangular faces: $V = abc$, $A_s = 2(ab + bc + ca)$, Space Diagonal $d = \sqrt{a^2 + b^2 + c^2}$.
    - **Right Prism**: Lateral faces are perpendicular to the bases:
      $$V = B h, \quad A_L = h p_b \quad (p_b = \text{perimeter of base})$$
    - **Oblique Prism**: Lateral faces are not perpendicular to the base:
      $$V = B h = K e, \quad A_L = e p_K$$
      where $K$ is the area of the **right section** (section perpendicular to the lateral edge), $e$ is lateral edge length, and $p_K$ is perimeter of the right section.
    - **Truncated Prism**: Portion of a prism contained between the base and a non-parallel intersecting plane:
      $$V = B \left(\frac{h_1 + h_2 + h_3 + \dots + h_n}{n}\right) = B \cdot \overline{h}$$
  - **Cylinders**: Solid bounded by a closed cylindrical surface and two parallel planes:
    - **Right Cylinder**: $V = B h = \pi r^2 h$, Lateral Area $A_L = C_b h = 2\pi r h$ ($C_b$ = base circumference).
    - **Oblique Cylinder**: $V = B h = K e$, Lateral Area $A_L = e p_K$ ($K$ = right-section area, $p_K$ = right-section perimeter).
  - **Pyramids & Frustums**:
    - **Pyramid**: Polyhedron with one polygonal base ($B$) and triangular lateral faces meeting at a common vertex:
      $$V = \frac{1}{3} B h$$
    - **Frustum of a Pyramid**: Portion included between base $B_1$ and parallel cutting plane $B_2$:
      $$V = \frac{h}{3}(B_1 + B_2 + \sqrt{B_1 B_2})$$
  - **Cones & Frustums**:
    - **Right Circular Cone**: Directrix is a closed circle:
      $$V = \frac{1}{3}\pi r^2 h = \frac{1}{3} B h, \quad A_L = \pi r L \quad (\text{Slant Height } L = \sqrt{r^2 + h^2})$$
    - **Frustum of a Cone** (Bases of radii $R$ and $r$, height $h$, slant height $L = \sqrt{h^2 + (R-r)^2}$):
      - Volume: $V = \frac{h}{3}(B_1 + B_2 + \sqrt{B_1 B_2}) = \frac{\pi h}{3}(R^2 + r^2 + Rr)$.
      - Curved / Lateral Surface Area: $A_L = \pi (R + r) L$.
      - Total Surface Area: $A_T = \pi L(R + r) + \pi R^2 + \pi r^2$.
  - **Prismatoid & Prismoidal Formula**:
    - Polyhedron having two parallel polygon bases ($A_1, A_2$) and lateral faces that are triangles or trapezoids with vertices alternating between bases:
      $$V = \frac{L}{6}(A_1 + 4 A_m + A_2)$$
      where $A_m$ is the cross-sectional area at the exact midsection ($L/2$), and $L$ is perpendicular distance between end bases.
  - **Sphere & Spherical Figures**:
    - **Sphere**: Bounded by closed surface equidistant from center: $V = \frac{4}{3}\pi R^3 = \frac{\pi D^3}{6}$, $A_s = 4\pi R^2 = \pi D^2$.
    - **Spherical Zone**: Portion of spherical surface between two parallel planes: $A_{\text{zone}} = 2\pi R h$.
    - **Spherical Segment of One Base (Spherical Cap)**: Solid bounded by zone and base plane:
      $$V = \frac{\pi h^2}{3}(3R - h) = \frac{\pi h}{6}(3a^2 + h^2)$$
    - **Spherical Segment of Two Bases** (Base radii $a$ and $b$, height $h$):
      $$V = \frac{\pi h}{6}(3a^2 + 3b^2 + h^2), \quad A_T = \pi(2Rh + a^2 + b^2)$$
    - **Spherical Sector**: Solid generated by rotating a circle sector about an axis through center:
      $$V = \frac{1}{3} A_{\text{zone}} R = \frac{2}{3}\pi R^2 h$$
    - **Spherical Pyramid**: Base on spherical surface with edges meeting at sphere center:
      $$V = \frac{\pi R^3 E}{540}$$
      where $E = (A + B + C) - 180^\circ$ is the spherical excess in degrees.
    - **Spherical Wedge (Ungula)**: Solid bounded by two half great circles and included surface arc:
      $$V = \frac{\pi R^3 \theta}{270} \quad (\theta \text{ in degrees})$$
      - Spherical Lune (surface area of wedge): $A_{\text{lune}} = \frac{\pi R^2 \theta}{90}$.
  - **Torus (Anchor Ring)**: Solid formed by revolving a circle of radius $r$ (diameter $d$) about a coplanar line not intersecting it at distance $R$ (diameter $D$):
    $$V = 2\pi^2 R r^2 = \frac{\pi^2 D d^2}{4}, \quad A_L = 4\pi^2 R r = \pi^2 D d$$
  - **Ellipsoids / Spheroids**:
    - **General Ellipsoid** (semi-axes $a, b, c$): $V = \frac{4}{3}\pi a b c$.
    - **Prolate Spheroid** (ellipse revolved about its **major axis** $a$): $V = \frac{4}{3}\pi a b^2$.
    - **Oblate Spheroid** (ellipse revolved about its **minor axis** $b$): $V = \frac{4}{3}\pi a^2 b$.
  - **Polyhedrons & Platonic Solids (Plato 427–348 B.C.)**:
    - Etymology: Greek *poly* (many) + *hedron* (base/face).
    - **Convex Polyhedron**: Lies entirely on one side of any plane containing any of its faces; every line segment connecting two points lies inside or on the boundary.
    - **The 5 Regular Platonic Solids Master Parameters**:
      1. **Tetrahedron**:
         - Faces: $4$ Equilateral Triangles ($60^\circ$), Vertices: $V = 4$, Edges: $E = 6$.
         - Sum of angles at vertex: $3 \times 60^\circ = 180^\circ$.
         - Circumscribed Sphere Radius: $R_{\text{circ}} = \frac{e\sqrt{6}}{4}$.
         - Inscribed Sphere Radius: $r_{\text{in}} = \frac{e\sqrt{6}}{12}$.
         - Total Area: $A_T = e^2\sqrt{3}$, Volume: $V = \frac{e^3\sqrt{2}}{12}$.
      2. **Hexahedron (Cube)**:
         - Faces: $6$ Squares ($90^\circ$), Vertices: $V = 8$, Edges: $E = 12$.
         - Sum of angles at vertex: $3 \times 90^\circ = 270^\circ$.
         - Circumscribed Sphere Radius: $R_{\text{circ}} = \frac{e\sqrt{3}}{2}$.
         - Inscribed Sphere Radius: $r_{\text{in}} = \frac{e}{2}$.
         - Total Area: $A_T = 6e^2$, Volume: $V = e^3$.
      3. **Octahedron**:
         - Faces: $8$ Equilateral Triangles ($60^\circ$), Vertices: $V = 6$, Edges: $E = 12$.
         - Sum of angles at vertex: $4 \times 60^\circ = 240^\circ$.
         - Circumscribed Sphere Radius: $R_{\text{circ}} = \frac{e\sqrt{2}}{2}$.
         - Inscribed Sphere Radius: $r_{\text{in}} = \frac{e\sqrt{6}}{6}$.
         - Total Area: $A_T = 2e^2\sqrt{3}$, Volume: $V = \frac{e^3\sqrt{2}}{3}$.
      4. **Dodecahedron**:
         - Faces: $12$ Regular Pentagons ($108^\circ$), Vertices: $V = 20$, Edges: $E = 30$.
         - Sum of angles at vertex: $3 \times 108^\circ = 324^\circ$.
         - Circumscribed Sphere Radius: $R_{\text{circ}} = \frac{e\sqrt{3}(1+\sqrt{5})}{4}$.
         - Inscribed Sphere Radius: $r_{\text{in}} = \frac{e}{4}\sqrt{\frac{50+22\sqrt{5}}{5}}$.
         - Total Area: $A_T = 3e^2\sqrt{25+10\sqrt{5}}$, Volume: $V = \frac{e^3(15+7\sqrt{5})}{4}$.
      5. **Icosahedron**:
         - Faces: $20$ Equilateral Triangles ($60^\circ$), Vertices: $V = 12$, Edges: $E = 30$.
         - Sum of angles at vertex: $5 \times 60^\circ = 300^\circ$.
         - Circumscribed Sphere Radius: $R_{\text{circ}} = \frac{e\sqrt{2(5+\sqrt{5})}}{4}$.
         - Inscribed Sphere Radius: $r_{\text{in}} = \frac{e}{2}\sqrt{\frac{7+3\sqrt{5}}{6}}$.
         - Total Area: $A_T = 5e^2\sqrt{3}$, Volume: $V = \frac{5e^3(3+\sqrt{5})}{12}$.
    - **Euler's Polyhedral Formula**:
      $$V + F - E = 2$$
      where $V$ = number of vertices (0D), $E$ = number of edges (1D), $F$ = number of faces (2D).
- **In-Line Concept Checks**: 9 MCQs on frustum volume, Euler's formula verification, prismoidal formula, Platonic solid inscribed/circumscribed radii, and spherical wedge volumes.
- **Sample Problems**:
  - *Problem*: Find the volume and total surface area of a regular tetrahedron having an edge length of $6\text{ cm}$.
  - *Academic Derivation*: $V = \frac{6^3\sqrt{2}}{12} = \frac{216\sqrt{2}}{12} = 18\sqrt{2} \approx 25.46\text{ cm}^3$. $A_T = 6^2\sqrt{3} = 36\sqrt{3} \approx 62.35\text{ cm}^2$.
  - *⚡ Board Exam Shortcut*: $V = \frac{e^3\sqrt{2}}{12} = 18\sqrt{2}$; $A_T = e^2\sqrt{3} = 36\sqrt{3}$.
- **Calculator Technique**: Multi-variable formula memory storage on Canon F-789SGA (`STO A` for edge $e$).
- **Exclusive Mastery Challenge Set**: 25 questions testing solid volumes, frustums, spherical parts, and Platonic properties.

---

## Unit 6: Analytic Geometry & Conic Sections

### Module MATH-12: Cartesian Coordinate Geometry, Lines & Polygons
- **Source Reference**: `Notes - Analytic Geom 1.pdf`, `Notes - Analytic Geom 2.pdf`
- **Prerequisite Bridge**: Algebraic representation of geometric loci. Fundamental to computer graphics, trajectory planning, and field plotting.
- **Atomic Definitions**:
  - **Cartesian Coordinate System**: Invented by René Descartes (1596–1650, *Cartesius*). Point $P(x, y)$ where $x$ is abscissa and $y$ is ordinate.
  - **Distance Formula**: $d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.
  - **Slope of a Line ($m$)**: $m = \tan\theta = \frac{y_2 - y_1}{x_2 - x_1}$.
    - Parallel lines: $m_1 = m_2$.
    - Perpendicular lines: $m_1 \cdot m_2 = -1 \implies m_2 = -\frac{1}{m_1}$.
  - **Angle Between Two Lines**: $\tan\theta = \frac{m_2 - m_1}{1 + m_1 m_2}$.
  - **Distance from Point $(x_1, y_1)$ to Line $Ax + By + C = 0$**:
    $$d = \frac{|Ax_1 + By_1 + C|}{\sqrt{A^2 + B^2}}$$
  - **Distance Between Parallel Lines $Ax + By + C_1 = 0$ and $Ax + By + C_2 = 0$**:
    $$d = \frac{|C_1 - C_2|}{\sqrt{A^2 + B^2}}$$
  - **Division of Line Segment in Ratio $r_1 : r_2$**:
    $$x = \frac{x_1 r_2 + x_2 r_1}{r_1 + r_2}, \quad y = \frac{y_1 r_2 + y_2 r_1}{r_1 + r_2}$$
    Midpoint ($r_1 = r_2 = 1$): $x_m = \frac{x_1 + x_2}{2}, y_m = \frac{y_1 + y_2}{2}$.
  - **Area of Polygon by Coordinates (Shoelace / Matrix Method)**:
    $$A = \frac{1}{2} |(x_1 y_2 + x_2 y_3 + \dots + x_n y_1) - (y_1 x_2 + y_2 x_3 + \dots + y_n x_1)|$$
  - **Standard Equations of Straight Lines**:
    - General Form: $Ax + By + C = 0$.
    - Point-Slope Form: $y - y_1 = m(x - x_1)$.
    - Slope-Intercept Form: $y = mx + b$.
    - Two-Point Form: $y - y_1 = \frac{y_2 - y_1}{x_2 - x_1}(x - x_1)$.
    - Intercept Form: $\frac{x}{a} + \frac{y}{b} = 1$.
- **In-Line Concept Checks**: 8 MCQs on parallel/perpendicular slopes, point-to-line distances, and coordinate area computation.
- **Sample Problems**:
  - *Problem*: Find the area of the triangle with vertices at $(1, 2), (3, 8),$ and $(5, 4)$.
  - *⚡ Board Exam Shortcut*: Shoelace matrix evaluation $= \frac{1}{2}|(8 + 12 + 10) - (6 + 40 + 4)| = \frac{1}{2}|30 - 50| = 10\text{ sq units}$.
- **Calculator Technique**: Shoelace matrix computation via `MODE 6` (Matrix Determinant) or `STAT` table entry.
- **Exclusive Mastery Challenge Set**: 25 questions testing line forms, distances, intersections, and coordinate polygon areas.

---

### Module MATH-13: Conic Sections: Circle, Parabola, Ellipse & Hyperbola
- **Source Reference**: `Notes - Analytic Geom 2.pdf`, `Notes - Analytic Geom 3.pdf`, `Notes - Analytic Geom 4.pdf`
- **Prerequisite Bridge**: Locus of second-degree planar equations. Directly underpins satellite orbits, parabolic reflectors (EST), and electron paths in magnetic fields (Elecs).
- **Atomic Definitions**:
  - **Conic Sections (Apollonius of Perga c. 255–170 B.C.)**: Locus of a point whose ratio of distance from a fixed point (focus) to a fixed straight line (directrix) is constant **eccentricity ($e$)**:
    $$e = \frac{\text{Distance to Focus}}{\text{Distance to Directrix}} = \frac{c}{a} = \frac{a}{D}$$
    - Circle: $e = 0$.
    - Parabola: $e = 1.0$.
    - Ellipse: $e < 1.0$.
    - Hyperbola: $e > 1.0$.
  - **General Second-Degree Equation**: $Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0$.
    - If inclined / rotated ($B \neq 0$), classification by discriminant $B^2 - 4AC$:
      - $B^2 - 4AC < 0 \implies$ Ellipse (or Circle if $A=C, B=0$).
      - $B^2 - 4AC = 0 \implies$ Parabola.
      - $B^2 - 4AC > 0 \implies$ Hyperbola.
    - If axes parallel to coordinate axes ($B = 0$):
      - Circle: $A = C$ (same sign).
      - Parabola: $A = 0$ or $C = 0$ (exactly one squared term).
      - Ellipse: $A \neq C$ (same sign).
      - Hyperbola: $A$ and $C$ have opposite signs ($AC < 0$).
  - **Reflective & Geometric Properties of Conics**:
    - **Circle**: Reflects rays issued from focus back to the center of the circle.
    - **Parabola**: Reflects rays issued from focus as a parallel outgoing beam (collimated beam, used in parabolic dishes).
    - **Ellipse**: Reflects rays issued from one focus directly into the other focus (whispering galleries, lithotripsy).
    - **Hyperbola**: Reflects rays directed towards one focus as if originating from the other focus (Cassegrain reflector).
  - **Circle**:
    - Standard Form: $(x-h)^2 + (y-k)^2 = r^2$.
    - General Form: $Ax^2 + Ay^2 + Dx + Ey + F = 0 \implies h = -\frac{D}{2A}, k = -\frac{E}{2A}, r = \sqrt{\frac{D^2+E^2-4AF}{4A^2}}$.
  - **Parabola (Vertex $(h,k)$, Focal Length $a$, Latus Rectum $LR = 4a$)**:
    - Axis Horizontal: $(y-k)^2 = \pm 4a(x-h)$ (Opens right $(+)$ / left $(-)$).
      - General Form $Cy^2 + Dx + Ey + F = 0 \implies k = -\frac{E}{2C}, h = \frac{E^2-4CF}{4CD}, a = -\frac{D}{4C}$.
    - Axis Vertical: $(x-h)^2 = \pm 4a(y-k)$ (Opens up $(+)$ / down $(-)$).
      - General Form $Ax^2 + Dx + Ey + F = 0 \implies h = -\frac{D}{2A}, k = \frac{D^2-4AF}{4AE}, a = -\frac{E}{4A}$.
  - **Ellipse (Center $(h,k)$, Major Axis $2a$, Minor Axis $2b$, $c = \sqrt{a^2 - b^2}$)**:
    - Horizontal Major Axis: $\frac{(x-h)^2}{a^2} + \frac{(y-k)^2}{b^2} = 1$.
    - Vertical Major Axis: $\frac{(x-h)^2}{b^2} + \frac{(y-k)^2}{a^2} = 1$.
    - Center from General Form $Ax^2 + Cy^2 + Dx + Ey + F = 0$: $h = -\frac{D}{2A}, k = -\frac{E}{2C}$.
    - Eccentricity: $e = \frac{c}{a} < 1.0$. Latus Rectum: $LR = \frac{2b^2}{a}$.
  - **Hyperbola (Center $(h,k)$, Transverse Axis $2a$, Conjugate Axis $2b$, $c = \sqrt{a^2 + b^2}$)**:
    - Horizontal Transverse Axis: $\frac{(x-h)^2}{a^2} - \frac{(y-k)^2}{b^2} = 1$.
    - Vertical Transverse Axis: $\frac{(y-k)^2}{a^2} - \frac{(x-h)^2}{b^2} = 1$.
    - Eccentricity: $e = \frac{c}{a} > 1.0$. Latus Rectum: $LR = \frac{2b^2}{a}$.
    - Asymptotes: $y - k = \pm \frac{b}{a}(x - h)$ (horizontal transverse).
  - **Polar Coordinates & Transformation of Axes**:
    - Polar Coordinates $(r, \theta)$: Radius vector $r$, Pole (origin), Polar angle $\theta$ (also termed *vectorial angle, argument, amplitude, or azimuth*).
    - Polar $\leftrightarrow$ Rectangular: $x = r\cos\theta, y = r\sin\theta, r = \sqrt{x^2+y^2}, \theta = \arctan(y/x)$.
    - **Translation of Axes**: $x' = x - h, \quad y' = y - k$.
    - **Rotation of Axes (Counterclockwise angle $\theta$)**:
      $$x' = x\cos\theta + y\sin\theta, \quad y' = -x\sin\theta + y\cos\theta$$
      $$x = x'\cos\theta - y'\sin\theta, \quad y = x'\sin\theta + y'\cos\theta$$
- **In-Line Concept Checks**: 10 MCQs on eccentricity values, conic discriminant identification ($B^2 - 4AC$), latus rectum calculations, and polar-to-rectangular conversions.
- **Sample Problems**:
  - *Problem*: Find the vertex, focus, and directrix of the parabola $y^2 - 8x - 4y + 28 = 0$.
  - *Academic Derivation*: Complete the square: $(y-2)^2 = 8(x-3)$. Vertex $(3, 2)$, $4a = 8 \implies a = 2$. Focus $(3+2, 2) = (5, 2)$, Directrix $x = 3-2 = 1$.
- **Calculator Technique**: Polar-rectangular conversions via `Pol(` and `Rec(` keys.
- **Exclusive Mastery Challenge Set**: 25 questions testing all four conics, focal parameters, polar curves, and axis rotations.

---

## Unit 7: Differential Calculus & Optimization Shortcuts

### Module MATH-14: Limits, Continuity & Derivative Rules
- **Source Reference**: `Notes - Differential Calculus 1.pdf`, `Notes - Differential Calculus 2.pdf`
- **Prerequisite Bridge**: Rate of change mathematics. Core bridge to transient circuit analysis ($di/dt, dv/dt$) and instantaneous signal variations.
- **Atomic Definitions**:
  - **Limit**: Value that a function $f(x)$ approaches as the input approaches $a$: $\lim_{x\to a} f(x) = L$.
  - **Continuity**: $f(x)$ is continuous at $x=a$ iff: (1) $f(a)$ is defined, (2) $\lim_{x\to a} f(x)$ exists, (3) $\lim_{x\to a} f(x) = f(a)$.
  - **Discontinuities**: Jump (left/right limits finite but unequal), Point/Removable (limit exists but $\neq f(a)$), Essential/Asymptotic (infinite limit).
  - **Special Limits**:
    $$\lim_{x\to 0}\frac{\sin x}{x} = 1, \quad \lim_{x\to 0}\frac{1-\cos x}{x} = 0, \quad \lim_{n\to\infty}\left(1+\frac{1}{n}\right)^n = e, \quad \lim_{n\to 0}(1+n)^{1/n} = e$$
  - **Derivative**: Instantaneous rate of change / slope of tangent line:
    $$f'(x) = \lim_{\Delta x \to 0}\frac{f(x+\Delta x) - f(x)}{\Delta x}$$
  - **Fundamental Differentiation Rules**:
    - Power Rule: $\frac{d}{dx}[u^n] = n u^{n-1} \frac{du}{dx}$.
    - Product Rule: $\frac{d}{dx}[uv] = u\frac{dv}{dx} + v\frac{du}{dx}$.
    - Quotient Rule: $\frac{d}{dx}\left[\frac{u}{v}\right] = \frac{v\frac{du}{dx} - u\frac{dv}{dx}}{v^2}$.
    - Trigonometric: $\frac{d}{dx}[\sin u] = \cos u \frac{du}{dx}$, $\frac{d}{dx}[\cos u] = -\sin u \frac{du}{dx}$, $\frac{d}{dx}[\tan u] = \sec^2 u \frac{du}{dx}$.
    - Inverse Trig: $\frac{d}{dx}[\arcsin u] = \frac{1}{\sqrt{1-u^2}}\frac{du}{dx}$, $\frac{d}{dx}[\arctan u] = \frac{1}{1+u^2}\frac{du}{dx}$.
    - Exponential & Log: $\frac{d}{dx}[e^u] = e^u \frac{du}{dx}$, $\frac{d}{dx}[a^u] = a^u \ln a \frac{du}{dx}$, $\frac{d}{dx}[\ln u] = \frac{1}{u}\frac{du}{dx}$.
    - Hyperbolic: $\frac{d}{dx}[\sinh u] = \cosh u \frac{du}{dx}$, $\frac{d}{dx}[\cosh u] = \sinh u \frac{du}{dx}$, $\frac{d}{dx}[\tanh u] = \text{sech}^2 u \frac{du}{dx}$.
- **In-Line Concept Checks**: 8 MCQs on evaluating indeterminate limits ($0/0, \infty/\infty$) via L'Hôpital's rule, identifying discontinuities, and applying product/chain rules.
- **Sample Problems**:
  - *Problem*: Evaluate $\lim_{x\to 0}\frac{\sin 5x}{x}$.
  - *⚡ Board Exam Shortcut*: $\lim_{x\to 0}\frac{5\sin 5x}{5x} = 5(1) = 5$.
- **Calculator Technique**: Numerical derivative button `[d/dx]` evaluated at test points $x=a$ to verify analytical derivatives against choices.
- **Exclusive Mastery Challenge Set**: 25 questions testing limit evaluation, continuity conditions, and multi-step derivatives.

---

### Module MATH-15: Maxima/Minima, Time Rates & PRC Board Shortcuts
- **Source Reference**: `Notes - Differential Calculus 3.pdf`, `Notes - Differential Calculus 4.pdf`
- **Prerequisite Bridge**: Extends derivatives to physical optimization and kinematic rate problems across engineering disciplines.
- **Atomic Definitions**:
  - **Critical Points**: Points where $f'(x) = 0$ or $f'(x)$ is undefined.
  - **Second Derivative Test**:
    - $f''(c) > 0 \implies$ Local Minimum (concave up).
    - $f''(c) < 0 \implies$ Local Maximum (concave down).
    - $f''(c) = 0 \implies$ Possible Point of Inflection.
  - **Time Rates**: Problems where rates of change are functions of time $t$. Differentiate relation with respect to $t$, then substitute given instant values.
- **⚡ PRC Board Exam Golden Optimization Shortcuts**:
  1. **Largest Rectangle in a Circle (Radius $R$)**: It is a SQUARE of side $a = R\sqrt{2}$, Area $= 2R^2$.
  2. **Largest Rectangle in a Semicircle**: Dimensions are $x = R\sqrt{2}, y = \frac{R}{\sqrt{2}} \implies x = 2y$ (width is twice the height).
  3. **Largest Rectangle Inscribed in a Triangle (Base $b$, Height $h$)**:
     $$x = \frac{b}{2}, \quad y = \frac{h}{2}, \quad \text{Area} = \frac{1}{2} A_{\text{triangle}}$$
  4. **Largest Rectangle Inscribed in an Ellipse ($\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$)**:
     $$x = \frac{a}{\sqrt{2}}, \quad y = \frac{b}{\sqrt{2}}, \quad \text{Area} = 2ab, \quad \frac{A_{\text{ellipse}}}{A_{\text{rectangle}}} = \frac{\pi}{2}$$
  5. **Smallest Perimeter of a Sector with Given Area $A$**:
     $$r = \sqrt{A}, \quad \theta = 2\text{ rad} \approx 114.59^\circ, \quad P_{\min} = 4\sqrt{A}$$
  6. **Stiffest Beam from a Circular Log of Radius $r$ ($S \propto x y^3$)**:
     $$y = x\sqrt{3}, \quad x = r, \quad y = r\sqrt{3}$$
  7. **Strongest Beam from an Elliptical Section ($S \propto x y^2$)**:
     $$x = 2b\sqrt{\frac{1}{3}}, \quad y = 2a\sqrt{\frac{2}{3}}$$
  8. **Most Efficient Trapezoidal Channel (Maximum flow / minimum wetted perimeter)**:
     It is half of a regular hexagon with side slope $\theta = 120^\circ$ (or $60^\circ$ from horizontal), $\text{Top Width} = 2 \times \text{Base} = \Sigma \text{sides}$.
  9. **Maximum Length of Rigid Pipe around Hallway Corner of Widths $a$ and $b$**:
     $$L = (a^{2/3} + b^{2/3})^{3/2}$$
  10. **Best View of Picture / Statue (Bottom at height $y_1$, Top at height $y_2$)**:
      $$x = \sqrt{y_1 y_2}$$
  11. **Single Ground Stake for Minimum Total Guy Wire Length (Poles $h_1, h_2$ at distance $d$)**:
      $$x = \frac{d h_1}{h_1 + h_2}$$
  12. **Cylinder of Maximum Volume Inscribed in a Sphere of Radius $R$**:
      $$h = \frac{2R}{\sqrt{3}}, \quad V_c = \frac{4\pi R^3}{3\sqrt{3}} = \frac{V_{\text{sphere}}}{\sqrt{3}}, \quad \frac{W_c}{W_s} = \frac{1}{\sqrt{3}}$$
  13. **Cone of Maximum Volume Inscribed in a Sphere of Radius $R$**:
      $$h = \frac{4R}{3}, \quad V_{\text{cone}} = \frac{8}{27} V_{\text{sphere}}$$
  14. **Largest Cylinder Inscribed in a Cone of Height $h$**:
      $$y = \frac{h}{3}, \quad r_{\text{cyl}} = \frac{2}{3} r_{\text{cone}}$$
- **In-Line Concept Checks**: 10 MCQs testing direct application of optimization shortcuts and time rates.
- **Sample Problems**:
  - *Problem*: A pipe must be carried horizontally around a right-angled corner where two hallways of widths $8\text{ ft}$ and $27\text{ ft}$ meet. What is the maximum pipe length?
  - *⚡ Board Exam Shortcut*: $L = (8^{2/3} + 27^{2/3})^{3/2} = (4 + 9)^{3/2} = 13^{3/2} = 13\sqrt{13} \approx 46.87\text{ ft}$.
- **Calculator Technique**: Solving time rates derivative equations via `SOLVE` on numeric expressions.
- **Exclusive Mastery Challenge Set**: 25 questions on maxima/minima word problems, time rates, and shortcut rules.

---

## Unit 8: Integral Calculus & Geometric Applications

### Module MATH-16: Indefinite/Definite Integrals, Wallis Formula & Methods
- **Source Reference**: `Notes - Integral Calculus 1.pdf`, `Notes - Integral Calculus 2.pdf`
- **Prerequisite Bridge**: Inverse operation of differentiation. Fundamental to energy storage in capacitors/inductors (Elecs) and signal Fourier spectra (EST).
- **Atomic Definitions**:
  - **Integration**: Process of computing antiderivatives and accumulation of continuous quantities. Introduced by Leibniz (*calculus summatorius*, symbol $\int$ from elongated *S* for *summa*).
  - **Fundamental Theorem of Calculus**: If $f(x)$ is continuous on $[a, b]$ and $F'(x) = f(x)$, then:
    $$\int_a^b f(x)dx = F(b) - F(a)$$
  - **Standard Integration Formulas**:
    - Algebraic: $\int u^n du = \frac{u^{n+1}}{n+1} + C$ ($n \neq -1$), $\int \frac{du}{u} = \ln|u| + C$.
    - Exponential: $\int e^u du = e^u + C$, $\int a^u du = \frac{a^u}{\ln a} + C$.
    - Trigonometric: $\int \sin u du = -\cos u + C$, $\int \cos u du = \sin u + C$, $\int \sec^2 u du = \tan u + C$, $\int \sec u du = \ln|\sec u + \tan u| + C$.
    - Hyperbolic: $\int \sinh u du = \cosh u + C$, $\int \cosh u du = \sinh u + C$.
  - **Integration by Parts**:
    $$\int u dv = uv - \int v du$$
  - **Trigonometric Substitutions**:
    - $\sqrt{a^2 - u^2} \implies u = a\sin\theta$.
    - $\sqrt{a^2 + u^2} \implies u = a\tan\theta$.
    - $\sqrt{u^2 - a^2} \implies u = a\sec\theta$.
  - **Wallis Formula (John Wallis)**:
    $$\int_0^{\pi/2} \sin^m\theta \cos^n\theta \, d\theta = \frac{[(m-1)(m-3)\dots (1\text{ or }2)][(n-1)(n-3)\dots (1\text{ or }2)]}{(m+n)(m+n-2)(m+n-4)\dots (1\text{ or }2)} \cdot \alpha$$
    where $\alpha = \frac{\pi}{2}$ if both $m$ and $n$ are even, and $\alpha = 1$ otherwise.
- **In-Line Concept Checks**: 8 MCQs on selecting integration techniques, evaluating Wallis integrals, and parts setup.
- **Sample Problems**:
  - *Problem*: Evaluate $\int_0^{\pi/2} \sin^6\theta \cos^4\theta \, d\theta$.
  - *⚡ Board Exam Shortcut*: Wallis formula with $m=6, n=4$ (both even $\implies \alpha = \pi/2$):
    $$\frac{(5 \times 3 \times 1)(3 \times 1)}{10 \times 8 \times 6 \times 4 \times 2} \times \frac{\pi}{2} = \frac{15 \times 3}{3840} \times \frac{\pi}{2} = \frac{45\pi}{7680} = \frac{3\pi}{512}$$
- **Calculator Technique**: Numerical integration key `[∫dx]` with lower and upper limits.
- **Exclusive Mastery Challenge Set**: 25 questions testing integration rules, trigonometric substitutions, and Wallis evaluations.

---

### Module MATH-17: Applications of Definite Integrals: Area, Centroid, Volume & Work
- **Source Reference**: `Notes - Integral Calculus 2.pdf`, `Notes - Integral Calculus 3.pdf`
- **Prerequisite Bridge**: Physical and spatial applications of integrals. Foundations for center of mass, fluid work, and rotational dynamics in GEAS.
- **Atomic Definitions**:
  - **Plane Area**:
    - Rectangular Coordinates: Vertical strip $A = \int_{x_1}^{x_2} (y_2 - y_1)dx$, Horizontal strip $A = \int_{y_1}^{y_2} (x_2 - x_1)dy$.
    - Polar Coordinates: $A = \frac{1}{2}\int_{\theta_1}^{\theta_2} r^2 d\theta$.
  - **Centroid of Area**:
    $$\bar{x} = \frac{\int x dA}{A}, \quad \bar{y} = \frac{\int \frac{y}{2} dA}{A} = \frac{\int y dA}{A}$$
  - **Length of Arc**:
    $$S = \int_{x_1}^{x_2} \sqrt{1 + \left(\frac{dy}{dx}\right)^2} dx = \int_{y_1}^{y_2} \sqrt{1 + \left(\frac{dx}{dy}\right)^2} dy$$
  - **Theorems of Pappus (Pappus of Alexandria)**:
    - **First Theorem (Surface Area)**: Surface area generated by rotating a plane curve about a non-intersecting coplanar axis equals curve length times distance traversed by its centroid:
      $$A_s = S \cdot (2\pi \bar{d})$$
    - **Second Theorem (Volume)**: Volume generated by revolving a plane area about a non-intersecting coplanar axis equals generating area times distance traversed by its centroid:
      $$V = A \cdot (2\pi \bar{d})$$
  - **Solids of Revolution**:
    - Disk Method: $V = \pi \int y^2 dx$.
    - Washer Method (Rotation about x-axis): $V = \pi \int (y_2^2 - y_1^2) dx$.
    - Cylindrical Shell Method (Rotation about y-axis): $V = 2\pi \int x y \, dx$.
  - **Work by Integration**:
    $$W = \int_{x_1}^{x_2} F(x)dx$$
    - Hooke's Law for Springs: $F = kx \implies W = \int_0^x kx dx = \frac{1}{2}kx^2$.
    - Liquid Pumping Work: $W = \gamma \int y A(y) dy$ ($\gamma = \rho g$).
  - **Moment of Inertia by Integration**:
    $$I_x = \int y^2 dA, \quad I_y = \int x^2 dA$$
- **In-Line Concept Checks**: 8 MCQs on selecting Pappus theorem vs disk/shell method, spring work calculations, and polar area integrations.
- **Sample Problems**:
  - *Problem*: Find the volume of a torus generated by revolving a circle of radius $r=3$ whose center is $R=7$ from the axis.
  - *⚡ Board Exam Shortcut*: Apply Pappus 2nd Theorem: $V = (\pi r^2)(2\pi R) = 2\pi^2 (7)(3^2) = 126\pi^2 \approx 1243.55\text{ cubic units}$.
- **Calculator Technique**: Definite integration button `[∫dx]` for area between curves.
- **Exclusive Mastery Challenge Set**: 25 questions testing areas, centroids, volumes of revolution, and work integrals.

---

## Unit 9: Differential Equations & Applications

### Module MATH-18: First-Order Differential Equations & Exact Types
- **Source Reference**: `Notes - DE 1.pdf`, `Notes - DE 2.pdf`
- **Prerequisite Bridge**: Mathematical representation of dynamic systems. Direct link to transient RC/RL circuit differential equations in Electronics.
- **Atomic Definitions**:
  - **Differential Equation (DE)**: Equation containing derivatives of one or more dependent variables with respect to one or more independent variables.
  - **Order vs Degree**:
    - **Order**: Order of the highest derivative in the equation.
    - **Degree**: Power to which the highest ordered derivative is raised (after rationalizing).
  - **Ordinary (ODE) vs Partial (PDE)**: ODE has only 1 independent variable; PDE has 2 or more independent variables.
  - **General vs Particular Solution**: General solution contains arbitrary constants ($C$); particular solution satisfies initial/boundary conditions.
  - **First-Order Solution Classifications**:
    1. **Variable Separable**: $P(x)dx + Q(y)dy = 0 \implies \int P(x)dx + \int Q(y)dy = C$.
    2. **Homogeneous Equation**: $M(x,y)dx + N(x,y)dy = 0$ where $M$ and $N$ have identical degree in $x$ and $y$. Substitute $y = vx \implies dy = v dx + x dv$.
    3. **Exact Differential Equation**: $M(x,y)dx + N(x,y)dy = 0$ is exact iff:
       $$\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}$$
       Solution: $F(x,y) = \int M(x,y)\partial x + k(y) = C$.
    4. **First-Order Linear DE**:
       $$\frac{dy}{dx} + P(x)y = Q(x)$$
       Integrating Factor (Euler's Multiplier): $\text{I.F.} = e^{\int P(x)dx}$.
       General Solution: $y \cdot (\text{I.F.}) = \int Q(x) \cdot (\text{I.F.}) dx + C$.
    5. **Bernoulli's Equation (Jakob & Johann Bernoulli)**:
       $$\frac{dy}{dx} + P(x)y = Q(x)y^n \quad (n \neq 0, 1)$$
       Substitute $u = y^{1-n} \implies \frac{du}{dx} + (1-n)P(x)u = (1-n)Q(x)$ (Linear in $u$).
- **In-Line Concept Checks**: 8 MCQs on determining order/degree, testing exactness $\partial M/\partial y = \partial N/\partial x$, and finding integrating factors.
- **Sample Problems**:
  - *Problem*: Solve $\frac{dy}{dx} + \frac{2}{x}y = 4x$.
  - *Academic Derivation*: $P(x) = \frac{2}{x} \implies \text{I.F.} = e^{\int \frac{2}{x}dx} = e^{2\ln x} = x^2$.
    $y x^2 = \int 4x(x^2)dx = \int 4x^3 dx = x^4 + C \implies y = x^2 + \frac{C}{x^2}$.
- **Exclusive Mastery Challenge Set**: 25 questions testing DE classifications, integrating factors, exact equations, and Bernoulli reductions.

---

### Module MATH-19: Physical Applications of First-Order DE
- **Source Reference**: `Notes - DE 2.pdf`, `Notes - DE 3.pdf`
- **Prerequisite Bridge**: Models physical decay, heat transfer, continuous growth, and orthogonal curves.
- **Atomic Definitions**:
  - **Exponential Growth & Decay**:
    $$\frac{dQ}{dt} = kQ \implies Q(t) = Q_0 e^{kt}$$
    - Population Dynamics ($k > 0$): Doubling time $t_d = \frac{\ln 2}{k}$.
    - Radioactive Decay ($k < 0$): Half-life $t_{1/2} = \frac{\ln 2}{|k|}$.
  - **Newton's Law of Cooling / Heating**: Rate of change of temperature is proportional to difference with surroundings:
    $$\frac{dT}{dt} = -k(T - T_s) \implies T(t) = T_s + (T_0 - T_s)e^{-kt}$$
  - **Continuous Compound Interest**: $\frac{dP}{dt} = rP \implies P(t) = P_0 e^{rt}$.
  - **Mixture / Flow Problems**:
    $$\frac{dQ}{dt} = \text{Rate In} - \text{Rate Out} = (C_{\text{in}} \cdot R_{\text{in}}) - \left(\frac{Q(t)}{V(t)} \cdot R_{\text{out}}\right)$$
  - **Kinematics & Dynamics**: $v = \frac{ds}{dt}$, $a = \frac{dv}{dt} = v\frac{dv}{ds}$, $F = m\frac{dv}{dt}$.
  - **Orthogonal Trajectories**: Family of curves intersecting a given family $f(x, y, C) = 0$ at right angles ($90^\circ$):
    $$\left(\frac{dy}{dx}\right)_{\text{orthogonal}} = -\frac{1}{\left(\frac{dy}{dx}\right)_{\text{given}}}$$
- **In-Line Concept Checks**: 8 MCQs on half-life calculations, thermometer cooling times, brine tank concentrations, and orthogonal trajectory differential equations.
- **Sample Problems**:
  - *Problem*: A metal bar at $100^\circ\text{C}$ is placed in a room at $20^\circ\text{C}$. After 10 minutes its temperature is $60^\circ\text{C}$. When will it reach $30^\circ\text{C}$?
  - *⚡ Board Exam Shortcut*: Proportional decay ratios: $\frac{60-20}{100-20} = \frac{40}{80} = 0.5 \implies$ Half-temperature time is 10 min. For $T=30^\circ\text{C}$, $\frac{30-20}{100-20} = \frac{10}{80} = \frac{1}{8} = (0.5)^3 \implies t = 3 \times 10 = 30\text{ minutes}$.
- **Exclusive Mastery Challenge Set**: 25 questions testing growth/decay, cooling curves, mixture tanks, and orthogonal trajectories.

---

## Unit 10: Advanced Engineering Mathematics

### Module MATH-20: Complex Numbers & De Moivre's Theorem
- **Source Reference**: `Notes - Advanced Math 1.pdf`
- **Prerequisite Bridge**: Phasor domain representation of sinusoidal signals. Essential for AC impedance, s-plane poles, and electromagnetic fields.
- **Atomic Definitions**:
  - **Complex Number Forms**:
    - Rectangular Form: $z = a + jb$ ($a = \text{Re}(z), b = \text{Im}(z), j = \sqrt{-1}$).
    - Trigonometric Form: $z = r(\cos\theta + j\sin\theta) = r\text{ cis }\theta$.
    - Polar Form: $z = r\angle\theta$ ($r = \sqrt{a^2+b^2}, \theta = \arctan(b/a)$).
    - Exponential Form (Euler's Identity): $z = r e^{j\theta}$ ($\theta$ in radians).
  - **Conjugate & Reciprocal**:
    - Conjugate: $z^* = a - jb = r\angle(-\theta)$.
    - Multiplicative Inverse: $\frac{1}{z} = \frac{z^*}{|z|^2} = \frac{a - jb}{a^2 + b^2} = \frac{1}{r}\angle(-\theta)$.
  - **Operations in Polar Form**:
    - Multiplication: $(r_1\angle\theta_1)(r_2\angle\theta_2) = (r_1 r_2)\angle(\theta_1 + \theta_2)$.
    - Division: $\frac{r_1\angle\theta_1}{r_2\angle\theta_2} = \left(\frac{r_1}{r_2}\right)\angle(\theta_1 - \theta_2)$.
    - De Moivre's Theorem (Powers): $(r\angle\theta)^n = r^n\angle(n\theta) = r^n e^{j n \theta}$.
    - $n$-th Roots: $(r\angle\theta)^{1/n} = r^{1/n}\angle\left(\frac{\theta + 360^\circ k}{n}\right)$, where $k = 0, 1, \dots, n-1$.
  - **Logarithm of Complex Number**: $\ln z = \ln(r e^{j\theta}) = \ln r + j\theta$.
  - **Complex Trigonometric & Hyperbolic Relations**:
    $$\sin z = \frac{e^{jz} - e^{-jz}}{2j}, \quad \cos z = \frac{e^{jz} + e^{-jz}}{2}, \quad \sinh z = \frac{e^z - e^{-z}}{2}, \quad \cosh z = \frac{e^z + e^{-z}}{2}$$
- **In-Line Concept Checks**: 8 MCQs on polar-rectangular conversions, De Moivre powers, complex roots, and complex logarithms.
- **Sample Problems**:
  - *Problem*: Evaluate $(1 + j\sqrt{3})^6$.
  - *⚡ Board Exam Shortcut*: Polar form: $(2\angle 60^\circ)^6 = 2^6 \angle(6 \times 60^\circ) = 64\angle 360^\circ = 64 + j0 = 64$.
- **Calculator Technique**: `MODE 2` (CMPLX) on Casio/Canon for direct arithmetic `(1+i√3)^6`.
- **Exclusive Mastery Challenge Set**: 25 questions testing complex forms, powers, roots, and complex functions.

---

### Module MATH-21: Matrices, Determinants & Linear Systems
- **Source Reference**: `Notes - Advanced Math 2.pdf`, `Notes - Advanced Math 3.pdf`, `Notes - Advanced Math 4.pdf`, `Notes - Advanced Math 5.pdf`
- **Prerequisite Bridge**: Multi-variable linear algebra. Underpins mesh/nodal circuit matrices (Elecs), state-space control models, and network transformations.
- **Atomic Definitions**:
  - **Matrix**: Rectangular array of numbers of size $m \times n$ (introduced by James Joseph Sylvester 1850).
  - **Matrix Classifications**:
    - Square Matrix ($m=n$).
    - Diagonal Matrix ($a_{ij} = 0$ for $i \neq j$).
    - Scalar Matrix (diagonal entries equal).
    - Identity Matrix ($I$).
    - Symmetric Matrix ($A^T = A$) vs Skew-Symmetric ($A^T = -A$).
    - Upper / Lower Triangular Matrix.
    - Trace of Matrix: Sum of main diagonal entries $\text{Tr}(A) = \sum a_{ii}$.
  - **Matrix Operations**:
    - Addition/Subtraction: Element-wise on matrices of identical size.
    - Scalar Multiplication: Multiplies every entry.
    - Matrix Multiplication $A_{m \times p} \times B_{p \times n} = C_{m \times n}$. Note: $AB \neq BA$ (non-commutative).
    - Transpose $A^T$: Rows become columns.
  - **Determinant ($|A|$ / $\det A$)**: Real number associated with square matrix:
    - $2 \times 2$: $\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc$.
    - $3 \times 3$: Basket / Diagonal method or expansion by minors.
    - $n \times n$: Pivotal element method / Gaussian reduction.
    - Properties: Interchanging two rows/columns changes sign of determinant; if two rows/cols are proportional, $\det A = 0$; $\det(AB) = \det(A)\det(B)$; $\det(A^T) = \det(A)$.
  - **Matrix Inverse**:
    $$A^{-1} = \frac{1}{\det A} \text{adj}(A) = \frac{1}{\det A} (\text{Cofactor Matrix})^T$$
- **In-Line Concept Checks**: 8 MCQs on matrix multiplication compatibility, determinant properties, trace computation, and cofactor signs.
- **Sample Problems**:
  - *Problem*: Find the determinant of $\begin{pmatrix} 2 & -4 & 3 \\ 1 & 2 & -1 \\ 3 & 0 & 2 \end{pmatrix}$.
  - *⚡ Board Exam Shortcut*: Expansion along row 3: $3((-4)(-1) - (3)(2)) + 2((2)(2) - (-4)(1)) = 3(4 - 6) + 2(4 + 4) = 3(-2) + 2(8) = -6 + 16 = 10$.
- **Calculator Technique**: `MODE 6` (Matrix Mode) -> `det(MatA)` and `MatA^-1`.
- **Exclusive Mastery Challenge Set**: 25 questions testing matrix algebra, determinant properties, cofactors, and inverse matrices.

---

### Module MATH-22: Laplace Transforms & Operational Theorems
- **Source Reference**: `Notes - Advanced Math 5.pdf`, `Notes - Advanced Math 6.pdf`
- **Prerequisite Bridge**: Continuous-time s-domain transformation (Pierre-Simon de Laplace 1749–1827). Direct bridge to control systems, filter transfer functions, and circuit s-domain models.
- **Atomic Definitions**:
  - **Laplace Transform**:
    $$\mathcal{L}\{f(t)\} = F(s) = \int_0^\infty f(t) e^{-st} dt$$
  - **Elementary Transform Pairs**:
    - $\mathcal{L}\{1\} = \frac{1}{s}$
    - $\mathcal{L}\{t\} = \frac{1}{s^2}$, $\mathcal{L}\{t^n\} = \frac{n!}{s^{n+1}}$
    - $\mathcal{L}\{e^{at}\} = \frac{1}{s - a}$
    - $\mathcal{L}\{\sin kt\} = \frac{k}{s^2 + k^2}$, $\mathcal{L}\{\cos kt\} = \frac{s}{s^2 + k^2}$
    - $\mathcal{L}\{\sinh kt\} = \frac{k}{s^2 - k^2}$, $\mathcal{L}\{\cosh kt\} = \frac{s}{s^2 - k^2}$
    - $\mathcal{L}\{t \sin kt\} = \frac{2ks}{(s^2+k^2)^2}$, $\mathcal{L}\{t \cos kt\} = \frac{s^2 - k^2}{(s^2+k^2)^2}$
    - $\mathcal{L}\{\sin(\omega t + \theta)\} = \frac{s\sin\theta + \omega\cos\theta}{s^2+\omega^2}$
  - **Operational Properties**:
    - Linearity: $\mathcal{L}\{a f(t) + b g(t)\} = a F(s) + b G(s)$.
    - First Shifting (s-domain shift): $\mathcal{L}\{e^{at}f(t)\} = F(s - a)$.
    - Time-Domain Shift: $\mathcal{L}\{f(t-a)u(t-a)\} = e^{-as}F(s)$.
    - Differentiation in s-domain: $\mathcal{L}\{-t f(t)\} = \frac{d}{ds}F(s) \implies \mathcal{L}\{t^n f(t)\} = (-1)^n \frac{d^n}{ds^n}F(s)$.
    - Differentiation in time-domain: $\mathcal{L}\{f'(t)\} = s F(s) - f(0)$, $\mathcal{L}\{f''(t)\} = s^2 F(s) - s f(0) - f'(0)$.
    - Integration in time-domain: $\mathcal{L}\left\{\int_0^t f(\tau)d\tau\right\} = \frac{F(s)}{s}$.
    - Convolution Theorem: $\mathcal{L}\{f(t) * g(t)\} = F(s) \cdot G(s)$.
  - **Inverse Laplace Transform**: $\mathcal{L}^{-1}\{F(s)\} = f(t)$ using partial fraction decomposition.
- **In-Line Concept Checks**: 8 MCQs on shifting theorem applications, evaluating transforms of combined functions, and initial value theorems.
- **Sample Problems**:
  - *Problem*: Find $\mathcal{L}\{e^{-2t}\cos 3t\}$.
  - *⚡ Board Exam Shortcut*: $\mathcal{L}\{\cos 3t\} = \frac{s}{s^2+9} \xrightarrow{s \to s+2} \frac{s+2}{(s+2)^2+9} = \frac{s+2}{s^2+4s+13}$.
- **Exclusive Mastery Challenge Set**: 25 questions testing Laplace transform pairs, operational theorems, and inverse transforms.

---

### Module MATH-23: Fourier Transforms, Fourier Series & Z-Transforms
- **Source Reference**: `Notes - Advanced Math 6.pdf`, `Notes - Advanced Math 7.pdf`
- **Prerequisite Bridge**: Frequency-domain signal representation and discrete-time transforms. Underpins modulation spectrum analysis (EST) and DSP filters.
- **Atomic Definitions**:
  - **Fourier Transform (Jean-Baptiste Fourier 1768–1830)**:
    $$F(\omega) = \mathcal{F}\{f(t)\} = \int_{-\infty}^\infty f(t) e^{-j\omega t} dt, \quad f(t) = \frac{1}{2\pi}\int_{-\infty}^\infty F(\omega) e^{j\omega t} d\omega$$
  - **Elementary Fourier Transform Pairs**:
    - $\mathcal{F}\{1\} = 2\pi\delta(\omega)$
    - $\mathcal{F}\{u(t)\} = \pi\delta(\omega) + \frac{1}{j\omega}$
    - $\mathcal{F}\{\delta(t)\} = 1$, $\mathcal{F}\{\delta(t-t_0)\} = e^{-j\omega t_0}$
    - $\mathcal{F}\{e^{j\omega_0 t}\} = 2\pi\delta(\omega - \omega_0)$
    - $\mathcal{F}\{\cos\omega_0 t\} = \pi[\delta(\omega+\omega_0) + \delta(\omega-\omega_0)]$
    - $\mathcal{F}\{\sin\omega_0 t\} = j\pi[\delta(\omega+\omega_0) - \delta(\omega-\omega_0)]$
    - $\mathcal{F}\{e^{-a|t|}\} = \frac{2a}{a^2+\omega^2}$ ($a > 0$)
  - **Properties of Fourier Transform**:
    - Time-Shifting: $\mathcal{F}\{f(t-t_0)\} = F(\omega)e^{-j\omega t_0}$.
    - Frequency-Shifting (Modulation): $\mathcal{F}\{f(t)e^{j\omega_0 t}\} = F(\omega - \omega_0)$.
    - Time-Scaling: $\mathcal{F}\{f(at)\} = \frac{1}{|a|}F\left(\frac{\omega}{a}\right)$.
    - Duality: $\mathcal{F}\{F(t)\} = 2\pi f(-\omega)$.
    - Convolution: $\mathcal{F}\{x(t) * h(t)\} = X(\omega) \cdot H(\omega)$.
  - **Fourier Series (Periodic Functions of Period $T = \frac{2\pi}{\omega_0}$)**:
    $$f(t) = \frac{a_0}{2} + \sum_{n=1}^\infty \left[ a_n \cos(n\omega_0 t) + b_n \sin(n\omega_0 t) \right]$$
    where:
    $$a_0 = \frac{2}{T}\int_{-T/2}^{T/2} f(t)dt, \quad a_n = \frac{2}{T}\int_{-T/2}^{T/2} f(t)\cos(n\omega_0 t)dt, \quad b_n = \frac{2}{T}\int_{-T/2}^{T/2} f(t)\sin(n\omega_0 t)dt$$
  - **Z-Transform (Discrete-Time Signals)**:
    - Bilateral: $F(z) = \mathcal{Z}\{f(n)\} = \sum_{n=-\infty}^\infty f(n) z^{-n}$.
    - Unilateral: $F(z) = \sum_{n=0}^\infty f(n) z^{-n}$.
  - **Elementary Z-Transform Pairs**:
    - $\mathcal{Z}\{1\} = \frac{z}{z-1}$
    - $\mathcal{Z}\{t\} = \frac{T z}{(z-1)^2}$
    - $\mathcal{Z}\{e^{-at}\} = \frac{z}{z - e^{-aT}}$
    - $\mathcal{Z}\{\sin\omega_0 t\} = \frac{z\sin\omega_0 T}{z^2 - 2z\cos\omega_0 T + 1}$
    - $\mathcal{Z}\{\cos\omega_0 t\} = \frac{z(z - \cos\omega_0 T)}{z^2 - 2z\cos\omega_0 T + 1}$
- **In-Line Concept Checks**: 8 MCQs on duality property, spectrum convolution, Fourier series coefficient symmetries, and Z-transform region of convergence.
- **Sample Problems**:
  - *Problem*: Find the Fourier transform of the unit impulse function $\delta(t-3)$.
  - *⚡ Board Exam Shortcut*: Sifting property $\implies e^{-j 3\omega}$.
- **Exclusive Mastery Challenge Set**: 25 questions testing Fourier transforms, Fourier series coefficients, and Z-transforms.

---

## Complete Mathematics Module Catalog

| Module Code | Topic Title | Source Note Reference | Companion Mastery Test ID |
| :--- | :--- | :--- | :--- |
| **MATH-01** | Number Systems, Properties & Roman Numerals | `Notes - Algebra 1.pdf` | `mastery-math-01-numbers` |
| **MATH-02** | Algebraic Operations, Special Products & Logarithms | `Notes - Algebra 2.pdf` | `mastery-math-02-algebra-ops` |
| **MATH-03** | Quadratic Equations, Roots Relations & Binomial Theorem | `Notes - Algebra 3.pdf` | `mastery-math-03-quadratics` |
| **MATH-04** | Progressions, Series & Figurate Numbers | `Notes - Algebra 4.pdf` | `mastery-math-04-progressions` |
| **MATH-05** | Permutations, Combinations & Counting Principles | `Notes - Probability 1.pdf` | `mastery-math-05-counting` |
| **MATH-06** | Probability Theory, Distributions & Games of Chance | `Notes - Probability 2, 3.pdf` | `mastery-math-06-probability` |
| **MATH-07** | Set Theory, Relations, Functions & Propositional Logic | `Notes - Discrete Math 1, 2, 3.pdf` | `mastery-math-07-discrete-math` |
| **MATH-08** | Trigonometric Identities, Ratios & Oblique Triangle Laws | `Notes - Trigonometry 1, 2.pdf` | `mastery-math-08-trig-identities` |
| **MATH-09** | Triangle Centers, Inscribed/Circumscribed Circles & Quads | `Notes - Trigonometry 3, 4.pdf` | `mastery-math-09-triangle-circles` |
| **MATH-10** | Plane Geometry, Polygons & Circle Geometry Theorems | `Notes - Plane Geometry 1-5.pdf` | `mastery-math-10-plane-geom` |
| **MATH-11** | Solid Geometry, Polyhedrons & Platonic Solids | `Notes - Solid Geometry 1-3.pdf` | `mastery-math-11-solid-geom` |
| **MATH-12** | Cartesian Coordinate Geometry, Lines & Polygons | `Notes - Analytic Geom 1, 2.pdf` | `mastery-math-12-analytic-lines` |
| **MATH-13** | Conic Sections: Circle, Parabola, Ellipse & Hyperbola | `Notes - Analytic Geom 2, 3, 4.pdf` | `mastery-math-13-conic-sections` |
| **MATH-14** | Limits, Continuity & Derivative Rules | `Notes - Differential Calculus 1, 2.pdf` | `mastery-math-14-limits-derivatives` |
| **MATH-15** | Maxima/Minima, Time Rates & PRC Board Shortcuts | `Notes - Differential Calculus 3, 4.pdf` | `mastery-math-15-maxima-rates` |
| **MATH-16** | Indefinite/Definite Integrals, Wallis Formula & Methods | `Notes - Integral Calculus 1, 2.pdf` | `mastery-math-16-integrals-wallis` |
| **MATH-17** | Applications of Integrals: Area, Centroid, Volume & Work | `Notes - Integral Calculus 2, 3.pdf` | `mastery-math-17-integral-apps` |
| **MATH-18** | First-Order Differential Equations & Exact Types | `Notes - DE 1, 2.pdf` | `mastery-math-18-de-first-order` |
| **MATH-19** | Physical Applications of First-Order DE | `Notes - DE 2, 3.pdf` | `mastery-math-19-de-apps` |
| **MATH-20** | Complex Numbers & De Moivre's Theorem | `Notes - Advanced Math 1.pdf` | `mastery-math-20-complex-numbers` |
| **MATH-21** | Matrices, Determinants & Linear Systems | `Notes - Advanced Math 2-5.pdf` | `mastery-math-21-matrices` |
| **MATH-22** | Laplace Transforms & Operational Theorems | `Notes - Advanced Math 5, 6.pdf` | `mastery-math-22-laplace` |
| **MATH-23** | Fourier Transforms, Fourier Series & Z-Transforms | `Notes - Advanced Math 6, 7.pdf` | `mastery-math-23-fourier-ztransform` |
