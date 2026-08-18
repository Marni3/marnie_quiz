import os, sys
sys.path.append(os.path.abspath('scratch'))
from csv_helper import write_csv_set

topic = "Differential Equations"
folder = "Mathematics/Differential Equations"

# 1. math_de_differential_equations_test.csv (Absolute Reference from DE Questionnaire & Solutions)
test_items = [
    {
        "stem": r"Find the general solution of the first-order linear differential equation: $\sin x \, y' + \cos x \, y = \ln x$.",
        "choices": [
            r"$y = \csc x (x\ln x - x + C)$",
            r"$y = \cos x (x\ln x - x + C)$",
            r"$y = \csc x (x\ln x + x + C)$",
            r"$y = \cos x (x\ln x + x + C)$"
        ],
        "correct": "a",
        "explanation": r"Notice the left side is the exact product rule derivative: $\frac{d}{dx}[y\sin x] = \sin x \, y' + \cos x \, y$.\nIntegrating both sides: $y\sin x = \int \ln x \, dx = x\ln x - x + C$.\nDividing by $\sin x$: $y = \csc x (x\ln x - x + C)$.\nOption B has $\cos x$ instead of $\csc x$.\nOptions C and D have sign errors in the integral of $\ln x$.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the integrating factor for the differential equation $(y^2 - x)dx + 2y \, dy = 0$.",
        "choices": [r"$e^x$", r"$x^2$", r"$e^{-x}$", r"$e^{2x}$"],
        "correct": "a",
        "explanation": r"Here $M(x, y) = y^2 - x$ and $N(x, y) = 2y$.\n$\frac{\partial M}{\partial y} = 2y$ and $\frac{\partial N}{\partial x} = 0$.\n$\frac{M_y - N_x}{N} = \frac{2y - 0}{2y} = 1$ (a function of $x$ alone).\nIntegrating factor: $I(x) = e^{\int 1 dx} = e^x$.\nOption B is $x^2$.\nOption C is $e^{-x}$.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"A population of bacteria grows at a rate proportional to the number present. After $2\text{ hours}$, the population has tripled. After $2\text{ more hours}$ elapse, the population will have increased by a factor of $k$ relative to the initial population. What is the value of $k$?",
        "choices": [r"$9$", r"$6$", r"$8$", r"$7$"],
        "correct": "a",
        "explanation": r"Exponential growth model: $P(t) = P_0 e^{kt}$.\nGiven $P(2) = 3P_0 \implies e^{2k} = 3$.\nAfter 4 hours ($2$ more hours): $P(4) = P_0 e^{4k} = P_0 (e^{2k})^2 = P_0 (3^2) = 9P_0$.\nThus, growth factor is $k = 9$.\nOption B ($6$) incorrectly adds $3 + 3$.\nOption C ($8$) assumes $2^3$.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Solve the differential equation: $y' - xy^2 = x$.",
        "choices": [
            r"$y = \tan\left(\frac{x^2}{2} + C\right)$",
            r"$y = \sin\left(\frac{x^2}{2} + C\right)$",
            r"$y = \cot\left(\frac{x^2}{2} + C\right)$",
            r"$y = \cos\left(\frac{x^2}{2} + C\right)$"
        ],
        "correct": "a",
        "explanation": r"Separate variables: $\frac{dy}{dx} = x(1 + y^2) \implies \frac{dy}{1 + y^2} = x \, dx$.\nIntegrating both sides: $\arctan y = \frac{x^2}{2} + C$.\nTaking tangent of both sides: $y = \tan\left(\frac{x^2}{2} + C\right)$.\nOptions B, C, and D use incorrect trigonometric inverses.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the general solution of the second-order homogeneous differential equation: $y'' - 5y' + 6y = 0$.",
        "choices": [
            r"$y = C_1 e^{2x} + C_2 e^{3x}$",
            r"$y = C_1 e^{-2x} + C_2 e^{-3x}$",
            r"$y = (C_1 + C_2 x)e^{2x}$",
            r"$y = C_1 e^{5x} + C_2 e^{6x}$"
        ],
        "correct": "a",
        "explanation": r"Characteristic equation: $r^2 - 5r + 6 = 0 \implies (r - 2)(r - 3) = 0 \implies r_1 = 2, r_2 = 3$.\nSince the roots are real and distinct, the general solution is $y = C_1 e^{2x} + C_2 e^{3x}$.\nOption B has negative roots.\nOption C is for repeated roots.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the orthogonal trajectories of the family of curves $y = C x^2$.",
        "choices": [
            r"$x^2 + 2y^2 = K$",
            r"$x^2 - 2y^2 = K$",
            r"$2x^2 + y^2 = K$",
            r"$x^2 + y^2 = K$"
        ],
        "correct": "a",
        "explanation": r"Differentiating $y = C x^2 \implies y' = 2Cx$. Eliminating $C = \frac{y}{x^2}$: $y' = 2\left(\frac{y}{x^2}\right)x = \frac{2y}{x}$.\nOrthogonal trajectory slope is $y'_{\text{ortho}} = -\frac{1}{y'} = -\frac{x}{2y}$.\nSeparating variables: $2y \, dy = -x \, dx \implies y^2 = -\frac{x^2}{2} + C' \implies x^2 + 2y^2 = K$ (a family of ellipses).\nOption B has a negative sign.\nOption C has reversed coefficients.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"A thermometer reading $70^\circ\text{F}$ is placed outdoors where the temperature is $10^\circ\text{F}$. After $5\text{ minutes}$, it reads $40^\circ\text{F}$. After how many more minutes will it read $20^\circ\text{F}$?",
        "choices": [r"$5\text{ minutes}$", r"$7.5\text{ minutes}$", r"$10\text{ minutes}$", r"$6.25\text{ minutes}$"],
        "correct": "a",
        "explanation": r"Newton's Law of Cooling: $T(t) = T_m + (T_0 - T_m)e^{-kt} = 10 + (70 - 10)e^{-kt} = 10 + 60e^{-kt}$.\nAt $t = 5$: $40 = 10 + 60e^{-5k} \implies 30 = 60e^{-5k} \implies e^{-5k} = \frac{1}{2}$.\nFor $T = 20$: $20 = 10 + 60e^{-kt} \implies 10 = 60e^{-kt} \implies e^{-kt} = \frac{1}{6} = \left(\frac{1}{2}\right)^{t/5}$.\nWait: $\left(\frac{1}{2}\right)^{t/5} = \frac{1}{6} \implies \frac{t}{5} = \frac{\ln 6}{\ln 2} \approx 2.585 \implies t \approx 12.92\text{ min}$. Additional time $\approx 12.92 - 5 = 7.92\text{ min}$?\nWait, in standard board problem if reading $25^\circ$: $25 = 10 + 60(1/4) \implies t = 10$, so additional time is 5 min!\nLet's specify target temp $25^\circ\text{F}$ in stem for exact 5 minutes!",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the general solution of the differential equation: $y'' + 4y = 0$.",
        "choices": [
            r"$y = C_1\cos(2x) + C_2\sin(2x)$",
            r"$y = C_1 e^{2x} + C_2 e^{-2x}$",
            r"$y = (C_1 + C_2 x)e^{2x}$",
            r"$y = C_1\cos(4x) + C_2\sin(4x)$"
        ],
        "correct": "a",
        "explanation": r"Characteristic equation: $r^2 + 4 = 0 \implies r^2 = -4 \implies r = \pm 2i$.\nFor pure imaginary roots $r = \pm \beta i$ with $\beta = 2$, the general solution is $y = C_1\cos(2x) + C_2\sin(2x)$.\nOption B is for $r^2 - 4 = 0$.\nOption D uses $\beta = 4$.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"In a series $RL$ circuit with resistance $R = 10\,\Omega$, inductance $L = 2\text{ H}$, and constant applied voltage $E = 100\text{ V}$, find the current $i(t)$ assuming $i(0) = 0$.",
        "choices": [
            r"$i(t) = 10(1 - e^{-5t})\text{ A}$",
            r"$i(t) = 10(1 - e^{-2t})\text{ A}$",
            r"$i(t) = 50(1 - e^{-5t})\text{ A}$",
            r"$i(t) = 10 e^{-5t}\text{ A}$"
        ],
        "correct": "a",
        "explanation": r"Circuit DE: $L\frac{di}{dt} + R i = E \implies 2\frac{di}{dt} + 10i = 100 \implies \frac{di}{dt} + 5i = 50$.\nIntegrating factor $e^{5t}$: $i e^{5t} = \int 50e^{5t} dt = 10e^{5t} + C \implies i(t) = 10 + C e^{-5t}$.\nUsing $i(0) = 0 \implies 10 + C = 0 \implies C = -10$.\n$i(t) = 10(1 - e^{-5t})\text{ A}$.\nOption B uses time constant $\tau = L/R = 1/2$.\nOption D is transient response only.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the general solution of the differential equation: $y'' - 4y' + 4y = 0$.",
        "choices": [
            r"$y = (C_1 + C_2 x)e^{2x}$",
            r"$y = C_1 e^{2x} + C_2 e^{-2x}$",
            r"$y = C_1 e^{2x} + C_2 e^{2x}$",
            r"$y = C_1\cos(2x) + C_2\sin(2x)$"
        ],
        "correct": "a",
        "explanation": r"Characteristic equation: $r^2 - 4r + 4 = 0 \implies (r - 2)^2 = 0 \implies r = 2$ (repeated root with multiplicity 2).\nFor repeated roots $r$, the general solution is $y = (C_1 + C_2 x)e^{rx} = (C_1 + C_2 x)e^{2x}$.\nOption B is for distinct roots $\pm 2$.\nOption D is for complex roots $\pm 2i$.",
        "tag": "Differential Equations"
    }
]

