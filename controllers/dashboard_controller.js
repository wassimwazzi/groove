import titelize from '../utils/titelize.js'
import PlatformsManager from '../utils/platforms_manager.js'

export default async (req, res) => {
  const platform = req.query.platform
  const authenticator = PlatformsManager.getAuthenticator(platform)
  if (!authenticator.isLoggedIn(req)) {
    req.flash('alert', 'Connect to one of the platforms to access the dashboard')
    res.redirect('/')
    return
  }
  const communicator = PlatformsManager.getCommunicator(platform)
  const playlists = await communicator.getPlaylists(req)
  console.log(playlists)
  res.render('dashboard', { platform: titelize(platform), playlists: playlists })
}
