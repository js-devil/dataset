const sqlite3 = require('sqlite3').verbose();

// create a new database file users.db or open existing users.db
export const db = new sqlite3.Database('./dataset.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the dataset database.');
});

db.serialize(() => {
  // 1rst operation (run create table statement)
  db.run(
    `CREATE TABLE IF NOT EXISTS events(
            id INTEGER,
            type TEXT NOT NULL,
            actor TEXT,
            repo TEXT,
            created_at TEXT)
            `,
    (err) => {
      if (err) {
        console.log(err);
        throw err;
      }
    }
  );
});
