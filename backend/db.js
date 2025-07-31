import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        ip TEXT,
        hostname TEXT,
        city TEXT,
        region TEXT,
        country TEXT,
        loc TEXT,
        org TEXT,
        postal TEXT,
        timezone TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);
  }
});

export default db;
