import SpotifyAuthenticator from '../../../utils/authenticators/spotify_authenticator.js'
import { expect } from 'chai'
import sinon from 'sinon'
import querystring from 'querystring'
import nock from 'nock'

const spotifyAuthenticator = new SpotifyAuthenticator()

describe('SpotifyAuthenticator', () => {
  describe('constructor', () => {
    it('should be callable', () => {
      expect(spotifyAuthenticator).to.be.an.instanceOf(SpotifyAuthenticator)
    })
  })

  describe('getPlatform', () => {
    it('should return the platform', () => {
      expect(spotifyAuthenticator.getPlatform()).to.equal('spotify')
    })
  })

  describe('isLoggedIn', () => {
    it('should return false when user is not logged in', () => {
      const req = {
        session: {
          accessToken: null,
          expiresAt: null,
        },
      }
      expect(spotifyAuthenticator.isLoggedIn(req)).to.be.false // eslint-disable-line no-unused-expressions
    })

    it('should return true when user is logged in', () => {
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

      // Call the authenticate method
      spotifyAuthenticator.authenticate({}, res)

      // Assert that the cookie is set with the correct parameters;
      sinon.assert.calledWith(res.cookie, spotifyAuthenticator.stateKey, sinon.match.string)

      // Assert that the redirect is called with the correct parameters
      sinon.assert.calledWith(
        res.redirect,
        sinon.match(
          'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
              response_type: 'code',
              client_id: spotifyAuthenticator.spotifyClientId,
              scope: spotifyAuthenticator.requiredScopes.join(' '),
              redirect_uri: spotifyAuthenticator.redirectUri,
              state: sinon.match.string,
            }),
        ),
      )
    })
  })

  describe('callback', () => {
    const spotifyAuthenticator = new SpotifyAuthenticator()
    const onSuccess = sinon.spy()
    const onError = sinon.spy()
    const nullStateReq = {
      query: {
        code: 'code',
        state: 'state',
      },
      cookies: {
        [spotifyAuthenticator.stateKey]: null,
      },
      session: {},
    }
    const withStateReq = {
      ...nullStateReq,
      cookies: {
        [spotifyAuthenticator.stateKey]: 'state',
      },
    }

    beforeEach(() => {
      onSuccess.resetHistory()
      onError.resetHistory()
    })

    it('calls onError when state is null', () => {
      // Create a mock response object
      const res = {
        redirect: sinon.spy(),
      }

      spotifyAuthenticator.callback(nullStateReq, res, onSuccess, onError)

      sinon.assert.notCalled(res.redirect)
      sinon.assert.calledOnce(onError)
      sinon.assert.calledWith(onError, 'state_mismatch')
      sinon.assert.notCalled(onSuccess)
    })

    it('calls onError when state is not equal to stored state', () => {
      const res = {
        redirect: sinon.spy(),
      }

      spotifyAuthenticator.callback(nullStateReq, res, onSuccess, onError)

      sinon.assert.notCalled(res.redirect)
      sinon.assert.calledOnce(onError)
      sinon.assert.calledWith(onError, 'state_mismatch')
      sinon.assert.notCalled(onSuccess)
    })

    it('calls onError when spotify returns an error', async () => {
      const res = {
        redirect: sinon.spy(),
        clearCookie: sinon.spy(),
      }

      const expectedResponse = {
        statusCode: 400,
        body: {
          error: 'error',
        },
      }

      nock('https://accounts.spotify.com').post('/api/token').reply(expectedResponse.statusCode, expectedResponse.body)

      await spotifyAuthenticator.callback(withStateReq, res, onSuccess, onError)

      sinon.assert.notCalled(res.redirect)
      sinon.assert.calledOnce(onError)
      sinon.assert.calledWith(onError, expectedResponse.body.error)
      sinon.assert.notCalled(onSuccess)
    })

    it('sets the tokens', async () => {
      const res = {
        redirect: sinon.spy(),
        clearCookie: sinon.spy(),
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

      await spotifyAuthenticator.callback(withStateReq, res, onSuccess, onError)

      sinon.assert.calledWith(res.clearCookie, spotifyAuthenticator.stateKey)

      expect(withStateReq.session.spotifyAccessToken).to.equal(expectedResponse.body.access_token)
      expect(withStateReq.session.spotifyRefreshToken).to.equal(expectedResponse.body.refresh_token)
      expect(withStateReq.session.spotifyTokenExpiresAt).to.be.a('number')

      sinon.assert.notCalled(res.redirect)
      sinon.assert.notCalled(onError)
      sinon.assert.calledOnce(onSuccess)
    })
  })
})
