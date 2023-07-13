import titelize from '../utils/titelize.js'
import PlatformsManager from '../utils/platforms_manager.js'

export default async (req, res) => {
  const platform = req.query.platform
  const authenticator = PlatformsManager.getAuthenticator(platform)
  if (!authenticator.isLoggedIn(req)) {
    req.flash('alert', 'Connect to one of the platforms first')
    res.redirect('/')
    return
  }

  res.render('dashboard', { platform: titelize(platform) })
}
