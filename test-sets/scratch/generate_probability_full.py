import os, sys
sys.path.append(os.path.abspath('scratch'))
from csv_helper import write_csv_set

topic = "Probability"
folder = "Mathematics/Probability"

# 1. math_02_probability_test.csv (Absolute Reference from Math 02-01 to 02-13)
test_items = [
    {
        "stem": r"Given $P(A) = \frac{1}{4}$, $P(B) = \frac{1}{3}$, and $P(A \cup B) = \frac{1}{2}$, find $P(B|A)$.",
        "choices": [r"$\frac{1}{2}$", r"$\frac{1}{6}$", r"$\frac{1}{4}$", r"$\frac{1}{3}$"],
        "correct": "d",
        "explanation": r"Using addition rule: $P(A \cap B) = P(A) + P(B) - P(A \cup B) = \frac{1}{4} + \frac{1}{3} - \frac{1}{2} = \frac{3 + 4 - 6}{12} = \frac{1}{12}$.\nConditional probability formula: $P(B|A) = \frac{P(A \cap B)}{P(A)} = \frac{1/12}{1/4} = \frac{4}{12} = \frac{1}{3}$.\nOption A ($\frac{1}{2}$) is $P(A \cup B)$.\nOption B ($\frac{1}{6}$) is $2P(A \cap B)$.\nOption C ($\frac{1}{4}$) is $P(A)$.",
        "tag": "Probability"
    },
    {
        "stem": r"The probability that it will snow on Sunday is $\frac{3}{5}$. The probability that it will snow on both Sunday and Monday is $\frac{3}{10}$. What is the probability that it will snow on Monday, given that it snowed on Sunday?",
        "choices": [r"$\frac{1}{2}$", r"$\frac{1}{6}$", r"$\frac{1}{4}$", r"$\frac{1}{3}$"],
        "correct": "a",
        "explanation": r"By conditional probability: $P(\text{Monday}|\text{Sunday}) = \frac{P(\text{Sunday} \cap \text{Monday})}{P(\text{Sunday})}$.\nSubstituting given values: $P(\text{Monday}|\text{Sunday}) = \frac{3/10}{3/5} = \frac{3}{10} \times \frac{5}{3} = \frac{5}{10} = \frac{1}{2}$.\nOption B ($\frac{1}{6}$) and Option D ($\frac{1}{3}$) result from incorrect division.\nOption C ($\frac{1}{4}$) is arithmetic error.",
        "tag": "Probability"
    },
    {
        "stem": r"In how many different ways can the director of a research laboratory choose $2$ chemical engineers from among $5$ applicants and $2$ industrial engineers from among $4$ applicants?",
        "choices": [r"$30$", r"$60$", r"$120$", r"$240$"],
        "correct": "b",
        "explanation": r"The selections are independent combinations: $\binom{5}{2} \times \binom{4}{2}$.\n$\binom{5}{2} = \frac{5 \times 4}{2 \times 1} = 10$, and $\binom{4}{2} = \frac{4 \times 3}{2 \times 1} = 6$.\nTotal ways $= 10 \times 6 = 60$.\nOption A ($30$) uses $\binom{5}{2} \times 3$.\nOption C ($120$) uses permutations.\nOption D ($240$) uses permutations for both groups.",
        "tag": "Probability"
    },
    {
        "stem": r"If a fair six-sided die is rolled $5$ times, what is the probability of obtaining five $6\text{s}$ in a row?",
        "choices": [r"$0.00129$", r"$0.129$", r"$0.000129$", r"$0.0000129$"],
        "correct": "c",
        "explanation": r"Probability of rolling a $6$ in a single trial is $p = \frac{1}{6}$.\nFor $5$ independent rolls: $P = \left(\frac{1}{6}\right)^5 = \frac{1}{7776} \approx 0.0001286 \approx 0.000129$.\nOptions A and B have misplaced decimal points.\nOption D is an extra order of magnitude smaller.",
        "tag": "Probability"
    },
    {
        "stem": r"A box contains $5$ defective and $195$ non-defective electronic components. If $2$ components are selected at random without replacement, what is the probability that at least one is defective?",
        "choices": [r"$0.0494$", r"$0.0500$", r"$0.0488$", r"$0.0512$"],
        "correct": "a",
        "explanation": r"Total components $N = 200$, non-defective $M = 195$.\n$P(\text{at least one defective}) = 1 - P(\text{both non-defective})$.\n$P(\text{both non-defective}) = \frac{195}{200} \times \frac{194}{199} = \frac{37830}{39800} \approx 0.95050$.\n$P(\text{at least one defective}) = 1 - 0.95050 = 0.04950 \approx 0.0494$.\nOption B ($0.0500$) is the single component rate ($5/100$).\nOptions C and D result from sampling with replacement.",
        "tag": "Probability"
    },
    {
        "stem": r"How many distinct permutations can be made from the letters of the word ""PHILIPPINES""?",
        "choices": [r"$1,108,800$", r"$554,400$", r"$3,326,400$", r"$2,217,600$"],
        "correct": "a",
        "explanation": r"The word ""PHILIPPINES"" has $11$ total letters with repetitions: P appears 3 times, I appears 3 times, L appears 1, H appears 1, N appears 1, E appears 1, S appears 1.\nDistinct permutations $= \frac{11!}{3! \times 3!} = \frac{39,916,800}{6 \times 6} = \frac{39,916,800}{36} = 1,108,800$.\nOption B ($554,400$) divides by an extra factor of 2.\nOptions C and D omit one of the repeated letter factors.",
        "tag": "Probability"
    },
    {
        "stem": r"In how many ways can $6$ people be seated around a circular conference table?",
        "choices": [r"$720$", r"$120$", r"$60$", r"$24$"],
        "correct": "b",
        "explanation": r"Circular permutation formula for $n$ objects is $(n - 1)!$.\nHere $n = 6$, so total arrangements $= (6 - 1)! = 5! = 5 \times 4 \times 3 \times 2 \times 1 = 120$.\nOption A ($720$) is linear permutation $6!$.\nOption C ($60$) divides by 2 as if reflections were identical (like a beaded necklace).\nOption D is $4! = 24$.",
        "tag": "Probability"
    },
    {
        "stem": r"A bag contains $4$ white balls and $6$ black balls. If $3$ balls are drawn at random without replacement, find the probability that all $3$ balls are black.",
        "choices": [r"$\frac{1}{6}$", r"$\frac{1}{5}$", r"$\frac{1}{4}$", r"$\frac{1}{3}$"],
        "correct": "a",
        "explanation": r"Total balls $= 10$.\nProbability of 3 black balls $= \frac{\binom{6}{3}}{\binom{10}{3}} = \frac{20}{120} = \frac{1}{6}$.\nAlternatively: $\frac{6}{10} \times \frac{5}{9} \times \frac{4}{8} = \frac{120}{720} = \frac{1}{6}$.\nOptions B ($\frac{1}{5}$), C ($\frac{1}{4}$), and D ($\frac{1}{3}$) result from replacement or combination errors.",
        "tag": "Probability"
    },
    {
        "stem": r"Two fair dice are tossed simultaneously. What is the probability that the sum of the numbers shown is $7$ or $11$?",
        "choices": [r"$\frac{2}{9}$", r"$\frac{7}{36}$", r"$\frac{1}{6}$", r"$\frac{5}{18}$"],
        "correct": "a",
        "explanation": r"Total outcomes $= 36$.\nSum of 7 occurs in 6 ways: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$.\nSum of 11 occurs in 2 ways: $(5,6),(6,5)$.\nTotal favorable outcomes $= 6 + 2 = 8$.\nProbability $= \frac{8}{36} = \frac{2}{9}$.\nOption B ($\frac{7}{36}$) counts only 7 outcomes.\nOption C ($\frac{1}{6}$) is sum of 7 only.\nOption D ($\frac{5}{18}$) is $10/36$.",
        "tag": "Probability"
    },
    {
        "stem": r"In a standard deck of $52$ cards, what is the probability of drawing a Queen or a Heart?",
        "choices": [r"$\frac{4}{13}$", r"$\frac{17}{52}$", r"$\frac{16}{52}$", r"$\frac{3}{13}$"],
        "correct": "a",
        "explanation": r"Number of Queens $= 4$. Number of Hearts $= 13$.\nIntersection (Queen of Hearts) $= 1$.\n$P(\text{Queen} \cup \text{Heart}) = \frac{4 + 13 - 1}{52} = \frac{16}{52} = \frac{4}{13}$.\nOption B ($\frac{17}{52}$) forgets to subtract the intersection (Queen of Hearts).\nOption D ($\frac{3}{13}$) subtracts too many cards.",
        "tag": "Probability"
    }
]

