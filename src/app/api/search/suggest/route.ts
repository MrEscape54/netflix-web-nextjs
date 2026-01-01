import { NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const scope = searchParams.get('scope') ?? 'all';

  const r = await fetch(`${API}/search/suggest?q=${encodeURIComponent(q)}&scope=${encodeURIComponent(scope)}`, {
    cache: 'no-store',
  });

  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { 'Content-Type': r.headers.get('Content-Type') ?? 'application/json' },
  });
}