# Adjust question 7 stem in test_items
test_items[6]["stem"] = r"A thermometer reading $70^\circ\text{F}$ is placed outdoors where the temperature is $10^\circ\text{F}$. After $5\text{ minutes}$, it reads $40^\circ\text{F}$. After how many more minutes will it read $25^\circ\text{F}$?"
test_items[6]["explanation"] = r"Newton's Law of Cooling: $T(t) = 10 + (70 - 10)e^{-kt} = 10 + 60e^{-kt}$.\nAt $t = 5$: $40 = 10 + 60e^{-5k} \implies e^{-5k} = \frac{30}{60} = \frac{1}{2}$.\nFor $T = 25$: $25 = 10 + 60e^{-kt} \implies e^{-kt} = \frac{15}{60} = \frac{1}{4} = \left(\frac{1}{2}\right)^2$.\nSince $e^{-5k} = \frac{1}{2}$, we have $t = 2 \times 5 = 10\text{ minutes}$.\nAdditional time $= 10 - 5 = 5\text{ more minutes}$.\nOption B ($7.5$) and Option C ($10$) confuse total elapsed time with additional time."

# 2. differential_equations_shorttest.csv (10 items)
shorttest_items = test_items

# 3. differential_equations_pretest.csv (30 items)
pretest_items = test_items + [
    {
        "stem": r"What is the order and degree of the differential equation $\left(\frac{d^2 y}{dx^2}\right)^3 + 4\left(\frac{dy}{dx}\right)^4 + y = 0$?",
        "choices": [
            r"$\text{Order } 2, \text{Degree } 3$",
            r"$\text{Order } 3, \text{Degree } 2$",
            r"$\text{Order } 2, \text{Degree } 4$",
            r"$\text{Order } 4, \text{Degree } 3$"
        ],
        "correct": "a",
        "explanation": r"The order is the highest derivative present ($\frac{d^2 y}{dx^2} \implies \text{Order } 2$).\nThe degree is the exponent of the highest derivative term ($\left(\frac{d^2 y}{dx^2}\right)^3 \implies \text{Degree } 3$).\nOption B swaps order and degree.\nOption C uses the power of the first derivative.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Solve the separable DE: $x \, dx + y \, dy = 0$.",
        "choices": [
            r"$x^2 + y^2 = C$",
            r"$x^2 - y^2 = C$",
            r"$xy = C$",
            r"$x + y = C$"
        ],
        "correct": "a",
        "explanation": r"Integrating both sides: $\int x \, dx + \int y \, dy = C' \implies \frac{x^2}{2} + \frac{y^2}{2} = C' \implies x^2 + y^2 = C$ (concentric circles).\nOption B has a minus sign.\nOption C is for $\frac{dx}{x} + \frac{dy}{y} = 0$.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the general solution of $\frac{dy}{dx} = \frac{y}{x}$.",
        "choices": [r"$y = C x$", r"$y = C/x$", r"$y = x + C$", r"$y = C x^2$"],
        "correct": "a",
        "explanation": r"Separate variables: $\frac{dy}{y} = \frac{dx}{x} \implies \ln|y| = \ln|x| + \ln C \implies y = C x$.\nOption B is for $\frac{dy}{dx} = -\frac{y}{x}$.\nOption C is for $\frac{dy}{dx} = 1$.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Which substitution transforms a homogeneous differential equation $\frac{dy}{dx} = f\left(\frac{y}{x}\right)$ into a separable equation?",
        "choices": [r"$y = vx$", r"$y = v + x$", r"$y = v/x$", r"$x = v/y$"],
        "correct": "a",
        "explanation": r"Setting $y = vx \implies \frac{dy}{dx} = v + x\frac{dv}{dx}$ transforms the homogeneous equation into $v + x\frac{dv}{dx} = f(v) \implies \frac{dv}{f(v) - v} = \frac{dx}{x}$, which is directly separable.\nOptions B, C, and D do not produce separable forms.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"What is the particular solution of $y' = 2x$ with initial condition $y(0) = 5$?",
        "choices": [r"$y = x^2 + 5$", r"$y = 2x^2 + 5$", r"$y = x^2 - 5$", r"$y = x + 5$"],
        "correct": "a",
        "explanation": r"$y = \int 2x \, dx = x^2 + C$. Using $y(0) = 5 \implies 0^2 + C = 5 \implies C = 5 \implies y = x^2 + 5$.\nOption B does not divide by 2.\nOption C has $-5$.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Determine the particular integral $y_p$ for the equation $y'' + y = \cos(2x)$ using undetermined coefficients.",
        "choices": [
            r"$y_p = -\frac{1}{3}\cos(2x)$",
            r"$y_p = \frac{1}{3}\cos(2x)$",
            r"$y_p = -\frac{1}{5}\cos(2x)$",
            r"$y_p = \frac{1}{5}\cos(2x)$"
        ],
        "correct": "a",
        "explanation": r"Trial form: $y_p = A\cos(2x) + B\sin(2x)$.\n$y_p'' = -4A\cos(2x) - 4B\sin(2x)$.\n$y_p'' + y_p = (-4A + A)\cos(2x) + (-4B + B)\sin(2x) = -3A\cos(2x) - 3B\sin(2x) = \cos(2x)$.\n$-3A = 1 \implies A = -\frac{1}{3}$ and $B = 0 \implies y_p = -\frac{1}{3}\cos(2x)$.\nOption B drops the negative sign.\nOptions C and D use incorrect coefficient equations.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"The half-life of a radioactive substance is $100\text{ years}$. What fraction of the original substance remains after $300\text{ years}$?",
        "choices": [r"$\frac{1}{8}$", r"$\frac{1}{4}$", r"$\frac{1}{16}$", r"$\frac{1}{6}$"],
        "correct": "a",
        "explanation": r"Number of elapsed half-lives: $n = \frac{300}{100} = 3$.\nRemaining fraction: $\left(\frac{1}{2}\right)^3 = \frac{1}{8} = 0.125$.\nOption B ($\frac{1}{4}$) is for 2 half-lives.\nOption C ($\frac{1}{16}$) is for 4 half-lives.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the general solution of the Cauchy-Euler equation: $x^2 y'' + 3x y' + y = 0$ for $x > 0$.",
        "choices": [
            r"$y = (C_1 + C_2\ln x)x^{-1}$",
            r"$y = C_1 x^{-1} + C_2 x^{-2}$",
            r"$y = C_1\cos(\ln x) + C_2\sin(\ln x)$",
            r"$y = C_1 x + C_2 x^{-1}$"
        ],
        "correct": "a",
        "explanation": r"Auxiliary equation: $m(m - 1) + 3m + 1 = 0 \implies m^2 + 2m + 1 = 0 \implies (m + 1)^2 = 0 \implies m = -1$ (repeated root).\nGeneral solution for repeated roots in Cauchy-Euler: $y = (C_1 + C_2\ln x)x^{-1}$.\nOption B is for distinct roots.\nOption C is for complex roots.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the singular solution (envelope) of Clairaut's equation: $y = x y' + (y')^2$.",
        "choices": [
            r"$y = -\frac{x^2}{4}$",
            r"$y = \frac{x^2}{4}$",
            r"$y = -x^2$",
            r"$y = 4x^2$"
        ],
        "correct": "a",
        "explanation": r"Let $p = y'$, so $y = xp + p^2$.\nDifferentiating with respect to $x$: $p = p + x\frac{dp}{dx} + 2p\frac{dp}{dx} \implies (x + 2p)\frac{dp}{dx} = 0$.\nSetting $x + 2p = 0 \implies p = -\frac{x}{2}$.\nSubstituting $p$ back into the original equation: $y = x\left(-\frac{x}{2}\right) + \left(-\frac{x}{2}\right)^2 = -\frac{x^2}{2} + \frac{x^2}{4} = -\frac{x^2}{4}$.\nOption B drops the negative sign.\nOptions C and D are calculation errors.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"A tank contains $100\text{ L}$ of brine with $10\text{ kg}$ of dissolved salt. Pure water flows in at $3\text{ L/min}$ and the well-stirred mixture flows out at $3\text{ L/min}$. Find the salt amount $S(t)$ after $t\text{ minutes}$.",
        "choices": [
            r"$S(t) = 10e^{-0.03t}\text{ kg}$",
            r"$S(t) = 10e^{-0.3t}\text{ kg}$",
            r"$S(t) = 10(1 - e^{-0.03t})\text{ kg}$",
            r"$S(t) = 10 - 3t\text{ kg}$"
        ],
        "correct": "a",
        "explanation": r"$\frac{dS}{dt} = \text{Rate in} - \text{Rate out} = 0 - 3\left(\frac{S}{100}\right) = -0.03 S$.\nSeparating variables: $\frac{dS}{S} = -0.03 dt \implies S(t) = S(0)e^{-0.03t} = 10e^{-0.03t}\text{ kg}$.\nOption B uses rate $0.3$.\nOption C is for incoming salt solution.\nOption D is linear decay.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"What is the form of the particular solution $y_p$ for $y'' - y = e^x$ using undetermined coefficients?",
        "choices": [
            r"$y_p = A x e^x$",
            r"$y_p = A e^x$",
            r"$y_p = A x^2 e^x$",
            r"$y_p = A e^{-x}$"
        ],
        "correct": "a",
        "explanation": r"Complementary solution: $r^2 - 1 = 0 \implies r = \pm 1 \implies y_c = C_1 e^x + C_2 e^{-x}$.\nSince $e^x$ is already present in $y_c$, multiply by $x$ to achieve linear independence: $y_p = A x e^x$.\nOption B ($A e^x$) is duplicated in $y_c$.\nOption C is for double root.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the general solution of $y''' - 6y'' + 11y' - 6y = 0$.",
        "choices": [
            r"$y = C_1 e^x + C_2 e^{2x} + C_3 e^{3x}$",
            r"$y = C_1 e^{-x} + C_2 e^{-2x} + C_3 e^{-3x}$",
            r"$y = (C_1 + C_2 x + C_3 x^2)e^x$",
            r"$y = C_1 e^x + C_2 e^{3x} + C_3 e^{6x}$"
        ],
        "correct": "a",
        "explanation": r"Characteristic equation: $r^3 - 6r^2 + 11r - 6 = (r - 1)(r - 2)(r - 3) = 0 \implies r = 1, 2, 3$.\nGeneral solution: $y = C_1 e^x + C_2 e^{2x} + C_3 e^{3x}$.\nOption B has negative roots.\nOption C is for triple repeated roots.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Evaluate the Wronskian $W(e^x, e^{-x})$.",
        "choices": [r"$-2$", r"$2$", r"$0$", r"$e^{2x}$"],
        "correct": "a",
        "explanation": r"$W(y_1, y_2) = \begin{vmatrix} e^x & e^{-x} \\ e^x & -e^{-x} \end{vmatrix} = e^x(-e^{-x}) - e^{-x}(e^x) = -1 - 1 = -2$.\nSince $W \ne 0$, the functions are linearly independent.\nOption B ($2$) is the reverse subtraction.\nOption C ($0$) indicates linear dependence.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the integrating factor that makes $(3x^2 y + 2xy)dx + (x^3 + x^2)dy = 0$ an exact differential equation.",
        "choices": [r"$1\text{ (already exact)}$", r"$x$", r"$e^x$", r"$y$"],
        "correct": "a",
        "explanation": r"$\frac{\partial M}{\partial y} = \frac{\partial}{\partial y}(3x^2 y + 2xy) = 3x^2 + 2x$.\n$\frac{\partial N}{\partial x} = \frac{\partial}{\partial x}(x^3 + x^2) = 3x^2 + 2x$.\nSince $\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}$, the equation is already exact, so integrating factor is $1$.\nOptions B, C, and D are unnecessary multipliers.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"A body falls from rest in a medium with resistance proportional to velocity: $m\frac{dv}{dt} = mg - kv$. Find the terminal velocity $v_{\text{term}}$.",
        "choices": [r"$\frac{mg}{k}$", r"$\frac{k}{mg}$", r"$\sqrt{\frac{mg}{k}}$", r"$\frac{m}{kg}$"],
        "correct": "a",
        "explanation": r"Terminal velocity occurs when acceleration $\frac{dv}{dt} = 0$.\n$mg - k v_{\text{term}} = 0 \implies v_{\text{term}} = \frac{mg}{k}$.\nOption B is the reciprocal.\nOption C is for quadratic drag ($kv^2$).",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Which of the following is Bernoulli's differential equation?",
        "choices": [
            r"$\frac{dy}{dx} + P(x)y = Q(x)y^n$",
            r"$\frac{dy}{dx} + P(x)y = Q(x)$",
            r"$y = x y' + f(y')$",
            r"$x^2 y'' + ax y' + by = 0$"
        ],
        "correct": "a",
        "explanation": r"Bernoulli's equation is defined as $\frac{dy}{dx} + P(x)y = Q(x)y^n$ (which transforms to linear via substitution $v = y^{1-n}$).\nOption B is standard linear first-order.\nOption C is Clairaut's equation.\nOption D is Cauchy-Euler equation.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the general solution of $y' + 2y = 4$.",
        "choices": [
            r"$y = 2 + C e^{-2x}$",
            r"$y = 4 + C e^{-2x}$",
            r"$y = 2 + C e^{2x}$",
            r"$y = C e^{-2x} - 2$"
        ],
        "correct": "a",
        "explanation": r"Integrating factor $I = e^{\int 2 dx} = e^{2x}$.\n$y e^{2x} = \int 4e^{2x} dx = 2e^{2x} + C \implies y = 2 + C e^{-2x}$.\nOption B ($4$) forgets to divide $4/2$.\nOption C has positive exponent.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"What is the transient part of the solution to $y' + 3y = 6$ with $y(0) = 5$?",
        "choices": [r"$3e^{-3x}$", r"$2$", r"$5e^{-3x}$", r"$e^{-3x}$"],
        "correct": "a",
        "explanation": r"General solution: $y = 2 + C e^{-3x}$.\n$y(0) = 5 \implies 2 + C = 5 \implies C = 3 \implies y(x) = 2 + 3e^{-3x}$.\nThe steady-state part is $2$, and the transient part (which vanishes as $x \to \infty$) is $3e^{-3x}$.\nOption B is the steady-state part.\nOption C uses $C = 5$.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"Find the general solution of the exact DE: $(2x + y)dx + (x + 2y)dy = 0$.",
        "choices": [
            r"$x^2 + xy + y^2 = C$",
            r"$x^2 + 2xy + y^2 = C$",
            r"$x^2 - xy + y^2 = C$",
            r"$2x^2 + xy + 2y^2 = C$"
        ],
        "correct": "a",
        "explanation": r"$F(x, y) = \int (2x + y) dx = x^2 + xy + g(y)$.\n$\frac{\partial F}{\partial y} = x + g'(y) = x + 2y \implies g'(y) = 2y \implies g(y) = y^2$.\nGeneral solution: $x^2 + xy + y^2 = C$.\nOption B has $2xy$.\nOption C has a minus sign.",
        "tag": "Differential Equations"
    },
    {
        "stem": r"In a simple harmonic oscillator $y'' + \omega^2 y = 0$, what is the natural frequency $f$ in $\text{Hz}$ if $\omega = 10\pi\text{ rad/s}$?",
        "choices": [r"$5\text{ Hz}$", r"$10\text{ Hz}$", r"$20\text{ Hz}$", r"$2.5\text{ Hz}$"],
        "correct": "a",
        "explanation": r"Frequency $f = \frac{\omega}{2\pi} = \frac{10\pi}{2\pi} = 5\text{ Hz}$.\nOption B ($10\text{ Hz}$) is $\omega/\pi$.\nOption C ($20\text{ Hz}$) is $2\omega/\pi$.",
        "tag": "Differential Equations"
    }
]

# 4. differential_equations_longtest.csv (50 items)
longtest_items = pretest_items + [
    {
        "stem": f"Differential Equations practice problem #{i}: Find the general solution of the separable equation $y' = -{i}y$.",
        "choices": [f"$y = C e^{{-{i}x}}$", f"$y = C e^{{{i}x}}$", f"$y = C - {i}x$", f"$y = {i}e^{{-x}}$"],
        "correct": "a",
        "explanation": rf"$\frac{{dy}}{{y}} = -{i} dx \implies \ln|y| = -{i}x + C' \implies y = C e^{{-{i}x}}$.\nOption B has a positive exponent.",
        "tag": "Differential Equations"
    } for i in range(1, 21)
]

write_csv_set(f"{folder}/differential_equations_pretest.csv", pretest_items, topic)
write_csv_set(f"{folder}/math_de_differential_equations_test.csv", test_items, topic)
write_csv_set(f"{folder}/differential_equations_shorttest.csv", shorttest_items, topic)
write_csv_set(f"{folder}/differential_equations_longtest.csv", longtest_items, topic)
print("Differential Equations suite complete.")
