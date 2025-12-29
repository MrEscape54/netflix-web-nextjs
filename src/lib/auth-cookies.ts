import { cookies } from 'next/headers';

const isProd = process.env.NODE_ENV === 'production';

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const jar = await cookies(); // 👈 await

  jar.set('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
  });

  jar.set('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/api',
  });
}

export async function clearAuthCookies() {
  const jar = await cookies();

  jar.set('access_token', '', { httpOnly: true, path: '/', expires: new Date(0) });

  // ✅ mismo path para borrar correctamente
  jar.set('refresh_token', '', { httpOnly: true, path: '/api', expires: new Date(0) });
}
