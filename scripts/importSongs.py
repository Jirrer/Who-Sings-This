import sqlite3, os
from dotenv import load_dotenv

load_dotenv()

database_location = os.getenv('DATABASE')
songList_location = os.getenv('SONGLIST')

Selected_Genre = 'rock'

def getSongs():
    output = []

    with open(songList_location) as file:
        for row in file:
            if len(row) == 1: continue
            
            output.append(row.split(" - "))

    for item in output:
        item[1] = item[1][:len(item[1]) - 1]

    return output

def printSongs(songs):
    for s in songs:
        print(s)

def uploadSongs(songs):
    users = [(song.strip(), artist.strip(), Selected_Genre) for song, artist in songs]

    with sqlite3.connect(database_location) as connection:
        cursor = connection.cursor()

        query = "INSERT INTO songs (name, artist, genres) VALUES (?, ?, ?)"
        cursor.executemany(query, users)
        connection.commit()

if __name__ == "__main__":
    songs = getSongs()
    printSongs(songs)
    uploadSongs(songs)