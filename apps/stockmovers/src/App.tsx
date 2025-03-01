import React from 'react';
import { View } from 'react-native';
import { initNotifications } from './utils/notifications';

// initializing notification listener.
initNotifications();

function App(): React.JSX.Element {
  return (
    <View />
  );
}

export default App;
