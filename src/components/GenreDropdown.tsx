'use client';

import { useRouter } from 'next/navigation';

type Genre = { id: string; name: string };

export function GenreDropdown({
  genres,
  value,
  baseType,
  placeholder = 'All genres',
}: {
  genres: Genre[];
  value: string; // selected genreId or ''
  baseType: 'movie' | 'series' | ''; // derived from bc/base page
  placeholder?: string;
}) {
  const router = useRouter();

  function onChange(nextGenreId: string) {
    const bc = baseType === 'movie' ? '34399' : baseType === 'series' ? '83' : '';
    const href = nextGenreId ? `/browse/genre/${nextGenreId}?bc=${bc}` : `/browse/genre/${bc}`;
    router.push(href);
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: 10, borderRadius: 10 }}
    >
      <option value="">{placeholder}</option>
      {genres.map((g) => (
        <option key={g.id} value={g.id}>
          {g.name}
        </option>
      ))}
    </select>
  );
}
