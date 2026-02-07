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
{"song_id":1010,"title":"MIA (feat. Drake)","artist_id":15,"genre_id":117,"year":2018,"bpm":97,"energy":54,"danceability":82,"loudness":-6,"liveness":10,"valence":16,"duration":210,"acousticness":1,"speechiness":6,"popularity":82,"artist_name":"Bad Bunny","genre_name":"latin"}
```
