import { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  getFarms,
  createFarm as createFarmService,
  updateFarm as updateFarmService,
  deleteFarm as deleteFarmService,
  getFarmById,
  getFarmHealth,
} from '../services/farms';
import type { Farm, FarmHealth } from '../types';

export function useFarms() {
  const { user, isAuthenticated } = useDatabase();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFarms = () => {
    if (user) {
      const userFarms = getFarms(user.id);
      setFarms(userFarms);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadFarms();
    } else {
      setFarms([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const addFarm = (farm: Omit<Farm, 'id' | 'createdAt' | 'lastUpdated'>) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    const result = createFarmService(user.id, farm);
    if (result.success) {
      loadFarms();
    }
    return result;
  };

  const updateFarm = (farmId: string, updates: Partial<Omit<Farm, 'id' | 'createdAt' | 'lastUpdated'>>) => {
    const result = updateFarmService(farmId, updates);
    if (result.success) {
      loadFarms();
    }
    return result;
  };

  const deleteFarm = (farmId: string) => {
    const result = deleteFarmService(farmId);
    if (result.success) {
      loadFarms();
    }
    return result;
  };

  const getFarm = (farmId: string): Farm | null => {
    return getFarmById(farmId);
  };

  return {
    farms,
    isLoading,
    addFarm,
    updateFarm,
    deleteFarm,
    getFarm,
    refresh: loadFarms,
  };
}

export function useFarmHealth(farmId: string | null) {
  const [health, setHealth] = useState<FarmHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (farmId) {
      const farmHealth = getFarmHealth(farmId);
      setHealth(farmHealth);
      setIsLoading(false);
    } else {
      setHealth(null);
      setIsLoading(false);
    }
  }, [farmId]);

  return { health, isLoading };
}
