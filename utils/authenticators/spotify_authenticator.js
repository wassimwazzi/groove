// import SpotifyWebApi from 'spotify-web-api-node';
import BaseAuthenticator from './base_authenticator.js'
import fetch from 'node-fetch'
import querystring from 'querystring'
import { spotifyClientId, spotifyClientSecret } from '../../config.js'

/**
 * Spotify Authenticator
 */
class SpotifyAuthenticator extends BaseAuthenticator {
  constructor() {
    super()
    // this._authenticator = new SpotifyWebApi({
    //     spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    //     spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    //     redirectUri: 'http://localhost:3000/callback',
    // });
    this.spotifyClientId = spotifyClientId
    this.spotifyClientSecret = spotifyClientSecret
    this.stateKey = 'spotify_auth_state'
  }

  getPlatform() {
    return 'spotify'
  }

  isLoggedIn(req) {
    return !!(req.session.spotifyAccessToken && new Date(req.session.spotifyTokenExpiresAt) > new Date())
  }

  /**
   * Authenticate user
   *
   * @param {Object} _req
   * @param {Object} res
   * @returns {Object} response
   * @memberof SpotifyAuthenticator
   */
  authenticate(_req, res) {
    const state = BaseAuthenticator.generateRandomString(16)
    res.cookie(this.stateKey, state)

    // request authorization
    const scope = 'user-read-private user-read-email user-library-read'
    res.redirect(
      'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: this.spotifyClientId,
          scope,
          redirect_uri: this.redirectUri,
          state,
        }),
    )
  }

  /**
   * Callback for authentication
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} onSuccess
   * @param {Function} onError
   * @returns {Object} response
   * @memberof SpotifyAuthenticator
   */
  async callback(req, res, onSuccess, onError) {
    const code = req.query.code || null
    const state = req.query.state || null
    const storedState = req.cookies ? req.cookies[this.stateKey] : null

    if (state === null || state !== storedState) {
      onError('state_mismatch')
    } else {
      res.clearCookie(this.stateKey)
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code,
          redirect_uri: this.redirectUri,
          grant_type: 'authorization_code',
        },
        headers: {
          Authorization: 'Basic ' + Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }

      try {
        const response = await fetch(authOptions.url, {
          method: 'POST',
          headers: authOptions.headers,
          body: new URLSearchParams(authOptions.form).toString(),
        })
        const body = await response.json()
        if (!response.ok) {
          return onError(body.error)
        }
        const spotifyAccessToken = body.access_token
        const spotifyRefreshToken = body.refresh_token
        const expiresIn = body.expires_in
        req.session.spotifyAccessToken = spotifyAccessToken
        req.session.spotifyRefreshToken = spotifyRefreshToken
        req.session.spotifyTokenExpiresAt = new Date().getTime() + expiresIn * 1000

        onSuccess()
      } catch (error) {
        console.log(error)
        onError(error)
      }
    }
  }
}

export default SpotifyAuthenticator
