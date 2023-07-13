import SpotifyAuthenticator from '../../../utils/authenticators/spotify_authenticator.js'
import { expect } from 'chai'
import sinon from 'sinon'
import querystring from 'querystring'
import nock from 'nock'

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
          spotifyTokenExpiresAt: new Date().getTime() + 3600 * 1000,
        },
      }
      expect(spotifyAuthenticator.isLoggedIn(req)).to.be.true // eslint-disable-line no-unused-expressions
    })
  })

  describe('authenticate', () => {
    it('should set the cookie and redirect with the correct parameters', () => {
      // Create a mock response object
      const res = {
        cookie: sinon.spy(),
        redirect: sinon.spy(),
      }

      // Create a new instance of BaseAuthenticator
      const authenticator = new SpotifyAuthenticator()

      // Call the authenticate method
      authenticator.authenticate({}, res)

      // Assert that the cookie is set with the correct parameters;
      sinon.assert.calledWith(res.cookie, authenticator.stateKey, sinon.match.string)

      // Assert that the redirect is called with the correct parameters
      sinon.assert.calledWith(
        res.redirect,
        sinon.match(
          'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
              response_type: 'code',
              client_id: authenticator.spotifyClientId,
              scope: 'user-read-private user-read-email user-library-read',
              redirect_uri: authenticator.redirectUri,
              state: sinon.match.string,
            }),
        ),
      )
    })
  })

  describe('callback', () => {
    it('redirects to home page when state is null', () => {
      // Create a mock response object
      const res = {
        redirect: sinon.spy(),
      }

      const authenticator = new SpotifyAuthenticator()

      const req = {
        query: {
          code: 'code',
          state: null,
        },
        cookies: {
          [authenticator.stateKey]: 'state',
        },
      }

      authenticator.callback(req, res)

      // Assert that the redirect is called with the correct parameters
      sinon.assert.calledWith(
        res.redirect,
        sinon.match(
          '/' +
            querystring.stringify({
              error: 'state_mismatch',
            }),
        ),
      )
    })

    it('redirects to home page when state is not equal to stored state', () => {
      const res = {
        redirect: sinon.spy(),
      }

      const authenticator = new SpotifyAuthenticator()

      const req = {
        query: {
          code: 'code',
          state: 'state',
        },
        cookies: {
          [authenticator.stateKey]: null,
        },
      }

      authenticator.callback(req, res)

      // Assert that the redirect is called with the correct parameters
      sinon.assert.calledWith(
        res.redirect,
        sinon.match(
          '/' +
            querystring.stringify({
              error: 'state_mismatch',
            }),
        ),
      )
    })

    it('sets the tokens', async () => {
      const res = {
        redirect: sinon.spy(),
        clearCookie: sinon.spy(),
      }

      const authenticator = new SpotifyAuthenticator()

      const req = {
        query: {
          code: 'code',
          state: 'state',
        },
        cookies: {
          [authenticator.stateKey]: 'state',
        },
        session: {},
      }

      const expectedResponse = {
        statusCode: 200,
        body: {
          access_token: 'accessToken',
          refresh_token: 'refreshToken',
          expires_in: 3600,
        },
      }

      nock('https://accounts.spotify.com').post('/api/token').reply(200, expectedResponse.body)

      await authenticator.callback(req, res)

      sinon.assert.calledWith(res.clearCookie, authenticator.stateKey)

      expect(req.session.spotifyAccessToken).to.equal(expectedResponse.body.access_token)
      expect(req.session.spotifyRefreshToken).to.equal(expectedResponse.body.refresh_token)
      expect(req.session.spotifyTokenExpiresAt).to.be.a('number')

      sinon.assert.calledWith(res.redirect, '/dashboard')
    })
  })
})
