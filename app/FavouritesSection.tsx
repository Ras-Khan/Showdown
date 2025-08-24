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
}


const SCROLL_AMOUNT = 200;

const FavouritesSection: React.FC<FavouritesSectionProps> = ({ favourites, setFavourites, styles, collapsed = false, onToggleCollapse }) => {
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
    <View style={{ marginBottom: 18, marginHorizontal: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#F5F6FA' }}>Favourites</Text>
      </View>
      {!collapsed && (
        favourites.length === 0 ? (
          <Text style={{ color: '#A0A2B2' }}>No favourites yet.</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative', width: '100%' }}>
            {favourites.length * 80 > 320 && (
              <TouchableOpacity onPress={scrollLeft} style={localStyles.arrowButton}>
                <Text style={localStyles.arrowText}>{'\u25c0'}</Text>
              </TouchableOpacity>
            )}
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={true}
              style={localStyles.scrollView}
              contentContainerStyle={{ alignItems: 'flex-start' }}
            >
              {favourites.map(item => (
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
            {favourites.length * 80 > 320 && (
              <TouchableOpacity onPress={scrollRight} style={localStyles.arrowButton}>
                <Text style={localStyles.arrowText}>{'\u25b6'}</Text>
              </TouchableOpacity>
            )}
          </View>
        )
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

export default FavouritesSection;
