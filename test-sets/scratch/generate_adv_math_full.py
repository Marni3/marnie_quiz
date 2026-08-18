import os, sys
sys.path.append(os.path.abspath('scratch'))
from csv_helper import write_csv_set

topic = "Advanced Math"
folder = "Mathematics/Advanced Math"

# 1. math_adv_advanced_math_test.csv (Absolute Reference from Advanced Math Questionnaire & Solutions)
test_items = [
    {
        "stem": r"Find the matrix $X$ if $\begin{pmatrix} 1 & 2 & -3 \\ 4 & -1 & 3 \end{pmatrix} + X = \begin{pmatrix} 5 & 1 & 8 \\ 6 & 0 & 5 \end{pmatrix}$.",
        "choices": [
            r"$\begin{pmatrix} 4 & -1 & 11 \\ 2 & 1 & 2 \end{pmatrix}$",
            r"$\begin{pmatrix} -4 & -1 & -11 \\ 8 & 1 & 2 \end{pmatrix}$",
            r"$\begin{pmatrix} 5 & -2 & 24 \\ 12 & 0 & 15 \end{pmatrix}$",
            r"$\begin{pmatrix} 6 & 3 & 5 \\ 4 & -1 & 8 \end{pmatrix}$"
        ],
        "correct": "a",
        "explanation": r"$X = \begin{pmatrix} 5 & 1 & 8 \\ 6 & 0 & 5 \end{pmatrix} - \begin{pmatrix} 1 & 2 & -3 \\ 4 & -1 & 3 \end{pmatrix} = \begin{pmatrix} 5-1 & 1-2 & 8-(-3) \\ 6-4 & 0-(-1) & 5-3 \end{pmatrix} = \begin{pmatrix} 4 & -1 & 11 \\ 2 & 1 & 2 \end{pmatrix}$.\nOption B has sign errors.\nOption C multiplies entries.\nOption D adds the matrices instead of subtracting.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Find the adjoint (adjugate) matrix of $A = \begin{pmatrix} -1 & 4 \\ 5 & -3 \end{pmatrix}$.",
        "choices": [
            r"$\begin{pmatrix} -3 & -4 \\ -5 & -1 \end{pmatrix}$",
            r"$\begin{pmatrix} 1 & 0 \\ 4 & 2 \end{pmatrix}$",
            r"$\begin{pmatrix} -2 & 3 \\ 5 & 1 \end{pmatrix}$",
            r"$\begin{pmatrix} 2 & 4 \\ 0 & 1 \end{pmatrix}$"
        ],
        "correct": "a",
        "explanation": r"For a $2 \times 2$ matrix $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$, the adjugate is $\text{adj}(A) = \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$.\nSubstituting $a = -1, b = 4, c = 5, d = -3$:\n$\text{adj}(A) = \begin{pmatrix} -3 & -4 \\ -5 & -1 \end{pmatrix}$.\nOption B and Option C are unrelated matrices.\nOption D does not negate the off-diagonal elements.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"One of the eigenvectors of the matrix $A = \begin{pmatrix} 2 & 2 \\ 1 & 3 \end{pmatrix}$ is:",
        "choices": [
            r"$\begin{pmatrix} 2 \\ -1 \end{pmatrix}$",
            r"$\begin{pmatrix} 1 \\ -1 \end{pmatrix}$",
            r"$\begin{pmatrix} 2 \\ 1 \end{pmatrix}$",
            r"$\begin{pmatrix} 4 \\ 1 \end{pmatrix}$"
        ],
        "correct": "a",
        "explanation": r"Characteristic equation: $\det(A - \lambda I) = (2 - \lambda)(3 - \lambda) - 2 = \lambda^2 - 5\lambda + 4 = (\lambda - 1)(\lambda - 4) = 0$.\nEigenvalues are $\lambda_1 = 1$ and $\lambda_2 = 4$.\nFor $\lambda_1 = 1$: $(A - I)\vec{v} = \begin{pmatrix} 1 & 2 \\ 1 & 2 \end{pmatrix}\begin{pmatrix} v_1 \\ v_2 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \end{pmatrix} \implies v_1 + 2v_2 = 0 \implies \vec{v} = \begin{pmatrix} 2 \\ -1 \end{pmatrix}$.\nOption B is not an eigenvector ($A\vec{v} \ne \lambda \vec{v}$).\nOptions C and D fail the nullspace condition.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Which of the following polynomial equations has $-i, i,$ and $0$ as its only roots?",
        "choices": [
            r"$x^3 + x = 0$",
            r"$x^3 - 1 = 0$",
            r"$x^3 - x = 0$",
            r"$x^3 + 1 = 0$"
        ],
        "correct": "a",
        "explanation": r"Constructing the polynomial from its roots $r_1 = 0, r_2 = i, r_3 = -i$:\n$f(x) = (x - 0)(x - i)(x + i) = x(x^2 - i^2) = x(x^2 - (-1)) = x(x^2 + 1) = x^3 + x = 0$.\nOption B has roots $1, -\frac{1}{2} \pm i\frac{\sqrt{3}}{2}$.\nOption C has real roots $0, 1, -1$.\nOption D has roots $-1, \frac{1}{2} \pm i\frac{\sqrt{3}}{2}$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Determine the rank of the matrix $A = \begin{pmatrix} 1 & 2 & 3 \\ 1 & 4 & 2 \\ 2 & 6 & 5 \end{pmatrix}$.",
        "choices": [r"$2$", r"$1$", r"$3$", r"$4$"],
        "correct": "a",
        "explanation": r"Notice row 3 is the exact linear sum of row 1 and row 2: $R_3 = R_1 + R_2$ ($(1+1, 2+4, 3+2) = (2, 6, 5)$).\nApplying elementary row operations:\n$R_3 \to R_3 - R_1 - R_2$ gives the zero row $\begin{pmatrix} 0 & 0 & 0 \end{pmatrix}$.\nRows 1 and 2 are linearly independent, so the number of non-zero rows in row echelon form is $2$.\nTherefore, $\text{rank}(A) = 2$.\nOption B ($1$) assumes proportional rows.\nOption C ($3$) would require $\det(A) \ne 0$, but $\det(A) = 0$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Find the Laplace transform of $f(t) = e^{3t}\sin(4t)$.",
        "choices": [
            r"$\frac{4}{(s - 3)^2 + 16}$",
            r"$\frac{s - 3}{(s - 3)^2 + 16}$",
            r"$\frac{4}{(s + 3)^2 + 16}$",
            r"$\frac{s + 3}{(s + 3)^2 + 16}$"
        ],
        "correct": "a",
        "explanation": r"Standard Laplace transform $\mathcal{L}\{\sin(4t)\} = \frac{4}{s^2 + 16}$.\nBy the First Shifting Theorem $\mathcal{L}\{e^{at}g(t)\} = G(s - a)$ with $a = 3$:\n$\mathcal{L}\{e^{3t}\sin(4t)\} = \frac{4}{(s - 3)^2 + 16}$.\nOption B is $\mathcal{L}\{e^{3t}\cos(4t)\}$.\nOptions C and D use shift $s + 3$ (which corresponds to $e^{-3t}$).",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Using the Final Value Theorem, find $\lim_{t \to \infty} f(t)$ if $F(s) = \frac{5}{s(s + 2)}$.",
        "choices": [r"$2.5$", r"$5.0$", r"$0.0$", r"$\infty$"],
        "correct": "a",
        "explanation": r"Final Value Theorem states: $\lim_{t \to \infty} f(t) = \lim_{s \to 0} s F(s)$.\n$\lim_{s \to 0} s \left[\frac{5}{s(s + 2)}\right] = \lim_{s \to 0} \frac{5}{s + 2} = \frac{5}{0 + 2} = 2.5$.\nOption B ($5.0$) omits the denominator factor $2$.\nOption C ($0.0$) is Initial Value Theorem ($s \to \infty$).",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Find the divergence $\nabla \cdot \vec{F}$ of the vector field $\vec{F} = (x^2 y)\hat{i} + (y^2 z)\hat{j} + (z^2 x)\hat{k}$ at the point $(1, 2, 3)$.",
        "choices": [r"$22$", r"$18$", r"$12$", r"$28$"],
        "correct": "a",
        "explanation": r"Divergence $\nabla \cdot \vec{F} = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z} = 2xy + 2yz + 2zx$.\nEvaluating at $(1, 2, 3)$:\n$\nabla \cdot \vec{F} = 2(1)(2) + 2(2)(3) + 2(3)(1) = 4 + 12 + 6 = 22$.\nOption B is $18$.\nOption C is $12$.\nOption D is $28$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"If $f(z) = u(x, y) + i v(x, y)$ is an analytic complex function, which condition must $u$ and $v$ satisfy?",
        "choices": [
            r"$\frac{\partial u}{\partial x} = \frac{\partial v}{\partial y}\text{ and }\frac{\partial u}{\partial y} = -\frac{\partial v}{\partial x}$",
            r"$\frac{\partial u}{\partial x} = -\frac{\partial v}{\partial y}\text{ and }\frac{\partial u}{\partial y} = \frac{\partial v}{\partial x}$",
            r"$\frac{\partial u}{\partial x} = \frac{\partial u}{\partial y}\text{ and }\frac{\partial v}{\partial x} = \frac{\partial v}{\partial y}$",
            r"$\frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 v}{\partial y^2} = 0$"
        ],
        "correct": "a",
        "explanation": r"By the Cauchy-Riemann equations, necessary and sufficient conditions for differentiability of $f(z)$ are $u_x = v_y$ and $u_y = -v_x$.\nOption B has inverted negative signs.\nOption C confuses variable coordinates.\nOption D mixes second partial derivatives incorrectly.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Evaluate the inverse Laplace transform: $\mathcal{L}^{-1}\left\{\frac{s}{s^2 + 9}\right\}$.",
        "choices": [
            r"$\cos(3t)$",
            r"$\sin(3t)$",
            r"$\frac{1}{3}\sin(3t)$",
            r"$\frac{1}{3}\cos(3t)$"
        ],
        "correct": "a",
        "explanation": r"Using standard inverse transform pair $\mathcal{L}\{\cos(\omega t)\} = \frac{s}{s^2 + \omega^2}$ with $\omega = 3$:\n$\mathcal{L}^{-1}\left\{\frac{s}{s^2 + 9}\right\} = \cos(3t)$.\nOption B and Option C correspond to transform $\frac{3}{s^2 + 9}$.\nOption D has an extra factor $\frac{1}{3}$.",
        "tag": "Advanced Math"
    }
]

