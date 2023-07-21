// cache to track which playlists have been loaded to avoid unnecessary requests
const loadedPlaylists = {}
let nowPlaying = null

// eslint-disable-next-line no-unused-vars
function fetchPlaylistSongs(playlist, platform) {
  const playlistId = playlist.id
  const ownerId = playlist.ownerId
  const playlistSongs = document.querySelector('.playlist-songs')
  const songsList = playlistSongs.querySelector('ul')
  if (loadedPlaylists[playlistId]) {
    songsList.innerHTML = loadedPlaylists[playlistId]
    return
  }
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
          <a class="song-list-item" onClick="setCurrentTracks('${platform}', ['${
            track.uri
          }'], '${playlistContext}')" id="${track.id}" data-uri="${track.uri}">
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
      highlightNowPlaying() // if the playlist contains the current song, highlight it
    })
}

// eslint-disable-next-line no-unused-vars
function setCurrentTracks(platform, tracks, context) {
  // set the track of the music player
  fetch(`/api/player/current?platform=${platform}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tracks, context }),
  }).then((response) => {
    if (!response.ok) {
      console.log('error', response)
      document.querySelector('#refresh-page').style.display = 'block'
      window.scrollTo(0, 0)
      return
    }
  })
}

function highlightNowPlaying() {
  const song = document.getElementById(nowPlaying.id)
  document.querySelectorAll('.now-playing').forEach((element) => {
    element.classList.remove('now-playing')
  })
  if (song) {
    song.classList.add('now-playing')
  }
}

window.addEventListener('setTrack', (e) => {
  // fired when a new song is in the music player
  const { track } = e.detail
  nowPlaying = track
  highlightNowPlaying()
})