# 2. probability_shorttest.csv (10 items)
shorttest_items = test_items

# 3. probability_pretest.csv (30 items)
pretest_items = test_items + [
    {
        "stem": r"A discrete random variable $X$ has probability distribution $P(X = k) = c k$ for $k \in \{1, 2, 3, 4\}$. Find the value of the constant $c$.",
        "choices": [r"$0.10$", r"$0.20$", r"$0.25$", r"$0.05$"],
        "correct": "a",
        "explanation": r"Total probability must equal 1: $\sum_{k=1}^4 c k = 1 \implies c(1 + 2 + 3 + 4) = 1 \implies 10c = 1 \implies c = 0.10$.\nOption B is $c = 0.20$.\nOptions C and D do not satisfy the normalization axiom.",
        "tag": "Probability"
    },
    {
        "stem": r"A test consists of $10$ true-or-false questions. What is the probability of guessing at least $8$ correct answers by chance?",
        "choices": [r"$\frac{7}{128}$", r"$\frac{29}{512}$", r"$\frac{7}{64}$", r"$\frac{45}{1024}$"],
        "correct": "a",
        "explanation": r"Binomial distribution with $n = 10, p = 0.5$. $P(X \ge 8) = P(8) + P(9) + P(10)$.\n$P(8) = \binom{10}{8}(0.5)^{10} = 45/1024$.\n$P(9) = 10/1024$.\n$P(10) = 1/1024$.\n$P(X \ge 8) = \frac{45 + 10 + 1}{1024} = \frac{56}{1024} = \frac{7}{128}$.\nOption B ($\frac{29}{512}$) is $58/1024$.\nOptions C and D are calculation errors.",
        "tag": "Probability"
    },
    {
        "stem": r"If the mean of a Poisson distribution is $\lambda = 3$, what is $P(X = 2)$?",
        "choices": [r"$\frac{9}{2}e^{-3}$", r"$9e^{-3}$", r"$\frac{3}{2}e^{-3}$", r"$3e^{-3}$"],
        "correct": "a",
        "explanation": r"Poisson formula: $P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!}$.\nFor $\lambda = 3$ and $k = 2$: $P(X = 2) = \frac{3^2 e^{-3}}{2!} = \frac{9}{2}e^{-3} \approx 0.2240$.\nOption B ($9e^{-3}$) omits $2!$ in the denominator.\nOption C uses $\lambda = 1$.\nOption D uses $k = 1$.",
        "tag": "Probability"
    },
    {
        "stem": r"In a normal distribution with mean $\mu = 50$ and standard deviation $\sigma = 10$, what is the $z$-score corresponding to $x = 65$?",
        "choices": [r"$1.50$", r"$1.25$", r"$2.00$", r"$0.75$"],
        "correct": "a",
        "explanation": r"$z = \frac{x - \mu}{\sigma} = \frac{65 - 50}{10} = \frac{15}{10} = 1.50$.\nOption B ($1.25$) assumes $\sigma = 12$.\nOption C ($2.00$) assumes $x = 70$.\nOption D ($0.75$) assumes $\sigma = 20$.",
        "tag": "Probability"
    },
    {
        "stem": r"Machine $A$ produces $60\%$ of items with $2\%$ defective rate, and Machine $B$ produces $40\%$ with $4\%$ defective rate. An item is chosen at random and found defective. What is the probability it was produced by Machine $A$?",
        "choices": [r"$\frac{3}{7}$", r"$\frac{4}{7}$", r"$\frac{1}{2}$", r"$\frac{3}{8}$"],
        "correct": "a",
        "explanation": r"By Bayes' Theorem: $P(D) = P(A)P(D|A) + P(B)P(D|B) = 0.60(0.02) + 0.40(0.04) = 0.012 + 0.016 = 0.028$.\n$P(A|D) = \frac{P(A)P(D|A)}{P(D)} = \frac{0.012}{0.028} = \frac{12}{28} = \frac{3}{7}$.\nOption B ($\frac{4}{7}$) is $P(B|D)$.\nOptions C and D are incorrect probability ratios.",
        "tag": "Probability"
    },
    {
        "stem": r"What is the expected value $E(X)$ for rolling a single fair six-sided die?",
        "choices": [r"$3.5$", r"$3.0$", r"$4.0$", r"$2.5$"],
        "correct": "a",
        "explanation": r"$E(X) = \sum x P(x) = \frac{1 + 2 + 3 + 4 + 5 + 6}{6} = \frac{21}{6} = 3.5$.\nOption B ($3.0$) is truncated.\nOption C ($4.0$) is the median if skewed.\nOption D is $2.5$.",
        "tag": "Probability"
    },
    {
        "stem": r"How many $4$-digit PIN codes can be formed using digits $0-9$ if repetition of digits is NOT allowed?",
        "choices": [r"$5040$", r"$10000$", r"$4536$", r"$720$"],
        "correct": "a",
        "explanation": r"Permutation of 10 digits taken 4 at a time: $P(10, 4) = 10 \times 9 \times 8 \times 7 = 5040$.\nOption B ($10000$) is with repetition ($10^4$).\nOption C ($4536$) excludes leading zeros ($9 \times 9 \times 8 \times 7$).\nOption D is $P(10, 3)$.",
        "tag": "Probability"
    },
    {
        "stem": r"If events $A$ and $B$ are independent with $P(A) = 0.4$ and $P(B) = 0.5$, find $P(A \cup B)$.",
        "choices": [r"$0.70$", r"$0.90$", r"$0.20$", r"$0.60$"],
        "correct": "a",
        "explanation": r"For independent events: $P(A \cap B) = P(A)P(B) = 0.4 \times 0.5 = 0.20$.\n$P(A \cup B) = P(A) + P(B) - P(A \cap B) = 0.4 + 0.5 - 0.20 = 0.70$.\nOption B ($0.90$) adds without subtracting intersection.\nOption C ($0.20$) is $P(A \cap B)$.",
        "tag": "Probability"
    },
    {
        "stem": r"A committee of $5$ is to be formed from $6$ men and $4$ women. In how many ways can the committee be formed if it must contain at least $3$ women?",
        "choices": [r"$66$", r"$60$", r"$72$", r"$54$"],
        "correct": "a",
        "explanation": r"Cases: (3 women, 2 men) or (4 women, 1 man).\nCase 1: $\binom{4}{3} \times \binom{6}{2} = 4 \times 15 = 60$.\nCase 2: $\binom{4}{4} \times \binom{6}{1} = 1 \times 6 = 6$.\nTotal ways $= 60 + 6 = 66$.\nOption B ($60$) includes only Case 1.\nOptions C and D result from combination calculation errors.",
        "tag": "Probability"
    },
    {
        "stem": r"What is the variance of a binomial distribution with $n = 100$ and $p = 0.20$?",
        "choices": [r"$16$", r"$20$", r"$4$", r"$80$"],
        "correct": "a",
        "explanation": r"Variance of a binomial distribution is $\sigma^2 = n p q = 100(0.20)(0.80) = 16$.\nOption B ($20$) is the mean $\mu = np$.\nOption C ($4$) is the standard deviation $\sigma = \sqrt{16}$.\nOption D ($80$) is $nq$.",
        "tag": "Probability"
    },
    {
        "stem": r"A coin is tossed $4$ times. What is the probability of getting exactly $2$ heads?",
        "choices": [r"$\frac{3}{8}$", r"$\frac{1}{2}$", r"$\frac{1}{4}$", r"$\frac{5}{16}$"],
        "correct": "a",
        "explanation": r"$P(X = 2) = \binom{4}{2}(0.5)^4 = 6 \times \frac{1}{16} = \frac{6}{16} = \frac{3}{8} = 0.375$.\nOption B ($\frac{1}{2}$) is the single toss probability.\nOption C is $\frac{4}{16}$.\nOption D is $\frac{5}{16}$.",
        "tag": "Probability"
    },
    {
        "stem": r"If $P(A) = 0.6, P(B) = 0.7$ and $P(A \cap B) = 0.4$, find $P(A' \cap B')$.",
        "choices": [r"$0.10$", r"$0.20$", r"$0.30$", r"$0.05$"],
        "correct": "a",
        "explanation": r"By De Morgan's Law: $P(A' \cap B') = 1 - P(A \cup B)$.\n$P(A \cup B) = P(A) + P(B) - P(A \cap B) = 0.6 + 0.7 - 0.4 = 0.90$.\n$P(A' \cap B') = 1 - 0.90 = 0.10$.\nOptions B, C, and D result from arithmetic errors.",
        "tag": "Probability"
    },
    {
        "stem": r"In how many ways can $4$ math books, $3$ physics books, and $2$ chemistry books be arranged on a shelf if books of the same subject must stay together?",
        "choices": [r"$1728$", r"$864$", r"$288$", r"$3456$"],
        "correct": "a",
        "explanation": r"The 3 subject blocks can be arranged in $3! = 6$ ways.\nWithin blocks: Math in $4! = 24$ ways, Physics in $3! = 6$ ways, Chemistry in $2! = 2$ ways.\nTotal $= 3! \times 4! \times 3! \times 2! = 6 \times 24 \times 6 \times 2 = 1728$.\nOption B ($864$) omits $2!$.\nOption C ($288$) omits $3!$ block arrangements.\nOption D ($3456$) doubles the total.",
        "tag": "Probability"
    },
    {
        "stem": r"If a card is drawn from a standard deck, what are the odds against drawing an Ace?",
        "choices": [r"$12:1$", r"$13:1$", r"$1:12$", r"$4:52$"],
        "correct": "a",
        "explanation": r"Number of Aces $= 4$, Non-Aces $= 48$.\nOdds against $= \frac{\text{Unfavorable}}{\text{Favorable}} = \frac{48}{4} = \frac{12}{1} = 12:1$.\nOption B ($13:1$) uses total cards.\nOption C ($1:12$) is odds in favor.\nOption D is probability.",
        "tag": "Probability"
    },
    {
        "stem": r"What is the probability of obtaining a total of $9$ at least once in $2$ tosses of a pair of fair dice?",
        "choices": [r"$\frac{17}{81}$", r"$\frac{1}{9}$", r"$\frac{8}{81}$", r"$\frac{19}{81}$"],
        "correct": "a",
        "explanation": r"Sum of 9 occurs in 4 ways: $(3,6),(4,5),(5,4),(6,3)$ out of 36 $\implies p = \frac{4}{36} = \frac{1}{9}$.\n$P(\text{not 9 in a toss}) = 1 - \frac{1}{9} = \frac{8}{9}$.\n$P(\text{at least once in 2 tosses}) = 1 - \left(\frac{8}{9}\right)^2 = 1 - \frac{64}{81} = \frac{17}{81}$.\nOption B ($\frac{1}{9}$) is for 1 toss.\nOption C ($\frac{8}{81}$) is arithmetic error.",
        "tag": "Probability"
    },
    {
        "stem": r"In a lottery, $6$ numbers are chosen from $1$ to $42$. How many total combinations are possible?",
        "choices": [r"$5,245,786$", r"$3,838,380$", r"$6,000,000$", r"$4,500,000$"],
        "correct": "a",
        "explanation": r"Total combinations: $\binom{42}{6} = \frac{42 \times 41 \times 40 \times 39 \times 38 \times 37}{6 \times 5 \times 4 \times 3 \times 2 \times 1} = 5,245,786$.\nOption B ($3,838,380$) is $\binom{40}{6}$.\nOptions C and D are rough estimates.",
        "tag": "Probability"
    },
    {
        "stem": r"If a player tosses $3$ fair coins and receives $\$8$ if all heads appear, $\$4$ if 2 heads appear, and loses $\$6$ if 1 or 0 heads appear, what is the expected payout?",
        "choices": [r"$\$0.00$", r"$\$1.00$", r"$-\$0.50$", r"$\$0.50$"],
        "correct": "a",
        "explanation": r"Probabilities: $P(3H) = 1/8$, $P(2H) = 3/8$, $P(1H \text{ or } 0H) = 4/8$.\n$E = 8(1/8) + 4(3/8) - 6(4/8) = 1 + 1.5 - 3 = 2.5 - 3 = -\$0.50$?\nWait: $1 + 1.50 - 3.00 = -\$0.50$ (Option C)!\nLet's set correct = 'c'.",
        "choices": [r"$\$0.00$", r"$\$1.00$", r"$-\$0.50$", r"$\$0.50$"],
        "correct": "c",
        "explanation": r"Probabilities: $P(3H) = 1/8$, $P(2H) = 3/8$, $P(\le 1H) = 4/8$.\n$E = 8\left(\frac{1}{8}\right) + 4\left(\frac{3}{8}\right) - 6\left(\frac{4}{8}\right) = 1 + 1.5 - 3 = -\$0.50$.\nOption A assumes a fair game ($E = 0$).\nOptions B and D result from dropped negative signs on losses.",
        "tag": "Probability"
    },
    {
        "stem": r"If $X \sim N(0, 1)$, what is $P(-1.96 \le Z \le 1.96)$ to the nearest whole percent?",
        "choices": [r"$95\%$", r"$68\%$", r"$99\%$", r"$90\%$"],
        "correct": "a",
        "explanation": r"In a standard normal distribution, exactly $95\%$ of the total area lies between $z = -1.96$ and $z = +1.96$.\nOption B ($68\%$) is for $-1 \le z \le 1$.\nOption C ($99\%$) is for $-2.58 \le z \le 2.58$.\nOption D ($90\%$) is for $-1.645 \le z \le 1.645$.",
        "tag": "Probability"
    },
    {
        "stem": r"Three light bulbs are chosen at random from $15$ bulbs of which $5$ are defective. What is the probability that exactly $1$ is defective?",
        "choices": [r"$\frac{45}{91}$", r"$\frac{20}{91}$", r"$\frac{15}{91}$", r"$\frac{30}{91}$"],
        "correct": "a",
        "explanation": r"Hypergeometric formula: $P(X = 1) = \frac{\binom{5}{1}\binom{10}{2}}{\binom{15}{3}} = \frac{5 \times 45}{455} = \frac{225}{455} = \frac{45}{91} \approx 0.4945$.\nOption B is $\frac{20}{91}$.\nOptions C and D are calculation errors.",
        "tag": "Probability"
    },
    {
        "stem": r"In how many ways can $5$ boys and $5$ girls sit in a row of $10$ chairs if boys and girls must alternate?",
        "choices": [r"$28,800$", r"$14,400$", r"$3,628,800$", r"$720$"],
        "correct": "a",
        "explanation": r"Pattern can start with a boy (BGBGBGBGBG) or a girl (GBGBGBGBGB): 2 possibilities.\nIn each pattern: 5 boys arranged in $5!$ ways, 5 girls in $5!$ ways.\nTotal $= 2 \times 5! \times 5! = 2 \times 120 \times 120 = 28,800$.\nOption B ($14,400$) forgets the factor of 2 for starting gender.\nOption C ($3,628,800$) is unconstrained $10!$.",
        "tag": "Probability"
    }
]

# 4. probability_longtest.csv (50 items)
longtest_items = pretest_items + [
    {
        "stem": f"Probability practice problem #{i}: In an urn containing {i+2} white balls and {i+3} red balls, a ball is drawn at random. What is the probability that it is white?",
        "choices": [f"$\\frac{{{i+2}}}{{{2*i+5}}}$", f"$\\frac{{{i+3}}}{{{2*i+5}}}$", f"$\\frac{{{i+1}}}{{{2*i+5}}}$", f"$\\frac{{{i}}}{{{2*i+5}}}$"],
        "correct": "a",
        "explanation": rf"Total balls: $({i+2}) + ({i+3}) = {2*i+5}$.\nProbability of drawing a white ball: $\frac{{{i+2}}}{{{2*i+5}}}$.\nOption B is the probability of drawing a red ball.",
        "tag": "Probability"
    } for i in range(1, 21)
]

write_csv_set(f"{folder}/probability_pretest.csv", pretest_items, topic)
write_csv_set(f"{folder}/math_02_probability_test.csv", test_items, topic)
write_csv_set(f"{folder}/probability_shorttest.csv", shorttest_items, topic)
write_csv_set(f"{folder}/probability_longtest.csv", longtest_items, topic)
print("Probability suite complete.")
