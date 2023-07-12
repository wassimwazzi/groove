import SpotifyWebApi from 'spotify-web-api-node';
import BaseAuthenticator from './base_authenticator.js';
import request from 'request'
import querystring from 'querystring'
import { clientId, clientSecret } from '../../config.js'

/**
 * Spotify Authenticator
*/
class SpotifyAuthenticator extends BaseAuthenticator {
  constructor() {
    super();
    // this._authenticator = new SpotifyWebApi({
    //     clientId: process.env.SPOTIFY_CLIENT_ID,
    //     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    //     redirectUri: 'http://localhost:3000/callback',
    // });
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = 'http://localhost:3000/callback?platform=spotify';
    this.stateKey = 'spotify_auth_state';
  }

  getPlatform() {
    return 'spotify';
  }

  isLoggedIn(req) {
    return req.session.accessToken && new Date(req.session.expiresAt) > new Date();
  }

  /**
   * Authenticate user
   * 
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} response
   * @memberof SpotifyAuthenticator
   */
  authenticate(req, res) {
    const state = this.generateRandomString(16);
    res.cookie(this.stateKey, state);

    // request authorization
    const scope = 'user-read-private user-read-email user-library-read';
    res.redirect(
      'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: this.clientId,
        scope,
        redirect_uri: this.redirectUri,
        state,
      }),
    );
  }

  /**
   * Callback for authentication
   * 
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} response
   * @memberof SpotifyAuthenticator
   */
  callback(req, res) {
    const code = req.query.code || null
    const state = req.query.state || null
    const storedState = req.cookies ? req.cookies[this.stateKey] : null

    if (state === null || state !== storedState) {
      res.redirect(
        '/' +
        querystring.stringify({
          error: 'state_mismatch',
        }),
      )
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
          Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        },
        json: true,
      }

      request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          const accessToken = body.access_token
          const refreshToken = body.refresh_token
          const expiresIn = body.expires_in
          req.session.accessToken = accessToken
          req.session.refreshToken = refreshToken
          req.session.expiresAt = new Date().getTime() + expiresIn * 1000

          res.redirect('/dashboard')
        } else {
          res.redirect('/dashboard')
        }
      })
    }
  }
}

export default SpotifyAuthenticator;
