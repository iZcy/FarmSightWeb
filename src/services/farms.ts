import { getDatabase, saveDatabase } from './database';
import type { Farm, FarmHealth, StressAlert, NDVIData } from '../types';

// Create farm
export function createFarm(
  userId: string,
  farm: Omit<Farm, 'id' | 'userId' | 'createdAt' | 'lastUpdated'>
): { success: boolean; error?: string; farm?: Farm } {
  try {
    const db = getDatabase();

    const farmId = `farm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO farms (id, user_id, name, location_lat, location_lng, location_address, area, crop_type, boundary, created_at, last_updated)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        farmId,
        userId,
        farm.name,
        farm.location.lat,
        farm.location.lng,
        farm.location.address,
        farm.area,
        farm.cropType,
        JSON.stringify(farm.boundary),
        now,
        now,
      ]
    );

    saveDatabase();

    const newFarm: Farm = {
      id: farmId,
      userId,
      ...farm,
      createdAt: new Date(now),
      lastUpdated: new Date(now),
    };

    return { success: true, farm: newFarm };
  } catch (error) {
    console.error('Create farm error:', error);
    return { success: false, error: 'Failed to create farm' };
  }
}

// Get all farms for a user
export function getFarms(userId: string): Farm[] {
  try {
    const db = getDatabase();

    const result = db.exec(
      `SELECT id, user_id, name, location_lat, location_lng, location_address, area, crop_type, boundary, created_at, last_updated
       FROM farms
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return [];
    }

    return result[0].values.map((row): Farm => ({
      id: row[0] as string,
      userId: row[1] as string,
      name: row[2] as string,
      location: {
        lat: row[3] as number,
        lng: row[4] as number,
        address: row[5] as string,
      },
      area: row[6] as number,
      cropType: row[7] as string,
      boundary: JSON.parse(row[8] as string),
      createdAt: new Date(row[9] as string),
      lastUpdated: new Date(row[10] as string),
    }));
  } catch (error) {
    console.error('Get farms error:', error);
    return [];
  }
}

