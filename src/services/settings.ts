import { getDatabase, saveDatabase } from './database';
import type { UserSettings } from '../types';

// Get user settings
export function getUserSettings(userId: string): UserSettings | null {
  try {
    const db = getDatabase();

    const result = db.exec(
      `SELECT notifications_email, notifications_sms, notifications_push,
              alert_ndvi_drop, alert_confidence_min, language, timezone
       FROM user_settings
       WHERE user_id = ?`,
      [userId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      // Return default settings if none exist
      return {
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
        alertThresholds: {
          ndviDrop: 0.15,
          confidenceMin: 70,
        },
        language: 'en',
        timezone: 'Asia/Shanghai',
      };
    }

    const row = result[0].values[0];
    return {
      notifications: {
        email: (row[0] as number) === 1,
        sms: (row[1] as number) === 1,
        push: (row[2] as number) === 1,
      },
      alertThresholds: {
        ndviDrop: row[3] as number,
        confidenceMin: row[4] as number,
      },
      language: row[5] as string,
      timezone: row[6] as string,
    };
  } catch (error) {
    console.error('Get user settings error:', error);
    return null;
  }
}

// Update user settings
export function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>
): { success: boolean; error?: string } {
  try {
    const db = getDatabase();

    // Check if settings exist
    const existing = db.exec('SELECT user_id FROM user_settings WHERE user_id = ?', [userId]);

    if (existing.length === 0 || existing[0].values.length === 0) {
      // Create default settings first
      db.run(
        `INSERT INTO user_settings (user_id) VALUES (?)`,
        [userId]
      );
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (settings.notifications) {
      if (settings.notifications.email !== undefined) {
        updates.push('notifications_email = ?');
        values.push(settings.notifications.email ? 1 : 0);
      }
      if (settings.notifications.sms !== undefined) {
        updates.push('notifications_sms = ?');
        values.push(settings.notifications.sms ? 1 : 0);
      }
      if (settings.notifications.push !== undefined) {
        updates.push('notifications_push = ?');
        values.push(settings.notifications.push ? 1 : 0);
      }
    }

    if (settings.alertThresholds) {
      if (settings.alertThresholds.ndviDrop !== undefined) {
        updates.push('alert_ndvi_drop = ?');
        values.push(settings.alertThresholds.ndviDrop);
      }
      if (settings.alertThresholds.confidenceMin !== undefined) {
        updates.push('alert_confidence_min = ?');
        values.push(settings.alertThresholds.confidenceMin);
      }
    }

    if (settings.language !== undefined) {
      updates.push('language = ?');
      values.push(settings.language);
    }

    if (settings.timezone !== undefined) {
      updates.push('timezone = ?');
      values.push(settings.timezone);
    }

    if (updates.length === 0) {
      return { success: false, error: 'No settings to update' };
    }

    values.push(userId);

    db.run(
      `UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    saveDatabase();

    return { success: true };
  } catch (error) {
    console.error('Update settings error:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}

// Create default settings for a new user
export function createDefaultSettings(userId: string): { success: boolean; error?: string } {
  try {
    const db = getDatabase();

    db.run(
      `INSERT INTO user_settings (user_id) VALUES (?)`,
      [userId]
    );

    saveDatabase();

    return { success: true };
  } catch (error) {
    console.error('Create default settings error:', error);
    return { success: false, error: 'Failed to create settings' };
  }
}
