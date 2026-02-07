# COMP 4513 Assignment 1

## Overview

The purpose of this project is to create an API that displays the contents of a sqlite database called songs-2026.db. This database contains a list of artists, genres, songs, playlists, and types of songs. This information can then be searched through using various links that will be provided. This data is returned in json format.

## Built With

**Node** - JavaScript runtime

**Express** - Routing

**Render.com** - Deployment - https://comp-4513-assignment-1-lwc5.onrender.com

## Example 

**Request** `/api/songs/1010`

```
{"song_id":1010,
"title":"MIA (feat. Drake)",
"artist_id":15,"genre_id":117,
"year":2018,"bpm":97,"energy":54,
"danceability":82,
"loudness":-6,
"liveness":10,
"valence":16,
"duration":210,
"acousticness":1,
"speechiness":6,
"popularity":82,
"artist_name":"Bad Bunny",
"genre_name":"latin"}
```

## Project Files
| File | Description |
| ---- | ----------- |
| `db.js` | Serves as the function that allows the main file to run SQL commands |
| `app.js` | Contains the various API requests that may be made to the API. Also serves as the file that runs Node/Express |

## Test Links
[/api/artists](https://comp-4513-assignment-1-lwc5.onrender.com/api/artists)
/api/artists/129
/api/artists/sdfjkhsdf
/api/artists/averages/129
/api/genres
/api/songs
/api/songs/sort/artist
/api/songs/sort/year
/api/songs/sort/duration
/api/songs/1010
/api/songs/sjdkfhsdkjf
/api/songs/search/begin/love
/api/songs/search/begin/sdjfhs
/api/songs/search/any/love
/api/songs/search/year/2017
/api/songs/search/year/2027
/api/songs/artist/149
/api/songs/artist/7834562
/api/songs/genre/115
/api/playlists
/api/playlists/3
/api/playlists/35362
/api/mood/dancing/5
/api/mood/dancing/500
/api/mood/dancing/ksdjf
/api/mood/happy/8
/api/mood/happy
/api/mood/coffee/10
/api/mood/studying/15

