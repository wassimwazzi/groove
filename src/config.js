import dotenv from 'dotenv'
import toBoolean from 'to-boolean'

dotenv.config()

function valueOrError(key) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable ${key}`)
  }
  return value
}

export const spotifyClientId = valueOrError('SPOTIFY_CLIENT_ID')
export const spotifyClientSecret = valueOrError('SPOTIFY_CLIENT_SECRET')
export const port = valueOrError('PORT')
export const HTTP_SECURE = toBoolean(valueOrError('HTTP_SECURE'))
