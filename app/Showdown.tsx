import React, { useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';

interface Show {
  id: number;
  name: string;
  image?: string;
  nextEpisode?: {
    airdate: string;
    episode: number;
    season: number;
  };
}

function getCountdown(airdate: string): string {
  const now = new Date();
  const target = new Date(airdate);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return 'Already aired';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
}

interface SearchShowsData {
  searchShows: Show[];
}

const Showdown: React.FC = () => {
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Search for shows
      const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
      const results = await res.json();
      // For each show, fetch next episode
      const showData: Show[] = await Promise.all(results.map(async (result: any) => {
        const show = result.show;
        let nextEpisode = undefined;
        if (show._links && show._links.nextepisode) {
          const epRes = await fetch(show._links.nextepisode.href);
          const ep = await epRes.json();
          nextEpisode = {
            airdate: ep.airdate,
            episode: ep.number,
            season: ep.season,
          };
        }
        return {
          id: show.id,
          name: show.name,
          image: show.image?.medium,
          nextEpisode,
        };
      }));
      setShows(showData);
    } catch (err: any) {
      setError('Failed to fetch shows');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Showdown</Text>
        <TextInput
        style={styles.input}
        placeholder="Search for a TV show..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        />
      <Button title="Search" onPress={handleSearch} />
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      <FlatList
        data={shows}
        keyExtractor={(item: Show) => item.id.toString()}
        renderItem={({ item }: { item: Show }) => (
          <View style={styles.showItem}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.thumbnail} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.showName}>{item.name}</Text>
              {item.nextEpisode ? (
                <>
                  <Text>
                    Next Episode: S{item.nextEpisode.season}E{item.nextEpisode.episode}
                  </Text>
                  <Text>Air Date: {item.nextEpisode.airdate}</Text>
                  <Text>Countdown: {getCountdown(item.nextEpisode.airdate)}</Text>
                </>
              ) : (
                <Text>No upcoming episodes found.</Text>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
    showItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', alignItems: 'center' },
    showName: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
    thumbnail: { width: 60, height: 90, borderRadius: 5 },
});

export default Showdown;
