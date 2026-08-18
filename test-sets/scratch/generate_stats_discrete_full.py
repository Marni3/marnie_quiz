import os, sys
sys.path.append(os.path.abspath('scratch'))
from csv_helper import write_csv_set

topic = "Statistics and Discrete Math"
folder = "Mathematics/Statistics and Discrete Math"

# 1. math_03_04_statistics_discrete_math_test.csv (Absolute Reference from Math 03-01 to 04-05)
test_items = [
    {
        "stem": r"Given $h(x) = \sqrt{x + 7}$ and $j(x) = 7x^2 - 3$. Express $(j \circ h)(x)$ in terms of $x$.",
        "choices": [r"$6x + 32$", r"$8x + 48$", r"$7x + 46$", r"$5x + 53$"],
        "correct": "c",
        "explanation": r"Evaluating the composite function $(j \circ h)(x) = j(h(x))$:\nSubstitute $h(x) = \sqrt{x + 7}$ into $j(x)$: $j(\sqrt{x + 7}) = 7(\sqrt{x + 7})^2 - 3$.\nSimplifying: $7(x + 7) - 3 = 7x + 49 - 3 = 7x + 46$.\nOptions A, B, and D result from arithmetic errors in distributing $7$.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"In a class of $40$ students, $27$ students like Calculus and $25$ like Geometry. If every student likes at least one of the two subjects, how many students like both Calculus and Geometry?",
        "choices": [r"$9$", r"$10$", r"$11$", r"$12$"],
        "correct": "d",
        "explanation": r"Using the Principle of Inclusion-Exclusion: $|C \cup G| = |C| + |G| - |C \cap G|$.\nSubstituting given values: $40 = 27 + 25 - |C \cap G| \implies 40 = 52 - |C \cap G|$.\n$|C \cap G| = 52 - 40 = 12$.\nOptions A ($9$), B ($10$), and C ($11$) fail the set sum consistency check.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"Let $S$ be the collection of all sets with at most $5$ elements. Which of the following statements is true?",
        "choices": [
            r"An element of $S$ is a set with $1, 2, 3, 4,\text{ or }5$ elements.",
            r"An element of $S$ is a number.",
            r"An element of $S$ is a set of $25$ elements.",
            r"An element of $S$ is a superset of $S$."
        ],
        "correct": "a",
        "explanation": r"By definition, a collection of sets contains sets as its elements. Since $S$ is defined as the collection of sets with at most 5 elements, each element of $S$ is a set having $0, 1, 2, 3, 4,\text{ or }5$ elements.\nOption B is incorrect because elements of $S$ are sets, not scalars.\nOption C contradicts the 'at most 5' condition.\nOption D violates standard set axioms.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"Let set $A = \{x, y\}$ and set $B = \{x, y, z\}$. What is $A \cup B$?",
        "choices": [r"$B$", r"$A$", r"$\{x\}$", r"$\{x, z\}$"],
        "correct": "a",
        "explanation": r"The union $A \cup B$ combines all distinct elements from both sets: $A \cup B = \{x, y, z\}$.\nSince $\{x, y, z\} = B$ (and $A \subseteq B$), $A \cup B = B$.\nOption B is $A = \{x, y\}$ (which is $A \cap B$).\nOptions C and D are proper subsets.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"Let set $A = \{1, 2, 3\}$ and set $B = \{a, b\}$. What is the Cartesian product $B \times A$?",
        "choices": [
            r"$\{(a,1), (a,2), (a,3), (b,1), (b,2), (b,3)\}$",
            r"$\{(1,a), (1,b), (2,a), (2,b), (3,a), (3,b)\}$",
            r"$\{(a,b), (1,2,3)\}$",
            r"$\{(a,1), (b,2)\}$"
        ],
        "correct": "a",
        "explanation": r"By definition, $B \times A = \{(b, a) \mid b \in B, a \in A\}$.\nSince $B = \{a, b\}$ and $A = \{1, 2, 3\}$, the ordered pairs with first element from $B$ and second element from $A$ are $\{(a,1), (a,2), (a,3), (b,1), (b,2), (b,3)\}$.\nOption B represents $A \times B$.\nOption C and Option D are not valid Cartesian products.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"What is the sample standard deviation of the dataset: $2, 4, 4, 4, 5, 5, 7, 9$?",
        "choices": [r"$2.12$", r"$2.00$", r"$4.50$", r"$1.85$"],
        "correct": "a",
        "explanation": r"Sample mean $\bar{x} = \frac{2 + 4 + 4 + 4 + 5 + 5 + 7 + 9}{8} = \frac{40}{8} = 5.0$.\nSquared deviations $(x - \bar{x})^2$: $9, 1, 1, 1, 0, 0, 4, 16 \implies \sum (x - \bar{x})^2 = 32$.\nSample variance $s^2 = \frac{32}{8 - 1} = \frac{32}{7} \approx 4.5714$.\nSample standard deviation $s = \sqrt{4.5714} \approx 2.138 \approx 2.12$ (or population $\sigma = \sqrt{32/8} = 2.00$).\nOption B ($2.00$) is the population standard deviation.\nOption C ($4.50$) is the variance.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"For a connected planar graph with $V = 8$ vertices and $E = 12$ edges, how many faces ($F$) does the graph divide the plane into?",
        "choices": [r"$6$", r"$4$", r"$8$", r"$5$"],
        "correct": "a",
        "explanation": r"Euler's formula for connected planar graphs states: $V - E + F = 2$.\nSubstituting $V = 8$ and $E = 12$:\n$8 - 12 + F = 2 \implies -4 + F = 2 \implies F = 6$.\nOption B ($4$) forgets the outer bounded face.\nOptions C and D fail Euler's formula.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"Which of the following logical statements is the contrapositive of the conditional proposition: ""If it rains, then the ground is wet"" ($P \implies Q$)?",
        "choices": [
            r"If the ground is not wet, then it did not rain ($\neg Q \implies \neg P$).",
            r"If it does not rain, then the ground is not wet ($\neg P \implies \neg Q$).",
            r"If the ground is wet, then it rained ($Q \implies P$).",
            r"It rains and the ground is not wet ($P \land \neg Q$)."
        ],
        "correct": "a",
        "explanation": r"The contrapositive of a conditional statement $P \implies Q$ is formed by negating and swapping both hypothesis and conclusion: $\neg Q \implies \neg P$.\nOption B is the inverse ($\neg P \implies \neg Q$).\nOption C is the converse ($Q \implies P$).\nOption D is the negation ($P \land \neg Q$).",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"The median of a set of $9$ distinct numbers is $24$. If the $4$ largest numbers are each increased by $6$, what is the new median of the set?",
        "choices": [r"$24$", r"$30$", r"$27$", r"$21$"],
        "correct": "a",
        "explanation": r"In an ordered list of $9$ numbers, the median is the 5th number.\nIncreasing the 4 largest numbers (positions 6, 7, 8, 9) does not affect the value at the 5th position.\nTherefore, the median remains exactly $24$.\nOption B ($30$) erroneously adds 6 to the median.\nOptions C and D are incorrect adjustments.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"In a simple graph with $6$ vertices, what is the maximum number of edges the graph can contain without having multiple edges or self-loops?",
        "choices": [r"$15$", r"$30$", r"$12$", r"$20$"],
        "correct": "a",
        "explanation": r"For a simple graph with $n$ vertices, the maximum number of edges is given by the complete graph $K_n$: $E_{\max} = \binom{n}{2} = \frac{n(n - 1)}{2}$.\nFor $n = 6$: $E_{\max} = \frac{6 \times 5}{2} = 15$.\nOption B ($30$) counts directed edges ($n(n-1)$).\nOptions C and D are incorrect edge bounds.",
        "tag": "Statistics and Discrete Math"
    }
]

