const fs = require('fs');
const path = require('path');

const geasDir = path.join(__dirname, '..', 'test-sets', 'learning-modules', 'geas');
const geasMasteryDir = path.join(__dirname, '..', 'test-sets', 'learning-modules', 'geas', 'mastery');

fs.mkdirSync(geasDir, { recursive: true });
fs.mkdirSync(geasMasteryDir, { recursive: true });

// ==========================================
// MODULE 1: geas-10-01 (Part 1 - Statutory Background, 8 Articles, 43 Sections, Terms)
// ==========================================
const mod1 = {
  id: "geas-10-01",
  code: "GEAS 10-01",
  domain: "GEAS",
  topicCode: "GEAS-10",
  topicTitle: "ECE Laws, Ethics & Contracts (RA 9292)",
  subtopicTitle: "Legislative Origins, The 8 Articles, 43 Sections & Definition of Terms",
  order: 1,
  pairedQuizSetId: "geas-10-01-mastery",
  toc: [
    { id: "sec-prereq-bridges", title: "1. Introduction & Statutory Context", level: 2 },
    { id: "sec-theory", title: "2. Lesson Proper: Legislative Origins, The 8 Articles & 43 Sections", level: 2 },
    { id: "sec-formulas", title: "3. Legal Signatures & Master Article Index", level: 2 },
    { id: "sec-visualizer", title: "4. Interactive Statutory Navigator & Section Explorer", level: 2 },
    { id: "sec-terminology", title: "5. Key Statutory Terms & Legal Definitions", level: 2 },
    { id: "sec-dual-method", title: "6. Worked Board Exam Legal Problem Scenarios", level: 2 },
    { id: "sec-calculator", title: "7. Board Exam Speed Techniques: Keyword Elimination", level: 2 },
    { id: "sec-concept-checks", title: "8. In-Line Concept Checks", level: 2 },
    { id: "sec-mastery-challenge", title: "9. Paired Mastery Challenge Exam", level: 2 }
  ],
  prerequisiteBridge: {
    priorModuleId: "geas-01-01",
    text: "Republic Act No. 9292 ('The Electronics Engineering Law of 2004') serves as the governing legal bedrock for all electronics professionals in the Philippines. It completely repealed the archaic 1969 R.A. No. 5734, establishing modernized definitions for telecommunications, computers, ICT, broadcasting, and professional responsibilities."
  },
  crossSubjectBridges: [
    {
      targetDomain: "EST",
      targetTopicCode: "EST-01",
      badgeText: "GEAS → EST",
      description: "Statutory definitions of 'Telecommunications' and 'Broadcasting' in Section 3 define legal frequency spectrum and transmission standards regulated under NTC memorandum circulars."
    },
    {
      targetDomain: "ELECS",
      targetTopicCode: "ELEC-01",
      badgeText: "GEAS → ELECS",
      description: "The definition of 'Electronics' under Section 3(a) explicitly encompasses electron flow across vacuum, gases, plasma, semiconductors, and all modern solid-state devices."
    }
  ],
  theory: {
    mentalAnchor: "R.A. 9292 was approved on April 17, 2004 by President Gloria Macapagal-Arroyo, repealing R.A. 5734. It originated from House Bill 5224 and Senate Bill 2683, and is structured into 8 Articles and 43 Sections.",
    contentMarkdown: `### 1. Legislative Origins & Enactment Facts

Republic Act No. 9292, officially titled the **"Electronics Engineering Law of 2004"**, is *an Act providing for a more responsive and comprehensive regulation for the registration, licensing and practice of Professional Electronics Engineers (PECE), Electronics Engineers (ECE), and Electronics Technicians (ECT)*.

| Statutory Milestone | Historical Fact / Legal Figure | Board Exam Keyword Memory Anchor |
| :--- | :--- | :--- |
| **Law Repealed** | **Republic Act No. 5734** | *The Electronics and Communications Engineering Act of the Philippines (1969)* |
| **Date of Approval** | **April 17, 2004** | *Signed by President Gloria Macapagal-Arroyo* |
| **Senate President Signatory** | **Franklin M. Drilon** | *Senate President of the 12th Congress* |
| **Speaker of the House Signatory** | **Jose De Venecia Jr.** | *Speaker of the House of Representatives* |
| **Secretary of the Senate** | **Oscar G. Yabes** | *Attested the Senate consolidation* |
| **Secretary General of the House** | **Roberto P. Nazareno** | *Attested the House consolidation* |
| **Legislative Bill Numbers** | **House Bill No. 5224** & **Senate Bill No. 2683** | *Consolidated bicameral conference report* |
| **Total Structural Scope** | **8 Articles** and **43 Sections** | *8 Roman numeral articles, 43 Arabic sections* |

---

### 2. The 8 Articles of Republic Act No. 9292

The entire statute is organized into eight sequential articles:

1. **Article I: General Provisions (Sections 1 to 5)**
   - Short Title, Statement of Policy, Definition and Interpretation of Terms, Categories of Practice, Nature and Scope of Practice of ECE and ECT Professions.
2. **Article II: Professional Regulatory Board of Electronics Engineering (Sections 6 to 12)**
   - Composition of the Board, Powers and Functions, Qualifications of Members, Term of Office (3 years), Compensation, Removal, Custodian of Records.
3. **Article III: Examination, Registration and Licensure (Sections 13 to 26)**
   - Licensure Examination, Qualifications for Exam, Scope of Exam, Ratings (70% average, 70% min subject), Results within 15 days, Registration for PECE (7 yrs experience, 3 PECE certs), Professional ID, Professional Oath, Revocation/Suspension, Reinstatement (after 2 years), Roster, and Exemptions.
4. **Article IV: Practice of PECE, ECE, and ECT (Sections 27 to 31)**
   - Practice of the Profession, Prohibitions and Limitations, Seal of PECE (48 mm outer / 32 mm inner), Code of Ethics and Technical Standards, Continuing Professional Education (CPE/CPD).
5. **Article V: Sundry Provisions (Sections 32 to 34)**
   - Integrated and Accredited Professional Organization (IECEP as the sole APO), Foreign Reciprocity (Sec 33), Government Positions requiring PECE, ECE, ECT.
6. **Article VI: Penal Provision and Assistance of Law Enforcement Agencies (Sections 35 to 36)**
   - Penalties: Fines of **₱100,000 to ₱1,000,000** and/or imprisonment of **6 months to 6 years**; Assistance of Law Enforcement Agencies.
7. **Article VII: Transitory Provisions (Sections 37 to 38)**
   - Transitory Provisions, Vested Rights (All existing ECEs under RA 5734 automatically converted to Electronics Engineers).
8. **Article VIII: Final Provisions (Sections 39 to 43)**
   - Implementing Rules and Regulations (IRR), Appropriations, Separability Clause, Repealing Clause, Effectivity (15 days following publication in Official Gazette/newspapers).

---

### 3. Statutory Definitions of Terms (Section 3)

Section 3 provides 15 specific, legally binding definitions that frequently appear verbatim in the PRC Board Examination:

#### (a) Electronics
The science dealing with the development and application of devices and systems involving the flow of electrons or other carriers of electric charge, in a **vacuum, in gaseous media, in plasma, in semiconductors, in any other media**.

#### (b) Professional Electronics Engineer (PECE)
A person who is qualified to practice electronics engineering at the highest professional grade and who is a holder of a valid Certificate of Registration and Professional ID issued by the Board and the Commission.

#### (c) Electronics Engineer (ECE)
A person who is qualified to practice electronics engineering and who is a holder of a valid Certificate of Registration and Professional ID issued by the Board and the Commission.

#### (d) Electronics Technician (ECT)
A person who is qualified to practice and perform non-engineering technical work relating to electronics and who is a holder of a valid Certificate of Registration and Professional ID issued by the Board and the Commission.

#### (e) Computer
Any of a variety of electronic devices that are capable of **accepting data, programs and/or instructions, executing the programs and/or instructions to process the data and presenting the results**.

#### (f) Information and Communications Technology (ICT)
The **acquisition, production, transformation, storage and transfer/transmission of data and information** by electronic and other modern means in vocal, textual, numerical, graphic, and/or cognitive forms.

#### (g) Communications
The process of sending and/or receiving information, data, message, etc. between two or more points by any media.

#### (h) Telecommunications
Any transmission, emission or reception of **voice, data, text, image, audio, video and/or high-speed data** by wire, radio, optical or other technological means.

#### (i) Broadcasting
An undertaking the purpose of which is to **transmit audio, video, text, images, etc. for reception of the general public**.

#### (j) Industrial Plant
Manufacturing establishments and businesses where electronic machineries, systems, and equipment are **installed, used, sold, operated, or manufactured**.

#### (k) Commercial Establishment
Buildings used for business or profit where electronic or electronically-controlled equipment, systems, or circuits are **installed, used, sold, or operated**.

#### (l) Consulting Services
Services requiring and involving the technical expertise and professional capability for **advisory, review, design, evaluation, planning, or supervision** in the field of electronics engineering.`
  },
  formulas: [
    {
      id: "f-geas10-01",
      title: "Statutory Identity of Republic Act No. 9292",
      formula: "$$\\text{R.A. 9292} = \\text{HB 5224} + \\text{SB 2683} \\quad [\\text{Approved: April 17, 2004}]$$",
      note: "Repealed R.A. 5734 (The ECE Act of 1969)."
    },
    {
      id: "f-geas10-02",
      title: "Structural Organization of R.A. 9292",
      formula: "$$\\text{Structure} = 8 \\text{ Articles} \\quad | \\quad 43 \\text{ Sections}$$",
      note: "Enforced by the Professional Regulatory Board of Electronics Engineering (PRB-ECE)."
    },
    {
      id: "f-geas10-03",
      title: "General Penal Formula (Section 35)",
      formula: "$$\\text{Penalty} = \\text{Fine: } \\text{₱100,000 to ₱1,000,000} \\quad \\text{and/or} \\quad \\text{Imprisonment: } 6\\text{ mos to } 6\\text{ yrs}$$",
      note: "Applies to fraud, unauthorized practice, illegal use of seal, and violations of Code of Ethics."
    }
  ],
  visualizer: {
    archetype: "stepper",
    title: "Interactive 8 Articles & 43 Sections Statutory Matrix",
    description: "Step through the 8 Articles of Republic Act No. 9292 to inspect section boundaries and statutory scopes.",
    config: {
      controls: [
        { id: "articleIndex", label: "Select Article (1 to 8)", min: 1, max: 8, step: 1, defaultValue: 1 }
      ],
      initialParams: { articleIndex: 1 }
    }
  },
  terms: [
    {
      term: "Republic Act No. 9292",
      symbol: "RA 9292",
      definition: "The Electronics Engineering Law of 2004 approved on April 17, 2004 by President Gloria Macapagal-Arroyo.",
      keywordTrigger: "April 17, 2004 / 8 Articles / 43 Sections / Repealed RA 5734"
    },
    {
      term: "Electronics (Statutory)",
      symbol: "Sec. 3(a)",
      definition: "The science dealing with electron flow in vacuum, gases, plasma, semiconductors, or any other media.",
      keywordTrigger: "Vacuum, gases, plasma, semiconductors, other media"
    },
    {
      term: "ICT (Information & Communications Technology)",
      symbol: "Sec. 3(f)",
      definition: "Acquisition, production, transformation, storage and transfer of data/info by electronic means.",
      keywordTrigger: "Acquisition, production, transformation, storage, transfer"
    },
    {
      term: "Telecommunications (Statutory)",
      symbol: "Sec. 3(h)",
      definition: "Any transmission, emission or reception of voice, data, text, image, audio, or video by wire, radio, or optical systems.",
      keywordTrigger: "Transmission, emission, reception of voice, data, audio, video"
    },
    {
      term: "Broadcasting (Statutory)",
      symbol: "Sec. 3(i)",
      definition: "An undertaking transmitting audio, video, text, or images for reception by the general public.",
      keywordTrigger: "Reception of the general public"
    }
  ],
  examples: [
    {
      id: "ex-geas10-01-01",
      title: "Statutory Origin Identification Problem",
      prompt: "Republic Act No. 9292 was signed into law on April 17, 2004. Which legislative measures were consolidated by Congress to enact this statute?",
      formalSolution: "Step 1: Inspect the legislative history of R.A. No. 9292 as recorded in the preamble and congressional records.\nStep 2: The House of Representatives passed House Bill No. 5224, while the Senate passed Senate Bill No. 2683.\nStep 3: The bicameral conference committee reconciled these bills on February 2, 2004, and the consolidated bill was enacted as R.A. 9292.",
      shortcutSolution: "Remember the mnemonic '5224 (House) and 2683 (Senate)'. Note that House bills have 4 digits starting with 5, Senate bills have 4 digits starting with 2.",
      finalAnswer: "House Bill No. 5224 and Senate Bill No. 2683"
    },
    {
      id: "ex-geas10-01-02",
      title: "Statutory Definition Trap: Telecommunications vs Broadcasting",
      prompt: "Under Section 3 of R.A. 9292, what key distinction separates 'Broadcasting' from 'Telecommunications'?",
      formalSolution: "Step 1: Examine Section 3(h) for Telecommunications: 'any transmission, emission or reception of signs, signals, writings, images, sounds or intelligence of any nature by wire, radio, optical or other electromagnetic systems'.\nStep 2: Examine Section 3(i) for Broadcasting: 'an undertaking the purpose of which is to transmit audio, video, text, images or other signals or message for reception of the general public'.\nStep 3: The defining legal characteristic of Broadcasting is intended reception by the *general public* (point-to-multipoint open dissemination).",
      shortcutSolution: "Look for the keyword 'general public' $\\to$ exclusively Broadcasting.",
      finalAnswer: "Broadcasting is specifically intended for reception by the general public."
    }
  ],
  calculatorShortcuts: [
    {
      calculatorModel: "Karce KC-S991 / Canon F-789SGA",
      topic: "Non-Computational Statutory Topic",
      shortcutName: "Article-to-Section Number Index Memory Rule",
      keystrokeSequence: ["MODE", "1"],
      explanation: "R.A. 9292 questions are purely regulatory. Use the 8-Article Roman numeral mapping: Art I (1-5), Art II (6-12), Art III (13-26), Art IV (27-31), Art V (32-34), Art VI (35-36), Art VII (37-38), Art VIII (39-43)."
    }
  ],
  conceptChecks: [
    {
      id: "cc-geas10-01-01",
      questionText: "What previous statute was repealed upon the effectivity of Republic Act No. 9292?",
      options: [
        { text: "Republic Act No. 5734", isCorrect: true, distractorReason: "Correct: R.A. 5734 was the Electronics and Communications Engineering Act of the Philippines (1969)." },
        { text: "Republic Act No. 7925", isCorrect: false, distractorReason: "R.A. 7925 is the Public Telecommunications Policy Act of the Philippines." },
        { text: "Republic Act No. 8484", isCorrect: false, distractorReason: "R.A. 8484 is the Access Devices Regulation Act." },
        { text: "Republic Act No. 3846", isCorrect: false, distractorReason: "R.A. 3846 is the Radio Control Law of 1931." }
      ],
      directExplanation: "Section 42 (Repealing Clause) of R.A. 9292 expressly repeals Republic Act No. 5734, known as the Electronics and Communications Engineering Act of the Philippines."
    },
    {
      id: "cc-geas10-01-02",
      questionText: "How many Articles and Sections comprise Republic Act No. 9292?",
      options: [
        { text: "8 Articles and 43 Sections", isCorrect: true, distractorReason: "Correct: Comprises 8 Articles (Articles I to VIII) and 43 Sections." },
        { text: "7 Articles and 42 Sections", isCorrect: false, distractorReason: "Incorrect section and article tally." },
        { text: "9 Articles and 45 Sections", isCorrect: false, distractorReason: "Overstates the statutory count." },
        { text: "10 Articles and 50 Sections", isCorrect: false, distractorReason: "Arbitrary round number." }
      ],
      directExplanation: "Republic Act No. 9292 is structured into exactly 8 Articles and 43 Sections."
    },
    {
      id: "cc-geas10-01-03",
      questionText: "Which President of the Republic of the Philippines signed R.A. 9292 into law on April 17, 2004?",
      options: [
        { text: "Gloria Macapagal-Arroyo", isCorrect: true, distractorReason: "Correct: Approved by President Gloria Macapagal-Arroyo on April 17, 2004." },
        { text: "Fidel V. Ramos", isCorrect: false, distractorReason: "President Ramos signed RA 7925 in 1995." },
        { text: "Joseph Ejercito Estrada", isCorrect: false, distractorReason: "President Estrada was in office from 1998 to 2001." },
        { text: "Corazon C. Aquino", isCorrect: false, distractorReason: "President Aquino was in office from 1986 to 1992." }
      ],
      directExplanation: "Republic Act No. 9292 was approved and signed into law by President Gloria Macapagal-Arroyo on April 17, 2004."
    },
    {
      id: "cc-geas10-01-04",
      questionText: "Under Section 3(a) of RA 9292, the definition of 'Electronics' explicitly includes the flow of electrons in which media?",
      options: [
        { text: "Vacuum, gaseous media, plasma, semiconductors, or any other media", isCorrect: true, distractorReason: "Correct: Captures the exact statutory definition in Section 3(a)." },
        { text: "Metallic conductors and dielectric insulators only", isCorrect: false, distractorReason: "Too restrictive and omits semiconductors/plasma." },
        { text: "Optical fiber waveguides only", isCorrect: false, distractorReason: "Optical fiber is photons, not electron flow." },
        { text: "Wireless free-space atmosphere only", isCorrect: false, distractorReason: "Omits all physical electronic states." }
      ],
      directExplanation: "Section 3(a) defines Electronics as the science dealing with electron flow in vacuum, in gaseous media, in plasma, in semiconductors, or in any other media."
    }
  ]
};

