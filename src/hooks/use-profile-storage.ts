import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_STORAGE_KEY = '@profile_data';

export interface ProfileData {
  displayName: string;
  email: string;
  notifications: boolean;
}

export function useProfileStorage(sessionEmail: string | null) {
  const fallback: ProfileData = {
    displayName: sessionEmail ? sessionEmail.split('@')[0] : 'Admin',
    email: sessionEmail || 'admin@example.com',
    notifications: true,
  };

  const [profile, setProfile] = useState<ProfileData>(fallback);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_STORAGE_KEY).then((raw) => {
      if (raw) {
        setProfile(JSON.parse(raw));
      }
      setIsLoaded(true);
    });
  }, []);

  const saveProfile = useCallback(async (data: ProfileData) => {
    setProfile(data);
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
  }, []);

  const clearProfile = useCallback(async () => {
    await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
  }, []);

  return { profile, isLoaded, saveProfile, clearProfile };
}
