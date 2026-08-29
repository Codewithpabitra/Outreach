export type OutreachStatus = "drafting" | "awaiting_approval" | "sent" | "saved_draft" | "discarded";

export type OutreachRecord = {
  id: string;
  company: string;
  role: string;
  recipientName?: string;
  recipientEmail?: string;
  background: string;
  status: OutreachStatus;
  sessionId?: string;
  emailSubject?: string;
  emailBody?: string;
  createdAt: number;
};

const store = new Map<string, OutreachRecord>();

export function createOutreach(data: Omit<OutreachRecord, "id" | "status" | "createdAt">) {
  const id = crypto.randomUUID();
  const record: OutreachRecord = { ...data, id, status: "drafting", createdAt: Date.now() };
  store.set(id, record);
  return record;
}

export function getOutreach(id: string) {
  return store.get(id) ?? null;
}

export function updateOutreach(id: string, patch: Partial<OutreachRecord>) {
  const existing = store.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  store.set(id, updated);
  return updated;
}

export function listOutreach() {
  return [...store.values()].sort((a, b) => b.createdAt - a.createdAt);
}