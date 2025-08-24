import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { CastMember, Episode, Show } from './types';

interface ShowModalProps {
  visible: boolean;
  onClose: () => void;
  show: Show | null;
  favourites: Show[];
  setFavourites: (favs: Show[]) => void;
  episodes: Episode[];
  cast: CastMember[];
  seasonsCount: number;
  detailsLoading: boolean;
  summaryExpanded: boolean;
  setSummaryExpanded: (v: boolean) => void;
  episodesSectionCollapsed: boolean;
  setEpisodesSectionCollapsed: (v: boolean) => void;
  castSectionCollapsed: boolean;
  setCastSectionCollapsed: (v: boolean) => void;
  collapsedSeasons: { [season: number]: boolean };
  setCollapsedSeasons: (v: { [season: number]: boolean }) => void;
  modalWidth: number;
  styles: any;
}

const ShowModal: React.FC<ShowModalProps> = ({
  visible,
  onClose,
  show,
  favourites,
  setFavourites,
  episodes,
  cast,
  seasonsCount,
  detailsLoading,
  summaryExpanded,
  setSummaryExpanded,
  episodesSectionCollapsed,
  setEpisodesSectionCollapsed,
  castSectionCollapsed,
  setCastSectionCollapsed,
  collapsedSeasons,
  setCollapsedSeasons,
  modalWidth,
  styles,
}) => {
  if (!show) return null;
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }} pointerEvents="box-none">
          <View style={[styles.modalContent, { width: modalWidth }]} pointerEvents="box-none">
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <ScrollView style={{ maxHeight: 500, width: '100%' }} contentContainerStyle={{ paddingBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#23252B' }}>
                <View style={{ position: 'relative' }}>
                  {show.image && (
                    <Image source={{ uri: show.image }} style={{ width: 180, height: 270, borderRadius: 12 }} />
                  )}
                  <TouchableOpacity
                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
                    onPress={() => {
                      const isFavourite = favourites.some(fav => fav.id === show.id);
                      if (isFavourite) {
                        setFavourites(favourites.filter(fav => fav.id !== show.id));
                      } else {
                        setFavourites([...favourites, show]);
                      }
                    }}
                    accessibilityLabel={favourites.some(fav => fav.id === show.id) ? "Remove from favourites" : "Add to favourites"}
                  >
                    <AntDesign name={favourites.some(fav => fav.id === show.id) ? "star" : "staro"} size={28} color={favourites.some(fav => fav.id === show.id) ? "#FFD700" : "#888"} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginLeft: 20 }}>
                  <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#F5F6FA' }}>{show.name}</Text>
                  {show.summary && (
                    <View>
                      <Text
                        style={{ fontSize: 16, color: '#F5F6FA', marginBottom: 4, lineHeight: 22 }}
                        numberOfLines={summaryExpanded ? undefined : 4}
                        ellipsizeMode={summaryExpanded ? undefined : 'tail'}
                      >
                        {show.summary.replace(/<[^>]+>/g, '')}
                      </Text>
                      {!summaryExpanded && (
                        <TouchableOpacity onPress={() => setSummaryExpanded(true)}>
                          <Text style={{ color: '#007AFF', fontSize: 15, marginBottom: 10 }}>+ more</Text>
                        </TouchableOpacity>
                      )}
                      {summaryExpanded && (
                        <TouchableOpacity onPress={() => setSummaryExpanded(false)}>
                          <Text style={{ color: '#007AFF', fontSize: 15, marginBottom: 10 }}>Show less</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </View>
              {show.nextEpisode ? (
                <>
                  <Text style={{ color: '#F5F6FA' }}>
                    Next Episode: S{show.nextEpisode.season}E{show.nextEpisode.episode}
                  </Text>
                  <Text style={{ color: '#FFD700' }}>
                    Countdown: {show.nextEpisode.airdate}
                  </Text>
                </>
              ) : (
                show.status !== 'Running' ? (
                  <Text style={{ color: '#A0A2B2' }}>Status: {show.status || 'Unknown'}</Text>
                ) : null
              )}
              {detailsLoading ? (
                <Text style={{ color: '#F5F6FA' }}>Loading details...</Text>
              ) : (
                <>
                  <View style={{ marginTop: 18, marginBottom: 18 }}>
                    <TouchableOpacity onPress={() => setEpisodesSectionCollapsed(!episodesSectionCollapsed)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#F5F6FA' }}>
                        {episodesSectionCollapsed ? '▶' : '▼'} Episodes by Season
                      </Text>
                      <Text style={{ fontWeight: 'normal', fontSize: 16, marginLeft: 10, color: '#F5F6FA' }}>(Seasons: {seasonsCount})</Text>
                    </TouchableOpacity>
                    {!episodesSectionCollapsed && (
                      <View>
                        {episodes.length > 0 ? (
                          Array.from(new Set(episodes.map(ep => ep.season))).map(seasonNum => {
                            const isCollapsed = collapsedSeasons[seasonNum] === true ? true : false;
                            return (
                              <View key={seasonNum} style={{ marginBottom: 12 }}>
                                <TouchableOpacity
                                  onPress={() => setCollapsedSeasons({ ...collapsedSeasons, [seasonNum]: !isCollapsed })}
                                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}
                                >
                                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#F5F6FA' }}>
                                    {isCollapsed ? '▶' : '▼'} Season {seasonNum}
                                  </Text>
                                </TouchableOpacity>
                                {!isCollapsed && (
                                  episodes.filter(ep => ep.season === seasonNum).map(ep => (
                                    <Text key={ep.id} style={{ fontSize: 14, marginLeft: 18, color: '#F5F6FA' }}>
                                      E{ep.number}: {ep.name} ({ep.airdate})
                                    </Text>
                                  ))
                                )}
                              </View>
                            );
                          })
                        ) : (
                          <Text style={{ color: '#F5F6FA' }}>No episodes found.</Text>
                        )}
                      </View>
                    )}
                  </View>
                  <View style={{ marginTop: 18, marginBottom: 18 }}>
                    <TouchableOpacity onPress={() => setCastSectionCollapsed(!castSectionCollapsed)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#F5F6FA' }}>
                        {castSectionCollapsed ? '▶' : '▼'} Cast
                      </Text>
                    </TouchableOpacity>
                    {!castSectionCollapsed && (
                      <View>
                        {cast.length > 0 ? (
                          cast.map(item => (
                            <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                              {item.image && (
                                <Image source={{ uri: item.image }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
                              )}
                              <Text style={{ fontSize: 15, color: '#F5F6FA' }}>{item.name} as {item.character}</Text>
                            </View>
                          ))
                        ) : (
                          <Text style={{ color: '#F5F6FA' }}>No cast info found.</Text>
                        )}
                      </View>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ShowModal;
