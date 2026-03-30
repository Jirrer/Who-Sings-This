async function searchSong() {
    const url = `https://itunes.apple.com/search?term=${document.getElementById('searchInput').value}&entity=song&limit=1`;
    const response = await fetch(url);
    const json = await response.json();
  
    const player = document.getElementById('player');

    console.log(json.results[0])
    
    
    player.src = json.results[0].previewUrl;
    player.load();
    player.play();
    
    
    // Show Song
    document.getElementById('artistName').innerHTML = json.results[0]['artistName'];
    const artwork = document.getElementById('artwork');
    artwork.src = json.results[0].artworkUrl100;


}