async function searchSong() {
    const songOutput = getSong();
    const songName = songOutput[0];
    const songArtist = songOutput[1];

    const url = `https://itunes.apple.com/search?term=${songName}+${songArtist}&entity=song&limit=1`;
    const response = await fetch(url);
    const json = await response.json();

    const player = document.getElementById('player');
    player.src = json.results[0].previewUrl;
    await player.play(); // start playback first

    // Wait for user to press Enter in the input box
    const playerInput = await waitForEnter('searchInput');

    if (getDoubleMetaphone(playerInput) === getDoubleMetaphone(songArtist)) {
        document.getElementById('userGuessResult').textContent = "Correct!"
    } else {
        document.getElementById('userGuessResult').textContent = "Wrong!"
    }

    document.getElementById('artistName').textContent = json.results[0].artistName;
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

function getSong() {
    // document.getElementById('searchInput').value

    return ["Stone", "Alice In Chains"];
}

function getDoubleMetaphone(input) {
    return input;
}