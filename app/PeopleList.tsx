import React, { useRef } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Person {
  id: number;
  name: string;
  country?: string;
  birthday?: string;
  gender?: string;
  image?: string;
}

interface PeopleListProps {
  people: Person[];
  styles: any;
}


const SCROLL_AMOUNT = 200;

const PeopleList: React.FC<PeopleListProps> = ({ people, styles }) => {
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

  if (!people || people.length === 0) {
    return <Text style={{ color: '#A0A2B2', textAlign: 'center', marginTop: 24 }}>No people found.</Text>;
  }

  return (
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
        {people.map(item => (
          <View key={item.id} style={[styles.showItem, { alignItems: 'flex-start', minWidth: 220, marginRight: 12 }]}> 
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.thumbnail} />
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.showName, { marginLeft: 0, marginBottom: 4, color: '#F5F6FA' }]}>{item.name}</Text>
                <Text style={{ fontSize: 15, color: '#A0A2B2', marginBottom: 2 }}>
                  {item.country ? `Country: ${item.country}` : ''}
                </Text>
                <Text style={{ fontSize: 15, color: '#A0A2B2', marginBottom: 2 }}>
                  {item.birthday ? `Birthday: ${item.birthday}` : ''}
                </Text>
                <Text style={{ fontSize: 15, color: '#A0A2B2', marginBottom: 2 }}>
                  {item.gender ? `Gender: ${item.gender}` : ''}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={scrollRight} style={localStyles.arrowButton}>
        <Text style={localStyles.arrowText}>{'▶'}</Text>
      </TouchableOpacity>
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
    maxHeight: 220,
    borderRadius: 12,
    backgroundColor: 'rgba(30,30,30,0.7)',
    marginHorizontal: 4,
    // Custom scrollbar for web/desktop
    ...(Platform.OS === 'web' ? {
      scrollbarWidth: 'thin',
      scrollbarColor: '#888 #222',
    } : {}),
  },
});

export default PeopleList;
