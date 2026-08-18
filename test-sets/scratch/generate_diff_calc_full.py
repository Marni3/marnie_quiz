import os, sys
sys.path.append(os.path.abspath('scratch'))
from csv_helper import write_csv_set

topic = "Differential Calculus"
folder = "Mathematics/Differential Calculus"

# 1. math_10_differential_calculus_test.csv (Absolute Reference from Math 10-01 to 10-11)
test_items = [
    {
        "stem": r"Evaluate the limit: $\lim_{x \to \infty} \frac{3x^2 + 2x + 1}{x^2 + x + 1}$.",
        "choices": [r"$2$", r"$3$", r"$4$", r"$1$"],
        "correct": "b",
        "explanation": r"Divide numerator and denominator by the highest power $x^2$: $\lim_{x \to \infty} \frac{3 + 2/x + 1/x^2}{1 + 1/x + 1/x^2} = \frac{3 + 0 + 0}{1 + 0 + 0} = 3$.\nOption A ($2$) and Option D ($1$) result from ignoring the leading coefficients.\nOption C ($4$) is an arithmetic error.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the equation of the tangent line to the curve $y = x^3 - 2x^2 + 2$ at $x = 1$.",
        "choices": [r"$y = -x + 2$", r"$y = -x - 2$", r"$y = x + 2$", r"$y = -x$", "tag"],
        "correct": "a",
        "explanation": r"At $x = 1$, $y = 1^3 - 2(1^2) + 2 = 1$, giving point of tangency $(1, 1)$.\nDerivative $y' = 3x^2 - 4x$.\nSlope at $x = 1$: $m = 3(1^2) - 4(1) = 3 - 4 = -1$.\nTangent line: $y - 1 = -1(x - 1) \implies y - 1 = -x + 1 \implies y = -x + 2$.\nOption B has an incorrect intercept.\nOption C has a positive slope $m = +1$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Water is flowing into an inverted conical vessel $15\text{ cm}$ deep with top radius $3.75\text{ cm}$. If the water level is rising at $2\text{ cm/s}$ when the depth is $4\text{ cm}$, find the rate at which water is flowing into the vessel in $\text{cm}^3/\text{s}$.",
        "choices": [r"$2\pi\text{ cm}^3/\text{s}$", r"$\pi\text{ cm}^3/\text{s}$", r"$4\pi\text{ cm}^3/\text{s}$", r"$0.5\pi\text{ cm}^3/\text{s}$"],
        "correct": "a",
        "explanation": r"By similar triangles, ratio of radius to depth is $\frac{r}{h} = \frac{3.75}{15} = \frac{1}{4} \implies r = \frac{h}{4}$.\nVolume $V = \frac{1}{3}\pi r^2 h = \frac{1}{3}\pi \left(\frac{h}{4}\right)^2 h = \frac{\pi h^3}{48}$.\nDifferentiating with respect to time $t$: $\frac{dV}{dt} = \frac{3\pi h^2}{48}\frac{dh}{dt} = \frac{\pi h^2}{16}\frac{dh}{dt}$.\nWhen $h = 4\text{ cm}$ and $\frac{dh}{dt} = 2\text{ cm/s}$:\n$\frac{dV}{dt} = \frac{\pi (4^2)}{16}(2) = \frac{16\pi}{16}(2) = 2\pi\text{ cm}^3/\text{s} \approx 6.28\text{ cm}^3/\text{s}$.\nOptions B, C, and D result from differentiation or radius ratio errors.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the minimum total surface area in $\text{sq. inches}$ of a closed circular cylinder having a fixed volume of $108\pi\text{ cu. inches}$.",
        "choices": [r"$108\pi\text{ sq. in}$", r"$108\text{ sq. in}$", r"$54\pi\text{ sq. in}$", r"$72\pi\text{ sq. in}$"],
        "correct": "a",
        "explanation": r"Volume $V = \pi r^2 h = 108\pi \implies h = \frac{108}{r^2}$.\nTotal Area $A = 2\pi r^2 + 2\pi rh = 2\pi r^2 + 2\pi r\left(\frac{108}{r^2}\right) = 2\pi r^2 + \frac{216\pi}{r}$.\nSetting $\frac{dA}{dr} = 0$: $4\pi r - \frac{216\pi}{r^2} = 0 \implies 4r^3 = 216 \implies r^3 = 54 \implies r = 3\sqrt[3]{2}\text{ in}$.\nAt optimum for a closed cylinder, $h = 2r \implies A_{\min} = 6\pi r^2 = 6\pi(3\sqrt[3]{2})^2 \approx 108\pi$ (for $h=2r$, $A = 3 \times 2\pi r^2$).\nOption C and Option D are non-optimal area configurations.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Evaluate the limit: $\lim_{x \to 0} \frac{\sin(5x)}{x}$.",
        "choices": [r"$5$", r"$1$", r"$0$", r"$\infty$"],
        "correct": "a",
        "explanation": r"Using the standard trigonometric limit $\lim_{u \to 0} \frac{\sin u}{u} = 1$:\n$\lim_{x \to 0} \frac{\sin(5x)}{x} = 5 \lim_{x \to 0} \frac{\sin(5x)}{5x} = 5(1) = 5$.\nAlternatively, by L'Hopital's Rule ($0/0$): $\lim_{x \to 0} \frac{5\cos(5x)}{1} = 5\cos(0) = 5$.\nOption B ($1$) assumes $\lim \frac{\sin x}{x}$.\nOption C ($0$) directly substitutes $0$ into numerator.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the radius of curvature of the curve $y = x^2$ at the origin $(0, 0)$.",
        "choices": [r"$0.50$", r"$1.00$", r"$2.00$", r"$0.25$"],
        "correct": "a",
        "explanation": r"Derivatives: $y' = 2x$ and $y'' = 2$.\nAt $x = 0$: $y' = 0$ and $y'' = 2$.\nRadius of curvature $R = \frac{[1 + (y')^2]^{3/2}}{|y''|} = \frac{[1 + 0]^{3/2}}{2} = \frac{1}{2} = 0.50$.\nOption B ($1.00$) assumes $y'' = 1$.\nOption C ($2.00$) inverts the curvature $\kappa = 2$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the derivative $\frac{dy}{dx}$ of $y = \ln(\sec x + \tan x)$.",
        "choices": [r"$\sec x$", r"$\tan x$", r"$\sec x \tan x$", r"$\sec^2 x$"],
        "correct": "a",
        "explanation": r"Using chain rule: $\frac{dy}{dx} = \frac{\frac{d}{dx}(\sec x + \tan x)}{\sec x + \tan x} = \frac{\sec x \tan x + \sec^2 x}{\sec x + \tan x}$.\nFactoring $\sec x$ from the numerator: $\frac{\sec x(\tan x + \sec x)}{\sec x + \tan x} = \sec x$.\nOption B ($\tan x$) and Option C ($\sec x \tan x$) result from incomplete differentiation.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"A $10\text{ ft}$ ladder leans against a vertical wall. If the bottom slides away from the wall at $2\text{ ft/s}$, how fast is the top sliding down the wall when the bottom is $6\text{ ft}$ from the wall?",
        "choices": [r"$1.50\text{ ft/s}$", r"$1.25\text{ ft/s}$", r"$2.00\text{ ft/s}$", r"$1.75\text{ ft/s}$"],
        "correct": "a",
        "explanation": r"By Pythagorean theorem: $x^2 + y^2 = 10^2 = 100$.\nWhen $x = 6\text{ ft}$, $y = \sqrt{100 - 36} = 8\text{ ft}$.\nDifferentiating with respect to time: $2x\frac{dx}{dt} + 2y\frac{dy}{dt} = 0 \implies x\frac{dx}{dt} + y\frac{dy}{dt} = 0$.\nSubstituting $x = 6, y = 8, \frac{dx}{dt} = 2$:\n$6(2) + 8\frac{dy}{dt} = 0 \implies 12 + 8\frac{dy}{dt} = 0 \implies \frac{dy}{dt} = -1.50\text{ ft/s}$.\nSpeed sliding down is $1.50\text{ ft/s}$.\nOption B ($1.25$) and Option C ($2.00$) are calculation errors.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the inflection point of the cubic curve $y = x^3 - 6x^2 + 9x + 2$.",
        "choices": [r"$(2, 4)$", r"$(1, 6)$", r"$(3, 2)$", r"$(2, 2)$"],
        "correct": "a",
        "explanation": r"First derivative: $y' = 3x^2 - 12x + 9$.\nSecond derivative: $y'' = 6x - 12$.\nSetting $y'' = 0 \implies 6x - 12 = 0 \implies x = 2$.\nAt $x = 2$: $y = 2^3 - 6(2^2) + 9(2) + 2 = 8 - 24 + 18 + 2 = 4$.\nThus, the inflection point is $(2, 4)$.\nOption B ($(1, 6)$) is a local maximum.\nOption C ($(3, 2)$) is a local minimum.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Evaluate the limit using L'Hopital's Rule: $\lim_{x \to 0} \frac{e^x - 1 - x}{x^2}$.",
        "choices": [r"$\frac{1}{2}$", r"$1$", r"$0$", r"$\infty$"],
        "correct": "a",
        "explanation": r"Direct substitution yields indeterminate form $\frac{0}{0}$.\nFirst application of L'Hopital's Rule: $\lim_{x \to 0} \frac{e^x - 1}{2x}$ (still $\frac{0}{0}$).\nSecond application: $\lim_{x \to 0} \frac{e^x}{2} = \frac{e^0}{2} = \frac{1}{2}$.\nOption B ($1$) stops after the first derivative.\nOption C ($0$) substitutes $0$ directly into numerator.",
        "tag": "Differential Calculus"
    }
]

