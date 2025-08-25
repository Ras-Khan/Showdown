import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

interface NavBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = ['TV shows', 'Movies', 'People'];

const NavBar: React.FC<NavBarProps> = ({ activeSection, onSectionChange }) => {
  const { width } = useWindowDimensions();
  // Responsive values
  const isMobile = width < 500;
  const navBarStyle = [
    styles.navBar,
    isMobile && { minHeight: 54, paddingTop: 12, paddingBottom: 8, gap: 18 },
    !isMobile && { minHeight: 68, paddingTop: 20, paddingBottom: 12, gap: 32 },
  ];
  const navTextStyle = [
    styles.navText,
    isMobile && { fontSize: 15, marginHorizontal: 8, paddingBottom: 8 },
    !isMobile && { fontSize: 19, marginHorizontal: 16, paddingBottom: 14 },
  ];
  const activeNavTextStyle = [
    styles.activeNavText,
  ];
  return (
    <View style={navBarStyle}>
      {sections.map(section => (
        <TouchableOpacity key={section} onPress={() => onSectionChange(section)}>
          <Text style={[navTextStyle, activeSection === section && activeNavTextStyle]}>{section}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  // Responsive values moved to component
  backgroundColor: 'rgba(20, 30, 30, 0.22)', // more transparent
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(255,255,255,0.85)',
    // Glassy shadow and border
    shadowColor: '#00FFB2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    // For web, backdropFilter
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } : {}),
  // No border radius
  },
  navText: {
  color: '#F5F6FA',
  letterSpacing: 2,
  fontWeight: '500',
  opacity: 0.8,
  },
  activeNavText: {
    opacity: 1,
    fontWeight: 'bold',
    // underline removed
  },
});

export default NavBar;
