import { TrueForge } from "@truefoundry/trueforge-sdk";
import { NextRequest } from "next/server";

const client = new TrueForge({
  baseUrl: process.env.TRUEFORGE_BASE_URL ?? "http://localhost:8790",
  timeoutInSeconds: 600,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { input, sessionId } = body as { input: unknown[]; sessionId?: string };

  const session = sessionId
    ? { id: sessionId }
    : (await client.sessions.create({ agent: { name: "outreach-agent" } })).data;

  const stream = await client.sessions.createTurnStream(session.id, { input });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`event: session\ndata: ${JSON.stringify({ sessionId: session.id })}\n\n`)
      );
      try {
        for await (const { data: event } of stream.withMetadata()) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}