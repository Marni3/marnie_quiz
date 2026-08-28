const fs = require('fs');
const path = require('path');

const geasDir = path.join(__dirname, '..', 'test-sets', 'learning-modules', 'geas');
const geasMasteryDir = path.join(__dirname, '..', 'test-sets', 'learning-modules', 'geas', 'mastery');

// ==========================================
// MODULE 3: geas-10-03 (Part 3 - Licensure Ratings, Seals, Penal Provisions & Reciprocity)
// ==========================================
const mod3 = {
  id: "geas-10-03",
  code: "GEAS 10-03",
  domain: "GEAS",
  topicCode: "GEAS-10",
  topicTitle: "ECE Laws, Ethics & Contracts (RA 9292)",
  subtopicTitle: "Licensure Ratings, PECE/Board Seals, Penal Provisions & Foreign Reciprocity",
  order: 3,
  pairedQuizSetId: "geas-10-03-mastery",
  toc: [
    { id: "sec-prereq-bridges", title: "1. Introduction & Cross-Subject Connections", level: 2 },
    { id: "sec-theory", title: "2. Lesson Proper: Exam Grading, Official Seals & Legal Penalties", level: 2 },
    { id: "sec-formulas", title: "3. Master Summary of Dimensions, Fines & Pass Criteria", level: 2 },
    { id: "sec-visualizer", title: "4. Interactive PECE vs Board Seal Dimension Comparator", level: 2 },
    { id: "sec-terminology", title: "5. Key Statutory Terms & Legal Definitions", level: 2 },
    { id: "sec-dual-method", title: "6. Worked Board Exam Scoring & Legal Problem Scenarios", level: 2 },
    { id: "sec-calculator", title: "7. Board Exam Speed Techniques: Seal Dimension & Penalty Rules", level: 2 },
    { id: "sec-concept-checks", title: "8. In-Line Concept Checks", level: 2 },
    { id: "sec-mastery-challenge", title: "9. Paired Mastery Challenge Exam", level: 2 }
  ],
  prerequisiteBridge: {
    priorModuleId: "geas-10-02",
    text: "Following the board structure and practice categories in GEAS 10-02, we conclude R.A. 9292 with the strict licensure rating criteria, the geometric specifications of the PECE and Board dry seals, penal provisions, foreign reciprocity, and the 2-understudy rule for foreign consultants."
  },
  crossSubjectBridges: [
    {
      targetDomain: "EST",
      targetTopicCode: "EST-01",
      badgeText: "GEAS → EST",
      description: "NTC commercial broadcast permit applications require engineering drawings bearing the official PECE dry seal adhering strictly to the 48 mm / 32 mm dimensional standard under Section 29."
    },
    {
      targetDomain: "GEAS",
      targetTopicCode: "GEAS-01",
      badgeText: "GEAS → GEAS",
      description: "Engineers drafting commercial procurement or construction contracts must integrate the mandatory penal liabilities (₱100K–₱1M fine / 6 mos–6 yrs imprisonment) for unauthorized engineering work."
    }
  ],
  theory: {
    mentalAnchor: "Passing the board exam requires General Average ≥ 70% with no subject < 70% (removal exam allowed if average ≥ 70% and lowest subject is 60%–69%). Results are released in 15 days. PECE seal is 48 mm outer / 32 mm inner, while Board seal is 48 mm outer / 28 mm inner. Section 35 penalizes violations with ₱100,000–₱1,000,000 fine and/or 6 months–6 years imprisonment.",
    contentMarkdown: `### 1. Licensure Examination Ratings & Passing Criteria (Section 16)

Section 16 sets the statutory standards for determining whether an examinee passes the Electronics Engineer (ECE) or Electronics Technician (ECT) licensure examinations:

| Examination Outcome | Statutory Criteria Under Section 16 | Legal Result & Action Required |
| :--- | :--- | :--- |
| **PASSED** | **General Weighted Average $\\ge 70\\%$** AND **no score below $70\\%$** in any individual subject | Issued Certificate of Registration and Professional ID upon taking oath. |
| **CONDITIONALLY PASSED (Removal Exam)** | **General Weighted Average $\\ge 70\\%$**, but with a score below $70\\%$ in one or more subjects, provided **no subject score is below $60\\%$** | Must take a removal examination in the failed subject(s) within **two (2) years**. Passing requires $\\ge 70\\%$ in the removal subject. |
| **FAILED** | **General Weighted Average $< 70\\%$** OR **any individual subject score $< 60\\%$** | Must retake the entire licensure examination. |

- **Release of Results (Section 17)**: The Board and the Commission must release the official licensure examination results within **fifteen (15) days** after the last day of the examination.

---

### 2. Official Seal Specifications (Section 29)

Section 29 mandates that all Professional Electronics Engineers (PECE) must obtain and use an official dry seal of the prescribed dimensions and visual layout. The statute specifies two distinct official seals:

#### A. Seal of a Professional Electronics Engineer (PECE)
- **Shape**: Two concentric circles.
- **Outer Circle Diameter**: **$48\\text{ mm}$**
- **Inner Circle Diameter**: **$32\\text{ mm}$**
- **Upper Annular Space**: Bears the words **\`PROFESSIONAL ELECTRONICS ENGINEER\`**
- **Lower Annular Space**: Bears the word **\`PHILIPPINES\`**
- **Inner Circle (Upper Portion)**: Symbol of an **atom with a nucleus and electrons**
- **Inner Circle (Middle Diametral Space)**: Horizontal space bearing **\`LICENSE NO. 0000000\`**
- **Inner Circle (Lower Portion)**: Full name of the PECE (e.g. **\`JUAN DE LA CRUZ\`**)

#### B. Seal of the Professional Regulatory Board of Electronics Engineering (BECE)
- **Shape**: Two concentric circles.
- **Outer Circle Diameter**: **$48\\text{ mm}$**
- **Inner Circle Diameter**: **$28\\text{ mm}$** *(Note: $4\\text{ mm}$ smaller inner circle than the PECE seal!)*
- **Upper Annular Space**: Bears **\`BOARD OF ELECTRONICS ENGINEERING\`**
- **Lower Annular Space**: Bears **\`PROFESSIONAL REGULATION COMMISSION\`**
- **Color Specifications**:
  - Outer and inner rings filled with **orange** with boundaries in **navy blue**.
  - Text in **black** with a **white** background.
  - Inner circle filled with a **navy blue** background.
  - Atom in **white** with the nucleus and electrons in **red**.

---

### 3. Exemptions from Examination & Foreign Reciprocity

#### A. Exemption from Examination (Section 26)
Foreign electronics professionals may be issued a **Special Temporary Permit** to work in the Philippines without taking the licensure examination under strict statutory safeguards:
1. **No Filipino Available**: Certified that no qualified Filipino professional is available for the specialized engagement.
2. **Specific Contract**: Employment is strictly temporary and limited to the designated project/contract.
3. **Mandatory 2-Understudy Rule**: For every foreign professional hired, the employer must employ at least **two (2) Filipino registered engineers/technicians** as understudies/counterparts.
4. **No Private Practice**: The foreigner shall **not** engage in independent private practice.
5. **Validity of Special Permit**: Valid for **six (6) months** and renewable for another 6 months upon valid justification.

#### B. Foreign Reciprocity (Section 33)
No foreign citizen may take the PRC licensure examination or be registered as a PECE, ECE, or ECT unless the country or state of which they are a citizen **admits citizens of the Philippines to practice electronics engineering on the same basis as its own citizens** (demonstrated via international treaty, agreement, or certified reciprocal law).

---

### 4. Penal Provisions (Section 35)

Section 35 establishes strict criminal and financial penalties for violations of the Act:

- **Financial Penalty (Fine)**: Not less than **₱100,000** nor more than **₱1,000,000** (PHP 100K to 1M).
- **Penal Penalty (Imprisonment)**: Not less than **six (6) months** nor more than **six (6) years**.
- **Discretion**: The court may impose both the fine and imprisonment.

#### Penalized Acts:
1. Practicing without a valid Certificate of Registration and Professional ID.
2. Presenting or attempting to use the license, ID, or seal of another person.
3. Giving false or forged evidence to the Board to obtain a license.
4. Impersonating a registered PECE, ECE, or ECT.
5. Using a revoked or suspended Certificate/ID or using an official seal while suspended.
6. Aiding or abetting unauthorized persons in illegal electronics practice.
7. Any violation of R.A. 9292, its IRR, the Code of Ethics, or the Code of Technical Standards.

---

### 5. Other Critical Section Provisions

- **Section 24 (Reinstatement of License)**: The Board may reinstate a revoked Certificate of Registration and Professional ID after the expiration of **two (2) years** from the date of revocation, upon proper application and showing of good moral cause.
- **Section 30 (Code of Ethics & Technical Standards)**: Promulgated and updated by the Accredited Professional Organization (APO / IECEP) and adopted by the Board.
- **Section 32 (Integrated and Accredited Professional Organization)**: There shall be only **one (1) integrated and accredited national organization** of PECEs, ECEs, and ECTs in the country (IECEP).`
  },
  formulas: [
    {
      id: "f-geas10-07",
      title: "Licensure Examination Passing Criteria (Section 16)",
      formula: "$$\\text{PASSED} \\iff \\text{GWA} \\ge 70\\% \\quad \\land \\quad \\forall i, \\; \\text{Score}_i \\ge 70\\%$$",
      note: "Removal exam granted if GWA ≥ 70% and all subject scores ≥ 60%."
    },
    {
      id: "f-geas10-08",
      title: "PECE vs Board Seal Dimensional Invariant (Section 29)",
      formula: "$$\\text{PECE Seal}: \\; D_{\\text{out}} = 48\\text{ mm}, \\; D_{\\text{in}} = 32\\text{ mm} \\quad \\Big| \\quad \\text{Board Seal}: \\; D_{\\text{out}} = 48\\text{ mm}, \\; D_{\\text{in}} = 28\\text{ mm}$$",
      note: "PECE inner circle is 32 mm; Board inner circle is 28 mm."
    },
    {
      id: "f-geas10-09",
      title: "Foreign Consultant Understudy & Permit Rule (Section 26)",
      formula: "$$\\text{Ratio} = \\frac{2 \\text{ Filipino Understudies}}{1 \\text{ Foreign Consultant}} \\quad | \\quad \\text{Permit Validity} = 6 \\text{ months (renewable)}$$",
      note: "Foreigner is strictly prohibited from engaging in private practice."
    }
  ],
  visualizer: {
    archetype: "stepper",
    title: "Interactive Official Seal & Licensing Standards Inspector",
    description: "Compare the geometric dimensions, text inscriptions, and visual layouts of the PECE Dry Seal versus the PRB-ECE Board Seal.",
    config: {
      controls: [
        { id: "sealType", label: "Select Seal (1: PECE Seal 48mm/32mm, 2: Board Seal 48mm/28mm)", min: 1, max: 2, step: 1, defaultValue: 1 }
      ],
      initialParams: { sealType: 1 }
    }
  },
  terms: [
    {
      term: "Section 16 (Licensure Ratings)",
      symbol: "Sec. 16",
      definition: "Passing requirement: GWA ≥ 70% with no subject below 70%. Removal exam allowed if lowest score is 60%–69%.",
      keywordTrigger: "GWA ≥ 70% / No score < 70% / Removal if 60%–69%"
    },
    {
      term: "Seal of PECE",
      symbol: "Sec. 29",
      definition: "Official dry seal with 48 mm outer diameter and 32 mm inner diameter bearing atom and license number.",
      keywordTrigger: "48 mm outer / 32 mm inner / Atom / LICENSE NO."
    },
    {
      term: "Seal of the Board (BECE)",
      symbol: "Sec. 29",
      definition: "Official seal with 48 mm outer diameter and 28 mm inner diameter with navy blue, orange, and red colors.",
      keywordTrigger: "48 mm outer / 28 mm inner / Orange & Navy Blue"
    },
    {
      term: "Penal Provision (Section 35)",
      symbol: "Sec. 35",
      definition: "Fines of ₱100,000 to ₱1,000,000 and/or imprisonment of 6 months to 6 years.",
      keywordTrigger: "₱100k to ₱1M / 6 months to 6 years"
    },
    {
      term: "Foreign Understudy Rule",
      symbol: "Sec. 26",
      definition: "Requires employing at least 2 Filipino registered professionals as counterparts for every foreign consultant.",
      keywordTrigger: "2 Filipino understudies per foreigner / 6 months permit"
    },
    {
      term: "Reinstatement of License",
      symbol: "Sec. 24",
      definition: "Revoked license may be reinstated after 2 years upon application and proof of good moral character.",
      keywordTrigger: "Reinstatement after 2 years"
    }
  ],
  examples: [
    {
      id: "ex-geas10-03-01",
      title: "Licensure Scoring Condition Analysis",
      prompt: "An examinee takes the 4-subject ECE Licensure Examination and obtains the following scores: Math = 82%, GEAS = 78%, Electronics = 71%, EST = 64%. The general weighted average is 73.75%. What is the examinee's official status under Section 16 of R.A. 9292?",
      formalSolution: "Step 1: Check General Weighted Average (GWA). The GWA is 73.75%, which is $\\ge 70\\%$.\nStep 2: Check individual subject scores. Math (82%), GEAS (78%), and Electronics (71%) are all $\\ge 70\\%$. However, EST is 64%, which is below 70%.\nStep 3: Check condition for removal examination: The lowest subject score (EST = 64%) is not below 60%.\nStep 4: Under Section 16, the examinee is given a conditional pass with a removal examination in EST to be taken within 2 years.",
      shortcutSolution: "Average is $\\ge 70\\%$ and lowest subject is between 60% and 69% $\\to$ Conditioned (Removal Exam in EST).",
      finalAnswer: "Conditionally Passed (Removal examination in EST within 2 years)."
    },
    {
      id: "ex-geas10-03-02",
      title: "Seal Diameter Trap: PECE vs Board Seal",
      prompt: "What is the diameter of the inner circle of the official dry seal of a Professional Electronics Engineer (PECE), and how does it compare to the inner circle diameter of the Board of Electronics Engineering seal?",
      formalSolution: "Step 1: Refer to Section 29 of R.A. 9292 for official seal dimensions.\nStep 2: Both seals have an identical outer circle diameter of 48 mm.\nStep 3: The PECE dry seal has an inner circle measuring 32 mm in diameter.\nStep 4: The Board of ECE seal has an inner circle measuring 28 mm in diameter.\nStep 5: The PECE inner circle is 32 mm (which is 4 mm larger than the Board seal's 28 mm inner circle).",
      shortcutSolution: "Outer is always 48 mm. Inner: PECE = 32 mm, Board = 28 mm.",
      finalAnswer: "PECE inner diameter is 32 mm; Board inner diameter is 28 mm."
    }
  ],
  calculatorShortcuts: [
    {
      calculatorModel: "Karce KC-S991 / Canon F-789SGA",
      topic: "Scoring & Penalty Recall",
      shortcutName: "Numerical Constants of Section 16, 26, 29, 35",
      keystrokeSequence: ["MODE", "1"],
      explanation: "Memory table: Passing = 70% avg, 70% min subject; Removal threshold = 60%; Results = 15 days; Reinstatement = 2 years; Understudies = 2 Filipinos; PECE Seal = 48mm / 32mm; Board Seal = 48mm / 28mm; Fines = 100K to 1M; Prison = 6 mos to 6 yrs."
    }
  ],
  conceptChecks: [
    {
      id: "cc-geas10-03-01",
      questionText: "Within how many days after the last day of the examination must the PRC and Board of ECE release the official licensure results?",
      options: [
        { text: "Within 15 days", isCorrect: true, distractorReason: "Correct: Section 17 mandates release of results within 15 days." },
        { text: "Within 30 days", isCorrect: false, distractorReason: "Overstates the statutory window." },
        { text: "Within 3 days", isCorrect: false, distractorReason: "Understates the statutory window." },
        { text: "Within 60 days", isCorrect: false, distractorReason: "Incorrect." }
      ],
      directExplanation: "Section 17 requires the Board and Commission to release the examination results within fifteen (15) days after the last day of the examination."
    },
    {
      id: "cc-geas10-03-02",
      questionText: "What are the outer and inner circle diameters of the official dry seal of a Professional Electronics Engineer (PECE)?",
      options: [
        { text: "48 mm outer diameter and 32 mm inner diameter", isCorrect: true, distractorReason: "Correct: Section 29 specifies 48 mm outer / 32 mm inner." },
        { text: "48 mm outer diameter and 28 mm inner diameter", isCorrect: false, distractorReason: "48 mm / 28 mm is the dimension of the Board of ECE seal." },
        { text: "50 mm outer diameter and 30 mm inner diameter", isCorrect: false, distractorReason: "Incorrect dimensions." },
        { text: "40 mm outer diameter and 25 mm inner diameter", isCorrect: false, distractorReason: "Incorrect dimensions." }
      ],
      directExplanation: "Section 29 specifies that the PECE dry seal has an outer diameter of 48 mm and an inner diameter of 32 mm."
    },
    {
      id: "cc-geas10-03-03",
      questionText: "What is the penalty prescribed under Section 35 of R.A. 9292 for practicing electronics engineering without a valid license?",
      options: [
        { text: "Fine of ₱100,000 to ₱1,000,000 and/or imprisonment of 6 months to 6 years", isCorrect: true, distractorReason: "Correct: Section 35 penalizes violations with ₱100k–₱1M fine and/or 6 mos–6 yrs imprisonment." },
        { text: "Fine of ₱10,000 to ₱50,000 and/or imprisonment of 1 month to 6 months", isCorrect: false, distractorReason: "These were old penalties under the repealed RA 5734." },
        { text: "Fine of ₱500,000 and community service for 30 days", isCorrect: false, distractorReason: "Incorrect penalty formulation." },
        { text: "Administrative reprimand with no financial fine", isCorrect: false, distractorReason: "Violates the statutory penal mandate." }
      ],
      directExplanation: "Section 35 prescribes a fine of not less than ₱100,000 nor more than ₱1,000,000, or imprisonment of not less than 6 months nor more than 6 years, or both."
    },
    {
      id: "cc-geas10-03-04",
      questionText: "How many Filipino registered professionals must be employed as understudies/counterparts for every foreign consultant hired under Section 26?",
      options: [
        { text: "At least two (2) Filipino professionals", isCorrect: true, distractorReason: "Correct: Section 26 mandates a minimum of 2 Filipino understudies per foreign specialist." },
        { text: "At least one (1) Filipino professional", isCorrect: false, distractorReason: "Understates the statutory ratio." },
        { text: "At least five (5) Filipino professionals", isCorrect: false, distractorReason: "Overstates the statutory ratio." },
        { text: "No understudies are required if the foreigner pays an accreditation fee", isCorrect: false, distractorReason: "Understudies are a strict statutory requirement." }
      ],
      directExplanation: "Section 26 mandates that at least two (2) Filipino professionals shall be employed as understudies for every foreign professional hired."
    }
  ]
};

