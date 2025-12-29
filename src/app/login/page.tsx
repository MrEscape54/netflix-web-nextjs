'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('Password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) throw new Error(await r.text());
      router.push('/');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>

      <form onSubmit={onSubmit} style={{ marginTop: 12, display: 'grid', gap: 10, maxWidth: 360 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
          style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button disabled={loading} style={{ padding: 10, borderRadius: 8 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>

      <p style={{ marginTop: 12, opacity: 0.7 }}>
        Tip: Si reseteaste la DB, acordate de volver a <code>/auth/register</code> desde Postman/curl.
      </p>
    </main>
  );
}
