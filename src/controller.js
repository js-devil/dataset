const { db } = require('./dbConfig');

export const getAllEvents = (next, callback) => {
  db.all(`SELECT * FROM events`, (err, rows) => {
    if (err) {
      err.statusCode = 500;
      return next(err);
    }

    const events = rows
      .map((row) => ({
        ...row,
        actor: JSON.parse(row.actor),
        repo: JSON.parse(row.repo),
      }))
      .sort((a, b) => (a.id > b.id ? 1 : -1));

    callback(events);
  });
};

export const updateActor = (next, data) => {
  const sql = `UPDATE events SET actor = ? WHERE id = ?`;

  db.run(sql, data, function (err) {
    if (err) {
      err.statusCode = 500;
      return next(err);
    }
  });
};
