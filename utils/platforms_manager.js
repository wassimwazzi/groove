import SpotifyAuthenticator from './authenticators/spotify_authenticator.js'

/**
 * Class to manage platforms
 *
 */
class PlatformsManager {
  static authenticators = {
    spotify: SpotifyAuthenticator,
  }

  /**
   * get authenticator for platform.
   *
   * @param {string} platform
   * @returns {T extends BaseAuthenticator} authenticator
   * @memberof PlatformsManager
   */
  static getAuthenticator(platform) {
    return new PlatformsManager.authenticators[platform]()
  }

  /**
   * get all platforms that have been logged in.
   *
   * @param {Object} req
   * @returns {Array} platforms
   * @memberof PlatformsManager
   */
  static getLoggedInPlatforms(req) {
    return Object.keys(PlatformsManager.authenticators).filter((platform) => {
      const authenticator = PlatformsManager.getAuthenticator(platform)
      return authenticator.isLoggedIn(req)
    })
  }
}

export default PlatformsManager
