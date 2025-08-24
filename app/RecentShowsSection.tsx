import { AntDesign } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import getCountdown from './getCountdown';
import { Show } from './types';

interface RecentShowsSectionProps {
  shows: Show[];
  favourites: Show[];
  setFavourites: (favs: Show[]) => void;
  styles: any;
}

export const RecentShowsSection: React.FC<RecentShowsSectionProps> = ({ shows, favourites, setFavourites, styles }) => {
  const sortedShows = shows
    .filter(show => show.nextEpisode)
    .sort((a, b) => {
      const aTime = a.nextEpisode && a.nextEpisode.airdate ? new Date(a.nextEpisode.airdate).getTime() : Infinity;
      const bTime = b.nextEpisode && b.nextEpisode.airdate ? new Date(b.nextEpisode.airdate).getTime() : Infinity;
      return aTime - bTime;
    })
    .slice(0, 10);

  const scrollRef = useRef<ScrollView>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={[styles.section, { marginHorizontal: 18 }] }>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#F5F6FA' }}>Most Recent Shows</Text>
      {sortedShows.length === 0 ? (
        <Text style={{ color: '#A0A2B2' }}>No recent shows.</Text>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative', width: '100%' }}>
          <TouchableOpacity onPress={scrollLeft} style={localStyles.arrowButton}>
            <Text style={localStyles.arrowText}>{'◀'}</Text>
          </TouchableOpacity>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={true}
            style={localStyles.scrollView}
            contentContainerStyle={{ alignItems: 'flex-start' }}
          >
            {sortedShows.map(item => (
              <View key={item.id} style={{ marginRight: 16, alignItems: 'center', width: 80 }}>
                <View style={{ position: 'relative' }}>
                  {item.image && (
                    <Image source={{ uri: item.image }} style={{ width: 60, height: 90, borderRadius: 5 }} />
                  )}
                  <TouchableOpacity
                    style={{ position: 'absolute', top: 6, right: 6 }}
                    onPress={() => {
                      setFavourites(favourites.filter(fav => fav.id !== item.id));
                    }}
                    accessibilityLabel="Remove from favourites"
                  >
                    <AntDesign name="star" size={22} color="#FFD700" />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 14, marginTop: 4, maxWidth: 70, color: '#F5F6FA' }} numberOfLines={1}>{item.name}</Text>
                {item.nextEpisode ? (
                  <Text style={{ fontSize: 12, color: '#FFD700', marginTop: 2, textAlign: 'center' }}>
                    {getCountdown(item.nextEpisode.airdate)}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 12, color: '#A0A2B2', marginTop: 2, textAlign: 'center' }}>No upcoming</Text>
                )}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={scrollRight} style={localStyles.arrowButton}>
            <Text style={localStyles.arrowText}>{'▶'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  arrowButton: {
    width: 32,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(40,40,40,0.7)',
    borderRadius: 20,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  arrowText: {
    fontSize: 28,
    color: '#A0A2B2',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    maxHeight: 160,
    borderRadius: 12,
    backgroundColor: 'rgba(30,30,30,0.7)',
    marginHorizontal: 4,
    ...(Platform.OS === 'web' ? {
      scrollbarWidth: 'thin',
      scrollbarColor: '#888 #222',
    } : {}),
  },
});

// styles are now passed in as a prop
