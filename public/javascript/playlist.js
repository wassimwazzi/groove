// eslint-disable-next-line no-unused-vars
function fetchPlaylistSongs(playlistId, platform) {
  fetch(`/api/playlists/${playlistId}/tracks?platform=${platform}`)
    .then((response) => response.json())
    .then((tracks) => {
      const playlistSongs = document.querySelector('.playlist-songs')
      const songsList = playlistSongs.querySelector('ul')
      songsList.innerHTML = ''
      tracks.forEach(({ track }) => {
        const image = track.album && track.album.images.length > 0 ? track.album.images[0].url : ''
        songsList.innerHTML += `
          <a href="${track.preview_url}" class="song-list-item">
            ${image ? `<img src="${image}" alt="Album Cover">` : ''}
            <span>${track.name}</span>
          </a>
        `
      })
    })
}
