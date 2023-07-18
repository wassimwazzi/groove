console.log('included spotify_player.js')
window.onSpotifyWebPlaybackSDKReady = () => {
  const token = document.querySelector('#spotify-access-token').dataset.token
  console.log(token)
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
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
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

  window.addEventListener('seek', (e) => {
    // e.detail is the time in ms to seek to
    player.seek(e.detail)
  })

  window.addEventListener('setVolume', (e) => {
    // e.detail is the volume to set, between 0 and 1
    player.setVolume(e.detail)
  })

  player.addListener('player_state_changed', (state) => {
    if (!state) {
      console.log('no state')
      return
    }
    // console.log('state_changed ', state)
  })

  player.connect()
}
