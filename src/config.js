import dotenv from 'dotenv'

// const Environment = {
//   Development: 'dev',
//   Production: 'prod',
// }

// const envs = {
//   [Environment.Development]: Environment.Development,
//   [Environment.Production]: Environment.Production,
// }

// const environment = envs[process.env.NODE_ENV || 'dev']

const environment = process.env.NODE_ENV || 'dev'
const envFilePath = `.env.${environment}`
dotenv.config({ path: envFilePath })

function valueOrError(value) {
  if (!value) {
    throw new Error(`Environment variable ${value} is missing`)
  }
  return value
}

export const spotifyClientId = valueOrError(process.env.SPOTIFY_CLIENT_ID)
export const spotifyClientSecret = valueOrError(process.env.SPOTIFY_CLIENT_SECRET)
export const port = valueOrError(process.env.PORT)
export const host = valueOrError(process.env.HOST)
export const HTTP_SECURE = valueOrError(process.env.HTTP_SECURE)
