import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { setAuthCookies } from '@/lib/auth-cookies';

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function POST() {
  const jar = await cookies(); // ✅ await
  const refresh = jar.get('refresh_token')?.value;

  if (!refresh) {
    return NextResponse.json({ ok: false, reason: 'no_refresh' }, { status: 401 });
  }

  const r = await fetch(`${API}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refresh }),
    cache: 'no-store',
  });

  if (!r.ok) {
    return new NextResponse(await r.text(), { status: r.status });
  }

  const { accessToken, refreshToken } = await r.json();
  await setAuthCookies(accessToken, refreshToken); // ✅ await

  return NextResponse.json({ ok: true });
}