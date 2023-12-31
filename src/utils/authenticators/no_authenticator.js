import BaseAuthenticator from './base_authenticator.js'

// Authenticator that does nothing
class NoAuthenticator extends BaseAuthenticator {
  getPlatform() {
    return 'no_platform'
  }

  isLoggedIn(_req) {
    return false
  }

  authenticate(req, res) {
    req.flash('alert', 'This platform is not yet supported')
    res.redirect('/')
  }

  callback(req, res, _onSuccess, _onError) {
    req.flash('alert', 'Connect to one of the platforms first')
    res.redirect('/')
  }

  refreshSession(_req, _res) {
    return false
  }
}

export default NoAuthenticator
