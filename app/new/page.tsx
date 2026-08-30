"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const COMPANY_SUGGESTIONS = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Stripe",
  "Vercel",
  "OpenAI",
  "Anthropic",
  "Figma",
  "Notion",
];

const ROLE_SUGGESTIONS = [
  "Software Engineering Internship, Summer 2026",
  "Frontend Engineer",
  "Design Engineer",
  "Full Stack Developer",
  "Product Manager Internship",
  "Data Scientist",
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-zinc-600">{label}</label>

      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-[15px] text-zinc-900 placeholder:text-zinc-500 outline-none backdrop-blur-md focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 transition-all";

export default function NewOutreach() {
  const router = useRouter();

  const [senderName, setSenderName] = useState("");
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

    if (
      !senderName ||
      !company ||
      !role ||
      !recipientName ||
      !recipientEmail ||
      !background
    ) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderName,
        company,
        role,
        recipientName,
        recipientEmail,
        background,
      }),
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
    <div className="relative min-h-dvh overflow-hidden bg-white text-zinc-900 font-sans">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-landing-image.jpg')" }}
      />

      {/* Soft white overlay */}
      <div className="fixed inset-0 bg-white/70 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative mx-auto max-w-3xl px-6 py-10 sm:py-16">
        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 cursor-pointer"
        >
          <span aria-hidden>←</span>
          Back to home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Main glass card */}
          <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/45 shadow-[0_20px_80px_rgba(0,0,0,0.12)] backdrop-blur-2xl">
            {/* Browser-style top bar */}
            <div className="flex items-center gap-2 border-b border-white/60 bg-white/25 px-5 py-3 backdrop-blur-md">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

              <div className="ml-4 rounded-full border border-white/60 bg-white/40 px-4 py-1 text-xs text-zinc-500">
                outreach.app / new
              </div>
            </div>

            {/* Header */}
            <div className="border-b border-white/50 px-6 py-8 sm:px-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-medium text-indigo-600">
                <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  New
                </span>
                AI-powered outreach
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-zinc-900 sm:text-5xl">
                New Outreach
              </h1>

              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-500">
                Give it the basics — it'll research the company and draft the
                email for you.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 px-6 py-8 sm:px-10 sm:py-10"
            >
              <Field label="Your name *">
                <input
                  required
                  className={inputClass}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Pabitra Maity"
                />
              </Field>

              <Field label="Company *">
                <input
                  required
                  list="company-suggestions"
                  className={inputClass}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Corp"
                />

                <datalist id="company-suggestions">
                  {COMPANY_SUGGESTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>

              <Field label="Role / opportunity *">
                <input
                  required
                  list="role-suggestions"
                  className={inputClass}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Frontend Engineering Internship, Summer 2026"
                />

                <datalist id="role-suggestions">
                  {ROLE_SUGGESTIONS.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
              </Field>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Recipient name *">
                  <input
                    required
                    className={inputClass}
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Jordan Lee"
                  />
                </Field>

                <Field label="Recipient email *">
                  <input
                    required
                    type="email"
                    className={inputClass}
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="jordan@acme.com"
                  />
                </Field>
              </div>

              <Field label="Your background *">
                <textarea
                  required
                  className={`${inputClass} min-h-28 resize-y font-sans`}
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="CS student, React/TypeScript experience, looking for Summer 2026 internships"
                />
              </Field>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="mt-2 rounded-xl bg-zinc-900 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? "Creating..." : "Research & Draft →"}
              </motion.button>

              <p className="text-center text-xs text-zinc-400">
                Nothing will be sent without your approval.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
