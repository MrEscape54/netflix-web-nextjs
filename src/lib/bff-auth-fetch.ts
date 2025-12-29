// src/lib/bff-auth-fetch.ts
import { cookies } from 'next/headers';
import { setAuthCookies } from '@/lib/auth-cookies';

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

type BffAuthFetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

/**
 * Calls your Nest API attaching access_token from HttpOnly cookies.
 * If the API returns 401, it attempts a single refresh using refresh_token,
 * updates cookies, and retries once.
 */
export async function bffAuthFetch(apiPath: string, options: BffAuthFetchOptions = {}) {
  const jar = await cookies();
  const access = jar.get('access_token')?.value;

  if (!access) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1) First attempt with current access
  let res = await fetch(`${API}${apiPath}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${access}`,
    },
    cache: 'no-store',
  });

  // 2) If unauthorized, try refresh once and retry
  if (res.status === 401) {
    const refresh = jar.get('refresh_token')?.value;
    if (!refresh) return res;

    const refreshRes = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
      cache: 'no-store',
    });

    if (!refreshRes.ok) return res;

    const { accessToken, refreshToken } = (await refreshRes.json()) as {
      accessToken: string;
      refreshToken: string;
    };

    await setAuthCookies(accessToken, refreshToken);

    // Retry once with new access token
    res = await fetch(`${API}${apiPath}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });
  }

  return res;
}