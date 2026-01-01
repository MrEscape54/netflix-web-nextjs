'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyPage() {
  const sp = useSearchParams();
  const token = sp.get('token') ?? '';
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`http://localhost:3001/auth/verify?token=${encodeURIComponent(token)}`, {
          cache: 'no-store',
        });
        const text = await r.text();
        if (!r.ok) {
          setStatus('error');
          setMsg(text);
          return;
        }
        setStatus('ok');
        setMsg('Account verified! You can now log in.');
      } catch (e: unknown) {
        setStatus('error');
        setMsg(e instanceof Error ? e.message : 'Error');
      }
    })();
  }, [token]);

  return (
    <main style={{ padding: 32, maxWidth: 620, margin: '0 auto' }}>
      <h1>Verify email</h1>
      {status === 'loading' && <p>Verifying…</p>}
      {status !== 'loading' && <pre style={{ whiteSpace: 'pre-wrap' }}>{msg}</pre>}
      <div style={{ marginTop: 16 }}>
        <Link href="/login">Go to Login</Link>
      </div>
    </main>
  );
}
