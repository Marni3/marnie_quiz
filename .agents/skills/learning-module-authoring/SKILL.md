---
name: learning-module-authoring
description: Authoring interactive, high-speed PRC ECE board exam learning modules (Paul's Online Notes / Brilliant style), 1-to-1 review note page multimodal transcription, lesson-first pedagogy, Karce KC-S991 & Canon F-789SGA keystroke shortcuts, interactive declarative visualizers, declarative inline SVG diagrams, cross-subject conceptual bridges, and multiple-choice concept checks.
---

# Learning Module Authoring & Visualization Standards Skill

This skill defines the architectural, pedagogical, typographical, and cross-subject connection standards for authoring **Interactive Learning Modules** on the Marnie Quiz platform.

---

## 1. Absolute Source of Truth: 1-to-1 Page-by-Page Note Inspection

Every learning module MUST be generated directly from its respective rendered note page PNG in:
`test-sets/scratch/pdf-renders/[subject]/notes___[topic]_[n]/page_01.png`

### Extraction Invariants:
1. **Direct Visual Inspection**: Call `view_file` on `page_01.png` before authoring the module.
2. **Complete Transcription**: Every single provision, definition, formula, condition table, geometric relationship, and shortcut note on the page must be transcribed into the module. Never omit or summarize away detailed provisions or formulas.
3. **Dedicated Subtopic Granularity**: If a subject has multiple note sheets, each sheet is authored as its own dedicated subtopic module (e.g. `MATH-10-01` through `MATH-10-05`) with its own companion mastery challenge.

---

## 2. The 3-Tier Topic Classification Engine

Before writing JSON, evaluate the subject and classify it into one of **three distinct archetypes**:

```
                                  Domain Evaluation
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
[ 📐 Computational ]            [ 📡 Hybrid Systems ]          [ 📜 Qualitative/Statutory ]
  (MATH, AC/DC Circuits,         (Digital Comms, Fiber,          (RA 9292, Ethics, Contracts,
   Calculus, DE, Signals)         Radar, Microelectronics)        Material Science, Env Laws)
        │                                │                                │
  • Heavy KaTeX Derivations       • System Architecture & Tables   • Statutory / Comparison Tables
  • Formal vs ⚡ Shortcuts        • Governing Equations (KaTeX)    • 5–10 Realistic Case Scenarios
  • Karce / Canon Keystrokes      • 5–8 Dual Solves + Block Diag   • 1-Second Keyword Triggers
  • 2D Continuous Sandbox         • Karce/Canon Shortcuts          • Threshold & Penalty Traps
  • 4–6 Concept Checks            • 8–12 Concept Checks            • 12–20 Concept Checks
  • Optional Written Challenges   • 3 Written Challenges           • 3–5 Written Challenges
```

---

## 3. Pedagogical Section Sequence & Adaptation Matrix

Sections are modular and render dynamically based on the topic archetype:

| Section Name | Field in JSON | 📐 Computational | 📡 Hybrid Systems | 📜 Qualitative / Statutory |
| :--- | :--- | :---: | :---: | :---: |
| **Prerequisite Bridges** | `prerequisiteBridge`, `crossSubjectBridges` | Mandatory | Mandatory | Mandatory |
| **Lesson Proper** | `theory.contentMarkdown` | 4-Layer Concept Derivations | 4-Layer Architecture & Math | Statutory Provisions / Principles |
| **Formula Compilation** | `formulas` | Mandatory | Mandatory | **Omit** |
| **Comparison Tables** | `comparisonTables` | Optional | Mandatory | **Mandatory (Unconstrained N tables)** |
| **Interactive Sandbox** | `visualizer` | Mandatory | Optional (if continuous) | **Omit** |
| **Key Terms & Glossary** | `terms` | Mandatory | Mandatory | Mandatory (w/ Keyword Triggers) |
| **Worked Examples** | `examples` | 2 Dual-Method Solves | 2–4 Dual-Method Solves | **5–10 Realistic Case Dilemmas** |
| **Calculator Techniques** | `calculatorGuides` | Mandatory (Karce/Canon) | Mandatory (Karce/Canon) | **Omit** |
| **In-Line Concept Checks** | `conceptChecks` | 4–6 MCQs | 8–12 MCQs | **12–20 MCQs with Deconstructions** |
| **Active Recall Written Challenge** | `writtenChallenges` | Optional (Formula recall) | Mandatory (3 Prompts) | **Mandatory (3–5 Synthesis Prompts)** |
| **Paired Mastery Challenge** | `pairedQuizSetId` | 20–25 Questions | 20–25 Questions | 20–25 Questions |

---

## 4. Key Content Authoring Standards

### 1. Table of Contents Titles (No Hardcoded Numbers)
- **Rule**: NEVER write hardcoded numbers in JSON TOC titles.
  - ✅ `"title": "Lesson Proper"`, `"title": "Comparison of Provisions"`, `"title": "Active Recall Written Challenge"`
  - ❌ `"title": "2. Lesson Proper"`, `"title": "8. Concept Checks"`
- The UI automatically renders continuous sequential numbers (`1.`, `2.`, `3.`, `4.`) for whichever sections are present.

### 2. Deep Narrative Lesson Proper (4-Layer Framework)
- **Layer 1: Intuitive Motivation / The "Why"**: Real-world practical context or geometric need.
- **Layer 2: Governing Rules, Equations, or Statutory Articles**: State KaTeX formulas or explicit legal/standard citations.
- **Layer 3: Specific Cases, Scope, & Boundaries**: Natural phrasing (**"Specific Cases"**, **"Scope & Exceptions"**).
- **Layer 4: Board Exam Trap Alert**: Highlight the exact trick question or calculation pitfall set by PRC examiners.

### 3. Comparison & Statutory Matrices (`comparisonTables`)
For dense concepts, include clean structured tables comparing:
- License classifications (PECE vs ECE vs ECT scope, qualifications, penal provisions).
- Modulation formats (AM vs FM vs PM spectrum efficiency, noise immunity).
- Semiconductor families or crystalline structures (BCC vs FCC vs HCP coordination numbers).

### 4. Qualitative Case Scenarios (5–10 Samples)
For statutory/concept modules, replace mathematical equations with realistic board scenarios:
- Dilemmas on signing plans without personal supervision.
- Foreign reciprocity and temporary permit requirements.
- CPD point compliance thresholds and license renewal timelines.
- Distinguishing illegal practice penalties from administrative sanctions.

### 5. In-Line Concept Checks (Proportional Depth)
- Short modules: 4–6 MCQs.
- Dense/Qualitative modules: **12–20 MCQs**.
- Every option MUST include a crisp `distractorDeconstruction` explaining why distractors are traps.

### 6. Active Recall Written Challenge (`writtenChallenges`)
- 3 to 5 open-ended prompts testing generative recall from zero cues.
- Include a complete `modelAnswer` and a 3–5 bullet `keyCheckpoints` rubric for self-checking.

---

## 5. Standard JSON Module Schema

Stored in `test-sets/learning-modules/[subject]/[code].json`:

```json
{
  "id": "geas-10-01",
  "code": "GEAS 10-01",
  "domain": "GEAS",
  "topicCode": "GEAS-10",
  "topicTitle": "ECE Laws, Ethics, Contracts & RA 9292",
  "subtopicTitle": "Republic Act No. 9292: The Electronics Engineering Law of 2004",
  "order": 1,
  "pairedQuizSetId": "geas-10-01-mastery",
  "toc": [
    { "id": "sec-prereq-bridges", "title": "Prerequisite Bridges", "level": 2 },
    { "id": "sec-theory", "title": "Lesson Proper", "level": 2 },
    { "id": "sec-comparison", "title": "Statutory Comparison Matrices", "level": 2 },
    { "id": "sec-terminology", "title": "Key Terms & Definitions", "level": 2 },
    { "id": "sec-scenarios", "title": "Board Exam Case Dilemmas", "level": 2 },
    { "id": "sec-concept-checks", "title": "In-Line Concept Checks", "level": 2 },
    { "id": "sec-written-challenge", "title": "Active Recall Written Challenge", "level": 2 },
    { "id": "sec-mastery-challenge", "title": "Paired Mastery Challenge", "level": 2 }
  ],
  "prerequisiteBridge": {
    "text": "Before RA 9292 was enacted on April 17, 2004, the profession was governed by RA 5734 (The Electronics and Communications Engineering Act of the Philippines of 1969)..."
  },
  "crossSubjectBridges": [
    {
      "badgeText": "GEAS → EST",
      "targetTopicCode": "EST-01",
      "description": "NTC broadcast station permits, telecommunications franchise requirements, and commercial spectrum management all require certified PECE sign-offs under Section 5."
    }
  ],
  "theory": {
    "mentalAnchor": "RA 9292 created 3 distinct categories: PECE (Full practice, seal, sole authority to sign/seal plans), ECE (General practice, no seal), and ECT (Non-engineering technical support under supervision).",
    "contentMarkdown": "### 1. Legislative Background & Repealing Clause\n\nRepublic Act No. 9292 was signed into law on **April 17, 2004**...\n\n### 2. Categories of Practice & Scope\n\n..."
  },
  "comparisonTables": [
    {
      "id": "tbl-categories",
      "title": "Comparison of Professional Categories under RA 9292",
      "headers": ["Feature", "PECE", "ECE", "ECT"],
      "rows": [
        ["Scope of Practice", "Full authority across all domains", "General engineering practice", "Technical, non-engineering tasks"],
        ["Official Seal", "Mandatory official dry seal", "No seal allowed", "No seal allowed"],
        ["Signing of Plans", "Sole legal authority to sign/seal", "Not permitted to sign/seal", "Not permitted"],
        ["Experience Required", "Valid ECE + 7 years active practice", "Passed ECE Licensure Exam", "Passed ECT Licensure Exam or 3-yr grad"]
      ]
    }
  ],
  "terms": [
    {
      "term": "Professional Electronics Engineer (PECE)",
      "definition": "A person registered with the Board and PRC with full authority to sign, seal, and provide sole certification for all electronics plans and specs.",
      "keywordTrigger": "sole authority to sign and seal / 7 years active practice"
    }
  ],
  "examples": [
    {
      "problemStatement": "Case Scenario: An ECE licensee with 5 years experience prepares a telecommunication tower antenna design and affixes an official dry seal to the engineering drawings. Is this valid?",
      "formalSolutionMarkdown": "#### Legal Assessment:\nUnder **Section 5 and Section 29 of RA 9292**, only a registered **Professional Electronics Engineer (PECE)** with a valid Certificate of Registration is legally authorized to sign and seal electronics plans. A registered ECE without PECE upgrade does NOT possess a seal and is strictly prohibited from sealing plans.",
      "shortcutSolutionMarkdown": "#### ⚡ 1-Second Exam Rule\nECE = No seal. Only PECE can sign and seal plans. Action is an illegal practice violation under Sec. 35.",
      "formalTimeSeconds": 60,
      "shortcutTimeSeconds": 5
    }
  ],
  "conceptChecks": [
    {
      "id": "chk-01",
      "question": "Which of the following professional ranks possesses the sole statutory authority to sign and seal electronics engineering plans under RA 9292?",
      "options": {
        "A": "Registered Electronics Engineer (ECE)",
        "B": "Professional Electronics Engineer (PECE)",
        "C": "Electronics Technician (ECT)",
        "D": "Chief Telecommunications Engineer"
      },
      "correctAnswer": "B",
      "distractorDeconstruction": {
        "A": "ECEs have general practice rights but are strictly barred from sealing plans.",
        "B": "PECE holds sole authority under Section 5 and Section 29.",
        "C": "ECTs are sub-professionals performing technician-level work.",
        "D": "Not a statutory title under RA 9292."
      }
    }
  ],
  "writtenChallenges": [
    {
      "id": "wc-01",
      "prompt": "List the three (3) professional categories created by RA 9292 and identify which category has the sole authority to seal engineering documents.",
      "modelAnswer": "1. Professional Electronics Engineer (PECE) — Holds sole statutory authority to sign and seal plans.\n2. Electronics Engineer (ECE) — General professional practice, no seal.\n3. Electronics Technician (ECT) — Non-engineering technical support.",
      "keyCheckpoints": [
        "PECE (sole authority to seal)",
        "ECE (general practice, no seal)",
        "ECT (technician level)"
      ]
    }
  ]
}
```
