const fs = require('fs');
const path = require('path');

const geasDir = path.join(__dirname, '..', 'test-sets', 'learning-modules', 'geas');
const geasMasteryDir = path.join(__dirname, '..', 'test-sets', 'learning-modules', 'geas', 'mastery');

// ==========================================
// MODULE 2: geas-10-02 (Part 2 - Board of ECE, Powers, 3 Categories of Practice, Qualifications)
// ==========================================
const mod2 = {
  id: "geas-10-02",
  code: "GEAS 10-02",
  domain: "GEAS",
  topicCode: "GEAS-10",
  topicTitle: "ECE Laws, Ethics & Contracts (RA 9292)",
  subtopicTitle: "ECE Board Structure, Powers, 3 Categories of Practice & Qualifications",
  order: 2,
  pairedQuizSetId: "geas-10-02-mastery",
  toc: [
    { id: "sec-prereq-bridges", title: "1. Introduction & Cross-Subject Connections", level: 2 },
    { id: "sec-theory", title: "2. Lesson Proper: Board Structure, Powers & The 3 Professional Tiers", level: 2 },
    { id: "sec-formulas", title: "3. Master Summary of Board Governance & Practice Matrix", level: 2 },
    { id: "sec-visualizer", title: "4. Interactive Practice Scope & Board Appointment Simulator", level: 2 },
    { id: "sec-terminology", title: "5. Key Statutory Terms & Legal Definitions", level: 2 },
    { id: "sec-dual-method", title: "6. Worked Board Exam Practice Scope Scenarios", level: 2 },
    { id: "sec-calculator", title: "7. Board Exam Speed Techniques: Number & Year Memory Anchors", level: 2 },
    { id: "sec-concept-checks", title: "8. In-Line Concept Checks", level: 2 },
    { id: "sec-mastery-challenge", title: "9. Paired Mastery Challenge Exam", level: 2 }
  ],
  prerequisiteBridge: {
    priorModuleId: "geas-10-01",
    text: "Building upon the statutory origins and Article structure of R.A. 9292 from GEAS 10-01, we now examine the governance body (The Professional Regulatory Board of Electronics Engineering) and the explicit statutory boundaries separating PECE, ECE, and ECT practices."
  },
  crossSubjectBridges: [
    {
      targetDomain: "EST",
      targetTopicCode: "EST-02",
      badgeText: "GEAS → EST",
      description: "Broadcast station and telecommunication network plans, antenna tower structural layouts, and frequency assignment filings require mandatory review, signing, and sealing by a licensed PECE under Section 5."
    },
    {
      targetDomain: "ELECS",
      targetTopicCode: "ELEC-02",
      badgeText: "GEAS → ELECS",
      description: "Industrial plant control automation systems and commercial building electronic security/fire-alarm designs fall under Section 5(a) PECE sole signing authority and ECE project supervision."
    }
  ],
  theory: {
    mentalAnchor: "The Board consists of 1 Chairman + 2 Members (appointed by the President from 3 PRC recommendees chosen from 5 APO nominees). Board members serve a 3-year term (max 6 years total tenure) and must be PECEs with 10 years active practice. Only PECEs can sign/seal plans and offer consulting services.",
    contentMarkdown: `### 1. The Professional Regulatory Board of Electronics Engineering (PRB-ECE)

Article II (Sections 6 to 12) governs the creation, composition, qualifications, and administrative powers of the Board.

#### A. Composition and Appointment Flow (Section 6)
- **Structure**: Composed of a **Chairman** and **two (2) Members**.
- **Supervisory Body**: Supervised and administratively attached to the **Professional Regulation Commission (PRC)**.
- **Appointment Process**:
  1. The **Accredited Professional Organization (IECEP)** submits a list of **five (5) nominees** per position.
  2. The **PRC** screens the nominees and ranks a shortlist of **three (3) recommendees** per position.
  3. The **President of the Philippines** appoints the Chairman and Members from the shortlist.

$$\\text{IECEP (5 Nominees)} \\xrightarrow{\\text{Screens}} \\text{PRC (3 Recommendees)} \\xrightarrow{\\text{Appoints}} \\text{President of the Philippines}$$

#### B. Qualifications of Board Members (Section 8)
Every Member of the Board must meet the following mandatory criteria at the time of appointment:
1. **Citizenship**: Citizen and resident of the Philippines for **at least five (5) consecutive years** prior to appointment.
2. **Moral Standing**: Good moral character and integrity, with no conviction of any crime involving moral turpitude.
3. **License & Grade**: Holder of a valid Certificate of Registration and Professional ID as a **Professional Electronics Engineer (PECE)**.
4. **Organizational Standing**: Member in good standing of the Integrated and Accredited Professional Organization (APO / IECEP).
5. **Active Professional Practice**: In active practice of the electronics engineering profession for **at least ten (10) continuous years** prior to appointment, whether self-employed or in the government or private sector.
6. **No Academic/Review Pecuniary Conflict**: Must **not** be a member of the faculty of any school, college, or university where a regular course in ECE/ECT is taught, nor have any pecuniary interest in any such institution or review center. Any member must officially resign from teaching or review center activities before taking the oath of office.

#### C. Term of Office and Reappointment (Section 9)
- **Term Duration**: **Three (3) years** from the date of appointment or until their successors have been appointed and qualified.
- **Vacancies**: A vacancy occurring within a term is filled for the **unexpired portion** of the term only.
- **Reappointment Limit**: A member may be reappointed for another term, provided that the **total continuous tenure shall not exceed six (6) years**.

---

### 2. Powers and Functions of the Board (Section 7)

The Board is vested with comprehensive regulatory, administrative, and quasi-judicial powers:
1. **Administer & Enforce**: Administer all provisions of R.A. 9292 and administer professional oaths.
2. **Licensure & IDs**: Issue, suspend, revoke, or reinstate Certificates of Registration and Professional IDs for PECE, ECE, and ECT.
3. **Roster Maintenance**: Prepare and maintain an official comprehensive Roster of all PECEs, ECEs, and ECTs.
4. **Special Permits**: Issue, suspend, or cancel Special Permits to foreign electronics professionals under Section 26 and Section 33.
5. **Syllabi & Computerization**: Prescribe or revise the syllabi for licensure examination subjects and implement full computerization of the board exams.
6. **Academic Curriculum Standards**: Inspect schools, colleges, and universities offering ECE/ECT programs (in coordination with CHED and TESDA); recommend opening, upgrading, or closure of programs.
7. **National Building Code (PD 1096)**: Formulate guidelines and rules for electronic installations in buildings in coordination with DPWH.
8. **Subpoena Powers**: Conduct hearings on violations of R.A. 9292, Code of Ethics, and Technical Standards; issue *subpoena ad testificandum* (compelling witness testimony) and *subpoena duces tecum* (compelling document production).
9. **Appeals Window**: Decisions/resolutions of the Board are appealable to the PRC within **fifteen (15) days** from receipt. If no appeal is perfected within 15 days, the decision becomes final and executory.
10. **Annual Reports**: Submit an annual action plan and comprehensive report of activities at the beginning and close of each fiscal year.

---

### 3. The 3 Categories of Practice (Sections 4 & 5)

R.A. 9292 recognizes three distinct, hierarchically defined professional tiers:

- **1. Professional Electronics Engineer (PECE)**:
  - Highest professional grade.
  - Sole legal authority to sign and seal electronics engineering plans, specifications, reports, and schematics.
  - Authorized to render independent consulting services and expert witness testimonies.
  - Includes all rights and scope of an ECE.
- **2. Electronics Engineer (ECE)**:
  - Professional engineering tier.
  - Authorized for engineering design, principles, administration, supervision, and teaching.
  - Engineering supervision of Electronics Technicians (ECT).
  - *Cannot* sign and seal final permit documents or render independent consulting services.
- **3. Electronics Technician (ECT)**:
  - Technical operational tier.
  - Non-engineering operational tasks: installation, operation, maintenance, testing, and sales of electronics systems.

#### Comparison of Practice Boundaries:

| Professional Tier | Core Scope of Practice | Signature & Sealing Authority | Consulting Services | Minimum Academic / Prerequisite |
| :--- | :--- | :--- | :--- | :--- |
| **PECE** | Full engineering practice + consulting + highest technical leadership | **YES (Sole Legal Authority)** for all plans, specs, schematics, and reports | **YES** | Valid ECE + 7 years active practice (2 yrs significant work) + 3 PECE certs + En Banc interview |
| **ECE** | Engineering design, administration, supervision, testing, research, and teaching | **NO** (Cannot sign/seal final permit plans or contract documents) | **NO** (Only as part of a PECE-led consulting team) | BS Electronics Engineering (BSECE) + Passed PRC ECE Licensure Exam |
| **ECT** | Non-engineering technical operations, installation, calibration, testing, maintenance, sales | **NO** | **NO** | 2-year Technical Course OR $\ge 3$ years BSECE completion + Passed ECT Exam |`
  },
  formulas: [
    {
      id: "f-geas10-04",
      title: "Board Composition Formula",
      formula: "$$\\text{PRB-ECE} = 1 \\text{ Chairman} + 2 \\text{ Members} \\quad [\\text{Appointed by President of the Philippines}]$$",
      note: "Nomination flow: 5 APO Nominees → 3 PRC Recommendees → 1 Appointee."
    },
    {
      id: "f-geas10-05",
      title: "Board Member Experience & Tenure Rule",
      formula: "$$\\text{Experience} \\ge 10 \\text{ yrs active PECE practice} \\quad | \\quad \\text{Term} = 3 \\text{ yrs} \\quad | \\quad \\text{Max Tenure} \\le 6 \\text{ yrs}$$",
      note: "Must be a citizen/resident for at least 5 years prior to appointment."
    },
    {
      id: "f-geas10-06",
      title: "PECE Licensure Upgrade Formula",
      formula: "$$\\text{PECE Requirements} = \\text{Valid ECE} + 7 \\text{ yrs practice} \\; (2 \\text{ yrs significant work}) + 3 \\text{ PECE certs} + \\text{Board Oral Interview}$$",
      note: "Sole tier authorized to sign and seal electronics engineering plans."
    }
  ],
  visualizer: {
    archetype: "stepper",
    title: "Interactive ECE Professional Practice & Board Governance Matrix",
    description: "Toggle between the 3 Professional Tiers (PECE, ECE, ECT) and Board Governance criteria to inspect statutory rights and prerequisites.",
    config: {
      controls: [
        { id: "tierIndex", label: "Select Professional Tier (1: ECT, 2: ECE, 3: PECE, 4: Board Member)", min: 1, max: 4, step: 1, defaultValue: 3 }
      ],
      initialParams: { tierIndex: 3 }
    }
  },
  terms: [
    {
      term: "Professional Regulatory Board of Electronics Engineering (PRB-ECE)",
      symbol: "Sec. 6",
      definition: "The regulatory body under PRC composed of a Chairman and 2 Members appointed by the President.",
      keywordTrigger: "Chairman + 2 Members / Appointed by President / 3-year term"
    },
    {
      term: "PECE (Professional Electronics Engineer)",
      symbol: "Sec. 4 / Sec. 5",
      definition: "The highest professional tier authorized to render consulting services and sign/seal electronics plans.",
      keywordTrigger: "Sole authority to sign and seal / Consulting services / 7 years practice"
    },
    {
      term: "ECE (Electronics Engineer)",
      symbol: "Sec. 4 / Sec. 5",
      definition: "Licensed professional authorized for general electronics engineering practice, design, supervision, and teaching.",
      keywordTrigger: "General engineering practice / BSECE graduate / Licensure exam passer"
    },
    {
      term: "ECT (Electronics Technician)",
      symbol: "Sec. 4 / Sec. 5",
      definition: "Licensed professional performing non-engineering technical work, installation, operation, maintenance, and testing.",
      keywordTrigger: "Non-engineering technical work / Installation, maintenance, testing"
    },
    {
      term: "Tenure of Board Member",
      symbol: "Sec. 9",
      definition: "Term is 3 years with allowable reappointment up to a maximum continuous tenure of 6 years.",
      keywordTrigger: "3 years per term / Maximum 6 years total tenure"
    }
  ],
  examples: [
    {
      id: "ex-geas10-02-01",
      title: "Board Member Appointment Flow Scenario",
      prompt: "When a vacancy occurs in the Professional Regulatory Board of Electronics Engineering, how many names must the Accredited Professional Organization (IECEP) submit to the PRC, and how many names does the PRC recommend to the President of the Philippines?",
      formalSolution: "Step 1: Check Section 6 of R.A. 9292 regarding Board composition and appointment.\nStep 2: The APO (IECEP) must submit a list of five (5) nominees for each position.\nStep 3: The PRC screens the 5 nominees and submits a ranked list of three (3) recommendees per position to the President of the Philippines.\nStep 4: The President chooses and appoints 1 individual per position.",
      shortcutSolution: "Remember the 5-3-1 rule: 5 Nominees (APO) $\\to$ 3 Recommendees (PRC) $\\to$ 1 Appointed (President).",
      finalAnswer: "5 nominees from the APO, 3 recommendees from the PRC."
    },
    {
      id: "ex-geas10-02-02",
      title: "Practice Scope Authority Problem: Signing Building Telecom Plans",
      prompt: "An engineer who passed the PRC Electronics Engineer Licensure Examination 3 years ago is hired to design the telecommunications distribution cabling and fire alarm system for a 20-story commercial building. Can this engineer legally sign and seal the plans for permit issuance?",
      formalSolution: "Step 1: Inspect Section 5(a) of R.A. 9292 governing the nature and scope of practice of PECE vs ECE.\nStep 2: Section 5 states that while an ECE may perform engineering design, the sole legal authority to sign and seal electronics engineering plans, specifications, reports, and building permit documents is strictly restricted to a licensed Professional Electronics Engineer (PECE).\nStep 3: An ECE (with only 3 years of experience) cannot sign and seal building permit plans; they must be reviewed, signed, and sealed by a PECE.",
      shortcutSolution: "Signing and sealing = Exclusively PECE. An ECE can never sign and seal plans.",
      finalAnswer: "No. Only a registered and licensed Professional Electronics Engineer (PECE) has the legal authority to sign and seal electronics plans."
    }
  ],
  calculatorShortcuts: [
    {
      calculatorModel: "Karce KC-S991 / Canon F-789SGA",
      topic: "Board Qualifications & Numbers Recall",
      shortcutName: "Key Numerical Quantities of R.A. 9292",
      keystrokeSequence: ["MODE", "1"],
      explanation: "Key figures: Board composition = 1 + 2 = 3; Board term = 3 yrs (max 6 yrs); Board experience = 10 yrs PECE practice; PECE upgrade = 7 yrs practice (2 yrs significant work) + 3 PECE certs; Appeals window = 15 days."
    }
  ],
  conceptChecks: [
    {
      id: "cc-geas10-02-01",
      questionText: "How many members compose the Professional Regulatory Board of Electronics Engineering (PRB-ECE)?",
      options: [
        { text: "One Chairman and two Members", isCorrect: true, distractorReason: "Correct: Section 6 establishes 1 Chairman + 2 Members (total of 3)." },
        { text: "One Chairman and four Members", isCorrect: false, distractorReason: "That is the composition of the PRC Commission, not PRB-ECE." },
        { text: "One Chairman and one Vice-Chairman", isCorrect: false, distractorReason: "There is no statutory Vice-Chairman." },
        { text: "Five Members including the Chairman", isCorrect: false, distractorReason: "Overstates the Board size." }
      ],
      directExplanation: "Section 6 specifies that the Board of Electronics Engineering is composed of a Chairman and two (2) Members."
    },
    {
      id: "cc-geas10-02-02",
      questionText: "What is the minimum number of years of active professional practice required for a PECE to qualify as a member of the Board of ECE?",
      options: [
        { text: "At least 10 years", isCorrect: true, distractorReason: "Correct: Section 8(e) requires at least 10 continuous years of active practice as a PECE." },
        { text: "At least 5 years", isCorrect: false, distractorReason: "5 years is the minimum citizenship/residency requirement." },
        { text: "At least 7 years", isCorrect: false, distractorReason: "7 years is the requirement to upgrade from ECE to PECE." },
        { text: "At least 15 years", isCorrect: false, distractorReason: "Exceeds the statutory minimum." }
      ],
      directExplanation: "Section 8(e) explicitly requires at least ten (10) years of active practice of the electronics engineering profession prior to appointment."
    },
    {
      id: "cc-geas10-02-03",
      questionText: "What is the standard term of office for a member of the Board of ECE, and what is the maximum allowable tenure including reappointment?",
      options: [
        { text: "3 years per term, maximum 6 years total tenure", isCorrect: true, distractorReason: "Correct: Section 9 specifies 3 years per term, maximum 6 years continuous tenure." },
        { text: "2 years per term, maximum 4 years total tenure", isCorrect: false, distractorReason: "Understates the statutory term." },
        { text: "5 years per term, maximum 10 years total tenure", isCorrect: false, distractorReason: "Overstates the statutory term." },
        { text: "4 years per term, maximum 8 years total tenure", isCorrect: false, distractorReason: "Incorrect term length." }
      ],
      directExplanation: "Section 9 mandates a term of three (3) years with a maximum continuous tenure not exceeding six (6) years."
    },
    {
      id: "cc-geas10-02-04",
      questionText: "Which professional category has the sole legal authority to sign and seal electronics engineering plans, specifications, and reports?",
      options: [
        { text: "Professional Electronics Engineer (PECE)", isCorrect: true, distractorReason: "Correct: Section 5 restricts signing and sealing exclusively to PECEs." },
        { text: "Electronics Engineer (ECE)", isCorrect: false, distractorReason: "ECEs can design and supervise, but cannot sign/seal plans." },
        { text: "Electronics Technician (ECT)", isCorrect: false, distractorReason: "ECTs perform non-engineering operational tasks." },
        { text: "Master Electrician", isCorrect: false, distractorReason: "Governed under the Electrical Engineering Law (RA 7920)." }
      ],
      directExplanation: "Section 5 of R.A. 9292 reserves the authority to sign and seal electronics plans, schematics, and reports solely to registered PECEs."
    }
  ]
};

