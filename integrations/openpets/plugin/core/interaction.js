export const INTERACTION_KINDS = ["POSITIVE_CONTACT", "NEGATIVE_CONTACT"];

export class InteractionEvent {
  constructor({ kind, valence = defaultValence(kind), intensity = 0.4, timestamp = 0 }) {
    if (!INTERACTION_KINDS.includes(kind)) {
      throw new RangeError(`Unknown interaction kind: ${kind}`);
    }
    if (!Number.isFinite(valence) || valence < -1 || valence > 1) {
      throw new RangeError("Interaction valence must be in the range -1..1.");
    }
    if (!Number.isFinite(intensity) || intensity < 0 || intensity > 1) {
      throw new RangeError("Interaction intensity must be in the range 0..1.");
    }
    if (!Number.isFinite(timestamp) || timestamp < 0) {
      throw new RangeError("Interaction timestamp must be finite and non-negative.");
    }
    this.kind = kind;
    this.valence = valence;
    this.intensity = intensity;
    this.timestamp = timestamp;
  }
}

export function normalizeInteractionEvent(event, timestamp = 0) {
  if (!event || typeof event !== "object") throw new TypeError("InteractionEvent is required.");
  return new InteractionEvent({
    kind: event.kind,
    valence: event.valence,
    intensity: event.intensity,
    timestamp: event.timestamp ?? timestamp,
  });
}

function defaultValence(kind) {
  if (kind === "POSITIVE_CONTACT") return 1;
  if (kind === "NEGATIVE_CONTACT") return -1;
  return 0;
}
