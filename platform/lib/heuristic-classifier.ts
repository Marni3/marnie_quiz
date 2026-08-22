/**
 * Heuristic auto-tagging engine for CSV ingestion.
 * Automatically infers question archetypes, anchor status, and micro-clusters
 * when uploaded CSVs omit extended schema fields.
 */

export interface InferredQuestionMetadata {
  archetype: "scaling" | "boundary" | "phase" | "fault" | "material" | "theorem" | "trap" | "standard";
  isAnchor: boolean;
  microCluster: string | null;
  confidenceScore: number;
}

export function inferQuestionMetadata({
  promptText,
  explanation,
  subjectTag,
  title,
}: {
  promptText: string;
  explanation?: string | null;
  subjectTag?: string | null;
  title?: string | null;
}): InferredQuestionMetadata {
  const text = `${promptText} ${explanation || ""}`.toLowerCase();

  // 1. Check for Scaling & Proportionality Archetype
  const scalingPatterns = [
    /increases by/,
    /decreases by/,
    /doubled/,
    /halved/,
    /twofold/,
    /threefold/,
    /quadrupled/,
    /proportional to/,
    /inversely proportional/,
    /ratio of/,
    /if the length of/,
    /if the diameter is/,
    /if the radius is/,
    /if the distance is/,
    /what happens to (its|the)/,
    /factor of/,
  ];
  if (scalingPatterns.some((p) => p.test(text))) {
    return {
      archetype: "scaling",
      isAnchor: false,
      microCluster: subjectTag || null,
      confidenceScore: 0.9,
    };
  }

  // 2. Check for Boundary & Asymptotic Limit Archetype
  const boundaryPatterns = [
    /approaches infinity/,
    /t\s*=\s*0/,
    /t\s*->\s*infinity/,
    /f\s*=\s*0/,
    /infinite frequency/,
    /zero frequency/,
    /dc condition/,
    /steady state/,
    /asymptotic/,
    /limiting value/,
    /maximum possible/,
    /minimum possible/,
    /at resonance/,
    /cutoff frequency/,
  ];
  if (boundaryPatterns.some((p) => p.test(text))) {
    return {
      archetype: "boundary",
      isAnchor: false,
      microCluster: subjectTag || null,
      confidenceScore: 0.88,
    };
  }

  // 3. Check for Phase & Directionality Archetype
  const phasePatterns = [
    /phase angle/,
    /phase shift/,
    /180 degrees/,
    /90 degrees/,
    /leads by/,
    /lags by/,
    /in phase/,
    /out of phase/,
    /clockwise/,
    /counter-clockwise/,
    /lenz's law/,
    /right-hand rule/,
    /polarity of/,
  ];
  if (phasePatterns.some((p) => p.test(text))) {
    return {
      archetype: "phase",
      isAnchor: false,
      microCluster: subjectTag || null,
      confidenceScore: 0.85,
    };
  }

  // 4. Check for Fault & Circuit Open/Short Diagnostics
  const faultPatterns = [
    /open circuit/,
    /short circuit/,
    /is open-circuited/,
    /is short-circuited/,
    /fault condition/,
    /if resistor .* burns/,
    /disconnected/,
    /failure of/,
  ];
  if (faultPatterns.some((p) => p.test(text))) {
    return {
      archetype: "fault",
      isAnchor: false,
      microCluster: subjectTag || null,
      confidenceScore: 0.92,
    };
  }

  // 5. Check for Material & Thermodynamic Physics
  const materialPatterns = [
    /semiconductor/,
    /intrinsic/,
    /extrinsic/,
    /doping/,
    /fermi level/,
    /carrier mobility/,
    /temperature coefficient/,
    /silicon/,
    /germanium/,
    /gallium arsenide/,
    /valence band/,
    /conduction band/,
    /energy gap/,
  ];
  if (materialPatterns.some((p) => p.test(text))) {
    return {
      archetype: "material",
      isAnchor: false,
      microCluster: subjectTag || null,
      confidenceScore: 0.87,
    };
  }

  // 6. Check for Theorem & Invariant Conservation
  const theoremPatterns = [
    /thevenin/,
    /norton/,
    /superposition/,
    /maximum power transfer/,
    /reciprocity theorem/,
    /millman's theorem/,
    /conservation of energy/,
    /conservation of charge/,
    /shannon.*capacity/,
    /nyquist theorem/,
  ];
  if (theoremPatterns.some((p) => p.test(text))) {
    return {
      archetype: "theorem",
      isAnchor: false,
      microCluster: subjectTag || null,
      confidenceScore: 0.9,
    };
  }

  // 7. Check for Anchor Concept / Core Definition
  const anchorPatterns = [
    /what is the si unit/,
    /defined as/,
    /state the formula for/,
    /is known as/,
    /standard value of/,
    /express the equation for/,
    /which of the following defines/,
  ];
  const isAnchor = anchorPatterns.some((p) => p.test(text));

  return {
    archetype: "standard",
    isAnchor,
    microCluster: subjectTag || title || null,
    confidenceScore: 0.75,
  };
}
