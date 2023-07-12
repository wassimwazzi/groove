import SpotifyAuthenticator from '../../../utils/authenticators/spotify_authenticator.js'
import { expect } from 'chai'

describe('SpotifyAuthenticator', () => {
  describe('constructor', () => {
    it('should be callable', () => {
      const spotifyAuthenticator = new SpotifyAuthenticator()
      expect(spotifyAuthenticator).to.be.an.instanceOf(SpotifyAuthenticator)
    })
  })

  describe('getPlatform', () => {
    it('should return the platform', () => {
      const spotifyAuthenticator = new SpotifyAuthenticator()
      expect(spotifyAuthenticator.getPlatform()).to.equal('spotify')
    })
  })

  describe('isLoggedIn', () => {
    it('should return false when user is not logged in', () => {
      const spotifyAuthenticator = new SpotifyAuthenticator()
      const req = {
        session: {
          accessToken: null,
          expiresAt: null,
        },
      }
      expect(spotifyAuthenticator.isLoggedIn(req)).to.be.false // eslint-disable-line no-unused-expressions
    })

    it('should return true when user is logged in', () => {
      const spotifyAuthenticator = new SpotifyAuthenticator()
      const req = {
        session: {
          spotifyAccessToken: 'accessToken',
          spotifyTokenExpiresAt: new Date() + 3600 * 1000,
        },
      }
      expect(spotifyAuthenticator.isLoggedIn(req)).to.be.true // eslint-disable-line no-unused-expressions
    })
  })
})
