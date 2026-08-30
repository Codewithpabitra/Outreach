import { NextRequest, NextResponse } from "next/server";
import { createOutreach, listOutreach } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    senderName,
    company,
    role,
    recipientName,
    recipientEmail,
    background,
  } = body;
  if (
    !senderName ||
    !company ||
    !role ||
    !recipientName ||
    !recipientEmail ||
    !background
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  const record = createOutreach({
    senderName,
    company,
    role,
    recipientName,
    recipientEmail,
    background,
  });
  return NextResponse.json(record);
}

export async function GET() {
  return NextResponse.json(listOutreach());
}
