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
    this.spotifyClientId = spotifyClientId
    this.spotifyClientSecret = spotifyClientSecret
    this.stateKey = 'spotify_auth_state'
    this.redirectUri = `${this.url}/callback?platform=${this.getPlatform()}`
    this.requiredScopes = [
      // Spotify Connect
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      // Playback
      'streaming',
      'app-remote-control',
      // Playlists
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
      // Follow
      'user-follow-modify',
      'user-follow-read',
      // Users
      'user-read-private',
      'user-read-email',
      // Library
      'user-library-read',
    ]
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
    const scope = this.requiredScopes.join(' ')
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

  /**
   * Refresh session
   */
  async refreshSession(req) {
    const spotifyRefreshToken = req.session.spotifyRefreshToken
    if (!spotifyRefreshToken) {
      return false
    }
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'post',
      headers: {
        Authorization: 'Basic ' + Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: spotifyRefreshToken,
      }),
      json: true,
    })
    const data = await response.json()
    if (!response.ok) {
      console.log("Couldn't refresh session\n", data)
      return false
    }
    req.session.spotifyAccessToken = data.access_token
    req.session.spotifyTokenExpiresAt = new Date().getTime() + data.expires_in * 1000
    console.log('Session refreshed')
    return true
  }
}

export default SpotifyAuthenticator