// ==========================================
// MASTERY 1: geas-10-01-mastery (25 Decoupled Legal & Statutory Questions)
// ==========================================
const mastery1 = {
  moduleId: "geas-10-01",
  moduleCode: "GEAS 10-01",
  title: "GEAS 10-01 Mastery Challenge: Legislative Origins, Articles & Terms",
  description: "Comprehensive 25-item decoupled board examination challenge covering statutory enactment facts, the 8 Articles, 43 Sections, and Section 3 definitions under Republic Act No. 9292.",
  totalQuestions: 25,
  timeLimitMinutes: 30,
  questions: [
    {
      id: "q-geas10-01-01",
      promptText: "What is the official short title of Republic Act No. 9292 as stated in Section 1?",
      choiceA: "Electronics and Communications Engineering Act of 2004",
      choiceB: "Electronics Engineering Law of 2004",
      choiceC: "Philippine Telecommunications Regulatory Act of 2004",
      choiceD: "Professional Electronics Practice Code of the Philippines",
      correctChoice: "B",
      explanation: "Section 1 states: 'This Act shall be known as the Electronics Engineering Law of 2004.' Notice that 'Communications' was dropped from the official short title."
    },
    {
      id: "q-geas10-01-02",
      promptText: "On what exact date was Republic Act No. 9292 signed into law by the President of the Philippines?",
      choiceA: "April 17, 2004",
      choiceB: "June 21, 1969",
      choiceC: "March 1, 2004",
      choiceD: "May 25, 2004",
      correctChoice: "A",
      explanation: "R.A. No. 9292 was approved on April 17, 2004. (June 21, 1969 was the approval date of the repealed R.A. 5734)."
    },
    {
      id: "q-geas10-01-03",
      promptText: "Which Republic Act was repealed and superseded upon the passage of Republic Act No. 9292?",
      choiceA: "Republic Act No. 5734",
      choiceB: "Republic Act No. 7925",
      choiceC: "Republic Act No. 3846",
      choiceD: "Republic Act No. 6541",
      correctChoice: "A",
      explanation: "R.A. 5734 (The Electronics and Communications Engineering Act of the Philippines, enacted June 21, 1969) was repealed by Section 42 of R.A. 9292."
    },
    {
      id: "q-geas10-01-04",
      promptText: "Republic Act No. 9292 was a consolidation of which legislative measures in the 12th Congress?",
      choiceA: "House Bill No. 5224 and Senate Bill No. 2683",
      choiceB: "House Bill No. 2683 and Senate Bill No. 5224",
      choiceC: "House Bill No. 1096 and Senate Bill No. 3846",
      choiceD: "House Bill No. 7925 and Senate Bill No. 8484",
      correctChoice: "A",
      explanation: "R.A. 9292 originated from House Bill No. 5224 and Senate Bill No. 2683."
    },
    {
      id: "q-geas10-01-05",
      promptText: "Who was the Senate President who signed the enrolled copy of Republic Act No. 9292?",
      choiceA: "Franklin M. Drilon",
      choiceB: "Jose De Venecia Jr.",
      choiceC: "Oscar G. Yabes",
      choiceD: "Juan Ponce Enrile",
      correctChoice: "A",
      explanation: "Franklin M. Drilon was the Senate President, while Jose De Venecia Jr. was the Speaker of the House."
    },
    {
      id: "q-geas10-01-06",
      promptText: "How many Articles and Sections comprise Republic Act No. 9292?",
      choiceA: "8 Articles and 43 Sections",
      choiceB: "7 Articles and 42 Sections",
      choiceC: "10 Articles and 50 Sections",
      choiceD: "6 Articles and 36 Sections",
      correctChoice: "A",
      explanation: "Republic Act No. 9292 contains 8 Articles and 43 Sections."
    },
    {
      id: "q-geas10-01-07",
      promptText: "Which Article of R.A. 9292 covers 'Examination, Registration and Licensure'?",
      choiceA: "Article I",
      choiceB: "Article II",
      choiceC: "Article III",
      choiceD: "Article IV",
      correctChoice: "C",
      explanation: "Article III (Sections 13 to 26) is dedicated to Examination, Registration and Licensure."
    },
    {
      id: "q-geas10-01-08",
      promptText: "Under what Article of R.A. 9292 is the creation, composition, and powers of the Professional Regulatory Board of Electronics Engineering specified?",
      choiceA: "Article II",
      choiceB: "Article I",
      choiceC: "Article III",
      choiceD: "Article V",
      correctChoice: "A",
      explanation: "Article II (Sections 6 to 12) governs the Professional Regulatory Board of Electronics Engineering."
    },
    {
      id: "q-geas10-01-09",
      promptText: "Under Section 3(a) of R.A. 9292, which carrier of electric charge or media is explicitly mentioned in the statutory definition of Electronics?",
      choiceA: "Vacuum, gaseous media, plasma, semiconductors, or any other media",
      choiceB: "Superconducting quantum fluids only",
      choiceC: "Metallic wires and coaxial shields only",
      choiceD: "Biological neurons and synapses only",
      correctChoice: "A",
      explanation: "Section 3(a) defines Electronics as dealing with electron flow in vacuum, in gaseous media, in plasma, in semiconductors, or in any other media."
    },
    {
      id: "q-geas10-01-10",
      promptText: "How does Section 3(e) of R.A. 9292 legally define a 'Computer'?",
      choiceA: "Any electronic device capable of accepting data, executing programs/instructions, and presenting results",
      choiceB: "A mechanical device calculating mathematical matrices using decimal gears",
      choiceC: "Any network server hosting website protocols over TCP/IP",
      choiceD: "A cellular handset operating over 3G/4G telecommunications spectrum",
      correctChoice: "A",
      explanation: "Section 3(e) defines a Computer as any of a variety of electronic devices capable of accepting data, programs/instructions, executing them to process data, and presenting results."
    },
    {
      id: "q-geas10-01-11",
      promptText: "Under Section 3(f), what processes define 'Information and Communications Technology (ICT)'?",
      choiceA: "Acquisition, production, transformation, storage, and transfer/transmission of data and information",
      choiceB: "Manufacturing of copper cables and circuit boards only",
      choiceC: "Broadcasting of analog frequency modulated audio signals only",
      choiceD: "Installation of fiber optic underwater cable lines only",
      correctChoice: "A",
      explanation: "Section 3(f) states that ICT is the acquisition, production, transformation, storage and transfer/transmission of data and info by electronic and other modern means."
    },
    {
      id: "q-geas10-01-12",
      promptText: "What is the key statutory phrase that distinguishes 'Broadcasting' from other forms of telecommunications in Section 3(i)?",
      choiceA: "Intended for the reception of the general public",
      choiceB: "Operates exclusively above 1 GHz frequency",
      choiceC: "Uses fiber optic laser transmission",
      choiceD: "Requires two-way full duplex encryption",
      correctChoice: "A",
      explanation: "Section 3(i) defines Broadcasting as an undertaking transmitting audio, video, text, or images 'for reception of the general public'."
    },
    {
      id: "q-geas10-01-13",
      promptText: "Under Section 3(j), what constitutes an 'Industrial Plant'?",
      choiceA: "Manufacturing establishments and businesses where electronic machineries/equipment are installed, used, sold, operated, etc.",
      choiceB: "Retail shopping malls and restaurants only",
      choiceC: "Academic university lecture halls only",
      choiceD: "Government legislative session halls only",
      correctChoice: "A",
      explanation: "Section 3(j) defines Industrial Plant as manufacturing establishments and businesses where electronic machineries/equipment are installed, used, sold, operated, etc."
    },
    {
      id: "q-geas10-01-14",
      promptText: "What are 'Consulting Services' as defined in Section 3(l) of R.A. 9292?",
      choiceA: "Services requiring technical expertise and professional capability for advisory, review, design, and evaluation",
      choiceB: "Routine soldering and assembly line repair",
      choiceC: "Retail counter sales of electronics components",
      choiceD: "Clerical filing of board exam records",
      correctChoice: "A",
      explanation: "Section 3(l) defines Consulting Services as services involving technical expertise and professional capability for advisory, review, design, evaluation, planning, or supervision."
    },
    {
      id: "q-geas10-01-15",
      promptText: "Which Section of R.A. 9292 contains the General Penal Provisions?",
      choiceA: "Section 35",
      choiceB: "Section 25",
      choiceC: "Section 15",
      choiceD: "Section 43",
      correctChoice: "A",
      explanation: "Section 35 under Article VI prescribes the fines (₱100k to ₱1M) and imprisonment terms (6 months to 6 years)."
    },
    {
      id: "q-geas10-01-16",
      promptText: "Which Section defines the 'Categories of Practice' under R.A. 9292?",
      choiceA: "Section 4",
      choiceB: "Section 1",
      choiceC: "Section 8",
      choiceD: "Section 12",
      correctChoice: "A",
      explanation: "Section 4 (under Article I) establishes the 3 categories of practice: PECE, ECE, and ECT."
    },
    {
      id: "q-geas10-01-17",
      promptText: "Which Article contains 'Sundry Provisions', including the Accredited Professional Organization (APO) and Foreign Reciprocity?",
      choiceA: "Article V",
      choiceB: "Article II",
      choiceC: "Article IV",
      choiceD: "Article VII",
      correctChoice: "A",
      explanation: "Article V (Sections 32 to 34) contains the Sundry Provisions."
    },
    {
      id: "q-geas10-01-18",
      promptText: "What does Section 41 of R.A. 9292 provide?",
      choiceA: "Separability Clause",
      choiceB: "Repealing Clause",
      choiceC: "Effectivity Clause",
      choiceD: "Appropriations Clause",
      correctChoice: "A",
      explanation: "Section 41 is the Separability Clause (if any section is declared unconstitutional, the remainder stays valid). Section 42 is Repealing, Section 43 is Effectivity."
    },
    {
      id: "q-geas10-01-19",
      promptText: "What is the Effectivity period specified in Section 43 of R.A. 9292?",
      choiceA: "15 days following its full publication in the Official Gazette or two newspapers of general circulation",
      choiceB: "Immediately upon signature of the President",
      choiceC: "30 days after registration with the United Nations",
      choiceD: "1 year after publication by IECEP",
      correctChoice: "A",
      explanation: "Section 43 states effectivity takes place 15 days following full publication in the Official Gazette or at least two newspapers of general circulation."
    },
    {
      id: "q-geas10-01-20",
      promptText: "What is the title of Article VII of R.A. 9292?",
      choiceA: "Transitory Provisions",
      choiceB: "Penal Provisions",
      choiceC: "Sundry Provisions",
      choiceD: "Final Provisions",
      correctChoice: "A",
      explanation: "Article VII comprises Sections 37 and 38 and is titled 'Transitory Provisions'."
    },
    {
      id: "q-geas10-01-21",
      promptText: "Under Section 38 (Vested Rights), what happened to all registered Electronics and Communications Engineers (ECEs) upon enactment of R.A. 9292?",
      choiceA: "They were automatically converted into Electronics Engineers (ECEs)",
      choiceB: "They were required to retake the licensure examination within 1 year",
      choiceC: "They were automatically upgraded to Professional Electronics Engineers (PECE)",
      choiceD: "Their licenses were cancelled until they completed a Master's degree",
      correctChoice: "A",
      explanation: "Section 38 explicitly protects vested rights: all existing ECEs under RA 5734 automatically became registered Electronics Engineers under RA 9292."
    },
    {
      id: "q-geas10-01-22",
      promptText: "Which Section governs the 'Code of Ethics and Code of Technical Standard of Practice'?",
      choiceA: "Section 30",
      choiceB: "Section 20",
      choiceC: "Section 10",
      choiceD: "Section 40",
      correctChoice: "A",
      explanation: "Section 30 (Article IV) states that the Board shall adopt a Code of Ethics and Code of Technical Standards of Practice promulgated by the Accredited Professional Organization."
    },
    {
      id: "q-geas10-01-23",
      promptText: "Under Section 3(k), how is a 'Commercial Establishment' defined?",
      choiceA: "Buildings used for business or profit where electronic or electronically-controlled equipment are installed, used, sold, operated, etc.",
      choiceB: "Private residential houses with home appliances",
      choiceC: "Farming lands and open irrigation canals",
      choiceD: "Public recreational parks and plazas",
      correctChoice: "A",
      explanation: "Section 3(k) defines Commercial Establishment as buildings used for business or profit where electronic equipment/circuits are installed, operated, or sold."
    },
    {
      id: "q-geas10-01-24",
      promptText: "Who attested the enrolled copy of R.A. 9292 as Secretary General of the House of Representatives?",
      choiceA: "Roberto P. Nazareno",
      choiceB: "Oscar G. Yabes",
      choiceC: "Franklin Drilon",
      choiceD: "Jose De Venecia Jr.",
      correctChoice: "A",
      explanation: "Roberto P. Nazareno was Secretary General of the House, while Oscar G. Yabes was Secretary of the Senate."
    },
    {
      id: "q-geas10-01-25",
      promptText: "Under Section 3(g), how is 'Communications' defined?",
      choiceA: "The process of sending and/or receiving information, data, message, etc. between two or more points by any media",
      choiceB: "Oral conversation between people in the same room only",
      choiceC: "Printed newspaper publishing only",
      choiceD: "Mechanical semaphore flags on naval ships only",
      correctChoice: "A",
      explanation: "Section 3(g) defines Communications as the process of sending and/or receiving information, data, message, etc. between two or more points by any media."
    }
  ]
};

// Write Module 1 and Mastery 1
fs.writeFileSync(path.join(geasDir, 'geas-10-01.json'), JSON.stringify(mod1, null, 2), 'utf8');
fs.writeFileSync(path.join(geasMasteryDir, 'geas-10-01-mastery.json'), JSON.stringify(mastery1, null, 2), 'utf8');
console.log("Successfully generated GEAS 10-01 module and mastery challenge!");
