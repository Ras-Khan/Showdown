import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import getCountdown from './getCountdown';
import { Show } from './types';

interface ShowListProps {
  shows: Show[];
  favourites: Show[];
  setFavourites: (favs: Show[]) => void;
  onShowPress: (show: Show) => void;
  styles: any;
}


const ShowList: React.FC<ShowListProps> = ({ shows, favourites, setFavourites, onShowPress, styles }) => (
  <FlatList
    data={shows}
    keyExtractor={item => item.id.toString()}
    renderItem={({ item }) => {
      const isFavourite = favourites.some(fav => fav.id === item.id);
      return (
        <TouchableOpacity
          style={[styles.showItem, { alignItems: 'flex-start' }]}
          onPress={() => onShowPress(item)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
            <View style={{ position: 'relative' }}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.thumbnail} />
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
