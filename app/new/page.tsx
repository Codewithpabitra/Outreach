"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#18181B",
  border: "1px solid #343439",
  borderRadius: 10,
  padding: "12px 14px",
  color: "#F5F5F7",
  fontSize: 15,
  marginTop: 6,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#A1A1AA",
  fontWeight: 600,
};

export default function NewOutreach() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [background, setBackground] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!company || !role || !background) {
      setError("Company, role, and your background are required.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, recipientName, recipientEmail, background }),
    });
    const record = await res.json();
    setSubmitting(false);

    if (res.ok) {
      router.push(`/outreach/${record.id}`);
    } else {
      setError(record.error ?? "Something went wrong.");
    }
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#0B0B0F", color: "#F5F5F7", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "64px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>New Outreach</h1>
        <p style={{ color: "#A1A1AA", marginBottom: 40 }}>
          Give it the basics — it'll research the company and draft the email.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={labelStyle}>Company *</label>
            <input style={inputStyle} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" />
          </div>

          <div>
            <label style={labelStyle}>Role / opportunity *</label>
            <input style={inputStyle} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Frontend Engineering Internship, Summer 2026" />
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Recipient name</label>
              <input style={inputStyle} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Jordan Lee" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Recipient email</label>
              <input style={inputStyle} value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="jordan@acme.com" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Your background *</label>
            <textarea
              style={{ ...inputStyle, minHeight: 100, resize: "vertical", fontFamily: "inherit" }}
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="CS student, React/TypeScript experience, looking for Summer 2026 internships"
            />
          </div>

          {error && <p style={{ color: "#EF4444", fontSize: 14 }}>{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: "#6366F1", color: "#fff", border: "none", borderRadius: 10,
              padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 8,
            }}
          >
            {submitting ? "Creating..." : "Research & Draft →"}
          </button>
        </form>
      </div>
    </div>
  );
}