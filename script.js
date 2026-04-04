
// To-Do: add a seen hashset to avoid repeats
// maybe pull 50 or so songs a time to limit api requests
// To-Do: work on fuzzy search


function clearScreen() {
    document.getElementById('userGuessResult').textContent = "";
    document.getElementById('searchInput').value = "";
    document.getElementById('songName').textContent = "";
    document.getElementById('artistName').textContent = "";
    document.getElementById('artwork').src = "";
    document.getElementById('timeToGuess').innerHTML = "";
    document.body.style.backgroundColor = "lightblue";
}

let selected_genre = "rock";

function selectGenre(genreInput) {
    // Add check here

    const oldGenre =  document.getElementById(`${selected_genre}GenreButton`);
    const newGenre =  document.getElementById(`${genreInput}GenreButton`);

    oldGenre.style.backgroundColor = "white";
    newGenre.style.backgroundColor = "lightblue";

    selected_genre = genreInput; 
}

async function searchSong() {
    clearScreen(); 
    
    const songOutput = await getSong();
    const songName =  songOutput[0];
    const songArtist = songOutput[1];
    
    const url = `https://itunes.apple.com/search?term=${songName}+${songArtist}&entity=song&limit=1`;
    const response = await fetch(url);
    const json = await response.json();

    document.getElementById('playingStatus').innerHTML = 'Playing...'
    
    const player = document.getElementById('player');
    player.src = json.results[0].previewUrl;
    await player.play();
    
    const startTime = Date.now();
    
    const playerInput = await waitForEnter('searchInput');
    
    const millisecondsElapsed = Date.now() - startTime;
 
    if (compareMetaphoneCodes(playerInput, songArtist)) {
        document.getElementById('userGuessResult').textContent = "Correct!";
        document.body.style.backgroundColor = "green";
    } else {
        document.getElementById('userGuessResult').textContent = "Wrong!";
        document.body.style.backgroundColor = "red";
    }
    
    document.getElementById('playingStatus').innerHTML = "";
    document.getElementById('songName').textContent = `Name: ${songName}`;
    document.getElementById('artistName').textContent = `Artist: ${songArtist}`;
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
    try {
        const response = await fetch('http://127.0.0.1:5050/get-song', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ genre: selected_genre }),
        });

        const data = await response.json();

        return [data['Name'], data['Artist']];
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function getDoubleMetaphone(input) {
    const words = input
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    const encodedWords = words.map(word => {
        const [primary, secondary] = doubleMetaphone(word);
        console.log(`${word} -> primary: ${primary}, secondary: ${secondary}`);
        return primary;
    });

    return encodedWords.join(' ');
}

function getMetaphoneCodes(input) {
    return input
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .map(word => {
            const [primary, secondary] = doubleMetaphone(word);
            return { word, primary, secondary };
        });
}

function compareMetaphoneCodes(playerInput, songArtist) {
    const inputCodes = getMetaphoneCodes(playerInput);
    const artistCodes = getMetaphoneCodes(songArtist);

    if (inputCodes.length !== artistCodes.length) {
        return false;
    }

    return inputCodes.every((inputCode, index) => {
        const artistCode = artistCodes[index];
        const inputVariants = [inputCode.primary, inputCode.secondary].filter(Boolean);
        const artistVariants = [artistCode.primary, artistCode.secondary].filter(Boolean);

        return inputVariants.some(inputVariant => artistVariants.includes(inputVariant));
    });
}