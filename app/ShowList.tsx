import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import getCountdown from './getCountdown';
import { Show } from './types';

interface ShowListProps {
  shows: Show[];
  favourites: Show[];
  setFavourites: (favs: Show[]) => void;
  onShowPress: (show: Show) => void;
  styles: any;
}

const resultsGlassStyles = StyleSheet.create({
  resultsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Lower opacity
    padding: 12,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 16,
    // Glassmorphism for web
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(18px)' } : {}),
  },
});

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .web-glass-results {
      background: rgba(0,0,0,0.3);
      padding: 12px;
      margin: 8px 12px 16px 12px;
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      box-shadow: 0 2px 12px 0 rgba(0,255,178,0.10);
      border: 1px solid rgba(255,255,255,0.13);
      max-width: 100%;
      border-radius: 0 !important;
    }
  `;
  document.head.appendChild(style);
}

const WebGlassContainer = Platform.OS === 'web' ? 'div' : View;

const ShowList: React.FC<ShowListProps> = ({ shows, favourites, setFavourites, onShowPress, styles }) => (
  <FlatList
    data={shows}
    keyExtractor={item => item.id.toString()}
    renderItem={({ item }) => {
      const isFavourite = favourites.some(fav => fav.id === item.id);
      return (
        <TouchableOpacity
          style={[styles.showItem, { alignItems: 'flex-start', marginLeft: 18 }]}
          onPress={() => onShowPress(item)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
            <View style={{ position: 'relative' }}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.thumbnail} />
              ) : (
                <View style={[styles.thumbnail, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}> 
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>N.A.</Text>
                </View>
              )}
              <TouchableOpacity
                style={{ position: 'absolute', top: 6, right: 6, zIndex: 2 }}
                onPress={e => {
                  e.stopPropagation();
                  if (isFavourite) {
                    setFavourites(favourites.filter(fav => fav.id !== item.id));
                  } else {
                    setFavourites([...favourites, item]);
                  }
                }}
                accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
              >
                <AntDesign name={isFavourite ? 'star' : 'staro'} size={22} color={isFavourite ? '#FFD700' : '#888'} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.showName, { marginLeft: 0, marginBottom: 4, color: '#F5F6FA' }]}>{item.name}</Text>
              <Text style={{ fontSize: 15, color: '#F5F6FA', marginBottom: 2 }}>
                Seasons: {item.seasonsCount ?? '-'} | Episodes: {item.episodesCount ?? '-'}
              </Text>
              <Text style={{ fontSize: 15, color: '#A0A2B2', marginBottom: 2 }}>
                {item.status !== 'Running' ? `Status: ${item.status ?? '-'}` : ''}
              </Text>
              {item.nextEpisode && item.status !== 'Ended' ? (
                <>
                  <Text style={{ color: '#F5F6FA' }}>
                    Next Episode: S{item.nextEpisode.season}E{item.nextEpisode.episode}
                  </Text>
                  <Text style={{ color: '#FFD700' }}>
                    Countdown: {getCountdown(item.nextEpisode.airdate)} ({item.nextEpisode.airdate.split('-').reverse().join('-')})
                  </Text>
                </>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      );
    }}
    ListEmptyComponent={null}
  />
);

export default ShowList;
