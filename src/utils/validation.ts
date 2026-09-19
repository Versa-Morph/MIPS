import { Berth, Vessel } from "../types/domain";

export interface BerthValidationResult {
  isValid: boolean;
  loaCompatible: boolean;
  draftCompatible: boolean;
  loaDelta: number; // berth.maxLoa - vessel.loa
  draftDelta: number; // berth.maxDraft - vessel.draft
  requiredControllingDepth: number; // vessel.draft + UKC (1.3m)
  feedback: string;
}

export const MANDATORY_UKC_METERS = 1.3;

export function validateBerthAssignment(
  berth: Berth,
  vessel: Vessel
): BerthValidationResult {
  const loaDelta = berth.maxLoa - vessel.loa;
  const draftDelta = berth.maxDraft - vessel.draft;
  const requiredControllingDepth = Number(
    (vessel.draft + MANDATORY_UKC_METERS).toFixed(2)
  );

  const loaCompatible = loaDelta >= 0;
  // Berth controlling depth must also accommodate UKC
  const draftCompatible = berth.maxDraft >= requiredControllingDepth;
  const isValid = loaCompatible && draftCompatible;

  let feedback = "";
  if (isValid) {
    feedback = `✓ DECISION ACCEPTED: ${berth.name} is fully compatible with ${vessel.name}'s LOA (${vessel.loa}m <= ${berth.maxLoa}m) and Controlling Depth (${requiredControllingDepth}m <= ${berth.maxDraft}m). Safety clearance verified.`;
  } else {
    const reasons: string[] = [];
    if (!loaCompatible) {
      reasons.push(
        `Vessel LOA exceeds berth length by ${Math.abs(loaDelta)}m (${vessel.loa}m > ${berth.maxLoa}m)`
      );
    }
    if (!draftCompatible) {
      reasons.push(
        `Berth depth of ${berth.maxDraft}m is insufficient for required ${requiredControllingDepth}m draft+UKC (Grounding hazard of ${Math.abs(draftDelta)}m)`
      );
    }
    feedback = `⚠ REVIEW REQUIRED: ${berth.name} does not meet vessel requirements. ${reasons.join(". ")}. Review the Berth Information document and try again.`;
  }

  return {
    isValid,
    loaCompatible,
    draftCompatible,
    loaDelta,
    draftDelta,
    requiredControllingDepth,
    feedback,
  };
}
