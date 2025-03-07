import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { PressRelease } from '@tickermoves/shared-types';
import { initNotifications } from './utils/notifications';
import News from './data/news';
import PressReleaseCard from './components/press-release-card';

// initializing notification listener.
initNotifications();

function App(): React.JSX.Element {
  const [pressReleases, setPressReleases] = useState<PressRelease[]>();

  const fetchPressReleases = async () => {
    // TODO: Render releases in list
    const response = await News.getLatestPressReleases();
    console.log('response', response);
    setPressReleases(response?.data?.data || []);
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
      />
    </View>
  );
}

export default App;
