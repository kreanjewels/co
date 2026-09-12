import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  privacy: z.literal(true),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid details.' }, { status: 400 });
  }

  if (process.env.FORMSPREE_ENDPOINT) {
    const delivery = await fetch(process.env.FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(parsed.data),
    });
    if (!delivery.ok) {
      return NextResponse.json({ error: 'Unable to deliver enquiry.' }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
