import fetch from 'node-fetch'
import { clientId, clientSecret } from '../config.js'

export async function getNewToken(refreshToken) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'post',
    headers: { Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64') },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    json: true,
  })
  const data = await response.json()
  return data
}

export async function getData(endpoint, req, retry = true) {
  const response = await fetch('https://api.spotify.com/v1' + endpoint, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + req.session.accessToken,
    },
  })

  const data = await response.json()
  if (retry && data.error && data.error.status === 401) {
    const refreshData = await getNewToken(req.session.refreshToken)
    if (!refreshData.error) {
      req.session.accessToken = refreshData.access_token
      return getData(endpoint, req, false)
    }
  }
  return data
}
