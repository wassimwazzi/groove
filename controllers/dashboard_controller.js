import titelize from '../utils/titelize.js'
import PlatformsManager from '../utils/platforms_manager.js'
// import SpotifyCommunicator from '../utils/communicators/spotify_communicator.js'

export default async (req, res) => {
  const platform = req.query.platform
  const authenticator = PlatformsManager.getAuthenticator(platform)
  if (!authenticator.isLoggedIn(req)) {
    req.flash('alert', 'Connect to one of the platforms first')
    res.redirect('/')
    return
  }
  // const communicator = new SpotifyCommunicator()
  // const playlists = await communicator.getPlaylists(req)
  // console.log(playlists)
  res.render('dashboard', { platform: titelize(platform) })
}
