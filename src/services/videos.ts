import { getDatabase, saveDatabase } from './database';
import type { Video } from '../types';

// Get all videos
export function getVideos(): Video[] {
  try {
    const db = getDatabase();

    const result = db.exec(
      `SELECT id, title, description, thumbnail, duration, category, views, upload_date, url, relevant_for
       FROM videos
       ORDER BY upload_date DESC`
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return [];
    }

    return result[0].values.map((row): Video => ({
      id: row[0] as string,
      title: row[1] as string,
      description: row[2] as string,
      thumbnail: row[3] as string,
      duration: row[4] as string,
      category: row[5] as string,
      views: row[6] as number,
      uploadDate: new Date(row[7] as string),
      url: row[8] as string,
      relevantFor: row[9] ? (row[9] as string).split(',') as any : undefined,
    }));
  } catch (error) {
    console.error('Get videos error:', error);
    return [];
  }
}

// Search videos by query
export function searchVideos(query: string): Video[] {
  if (!query.trim()) {
    return getVideos();
  }

  try {
    const db = getDatabase();
    const searchPattern = `%${query.toLowerCase()}%`;

    const result = db.exec(
      `SELECT id, title, description, thumbnail, duration, category, views, upload_date, url, relevant_for
       FROM videos
       WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?
       ORDER BY upload_date DESC`,
      [searchPattern, searchPattern, searchPattern]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return [];
    }

    return result[0].values.map((row): Video => ({
      id: row[0] as string,
      title: row[1] as string,
      description: row[2] as string,
      thumbnail: row[3] as string,
      duration: row[4] as string,
      category: row[5] as string,
      views: row[6] as number,
      uploadDate: new Date(row[7] as string),
      url: row[8] as string,
      relevantFor: row[9] ? (row[9] as string).split(',') as any : undefined,
    }));
  } catch (error) {
    console.error('Search videos error:', error);
    return [];
  }
}

// Get videos by category
export function getVideosByCategory(category: string): Video[] {
  if (!category || category === 'all') {
    return getVideos();
  }

  try {
    const db = getDatabase();

    const result = db.exec(
      `SELECT id, title, description, thumbnail, duration, category, views, upload_date, url, relevant_for
       FROM videos
       WHERE category = ?
       ORDER BY upload_date DESC`,
      [category]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return [];
    }

    return result[0].values.map((row): Video => ({
      id: row[0] as string,
      title: row[1] as string,
      description: row[2] as string,
      thumbnail: row[3] as string,
      duration: row[4] as string,
      category: row[5] as string,
      views: row[6] as number,
      uploadDate: new Date(row[7] as string),
      url: row[8] as string,
      relevantFor: row[9] ? (row[9] as string).split(',') as any : undefined,
    }));
  } catch (error) {
    console.error('Get videos by category error:', error);
    return [];
  }
}

// Get videos relevant for specific stress type
export function getRelevantVideos(stressType: string): Video[] {
  try {
    const db = getDatabase();

    const result = db.exec(
      `SELECT id, title, description, thumbnail, duration, category, views, upload_date, url, relevant_for
       FROM videos
       WHERE relevant_for LIKE ?
       ORDER BY views DESC
       LIMIT 10`,
      [`%${stressType}%`]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return [];
    }

    return result[0].values.map((row): Video => ({
      id: row[0] as string,
      title: row[1] as string,
      description: row[2] as string,
      thumbnail: row[3] as string,
      duration: row[4] as string,
      category: row[5] as string,
      views: row[6] as number,
      uploadDate: new Date(row[7] as string),
      url: row[8] as string,
      relevantFor: row[9] ? (row[9] as string).split(',') as any : undefined,
    }));
  } catch (error) {
    console.error('Get relevant videos error:', error);
    return [];
  }
}

// Increment video views
export function incrementVideoViews(videoId: string): { success: boolean; error?: string } {
  try {
    const db = getDatabase();
    db.run('UPDATE videos SET views = views + 1 WHERE id = ?', [videoId]);
    saveDatabase();
    return { success: true };
  } catch (error) {
    console.error('Increment views error:', error);
    return { success: false, error: 'Failed to update views' };
  }
}

// Get all unique categories
export function getVideoCategories(): string[] {
  try {
    const db = getDatabase();

    const result = db.exec('SELECT DISTINCT category FROM videos ORDER BY category');

    if (result.length === 0 || result[0].values.length === 0) {
      return [];
    }

    return result[0].values.map((row) => row[0] as string);
  } catch (error) {
    console.error('Get categories error:', error);
    return [];
  }
}
