// cache to track which playlists have been loaded to avoid unnecessary requests
const loadedPlaylists = {}

// eslint-disable-next-line no-unused-vars
function fetchPlaylistSongs(playlist, platform) {
  const playlistId = playlist.id
  const ownerId = playlist.ownerId
  if (loadedPlaylists[playlistId]) {
    songsList.innerHTML = loadedPlaylists[playlistId]
    return
  }
  const playlistSongs = document.querySelector('.playlist-songs')
  const songsList = playlistSongs.querySelector('ul')
  songsList.innerHTML = `<div class="loader ${platform}"></div>`

  fetch(`/api/playlists/${playlistId}/tracks?platform=${platform}`)
    .then((response) => {
      if (!response.ok) {
        console.log('error fetching playlist tracks', response)
        document.querySelector('#refresh-page').style.display = 'block'
        window.scrollTo(0, 0)
        return
      }
      return response.json()
    })
    .then((tracks) => {
      let innerHTML = ''
      tracks.forEach(({ track }) => {
        const image = track.album && track.album.images.length > 0 ? track.album.images[0].url : ''
        const artists = track.artists.map((artist) => artist.name).join(' & ')
        const playlistContext = `spotify:user:${ownerId}:playlist:${playlistId}`
        innerHTML += `
          <a class="song-list-item" onClick="setCurrentTracks('${platform}', ['${track.uri}'], '${playlistContext}')">
            ${image ? `<img src="${image}" alt="Album Cover">` : ''}
            <div class="playlist-song-info">
              <span class="name">
                ${track.name}
              </span>
              <span class="artist">${artists}</span>
            </div>
          </a>
        `
      })
      songsList.innerHTML = innerHTML
      loadedPlaylists[playlistId] = songsList.innerHTML
    })
}

// eslint-disable-next-line no-unused-vars
function setCurrentTracks(platform, tracks, context) {
  fetch(`/api/player/current?platform=${platform}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tracks, context }),
  })
    .then((response) => {
      if (!response.ok) {
        console.log('error', response)
        document.querySelector('#refresh-page').style.display = 'block'
        window.scrollTo(0, 0)
        return
      }
      return response.json()
    })
    .catch((error) => {
      console.log(error)
    })
}
