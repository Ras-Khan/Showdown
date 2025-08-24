import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NavBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = ['TV shows', 'Movies', 'People'];

const NavBar: React.FC<NavBarProps> = ({ activeSection, onSectionChange }) => (
  <View style={styles.navBar}>
    {sections.map(section => (
      <TouchableOpacity key={section} onPress={() => onSectionChange(section)}>
        <Text style={[styles.navText, activeSection === section && styles.activeNavText]}>{section}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    gap: 32,
  },
  navText: {
    color: '#F5F6FA',
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: '500',
    marginHorizontal: 16,
    opacity: 0.7,
  paddingBottom: 14,
  },
  activeNavText: {
    opacity: 1,
    fontWeight: 'bold',
    // underline removed
  },
});

export default NavBar;
