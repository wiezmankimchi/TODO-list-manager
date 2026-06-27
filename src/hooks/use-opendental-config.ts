import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { OpenDentalConfig } from '@/types/opendental';

const OD_CONFIG_KEY = '@opendental_config';

const defaultConfig: OpenDentalConfig = {
  baseUrl: '',
  developerKey: '',
  customerKey: '',
};

export function useOpenDentalConfig() {
  const [config, setConfig] = useState<OpenDentalConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(OD_CONFIG_KEY).then((raw) => {
      if (raw) {
        setConfig(JSON.parse(raw));
      }
      setIsLoaded(true);
    });
  }, []);

  const saveConfig = useCallback(async (data: OpenDentalConfig) => {
    setConfig(data);
    await AsyncStorage.setItem(OD_CONFIG_KEY, JSON.stringify(data));
  }, []);

  const clearConfig = useCallback(async () => {
    setConfig(defaultConfig);
    await AsyncStorage.removeItem(OD_CONFIG_KEY);
  }, []);

  const isConfigured = Boolean(
    config.baseUrl && config.developerKey && config.customerKey,
  );

  return { config, isLoaded, isConfigured, saveConfig, clearConfig };
}
