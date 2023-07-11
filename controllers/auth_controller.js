import request from "request";
import querystring from "querystring";
import { client_id, client_secret } from "../config.js";

const stateKey = 'spotify_auth_state';
const redirect_uri = "http://localhost:3000/callback";

/** 
* Generates a random string containing numbers and letters
* @param  {number} length The length of the string
* @return {string} The generated string
*/
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// app.get('/login', function(req, res) {
const login = function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // request authorization
  var scope = 'user-read-private user-read-email user-library-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
      }));
};

// app.get('/callback', function(req, res) {
const callback = function(req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
      res.redirect('/#' +
      querystring.stringify({
          error: 'state_mismatch'
      }));
  } else {
      res.clearCookie(stateKey);
      var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
      },
      headers: {
          'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
      };

      request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

          var access_token = body.access_token,
              refresh_token = body.refresh_token,
              expires_in = body.expires_in;
          console.log("setting storage")
          req.session.access_token = access_token;
          req.session.refresh_token = refresh_token;
          req.session.expires_in = expires_in;

          // we can also pass the token to the browser to make requests from there
          res.redirect('/dashboard');
      } else {
          res.redirect('/dashboard');
      }
      });
  }
};

export { login, callback }
