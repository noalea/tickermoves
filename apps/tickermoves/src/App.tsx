import React, { useEffect } from 'react';
import { initNotifications, saveFirebaseDeviceToken } from './utils/notifications';
import Home from './components/home';

// initializing notification listener.
initNotifications();

function App(): React.JSX.Element {
  useEffect(() => {
    saveFirebaseDeviceToken();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Home />
  );
}

export default App;
