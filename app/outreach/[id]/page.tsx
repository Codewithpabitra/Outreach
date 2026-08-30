"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type ChatEvent = Record<string, any>;
type Record_ = {
  id: string;
  company: string;
  role: string;
  recipientName?: string;
  recipientEmail?: string;
  senderName?: string;
  background: string;
  status: string;
  sessionId?: string;
};

type LogStep = {
  id: string;
  text: string;
  status: "active" | "done";
};

const AGENT_NAME = "outreach-agent";

// Translates raw tool/event names into plain-English, granular status lines.
// Returns null for anything we truly don't want to surface (rare now).
function friendlyStepText(
  callName: string | undefined,
  company: string
): string | null {
  if (!callName) return null;

  const exact: Record<string, string> = {
    COMPOSIO_SEARCH_TOOLS: "Checking available Gmail actions...",
    COMPOSIO_MANAGE_CONNECTIONS: "Verifying Gmail connection...",
    COMPOSIO_MULTI_EXECUTE_TOOL: "Executing the Gmail action...",
    COMPOSIO_WAIT_FOR_CONNECTION: "Waiting for Gmail authorization...",
    GMAIL_CREATE_EMAIL_DRAFT: "Creating the Gmail draft...",
    GMAIL_SEND_EMAIL: "Sending the email...",
    web_search_exa: `Researching ${company} online (via Exa)...`,
    web_fetch_exa: "Reading a source page...",
  };

  if (callName in exact) return exact[callName];
  if (callName === "list_tools" || callName === "get_tool_info") return null;

  const words = callName.toLowerCase().split("_").join(" ");
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}...`;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-3.5 w-3.5 shrink-0 text-emerald-500"
    >
      <path
        d="M4 10.5l3.5 3.5L16 6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DraftReview() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [record, setRecord] = useState<Record_ | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [assistantText, setAssistantText] = useState("");
  const [steps, setSteps] = useState<LogStep[]>([]);
  const [draftUrl, setDraftUrl] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<unknown[] | null>(null);
  const started = useRef(false);
  const stepIdCounter = useRef(0);
  const firstTextSeen = useRef(false);
  const [approval, setApproval] = useState<{
    toolCallId: string;
    threadId: string;
    kind: "approval" | "question";
  } | null>(null);

  useEffect(() => {
    if (!id || started.current) return;
    started.current = true;

    fetch(`/api/outreach/${id}`)
      .then((r) => r.json())
      .then((rec) => {
        setRecord(rec);
        const prompt =
          `Draft an outreach email from ${rec.senderName || "me"} to ${rec.recipientName || "a recruiter"} ` +
          `(${rec.recipientEmail || "no email provided yet — ask me for it before drafting"}) ` +
          `at ${rec.company} regarding: ${rec.role}. About me: ${rec.background}`;
        const input = [{ type: "user.message", content: prompt }];
        setLastInput(input);
        send(input, rec.company);
      });
  }, [id]);

  function pushStep(text: string) {
    stepIdCounter.current += 1;
    const newId = `step-${stepIdCounter.current}`;
    setSteps((prev) => [
      ...prev.map((s) => ({ ...s, status: "done" as const })),
      { id: newId, text, status: "active" },
    ]);
  }

  function finishAllSteps() {
    setSteps((prev) =>
      prev.map((s) => ({ ...s, status: "done" as const }))
    );
  }

  async function send(input: unknown[], companyOverride?: string) {
    const company = companyOverride ?? record?.company ?? "the company";
    setBusy(true);
    setDone(false);
    setApproval(null);
    setErrorMsg(null);
    setLastInput(input);
    firstTextSeen.current = false;

    if (!sessionId) {
      pushStep(`Connecting to ${AGENT_NAME}...`);
    } else {
      pushStep("Sending your response...");
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, sessionId }),
    });

    if (!res.body) {
      setBusy(false);
      setErrorMsg("Couldn't reach the agent. Please try again.");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let currentSessionId = sessionId;

    while (true) {
      const { done: streamDone, value } = await reader.read();
      if (streamDone) break;

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() ?? "";

      for (const chunk of chunks) {
        const dataLine = chunk
          .split("\n")
          .find((l) => l.startsWith("data: "));

        if (!dataLine) continue;

        const payload = JSON.parse(dataLine.slice(6));

        if (chunk.startsWith("event: session")) {
          const isFirstConnection = !currentSessionId;
          currentSessionId = payload.sessionId;
          setSessionId(payload.sessionId);

          if (isFirstConnection) pushStep(`${AGENT_NAME} connected`);

          continue;
        }

        handleEvent(payload, company);
      }
    }

    setBusy(false);
    finishAllSteps();

    if (currentSessionId) {
      fetch(`/api/outreach/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: currentSessionId }),
      });
    }
  }

  function handleEvent(event: ChatEvent, company: string) {
    if (event.type === "model.message.delta") {
      if (!firstTextSeen.current && event.content) {
        firstTextSeen.current = true;
        pushStep("Drafting the email...");
      }

      setAssistantText((prev) => prev + (event.content ?? ""));
    }

    if (event.type === "model.message" && event.toolCalls?.length) {
      for (const call of event.toolCalls) {
        const text = friendlyStepText(call.function?.name, company);
        if (text) pushStep(text);
      }
    }

    if (event.type === "tool.approval_required") {
      const ref = event.toolCalls?.[0];

      setApproval({
        toolCallId: ref?.id,
        threadId: event.threadId,
        kind: "approval",
      });
    }

    if (event.type === "turn.done") {
      if (event.state?.status === "error") {
        const raw = event.state.message ?? "";
        const isQuota =
          raw.includes("429") || raw.toLowerCase().includes("quota");

        setErrorMsg(
          isQuota
            ? "The AI model hit its rate limit. Please wait a moment and try again."
            : "Something went wrong while processing this request. Please try again."
        );

        setDone(false);
        finishAllSteps();
        return;
      }

      setDone(true);
      finishAllSteps();

      const pending = event.state?.requiredActions?.[0];

      if (pending?.type === "tool.approval_required") {
        const ref = pending.toolCalls?.[0];

        setApproval({
          toolCallId: ref?.id,
          threadId: pending.threadId,
          kind: "approval",
        });
      } else if (pending?.type === "tool.response_required") {
        const ref = pending.toolCalls?.[0];

        setApproval({
          toolCallId: ref?.id,
          threadId: pending.threadId,
          kind: "question",
        });
      }
    }

    if (event.type === "tool.response") {
      try {
        const parsed = JSON.parse(event.content ?? "{}");

        const url =
          parsed?.data?.results?.[0]?.response?.data?.display_url ??
          parsed?.data?.display_url ??
          parsed?.data?.message?.display_url;

        if (url) {
          setDraftUrl(url);
          pushStep("Draft saved to Gmail");

          if (id) {
            fetch(`/api/outreach/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "sent" }),
            });
          }
        }
      } catch {
        /* not a shape we recognize — stay silent, never dump raw JSON */
      }
    }
  }

  function handleReply() {
    if (!replyInput.trim() || approval) return;

    setAssistantText("");
    setSteps([]);

    send([{ type: "user.message", content: replyInput }]);

    setReplyInput("");
  }

  function handleQuestionReply() {
    if (!replyInput.trim() || !approval || approval.kind !== "question") {
      return;
    }

    setSteps([]);

    send([
      {
        type: "user.tool_response",
        threadId: approval.threadId,
        toolCallId: approval.toolCallId,
        content: replyInput,
      },
    ]);

    setReplyInput("");
  }

  function handleApprove(allow: boolean) {
    if (!approval) return;

    send([
      {
        type: "user.tool_approval",
        threadId: approval.threadId,
        toolCallId: approval.toolCallId,
        approval: allow
          ? { status: "allow" }
          : { status: "deny", reason: "denied by user" },
      },
    ]);

    if (!allow && id) {
      fetch(`/api/outreach/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "discarded" }),
      });
    }
  }

  function handleRetry() {
    if (lastInput) send(lastInput);
  }

  if (!record) {
    return (
      <div className="relative min-h-dvh overflow-hidden bg-white">
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-landing-image.jpg')" }}
        />

        <div className="fixed inset-0 bg-white/75 backdrop-blur-[2px]" />
      </div>
    );
  }

  const heading = busy
    ? "Working..."
    : errorMsg
      ? "Something went wrong"
      : done
        ? "Draft ready"
        : "Outreach";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-white text-zinc-900 font-sans">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-landing-image.jpg')" }}
      />

      {/* Soft light overlay */}
      <div className="fixed inset-0 bg-white/75 backdrop-blur-[2px]" />

      {/* Main content */}
      <div className="relative mx-auto max-w-5xl px-6 py-10">
        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 cursor-pointer"
        >
          <span aria-hidden>←</span>
          Back to home
        </button>

        {/* Context */}
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          {record.company} · {record.role}
        </p>

        <h1 className="mt-1 mb-8 text-2xl font-bold text-zinc-900 sm:text-3xl">
          {heading}
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
          {/* LEFT — agent activity */}
          <div className="h-fit rounded-2xl border border-white/70 bg-white/45 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl lg:sticky lg:top-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Agent activity
            </p>

            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {steps.map((step) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-center gap-2.5 text-sm ${
                      step.status === "active"
                        ? "text-zinc-900"
                        : "text-zinc-500"
                    }`}
                  >
                    <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                      {step.status === "active" ? (
                        <motion.span
                          className="h-2 w-2 rounded-full bg-indigo-500"
                          animate={{
                            opacity: [1, 0.3, 1],
                            scale: [1, 0.7, 1],
                          }}
                          transition={{
                            duration: 1.1,
                            repeat: Infinity,
                          }}
                        />
                      ) : (
                        <CheckIcon />
                      )}
                    </span>

                    <span>{step.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {steps.length === 0 && (
                <p className="text-sm text-zinc-500">Starting up...</p>
              )}
            </div>
          </div>

          {/* RIGHT — draft / conversation / actions */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              {assistantText && (
                <motion.div
                  key="assistant"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 whitespace-pre-wrap rounded-2xl border border-white/70 bg-white/55 p-6 leading-relaxed text-[15px] text-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
                >
                  {assistantText}
                </motion.div>
              )}
            </AnimatePresence>

            {draftUrl && (
              <a
                href={draftUrl}
                target="_blank"
                rel="noreferrer"
                className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
              >
                View draft in Gmail <span aria-hidden>→</span>
              </a>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50/80 p-5 shadow-sm backdrop-blur-xl"
              >
                <span className="text-sm text-red-600">
                  {errorMsg}
                </span>

                <button
                  onClick={handleRetry}
                  className="shrink-0 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-400"
                >
                  Retry
                </button>
              </motion.div>
            )}

            {approval?.kind === "question" && (
              <div className="mb-5 flex gap-2">
                <input
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleQuestionReply()
                  }
                  placeholder="Answer the agent's question..."
                  autoFocus
                  className="flex-1 rounded-xl border border-white/70 bg-white/65 px-4 py-3 text-sm text-zinc-900 outline-none backdrop-blur-xl placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
                />

                <button
                  onClick={handleQuestionReply}
                  className="rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 cursor-pointer"
                >
                  Send
                </button>
              </div>
            )}

            {!busy && !approval && !errorMsg && done && !draftUrl && (
              <div className="mb-5 flex gap-2">
                <input
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleReply()
                  }
                  placeholder="Reply to the agent..."
                  className="flex-1 rounded-xl border border-white/70 bg-white/65 px-4 py-3 text-sm text-zinc-900 outline-none backdrop-blur-xl placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15"
                />

                <button
                  onClick={handleReply}
                  className="rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
                >
                  Send
                </button>
              </div>
            )}

            {approval?.kind === "approval" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-indigo-200 bg-white/55 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
              >
                <p className="mb-4 font-semibold text-zinc-900">
                  Ready to save this as a Gmail draft — approve?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(true)}
                    className="cursor-pointer rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleApprove(false)}
                    className="cursor-pointer rounded-xl border border-zinc-200 bg-white/70 px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-white"
                  >
                    Deny
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}