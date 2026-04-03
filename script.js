function clearScreen() {
    document.getElementById('userGuessResult').textContent = "";
    document.getElementById('searchInput').value = "";
    document.getElementById('songName').textContent = "";
    document.getElementById('artistName').textContent = "";
    document.getElementById('artwork').src = "";
    document.getElementById('timeToGuess').innerHTML = "";
    document.body.style.backgroundColor = "white";
}

async function searchSong() {
    clearScreen(); 
    
    const songOutput = await getSong();
    const songName =  songOutput[0];
    const songArtist = songOutput[1];
    
    const url = `https://itunes.apple.com/search?term=${songName}+${songArtist}&entity=song&limit=1`;
    const response = await fetch(url);
    const json = await response.json();
    
    const player = document.getElementById('player');
    player.src = json.results[0].previewUrl;
    await player.play();
    
    const startTime = Date.now();
    
    const playerInput = await waitForEnter('searchInput');
    
    const millisecondsElapsed = Date.now() - startTime;
    
    if (getDoubleMetaphone(playerInput) === getDoubleMetaphone(songArtist)) {
        document.getElementById('userGuessResult').textContent = "Correct!";
        document.body.style.backgroundColor = "green";
    } else {
        document.getElementById('userGuessResult').textContent = "Wrong!";
        document.body.style.backgroundColor = "red";
    }
    
    document.getElementById('songName').textContent = songName;
    document.getElementById('artistName').textContent = songArtist;
    document.getElementById('artwork').src = json.results[0].artworkUrl100;
    document.getElementById('timeToGuess').innerHTML = `Time To Guess: ${(millisecondsElapsed / 1000)}s`
    document.getElementById('startButton').innerHTML = 'New Song';
}

function waitForEnter(inputId) {
    return new Promise((resolve) => {
        const input = document.getElementById(inputId);

        const handler = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                input.removeEventListener('keydown', handler);
                resolve(input.value.trim());
                document.getElementById('startButton').focus();
            }
        };

        input.addEventListener('keydown', handler);
        input.focus();
    });
}

async function getSong() {
    const genre = "rock";

    try {
        const response = await fetch('http://127.0.0.1:5050/get-song', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ genre: genre }),
        });

        const data = await response.json();

        return [data['Name'], data['Artist']];
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function getDoubleMetaphone(input) {
    let output = input.toLowerCase();
    
    return output;
}