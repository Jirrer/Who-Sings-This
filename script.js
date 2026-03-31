async function searchSong() {
    document.getElementById('searchInput').value = "";


    const songOutput = await getSong();
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

async function getSong() { // To-Do: return and accept any of the all artists in a song
    const genre = "Pop";


    const baseUrl = "https://musicbrainz.org/ws/2/recording";
    const headers = { 'User-Agent': 'Who-Sings-This/1.0.0 ( johntestdevelopment@gmail.com )' };

    try {
        // 1. Get total count for this genre
        const initialRes = await fetch(`${baseUrl}?query=tag:${genre}&limit=1&fmt=json`, { headers });
        const initialData = await initialRes.json();
        const totalCount = initialData.count;

        if (totalCount === 0) return console.log("No songs found for this genre.");

        // 2. Pick a random offset
        const randomOffset = Math.floor(Math.random() * Math.min(totalCount, 1000)); // Limit to 1000 for speed

        // 3. Fetch the random song
        const finalRes = await fetch(`${baseUrl}?query=tag:${genre}&limit=1&offset=${randomOffset}&fmt=json`, { headers });
        const finalData = await finalRes.json();
        
        const song = finalData.recordings[0];

        return [song.title, song['artist-credit'][0].name];
    } catch (err) {
        return false;
    }
}

function getDoubleMetaphone(input) {
    return input;
}