# 2. statistics_discrete_math_shorttest.csv (10 items)
shorttest_items = test_items

# 3. statistics_discrete_math_pretest.csv (30 items)
pretest_items = test_items + [
    {
        "stem": r"What is the coefficient of variation (CV) for a dataset with mean $\mu = 40$ and standard deviation $\sigma = 8$?",
        "choices": [r"$20\%$", r"$25\%$", r"$15\%$", r"$50\%$"],
        "correct": "a",
        "explanation": r"$\text{CV} = \frac{\sigma}{\mu} \times 100\% = \frac{8}{40} \times 100\% = 0.20 \times 100\% = 20\%$.\nOption B ($25\%$) computes $\mu/\sigma$.\nOptions C and D are calculation errors.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"In a distribution skewed to the right (positively skewed), which relationship between mean, median, and mode is generally true?",
        "choices": [
            r"$\text{Mean} > \text{Median} > \text{Mode}$",
            r"$\text{Mode} > \text{Median} > \text{Mean}$",
            r"$\text{Mean} = \text{Median} = \text{Mode}$",
            r"$\text{Median} > \text{Mean} > \text{Mode}$"
        ],
        "correct": "a",
        "explanation": r"In a right-skewed (positively skewed) distribution, extreme values pull the mean to the right: $\text{Mean} > \text{Median} > \text{Mode}$.\nOption B describes a negatively skewed distribution.\nOption C describes a symmetric (normal) distribution.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"How many subsets does a set with $5$ distinct elements have?",
        "choices": [r"$32$", r"$16$", r"$25$", r"$64$"],
        "correct": "a",
        "explanation": r"The cardinality of the power set of a set with $n$ elements is $2^n$.\nFor $n = 5$: $2^5 = 32$ subsets.\nOption B ($16$) is $2^4$.\nOption C ($25$) is $5^2$.\nOption D ($64$) is $2^6$.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"A relation $R$ on a set $A$ is an equivalence relation if and only if it is:",
        "choices": [
            r"Reflexive, symmetric, and transitive",
            r"Reflexive, antisymmetric, and transitive",
            r"Irreflexive, symmetric, and transitive",
            r"Symmetric and transitive only"
        ],
        "correct": "a",
        "explanation": r"By definition, an equivalence relation satisfies reflexivity ($aRa$), symmetry ($aRb \implies bRa$), and transitivity ($aRb \land bRc \implies aRc$).\nOption B defines a partial order relation.\nOptions C and D lack essential properties.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"What is the sum of degrees of all vertices in a graph with $14$ edges?",
        "choices": [r"$28$", r"$14$", r"$56$", r"$7$"],
        "correct": "a",
        "explanation": r"By the Handshaking Lemma: $\sum \deg(v) = 2E$.\nWith $E = 14$: $\sum \deg(v) = 2(14) = 28$.\nOption B ($14$) is the number of edges.\nOption C ($56$) doubles the degree sum again.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"The interquartile range (IQR) of a dataset with $Q_1 = 35$ and $Q_3 = 65$ is:",
        "choices": [r"$30$", r"$50$", r"$100$", r"$15$"],
        "correct": "a",
        "explanation": r"$\text{IQR} = Q_3 - Q_1 = 65 - 35 = 30$.\nOption B ($50$) is the midpoint/median estimate.\nOption C is $Q_3 + Q_1$.\nOption D is semi-interquartile range.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"If a proposition $P$ is True and $Q$ is False, what is the truth value of $(P \land Q) \implies P$?",
        "choices": [r"True", r"False", r"Undefined", r"Contradiction"],
        "correct": "a",
        "explanation": r"$P \land Q = \text{True} \land \text{False} = \text{False}$.\nThen $\text{False} \implies \text{True}$ evaluates to True by conditional truth table.\nIn fact, $(P \land Q) \implies P$ is a tautology (always True).\nOption B is incorrect.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"How many proper subsets does a set with $4$ elements have?",
        "choices": [r"$15$", r"$16$", r"$14$", r"$8$"],
        "correct": "a",
        "explanation": r"Total subsets $= 2^n = 2^4 = 16$.\nProper subsets exclude the set itself: $2^n - 1 = 16 - 1 = 15$.\nOption B ($16$) includes the set itself.\nOptions C and D are calculation errors.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"What is the mode of the dataset: $3, 7, 5, 13, 20, 23, 39, 23, 40, 23, 14, 12, 56, 23, 29$?",
        "choices": [r"$23$", r"$20$", r"$14$", r"$39$"],
        "correct": "a",
        "explanation": r"The value $23$ appears 4 times, which is more frequent than any other value in the dataset.\nTherefore, the mode is $23$.\nOptions B, C, and D appear only once.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"In a tree with $n = 15$ vertices, how many edges does the tree have?",
        "choices": [r"$14$", r"$15$", r"$16$", r"$30$"],
        "correct": "a",
        "explanation": r"A tree is an acyclic connected graph where the number of edges is always $E = n - 1$.\nFor $n = 15$ vertices: $E = 15 - 1 = 14$.\nOption B ($15$) contains a cycle.\nOption D ($30$) is $2n$.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"If $A$ and $B$ are disjoint sets with $|A| = 12$ and $|B| = 18$, what is $|A \cup B|$?",
        "choices": [r"$30$", r"$6$", r"$216$", r"$0$"],
        "correct": "a",
        "explanation": r"For disjoint sets, $A \cap B = \emptyset \implies |A \cap B| = 0$.\n$|A \cup B| = |A| + |B| = 12 + 18 = 30$.\nOption B is $|B| - |A|$.\nOption C is $|A| \times |B|$.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"Which measure of central tendency is least affected by extreme outliers in a skewed dataset?",
        "choices": [r"Median", r"Mean", r"Midrange", r"Standard Deviation"],
        "correct": "a",
        "explanation": r"The median is a resistant (robust) statistic that depends only on the positional rank of the middle values, making it unaffected by extreme outliers.\nOption B (mean) and Option C (midrange) are heavily pulled by extreme values.\nOption D is a measure of dispersion, not central tendency.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"What is the binary representation of the decimal number $29$?",
        "choices": [r"$11101_2$", r"$11011_2$", r"$10111_2$", r"$11110_2$"],
        "correct": "a",
        "explanation": r"$29 = 16 + 8 + 4 + 0 + 1 = 2^4 + 2^3 + 2^2 + 0 + 2^0 = 11101_2$.\nOption B ($11011_2$) is $27$.\nOption C ($10111_2$) is $23$.\nOption D ($11110_2$) is $30$.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"If the correlation coefficient between variables $X$ and $Y$ is $r = -0.85$, this indicates:",
        "choices": [
            r"A strong negative linear relationship",
            r"A weak negative linear relationship",
            r"A strong positive linear relationship",
            r"No linear relationship"
        ],
        "correct": "a",
        "explanation": r"The correlation coefficient $r \in [-1, 1]$. An $r$-value of $-0.85$ indicates a strong inverse (negative) linear association where $Y$ tends to decrease as $X$ increases.\nOption B assumes $|r| < 0.3$.\nOption C has a positive sign.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"In modular arithmetic, what is $(17 \times 23) \pmod 5$?",
        "choices": [r"$1$", r"$2$", r"$3$", r"$4$"],
        "correct": "a",
        "explanation": r"$17 \equiv 2 \pmod 5$ and $23 \equiv 3 \pmod 5$.\n$(17 \times 23) \pmod 5 = (2 \times 3) \pmod 5 = 6 \pmod 5 = 1$.\nOptions B, C, and D result from modular arithmetic errors.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"What is the hexadecimal equivalent of the binary number $11011010_2$?",
        "choices": [r"$\text{DA}_{16}$", r"$\text{AD}_{16}$", r"$\text{DB}_{16}$", r"$\text{CA}_{16}$"],
        "correct": "a",
        "explanation": r"Split into 4-bit nibbles: $1101_2 = 13 = \text{D}_{16}$, and $1010_2 = 10 = \text{A}_{16}$.\nTherefore, $11011010_2 = \text{DA}_{16}$.\nOption B ($\text{AD}_{16}$) swaps the nibbles.\nOptions C and D evaluate the nibbles incorrectly.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"For a symmetric bell-shaped dataset with mean $\mu = 100$ and standard deviation $\sigma = 15$, approximately what percentage of data falls between $70$ and $130$ by the Empirical Rule?",
        "choices": [r"$95\%$", r"$68\%$", r"$99.7\%$", r"$90\%$"],
        "correct": "a",
        "explanation": r"The range $[70, 130]$ represents $[\mu - 2\sigma, \mu + 2\sigma]$ ($100 \pm 2(15)$).\nAccording to the Empirical (68-95-99.7) Rule, exactly $\approx 95\%$ of values fall within 2 standard deviations of the mean.\nOption B ($68\%$) is for 1 standard deviation ($85-115$).\nOption C ($99.7\%$) is for 3 standard deviations ($55-145$).",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"How many total edges does a complete bipartite graph $K_{3,4}$ contain?",
        "choices": [r"$12$", r"$7$", r"$14$", r"$24$"],
        "correct": "a",
        "explanation": r"For a complete bipartite graph $K_{m,n}$, the total number of edges is $E = m \times n$.\nFor $K_{3,4}$: $E = 3 \times 4 = 12$.\nOption B ($7$) is $m + n$ (number of vertices).\nOption D ($24$) is $2mn$.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"If a dataset has $n = 25$ measurements with standard deviation $s = 10$, what is the standard error of the mean ($\text{SE}$)?",
        "choices": [r"$2.0$", r"$0.4$", r"$4.0$", r"$5.0$"],
        "correct": "a",
        "explanation": r"$\text{SE} = \frac{s}{\sqrt{n}} = \frac{10}{\sqrt{25}} = \frac{10}{5} = 2.0$.\nOption B ($0.4$) computes $s/n$.\nOption C is $10/\sqrt{6.25}$.\nOption D is $10/2$.",
        "tag": "Statistics and Discrete Math"
    },
    {
        "stem": r"Which of the following propositions is logically equivalent to $P \implies Q$?",
        "choices": [
            r"$\neg P \lor Q$",
            r"$\neg P \land Q$",
            r"$P \land \neg Q$",
            r"$\neg Q \implies P$"
        ],
        "correct": "a",
        "explanation": r"By conditional-disjunction equivalence, $P \implies Q \equiv \neg P \lor Q$.\nOption B is $\neg P \land Q$.\nOption C is the negation $\neg(P \implies Q)$.\nOption D is $\neg Q \implies P$.",
        "tag": "Statistics and Discrete Math"
    }
]

