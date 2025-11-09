import { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { getUserSettings, updateUserSettings as updateSettingsService } from '../services/settings';
import type { UserSettings } from '../types';

export function useSettings() {
  const { user } = useDatabase();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      setSettings(null);
      setIsLoading(false);
    }
  }, [user]);

  const loadSettings = () => {
    if (!user) return;
    const userSettings = getUserSettings(user.id);
    setSettings(userSettings);
    setIsLoading(false);
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const result = updateSettingsService(user.id, updates);
    if (result.success) {
      loadSettings();
    }
    return result;
  };

  return {
    settings,
    isLoading,
    updateSettings,
    refresh: loadSettings,
  };
}
