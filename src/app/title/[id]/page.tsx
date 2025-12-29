import Link from 'next/link';
import { apiGet } from '@/lib/api';
import type { Title } from '@/types';
import { PlaySection } from '@/components/PlaySection';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TitlePage({ params }: PageProps) {
  const { id } = await params; // ✅ unwrap the Promise

  const title = await apiGet<Title>(`/titles/${id}`, { cache: 'no-store' });

  return (
    <main style={{ padding: 24 }}>
      <Link href="/">← Back</Link>

      <h1 style={{ marginTop: 12 }}>{title.name}</h1>
      <p style={{ opacity: 0.75 }}>
        {title.type} · {title.year ?? '—'} · {title.ageRating ?? '—'}
      </p>

      {title.backdropUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={title.backdropUrl}
          alt=""
          style={{ width: '100%', maxWidth: 960, borderRadius: 12, marginTop: 12 }}
        />
      )}

      {title.description && <p style={{ marginTop: 12, maxWidth: 960 }}>{title.description}</p>}

      <div style={{ marginTop: 8, maxWidth: 960 }}>
        <strong>Genres:</strong> {title.genres?.map((g) => g.name).join(', ') || '—'}
      </div>

      <PlaySection titleId={title.id} />
    </main>
  );
}
