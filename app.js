import express from 'express';
import cors from 'cors';
import { getDB } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const db = await getDB();

// Helper for obtaining various songs
const SONG_JOIN = `
  SELECT songs.*, 
         artists.artist_id AS artist_id,
         artists.artist_name AS artist_name,
         genres.genre_id AS genre_id,
         genres.genre_name AS genre_name
  FROM songs
  JOIN artists ON songs.artist_id = artists.artist_id
  JOIN genres ON songs.genre_id = genres.genre_id
`;

//Helper for getting mood routes
function normalizeLimit(ref) {
    const n = parseInt(ref);
    if (!n || n < 1 || n > 20)
        return 20;
    return n;
}

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

// Getting /api/songs
app.get('/api/songs', async (req, res) => {
  const rows = await db.all(`${SONG_JOIN} ORDER BY title`);
  res.json(rows);
});

// Getting /api/songs/sort:order
app.get('/api/songs/sort/:order', async (req, res) => {
  const { order } = req.params;

  const map = {
    id: 'songs.song_id',
    title: 'songs.title',
    artist: 'artists.artist_name',
    genre: 'genres.genre_name',
    year: 'songs.year',
    duration: 'songs.duration'
  };

  if (!map[order]) return res.json({ error: 'Invalid sort field.' });

  const rows = await db.all(`${SONG_JOIN} ORDER BY ${map[order]}`);
  res.json(rows);
});

// Getting /api/songs:id
app.get('/api/songs/:id', async (req, res) => {
  const { id } = req.params;

  const row = await db.get(`${SONG_JOIN} WHERE songs.song_id = ?`, id);

  if (!row) return res.json({ error: 'Requested resource did not return any data.' });

  res.json(row);
});

// Getting /api/songs/search/begin/:substring
app.get('/api/songs/search/begin/:substring', async (req, res) => {
  const { substring } = req.params;

  const rows = await db.all(
    `${SONG_JOIN} WHERE LOWER(title) LIKE LOWER(?) || '%'`,
    substring
  );

  if (rows.length === 0) return res.json({ error: 'Requested resource did not return any data.' });

  res.json(rows);
});

// Getting /api/songs/search/any/:substring
app.get('/api/songs/search/any/:substring', async (req, res) => {
  const { substring } = req.params;

  const rows = await db.all(
    `${SONG_JOIN} WHERE LOWER(title) LIKE '%' || LOWER(?) || '%'`,
    substring
  );

  if (rows.length === 0) return res.json({ error: 'Requested resource did not return any data.' });

  res.json(rows);
});

// Getting /api/songs/search/year/:year
app.get('/api/songs/search/year/:year', async (req, res) => {
  const { year } = req.params;

  const rows = await db.all(`${SONG_JOIN} WHERE songs.year = ?`, year);

  if (rows.length === 0) return res.json({ error: 'Requested resource did not return any data.' });

  res.json(rows);
});

// Getting /api/songs/artist/:id
app.get('/api/songs/artist/:id', async (req, res) => {
  const { id } = req.params;

  const rows = await db.all(`${SONG_JOIN} WHERE songs.artist_id = ?`, id);

  if (rows.length === 0) return res.json({ error: 'Requested resource did not return any data.' });

  res.json(rows);
});

// Getting /api/songs/genre/:id
app.get('/api/songs/genre/:id', async (req, res) => {
  const { id } = req.params;

  const rows = await db.all(`${SONG_JOIN} WHERE songs.genre_id = ?`, id);

  if (rows.length === 0) return res.json({ error: 'Requested resource did not return any data.' });

  res.json(rows);
});

// Getting /api/playlists/:id
app.get('/api/playlists/:id', async (req, res) => {
  const { id } = req.params;

  const rows = await db.all(`
    SELECT playlists.playlist_name AS playlist,
           songs.song_id,
           songs.title,
           artists.artist_name,
           genres.genre_name,
           songs.year
    FROM playlist_songs
    JOIN playlists ON playlist_songs.playlist_id = playlists.playlist_id
    JOIN songs ON playlist_songs.song_id = songs.song_id
    JOIN artists ON songs.artist_id = artists.artist_id
    JOIN genres ON songs.genre_id = genres.genre_id
    WHERE playlists.playlist_id = ?
  `, id);

  if (rows.length === 0) return res.json({ error: 'Requested resource did not return any data.' });

  res.json(rows);
});

// Getting /api/mood/dancing/:ref?
app.get('/api/mood/dancing/:ref?', async (req, res) => {
  const limit = normalizeLimit(req.params.ref);

  const rows = await db.all(
    `${SONG_JOIN} ORDER BY danceability DESC LIMIT ?`,
    limit
  );

  res.json(rows);
});

// Getting /api/mood/happy/:ref?
app.get('/api/mood/happy/:ref?', async (req, res) => {
  const limit = normalizeLimit(req.params.ref);

  const rows = await db.all(
    `${SONG_JOIN} ORDER BY valence DESC LIMIT ?`,
    limit
  );

  res.json(rows);
});

// Geting /api/mood/coffee/:ref?
app.get('/api/mood/coffee/:ref?', async (req, res) => {
  const limit = normalizeLimit(req.params.ref);

  const rows = await db.all(
    `${SONG_JOIN} ORDER BY (liveness / acousticness) DESC LIMIT ?`,
    limit
  );

  res.json(rows);
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
