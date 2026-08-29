"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

type ChatEvent = Record<string, any>;
type Record_ = {
  id: string;
  company: string;
  role: string;
  recipientName?: string;
  recipientEmail?: string;
  background: string;
  status: string;
  sessionId?: string;
};

export default function DraftReview() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<Record_ | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [assistantText, setAssistantText] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [replyInput, setReplyInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<unknown[] | null>(null);
  const started = useRef(false);
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
          `Draft an outreach email to ${rec.recipientName || "a recruiter"} ` +
          `(${rec.recipientEmail || "no email provided yet — ask me for it before drafting"}) ` +
          `at ${rec.company} regarding: ${rec.role}. About me: ${rec.background}`;
        const input = [{ type: "user.message", content: prompt }];
        setLastInput(input);
        send(input);
      });
  }, [id]);

  async function send(input: unknown[]) {
    setBusy(true);
    setDone(false);
    setApproval(null);
    setErrorMsg(null);
    setLastInput(input);

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
        const dataLine = chunk.split("\n").find((l) => l.startsWith("data: "));
        if (!dataLine) continue;
        const payload = JSON.parse(dataLine.slice(6));

        if (chunk.startsWith("event: session")) {
          currentSessionId = payload.sessionId;
          setSessionId(payload.sessionId);
          continue;
        }
        handleEvent(payload);
      }
    }
    setBusy(false);

    if (currentSessionId) {
      fetch(`/api/outreach/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: currentSessionId }),
      });
    }
  }

  function handleEvent(event: ChatEvent) {
    if (event.type === "model.message.delta") {
      setAssistantText((prev) => prev + (event.content ?? ""));
    }

    if (event.type === "model.message" && event.toolCalls?.length) {
      for (const call of event.toolCalls) {
        setLog((prev) => [...prev, `→ ${call.function?.name ?? "tool call"}`]);
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
        const isQuota = raw.includes("429") || raw.toLowerCase().includes("quota");
        setErrorMsg(
          isQuota
            ? "The AI model hit its rate limit. Please wait a moment and try again."
            : "Something went wrong while processing this request. Please try again."
        );
        setLog((prev) => [...prev, isQuota ? "⚠ Rate limit hit" : "⚠ Error occurred"]);
        setDone(false);
        return;
      }

      setDone(true);
      setLog((prev) => [...prev, "Turn complete."]);

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
      setLog((prev) => [
        ...prev,
        `✓ ${event.content?.slice(0, 200) ?? "(empty)"}`,
      ]);
      if (id) {
        fetch(`/api/outreach/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "sent" }),
        });
      }
    }
  }

  function handleReply() {
    if (!replyInput.trim() || approval) return;
    setAssistantText("");
    send([{ type: "user.message", content: replyInput }]);
    setReplyInput("");
  }

  function handleQuestionReply() {
    if (!replyInput.trim() || !approval || approval.kind !== "question") return;
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

  if (!record)
    return <div style={{ background: "#0B0B0F", minHeight: "100dvh" }} />;

  const heading = busy
    ? "Working..."
    : errorMsg
    ? "Something went wrong"
    : done
    ? "Draft ready"
    : "Outreach";

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0B0B0F",
        color: "#F5F5F7",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px" }}>
        <p
          style={{
            color: "#A1A1AA",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {record.company} · {record.role}
        </p>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginTop: 4,
            marginBottom: 32,
          }}
        >
          {heading}
        </h1>

        {/* Activity timeline */}
        {log.length > 0 && (
          <div style={{ marginBottom: 24, fontSize: 13, color: "#71717A" }}>
            {log.map((line, i) => (
              <div key={i} style={{ marginBottom: 4 }}>
                {line}
              </div>
            ))}
          </div>
        )}

        {/* Streamed assistant content — question or draft */}
        {assistantText && (
          <div
            style={{
              background: "#18181B",
              border: "1px solid #343439",
              borderRadius: 14,
              padding: 24,
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              fontSize: 15,
              marginBottom: 20,
            }}
          >
            {assistantText}
          </div>
        )}

        {/* Error card — never show raw provider error text */}
        {errorMsg && (
          <div
            style={{
              background: "#2A1414",
              border: "1px solid #EF4444",
              borderRadius: 14,
              padding: 20,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <span style={{ color: "#FCA5A5", fontSize: 14 }}>{errorMsg}</span>
            <button
              onClick={handleRetry}
              style={{
                background: "#EF4444",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Agent is asking a clarifying question (tool.response_required) */}
        {approval?.kind === "question" && (
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <input
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuestionReply()}
              placeholder="Answer the agent's question..."
              autoFocus
              style={{
                flex: 1,
                background: "#18181B",
                border: "1px solid #6366F1",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#fff",
              }}
            />
            <button
              onClick={handleQuestionReply}
              style={{
                background: "#6366F1",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "0 20px",
                fontWeight: 600,
              }}
            >
              Send
            </button>
          </div>
        )}

        {/* Free-form follow-up once a turn has finished cleanly with no pending action */}
        {!busy && !approval && !errorMsg && done && (
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <input
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReply()}
              placeholder="Reply to the agent..."
              style={{
                flex: 1,
                background: "#18181B",
                border: "1px solid #343439",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#fff",
              }}
            />
            <button
              onClick={handleReply}
              style={{
                background: "#27272A",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "0 20px",
              }}
            >
              Send
            </button>
          </div>
        )}

        {/* Approval gate — the demo moment */}
        {approval?.kind === "approval" && (
          <div
            style={{
              background: "#1F1F22",
              border: "1px solid #6366F1",
              borderRadius: 14,
              padding: 24,
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: 16 }}>
              Ready to save this as a Gmail draft — approve?
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => handleApprove(true)}
                style={{
                  background: "#6366F1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 24px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Approve
              </button>
              <button
                onClick={() => handleApprove(false)}
                style={{
                  background: "#27272A",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 24px",
                  cursor: "pointer",
                }}
              >
                Deny
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}