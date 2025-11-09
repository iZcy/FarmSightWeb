import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';

let db: Database | null = null;

// Initialize SQLite database
export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  // Try to load existing database from localStorage
  const savedDb = localStorage.getItem('farmsight-db');
  if (savedDb) {
    const uint8Array = new Uint8Array(
      atob(savedDb)
        .split('')
        .map((c) => c.charCodeAt(0))
    );
    db = new SQL.Database(uint8Array);
  } else {
    db = new SQL.Database();
    createTables();
  }

  return db;
}

// Save database to localStorage
export function saveDatabase(): void {
  if (!db) return;
  const data = db.export();
  const base64 = btoa(String.fromCharCode(...data));
  localStorage.setItem('farmsight-db', base64);
}

// Create database tables
function createTables(): void {
  if (!db) return;

  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      avatar TEXT,
      role TEXT NOT NULL DEFAULT 'farmer',
      created_at TEXT NOT NULL
    )
  `);

  // Farms table
  db.run(`
    CREATE TABLE IF NOT EXISTS farms (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      location_lat REAL NOT NULL,
      location_lng REAL NOT NULL,
      location_address TEXT NOT NULL,
      area REAL NOT NULL,
      crop_type TEXT NOT NULL,
      boundary TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_updated TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Alerts table
  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      farm_id TEXT NOT NULL,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      confidence REAL NOT NULL,
      detected_at TEXT NOT NULL,
      message TEXT NOT NULL,
      recommendation TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
    )
  `);

  // NDVI data table
  db.run(`
    CREATE TABLE IF NOT EXISTS ndvi_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farm_id TEXT NOT NULL,
      date TEXT NOT NULL,
      value REAL NOT NULL,
      confidence REAL NOT NULL,
      is_forecast INTEGER DEFAULT 0,
      FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
    )
  `);

  // Videos table
  db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      duration TEXT NOT NULL,
      category TEXT NOT NULL,
      views INTEGER DEFAULT 0,
      upload_date TEXT NOT NULL,
      url TEXT NOT NULL,
      relevant_for TEXT
    )
  `);

  // User settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id TEXT PRIMARY KEY,
      notifications_email INTEGER DEFAULT 1,
      notifications_sms INTEGER DEFAULT 1,
      notifications_push INTEGER DEFAULT 1,
      alert_ndvi_drop REAL DEFAULT 0.15,
      alert_confidence_min REAL DEFAULT 70,
      language TEXT DEFAULT 'en',
      timezone TEXT DEFAULT 'Asia/Shanghai',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Sessions table for auth
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better query performance
  db.run('CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_alerts_farm_id ON alerts(farm_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read)');
  db.run('CREATE INDEX IF NOT EXISTS idx_ndvi_farm_id ON ndvi_data(farm_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)');

  saveDatabase();
}

// Get database instance
export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// Clear all data (for testing/reset)
export function clearDatabase(): void {
  if (!db) return;

  db.run('DELETE FROM sessions');
  db.run('DELETE FROM user_settings');
  db.run('DELETE FROM ndvi_data');
  db.run('DELETE FROM alerts');
  db.run('DELETE FROM videos');
  db.run('DELETE FROM farms');
  db.run('DELETE FROM users');

  saveDatabase();
}

// Export database as file
export function exportDatabase(): Uint8Array {
  if (!db) throw new Error('Database not initialized');
  return db.export();
}

// Import database from file
export async function importDatabase(data: Uint8Array): Promise<void> {
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  db = new SQL.Database(data);
  saveDatabase();
}
