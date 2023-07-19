import PlatformsManager from '../../utils/platforms_manager.js'

// cache to track which playlists have been loaded to avoid unnecessary requests
const loadedPlaylists = {}

// eslint-disable-next-line no-unused-vars
function fetchPlaylistSongs(playlistId, platform) {
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
        console.log('error')
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
        innerHTML += `
          <a href="${track.preview_url}" class="song-list-item">
            ${image ? `<img src="${image}" alt="Album Cover">` : ''}
            <div class="playlist-song-info">
              <span class="name">${track.name}</span>
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
function setPlayerTrack(trackURIs, contextURI, platform) {
  const communicator = PlatformsManager.getCommunicator(platform)
  communicator.setTrack(trackURIs, contextURI)
}
