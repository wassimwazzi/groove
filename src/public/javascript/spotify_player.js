window.onSpotifyWebPlaybackSDKReady = () => {
  const token = document.querySelector('#spotify-access-token').dataset.token
  const musicPlayer = document.getElementById('js-music-player')
  let currentTrackId
  // eslint-disable-next-line no-undef
  const player = new Spotify.Player({
    name: 'Groove',
    getOAuthToken: (cb) => {
      cb(token)
    },
    volume: 0.5,
  })

  player.addListener('ready', ({ device_id }) => {
    // set the device to this player
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_ids: [device_id],
        play: false,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.log('error', response)
          return
        }
        musicPlayer.dispatchEvent(
          new CustomEvent('setPlayerReady', {
            detail: true,
          }),
        )
      })
      .catch((err) => {
        console.log("Couldn't set device: ", err)
      })
  })

  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id)
  })

  player.addListener('initialization_error', ({ message }) => {
    console.error(message)
  })

  player.addListener('authentication_error', ({ message }) => {
    console.error(message)
  })

  player.addListener('account_error', ({ message }) => {
    console.error(message)
  })

  window.addEventListener('toggleMusic', () => {
    player.togglePlay()
  })

  window.addEventListener('nextTrack', () => {
    player.nextTrack()
  })

  window.addEventListener('previousTrack', () => {
    player.previousTrack()
  })

  window.addEventListener('seek', async (e) => {
    const ms = e.detail.seconds * 1000
    if (!ms) {
      return
    }
    player.seek(ms)
  })

  window.addEventListener('setVolume', (e) => {
    // e.detail is the volume to set, between 0 and 1
    player.setVolume(e.detail.volume)
  })

  player.addListener('player_state_changed', ({ position, paused, duration, track_window: { current_track } }) => {
    if (!current_track || current_track.id === currentTrackId) {
      return
    }
    const trackDetails = {
      name: current_track.name,
      artist: current_track.artists.map((artist) => artist.name).join(' & '),
      album: current_track.album.name,
      cover: current_track.album.images.length > 0 ? current_track.album.images[0].url : '',
      duration: duration / 1000,
      elapsedTime: position / 1000,
      paused,
      volume: player.getVolume(),
    }
    musicPlayer.dispatchEvent(
      new CustomEvent('setTrack', {
        detail: trackDetails,
      }),
    )
  })

  player.connect()
}
