from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import database
from random import randint

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


@app.route("/get-song", methods=["POST"])
def getSong():
    data = request.json

    songs = database.pullSongsByGenre(data['genre'])
    
    selectedSong = songs[randint(0, len(songs) - 1)]

    return jsonify({'Name': selectedSong[0], 'Artist': selectedSong[1]})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)