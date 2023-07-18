import PlatformsManager from '../../utils/platforms_manager.js'
import NoAuthenticator from '../../utils/authenticators/no_authenticator.js'
import sinon from 'sinon'
import { expect } from 'chai'

describe('PlatformsManager', () => {
  class mockSpotifyAuthenticator {
    isLoggedIn() {}
  }

  class mockYoutubeAuthenticator {
    isLoggedIn() {}
  }

  class mockSpotifyCommunicator {}

  class mockYoutubeCommunicator {}

  const authenticators = {
    spotify: mockSpotifyAuthenticator,
    youtube: mockYoutubeAuthenticator,
  }

  const communicators = {
    spotify: mockSpotifyCommunicator,
    youtube: mockYoutubeCommunicator,
  }

  beforeEach(() => {
    sinon.stub(PlatformsManager, 'authenticators').value(authenticators)
    sinon.stub(PlatformsManager, 'communicators').value(communicators)
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('getAuthenticator', () => {
    it('should return the authenticator for the platform', () => {
      const authenticator = PlatformsManager.getAuthenticator('spotify')
      expect(authenticator).to.be.an.instanceof(mockSpotifyAuthenticator)
    })

    it('should return a NoAuthenticator if the platform is not supported', () => {
      const authenticator = PlatformsManager.getAuthenticator('not_supported')
      expect(authenticator).to.be.an.instanceof(NoAuthenticator)
    })
  })

  describe('getLoggedInPlatforms', () => {
    it('should return the platforms that have been logged in', () => {
      const req = {}
      const spotifyAuthenticator = new mockSpotifyAuthenticator()
      const youtubeAuthenticator = new mockYoutubeAuthenticator()
      sinon.stub(spotifyAuthenticator, 'isLoggedIn').returns(true)
      sinon.stub(youtubeAuthenticator, 'isLoggedIn').returns(false)
      const getAuthenticatorStub = sinon.stub(PlatformsManager, 'getAuthenticator')
      getAuthenticatorStub.withArgs('spotify').returns(spotifyAuthenticator)
      getAuthenticatorStub.withArgs('youtube').returns(youtubeAuthenticator)

      const getLoggedInPlatforms = PlatformsManager.getLoggedInPlatforms(req)
      expect(getLoggedInPlatforms).to.deep.equal(['spotify'])
    })
  })

  describe('getCommunicator', () => {
    it('should return the communicator for the platform', () => {
      const communicator = PlatformsManager.getCommunicator('spotify')
      expect(communicator).to.be.an.instanceof(mockSpotifyCommunicator)
    })
  })
})
