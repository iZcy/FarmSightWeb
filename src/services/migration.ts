import { getDatabase, saveDatabase } from './database';
import { register } from './auth';
import { createFarm, addNDVIData, createAlert } from './farms';
import { mockUser, mockFarms, mockAlerts, mockFarmHealth } from '../mock/data';

// Migrate mock data to SQLite
export function migrateMockData(): { success: boolean; error?: string; userId?: string } {
  try {
    // Register the mock user
    const result = register(
      mockUser.name,
      mockUser.email,
      'demo123', // Default password for demo user
      mockUser.phone
    );

    if (!result.success || !result.user) {
      return { success: false, error: result.error };
    }

    const userId = result.user.id;

    // Create farms
    const farmIdMap = new Map<string, string>();
    for (const farm of mockFarms) {
      const farmResult = createFarm(userId, {
        name: farm.name,
        location: farm.location,
        area: farm.area,
        cropType: farm.cropType,
        boundary: farm.boundary,
      });

      if (farmResult.success && farmResult.farm) {
        farmIdMap.set(farm.id, farmResult.farm.id);
      }
    }

    // Add NDVI data for each farm
    for (const health of mockFarmHealth) {
      const newFarmId = farmIdMap.get(health.farmId);
      if (!newFarmId) continue;

      // Add historical data
      for (const ndvi of health.ndviHistory) {
        addNDVIData(newFarmId, {
          date: ndvi.date,
          value: ndvi.value,
          confidence: ndvi.confidence,
          isForecast: false,
        });
      }

      // Add forecast data
      for (const forecast of health.forecast) {
        addNDVIData(newFarmId, {
          date: forecast.date,
          value: forecast.value,
          confidence: forecast.confidence,
          isForecast: true,
        });
      }
    }

    // Create alerts
    for (const alert of mockAlerts) {
      const newFarmId = farmIdMap.get(alert.farmId);
      if (!newFarmId) continue;

      createAlert(newFarmId, {
        type: alert.type,
        severity: alert.severity,
        confidence: alert.confidence,
        message: alert.message,
        recommendation: alert.recommendation,
      });
    }

    // Add videos to database
    const db = getDatabase();
    const videos = [
      {
        id: 'vid-1',
        title: 'Drought-Resistant Farming Techniques',
        description: 'Learn how to maintain healthy crops during drought conditions using modern techniques and traditional wisdom.',
        thumbnail: 'https://picsum.photos/seed/farm1/400/225',
        duration: '12:34',
        category: 'Drought Management',
        views: 1234,
        uploadDate: new Date('2024-10-15').toISOString(),
        url: '#',
        relevantFor: 'drought',
      },
      {
        id: 'vid-2',
        title: 'Identifying Common Crop Pests',
        description: 'A comprehensive guide to identifying and managing the most common pests affecting your crops.',
        thumbnail: 'https://picsum.photos/seed/farm2/400/225',
        duration: '18:45',
        category: 'Pest Control',
        views: 2156,
        uploadDate: new Date('2024-10-20').toISOString(),
        url: '#',
        relevantFor: 'pest',
      },
      {
        id: 'vid-3',
        title: 'Soil Testing and Nutrient Management',
        description: 'Understanding soil composition and how to correct nutrient deficiencies for optimal crop growth.',
        thumbnail: 'https://picsum.photos/seed/farm3/400/225',
        duration: '15:20',
        category: 'Soil Health',
        views: 987,
        uploadDate: new Date('2024-10-25').toISOString(),
        url: '#',
        relevantFor: 'nutrient',
      },
      {
        id: 'vid-4',
        title: 'Modern Drip Irrigation Setup',
        description: 'Step-by-step guide to setting up an efficient drip irrigation system for your farm.',
        thumbnail: 'https://picsum.photos/seed/farm4/400/225',
        duration: '22:10',
        category: 'Irrigation Techniques',
        views: 3421,
        uploadDate: new Date('2024-11-01').toISOString(),
        url: '#',
        relevantFor: 'drought',
      },
      {
        id: 'vid-5',
        title: 'Organic Pest Control Methods',
        description: 'Eco-friendly approaches to managing pests without harmful chemicals.',
        thumbnail: 'https://picsum.photos/seed/farm5/400/225',
        duration: '14:55',
        category: 'Pest Control',
        views: 1876,
        uploadDate: new Date('2024-11-05').toISOString(),
        url: '#',
        relevantFor: 'pest',
      },
      {
        id: 'vid-6',
        title: 'Crop Rotation Best Practices',
        description: 'Maximize soil health and crop yields through effective rotation strategies.',
        thumbnail: 'https://picsum.photos/seed/farm6/400/225',
        duration: '16:30',
        category: 'Crop Management',
        views: 2543,
        uploadDate: new Date('2024-11-08').toISOString(),
        url: '#',
        relevantFor: '',
      },
    ];

    for (const video of videos) {
      db.run(
        `INSERT INTO videos (id, title, description, thumbnail, duration, category, views, upload_date, url, relevant_for)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          video.id,
          video.title,
          video.description,
          video.thumbnail,
          video.duration,
          video.category,
          video.views,
          video.uploadDate,
          video.url,
          video.relevantFor,
        ]
      );
    }

    saveDatabase();

    return { success: true, userId };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error: 'Migration failed' };
  }
}

// Check if database has been initialized
export function isDatabaseInitialized(): boolean {
  try {
    const db = getDatabase();
    const result = db.exec('SELECT COUNT(*) as count FROM users');
    if (result.length === 0 || result[0].values.length === 0) {
      return false;
    }
    const count = result[0].values[0][0] as number;
    return count > 0;
  } catch (error) {
    return false;
  }
}
