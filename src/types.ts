export type Genre = { id: string; name: string };

export type Title = {
  id: string;
  name: string;
  type: 'movie' | 'series';
  year: number | null;
  description: string | null;
  ageRating: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  featured: boolean;
  genres: Genre[];
};

export type CatalogResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: Title[];
};

export type LoginResponse = { accessToken: string };

export type PlaybackResponse = {
  titleId: string;
  playbackUrl: string;
  type: 'hls';
};
