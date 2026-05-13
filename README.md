# Who Plays This?

Who Plays This? is a small music-guessing game. The app plays a short preview of a song, shows the artwork after the guess, and asks the player to type the artist name. It uses a genre selector so the random song comes from a chosen category like rock, country, grunge, or pop.

## What The Project Does

The game picks a random song from a SQLite database, looks up a preview and artwork from the iTunes Search API, and plays the preview in the browser. The player types a guess for the artist, then the app checks whether the guess matches the real artist using a phonetic comparison instead of a strict spelling match. That makes the game a little more forgiving when names are hard to spell.

## Main Pieces

- `index.html` contains the game layout: genre buttons, the input box, audio player, result text, and song details.
- `styles.css` provides the simple page layout and basic sizing.
- `script.js` handles the front-end game logic, including genre selection, fetching songs, playing previews, timing the guess, and checking the answer.
- `double_metaphone.js` implements the Double Metaphone phonetic algorithm used to compare the player's guess with the correct artist name.
- `app.py` is the Flask backend. It exposes a `/get-song` endpoint that returns one random song for the selected genre.
- `database.py` reads from the SQLite database and fetches songs by genre.
- `scripts/importSongs.py` imports song data from the text file into the database.
- `txt/songImport.txt` contains sample song and artist lines used for importing.

## How The Game Works

1. The player chooses a genre.
2. The browser sends that genre to the Flask API.
3. The API queries the SQLite database and returns one random song from that genre.
4. The browser uses the song title and artist to request a preview and artwork from iTunes.
5. The preview starts playing, and the player types their guess.
6. When Enter is pressed, the app compares the guess with the real artist name using Double Metaphone.
7. The screen turns green for a correct guess or red for a wrong one, then the song title, artist, artwork, and time-to-guess are shown.

## Data And Configuration

The backend expects two environment variables in `.env`:

- `DATABASE` points to the SQLite database file.
- `SONGLIST` points to the text file used for importing songs.

The import script reads rows in the format `Song Title - Artist Name` and inserts them into a `songs` table with a `genres` value. The backend then searches that table with a simple `LIKE` query to find songs for the chosen genre.

## Notes

- The app is intentionally simple and has a few rough edges, but the core loop is complete and easy to follow.
- The artist check is phonetic, so spelling does not need to be exact.
- The frontend expects the Flask server to be running locally on port `5050`.

## How To Run

1. Make sure `.env` points to the SQLite database and the song import text file.
2. Install the Python packages used by the backend: Flask, Flask-CORS, and python-dotenv.
3. Start the Flask app with `python app.py`.
4. Open `index.html` in a browser, or serve the folder with any simple static file server.
5. If you need to load songs into the database first, run `python scripts/importSongs.py` after the database is set up.

## Run Overview

At a high level, the project is split into a browser front end and a small Python API. The browser handles the game, and Flask handles song selection from the database.