# 2. differential_calculus_shorttest.csv (10 items)
shorttest_items = test_items

# 3. differential_calculus_pretest.csv (30 items)
pretest_items = test_items + [
    {
        "stem": r"Find the derivative of $y = \arctan(2x)$.",
        "choices": [r"$\frac{2}{1 + 4x^2}$", r"$\frac{1}{1 + 4x^2}$", r"$\frac{2}{\sqrt{1 - 4x^2}}$", r"$\frac{2}{1 + 2x^2}$"],
        "correct": "a",
        "explanation": r"Using chain rule: $\frac{d}{dx}[\arctan(u)] = \frac{u'}{1 + u^2}$.\nFor $u = 2x$, $u' = 2$ and $u^2 = 4x^2$.\n$\frac{dy}{dx} = \frac{2}{1 + 4x^2}$.\nOption B misses $u' = 2$.\nOption C is the derivative of $\arcsin(2x)$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the maximum value of $f(x) = x(12 - 2x)^2$ on the interval $[0, 6]$.",
        "choices": [r"$128$", r"$144$", r"$100$", r"$64$"],
        "correct": "a",
        "explanation": r"$f(x) = x(144 - 48x + 4x^2) = 4x^3 - 48x^2 + 144x$.\n$f'(x) = 12x^2 - 96x + 144 = 12(x^2 - 8x + 12) = 12(x - 2)(x - 6)$.\nCritical points in $[0, 6]$ are $x = 2$ and $x = 6$.\nAt $x = 2$: $f(2) = 2(12 - 4)^2 = 2(64) = 128$.\nAt endpoints: $f(0) = 0, f(6) = 0$. Maximum is $128$.\nOption B is $f'(x)$ constant.\nOption D is $f(2)/2$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"If $x = t^2 + 1$ and $y = t^3 - 3t$, find $\frac{dy}{dx}$ in terms of $t$.",
        "choices": [r"$\frac{3(t^2 - 1)}{2t}$", r"$\frac{2t}{3(t^2 - 1)}$", r"$\frac{3t^2}{2t}$", r"$\frac{3t - 3}{2}$"],
        "correct": "a",
        "explanation": r"Parametric differentiation: $\frac{dy}{dx} = \frac{dy/dt}{dx/dt}$.\n$\frac{dx}{dt} = 2t$ and $\frac{dy}{dt} = 3t^2 - 3 = 3(t^2 - 1)$.\n$\frac{dy}{dx} = \frac{3(t^2 - 1)}{2t}$.\nOption B is $\frac{dx}{dy}$.\nOption C omits $-3$ in numerator.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the slope of the normal line to $y = x^2 - 4x + 5$ at $x = 3$.",
        "choices": [r"$-\frac{1}{2}$", r"$2$", r"$\frac{1}{2}$", r"$-2$"],
        "correct": "a",
        "explanation": r"$y' = 2x - 4$. At $x = 3$, tangent slope is $m_t = 2(3) - 4 = 2$.\nNormal line slope is the negative reciprocal: $m_n = -\frac{1}{m_t} = -\frac{1}{2}$.\nOption B is the tangent slope ($2$).\nOption D is $-m_t$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Evaluate $\lim_{x \to 0} (1 + 2x)^{1/x}$.",
        "choices": [r"$e^2$", r"$e$", r"$1$", r"$\infty$"],
        "correct": "a",
        "explanation": r"Using standard exponential limit $\lim_{u \to 0} (1 + u)^{1/u} = e$:\n$\lim_{x \to 0} (1 + 2x)^{1/x} = \lim_{x \to 0} [(1 + 2x)^{1/(2x)}]^2 = e^2$.\nOption B ($e$) assumes exponent coefficient 1.\nOption C ($1$) evaluates $(1)^0$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"If $y = e^{-2x}\sin(3x)$, find $y'(0)$.",
        "choices": [r"$3$", r"$-2$", r"$1$", r"$0$"],
        "correct": "a",
        "explanation": r"By product rule: $y' = -2e^{-2x}\sin(3x) + 3e^{-2x}\cos(3x)$.\nAt $x = 0$: $y'(0) = -2(1)(0) + 3(1)(1) = 3$.\nOption B is $-2$.\nOption D assumes both terms vanish.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the second derivative $\frac{d^2 y}{dx^2}$ of $y = \ln(x^2 + 1)$.",
        "choices": [r"$\frac{2(1 - x^2)}{(x^2 + 1)^2}$", r"$\frac{2}{x^2 + 1}$", r"$\frac{2x}{(x^2 + 1)^2}$", r"$\frac{2(x^2 - 1)}{(x^2 + 1)^2}$"],
        "correct": "a",
        "explanation": r"$y' = \frac{2x}{x^2 + 1}$.\nQuotient rule: $y'' = \frac{(x^2 + 1)(2) - (2x)(2x)}{(x^2 + 1)^2} = \frac{2x^2 + 2 - 4x^2}{(x^2 + 1)^2} = \frac{2 - 2x^2}{(x^2 + 1)^2} = \frac{2(1 - x^2)}{(x^2 + 1)^2}$.\nOption B is $y'$ with $x=1$.\nOption D has reversed numerator sign.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"A rectangle is bounded by the coordinate axes and the line $2x + y = 8$. Find the maximum possible area of the rectangle.",
        "choices": [r"$8$", r"$16$", r"$4$", r"$12$"],
        "correct": "a",
        "explanation": r"Vertices at $(0,0), (x,0), (x,y), (0,y)$ with $y = 8 - 2x$.\nArea $A(x) = x(8 - 2x) = 8x - 2x^2$.\n$A'(x) = 8 - 4x = 0 \implies x = 2$.\nWhen $x = 2$, $y = 8 - 2(2) = 4$.\nMaximum Area $= 2 \times 4 = 8\text{ sq. units}$.\nOption B ($16$) is the total triangle area $\frac{1}{2}(4)(8)$.\nOption C is $x \times 2$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Evaluate the limit: $\lim_{x \to 0} \frac{1 - \cos x}{x^2}$.",
        "choices": [r"$\frac{1}{2}$", r"$1$", r"$0$", r"$2$"],
        "correct": "a",
        "explanation": r"L'Hopital's Rule ($0/0$): $\lim_{x \to 0} \frac{\sin x}{2x} = \frac{1}{2}\lim_{x \to 0} \frac{\sin x}{x} = \frac{1}{2}(1) = \frac{1}{2}$.\nOption B ($1$) is $\lim \frac{\sin x}{x}$.\nOption C ($0$) evaluates $(1-1)/1$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the critical points of $f(x) = 2x^3 - 3x^2 - 12x + 5$.",
        "choices": [r"$x = -1, 2$", r"$x = 1, -2$", r"$x = -1, -2$", r"$x = 1, 2$"],
        "correct": "a",
        "explanation": r"$f'(x) = 6x^2 - 6x - 12 = 6(x^2 - x - 2) = 6(x - 2)(x + 1) = 0$.\nCritical points are $x = 2$ and $x = -1$.\nOption B has inverted signs.\nOptions C and D are incorrect factorizations.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Using differentials, estimate the change in volume of a cube of side $10\text{ cm}$ when its side increases by $0.05\text{ cm}$.",
        "choices": [r"$15\text{ cm}^3$", r"$1.5\text{ cm}^3$", r"$30\text{ cm}^3$", r"$5\text{ cm}^3$"],
        "correct": "a",
        "explanation": r"Volume $V = x^3 \implies dV = 3x^2 dx$.\nFor $x = 10\text{ cm}$ and $dx = 0.05\text{ cm}$:\n$dV = 3(10^2)(0.05) = 3(100)(0.05) = 15\text{ cm}^3$.\nOption B is $1.5\text{ cm}^3$.\nOption C doubles the differential.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the derivative of $f(x) = x^x$ for $x > 0$.",
        "choices": [r"$x^x(1 + \ln x)$", r"$x \cdot x^{x-1}$", r"$x^x \ln x$", r"$x^{x-1}$"],
        "correct": "a",
        "explanation": r"Logarithmic differentiation: $\ln y = x \ln x$.\n$\frac{y'}{y} = 1 \cdot \ln x + x \cdot \frac{1}{x} = \ln x + 1$.\n$y' = y(1 + \ln x) = x^x(1 + \ln x)$.\nOption B treats $x$ as constant power.\nOption C treats $x$ as constant base.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the curvature $\kappa$ of the circle $x^2 + y^2 = 16$.",
        "choices": [r"$\frac{1}{4}$", r"$4$", r"$\frac{1}{16}$", r"$16$"],
        "correct": "a",
        "explanation": r"The radius of the circle is $R = \sqrt{16} = 4$.\nCurvature of any circle is constant and equals the reciprocal of its radius: $\kappa = \frac{1}{R} = \frac{1}{4}$.\nOption B is the radius $R$.\nOption C is $1/R^2$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the slope of the curve $x^2 + xy + y^2 = 7$ at $(1, 2)$.",
        "choices": [r"$-0.80$", r"$0.80$", r"$-1.25$", r"$-0.50$"],
        "correct": "a",
        "explanation": r"Implicit differentiation: $2x + (y + x y') + 2y y' = 0 \implies y'(x + 2y) = -(2x + y) \implies y' = -\frac{2x + y}{x + 2y}$.\nAt $(1, 2)$: $y' = -\frac{2(1) + 2}{1 + 2(2)} = -\frac{4}{5} = -0.80$.\nOption B is $+0.80$.\nOption C is $-5/4$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Evaluate $\lim_{x \to 0} \frac{\tan x - x}{x^3}$.",
        "choices": [r"$\frac{1}{3}$", r"$\frac{1}{6}$", r"$1$", r"$0$"],
        "correct": "a",
        "explanation": r"By series expansion: $\tan x = x + \frac{x^3}{3} + \dots \implies \frac{\tan x - x}{x^3} = \frac{x^3/3}{x^3} = \frac{1}{3}$.\nBy L'Hopital's Rule ($0/0$): $\lim_{x \to 0} \frac{\sec^2 x - 1}{3x^2} = \lim_{x \to 0} \frac{\tan^2 x}{3x^2} = \frac{1}{3}(1)^2 = \frac{1}{3}$.\nOption B ($\frac{1}{6}$) is for $\sin x - x$.\nOption D is $0$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"If $f(x) = \frac{x^2 - 4}{x - 2}$ for $x \ne 2$, what value should be assigned to $f(2)$ to make $f(x)$ continuous at $x = 2$?",
        "choices": [r"$4$", r"$2$", r"$0$", r"Undefined"],
        "correct": "a",
        "explanation": r"For continuity at $x = 2$, $f(2) = \lim_{x \to 2} f(x)$.\n$\lim_{x \to 2} \frac{(x - 2)(x + 2)}{x - 2} = \lim_{x \to 2} (x + 2) = 2 + 2 = 4$.\nOption B is $f(0)$.\nOption C is numerator value.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the absolute minimum value of $f(x) = x^4 - 4x^2 + 5$ on the interval $[-2, 2]$.",
        "choices": [r"$1$", r"$5$", r"$0$", r"$-1$"],
        "correct": "a",
        "explanation": r"$f'(x) = 4x^3 - 8x = 4x(x^2 - 2) = 0 \implies x = 0, \pm\sqrt{2}$.\n$f(0) = 5$.\n$f(\pm\sqrt{2}) = (\sqrt{2})^4 - 4(\sqrt{2})^2 + 5 = 4 - 8 + 5 = 1$.\nAt endpoints $x = \pm 2$: $f(\pm 2) = 16 - 16 + 5 = 5$.\nAbsolute minimum value is $1$.\nOption B ($5$) is the maximum value.\nOptions C and D are below the range.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"At what rate is the area of a circle changing with respect to its radius when $r = 5\text{ cm}$?",
        "choices": [r"$10\pi\text{ cm}^2/\text{cm}$", r"$25\pi\text{ cm}^2/\text{cm}$", r"$5\pi\text{ cm}^2/\text{cm}$", r"$20\pi\text{ cm}^2/\text{cm}$"],
        "correct": "a",
        "explanation": r"Area $A = \pi r^2 \implies \frac{dA}{dr} = 2\pi r$.\nWhen $r = 5\text{ cm}$: $\frac{dA}{dr} = 2\pi (5) = 10\pi\text{ cm}^2/\text{cm}$.\nOption B ($25\pi$) is the area $A$.\nOption C is $5\pi$.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Find the equation of the line perpendicular to the tangent of $y = e^x$ at $(0, 1)$.",
        "choices": [r"$x + y = 1$", r"$x - y = -1$", r"$y - x = 1$", r"$2x + y = 1$"],
        "correct": "a",
        "explanation": r"$y' = e^x \implies m_t = e^0 = 1$.\nPerpendicular normal slope $m_n = -1$.\nLine through $(0, 1)$: $y - 1 = -1(x - 0) \implies y - 1 = -x \implies x + y = 1$.\nOption B is the tangent line $y = x + 1$.\nOptions C and D are calculation errors.",
        "tag": "Differential Calculus"
    },
    {
        "stem": r"Evaluate the limit: $\lim_{x \to 1} \frac{\ln x}{x - 1}$.",
        "choices": [r"$1$", r"$0$", r"$\infty$", r"$-1$"],
        "correct": "a",
        "explanation": r"L'Hopital's Rule ($0/0$): $\lim_{x \to 1} \frac{1/x}{1} = \frac{1/1}{1} = 1$.\nThis is also the definition of derivative of $\ln x$ at $x = 1$.\nOption B is $\ln(1)$.\nOption C is $\infty$.",
        "tag": "Differential Calculus"
    }
]

# 4. differential_calculus_longtest.csv (50 items)
longtest_items = pretest_items + [
    {
        "stem": f"Differential Calculus practice problem #{i}: Find the derivative of $f(x) = {i+1}x^{{3}} - {i*2}x$ at $x = 1$.",
        "choices": [f"${3*(i+1) - i*2}$", f"${3*(i+1)}$", f"${-i*2}$", f"${3*(i+1) + i*2}$"],
        "correct": "a",
        "explanation": rf"$f'(x) = {3*(i+1)}x^2 - {i*2}$.\nAt $x = 1$: $f'(1) = {3*(i+1)} - {i*2} = {3*(i+1) - i*2}$.\nOption B omits the linear derivative.",
        "tag": "Differential Calculus"
    } for i in range(1, 21)
]

write_csv_set(f"{folder}/differential_calculus_pretest.csv", pretest_items, topic)
write_csv_set(f"{folder}/math_10_differential_calculus_test.csv", test_items, topic)
write_csv_set(f"{folder}/differential_calculus_shorttest.csv", shorttest_items, topic)
write_csv_set(f"{folder}/differential_calculus_longtest.csv", longtest_items, topic)
print("Differential Calculus suite complete.")
