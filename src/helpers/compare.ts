// Generic structural equality for plain JSON-shaped data (form values vs. a
// persisted account snapshot) — TanStack Form's own `state.isDirty` tracks
// "was ever touched", not "currently differs from X", so it can't be reused
// for an unsaved-changes comparison against a specific baseline.
export function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    return a.every((item, i) => valuesEqual(item, b[i]));
  }

  if (typeof a === "object") {
    const keys = new Set([...Object.keys(a), ...Object.keys(b as object)]);
    return [...keys].every((key) =>
      valuesEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
    );
  }

  return false;
}
