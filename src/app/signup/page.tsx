'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const sp = useSearchParams();


  const [email, setEmail] = useState(sp.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const r = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await r.text();
      if (!r.ok) {
        setMsg(text);
        return;
      }

      setMsg('Check your email to verify your account (see MailHog).');
      // opcional: router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 32, maxWidth: 520, margin: '0 auto' }}>
      <h1>Create your account</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ padding: 12, borderRadius: 10, border: '1px solid #ddd' }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 chars)"
          type="password"
          style={{ padding: 12, borderRadius: 10, border: '1px solid #ddd' }}
        />

        <button disabled={loading} style={{ padding: 12, borderRadius: 10 }}>
          {loading ? 'Creating...' : 'Sign up'}
        </button>

        {msg && <pre style={{ whiteSpace: 'pre-wrap', opacity: 0.85 }}>{msg}</pre>}
      </form>

      <p style={{ marginTop: 16, opacity: 0.8 }}>
        Open MailHog inbox: <a href="http://localhost:8025" target="_blank" rel="noreferrer">http://localhost:8025</a>
      </p>
    </main>
  );
}