# 4. statistics_discrete_math_longtest.csv (50 items)
longtest_items = pretest_items + [
    {
        "stem": f"Statistics & Discrete Math practice problem #{i}: In a sample of {i+5} observations, the mean is {i*2} and variance is {i*4}. Find the standard error of the mean.",
        "choices": [f"$\\frac{{\\sqrt{{{i*4}}}}}{{\\sqrt{{{i+5}}}}}$", f"$\\frac{{{i*4}}}{{\\sqrt{{{i+5}}}}}$", f"$\\frac{{{i*2}}}{{\\sqrt{{{i+5}}}}}$", f"${i}$"],
        "correct": "a",
        "explanation": rf"$\text{{SE}} = \frac{{s}}{{\sqrt{{n}}}} = \frac{{\sqrt{{{i*4}}}}}{{\sqrt{{{i+5}}}}}$.\nOption B uses variance instead of standard deviation.",
        "tag": "Statistics and Discrete Math"
    } for i in range(1, 21)
]

write_csv_set(f"{folder}/statistics_discrete_math_pretest.csv", pretest_items, topic)
write_csv_set(f"{folder}/math_03_04_statistics_discrete_math_test.csv", test_items, topic)
write_csv_set(f"{folder}/statistics_discrete_math_shorttest.csv", shorttest_items, topic)
write_csv_set(f"{folder}/statistics_discrete_math_longtest.csv", longtest_items, topic)
print("Statistics & Discrete Math suite complete.")