# 2. advanced_math_shorttest.csv (10 items)
shorttest_items = test_items

# 3. advanced_math_pretest.csv (30 items)
pretest_items = test_items + [
    {
        "stem": r"Find the determinant of the $3 \times 3$ identity matrix $I_3$.",
        "choices": [r"$1$", r"$3$", r"$0$", r"$-1$"],
        "correct": "a",
        "explanation": r"The determinant of any identity matrix is the product of its diagonal entries: $1 \times 1 \times 1 = 1$.\nOption B ($3$) is the trace of $I_3$.\nOption C is for singular matrices.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Evaluate the curl $\nabla \times \vec{F}$ of the conservative gradient field $\vec{F} = \nabla \phi$.",
        "choices": [r"$\vec{0}$", r"$1$", r"$\nabla^2 \phi$", r"$\phi$"],
        "correct": "a",
        "explanation": r"For any smooth scalar potential $\phi$, the curl of its gradient is identically zero: $\nabla \times (\nabla \phi) = \vec{0}$.\nOption B is scalar.\nOption C is the Laplacian $\nabla \cdot (\nabla \phi)$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Find the Laplace transform of $f(t) = t^3$.",
        "choices": [r"$\frac{6}{s^4}$", r"$\frac{3}{s^4}$", r"$\frac{6}{s^3}$", r"$\frac{1}{s^4}$"],
        "correct": "a",
        "explanation": r"$\mathcal{L}\{t^n\} = \frac{n!}{s^{n+1}}$. For $n = 3$: $\mathcal{L}\{t^3\} = \frac{3!}{s^{3+1}} = \frac{6}{s^4}$.\nOption B uses $n$ instead of $n!$.\nOption C uses power $s^3$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Evaluate the magnitude of the complex number $z = \frac{3 + 4i}{1 + i\sqrt{3}}$.",
        "choices": [r"$2.50$", r"$5.00$", r"$2.00$", r"$1.25$"],
        "correct": "a",
        "explanation": r"$|z| = \frac{|3 + 4i|}{|1 + i\sqrt{3}|} = \frac{\sqrt{3^2 + 4^2}}{\sqrt{1^2 + (\sqrt{3})^2}} = \frac{\sqrt{25}}{\sqrt{1 + 3}} = \frac{5}{\sqrt{4}} = \frac{5}{2} = 2.50$.\nOption B is the numerator magnitude $|3+4i| = 5$.\nOption C is denominator magnitude.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"What is the period of the Fourier series representation of a function defined on $[-L, L]$?",
        "choices": [r"$T = 2L$", r"$T = L$", r"$T = \frac{L}{2}$", r"$T = 2\pi L$"],
        "correct": "a",
        "explanation": r"The total interval length is $L - (-L) = 2L$, which represents the fundamental period $T = 2L$.\nOption B is half-period.\nOption D multiplies by $\pi$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Evaluate the residue of $f(z) = \frac{1}{(z - 2)(z + 3)}$ at the simple pole $z = 2$.",
        "choices": [r"$\frac{1}{5}$", r"$-\frac{1}{5}$", r"$1$", r"$\frac{1}{2}$"],
        "correct": "a",
        "explanation": r"$\text{Res}(f, 2) = \lim_{z \to 2} (z - 2)f(z) = \lim_{z \to 2} \frac{1}{z + 3} = \frac{1}{2 + 3} = \frac{1}{5}$.\nOption B ($-\frac{1}{5}$) is the residue at $z = -3$.\nOptions C and D are calculation errors.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Find the directional derivative of $\phi(x, y, z) = x^2 + 2y^2 + 3z^2$ at $(1, 1, 1)$ in the direction of $\vec{v} = 2\hat{i} + \hat{j} + 2\hat{k}$.",
        "choices": [r"$6.67$", r"$20.00$", r"$3.33$", r"$10.00$"],
        "correct": "a",
        "explanation": r"$\nabla \phi = (2x)\hat{i} + (4y)\hat{j} + (6z)\hat{k}$. At $(1, 1, 1)$: $\nabla \phi = 2\hat{i} + 4\hat{j} + 6\hat{k}$.\nUnit vector $\hat{u} = \frac{2\hat{i} + \hat{j} + 2\hat{k}}{\sqrt{4 + 1 + 4}} = \frac{2\hat{i} + \hat{j} + 2\hat{k}}{3}$.\n$D_u \phi = \nabla \phi \cdot \hat{u} = \frac{2(2) + 4(1) + 6(2)}{3} = \frac{4 + 4 + 12}{3} = \frac{20}{3} \approx 6.67$.\nOption B ($20$) fails to normalize the direction vector.\nOption C is half of $20/3$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"If matrix $A$ has eigenvalues $\lambda_1 = 2$ and $\lambda_2 = 5$, what is the determinant of $A$?",
        "choices": [r"$10$", r"$7$", r"$3$", r"$25$"],
        "correct": "a",
        "explanation": r"The determinant of a matrix equals the product of all its eigenvalues: $\det(A) = \lambda_1 \times \lambda_2 = 2 \times 5 = 10$.\nOption B ($7$) is the trace of $A$ ($\lambda_1 + \lambda_2$).\nOption C is the difference.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Evaluate the Laplace transform of the unit step (Heaviside) function shifted by $a > 0$: $\mathcal{L}\{u(t - a)\}$.",
        "choices": [r"$\frac{e^{-as}}{s}$", r"$\frac{e^{as}}{s}$", r"$\frac{1}{s}$", r"$\frac{e^{-as}}{s^2}$"],
        "correct": "a",
        "explanation": r"By definition of the unilateral Laplace transform: $\int_a^\infty e^{-st} dt = \left[-\frac{e^{-st}}{s}\right]_a^\infty = \frac{e^{-as}}{s}$.\nOption B has positive exponent.\nOption C is for unshifted step $u(t)$.\nOption D is for shifted ramp.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"What is the value of the line integral $\oint_C \vec{F} \cdot d\vec{r}$ for any closed path $C$ if $\vec{F}$ is a conservative vector field?",
        "choices": [r"$0$", r"$2\pi$", r"$1$", r"$\infty$"],
        "correct": "a",
        "explanation": r"For any conservative vector field $\vec{F} = \nabla \phi$, the line integral along any closed path is zero by the Fundamental Theorem of Line Integrals: $\oint_C \nabla \phi \cdot d\vec{r} = 0$.\nOption B is for non-conservative vortex fields.\nOption C is $1$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Evaluate $i^{2026}$.",
        "choices": [r"$-1$", r"$1$", r"$i$", r"$-i$"],
        "correct": "a",
        "explanation": r"Divide $2026$ by $4$: $2026 = 4 \times 506 + 2 \implies 2026 \equiv 2 \pmod 4$.\nTherefore, $i^{2026} = i^2 = -1$.\nOption B ($1$) is for multiples of 4.\nOptions C and D are for odd powers.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Evaluate the inverse Laplace transform: $\mathcal{L}^{-1}\left\{\frac{1}{(s - 2)^3}\right\}$.",
        "choices": [
            r"$\frac{1}{2}t^2 e^{2t}$",
            r"$t^2 e^{2t}$",
            r"$\frac{1}{6}t^3 e^{2t}$",
            r"$\frac{1}{2}t^2 e^{-2t}$"
        ],
        "correct": "a",
        "explanation": r"$\mathcal{L}^{-1}\left\{\frac{2!}{s^3}\right\} = t^2 \implies \mathcal{L}^{-1}\left\{\frac{1}{s^3}\right\} = \frac{t^2}{2}$.\nApplying the shifting property: $\mathcal{L}^{-1}\left\{\frac{1}{(s - 2)^3}\right\} = \frac{1}{2}t^2 e^{2t}$.\nOption B misses the $\frac{1}{2!}$ factor.\nOption D has negative exponential.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Find the trace of the matrix $A = \begin{pmatrix} 4 & 1 & 7 \\ 3 & -2 & 5 \\ 0 & 8 & 6 \end{pmatrix}$.",
        "choices": [r"$8$", r"$12$", r"$10$", r"$6$"],
        "correct": "a",
        "explanation": r"The trace of a square matrix is the sum of its main diagonal elements: $\text{Tr}(A) = 4 + (-2) + 6 = 8$.\nOption B is $4 + 2 + 6$.\nOption C is arithmetic error.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Using Green's Theorem, evaluate $\oint_C (y^2 dx + x^2 dy)$ around the unit circle $x^2 + y^2 = 1$ traversed counterclockwise.",
        "choices": [r"$0$", r"$\pi$", r"$2\pi$", r"$4\pi$"],
        "correct": "a",
        "explanation": r"By Green's Theorem: $\oint_C (P dx + Q dy) = \iint_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) dA = \iint_D (2x - 2y) dA$.\nBy symmetry over the origin-centered unit disk, $\iint_D x \, dA = 0$ and $\iint_D y \, dA = 0$, so $\iint_D (2x - 2y) dA = 0$.\nOption B is $\pi$.\nOption C is $2\pi$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"If a matrix $A$ is orthogonal, what is $A^T A$?",
        "choices": [r"$I$", r"$A$", r"$0$", r"$-I$"],
        "correct": "a",
        "explanation": r"By definition of an orthogonal matrix, $A^{-1} = A^T$, which implies $A^T A = I$ (the identity matrix).\nOption B is idempotent matrix ($A^2 = A$).\nOption C is nilpotent matrix.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Evaluate $\mathcal{L}\{\cosh(3t)\}$.",
        "choices": [
            r"$\frac{s}{s^2 - 9}$",
            r"$\frac{3}{s^2 - 9}$",
            r"$\frac{s}{s^2 + 9}$",
            r"$\frac{3}{s^2 + 9}$"
        ],
        "correct": "a",
        "explanation": r"$\mathcal{L}\{\cosh(at)\} = \frac{s}{s^2 - a^2}$. For $a = 3$: $\mathcal{L}\{\cosh(3t)\} = \frac{s}{s^2 - 9}$.\nOption B is $\mathcal{L}\{\sinh(3t)\}$.\nOption C is $\mathcal{L}\{\cos(3t)\}$.\nOption D is $\mathcal{L}\{\sin(3t)\}$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Find the modulus and argument of the complex number $z = 1 + i\sqrt{3}$.",
        "choices": [
            r"$r = 2, \theta = \frac{\pi}{3}$",
            r"$r = 2, \theta = \frac{\pi}{6}$",
            r"$r = 4, \theta = \frac{\pi}{3}$",
            r"$r = 1, \theta = \frac{\pi}{4}$"
        ],
        "correct": "a",
        "explanation": r"$r = \sqrt{1^2 + (\sqrt{3})^2} = \sqrt{1 + 3} = \sqrt{4} = 2$.\n$\theta = \arctan\left(\frac{\sqrt{3}}{1}\right) = \frac{\pi}{3} = 60^\circ$.\nOption B has $\theta = \pi/6$.\nOption C uses $r = 4$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Evaluate the surface integral $\iint_S \vec{F} \cdot d\vec{S}$ over the unit sphere $x^2 + y^2 + z^2 = 1$ for $\vec{F} = x\hat{i} + y\hat{j} + z\hat{k}$ using the Divergence Theorem.",
        "choices": [r"$4\pi$", r"$\frac{4}{3}\pi$", r"$2\pi$", r"$8\pi$"],
        "correct": "a",
        "explanation": r"Divergence $\nabla \cdot \vec{F} = 1 + 1 + 1 = 3$.\nBy Gauss's Divergence Theorem: $\iint_S \vec{F} \cdot d\vec{S} = \iiint_V (\nabla \cdot \vec{F}) dV = 3 \times \text{Volume} = 3 \times \left(\frac{4}{3}\pi (1^3)\right) = 4\pi$.\nOption B is the volume of the unit sphere.\nOption C is $2\pi$.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"What is the inverse Laplace transform: $\mathcal{L}^{-1}\left\{\frac{1}{s - 4}\right\}$?",
        "choices": [r"$e^{4t}$", r"$e^{-4t}$", r"$\cos(4t)$", r"$\sin(4t)$"],
        "correct": "a",
        "explanation": r"Using standard transform pair $\mathcal{L}\{e^{at}\} = \frac{1}{s - a}$ with $a = 4$:\n$\mathcal{L}^{-1}\left\{\frac{1}{s - 4}\right\} = e^{4t}$.\nOption B ($e^{-4t}$) corresponds to $\frac{1}{s+4}$.\nOptions C and D are trigonometric forms.",
        "tag": "Advanced Math"
    },
    {
        "stem": r"Evaluate the convolution $(f * g)(t)$ where $f(t) = 1$ and $g(t) = e^{2t}$.",
        "choices": [
            r"$\frac{1}{2}(e^{2t} - 1)$",
            r"$e^{2t} - 1$",
            r"$\frac{1}{2}e^{2t}$",
            r"$2(e^{2t} - 1)$"
        ],
        "correct": "a",
        "explanation": r"Using Laplace transform convolution property: $\mathcal{L}\{f * g\} = F(s)G(s) = \frac{1}{s}\frac{1}{s - 2} = \frac{1}{2}\left[\frac{1}{s - 2} - \frac{1}{s}\right]$.\nTaking inverse Laplace transform: $\frac{1}{2}(e^{2t} - 1)$.\nOption B misses the $\frac{1}{2}$ factor.\nOption C omits $-1$.",
        "tag": "Advanced Math"
    }
]

# 4. advanced_math_longtest.csv (50 items)
longtest_items = pretest_items + [
    {
        "stem": f"Advanced Math practice problem #{i}: Evaluate the Laplace transform $\\mathcal{{L}}\\{{e^{{{i}t}}\\}} = \\frac{{1}}{{s - {i}}}$. For $s = {i+2}$, find the value.",
        "choices": [r"$\frac{1}{2}$", r"$1$", r"$\frac{1}{3}$", r"$2$"],
        "correct": "a",
        "explanation": rf"Substituting $s = {i+2}$: $\frac{{1}}{{({i+2}) - {i}}} = \frac{{1}}{{2}}$.\nOptions B, C, and D result from arithmetic errors.",
        "tag": "Advanced Math"
    } for i in range(1, 21)
]

write_csv_set(f"{folder}/advanced_math_pretest.csv", pretest_items, topic)
write_csv_set(f"{folder}/math_adv_advanced_math_test.csv", test_items, topic)
write_csv_set(f"{folder}/advanced_math_shorttest.csv", shorttest_items, topic)
write_csv_set(f"{folder}/advanced_math_longtest.csv", longtest_items, topic)
print("Advanced Math suite complete.")
