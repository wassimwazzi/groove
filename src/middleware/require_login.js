import PlatformsManager from '../utils/platforms_manager.js'

const requireLogin = async (req, res, next) => {
  const platform = req.query.platform
  const authenticator = PlatformsManager.getAuthenticator(platform)
  if (!authenticator.isLoggedIn(req) && !(await authenticator.refreshSession(req))) {
    console.log('not logged in')
    if (req.url.includes('api')) {
      res.status(401).send({ error: 'Please connect to the platform before continuing' })
      return
    }
    req.flash('alert', 'Please connect to the platform before continuing')
    res.redirect('/')
    return
  }
  next()
}

export default requireLogin
