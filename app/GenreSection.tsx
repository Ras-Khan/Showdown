import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const genres = [
  'Drama', 'Comedy', 'Action', 'Science-Fiction', 'Romance', 'Thriller', 'Horror', 'Fantasy', 'Mystery', 'Adventure',
];

export const GenreSection: React.FC<{ onSelect: (genre: string) => void }> = ({ onSelect }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Genres</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {genres.map((genre) => (
        <TouchableOpacity key={genre} style={styles.genreBox} onPress={() => onSelect(genre)}>
          <Text style={styles.genreText}>{genre}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  section: { marginVertical: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  genreBox: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  genreText: { fontSize: 16 },
});
