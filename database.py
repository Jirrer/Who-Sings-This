import sqlite3, os

def pullSongsByGenre(genre: str) -> list[str]:
    with sqlite3.connect(os.getenv('DATABASE')) as connection: # To-Do: add multiple artists in db
        cursor = connection.cursor()


        cursor.execute(
            "SELECT name, artist FROM songs WHERE genres LIKE ?",
            (f"%{genre}%",)
        )
        return cursor.fetchall()
