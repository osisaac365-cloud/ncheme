import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.env.DATABASE_PATH || 'database.db');
const db = new Database(dbPath);

// Enable foreign key enforcement
db.pragma('foreign_keys = ON');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('Artist', 'Fan', 'Admin')) NOT NULL,
    is_locked INTEGER DEFAULT 0,
    failed_attempts INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS music (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    price_type TEXT CHECK(price_type IN ('Single', 'Mixtape', 'Album')) NOT NULL,
    genre TEXT DEFAULT 'Other',
    filename TEXT NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Add genre column if it doesn't exist (for existing databases)
  PRAGMA table_info(music);
`);

try {
  db.exec("ALTER TABLE music ADD COLUMN genre TEXT DEFAULT 'Other'");
} catch (e) {
  // Column might already exist
}

db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    music_id INTEGER NOT NULL,
    fan_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE,
    FOREIGN KEY (fan_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Validate relationships (check for orphans)
const validateRelationships = () => {
  try {
    const orphans = {
      music: db.prepare("SELECT COUNT(*) as count FROM music WHERE artist_id NOT IN (SELECT id FROM users)").get() as any,
      logs: db.prepare("SELECT COUNT(*) as count FROM logs WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users)").get() as any,
      sales_music: db.prepare("SELECT COUNT(*) as count FROM sales WHERE music_id NOT IN (SELECT id FROM music)").get() as any,
      sales_fan: db.prepare("SELECT COUNT(*) as count FROM sales WHERE fan_id NOT IN (SELECT id FROM users)").get() as any,
    };

    console.log('Database Relationship Validation:', orphans);
    
    // Check for foreign key violations using PRAGMA
    const violations = db.prepare("PRAGMA foreign_key_check").all();
    if (violations.length > 0) {
      console.error('Foreign Key Violations Found:', violations);
    } else {
      console.log('No Foreign Key Violations found.');
    }
  } catch (error) {
    console.error('Validation failed:', error);
  }
};

validateRelationships();

// Ensure uploads directory exists
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

export default db;
