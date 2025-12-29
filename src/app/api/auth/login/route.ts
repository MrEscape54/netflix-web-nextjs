import { NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/auth-cookies';

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function POST(req: Request) {
  const body = await req.json();

  const r = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!r.ok) {
    return new NextResponse(await r.text(), { status: r.status });
  }

  const { accessToken, refreshToken } = await r.json();
  await setAuthCookies(accessToken, refreshToken); // ✅ await

  return NextResponse.json({ ok: true });
}
