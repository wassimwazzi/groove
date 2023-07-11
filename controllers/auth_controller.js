import request from 'request'
import querystring from 'querystring'
import { clientId, clientSecret } from '../config.js'

const stateKey = 'spotify_auth_state'
const redirectUri = 'http://localhost:3000/callback'

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

// app.get('/login', function(req, res) {
const login = function (req, res) {
  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  // request authorization
  const scope = 'user-read-private user-read-email user-library-read'
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope,
        redirect_uri: redirectUri,
        state,
      }),
  )
}

// app.get('/callback', function(req, res) {
const callback = function (req, res) {
  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        }),
    )
  } else {
    res.clearCookie(stateKey)
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri: redirectUri,
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
        req.session.expiresIn = expiresIn

        // we can also pass the token to the browser to make requests from there
        res.redirect('/dashboard')
      } else {
        res.redirect('/dashboard')
      }
    })
  }
}

export { login, callback }
