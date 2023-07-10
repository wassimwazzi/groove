import express from "express";
import session from "express-session";
import fetch from "node-fetch";
import request from "request";
import { client_id, client_secret } from "./config.js";
import cors from "cors";
import querystring from "querystring";
import cookieParser from "cookie-parser";

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

const stateKey = 'spotify_auth_state';
 
const app = express();

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static('/public'))
  .use(cors())
  .use(cookieParser())
  .use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
  }));

const redirect_uri = "http://localhost:3000/callback";

app.get("/", function (req, res) {
  res.render("index");
});

 app.get('/login', function(req, res) {
 
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
 });

 app.get('/callback', function(req, res) {
 
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
          
          req.session.access_token = access_token;
          req.session.refresh_token = refresh_token;
          req.session.expires_in = expires_in;
 
         var options = {
           url: 'https://api.spotify.com/v1/me',
           headers: { 'Authorization': 'Bearer ' + access_token },
           json: true
         };
 
         // use the access token to access the Spotify Web API
         request.get(options, function(error, response, body) {
           console.log(body);
         });
 
         // we can also pass the token to the browser to make requests from there
         res.redirect('/dashboard');
       } else {
         res.redirect('/dashboard');
       }
     });
   }
 });

 async function refreshToken(refresh_token) {
  console.log("refresh token: ", refresh_token)
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'post',
    headers: { Authorization: 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }),
    json: true
  });
  const data = await response.json();
  console.log("refresh response: ", data);
  return data;
 }


 async function getData(endpoint, req, retry = true) {
  const response = await fetch("https://api.spotify.com/v1" + endpoint, {
    method: "get",
    headers: {
      Authorization: "Bearer " + req.session.access_token,
    },
  });
  
  const data = await response.json();
  if (retry && data.error && data.error.status === 401) {
    const refreshData = await refreshToken(req.session.refresh_token);
    if (!refreshData.error) {
      req.session.access_token = refreshData.access_token;
      return getData(endpoint, req, false);
    } else {
      console.log("refresh token failed: ", refreshData)
    }
  }
  return data;
}

app.get("/dashboard", async (req, res) => {

  const userInfo = await getData("/me", req);
  const tracks = await getData("/me/tracks?limit=10", req);

  res.render("dashboard", { user: userInfo, tracks: tracks.items });
});


let listener = app.listen(3000, function () {
  console.log(
    "Your app is listening on http://localhost:" + listener.address().port
  );
});
