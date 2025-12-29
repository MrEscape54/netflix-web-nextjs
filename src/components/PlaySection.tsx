'use client';

import { useState } from 'react';
import type { PlaybackResponse } from '@/types';
import { VideoPlayer } from './VideoPlayer';

export function PlaySection({ titleId }: { titleId: string }) {
  const [loading, setLoading] = useState(false);
  const [playUrl, setPlayUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onPlay() {
    setError(null);
    setLoading(true);

    try {
      const r = await fetch(`/api/playback/${titleId}`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!r.ok) {
        if (r.status === 401) {
          setError('Sesión expirada. Volvé a iniciar sesión.');
          window.location.href = '/login';
          return;
        }

        const text = await r.text();
        setError(text || 'Error al obtener playback');
        return;
      }

      const data = (await r.json()) as PlaybackResponse;
      setPlayUrl(data.playbackUrl);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={onPlay} disabled={loading} style={{ padding: '10px 16px', borderRadius: 10 }}>
        {loading ? 'Cargando...' : 'Play'}
      </button>

      {error && <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p>}

      {playUrl && (
        <div style={{ marginTop: 16 }}>
          <VideoPlayer src={playUrl} />
        </div>
      )}
    </div>
  );
}
