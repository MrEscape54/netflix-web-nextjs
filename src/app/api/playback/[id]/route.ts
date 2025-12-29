import { NextResponse } from 'next/server';
import { bffAuthFetch } from '@/lib/bff-auth-fetch';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const r = await bffAuthFetch(`/playback/${id}`, { method: 'GET' });

  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { 'Content-Type': r.headers.get('Content-Type') ?? 'application/json' },
  });
}
