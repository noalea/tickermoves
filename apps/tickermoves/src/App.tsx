import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { PressRelease } from '@tickermoves/shared-types';
import { initNotifications } from './utils/notifications';
import News from './data/news';
import PressReleaseCard from './components/press-release-card';

// initializing notification listener.
initNotifications();

const PAGE_SIZE = 10;

function App(): React.JSX.Element {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPressReleases = async () => {
    if (loading || !hasMore) { return; }

    setLoading(true);
    const response = await News.getLatestPressReleases({ page });
    const data = response?.data?.data || [];
    setPressReleases((prevData) => [...prevData, ...data]);
    setPage(page + 1);

    if (data.length < PAGE_SIZE) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Grab press releases
    fetchPressReleases();
  }, []);

  return (
    <View>
      {/* TODO: Update this to FlashList when element.ref error gets fixed */}
      <FlatList
        data={pressReleases}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <PressReleaseCard item={item} />}
        onEndReached={fetchPressReleases}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
}

export default App;
