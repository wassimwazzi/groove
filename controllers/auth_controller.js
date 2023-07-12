import SpotifyAuthenticator from "../utils/authenticators/spotify_authenticator.js"

const authenticators = {
  spotify: SpotifyAuthenticator,
}

const login = function (req, res) {
  const platform = req.query.platform
  const authenticator = new authenticators[platform]()
  authenticator.authenticate(req, res)
}

const callback = function (req, res) {
  const platform = req.query.platform
  const authenticator = new authenticators[platform]()
  authenticator.callback(req, res)
}

export { login, callback }
