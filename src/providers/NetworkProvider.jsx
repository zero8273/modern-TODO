import { Children, useEffect, useState } from 'react';
import { NetworkContext } from '../contexts/NetworkContext';

const NetworkProvider = ({ children }) => {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: navigator.onLine,
    showNotification: false,
    message: '',
  });
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus({
        isOnline: true,
        showNotification: true,
        message: "З'єднання відновлено",
      });
      setTimeout(() => {
        setNetworkStatus((prev) => ({ ...prev, showNotification: false }));
      }, 3000);
    };

    const handleOffline = () => {
      setNetworkStatus({
        isOnline: false,
        showNotification: true,
        message: 'Мережа відсутня',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ networkStatus }}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
