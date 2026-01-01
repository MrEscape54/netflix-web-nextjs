'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type SuggestItem =
  | { kind: 'title'; id: string; name: string; type: 'movie' | 'series'; year: number | null; posterUrl: string | null }
  | { kind: 'genre'; name: string }
  | { kind: 'people'; tmdbId: number; name: string; profileUrl?: string | null };

export function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<'all' | 'title' | 'people' | 'genre'>('all');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<SuggestItem[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    const query = q.trim();
    if (!open || query.length < 2) {
      setItems([]);
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}&scope=${scope}`, {
          cache: 'no-store',
          signal: ac.signal,
        });
        if (!r.ok) {
          setItems([]);
          return;
        }
        const data = await r.json();
        setItems(data.items ?? []);
      } finally {
        setLoading(false);
      }
    }, 200); // debounce

    return () => clearTimeout(t);
  }, [q, scope, open]);

  function goSearch() {
    const query = q.trim();
    if (!query) return;
    const params = new URLSearchParams();
    params.set('q', query);
    params.set('scope', scope);
    router.push(`/search?${params.toString()}`);
    setItems([]);
  }

  function onPick(item: SuggestItem) {
    setItems([]);
    if (item.kind === 'title') router.push(`/title/${item.id}`);
    if (item.kind === 'genre') router.push(`/?genre=${encodeURIComponent(item.name)}&page=1`);
    if (item.kind === 'people') router.push(`/search?scope=people&q=${encodeURIComponent(item.name)}`);
  }

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgb(20,20,20)',
        color: 'white',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <Link href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 800, letterSpacing: 0.5 }}>
        NETFLIX MVP
      </Link>

      <nav style={{ display: 'flex', gap: 14, opacity: 0.9 }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link href="/browse/genre/83" style={{ color: 'white', textDecoration: 'none' }}>Shows</Link>
        <Link href="/browse/genre/34399" style={{ color: 'white', textDecoration: 'none' }}>Movies</Link>
        <Link href="/latest" style={{ color: 'white', textDecoration: 'none' }}>New & Popular</Link>
        <Link href="/my-list" style={{ color: 'white', textDecoration: 'none' }}>My List</Link>
      </nav>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Search"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: 18,
          }}
        >
          🔍
        </button>

        {open && (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as 'all' | 'title' | 'people' | 'genre')}
                style={{ padding: '8px 10px', borderRadius: 8 }}
              >
                <option value="all">All</option>
                <option value="title">Titles</option>
                <option value="people">People</option>
                <option value="genre">Genres</option>
              </select>

              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') goSearch();
                  if (e.key === 'Escape') setOpen(false);
                }}
                placeholder="Titles, people, genres"
                style={{
                  width: 320,
                  padding: '9px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(0,0,0,0.35)',
                  color: 'white',
                  outline: 'none',
                }}
              />
            </div>

            {(loading || items.length > 0) && (
              <div
                style={{
                  position: 'absolute',
                  top: 44,
                  right: 0,
                  width: 420,
                  background: 'rgb(18,18,18)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                {loading && <div style={{ padding: 12, opacity: 0.75 }}>Searching…</div>}

                {items.map((it, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPick(it)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      padding: 10,
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                    }}
                  >
                    {it.kind === 'title' && (
                      <>
                        {it.posterUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={it.posterUrl} alt="" style={{ width: 40, height: 56, objectFit: 'cover', borderRadius: 6 }} />
                        ) : (
                          <div style={{ width: 40, height: 56, background: '#333', borderRadius: 6 }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 700 }}>{it.name}</div>
                          <div style={{ fontSize: 12, opacity: 0.7 }}>
                            {it.type} {it.year ? `· ${it.year}` : ''}
                          </div>
                        </div>
                      </>
                    )}

                    {it.kind === 'genre' && (
                      <div>
                        <div style={{ fontWeight: 700 }}>Genre</div>
                        <div style={{ opacity: 0.85 }}>{it.name}</div>
                      </div>
                    )}

                    {it.kind === 'people' && (
                      <div>
                        <div style={{ fontWeight: 700 }}>Person</div>
                        <div style={{ opacity: 0.85 }}>{it.name}</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <Link href="/login" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>
          Login
        </Link>
      </div>
    </div>
  );
}
