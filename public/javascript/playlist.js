// eslint-disable-next-line no-unused-vars
function fetchPlaylistSongs(playlistId, platform) {
  fetch(`/api/playlists/${playlistId}/tracks?platform=${platform}`)
    .then((response) => response.json())
    .then((tracks) => {
      const playlistSongs = document.querySelector('.playlist-songs')
      const songsList = playlistSongs.querySelector('ul')
      songsList.innerHTML = ''
      tracks.forEach(({ track }) => {
        songsList.innerHTML += `
          <li>
            <a href="/songs/${track.id}">${track.name}</a>
          </li>
        `
      })
    })
}