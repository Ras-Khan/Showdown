import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import FavouritesSection from './FavouritesSection';
import NavBar from './NavBar';
import PeopleList from './PeopleList';
import ShowList from './ShowList';
import ShowModal from './ShowModal';

// import PeopleList from './PeopleList';

interface Show {
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

interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  image?: string;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(40, 50, 60, 0.32)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(8px)' } : {}),
    shadowColor: '#00FFB2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#F5F6FA',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 0,
    // backgroundColor removed for gradient
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#F5F6FA',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    color: '#F5F6FA',
  },
  input: {
    borderWidth: 1,
    borderColor: '#22242A',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#23252B',
    color: '#F5F6FA',
  },
  showItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#23252B',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 4,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#23252B',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    width: '95%',
    maxWidth: 500,
    minHeight: 320,
    maxHeight: '90%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  showName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 2,
    flexWrap: 'wrap',
    color: '#F5F6FA',
  },
  thumbnail: {
    width: 48,
    height: 72,
    borderRadius: 7,
    marginRight: 8,
  },
  resultsBox: {
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    marginBottom: 12,
  },
});

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .web-glass-searchbox {
      background: rgba(44, 62, 80, 0.7); /* Match search button style */
      border-radius: 8px;
      box-shadow: 0 2px 8px 0 rgba(0,255,178,0.08);
      border: 1px solid rgba(255,255,255,0.18);
      color: #fff;
      padding: 10px 18px;
      font-size: 1.08rem;
      outline: none;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      width: 100%; /* Keep width unchanged */
      transition: box-shadow 0.2s;
    }
    .web-glass-searchbox:focus {
      box-shadow: 0 0 0 2px #00FFB2;
    }
  `;
  document.head.appendChild(style);
}

const Showdown: React.FC = () => {
  const [favourites, setFavourites] = useState<Show[]>([]);
  const [allShows, setAllShows] = useState<Show[]>([]);

  // Load favourites from AsyncStorage on mount
  React.useEffect(() => {
    (async () => {
      try {
        const favs = await AsyncStorage.getItem('favourites');
        if (favs) setFavourites(JSON.parse(favs));
      } catch {}
    })();
  }, []);

  // Save favourites to AsyncStorage whenever they change
  React.useEffect(() => {
    AsyncStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);
  // Always collapse summary after ~4 lines
  const imageHeight = 270; // matches modal image height
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [episodesSectionCollapsed, setEpisodesSectionCollapsed] = useState(true);
  const [castSectionCollapsed, setCastSectionCollapsed] = useState(true);
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState<Show[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [seasonsCount, setSeasonsCount] = useState<number>(0);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [collapsedSeasons, setCollapsedSeasons] = useState<{ [season: number]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      // Fetch episodes for each show in parallel
      const showData: Show[] = await Promise.all(
        data.map(async (item: any) => {
          const show = item.show;
          let nextEpisode = undefined;
          let seasonsCount = undefined;
          let episodesCount = undefined;
          try {
            const episodesRes = await fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`);
            const episodesData = await episodesRes.json();
            const seasons = Array.from(new Set(episodesData.map((ep: any) => ep.season)));
            seasonsCount = seasons.length;
            episodesCount = episodesData.length;
            // Find next episode if show is running
            if (show.status === 'Running') {
              const now = new Date();
              const upcoming = episodesData.find((ep: any) => {
                if (!ep.airdate) return false;
                const air = new Date(ep.airdate);
                return air > now;
              });
              if (upcoming) {
                nextEpisode = {
                  airdate: upcoming.airdate,
                  episode: upcoming.number,
                  season: upcoming.season,
                };
              }
            }
          } catch {}
          return {
            id: show.id,
            name: show.name,
            image: show.image?.medium,
            summary: show.summary,
            status: show.status,
            nextEpisode,
            seasonsCount,
            episodesCount,
          };
        })
      );
      setShows(showData);
      // Add new shows to allShows, avoiding duplicates
      setAllShows(prev => {
        const existingIds = new Set(prev.map(s => s.id));
        const newShows = showData.filter(s => !existingIds.has(s.id));
        return [...prev, ...newShows];
      });
    } catch (err: any) {
      setError('Failed to fetch shows');
    }
    setLoading(false);
  };

  const { width: windowWidth } = useWindowDimensions();
  const modalWidth = Math.min(windowWidth * 0.95, 900);
  const [activeSection, setActiveSection] = useState('TV shows');
  // const [people, setPeople] = useState([]);

  const [sectionsCollapsed, setSectionsCollapsed] = useState(false);
  React.useEffect(() => {
    if (query.length > 0) {
      setSectionsCollapsed(true);
    } else {
      setSectionsCollapsed(false);
    }
  }, [query]);

  const sectionTabs = ['TV shows', 'People', 'Movies'];

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <LinearGradient
        colors={[ 'rgba(0,255,128,0.25)', 'rgba(0,255,128,0.10)', 'rgba(0,0,0,0.0)' ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.7 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%', zIndex: 0 }}
      />
      <View style={{ flex: 1 }}>
        <NavBar activeSection={activeSection} onSectionChange={setActiveSection} />
        {activeSection === 'TV shows' && (
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
            {!sectionsCollapsed && (
              <View style={{ width: '100%', maxWidth: 600, marginBottom: 18, marginHorizontal: 'auto', alignItems: 'center' }}>
                <FavouritesSection
                  favourites={favourites}
                  setFavourites={setFavourites}
                  styles={styles}
                  onShowPress={async (item) => {
                    setSelectedShow(item);
                    setModalVisible(true);
                    setDetailsLoading(true);
                    setEpisodesSectionCollapsed(true);
                    setCastSectionCollapsed(true);
                    // Fetch episodes
                    try {
                      const episodesRes = await fetch(`https://api.tvmaze.com/shows/${item.id}/episodes`);
                      const episodesData: any[] = await episodesRes.json();
                      setEpisodes(episodesData);
                      // Count seasons and episodes
                      const seasons = Array.from(new Set(episodesData.map((ep: any) => ep.season)));
                      setSeasonsCount(seasons.length);
                      setSelectedShow((prev) => prev ? { ...prev, seasonsCount: seasons.length, episodesCount: episodesData.length } : prev);
                      const collapsed: { [season: number]: boolean } = {};
                      (seasons as number[]).forEach((seasonNum: number) => { collapsed[seasonNum] = true; });
                      setCollapsedSeasons(collapsed);
                    } catch {}
                    // Fetch cast
                    try {
                      const castRes = await fetch(`https://api.tvmaze.com/shows/${item.id}/cast`);
                      const castData: any[] = await castRes.json();
                      setCast(castData.map((c: any) => ({
                        id: c.person.id,
                        name: c.person.name,
                        character: c.character.name,
                        image: c.person.image?.medium,
                      })));
                    } catch {}
                    setDetailsLoading(false);
                  }}
                />
              </View>
            )}
            <View style={{ alignItems: 'center', marginTop: 0, marginBottom: 18 }}>
              {Platform.OS === 'web' ? (
                <div style={{
                  background: 'rgba(44, 62, 80, 0.7)',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px 0 rgba(0,255,178,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#fff',
                  padding: '10px 18px',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  width: '520px',
                  maxWidth: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  margin: '24px auto 24px auto', // Add top and bottom margin
                }}>
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search for a TV show..."
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#fff',
                      fontSize: '1.08rem',
                      width: '100%',
                      padding: 0,
                    }}
                  />
                  {query.length > 0 && (
                    <TouchableOpacity
                      style={{ position: 'absolute', right: 10, top: 0, height: 40, justifyContent: 'center', alignItems: 'center' }}
                      onPress={() => {
                        setQuery('');
                        setShows([]);
                      }}
                      accessibilityLabel="Clear search"
                    >
                      <Text style={{ fontSize: 20, color: '#888' }}>✕</Text>
                    </TouchableOpacity>
                  )}
                </div>
              ) : (
                <TextInput
                  style={[styles.input, { paddingRight: 40, height: 40 }]}
                  placeholder="Search for a TV show..."
                  value={query}
                  onChangeText={setQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
              )}
              <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
            {shows.length > 0 && (
              <View style={[styles.resultsBox, { flex: 1, backgroundColor: '#111218', marginTop: 24 }]}> 
                <Text style={styles.resultsTitle}>Search Results</Text>
                <ShowList
                  shows={shows}
                  favourites={favourites}
                  setFavourites={setFavourites}
                  onShowPress={async (item) => {
                    setSelectedShow(item);
                    setModalVisible(true);
                    setDetailsLoading(true);
                    setEpisodesSectionCollapsed(true);
                    setCastSectionCollapsed(true);
                    // Fetch episodes
                    try {
                      const episodesRes = await fetch(`https://api.tvmaze.com/shows/${item.id}/episodes`);
                      const episodesData = await episodesRes.json();
                      setEpisodes(episodesData);
                      // Count seasons and episodes
                      const seasons = Array.from(new Set(episodesData.map((ep: any) => ep.season)));
                      setSeasonsCount(seasons.length);
                      setSelectedShow(prev => prev ? { ...prev, seasonsCount: seasons.length, episodesCount: episodesData.length } : prev);
                      const collapsed: { [season: number]: boolean } = {};
                      (seasons as number[]).forEach((seasonNum: number) => { collapsed[seasonNum] = true; });
                      setCollapsedSeasons(collapsed);
                    } catch {}
                    // Fetch cast
                    try {
                      const castRes = await fetch(`https://api.tvmaze.com/shows/${item.id}/cast`);
                      const castData = await castRes.json();
                      setCast(castData.map((c: any) => ({
                        id: c.person.id,
                        name: c.person.name,
                        character: c.character.name,
                        image: c.person.image?.medium,
                      })));
                    } catch {}
                    setDetailsLoading(false);
                  }}
                  styles={styles}
                />
              </View>
            )}
            <ShowModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              show={selectedShow}
              favourites={favourites}
              setFavourites={setFavourites}
              episodes={episodes}
              cast={cast}
              seasonsCount={seasonsCount}
              detailsLoading={detailsLoading}
              summaryExpanded={summaryExpanded}
              setSummaryExpanded={setSummaryExpanded}
              episodesSectionCollapsed={episodesSectionCollapsed}
              setEpisodesSectionCollapsed={setEpisodesSectionCollapsed}
              castSectionCollapsed={castSectionCollapsed}
              setCastSectionCollapsed={setCastSectionCollapsed}
              collapsedSeasons={collapsedSeasons}
              setCollapsedSeasons={setCollapsedSeasons}
              modalWidth={modalWidth}
              styles={styles}
            />
          </View>
        )}
        {activeSection === 'People' && (
          <View style={{ flex: 1, alignItems: 'center', marginTop: 0, marginBottom: 18 }}>
            {Platform.OS === 'web' ? (
              <div style={{
                background: 'rgba(44, 62, 80, 0.7)',
                borderRadius: 8,
                boxShadow: '0 2px 8px 0 rgba(0,255,178,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#fff',
                padding: '10px 18px',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                width: '520px',
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                margin: '24px auto 24px auto',
              }}>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search for a person..."
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: '1.08rem',
                    width: '100%',
                    padding: 0,
                  }}
                />
                {query.length > 0 && (
                  <TouchableOpacity
                    style={{ position: 'absolute', right: 10, top: 0, height: 40, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                      setQuery('');
                    }}
                    accessibilityLabel="Clear search"
                  >
                    <Text style={{ fontSize: 20, color: '#888' }}>✕</Text>
                  </TouchableOpacity>
                )}
              </div>
            ) : (
              <TextInput
                style={[styles.input, { paddingRight: 40, height: 40 }]}
                placeholder="Search for a person..."
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
              />
            )}
            <TouchableOpacity style={styles.button} onPress={() => {}}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            <View style={{ width: '100%', maxWidth: 600, marginTop: 24 }}>
              <PeopleList searchQuery={query} />
            </View>
          </View>
        )}
        {activeSection === 'Movies' && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#F5F6FA', fontSize: 28, fontWeight: 'bold', marginTop: 40 }}>Movies</Text>
            <Text style={{ color: '#A0A2B2', fontSize: 18, marginTop: 12 }}>Coming soon...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Showdown;