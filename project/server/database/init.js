import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../data/dreamvision.db');

// Create database connection
const db = new sqlite3.Database(dbPath);

// Promisify database methods
db.runAsync = promisify(db.run.bind(db));
db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));

export async function initializeDatabase() {
  try {
    // Create users table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        age INTEGER NOT NULL,
        sex TEXT NOT NULL CHECK (sex IN ('male', 'female', 'other')),
        horoscope TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        profile_picture TEXT,
        join_date TEXT NOT NULL,
        trial_analyses_used INTEGER DEFAULT 0,
        trial_analyses_limit INTEGER DEFAULT 3,
        is_premium BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create dreams table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS dreams (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 5),
        lucidity INTEGER NOT NULL CHECK (lucidity BETWEEN 1 AND 5),
        tags TEXT, -- JSON array
        symbols TEXT, -- JSON array
        themes TEXT, -- JSON array
        visualization_url TEXT,
        is_trial_analysis BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create dream_analyses table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS dream_analyses (
        id TEXT PRIMARY KEY,
        dream_id TEXT NOT NULL,
        overview TEXT NOT NULL,
        symbols TEXT, -- JSON array of symbol interpretations
        themes TEXT, -- JSON array
        emotions TEXT, -- JSON array
        personalized_insights TEXT, -- JSON array
        horoscope_connection TEXT,
        recurring_patterns TEXT, -- JSON array
        psychological_meaning TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dream_id) REFERENCES dreams (id) ON DELETE CASCADE
      )
    `);

    // Create sessions table for authentication
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_dreams_user_id ON dreams (user_id)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_dreams_date ON dreams (date)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions (token)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id)');

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export { db };