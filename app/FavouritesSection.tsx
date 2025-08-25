import { AntDesign } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import getCountdown from './getCountdown';
import { Show } from './types';

interface FavouritesSectionProps {
  favourites: Show[];
  setFavourites: (favs: Show[]) => void;
  styles: any;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onShowPress?: (item: Show) => void;
}


const SCROLL_AMOUNT = 200;

const FavouritesSection: React.FC<FavouritesSectionProps> = ({ favourites, setFavourites, styles, collapsed = false, onToggleCollapse, onShowPress }) => {
  const scrollRef = useRef<ScrollView>(null);
  const { width } = require('react-native').useWindowDimensions();
  const isMobile = width < 500;

  // Sort favourites: first by countdown (soonest next episode), then alphabetically
  const sortedFavourites = [...favourites].sort((a, b) => {
    const aTime = a.nextEpisode && a.nextEpisode.airdate ? new Date(a.nextEpisode.airdate).getTime() : Infinity;
    const bTime = b.nextEpisode && b.nextEpisode.airdate ? new Date(b.nextEpisode.airdate).getTime() : Infinity;
    if (aTime !== bTime) {
      return aTime - bTime;
    }
    // If countdown is the same, sort alphabetically
    return a.name.localeCompare(b.name);
  });

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
  <View style={localStyles.section}>
      <View style={{ alignItems: 'center', marginBottom: isMobile ? 4 : 8 }}>
        <Text style={{
          fontSize: isMobile ? 16 : 22,
          fontWeight: 'bold',
          color: '#F5F6FA',
          textAlign: 'center',
          marginTop: isMobile ? 4 : 8,
          marginBottom: isMobile ? 4 : 8
        }}>Favourites</Text>
      </View>
      {!collapsed && (
        sortedFavourites.length === 0 ? (
          <Text style={{ color: '#A0A2B2' }}>No favourites yet.</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', position: 'relative', width: '100%', minHeight: isMobile ? 80 : 120 }}>
            <TouchableOpacity onPress={scrollLeft} style={[localStyles.arrowButton, isMobile ? { height: 80, width: 32, alignSelf: 'flex-start' } : { height: 120, width: 40, alignSelf: 'flex-start' }]}>
              <Text style={[localStyles.arrowText, isMobile ? { fontSize: 20 } : { fontSize: 28 }]}>{'\u25c0'}</Text>
            </TouchableOpacity>
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={true}
              style={[localStyles.scrollView, isMobile ? { minHeight: 60, maxHeight: 100 } : { minHeight: 100, maxHeight: 180 }]}
              contentContainerStyle={{ alignItems: 'flex-start' }}
            >
              {sortedFavourites.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={{ marginRight: isMobile ? 8 : 16, alignItems: 'center', width: isMobile ? 56 : 80 }}
                  onPress={() => onShowPress && onShowPress(item)}
                  accessibilityLabel={`Open details for ${item.name}`}
                >
                  <View style={{ position: 'relative' }}>
                    {item.image && (
                      <Image source={{ uri: item.image }} style={{ width: isMobile ? 42 : 60, height: isMobile ? 63 : 90, borderRadius: 5 }} />
                    )}
                    <TouchableOpacity
                      style={{ position: 'absolute', top: 6, right: 6 }}
                      onPress={() => {
                        setFavourites(favourites.filter(fav => fav.id !== item.id));
                      }}
                      accessibilityLabel="Remove from favourites"
                    >
                      <AntDesign name="star" size={isMobile ? 16 : 22} color="#FFD700" />
                    </TouchableOpacity>
                  </View>
                  <Text style={{ fontSize: isMobile ? 11 : 14, marginTop: isMobile ? 2 : 4, maxWidth: isMobile ? 50 : 70, color: '#F5F6FA' }} numberOfLines={1}>{item.name}</Text>
                  {(item.nextEpisode && item.nextEpisode.airdate) ? (
                    getCountdown(item.nextEpisode.airdate) !== 'Already aired' ? (
                      <Text style={{ fontSize: isMobile ? 10 : 12, color: '#FFD700', marginTop: isMobile ? 1 : 2, textAlign: 'center' }}>
                        {getCountdown(item.nextEpisode.airdate)}
                      </Text>
                    ) : null
                  ) : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={scrollRight} style={[localStyles.arrowButton, isMobile ? { height: 80, width: 32, alignSelf: 'flex-start' } : { height: 120, width: 40, alignSelf: 'flex-start' }]}>
              <Text style={[localStyles.arrowText, isMobile ? { fontSize: 20 } : { fontSize: 28 }]}>{'\u25b6'}</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  section: {
    marginBottom: 18,
    marginHorizontal: 18,
    padding: 12,
    borderRadius: 4,
    minHeight: 120,
  },
  arrowButton: {
    width: 40,
    height: 120, // Match section minHeight
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(40,40,40,0.7)',
    borderRadius: 4,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    ...(Platform.OS !== 'web' ? { marginVertical: 6 } : {}),
  },
  arrowText: {
    fontSize: 28,
    color: '#A0A2B2',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    minHeight: 100,
    maxHeight: 180,
    borderRadius: 4,
    marginHorizontal: 4,
    ...(Platform.OS === 'web' ? {
      scrollbarWidth: 'thin',
      scrollbarColor: '#888 #222',
    } : {}),
  },
});

export default FavouritesSection;
