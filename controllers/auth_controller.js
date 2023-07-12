import PlatformManager from '../utils/platforms_manager.js'

const login = function (req, res) {
  const platform = req.query.platform
  const authenticator = PlatformManager.getAuthenticator(platform)
  authenticator.login(req, res)
}

const callback = function (req, res) {
  const platform = req.query.platform
  const authenticator = PlatformManager.getAuthenticator(platform)
  authenticator.callback(req, res)
}

export { login, callback }
