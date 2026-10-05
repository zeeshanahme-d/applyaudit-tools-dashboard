/**
 * A resume handed over by another page (the overview's drop area), taken
 * once by the analyzer, which starts the audit with it. Kept in memory only,
 * never in history or storage: a reload never re-runs an audit.
 */
export type HandedOffAudit = { file: File } | { sample: true };

let pending: HandedOffAudit | null = null;

export function handOffAudit(audit: HandedOffAudit) {
  pending = audit;
}

export function takeHandedOffAudit(): HandedOffAudit | null {
  const audit = pending;
  pending = null;
  return audit;
}
