import { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  getAlerts,
  getAlertsByFarm,
  markAlertAsRead,
  deleteAlert as deleteAlertService,
} from '../services/farms';
import type { StressAlert } from '../types';

export function useAlerts() {
  const { user, isAuthenticated } = useDatabase();
  const [alerts, setAlerts] = useState<StressAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAlerts = () => {
    if (user) {
      const userAlerts = getAlerts(user.id);
      setAlerts(userAlerts);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadAlerts();
    } else {
      setAlerts([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const markAsRead = (alertId: string) => {
    const result = markAlertAsRead(alertId);
    if (result.success) {
      loadAlerts();
    }
    return result;
  };

  const deleteAlert = (alertId: string) => {
    const result = deleteAlertService(alertId);
    if (result.success) {
      loadAlerts();
    }
    return result;
  };

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;

  return {
    alerts,
    unreadCount,
    isLoading,
    markAsRead,
    deleteAlert,
    refresh: loadAlerts,
  };
}

export function useFarmAlerts(farmId: string | null) {
  const [alerts, setAlerts] = useState<StressAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (farmId) {
      const farmAlerts = getAlertsByFarm(farmId);
      setAlerts(farmAlerts);
      setIsLoading(false);
    } else {
      setAlerts([]);
      setIsLoading(false);
    }
  }, [farmId]);

  return { alerts, isLoading };
}
