import PlatformManager from '../utils/platforms_manager.js'

const login = function (req, res) {
  const platform = req.query.platform
  const authenticator = PlatformManager.getAuthenticator(platform)
  authenticator.login(req, res)
}

const callback = function (req, res) {
  const platform = req.query.platform
  const authenticator = PlatformManager.getAuthenticator(platform)
  authenticator.callback(
    req,
    res,
    () => {
      req.flash('notice', 'Successfully logged in')
      res.redirect('/dashboard?platform=' + platform)
    },
    (error) => {
      req.flash('error', error)
      res.redirect('/')
    },
  )
}

export { login, callback }
