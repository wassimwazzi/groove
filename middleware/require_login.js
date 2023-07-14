import PlatformsManager from '../utils/platforms_manager.js'

const requireLogin = (req, res, next) => {
  const platform = req.query.platform
  const authenticator = PlatformsManager.getAuthenticator(platform)
  if (!authenticator.isLoggedIn(req)) {
    if (req.url.includes('api')) {
      res.status(401).send({ error: 'Connect to one of the platforms first' })
      return
    }
    req.flash('alert', 'Connect to one of the platforms first')
    res.redirect('/')
    return
  }
  next()
}

export default requireLogin
