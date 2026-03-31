from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


@app.route("/get-song", methods=["POST"])
def getSong():
    data = request.json

    return jsonify({'Name': 'Kyrpotnite', 'Artist': "Three Doors Down"})



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)