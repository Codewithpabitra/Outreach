"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

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
          {/* 404 */}
          <div className="mb-5">
            <span className="text-8xl font-black tracking-tighter text-zinc-900 sm:text-9xl">
              404
            </span>
          </div>

          {/* Badge */}
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-medium text-indigo-600">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Page not found
          </div>

          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
            Looks like you're lost.
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-500 sm:text-[15px]">
            The page you're looking for doesn't exist or may have been moved.
          </p>

          {/* Button */}
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800"
          >
            <span aria-hidden>←</span>
            Go back home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
