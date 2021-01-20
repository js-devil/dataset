const router = require('express').Router();
const { getAllEvents, updateActor } = require('./controller');
const { db } = require('./dbConfig');

const { default: validation } = require('./middleware/validation');
const { eventModel, actorUpdate } = require('./model');

router.post('/events', validation(eventModel), async (req, res, next) => {
  try {
    let { id, type, actor, repo } = req.body;

    db.all(`SELECT * FROM events WHERE id = ?`, [id], (err, rows) => {
      if (err) {
        err.statusCode = 500;
        return next(err);
      }

      if (rows.length) {
        const err = new Error('this event already exists!');
        err.statusCode = 400;
        next(err);
        return;
      }

      repo = JSON.stringify(repo);
      actor = JSON.stringify(actor);

      db.run(
        `INSERT INTO events(id, type, actor, repo, created_at) VALUES(?, ?, ?, ?, datetime('now', 'localtime'))`,
        [id, type, actor, repo],
        function (err) {
          if (err) {
            err.statusCode = 500;
            return next(err);
          }

          return res
            .status(201)
            .send({ status: true, message: 'event added successfully' });
        }
      );
    });
  } catch (err) {
    next(err);
  }
});

router.get('/events', (req, res, next) => {
  getAllEvents(next, (events) => {
    res.status(201).send({ events });
  });
});

router.get('/events/actors/:actorID', (req, res, next) => {
  getAllEvents(next, (events) => {
    const actorEvents = events.filter(
      (key) => key.actor.id === Number(req.params.actorID)
    );

    if (!actorEvents.length) {
      const err = new Error('this actor does not exist');
      err.statusCode = 400;
      return next(err);
    }

    res.send({ events: actorEvents });
  });
});

router.put('/actors', validation(actorUpdate), (req, res, next) => {
  getAllEvents(next, (events) => {
    const { id, avatar_url } = req.body;
    const actorEvents = events.filter((key) => key.actor.id === Number(id));

    if (!actorEvents.length) {
      const err = new Error('this actor does not exist');
      err.statusCode = 404;
      return next(err);
    }

    const updatedActors = actorEvents.map((key) => ({
      id: key.id,
      actor: {
        ...key.actor,
        avatar_url,
      },
    }));

    updatedActors.forEach(async (event) => {
      await updateActor(next, [JSON.stringify(event.actor), event.id]);
    });

    res.send({
      status: true,
      message: 'actor updated successfully',
    });
  });
});

router.get('/actors', (req, res, next) => {
  getAllEvents(next, (events) => {
    let actors = [
      ...new Set(
        events.map((key) => ({
          ...key.actor,
          created_at: key.created_at,
        }))
      ),
    ];

    actors = actors
      .map((actor) => {
        const totalEvents = events.filter((key) => key.actor.id === actor.id)
          .length;

        return {
          ...actor,
          totalEvents,
        };
      })
      .sort((a, b) => a.login.localeCompare(b.login))
      .sort((a, b) => (a.totalEvents < b.totalEvents ? 1 : -1))
      .sort((a, b) =>
        new Date(b.created_at).getTime() > new Date(a.created_at).getTime()
          ? 1
          : -1
      )
      .map((key) => ({
        id: key.id,
        login: key.login,
        avatar_url: key.avatar_url,
      }));

    res.send({
      actors,
    });
  });
});

router.delete('/erase', (req, res, next) => {
  db.run('DELETE FROM events');

  res.send({ status: true, message: 'all events have been deleted' });
});

module.exports = router;
