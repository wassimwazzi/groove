/**
 * Abstract class for authenticators
 *
 * @class BaseAuthenticator
 */
class BaseAuthenticator {
  constructor() {
    if (this.constructor === BaseAuthenticator) {
      throw new TypeError('Abstract class "BaseAuthenticator" cannot be instantiated directly.')
    }
    this.redirectUri = 'http://localhost:3000/callback?platform=' + this.getPlatform()
  }

  getPlatform() {
    throw new Error('Method "getPlatform()" must be implemented.')
  }

  /**
   * Check if user is logged in
   *
   * @param {Object} _req
   * @returns {boolean} true if user is logged in, false otherwise
   * @memberof BaseAuthenticator
   * @abstract
   */
  isLoggedIn(_req) {
    throw new Error('Method "isLoggedIn()" must be implemented.')
  }

  /**
   * Login user
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} response
   * @memberof BaseAuthenticator
   * @abstract
   */
  login(req, res) {
    if (this.isLoggedIn(req)) {
      console.log('User is already logged in')
      res.redirect('/dashboard?platform=' + this.getPlatform())
    } else {
      this.authenticate(req, res)
    }
  }

  /**
   * Authenticate user
   *
   * @param {Object} _req
   * @param {Object} _res
   * @returns {Object} response
   * @memberof BaseAuthenticator
   * @abstract
   */
  authenticate(_req, _res) {
    throw new Error('Method "authenticate()" must be implemented.')
  }

  /**
   * Callback for authentication
   *
   * @param {Object} _req
   * @param {Object} _res
   * @param {Function} _onSuccess
   * @param {Function} _onError
   * @returns {Object} response
   * @memberof BaseAuthenticator
   * @abstract
   */
  callback(_req, _res, _onSuccess, _onError) {
    throw new Error(this.getPlatform() + ' does not implement callback()')
  }

  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   * @memberof BaseAuthenticator
   */
  static generateRandomString(length) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }
}

export default BaseAuthenticator
