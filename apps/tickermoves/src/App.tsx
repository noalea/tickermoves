import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { PressRelease } from '@tickermoves/shared-types';
import { initNotifications } from './utils/notifications';
import News from './data/news';
import PressReleaseCard from './components/press-release-card';

// initializing notification listener.
initNotifications();

const PAGE_SIZE = 10;
const INITIAL_PAGE = 1;

function App(): React.JSX.Element {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
    // Grab press releases
    fetchPressReleases();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      {/* TODO: Update this to FlashList when element.ref error gets fixed */}
      <FlatList
        data={pressReleases}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <PressReleaseCard item={item} />}
        onEndReached={() => fetchPressReleases()}
        onEndReachedThreshold={0.2}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      />
    </View>
  );
}

export default App;