// ==========================================
// MASTERY 3: geas-10-03-mastery (25 Decoupled Legal & Statutory Questions)
// ==========================================
const mastery3 = {
  moduleId: "geas-10-03",
  moduleCode: "GEAS 10-03",
  title: "GEAS 10-03 Mastery Challenge: Licensure Ratings, Seals, Penal Provisions & Reciprocity",
  description: "Comprehensive 25-item decoupled board examination challenge covering Section 16 passing grades, Section 29 seal dimensions, Section 35 penal provisions, and Section 33 reciprocity under R.A. 9292.",
  totalQuestions: 25,
  timeLimitMinutes: 30,
  questions: [
    {
      id: "q-geas10-03-01",
      promptText: "To pass the Electronics Engineer Licensure Examination, what ratings must an examinee obtain under Section 16?",
      choiceA: "A general weighted average of at least 70%, with no rating below 70% in any subject",
      choiceB: "A general weighted average of at least 75%, with no rating below 50% in any subject",
      choiceC: "A general weighted average of at least 60%, with no rating below 50% in any subject",
      choiceD: "A score of at least 80% in Math and at least 60% in other subjects",
      correctChoice: "A",
      explanation: "Section 16 requires a general weighted average of at least 70%, with no rating below 70% in any subject."
    },
    {
      id: "q-geas10-03-02",
      promptText: "Under what condition is an examinee given a removal examination in a failed subject instead of failing the entire exam?",
      choiceA: "If the general weighted average is at least 70%, but one or more subjects are below 70%, provided no subject is below 60%",
      choiceB: "If the general weighted average is at least 65% with any score",
      choiceC: "If the examinee has a GPA of 1.0 in college",
      choiceD: "If the examinee is a first-time taker regardless of score",
      correctChoice: "A",
      explanation: "Section 16 provides that if the average is $\\ge 70\\%$, but any subject is $< 70\\%$, a removal exam is allowed provided no subject is $< 60\\%$."
    },
    {
      id: "q-geas10-03-03",
      promptText: "Within what maximum time period must an examinee take the removal examination for a conditioned subject under Section 16?",
      choiceA: "Within two (2) years from the date of the examination",
      choiceB: "Within six (6) months from the date of the examination",
      choiceC: "Within five (5) years from the date of the examination",
      choiceD: "Within thirty (30) days from the release of results",
      correctChoice: "A",
      explanation: "Section 16 states that the removal examination must be taken within two (2) years from the date of the examination."
    },
    {
      id: "q-geas10-03-04",
      promptText: "Under Section 17, within how many days must the Board and Commission release the official results of the licensure examination?",
      choiceA: "Within fifteen (15) days after the last day of the examination",
      choiceB: "Within thirty (30) days after the examination",
      choiceC: "Within seven (7) days after the examination",
      choiceD: "Within sixty (60) days after the examination",
      correctChoice: "A",
      explanation: "Section 17 states: 'The Board and the Commission shall correct and release the results of the examination within fifteen (15) days after the last day of the examination.'"
    },
    {
      id: "q-geas10-03-05",
      promptText: "What are the outer and inner diameters of the official dry seal of a Professional Electronics Engineer (PECE) under Section 29?",
      choiceA: "48 mm outer diameter and 32 mm inner diameter",
      choiceB: "48 mm outer diameter and 28 mm inner diameter",
      choiceC: "50 mm outer diameter and 35 mm inner diameter",
      choiceD: "45 mm outer diameter and 30 mm inner diameter",
      correctChoice: "A",
      explanation: "Section 29 specifies that the PECE seal consists of two concentric circles with the outer measuring 48 mm in diameter and the inner measuring 32 mm in diameter."
    },
    {
      id: "q-geas10-03-06",
      promptText: "What are the outer and inner diameters of the official seal of the Board of Electronics Engineering (BECE)?",
      choiceA: "48 mm outer diameter and 28 mm inner diameter",
      choiceB: "48 mm outer diameter and 32 mm inner diameter",
      choiceC: "52 mm outer diameter and 30 mm inner diameter",
      choiceD: "40 mm outer diameter and 20 mm inner diameter",
      correctChoice: "A",
      explanation: "Section 29 specifies that the Board seal has an outside circle of 48 mm and an inner circle of 28 mm in diameter."
    },
    {
      id: "q-geas10-03-07",
      promptText: "What words are inscribed on the upper portion of the annular space of the PECE dry seal?",
      choiceA: "PROFESSIONAL ELECTRONICS ENGINEER",
      choiceB: "BOARD OF ELECTRONICS ENGINEERING",
      choiceC: "REPUBLIC OF THE PHILIPPINES",
      choiceD: "INSTITUTE OF ELECTRONICS ENGINEERS",
      correctChoice: "A",
      explanation: "Section 29 specifies that the upper portion of the annular space of the PECE seal bears 'PROFESSIONAL ELECTRONICS ENGINEER', and the lower portion bears 'PHILIPPINES'."
    },
    {
      id: "q-geas10-03-08",
      promptText: "What graphic symbol is placed on the upper portion of the inner circle of the PECE seal?",
      choiceA: "An atom with a nucleus and electrons",
      choiceB: "A transmission tower with microwave dishes",
      choiceC: "A transistor circuit schematic symbol",
      choiceD: "The Philippine national flag and eagle",
      correctChoice: "A",
      explanation: "Section 29 states that the inner circle features the appearance of an atom with a nucleus and electrons on the upper portion."
    },
    {
      id: "q-geas10-03-09",
      promptText: "What is the financial fine prescribed in Section 35 (Penal Provision) for any person who violates R.A. 9292?",
      choiceA: "Not less than ₱100,000 nor more than ₱1,000,000",
      choiceB: "Not less than ₱10,000 nor more than ₱50,000",
      choiceC: "Not less than ₱500,000 nor more than ₱5,000,000",
      choiceD: "Not less than ₱1,000 nor more than ₱10,000",
      correctChoice: "A",
      explanation: "Section 35 sets the fine at not less than ₱100,000 nor more than ₱1,000,000."
    },
    {
      id: "q-geas10-03-10",
      promptText: "What is the imprisonment period prescribed in Section 35 for violations of R.A. 9292?",
      choiceA: "Not less than six (6) months nor more than six (6) years",
      choiceB: "Not less than one (1) year nor more than twelve (12) years",
      choiceC: "Not less than thirty (30) days nor more than one (1) year",
      choiceD: "Life imprisonment without parole",
      correctChoice: "A",
      explanation: "Section 35 sets the imprisonment term at not less than six (6) months nor more than six (6) years."
    },
    {
      id: "q-geas10-03-11",
      promptText: "How long after revocation of a Certificate of Registration and Professional ID may the Board reinstate the license under Section 24?",
      choiceA: "After the expiration of two (2) years from the date of revocation",
      choiceB: "After six (6) months from revocation",
      choiceC: "After five (5) years from revocation",
      choiceD: "Revoked licenses can never be reinstated under any circumstance",
      correctChoice: "A",
      explanation: "Section 24 states that the Board may reinstate a revoked Certificate of Registration and ID after the expiration of two (2) years."
    },
    {
      id: "q-geas10-03-12",
      promptText: "Under Section 26, how many Filipino registered professionals must be employed as understudies/counterparts for every foreign professional hired?",
      choiceA: "At least two (2) Filipino professionals",
      choiceB: "At least one (1) Filipino professional",
      choiceC: "At least three (3) Filipino professionals",
      choiceD: "At least five (5) Filipino professionals",
      correctChoice: "A",
      explanation: "Section 26 mandates that at least two (2) Filipino professionals shall be employed as understudies for every foreign professional hired."
    },
    {
      id: "q-geas10-03-13",
      promptText: "What is the maximum initial validity period of a Special Temporary Permit issued to a foreign electronics professional under Section 26?",
      choiceA: "Six (6) months, renewable every 6 months",
      choiceB: "One (1) year, non-renewable",
      choiceC: "Three (3) years automatically",
      choiceD: "Thirty (30) days only",
      correctChoice: "A",
      explanation: "Section 26 specifies that the Special Temporary Permit is valid for six (6) months and can be renewed every 6 months."
    },
    {
      id: "q-geas10-03-14",
      promptText: "Can a foreign electronics professional holding a Special Permit engage in independent private practice in the Philippines under Section 26?",
      choiceA: "No, foreign professionals are strictly prohibited from engaging in private practice",
      choiceB: "Yes, provided they pay income tax to the Bureau of Internal Revenue",
      choiceC: "Yes, provided they partner with a local law firm",
      choiceD: "Yes, if they have resided in the Philippines for 3 months",
      correctChoice: "A",
      explanation: "Section 26 expressly states that the foreigner shall not engage in private practice on their own account."
    },
    {
      id: "q-geas10-03-15",
      promptText: "What is the legal principle in Section 33 requiring foreign countries to allow Filipino engineers to practice before their citizens can practice in the Philippines?",
      choiceA: "Foreign Reciprocity",
      choiceB: "Extradition Doctrine",
      choiceC: "Diplomatic Immunity",
      choiceD: "Territorial Sovereignty",
      correctChoice: "A",
      explanation: "Section 33 is titled 'Foreign Reciprocity'."
    },
    {
      id: "q-geas10-03-16",
      promptText: "Which organization is recognized by law as the sole Integrated and Accredited Professional Organization (APO) for electronics engineers under Section 32?",
      choiceA: "Institute of Electronics Engineers of the Philippines (IECEP)",
      choiceB: "Philippine Institute of Civil Engineers (PICE)",
      choiceC: "Institute of Integrated Electrical Engineers (IIEE)",
      choiceD: "Philippine Society of Mechanical Engineers (PSME)",
      correctChoice: "A",
      explanation: "Section 32 recognizes IECEP as the sole integrated and accredited professional organization (APO) for PECEs, ECEs, and ECTs."
    },
    {
      id: "q-geas10-03-17",
      promptText: "Under Section 31, what programs are established for maintaining and upgrading professional competence?",
      choiceA: "Continuing Professional Education (CPE) / Continuing Professional Development (CPD)",
      choiceB: "Mandatory Military Conscription",
      choiceC: "Annual Re-examination in Calculus",
      choiceD: "Community Tree Planting Projects",
      correctChoice: "A",
      explanation: "Section 31 governs Continuing Professional Education (CPE) and/or Development Programs."
    },
    {
      id: "q-geas10-03-18",
      promptText: "What happens if a registered PECE uses their official dry seal after their Certificate of Registration has been suspended or revoked?",
      choiceA: "They are criminally liable under Section 35 with fines of ₱100k–₱1M and/or imprisonment of 6 months–6 years",
      choiceB: "They only receive a verbal warning from IECEP",
      choiceC: "They are charged a administrative late fee of ₱50",
      choiceD: "Their seal is confiscated with no further penalties",
      correctChoice: "A",
      explanation: "Section 35 explicitly lists using an official seal with a revoked/suspended license as a penal offense subject to ₱100K–₱1M fine and/or 6 mos–6 yrs imprisonment."
    },
    {
      id: "q-geas10-03-19",
      promptText: "What color fill is specified for the inner circle background in the official Seal of the Board of ECE under Section 29?",
      choiceA: "Navy blue background with a white atom and red nucleus/electrons",
      choiceB: "Pure bright yellow background with black text",
      choiceC: "Solid emerald green background with gold stars",
      choiceD: "Plain white background with grey shading",
      correctChoice: "A",
      explanation: "Section 29 specifies that the Board seal inner circle is filled with navy blue background, atom with white, and nucleus and electrons in red."
    },
    {
      id: "q-geas10-03-20",
      promptText: "What colors are specified for the outer and inner rings of the official Seal of the Board of ECE?",
      choiceA: "Filled with orange with boundaries in navy blue",
      choiceB: "Filled with silver with boundaries in red",
      choiceC: "Filled with purple with boundaries in green",
      choiceD: "Filled with gold with boundaries in black",
      correctChoice: "A",
      explanation: "Section 29 specifies that the outer and inner rings of the Board seal are filled with orange with boundaries in navy blue."
    },
    {
      id: "q-geas10-03-21",
      promptText: "Under Section 34, what types of positions in government agencies require the services of registered and licensed PECEs, ECEs, and ECTs?",
      choiceA: "All positions whose duties involve the practice of electronics engineering or technical supervision of electronics systems",
      choiceB: "Only cabinet-level department secretaries",
      choiceC: "Only elected municipal mayors and councilors",
      choiceD: "Only Supreme Court associate justices",
      correctChoice: "A",
      explanation: "Section 34 states that all government positions with functions falling within the scope of practice of PECE, ECE, or ECT must be filled by licensed professionals."
    },
    {
      id: "q-geas10-03-22",
      promptText: "Under Section 36, which government agencies are mandated to assist the Board and Commission in enforcing R.A. 9292?",
      choiceA: "Law enforcement agencies, including the PNP, NBI, and public prosecutors",
      choiceB: "The Department of Agriculture and Bureau of Fisheries",
      choiceC: "The National Museum and Cultural Center",
      choiceD: "The Philippine Postal Corporation only",
      correctChoice: "A",
      explanation: "Section 36 requires law enforcement agencies of the national, provincial, and city governments to assist in enforcing the Act."
    },
    {
      id: "q-geas10-03-23",
      promptText: "If an examinee achieves scores of: Math = 70%, GEAS = 70%, Electronics = 70%, EST = 69%, with a GWA of 69.75%, what is their result?",
      choiceA: "Failed (GWA is below 70%, so the examinee must retake all subjects)",
      choiceB: "Passed with honors",
      choiceC: "Removal exam in EST only",
      choiceD: "Exempted from taking GEAS",
      correctChoice: "A",
      explanation: "Because the GWA (69.75%) is below 70%, the examinee fails the examination and cannot qualify for a removal exam."
    },
    {
      id: "q-geas10-03-24",
      promptText: "Which document serves as conclusive evidence that a person is legally authorized to practice electronics engineering in the Philippines?",
      choiceA: "Valid Certificate of Registration and Professional Identification Card issued by the Board and PRC",
      choiceB: "College diploma from an engineering school only",
      choiceC: "Transcript of records showing high math grades",
      choiceD: "Receipt of payment for review center tuition",
      correctChoice: "A",
      explanation: "Section 19 states that a Certificate of Registration and Professional Identification Card issued by the Board and PRC is conclusive evidence of authority to practice."
    },
    {
      id: "q-geas10-03-25",
      promptText: "Under Section 39, who has the primary authority to prepare and issue the Implementing Rules and Regulations (IRR) of R.A. 9292?",
      choiceA: "The Board of Electronics Engineering, subject to the approval of the Professional Regulation Commission",
      choiceB: "The Department of Transportation only",
      choiceC: "The Supreme Court of the Philippines",
      choiceD: "The Senate Committee on Education",
      correctChoice: "A",
      explanation: "Section 39 states that the Board, subject to the approval of the Commission, shall promulgate the Implementing Rules and Regulations."
    }
  ]
};

// Write Module 3 and Mastery 3
fs.writeFileSync(path.join(geasDir, 'geas-10-03.json'), JSON.stringify(mod3, null, 2), 'utf8');
fs.writeFileSync(path.join(geasMasteryDir, 'geas-10-03-mastery.json'), JSON.stringify(mastery3, null, 2), 'utf8');
console.log("Successfully generated GEAS 10-03 module and mastery challenge!");
