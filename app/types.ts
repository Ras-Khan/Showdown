export interface Show {
  id: number;
  name: string;
  image?: string;
  summary?: string;
  status?: string;
  seasonsCount?: number;
  episodesCount?: number;
  nextEpisode?: {
    airdate: string;
    episode: number;
    season: number;
  };
}

export interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  image?: string;
}
