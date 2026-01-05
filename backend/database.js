const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('[db] __dirname =', __dirname);

const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.resolve(dataDir, 'database.db');
console.log('[db] using dbPath =', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('[db] Error opening database', err.message);
  } else {
    console.log('[db] Connected to SQLite at', dbPath);
    createTables();
  }
});

function createTables() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        deskripsi TEXT,
        gambar_url TEXT NOT NULL
      )
    `);

    const defaultUser = 'admin';
    const defaultPass = '12345';
    db.get('SELECT * FROM users WHERE username = ?', [defaultUser], (err, row) => {
      if (err) {
        console.error('[db] error checking default user', err);
        return;
      }
      if (!row) {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [defaultUser, defaultPass], (e) => {
          if (e) console.error('[db] error inserting default user', e.message);
          else console.log("[db] default user created: admin / admin123");
        });
      }
    });
  });
}

module.exports = db;