// Get farm by ID
export function getFarmById(farmId: string): Farm | null {
  try {
    const db = getDatabase();

    const result = db.exec(
      `SELECT id, user_id, name, location_lat, location_lng, location_address, area, crop_type, boundary, created_at, last_updated
       FROM farms
       WHERE id = ?`,
      [farmId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    const row = result[0].values[0];
    return {
      id: row[0] as string,
      userId: row[1] as string,
      name: row[2] as string,
      location: {
        lat: row[3] as number,
        lng: row[4] as number,
        address: row[5] as string,
      },
      area: row[6] as number,
      cropType: row[7] as string,
      boundary: JSON.parse(row[8] as string),
      createdAt: new Date(row[9] as string),
      lastUpdated: new Date(row[10] as string),
    };
  } catch (error) {
    console.error('Get farm error:', error);
    return null;
  }
}

// Update farm
export function updateFarm(
  farmId: string,
  updates: Partial<Omit<Farm, 'id' | 'createdAt' | 'lastUpdated'>>
): { success: boolean; error?: string } {
  try {
    const db = getDatabase();

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.location?.lat !== undefined) {
      fields.push('location_lat = ?');
      values.push(updates.location.lat);
    }
    if (updates.location?.lng !== undefined) {
      fields.push('location_lng = ?');
      values.push(updates.location.lng);
    }
    if (updates.location?.address !== undefined) {
      fields.push('location_address = ?');
      values.push(updates.location.address);
    }
    if (updates.area !== undefined) {
      fields.push('area = ?');
      values.push(updates.area);
    }
    if (updates.cropType !== undefined) {
      fields.push('crop_type = ?');
      values.push(updates.cropType);
    }
    if (updates.boundary !== undefined) {
      fields.push('boundary = ?');
      values.push(JSON.stringify(updates.boundary));
    }

    if (fields.length === 0) {
      return { success: false, error: 'No fields to update' };
    }

    fields.push('last_updated = ?');
    values.push(new Date().toISOString());
    values.push(farmId);

    db.run(`UPDATE farms SET ${fields.join(', ')} WHERE id = ?`, values);

    saveDatabase();

    return { success: true };
  } catch (error) {
    console.error('Update farm error:', error);
    return { success: false, error: 'Failed to update farm' };
  }
}

// Delete farm
export function deleteFarm(farmId: string): { success: boolean; error?: string } {
  try {
    const db = getDatabase();
    db.run('DELETE FROM farms WHERE id = ?', [farmId]);
    saveDatabase();
    return { success: true };
  } catch (error) {
    console.error('Delete farm error:', error);
    return { success: false, error: 'Failed to delete farm' };
  }
}

// NDVI Data operations
export function addNDVIData(
  farmId: string,
  data: { date: Date; value: number; confidence: number; isForecast?: boolean }
): { success: boolean; error?: string } {
  try {
    const db = getDatabase();

    db.run(
      `INSERT INTO ndvi_data (farm_id, date, value, confidence, is_forecast)
       VALUES (?, ?, ?, ?, ?)`,
      [
        farmId,
        data.date.toISOString(),
        data.value,
        data.confidence,
        data.isForecast ? 1 : 0,
      ]
    );

    saveDatabase();
    return { success: true };
  } catch (error) {
    console.error('Add NDVI data error:', error);
    return { success: false, error: 'Failed to add NDVI data' };
  }
}

export function getNDVIData(farmId: string, isForecast: boolean = false): NDVIData[] {
  try {
    const db = getDatabase();

    const result = db.exec(
      `SELECT date, value, confidence
       FROM ndvi_data
       WHERE farm_id = ? AND is_forecast = ?
       ORDER BY date ASC`,
      [farmId, isForecast ? 1 : 0]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return [];
    }

    return result[0].values.map((row): NDVIData => ({
      date: new Date(row[0] as string),
      value: row[1] as number,
      confidence: row[2] as number,
    }));
  } catch (error) {
    console.error('Get NDVI data error:', error);
    return [];
  }
}

// Get farm health
export function getFarmHealth(farmId: string): FarmHealth | null {
  try {
    const ndviHistory = getNDVIData(farmId, false);
    const forecast = getNDVIData(farmId, true);
    const alerts = getAlertsByFarm(farmId);

    if (ndviHistory.length === 0) {
      return null;
    }

    const currentNDVI = ndviHistory[ndviHistory.length - 1].value;
    const avgNDVI = ndviHistory.reduce((sum, d) => sum + d.value, 0) / ndviHistory.length;

    // Determine stress level based on current NDVI
    let stressLevel: 'drought' | 'pest' | 'nutrient' | 'healthy' = 'healthy';
    if (currentNDVI < 0.3) {
      stressLevel = 'drought';
    } else if (currentNDVI < 0.5) {
      stressLevel = 'nutrient';
    } else if (alerts.some((a) => a.type === 'pest' && !a.isRead)) {
      stressLevel = 'pest';
    }

    // Determine trend
    const recentData = ndviHistory.slice(-7);
    const firstAvg = recentData.slice(0, 3).reduce((sum, d) => sum + d.value, 0) / 3;
    const lastAvg = recentData.slice(-3).reduce((sum, d) => sum + d.value, 0) / 3;
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (lastAvg > firstAvg + 0.05) {
      trend = 'improving';
    } else if (lastAvg < firstAvg - 0.05) {
      trend = 'declining';
    }

    return {
      farmId,
      currentNDVI,
      avgNDVI,
      stressLevel,
      trend,
      ndviHistory,
      forecast,
      alerts,
    };
  } catch (error) {
    console.error('Get farm health error:', error);
    return null;
  }
}

// Alert operations
export function createAlert(
  farmId: string,
  alert: Omit<StressAlert, 'id' | 'farmId' | 'detectedAt' | 'isRead'>
): { success: boolean; error?: string; alert?: StressAlert } {
  try {
    const db = getDatabase();

    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    db.run(
      `INSERT INTO alerts (id, farm_id, type, severity, confidence, detected_at, message, recommendation, is_read)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [alertId, farmId, alert.type, alert.severity, alert.confidence, now, alert.message, alert.recommendation, 0]
    );

    saveDatabase();

    const newAlert: StressAlert = {
      id: alertId,
      farmId,
      ...alert,
      detectedAt: new Date(now),
      isRead: false,
    };

    return { success: true, alert: newAlert };
  } catch (error) {
    console.error('Create alert error:', error);
    return { success: false, error: 'Failed to create alert' };
  }
}

export function getAlerts(userId: string): StressAlert[] {
  try {
    const db = getDatabase();

    const result = db.exec(
      `SELECT a.id, a.farm_id, a.type, a.severity, a.confidence, a.detected_at, a.message, a.recommendation, a.is_read
       FROM alerts a
       JOIN farms f ON a.farm_id = f.id
       WHERE f.user_id = ?
       ORDER BY a.detected_at DESC`,
      [userId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return [];
    }

    return result[0].values.map((row): StressAlert => ({
      id: row[0] as string,
      farmId: row[1] as string,
      type: row[2] as 'drought' | 'pest' | 'nutrient' | 'healthy',
      severity: row[3] as 'low' | 'medium' | 'high' | 'critical',
      confidence: row[4] as number,
      detectedAt: new Date(row[5] as string),
      message: row[6] as string,
      recommendation: row[7] as string,
      isRead: (row[8] as number) === 1,
    }));
  } catch (error) {
    console.error('Get alerts error:', error);
    return [];
  }
}

export function getAlertsByFarm(farmId: string): StressAlert[] {
  try {
    const db = getDatabase();

    const result = db.exec(
      `SELECT id, farm_id, type, severity, confidence, detected_at, message, recommendation, is_read
       FROM alerts
       WHERE farm_id = ?
       ORDER BY detected_at DESC`,
      [farmId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return [];
    }

    return result[0].values.map((row): StressAlert => ({
      id: row[0] as string,
      farmId: row[1] as string,
      type: row[2] as 'drought' | 'pest' | 'nutrient' | 'healthy',
      severity: row[3] as 'low' | 'medium' | 'high' | 'critical',
      confidence: row[4] as number,
      detectedAt: new Date(row[5] as string),
      message: row[6] as string,
      recommendation: row[7] as string,
      isRead: (row[8] as number) === 1,
    }));
  } catch (error) {
    console.error('Get alerts by farm error:', error);
    return [];
  }
}

export function markAlertAsRead(alertId: string): { success: boolean; error?: string } {
  try {
    const db = getDatabase();
    db.run('UPDATE alerts SET is_read = 1 WHERE id = ?', [alertId]);
    saveDatabase();
    return { success: true };
  } catch (error) {
    console.error('Mark alert as read error:', error);
    return { success: false, error: 'Failed to mark alert as read' };
  }
}

export function deleteAlert(alertId: string): { success: boolean; error?: string } {
  try {
    const db = getDatabase();
    db.run('DELETE FROM alerts WHERE id = ?', [alertId]);
    saveDatabase();
    return { success: true };
  } catch (error) {
    console.error('Delete alert error:', error);
    return { success: false, error: 'Failed to delete alert' };
  }
}
