import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your TMDb API key
const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w185';

type Movie = {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  poster_path?: string;
};

interface MovieListProps {
  searchQuery: string;
}

export default function MovieList({ searchQuery }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!searchQuery) {
      setMovies([]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`${TMDB_SEARCH_URL}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch movies');
        setLoading(false);
      });
  }, [searchQuery]);

  if (loading) return <ActivityIndicator size="large" color="#00FFB2" style={{ marginTop: 32 }} />;
  if (error) return <Text style={{ color: 'red', marginTop: 32 }}>{error}</Text>;
  if (!movies.length) return <Text style={{ color: '#fff', marginTop: 32 }}>No movies found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Movie Results</Text>
      <FlatList
        data={movies}
        keyExtractor={(item: Movie) => item.id.toString()}
        renderItem={({ item }: { item: Movie }) => (
          <TouchableOpacity style={styles.item}>
            <Image
              source={{ uri: item.poster_path ? `${TMDB_IMAGE_URL}${item.poster_path}` : undefined }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.details}>Release: {item.release_date || 'N.A.'}</Text>
              <Text style={styles.details}>Rating: {item.vote_average || 'N.A.'}</Text>
              <Text style={styles.overview} numberOfLines={3}>{item.overview || 'No description available.'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    // Glassmorphism for web
    ...(typeof document !== 'undefined' ? { backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' } : {}),
    borderRadius: 0,
    padding: 12,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    backgroundColor: 'rgba(44,62,80,0.7)',
    borderRadius: 8,
    padding: 10,
  },
  thumbnail: {
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: '#222',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
  },
  overview: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 6,
  },
});
