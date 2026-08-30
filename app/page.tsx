"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.14c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18.24 2H21l-6.5 7.43L22.2 22h-6.32l-4.95-6.5L5.2 22H2.4l6.96-7.95L1.8 2h6.48l4.48 5.93L18.24 2Zm-1.1 18.2h1.76L7 3.7H5.1l12.04 16.5Z" />
    </svg>
  );
}

function GlassCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`
        rounded-2xl
        border border-white/50
        bg-white/35
        backdrop-blur-xl
        shadow-[0_8px_40px_rgba(0,0,0,0.12)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="bg-white text-zinc-900 font-sans">
      {/* ---------------- HERO ---------------- */}
      <section className="relative pt-10 pb-40">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-landing-image.jpg')" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-white/10 via-white/5 to-white" />

        <div className="relative mx-auto max-w-6xl px-6">
          {/* The whole hero lives inside one browser-chrome card, like the reference */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <GlassCard  className="
              overflow-visible
              rounded-3xl
              border-white/60
              bg-white/30
              backdrop-blur-2xl
              shadow-[0_20px_80px_rgba(0,0,0,0.16)]
            ">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-2 border-b border-white/30 bg-white/80 px-4 py-3 backdrop-blur-md m-3 rounded-xl">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-4 rounded-full bg-zinc-100 px-4 py-1 text-xs text-zinc-700">
                  outreach.app
                </span>
              </div>

              {/* In-app nav */}
              <div className="flex items-center justify-between px-6 sm:px-10 py-4">
                <span className="text-lg font-bold text-zinc-900">
                  Outreach
                </span>
                <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-zinc-700">
                  <Link
                    href="/new"
                    className="hover:text-zinc-900 transition-colors"
                  >
                    New Outreach
                  </Link>
                  <Link
                    href="/history"
                    className="hover:text-zinc-900 transition-colors"
                  >
                    History
                  </Link>
                </div>
                <Link
                  href="/new"
                  className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
                >
                  Try Outreach Now
                </Link>
              </div>

              {/* Headline block */}
              <div className="px-6 sm:px-10 pb-16 pt-4 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-zinc-700">
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-white text-[10px] font-semibold">
                    New
                  </span>
                  Built on TrueForge — an open source agent harness
                </span>

                <h1 className="mt-6 text-4xl sm:text-6xl leading-[1.1] text-zinc-900 instrument-serif-regular font-extrabold ">
                  Cold outreach, researched
                  <br />
                  and drafted for you.
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-[15px] text-zinc-700">
                  Tell it who you want to reach. It researches the company,
                  drafts a real email, and waits for your approval before
                  anything sends.
                </p>

                <div className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-white bg-white/30 p-1.5 backdrop-blur-md">
                  <span className="flex-1 truncate px-4 text-sm text-zinc-700 text-left">
                    Company, role, and a recipient — that's it
                  </span>
                  <Link
                    href="/new"
                    className="shrink-0 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
                  >
                    Start free →
                  </Link>
                </div>
              </div>

              {/* Floating feature cards, overlapping the bottom edge — like the reference */}
              <div className="relative h-24 sm:h-28">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="absolute left-4 sm:left-10 top-6 w-44 sm:w-52 -rotate-2"
                >
                  <GlassCard className="p-4">
                    <p className="text-[11px] font-semibold text-zinc-400">
                      Researching
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-800">
                      Acme Corp — funding, product, stack
                    </p>
                  </GlassCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute right-4 sm:right-10 top-2 w-48 sm:w-56 rotate-2"
                >
                  <GlassCard className="p-4">
                    <p className="text-[11px] font-semibold text-emerald-600">
                      Draft ready ✓
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-800">
                      Subject: Frontend role at Acme Corp
                    </p>
                  </GlassCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="absolute left-1/2 top-10 hidden sm:block w-60 -translate-x-1/2"
                >
                  <GlassCard className="p-4">
                    <p className="text-[11px] font-semibold text-indigo-600">
                      Approval required
                    </p>
                    <p className="mt-1 text-sm font-medium text-zinc-800">
                      Save this as a Gmail draft?
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span className="rounded-lg bg-zinc-900 px-3 py-1 text-[11px] font-semibold text-white">
                        Approve
                      </span>
                      <span className="rounded-lg bg-zinc-100 px-3 py-1 text-[11px] font-semibold text-zinc-700">
                        Deny
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            From a name to a real draft, in minutes
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            {
              step: "01",
              title: "Tell it who to reach",
              desc: "Company, role, recipient, and a bit about you — that's all it needs to start.",
            },
            {
              step: "02",
              title: "It researches & drafts",
              desc: "The agent searches the web for real, current details and writes a personalized email — live, in front of you.",
            },
            {
              step: "03",
              title: "You approve, it sends",
              desc: "Nothing goes out without your sign-off. Approve and it lands as a real Gmail draft.",
            },
          ].map((item) => (
            <motion.div key={item.step} variants={fadeUp}>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 h-full shadow-sm">
                <span className="text-xs font-mono text-indigo-600">
                  {item.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ---------------- BENTO GRID ---------------- */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-3">
            What makes it real
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900">
            Not a chatbot. An agent that acts.
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <motion.div variants={fadeUp} className="lg:col-span-2 lg:row-span-2">
            <div className="h-full rounded-2xl border border-zinc-200 bg-linear-to-br from-indigo-50 to-white p-8 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-zinc-900">
                  Real web research, not guesses
                </h3>
                <p className="text-sm text-zinc-700 leading-relaxed max-w-md">
                  Every draft is grounded in a live search of the company — not
                  the model's training data. You watch it happen, step by step.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs text-zinc-700">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Powered by Exa
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-2 text-zinc-900">
                Human approval gate
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                Nothing sends without you clicking approve. Every time.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-2 text-zinc-900">
                Real Gmail drafts
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                It creates an actual draft in your inbox — not a mockup.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <h3 className="text-base font-semibold mb-1 text-zinc-900">
                  Built on TrueForge
                </h3>
                <p className="text-sm text-zinc-700">
                  The open-source agent harness handling every tool call,
                  sandbox, and pause.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-600">
                Agent Harness Hackathon
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="mx-auto max-w-4xl px-6 pb-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-3xl border border-zinc-200 bg-zinc-900 p-12 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Ready to send the first one?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            No setup beyond the basics. Fill in who you want to reach and watch
            it work.
          </p>
          <Link
            href="/new"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            Start an outreach <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            <div className="col-span-2 sm:col-span-1">
              <span className="text-lg font-bold text-zinc-900">Outreach</span>
              <p className="mt-3 text-sm text-zinc-700 leading-relaxed max-w-55">
                Cold outreach, researched and drafted for you — built on
                TrueForge.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-4">
                Product
              </p>
              <div className="flex flex-col gap-3 text-sm text-zinc-700">
                <Link
                  href="/new"
                  className="hover:text-zinc-900 transition-colors"
                >
                  New Outreach
                </Link>
                <Link
                  href="/history"
                  className="hover:text-zinc-900 transition-colors"
                >
                  History
                </Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-4">
                Project
              </p>
              <div className="flex flex-col gap-3 text-sm text-zinc-700">
                <a
                  href="https://github.com/Codewithpabitra/Outreach"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-zinc-900 transition-colors"
                >
                  Source code
                </a>
                <span className="text-zinc-400">Privacy Policy</span>
                <span className="text-zinc-400">Terms of Use</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-4">
                Connect
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/Codewithpabitra"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-700 hover:text-zinc-900 transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon />
                </a>
                <a
                  href="https://www.linkedin.com/in/pabitra-maity-72ba04323"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-700 hover:text-zinc-900 transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon />
                </a>
                <a
                  href="https://x.com/CodeX_Pabitra"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-700 hover:text-zinc-900 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <XIcon />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 pt-8">
            <span className="text-xs text-zinc-700">
              &copy; {new Date().getFullYear()} Outreach. Built for the TrueForge
              Agent Harness Hackathon. @wemakedevs
            </span>
            <span className="text-xs text-zinc-700">Made by Pabitrax404</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
