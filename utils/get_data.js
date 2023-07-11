import fetch from "node-fetch";
import { client_id, client_secret } from "../config.js";

export async function getNewToken(refresh_token) {
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

export async function getData(endpoint, req, retry = true) {
  const response = await fetch("https://api.spotify.com/v1" + endpoint, {
    method: "get",
    headers: {
      Authorization: "Bearer " + req.session.access_token,
    },
  });
  
  const data = await response.json();
  if (retry && data.error && data.error.status === 401) {
    const refreshData = await getNewToken(req.session.refresh_token);
    if (!refreshData.error) {
      req.session.access_token = refreshData.access_token;
      return getData(endpoint, req, false);
    } else {
      console.log("refresh token failed: ", refreshData)
    }
  }
  return data;
}