"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function History() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-white px-6 font-sans text-zinc-900">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero-landing-image.jpg')",
        }}
      />

      {/* Soft overlay */}
      <div className="fixed inset-0 bg-white/70 backdrop-blur-[2px]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-lg"
      >
        {/* Glass card */}
        <div className="rounded-[28px] border border-white/70 bg-white/45 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:p-12">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50/80 text-indigo-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                d="M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Badge */}
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-medium text-indigo-600">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Coming soon
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            History
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-zinc-500 sm:text-[15px]">
            Your outreach history will live here. I&apos;ll build this page
            soon.
          </p>

          {/* Home button */}
          <Link
            href="/"
            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800 active:scale-[0.98]"
          >
            <span aria-hidden>←</span>
            Go back home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}