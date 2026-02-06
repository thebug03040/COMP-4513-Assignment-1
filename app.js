import express from 'express';
import cors from 'cors';
import { getDB } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const db = await getDB();

// Getting /api/artists

app.get('/api/artists', async (req, res) => {
    try {
        const rows = await db.all(`
        SELECT artists.*, types.type_name
        FROM artists
        JOIN types ON artists.type_id = types.type_id
        ORDER BY artist_name
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Getting /api/artists/:id
app.get('/api/artists/:id', async (req, res) => {
    const { id } = req.params;

    const row = await db.get(`
    SELECT artists.*, types.type_name
    FROM artists
    JOIN types ON artists.type_id = types.type_id
    WHERE artist_id = ?
    `, id);

    if (!row) return res.json({ error: 'No data found.' });

    res.json(row);
});

// Getting /api/artists/averages/:id
app.get('/api/artists/averages/:id', async (req, res) => {
  const { id } = req.params;

  const row = await db.get(`
    SELECT 
      AVG(bpm) AS bpm,
      AVG(energy) AS energy,
      AVG(danceability) AS danceability,
      AVG(loudness) AS loudness,
      AVG(liveness) AS liveness,
      AVG(valence) AS valence,
      AVG(duration) AS duration,
      AVG(acousticness) AS acousticness,
      AVG(speechiness) AS speechiness,
      AVG(popularity) AS popularity
    FROM songs
    WHERE artist_id = ?
  `, id);

  if (!row || Object.values(row).every(v => v === null))
    return res.json({ error: 'Requested resource did not return any data.' });

  res.json(row);
});

// Getting /api/genres
app.get('/api/genres', async (req, res) => {
  const rows = await db.all('SELECT * FROM genres');
  res.json(rows);
});




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
