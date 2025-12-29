import Link from 'next/link';
import { apiGet } from '@/lib/api';
import type { CatalogResponse } from '@/types';

export default async function HomePage() {
  const data = await apiGet<CatalogResponse>('/catalog?page=1&pageSize=20', { cache: 'no-store' });

  return (
    <main style={{ padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Netflix MVP</h1>
        <Link href="/login">Login</Link>
      </header>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
        {data.items.map((t) => (
          <Link key={t.id} href={`/title/${t.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden' }}>
              {t.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.posterUrl} alt={t.name} style={{ width: '100%', height: 260, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 260, background: '#eee' }} />
              )}
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <div style={{ opacity: 0.7, fontSize: 12 }}>
                  {t.type} · {t.year ?? '—'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
