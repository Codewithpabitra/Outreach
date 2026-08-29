import Link from "next/link";

export default function Landing() {
  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0B0B0F",
      color: "#F5F5F7",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 48px" }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Outreach</span>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/history" style={{ color: "#A1A1AA", textDecoration: "none" }}>History</Link>
          <Link href="/new" style={{
            background: "#6366F1", color: "#fff", textDecoration: "none",
            padding: "8px 18px", borderRadius: 10, fontSize: 14, fontWeight: 600,
          }}>New Outreach</Link>
        </div>
      </nav>

      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24,
      }}>
        <span style={{
          fontSize: 13, color: "#A1A1AA", background: "#18181B",
          border: "1px solid #343439", borderRadius: 999, padding: "6px 14px", marginBottom: 24,
        }}>
          Built on TrueForge
        </span>
        <h1 style={{ fontSize: 56, fontWeight: 800, maxWidth: 700, lineHeight: 1.1, margin: 0 }}>
          Cold outreach, researched and drafted for you
        </h1>
        <p style={{ fontSize: 18, color: "#A1A1AA", maxWidth: 520, marginTop: 20 }}>
          Tell it who you want to reach. It researches the company, drafts a
          real email, and waits for your approval before anything sends.
        </p>
        <Link href="/new" style={{
          marginTop: 36, background: "#6366F1", color: "#fff", textDecoration: "none",
          padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600,
        }}>
          Start an outreach →
        </Link>

        <div style={{ display: "flex", gap: 48, marginTop: 72, color: "#71717A", fontSize: 14 }}>
          <span>🔍 Researches the company</span>
          <span>✍️ Drafts a real email</span>
          <span>✅ Waits for your approval</span>
        </div>
      </main>
    </div>
  );
}