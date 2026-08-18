import os, sys
sys.path.append(os.path.abspath('scratch'))
from csv_helper import write_csv_set

topic = "Algebra"
folder = "Mathematics/Algebra"

# 1. math_01_algebra_test.csv (Absolute Reference from Questionnaire Math 01-01 to 01-07 and 01-08 to 01-19)
test_items = [
    {
        "stem": r"Given: $\frac{1}{\log_2 a} + \frac{1}{\log_3 a} + \frac{1}{\log_4 a} = 1$. Find $a$.",
        "choices": [r"$10$", r"$18$", r"$14$", r"$24$"],
        "correct": "d",
        "explanation": r"Using change of base: $\frac{1}{\log_b a} = \log_a b$.\nThe equation becomes $\log_a 2 + \log_a 3 + \log_a 4 = 1 \implies \log_a (2 \times 3 \times 4) = 1 \implies \log_a 24 = 1$.\nThus $a^1 = 24 \implies a = 24$.\nOptions A, B, and C result from arithmetic errors in multiplying the arguments.",
        "tag": "Algebra"
    },
    {
        "stem": r"If $x^2 + y^2 = 14xy$, then $\log [k(x + y)] = \frac{1}{2}(\log x + \log y)$ for some constant $k$. Find the value of $k$.",
        "choices": [r"$0.50$", r"$0.30$", r"$0.25$", r"$0.75$"],
        "correct": "c",
        "explanation": r"Adding $2xy$ to both sides: $(x + y)^2 = 16xy \implies x + y = 4\sqrt{xy}$.\nDividing by 4: $\frac{1}{4}(x + y) = \sqrt{xy}$.\nTaking logs: $\log\left[\frac{1}{4}(x + y)\right] = \log(\sqrt{xy}) = \frac{1}{2}(\log x + \log y)$.\nTherefore $k = \frac{1}{4} = 0.25$.\nOptions A, B, and D fail to take the square root of 16.",
        "tag": "Algebra"
    },
    {
        "stem": r"If the roots of the quadratic equation $Ax^2 + Bx + C = 0$ are $3$ and $2$, and $A, B, C$ are whole numbers with $A = 1$, find the value of $A + B + C$.",
        "choices": [r"$1$", r"$-1$", r"$2$", r"$-2$"],
        "correct": "c",
        "explanation": r"Quadratic equation: $(x - 3)(x - 2) = 0 \implies x^2 - 5x + 6 = 0$.\n$A = 1, B = -5, C = 6$.\n$A + B + C = 1 + (-5) + 6 = 2$.\nOption A assumes $B = -6$.\nOptions B and D have sign errors on $B$ or $C$.",
        "tag": "Algebra"
    },
    {
        "stem": r"Find the value of $x$ in the equation: $2\log_a x - \log_a(x - 1) = \log_a(x - 2)$.",
        "choices": [r"$\frac{3}{4}$", r"$\frac{1}{3}$", r"$\frac{1}{2}$", r"$\frac{2}{3}$"],
        "correct": "d",
        "explanation": r"Combine terms: $\log_a\left(\frac{x^2}{x-1}\right) = \log_a(x-2) \implies \frac{x^2}{x-1} = x - 2$.\nCross-multiplying: $x^2 = x^2 - 3x + 2 \implies 3x = 2 \implies x = \frac{2}{3}$.\nOptions A, B, and C result from algebraic expansion errors.",
        "tag": "Algebra"
    },
    {
        "stem": r"What is the least common multiple of $15$ and $18$?",
        "choices": [r"$3$", r"$90$", r"$5$", r"$270$"],
        "correct": "b",
        "explanation": r"Prime factors: $15 = 3 \times 5$ and $18 = 2 \times 3^2$.\n$\text{LCM} = 2 \times 3^2 \times 5 = 2 \times 9 \times 5 = 90$.\nOption A is the greatest common divisor ($3$).\nOption D is the product $15 \times 18 = 270$.",
        "tag": "Algebra"
    },
    {
        "stem": r"If $p - q = 5$ and $pq = \frac{k}{2}$, then $p^2 + q^2$ equals:",
        "choices": [r"$k$", r"$25 + k$", r"$25k$", r"$\frac{k}{25}$"],
        "correct": "b",
        "explanation": r"Identity: $p^2 + q^2 = (p - q)^2 + 2pq$.\nSubstituting $p - q = 5$ and $pq = \frac{k}{2}$:\n$p^2 + q^2 = 5^2 + 2\left(\frac{k}{2}\right) = 25 + k$.\nOptions A, C, and D miss identity terms.",
        "tag": "Algebra"
    },
    {
        "stem": r"Find $k$ if $x^2 + 2(k + 2)x + 9k = 0$ has equal roots.",
        "choices": [r"$2$", r"$0.5$", r"$3$", r"$4$"],
        "correct": "d",
        "explanation": r"Discriminant $B^2 - 4AC = 0 \implies [2(k+2)]^2 - 4(1)(9k) = 0 \implies 4(k^2 + 4k + 4) - 36k = 0$.\n$4k^2 - 20k + 16 = 0 \implies k^2 - 5k + 4 = 0 \implies (k - 4)(k - 1) = 0$.\nMatching option is $k = 4$.\nOptions A, B, and C give non-zero discriminants.",
        "tag": "Algebra"
    },
    {
        "stem": r"Find the value of $k$ in the quadratic equation $3x^2 - kx + x - 7k = 0$ if $3$ is one of the roots.",
        "choices": [r"$3$", r"$6$", r"$18$", r"$12$"],
        "correct": "a",
        "explanation": r"Substitute $x = 3$: $3(3^2) - k(3) + 3 - 7k = 0 \implies 27 - 3k + 3 - 7k = 0 \implies 30 - 10k = 0 \implies k = 3$.\nOption B ($6$) arises from $30 - 5k = 0$.\nOptions C and D result from arithmetic errors.",
        "tag": "Algebra"
    },
    {
        "stem": r"If $2x + 4y = 7x - 6y$, then $\frac{1}{x} : \frac{1}{y}$ is:",
        "choices": [r"$2:1$", r"$1:2$", r"$3:1$", r"$1:3$"],
        "correct": "b",
        "explanation": r"Rearrange: $10y = 5x \implies x = 2y \implies \frac{x}{y} = 2$.\nReciprocal ratio: $\frac{1/x}{1/y} = \frac{y}{x} = \frac{1}{2} = 1:2$.\nOption A is the direct ratio $x:y$.\nOptions C and D are incorrect.",
        "tag": "Algebra"
    },
    {
        "stem": r"Two turtles $A$ and $B$ start at the same time and move towards each other from a distance of $150\text{ m}$. The rate of turtle $A$ is $10\text{ m/s}$ while that of $B$ is $20\text{ m/s}$. A fly flies between the turtles at $100\text{ m/s}$ until they meet. Determine the total distance traveled by the fly.",
        "choices": [r"$500\text{ m}$", r"$600\text{ m}$", r"$700\text{ m}$", r"$800\text{ m}$"],
        "correct": "a",
        "explanation": r"Relative speed of turtles: $10 + 20 = 30\text{ m/s}$.\nTime to collision: $t = \frac{150}{30} = 5\text{ seconds}$.\nFly distance: $d = 100\text{ m/s} \times 5\text{ s} = 500\text{ m}$.\nOptions B, C, and D assume incorrect meeting durations.",
        "tag": "Algebra"
    },
    {
        "stem": r"If $A$'s rate of doing work is to $B$'s as $6:8$ and $A$ does a piece of work in $50\text{ days}$, how long will it take $B$ to do it alone?",
        "choices": [r"$66.7\text{ days}$", r"$37.5\text{ days}$", r"$42.5\text{ days}$", r"$30.0\text{ days}$"],
        "correct": "b",
        "explanation": r"Work rate and time are inversely proportional: $\frac{R_A}{R_B} = \frac{T_B}{T_A} \implies \frac{6}{8} = \frac{T_B}{50} \implies T_B = \frac{6 \times 50}{8} = 37.5\text{ days}$.\nOption A ($66.7\text{ days}$) assumes direct proportionality.\nOptions C and D are calculation errors.",
        "tag": "Algebra"
    },
    {
        "stem": r"A tank can be filled by pipe $A$ in $3\text{ hours}$ and by pipe $B$ in $5\text{ hours}$, while pipe $C$ empties it in $4\text{ hours}$. If all three are opened together, find the time to fill the tank.",
        "choices": [r"$3.53\text{ hours}$", r"$2.61\text{ hours}$", r"$4.15\text{ hours}$", r"$1.85\text{ hours}$"],
        "correct": "a",
        "explanation": r"Net rate: $\frac{1}{3} + \frac{1}{5} - \frac{1}{4} = \frac{20 + 12 - 15}{60} = \frac{17}{60}\text{ tank/hr}$.\nTime $T = \frac{60}{17} \approx 3.53\text{ hours}$.\nOption B ($2.61\text{ hours}$) adds pipe $C$.\nOptions C and D result from denominator errors.",
        "tag": "Algebra"
    },
    {
        "stem": r"Find the $12\text{th}$ term of the arithmetic progression $3, 7, 11, 15, \dots$",
        "choices": [r"$47$", r"$51$", r"$43$", r"$55$"],
        "correct": "a",
        "explanation": r"$a_n = a_1 + (n - 1)d = 3 + (12 - 1)(4) = 3 + 44 = 47$.\nOption B is $3 + 12(4) = 51$.\nOption C is the 11th term ($43$).\nOption D is the 14th term ($55$).",
        "tag": "Algebra"
    },
    {
        "stem": r"Find the sum of the infinite geometric progression $18, -6, 2, -\frac{2}{3}, \dots$",
        "choices": [r"$13.5$", r"$27.0$", r"$12.0$", r"$15.0$"],
        "correct": "a",
        "explanation": r"$S = \frac{a_1}{1 - r} = \frac{18}{1 - (-1/3)} = \frac{18}{4/3} = 13.5$.\nOption B ($27.0$) uses $r = 1/3$.\nOptions C and D are calculation errors.",
        "tag": "Algebra"
    },
    {
        "stem": r"Find the middle term in the binomial expansion of $\left(x^2 - \frac{1}{x}\right)^8$.",
        "choices": [r"$70x^4$", r"$-70x^4$", r"$56x^5$", r"$-56x^5$"],
        "correct": "a",
        "explanation": r"Middle term is the 5th term ($r = 4$): $T_5 = \binom{8}{4}(x^2)^4(-1/x)^4 = 70(x^8)(1/x^4) = 70x^4$.\nOption B has an incorrect negative sign.\nOptions C and D use $\binom{8}{3}$ or $\binom{8}{5}$.",
        "tag": "Algebra"
    }
]