// ==========================================
// MASTERY 2: geas-10-02-mastery (25 Decoupled Legal & Statutory Questions)
// ==========================================
const mastery2 = {
  moduleId: "geas-10-02",
  moduleCode: "GEAS 10-02",
  title: "GEAS 10-02 Mastery Challenge: Board Structure, Powers & Categories of Practice",
  description: "Comprehensive 25-item decoupled board examination challenge covering PRB-ECE composition, qualifications, quasi-judicial powers, and the 3 professional practice tiers under R.A. 9292.",
  totalQuestions: 25,
  timeLimitMinutes: 30,
  questions: [
    {
      id: "q-geas10-02-01",
      promptText: "Who appoints the Chairman and Members of the Professional Regulatory Board of Electronics Engineering?",
      choiceA: "The President of the Philippines",
      choiceB: "The Chairman of the Professional Regulation Commission",
      choiceC: "The National President of IECEP",
      choiceD: "The Secretary of the Department of Information and Communications Technology",
      correctChoice: "A",
      explanation: "Section 6 mandates that the Chairman and two Members of the Board are appointed by the President of the Philippines."
    },
    {
      id: "q-geas10-02-02",
      promptText: "How many nominees per position does the Accredited Professional Organization (IECEP) submit to the PRC for a Board vacancy?",
      choiceA: "Five (5) nominees",
      choiceB: "Three (3) nominees",
      choiceC: "Two (2) nominees",
      choiceD: "Ten (10) nominees",
      correctChoice: "A",
      explanation: "Section 6 states that the APO submits five (5) nominees per position to the Commission."
    },
    {
      id: "q-geas10-02-03",
      promptText: "From the list of nominees submitted by the APO, how many recommendees does the PRC rank and submit to the President of the Philippines?",
      choiceA: "Three (3) recommendees",
      choiceB: "Five (5) recommendees",
      choiceC: "Two (2) recommendees",
      choiceD: "Four (4) recommendees",
      correctChoice: "A",
      explanation: "Section 6 states that the Commission chooses and ranks three (3) recommendees per position for the President's selection."
    },
    {
      id: "q-geas10-02-04",
      promptText: "To qualify as a Member of the Board of ECE, a person must have been a citizen and resident of the Philippines for at least how many consecutive years prior to appointment?",
      choiceA: "Five (5) consecutive years",
      choiceB: "Three (3) consecutive years",
      choiceC: "Ten (10) consecutive years",
      choiceD: "Seven (7) consecutive years",
      correctChoice: "A",
      explanation: "Section 8(a) requires a Board member to be a citizen and resident of the Philippines for at least five (5) consecutive years prior to appointment."
    },
    {
      id: "q-geas10-02-05",
      promptText: "Which professional registration grade must an individual hold to be eligible for appointment to the Board of ECE?",
      choiceA: "Professional Electronics Engineer (PECE)",
      choiceB: "Electronics Engineer (ECE)",
      choiceC: "Electronics Technician (ECT)",
      choiceD: "Consulting Telecommunications Engineer (CTE)",
      correctChoice: "A",
      explanation: "Section 8(c) specifies that a Board member must be a holder of a valid Certificate of Registration and Professional ID as a PECE."
    },
    {
      id: "q-geas10-02-06",
      promptText: "What is the minimum required period of active practice in the electronics engineering profession for a prospective Board member?",
      choiceA: "At least ten (10) years",
      choiceB: "At least seven (7) years",
      choiceC: "At least five (5) years",
      choiceD: "At least fifteen (15) years",
      correctChoice: "A",
      explanation: "Section 8(e) requires at least ten (10) years of active professional practice prior to appointment."
    },
    {
      id: "q-geas10-02-07",
      promptText: "What must a Board nominee do if they are currently teaching in an engineering university or associated with a board review center?",
      choiceA: "Officially resign from teaching and all review center activities prior to taking the oath of office",
      choiceB: "Take a temporary leave of absence during exam months only",
      choiceC: "Transfer their review classes to an online platform",
      choiceD: "Disclose their ownership shares but continue lecturing",
      correctChoice: "A",
      explanation: "Section 8(f) requires that a nominee must not be a faculty member or have pecuniary interest in any school or review center, and must resign prior to taking oath."
    },
    {
      id: "q-geas10-02-08",
      promptText: "What is the regular term of office of the Chairman and Members of the Board of ECE?",
      choiceA: "Three (3) years",
      choiceB: "Two (2) years",
      choiceC: "Four (4) years",
      choiceD: "Five (5) years",
      correctChoice: "A",
      explanation: "Section 9 mandates a regular term of office of three (3) years."
    },
    {
      id: "q-geas10-02-09",
      promptText: "What is the maximum total continuous tenure permitted for a member of the Board of ECE through reappointment?",
      choiceA: "Six (6) years",
      choiceB: "Three (3) years",
      choiceC: "Nine (9) years",
      choiceD: "Five (5) years",
      correctChoice: "A",
      explanation: "Section 9 states that a member may be reappointed, provided that the total continuous tenure does not exceed six (6) years (i.e. two 3-year terms)."
    },
    {
      id: "q-geas10-02-10",
      promptText: "If a vacancy occurs in the Board due to resignation before the term ends, how long does the replacement member serve?",
      choiceA: "For the unexpired portion of the term only",
      choiceB: "A fresh full term of 3 years",
      choiceC: "Until the end of the calendar year",
      choiceD: "For 6 years automatically",
      correctChoice: "A",
      explanation: "Section 9 explicitly states: 'Any vacancy occurring within the term of a member shall be filled for the unexpired portion of the term only.'"
    },
    {
      id: "q-geas10-02-11",
      promptText: "Within how many days may a decision or resolution of the Board of ECE be appealed to the Professional Regulation Commission?",
      choiceA: "Within fifteen (15) days from receipt of the decision",
      choiceB: "Within thirty (30) days from receipt",
      choiceC: "Within ten (10) days from receipt",
      choiceD: "Within sixty (60) days from receipt",
      correctChoice: "A",
      explanation: "Section 7 states that decisions and resolutions of the Board are appealable to the Commission within fifteen (15) days from receipt."
    },
    {
      id: "q-geas10-02-12",
      promptText: "Which legal writ can the Board of ECE issue to compel the attendance of witnesses in administrative investigations?",
      choiceA: "Subpoena ad testificandum",
      choiceB: "Subpoena duces tecum",
      choiceC: "Writ of habeas corpus",
      choiceD: "Writ of mandamus",
      correctChoice: "A",
      explanation: "Section 7 empowers the Board to issue *subpoena ad testificandum* to compel attendance of witnesses (and *subpoena duces tecum* for documents)."
    },
    {
      id: "q-geas10-02-13",
      promptText: "Which legal writ can the Board of ECE issue to compel the production of books, papers, and documents?",
      choiceA: "Subpoena duces tecum",
      choiceB: "Subpoena ad testificandum",
      choiceC: "Writ of certiorari",
      choiceD: "Writ of injunction",
      correctChoice: "A",
      explanation: "*Subpoena duces tecum* commands the production of books, documents, and physical records."
    },
    {
      id: "q-geas10-02-14",
      promptText: "Under Section 12, who acts as the custodian of all official records of the Board of ECE?",
      choiceA: "The Professional Regulation Commission (PRC)",
      choiceB: "The National Archives of the Philippines",
      choiceC: "The Institute of Electronics Engineers of the Philippines (IECEP)",
      choiceD: "The Department of Science and Technology (DOST)",
      correctChoice: "A",
      explanation: "Section 12 provides that all records of the Board, including examination papers and minutes, shall be kept by the Commission."
    },
    {
      id: "q-geas10-02-15",
      promptText: "What are the three (3) distinct categories of practice recognized under Section 4 of R.A. 9292?",
      choiceA: "Professional Electronics Engineer, Electronics Engineer, and Electronics Technician",
      choiceB: "Electronics Engineer, Telecommunications Engineer, and Computer Engineer",
      choiceC: "Master Electronics Engineer, Senior Engineer, and Apprentice",
      choiceD: "Chief Engineer, Broadcast Engineer, and Radio Technician",
      correctChoice: "A",
      explanation: "Section 4 establishes: (a) Professional Electronics Engineer (PECE), (b) Electronics Engineer (ECE), and (c) Electronics Technician (ECT)."
    },
    {
      id: "q-geas10-02-16",
      promptText: "Which of the following professional activities is exclusively restricted to a licensed PECE under Section 5?",
      choiceA: "Sole authority to sign and seal electronics plans, specifications, and reports",
      choiceB: "Supervision of electronics equipment assembly lines",
      choiceC: "Teaching of undergraduate electronics engineering courses",
      choiceD: "Testing and calibration of laboratory instruments",
      correctChoice: "A",
      explanation: "Section 5(a) explicitly grants the sole authority to sign and seal plans, specs, schematics, and design documents exclusively to PECEs."
    },
    {
      id: "q-geas10-02-17",
      promptText: "Can an Electronics Engineer (ECE) legally offer independent 'Consulting Services' on electronics engineering projects under R.A. 9292?",
      choiceA: "No, consulting services in electronics engineering are restricted to licensed PECEs",
      choiceB: "Yes, any ECE with at least 1 year of experience can offer consulting services",
      choiceC: "Yes, provided they pay an additional business tax to the local government",
      choiceD: "Yes, provided they pass a special foreign language examination",
      correctChoice: "A",
      explanation: "Section 5(a) reserves independent consulting services exclusively to Professional Electronics Engineers (PECE)."
    },
    {
      id: "q-geas10-02-18",
      promptText: "Which category of practice is defined as performing 'non-engineering technical work' relating to installation, maintenance, testing, and operation?",
      choiceA: "Electronics Technician (ECT)",
      choiceB: "Electronics Engineer (ECE)",
      choiceC: "Professional Electronics Engineer (PECE)",
      choiceD: "Electrical Safety Officer",
      correctChoice: "A",
      explanation: "Section 5(b) defines ECT as performing non-engineering technical work such as installation, operation, maintenance, testing, and sales."
    },
    {
      id: "q-geas10-02-19",
      promptText: "What is the minimum educational qualification to be eligible to take the Electronics Technician (ECT) Licensure Examination?",
      choiceA: "Graduate of a 2-year technician/vocational course, or at least 3rd year equivalent of BSECE",
      choiceB: "High school graduate with 1 month of computer gaming experience",
      choiceC: "Holder of a Bachelor of Science in Mechanical Engineering",
      choiceD: "Completion of primary elementary school education only",
      correctChoice: "A",
      explanation: "Section 14(b) requires a graduate of an Associate, technician, trade or vocational course in electronics, or completion of at least 3rd year equivalent of BSECE."
    },
    {
      id: "q-geas10-02-20",
      promptText: "What is the minimum educational requirement to take the Electronics Engineer (ECE) Licensure Examination?",
      choiceA: "Graduate of a Bachelor of Science in Electronics and Communications Engineering or Bachelor of Science in Electronics Engineering",
      choiceB: "Graduate of any 4-year science degree",
      choiceC: "Graduate of a 2-year technical diploma in electronics",
      choiceD: "Master of Science in Information Technology",
      correctChoice: "A",
      explanation: "Section 14(a) specifies a graduate of BSECE/BSEcE from an institution recognized by the government (CHED)."
    },
    {
      id: "q-geas10-02-21",
      promptText: "To upgrade registration from ECE to Professional Electronics Engineer (PECE), how many years of active practice are required?",
      choiceA: "At least seven (7) years, including at least two (2) years of significant engineering work",
      choiceB: "At least three (3) years of teaching experience",
      choiceC: "At least ten (10) years of general employment",
      choiceD: "At least five (5) years of retail equipment sales",
      correctChoice: "A",
      explanation: "Section 18 requires at least seven (7) years of active practice, of which at least two (2) years must be in significant engineering work."
    },
    {
      id: "q-geas10-02-22",
      promptText: "How many PECE certifications attesting to the factual accuracy of the applicant's experience are required for PECE registration?",
      choiceA: "Three (3) certifications from three (3) licensed PECEs",
      choiceB: "Five (5) certifications from any registered engineers",
      choiceC: "One (1) certification from a barangay chairman",
      choiceD: "Two (2) certifications from company HR officers",
      correctChoice: "A",
      explanation: "Section 18 requires three (3) certifications signed by three (3) licensed PECEs stating that the submitted experience is factual."
    },
    {
      id: "q-geas10-02-23",
      promptText: "What additional evaluation process must an applicant undergo to obtain the PECE license after submitting documents?",
      choiceA: "Pass an en banc oral interview/verification conducted by the Board of ECE",
      choiceB: "Take a 500-question written multiple-choice examination",
      choiceC: "Complete a 100-kilometer bicycle endurance ride",
      choiceD: "Publish three textbooks in an international IEEE journal",
      correctChoice: "A",
      explanation: "Section 18 requires passing the en banc oral interview conducted by the Board."
    },
    {
      id: "q-geas10-02-24",
      promptText: "Who has the authority to suspend or remove a member of the Board of ECE for neglect of duty, incompetence, or exam rigging?",
      choiceA: "The President of the Philippines, upon recommendation of the PRC",
      choiceB: "The President of the IECEP National Board",
      choiceC: "The Secretary of Justice",
      choiceD: "The Senate Committee on Civil Service",
      correctChoice: "A",
      explanation: "Section 11 states that the President of the Philippines, upon recommendation of the Commission, may suspend or remove any Board member."
    },
    {
      id: "q-geas10-02-25",
      promptText: "Under Section 22, taking the professional oath is:",
      choiceA: "A mandatory prerequisite prior to entering the practice of PECE, ECE, or ECT",
      choiceB: "An optional ceremony that can be waived upon paying a ₱500 fee",
      choiceC: "Required only for engineers working in government agencies",
      choiceD: "Required only for engineers residing in Metro Manila",
      correctChoice: "A",
      explanation: "Section 22 mandates that all successful examinees and registered professionals must take a professional oath before the Board or authorized officer prior to practice."
    }
  ]
};

// Write Module 2 and Mastery 2
fs.writeFileSync(path.join(geasDir, 'geas-10-02.json'), JSON.stringify(mod2, null, 2), 'utf8');
fs.writeFileSync(path.join(geasMasteryDir, 'geas-10-02-mastery.json'), JSON.stringify(mastery2, null, 2), 'utf8');
console.log("Successfully generated GEAS 10-02 module and mastery challenge!");
