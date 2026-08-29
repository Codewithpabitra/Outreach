import { NextRequest, NextResponse } from "next/server";
import { getOutreach, updateOutreach } from "@/lib/store";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = getOutreach(id);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(record);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patch = await req.json();
  const record = updateOutreach(id, patch);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(record);
}