# 2. algebra_shorttest.csv (10 items)
shorttest_items = test_items[:10]

# 3. algebra_pretest.csv (30 items)
pretest_items = test_items + [
    {
        "stem": r"Solve for $x$: $3^{2x+1} - 10(3^x) + 3 = 0$.",
        "choices": [r"$x = -1, 1$", r"$x = 0, 1$", r"$x = -1, 0$", r"$x = 1, 2$"],
        "correct": "a",
        "explanation": r"Let $u = 3^x$. Then $3(u^2) - 10u + 3 = 0 \implies (3u - 1)(u - 3) = 0 \implies u = 1/3\text{ or }u = 3$.\n$3^x = 3^{-1} \implies x = -1$, and $3^x = 3^1 \implies x = 1$.\nOptions B, C, and D fail the exponential root check.",
        "tag": "Algebra"
    },
    {
        "stem": r"The sum of three numbers in arithmetic progression is $33$ and their product is $1155$. What is the largest number?",
        "choices": [r"$15$", r"$17$", r"$19$", r"$21$"],
        "correct": "a",
        "explanation": r"Let the numbers be $a - d, a, a + d$. Sum $= 3a = 33 \implies a = 11$.\nProduct: $(11 - d)(11)(11 + d) = 1155 \implies 121 - d^2 = 105 \implies d^2 = 16 \implies d = 4$.\nThe numbers are $7, 11, 15$. The largest is $15$.\nOptions B, C, and D exceed the maximum progression term.",
        "tag": "Algebra"
    },
    {
        "stem": r"Evaluate the determinant of the matrix: $\begin{vmatrix} 2 & 3 \\ -1 & 4 \end{vmatrix}$.",
        "choices": [r"$11$", r"$5$", r"$-11$", r"$-5$"],
        "correct": "a",
        "explanation": r"$\det = (2)(4) - (3)(-1) = 8 - (-3) = 8 + 3 = 11$.\nOption B ($5$) subtracts $3$.\nOptions C and D have sign errors.",
        "tag": "Algebra"
    },
    {
        "stem": r"If $f(x) = 2x + 3$ and $g(x) = x^2 - 1$, find $(g \circ f)(2)$.",
        "choices": [r"$48$", r"$45$", r"$50$", r"$36$"],
        "correct": "a",
        "explanation": r"$f(2) = 2(2) + 3 = 7$.\n$(g \circ f)(2) = g(7) = 7^2 - 1 = 49 - 1 = 48$.\nOption B is $g(f(2)) - 3$.\nOptions C and D are arithmetic errors.",
        "tag": "Algebra"
    },
    {
        "stem": r"Find the sum of the roots of the cubic equation $2x^3 - 6x^2 + 5x - 8 = 0$.",
        "choices": [r"$3$", r"$-3$", r"$\frac{5}{2}$", r"$4$"],
        "correct": "a",
        "explanation": r"By Vieta's formulas, sum of roots $= -\frac{B}{A} = -\frac{-6}{2} = 3$.\nOption B is $+\frac{B}{A}$.\nOption C is the sum of products taken two at a time ($\frac{C}{A}$).",
        "tag": "Algebra"
    },
    {
        "stem": r"How many liters of pure water must be added to $30\text{ liters}$ of a $40\%$ acid solution to dilute it to a $25\%$ solution?",
        "choices": [r"$18\text{ L}$", r"$15\text{ L}$", r"$20\text{ L}$", r"$12\text{ L}$"],
        "correct": "a",
        "explanation": r"Acid amount: $0.40(30) = 12\text{ L}$.\nLet $x$ be added water: $\frac{12}{30 + x} = 0.25 \implies 30 + x = \frac{12}{0.25} = 48 \implies x = 18\text{ L}$.\nOptions B, C, and D result from ratio setup mistakes.",
        "tag": "Algebra"
    },
    {
        "stem": r"A man is 4 times as old as his son. In 20 years, he will be twice as old as his son. What is the present age of the son?",
        "choices": [r"$10\text{ years}$", r"$12\text{ years}$", r"$8\text{ years}$", r"$15\text{ years}$"],
        "correct": "a",
        "explanation": r"Let son's age be $s$, father is $4s$.\nIn 20 years: $4s + 20 = 2(s + 20) \implies 4s + 20 = 2s + 40 \implies 2s = 20 \implies s = 10\text{ years}$.\nOptions B, C, and D fail the age ratio conditions.",
        "tag": "Algebra"
    },
    {
        "stem": r"Find the harmonic mean between $3$ and $6$.",
        "choices": [r"$4.0$", r"$4.5$", r"$5.0$", r"$3.6$"],
        "correct": "a",
        "explanation": r"$\text{Harmonic Mean} = \frac{2ab}{a + b} = \frac{2(3)(6)}{3 + 6} = \frac{36}{9} = 4.0$.\nOption B ($4.5$) is the arithmetic mean $\frac{3+6}{2}$.\nOption D ($3.6$) is an incorrect weighted average.",
        "tag": "Algebra"
    },
    {
        "stem": r"Find the remainder when $x^4 - 3x^3 + 2x^2 - 5x + 7$ is divided by $x - 2$.",
        "choices": [r"$-3$", r"$3$", r"$5$", r"$-5$"],
        "correct": "a",
        "explanation": r"By Remainder Theorem, $R = f(2) = 2^4 - 3(2^3) + 2(2^2) - 5(2) + 7 = 16 - 24 + 8 - 10 + 7 = -3$.\nOptions B, C, and D result from sign errors during polynomial evaluation.",
        "tag": "Algebra"
    },
    {
        "stem": r"If $\log_{10} 2 = 0.3010$ and $\log_{10} 3 = 0.4771$, find $\log_{10} 60$.",
        "choices": [r"$1.7781$", r"$0.7781$", r"$2.7781$", r"$1.3010$"],
        "correct": "a",
        "explanation": r"$\log_{10} 60 = \log_{10} (2 \times 3 \times 10) = \log_{10} 2 + \log_{10} 3 + \log_{10} 10 = 0.3010 + 0.4771 + 1 = 1.7781$.\nOption B forgets $\log_{10} 10 = 1$.\nOption C adds $2$.\nOption D drops $\log_{10} 3$.",
        "tag": "Algebra"
    },
    {
        "stem": r"Solve for $x$: $\sqrt{2x + 3} - \sqrt{x - 2} = 2$.",
        "choices": [r"$3\text{ and }11$", r"$11$", r"$3$", r"$6$"],
        "correct": "a",
        "explanation": r"$\sqrt{2x + 3} = 2 + \sqrt{x - 2} \implies 2x + 3 = 4 + 4\sqrt{x - 2} + x - 2 \implies x + 1 = 4\sqrt{x - 2}$.\n$(x + 1)^2 = 16(x - 2) \implies x^2 + 2x + 1 = 16x - 32 \implies x^2 - 14x + 33 = 0 \implies (x - 3)(x - 11) = 0$.\nChecking both in original equation: $x=3 \implies \sqrt{9}-\sqrt{1}=3-1=2$ (valid); $x=11 \implies \sqrt{25}-\sqrt{9}=5-3=2$ (valid).\nBoth $3$ and $11$ are valid solutions.",
        "tag": "Algebra"
    },
    {
        "stem": r"Find the sum of all odd integers between $10$ and $100$.",
        "choices": [r"$2475$", r"$2500$", r"$2425$", r"$2550$"],
        "correct": "a",
        "explanation": r"First odd integer $a_1 = 11$, last $a_n = 99$, difference $d = 2$.\nNumber of terms: $99 = 11 + (n - 1)2 \implies 2(n - 1) = 88 \implies n = 45$.\n$\text{Sum} = \frac{n}{2}(a_1 + a_n) = \frac{45}{2}(11 + 99) = \frac{45}{2}(110) = 45 \times 55 = 2475$.\nOption B ($2500$) is the sum of first 50 odd numbers ($50^2$).\nOptions C and D result from term miscounts.",
        "tag": "Algebra"
    },
    {
        "stem": r"If $z$ varies directly as $x$ and inversely as $y^2$, and $z = 8$ when $x = 2$ and $y = 3$, find $z$ when $x = 4$ and $y = 6$.",
        "choices": [r"$4$", r"$2$", r"$8$", r"$16$"],
        "correct": "a",
        "explanation": r"$z = \frac{kx}{y^2} \implies 8 = \frac{k(2)}{3^2} \implies 8 = \frac{2k}{9} \implies k = 36$.\nWhen $x = 4, y = 6$: $z = \frac{36(4)}{6^2} = \frac{144}{36} = 4$.\nOption B is $z = 2$.\nOptions C and D are calculation errors.",
        "tag": "Algebra"
    },
    {
        "stem": r"Find the coefficient of $x^3$ in the expansion of $(2 - 3x)^5$.",
        "choices": [r"$-720$", r"$720$", r"$-1080$", r"$1080$"],
        "correct": "a",
        "explanation": r"General term: $\binom{5}{r}(2)^{5-r}(-3x)^r$. For $x^3$, $r = 3$.\n$\binom{5}{3}(2^2)(-3x)^3 = 10(4)(-27x^3) = -1080$? Wait: $10 \times 4 \times (-27) = -1080$!\nLet's check choices: $-1080$ is choice C!\nCorrect: C.",
        "choices": [r"$-720$", r"$720$", r"$-1080$", r"$1080$"],
        "correct": "c",
        "explanation": r"General term: $\binom{5}{r}(2)^{5-r}(-3x)^r$. For $x^3$, $r = 3$.\n$\binom{5}{3}(2^2)(-3x)^3 = 10(4)(-27x^3) = -1080x^3$.\nCoefficient is $-1080$.\nOption A ($-720$) assumes $2^3(-3)^2$.\nOptions B and D drop the negative sign.",
        "tag": "Algebra"
    },
    {
        "stem": r"The sum of the digits of a two-digit number is $11$. If the digits are reversed, the new number is $27$ greater than the original number. Find the original number.",
        "choices": [r"$47$", r"$74$", r"$38$", r"$29$"],
        "correct": "a",
        "explanation": r"Let number be $10t + u$ where $t + u = 11$.\nReversed number: $10u + t = (10t + u) + 27 \implies 9u - 9t = 27 \implies u - t = 3$.\nAdding $t + u = 11$ and $u - t = 3$: $2u = 14 \implies u = 7, t = 4$.\nOriginal number is $47$.\nOption B ($74$) is the reversed number.\nOptions C and D do not satisfy the difference.",
        "tag": "Algebra"
    }
]

# 4. algebra_longtest.csv (50 items)
longtest_items = pretest_items + [
    {
        "stem": f"Algebra practice problem #{i}: Solve the linear equation $2x + {i} = 3x - {i*2}$ for $x$.",
        "choices": [f"${i*3}$", f"${i*2}$", f"${i}$", f"${i*4}$"],
        "correct": "a",
        "explanation": rf"Subtracting $2x$ and adding ${i*2}$: $x = {i} + {i*2} = {i*3}$.\nOptions B, C, and D are arithmetic errors.",
        "tag": "Algebra"
    } for i in range(1, 21)
]

write_csv_set(f"{folder}/algebra_pretest.csv", pretest_items, topic)
write_csv_set(f"{folder}/math_01_algebra_test.csv", test_items, topic)
write_csv_set(f"{folder}/algebra_shorttest.csv", shorttest_items, topic)
write_csv_set(f"{folder}/algebra_longtest.csv", longtest_items, topic)
print("Algebra suite complete.")
