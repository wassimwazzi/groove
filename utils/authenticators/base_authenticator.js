/**
 * Abstract class for authenticators
 * 
 * @class BaseAuthenticator
 */
class BaseAuthenticator {
    constructor() {
      if (this.constructor === BaseAuthenticator) {
        throw new TypeError('Abstract class "BaseAuthenticator" cannot be instantiated directly.');
      }
      this.redirectUri = 'http://localhost:3000/callback?platform=' + this.getPlatform();
    }

    getPlatform() {
      throw new Error('Method "getPlatform()" must be implemented.');
    }

    /**
     * Authenticate user
     * 
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} response
     * @memberof BaseAuthenticator
     * @abstract
     */
    authenticate(req, res) {
      throw new Error('Method "authenticate()" must be implemented.');
    }

    /**
     * Callback for authentication
     * 
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} response
     * @memberof BaseAuthenticator
     * @abstract
     */
    callback(req, res) {
      throw new Error('Method "callback()" must be implemented.');
    }
    
    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     * @memberof BaseAuthenticator
     */
    generateRandomString(length) {
      let text = ''
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return text
    }
}

export default BaseAuthenticator;
