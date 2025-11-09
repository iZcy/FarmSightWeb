import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type {
  User,
  Farm,
  StressAlert,
  FarmHealth,
  Video,
  UserSettings,
} from '../types';
import {
  mockUser,
  mockFarms,
  mockAlerts,
  mockFarmHealth,
  mockVideos,
  mockUserSettings,
} from '../mock/data';

// User state - persisted in localStorage
export const userAtom = atomWithStorage<User | null>('farmsight-user', mockUser);

// Authentication state
export const isAuthenticatedAtom = atomWithStorage<boolean>('farmsight-auth', true);

// Farms state - persisted in localStorage
export const farmsAtom = atomWithStorage<Farm[]>('farmsight-farms', mockFarms);

// Selected farm ID
export const selectedFarmIdAtom = atom<string | null>(mockFarms[0]?.id || null);

// Derived atom for selected farm
export const selectedFarmAtom = atom(
  (get) => {
    const farmId = get(selectedFarmIdAtom);
    const farms = get(farmsAtom);
    return farms.find(farm => farm.id === farmId) || null;
  }
);

// Farm health data
export const farmHealthAtom = atom<FarmHealth[]>(mockFarmHealth);

// Derived atom for selected farm health
export const selectedFarmHealthAtom = atom(
  (get) => {
    const farmId = get(selectedFarmIdAtom);
    const healthData = get(farmHealthAtom);
    return healthData.find(health => health.farmId === farmId) || null;
  }
);

// Alerts state - persisted in localStorage
export const alertsAtom = atomWithStorage<StressAlert[]>('farmsight-alerts', mockAlerts);

// Unread alerts count
export const unreadAlertsCountAtom = atom(
  (get) => get(alertsAtom).filter(alert => !alert.isRead).length
);

// Alerts for selected farm
export const selectedFarmAlertsAtom = atom(
  (get) => {
    const farmId = get(selectedFarmIdAtom);
    const alerts = get(alertsAtom);
    return alerts.filter(alert => alert.farmId === farmId);
  }
);

// Videos state
export const videosAtom = atom<Video[]>(mockVideos);

// Video search query
export const videoSearchQueryAtom = atom<string>('');

// Video category filter
export const videoCategoryFilterAtom = atom<string>('all');

// Filtered videos based on search and category
export const filteredVideosAtom = atom(
  (get) => {
    const videos = get(videosAtom);
    const searchQuery = get(videoSearchQueryAtom).toLowerCase();
    const categoryFilter = get(videoCategoryFilterAtom);

    return videos.filter(video => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery) ||
        video.description.toLowerCase().includes(searchQuery);

      const matchesCategory =
        categoryFilter === 'all' || video.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }
);

// User settings - persisted in localStorage
export const userSettingsAtom = atomWithStorage<UserSettings>(
  'farmsight-settings',
  mockUserSettings
);

// UI state
export const sidebarOpenAtom = atom<boolean>(true);

// Mobile menu state
export const mobileMenuOpenAtom = atom<boolean>(false);

// Date range for NDVI charts
export const dateRangeAtom = atom<{ start: Date; end: Date }>({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  end: new Date(),
});
