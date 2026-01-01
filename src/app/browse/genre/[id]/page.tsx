import Link from 'next/link';
import { apiGet } from '@/lib/api';
import type { CatalogResponse, Genre, Title } from '@/types';
import { GenreDropdown } from '@/components/GenreDropdown';

function pickRandom<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function bcToType(bc?: string): 'movie' | 'series' | '' {
  if (bc === '34399') return 'movie';
  if (bc === '83') return 'series';
  return '';
}

export default async function BrowseGenrePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ bc?: string; page?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const page = Number(sp.page ?? '1') || 1;
  const pageSize = 40;

  const isMoviesBase = id === '34399';
  const isShowsBase = id === '83';

  const baseType: 'movie' | 'series' | '' =
    isMoviesBase ? 'movie' : isShowsBase ? 'series' : bcToType(sp.bc);

  const genreId = isMoviesBase || isShowsBase ? '' : id;

  const [genres, data] = await Promise.all([
    apiGet<Genre[]>('/genres', { cache: 'no-store' }),
    apiGet<CatalogResponse>(
      `/catalog/search?type=${encodeURIComponent(baseType)}&genreId=${encodeURIComponent(
        genreId,
      )}&page=${page}&pageSize=${pageSize}`,
      { cache: 'no-store' },
    ),
  ]);

  const hero = pickRandom<Title>(data.items);

  const titleLabel = isMoviesBase
    ? 'Movies'
    : isShowsBase
      ? 'Shows'
      : baseType === 'movie'
        ? 'Movies'
        : baseType === 'series'
          ? 'Shows'
          : 'Browse';

  const selectedGenre = genreId ? genres.find((g) => g.id === genreId) : null;

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>{titleLabel}</h1>
          {selectedGenre && <p style={{ margin: '6px 0 0 0', opacity: 0.75 }}>{selectedGenre.name}</p>}
        </div>

        {/* Genre dropdown like Netflix (only in Movies/Shows context) */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <label style={{ opacity: 0.8 }}>Genre:</label>
          <GenreDropdown
            genres={genres}
            value={genreId || ''}
            baseType={baseType}
            placeholder="All genres"
          />

          <Link href="/browse" style={{ textDecoration: 'none' }}>
            ← Home
          </Link>
        </div>
      </div>

      {/* Hero trailer area */}
      <section
        style={{
          marginTop: 16,
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #222',
          background: '#111',
        }}
      >
        <div style={{ padding: 16 }}>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Featured trailer (random pick)</div>
          <h2 style={{ margin: '6px 0 0 0' }}>{hero ? hero.name : 'No titles found'}</h2>
          <p style={{ margin: '8px 0 0 0', maxWidth: 900, opacity: 0.8 }}>
            {hero?.description ?? '—'}
          </p>
        </div>

        {/* For now: same HLS for all */}
        <div style={{ padding: 16, paddingTop: 0 }}>
          <video
            controls
            style={{ width: '100%', maxWidth: 980, borderRadius: 12 }}
            src="http://localhost:8080/hls/master.m3u8"
          />
        </div>
      </section>

      {/* Grid */}
      <div
        style={{
          marginTop: 18,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
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
