import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, SafeAreaView, useColorScheme, View } from 'react-native';
import Modal from 'react-native-modal';
import News from '../../data/news';
import PressReleaseCard from '../press-release-card';
import styles from './styles';
import Typography from '../typography';
import { Colors } from '../../styles';
import ModalNotch from '../modal-notch';

import type { PressRelease } from '@tickermoves/shared-types';

const PAGE_SIZE = 10;
const INITIAL_PAGE = 1;

export default function Home() {
  const theme = useColorScheme() || 'light';
  const isDark = theme === 'dark';
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const fetchPressReleases = async (isRefreshing = false) => {
    if (loading || (!isRefreshing && !hasMore)) { return; }

    setLoading(true);
    isRefreshing && setHasMore(true);
    const response = await News.getLatestPressReleases({ page });
    const data = response?.data?.data || [];
    setPressReleases(prevData => isRefreshing ? data : [...prevData, ...data]);
    setPage(prevData => isRefreshing ? INITIAL_PAGE : prevData + 1);

    if (data.length < PAGE_SIZE) {
      setHasMore(false);
    }

    setLoading(false);
  };

  // Refresh function to reset the list
  const onRefresh = () =>
    fetchPressReleases(true);

  useEffect(() => {
    fetchPressReleases();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView>
      <View style={{ backgroundColor: isDark ? Colors.black : Colors.white }}>
        <View style={styles.header}>
          <Typography variant="caption">TickerMoves</Typography>
        <Pressable onPress={openModal}>
          <Typography variant="h3">⚜️</Typography>
        </Pressable>
        </View>
        {/* TODO: Update this to FlashList when element.ref error gets fixed */}
        <FlatList
          data={pressReleases}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <PressReleaseCard item={item} />}
          onEndReached={() => fetchPressReleases()}
          onEndReachedThreshold={0.2}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
          ListEmptyComponent={<Typography variant="h3">No press releases found</Typography>}
        />
        <Modal
          isVisible={modalVisible}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          style={styles.modal}
          backdropColor={Colors.black65}
          onBackdropPress={closeModal}
          propagateSwipe
          swipeDirection="down"
          onSwipeComplete={closeModal}
        >
          <View style={[styles.modalContainer, { backgroundColor: isDark ? Colors.grey10 : Colors.white }]}>
            <ModalNotch />
            <Typography variant="caption">Analysis Color Legend</Typography>
            <Typography variant="h2">Will the stock move up?</Typography>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendItemColor, { backgroundColor: Colors.mostLikely }]} />
                <Typography variant="body">Most Likely</Typography>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendItemColor, { backgroundColor: Colors.likely }]} />
                <Typography variant="body">Likely</Typography>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendItemColor, { backgroundColor: Colors.unsure }]} />
                <Typography variant="body">Unsure</Typography>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendItemColor, { backgroundColor: Colors.unlikely }]} />
                <Typography variant="body">Unlikely</Typography>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
