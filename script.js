async function searchSong() {
    document.getElementById('searchInput').value = "";


    const songOutput = await getSong();
    const songName =  songOutput[0];
    const songArtist = songOutput[1];

    
    const url = `https://itunes.apple.com/search?term=${songName}+${songArtist}&entity=song&limit=1`;
    const response = await fetch(url);
    const json = await response.json();

    const player = document.getElementById('player');
    player.src = json.results[0].previewUrl;
    await player.play(); 

    const playerInput = await waitForEnter('searchInput');

    if (getDoubleMetaphone(playerInput) === getDoubleMetaphone(songArtist)) {
        document.getElementById('userGuessResult').textContent = "Correct!"
    } else {
        document.getElementById('userGuessResult').textContent = "Wrong!"
    }

    document.getElementById('songName').textContent = songName;
    document.getElementById('artistName').textContent = songArtist;
    document.getElementById('artwork').src = json.results[0].artworkUrl100;
}

function waitForEnter(inputId) {
    return new Promise((resolve) => {
        const input = document.getElementById(inputId);

        const handler = (e) => {
            if (e.key === 'Enter') {
                input.removeEventListener('keydown', handler);
                resolve(input.value.trim());
            }
        };

        input.addEventListener('keydown', handler);
        input.focus();
    });
}

async function getSong() {
    const genre = "Pop";

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
    return input;
}